import React, { useState, useEffect, useRef } from 'react';
import { Stage, Layer, Text, Group, Rect, Transformer, Path } from 'react-konva';

const PremiumNode = ({ node, isSelected, onSelect, onDragEnd }) => {
    return (
        <Group
            id={node.id}
            x={node.x}
            y={node.y}
            draggable
            onClick={onSelect}
            onTap={onSelect}
            onDragEnd={(e) => {
                onDragEnd(node.id, e.target.x(), e.target.y());
            }}
        >
            {/* Main Premium Card */}
            <Rect
                width={150}
                height={60}
                fill={isSelected ? "#e0e7ff" : "#ffffff"}
                stroke={isSelected ? "#4f46e5" : "#cbd5e1"}
                strokeWidth={2}
                cornerRadius={14}
                shadowBlur={20}
                shadowColor="rgba(0,0,0,0.12)"
                shadowOffset={{ x: 0, y: 8 }}
            />
            {/* Subtle top subtle gloss/gradient effect */}
            <Rect
                width={150}
                height={20}
                fill="rgba(255,255,255,0.6)"
                cornerRadius={[14, 14, 0, 0]}
            />
            <Text
                text={node.text}
                fontSize={15}
                fontFamily="'Inter', sans-serif"
                fontStyle="600"
                fill={isSelected ? "#312e81" : "#334155"}
                width={150}
                height={60}
                align="center"
                verticalAlign="middle"
                padding={8}
            />
        </Group>
    );
};

const SmoothEdge = ({ fromX, fromY, toX, toY }) => {
    const startX = fromX + 75; // center of 150 width
    const startY = fromY + 60; // bottom of 60 height
    const endX = toX + 75;     // center of target
    const endY = toY;          // top of target

    // Calculate a smooth vertical S-curve using cubic bezier
    const path = `M ${startX} ${startY} C ${startX} ${startY + 40}, ${endX} ${endY - 40}, ${endX} ${endY}`;

    return (
        <Path
            data={path}
            stroke="#a5b4fc"
            strokeWidth={4}
            lineCap="round"
            lineJoin="round"
            shadowBlur={5}
            shadowColor="rgba(165,180,252,0.4)"
            shadowOffset={{ x: 0, y: 2 }}
        />
    );
};

const NoteEditorCanvas = ({ initialData, onSave }) => {
    const [nodes, setNodes] = useState([]);
    const [arrows, setArrows] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [scale, setScale] = useState(1);
    
    const stageRef = useRef(null);
    const transformerRef = useRef(null);
    const layerRef = useRef(null);

    // Initialize from backend JSON format
    useEffect(() => {
        if (initialData && initialData.nodes) {
            const dataNodes = initialData.nodes.filter(n => n.type === 'text');
            const dataArrows = initialData.nodes.filter(n => n.type === 'arrow');
            setNodes(dataNodes);
            setArrows(dataArrows);
        } else {
            setNodes([{ id: '1', type: 'text', x: 200, y: 200, text: 'Main Topic' }]);
        }
    }, [initialData]);

    // Handle transformer selection
    useEffect(() => {
        if (!selectedId || !transformerRef.current || !layerRef.current) return;

        const node = layerRef.current.findOne(`#${selectedId}`);
        if (node) {
            transformerRef.current.nodes([node]);
            transformerRef.current.getLayer().batchDraw();
        } else {
            transformerRef.current.nodes([]);
        }
    }, [selectedId]);

    const handleNodeDragEnd = (id, newX, newY) => {
        setNodes(nodes.map(node => (node.id === id ? { ...node, x: newX, y: newY } : node)));
    };

    const handleStageClick = (e) => {
        // Deselect if clicking on empty stage
        if (e.target === e.target.getStage()) {
            setSelectedId(null);
            if (transformerRef.current) {
                transformerRef.current.nodes([]);
            }
        }
    };

    const handleWheel = (e) => {
        e.evt.preventDefault();
        const scaleBy = 1.05;
        const stage = stageRef.current;
        const oldScale = stage.scaleX();

        const pointer = stage.getPointerPosition();

        const mousePointTo = {
            x: (pointer.x - stage.x()) / oldScale,
            y: (pointer.y - stage.y()) / oldScale,
        };

        const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
        setScale(newScale);

        stage.scale({ x: newScale, y: newScale });

        const newPos = {
            x: pointer.x - mousePointTo.x * newScale,
            y: pointer.y - mousePointTo.y * newScale,
        };
        stage.position(newPos);
    };

    const saveState = () => {
        onSave({
            nodes: [
                ...nodes.map(n => ({ ...n, type: 'text' })),
                ...arrows.map(a => ({ ...a, type: 'arrow' }))
            ]
        });
    };

    return (
        <div className="w-full h-full bg-slate-50 relative overflow-hidden ring-1 ring-slate-200">
            <div className="absolute top-4 right-4 z-10 flex gap-2">
                <button
                    onClick={() => {
                        const stage = stageRef.current;
                        stage.scale({ x: 1, y: 1 });
                        stage.position({ x: 0, y: 0 });
                        setScale(1);
                    }}
                    className="bg-white text-slate-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors shadow-sm ring-1 ring-slate-200"
                >
                    Reset View
                </button>
                <button
                    onClick={saveState}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
                >
                    Save Canvas
                </button>
            </div>

            <Stage
                width={window.innerWidth}
                height={window.innerHeight - 100}
                onMouseDown={handleStageClick}
                onTouchStart={handleStageClick}
                onWheel={handleWheel}
                draggable // allows panning the entire canvas
                ref={stageRef}
            >
                <Layer ref={layerRef}>
                    {/* Render Smooth Edges */}
                    {arrows.map((arrow, i) => {
                        const fromNode = nodes.find(n => n.id === arrow.from);
                        const toNode = nodes.find(n => n.id === arrow.to);
                        if (!fromNode || !toNode) return null;

                        return (
                            <SmoothEdge
                                key={`arrow-${i}`}
                                fromX={fromNode.x}
                                fromY={fromNode.y}
                                toX={toNode.x}
                                toY={toNode.y}
                            />
                        );
                    })}

                    {/* Render Text Nodes */}
                    {nodes.map((node) => (
                        <PremiumNode
                            key={node.id}
                            node={node}
                            isSelected={selectedId === node.id}
                            onSelect={() => setSelectedId(node.id)}
                            onDragEnd={handleNodeDragEnd}
                        />
                    ))}
                    
                    <Transformer 
                        ref={transformerRef} 
                        resizeEnabled={false} 
                        rotateEnabled={false}
                        borderStroke="#6366f1"
                        anchorStroke="#4f46e5"
                        anchorFill="#fff"
                        anchorSize={8}
                    />
                </Layer>
            </Stage>
        </div>
    );
};

export default NoteEditorCanvas;
