import React, { useState, useEffect, useRef } from 'react';
import { Stage, Layer, Transformer } from 'react-konva';
import PremiumNode from './PremiumNode';
import SmoothEdge from './SmoothEdge';

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
            setNodes([{ id: '1', type: 'text', x: window.innerWidth / 2 - 75, y: 150, text: 'Main Topic' }]);
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
        <div className="w-full h-full bg-slate-50 relative overflow-hidden canvas-area-step">
            <div className="absolute top-4 right-4 z-10 flex gap-3">
                <button
                    onClick={() => {
                        const stage = stageRef.current;
                        stage.scale({ x: 1, y: 1 });
                        stage.position({ x: 0, y: 0 });
                        setScale(1);
                    }}
                    className="bg-white/90 backdrop-blur-sm text-slate-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-white transition-all shadow-sm ring-1 ring-slate-200 hover:-translate-y-0.5"
                >
                    Reset View
                </button>
                <button
                    onClick={saveState}
                    className="save-canvas-step bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 hover:-translate-y-0.5 border border-transparent"
                >
                    Save Canvas
                </button>
            </div>

            {/* Premium background grid */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
                 style={{ backgroundImage: 'radial-gradient(#4f46e5 2px, transparent 2px)', backgroundSize: '40px 40px' }} />

            <Stage
                width={window.innerWidth}
                height={window.innerHeight - 80} // adjusted for header
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
                        borderStrokeWidth={2}
                        anchorStroke="#4f46e5"
                        anchorFill="#fff"
                        anchorSize={10}
                        anchorCornerRadius={5}
                    />
                </Layer>
            </Stage>
        </div>
    );
};

export default NoteEditorCanvas;
