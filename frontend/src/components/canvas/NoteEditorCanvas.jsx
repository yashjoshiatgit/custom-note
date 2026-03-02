import React, { useState, useEffect, useRef } from 'react';
import { Stage, Layer, Text, Arrow, Group, Rect, Transformer } from 'react-konva';

const NoteEditorCanvas = ({ initialData, onSave }) => {
    const [nodes, setNodes] = useState([]);
    const [arrows, setArrows] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
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

    const handleDragMove = (e, id) => {
        const newNodes = nodes.map(node => {
            if (node.id === id) {
                return { ...node, x: e.target.x(), y: e.target.y() };
            }
            return node;
        });
        setNodes(newNodes);
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

    const handleNodeChange = (id, newAttrs) => {
        setNodes(nodes.map(node => (node.id === id ? { ...node, ...newAttrs } : node)));
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
            <div className="absolute top-4 right-4 z-10">
                <button
                    onClick={saveState}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
                >
                    Save Canvas
                </button>
            </div>

            <Stage
                width={window.innerWidth}
                height={window.innerHeight - 100} // rough height minus navbar
                onMouseDown={handleStageClick}
                onTouchStart={handleStageClick}
                ref={stageRef}
            >
                <Layer ref={layerRef}>
                    {/* Render Arrows */}
                    {arrows.map((arrow, i) => {
                        const fromNode = nodes.find(n => n.id === arrow.from);
                        const toNode = nodes.find(n => n.id === arrow.to);
                        if (!fromNode || !toNode) return null;

                        return (
                            <Arrow
                                key={`arrow-${i}`}
                                points={[
                                    fromNode.x + 50, fromNode.y + 20, // rough center mapping
                                    toNode.x - 10, toNode.y + 20
                                ]}
                                pointerLength={10}
                                pointerWidth={10}
                                fill="slate-400"
                                stroke="#94a3b8"
                                strokeWidth={2}
                                tension={0.3}
                            />
                        );
                    })}

                    {/* Render Text Nodes */}
                    {nodes.map((node) => (
                        <Group
                            key={node.id}
                            id={node.id}
                            x={node.x}
                            y={node.y}
                            draggable
                            onDragMove={(e) => handleDragMove(e, node.id)}
                            onClick={() => setSelectedId(node.id)}
                            onTap={() => setSelectedId(node.id)}
                            onTransformEnd={(e) => {
                                const group = e.target;
                                handleNodeChange(node.id, {
                                    x: group.x(),
                                    y: group.y()
                                });
                            }}
                        >
                            <Rect
                                width={120}
                                height={40}
                                fill={selectedId === node.id ? "#e0e7ff" : "white"}
                                stroke={selectedId === node.id ? "#6366f1" : "transparent"}
                                cornerRadius={8}
                                shadowBlur={10}
                                shadowColor="rgba(0,0,0,0.1)"
                                shadowOffset={{ x: 0, y: 4 }}
                            />
                            <Text
                                text={node.text}
                                fontSize={14}
                                fontFamily="Inter"
                                fill="#334155"
                                width={120}
                                height={40}
                                align="center"
                                verticalAlign="middle"
                            />
                        </Group>
                    ))}
                    <Transformer ref={transformerRef} resizeEnabled={false} rotateEnabled={false} />
                </Layer>
            </Stage>
        </div>
    );
};

export default NoteEditorCanvas;
