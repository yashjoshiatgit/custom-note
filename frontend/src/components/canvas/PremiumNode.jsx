import React from 'react';
import { Group, Rect, Text } from 'react-konva';

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
                strokeWidth={isSelected ? 3 : 2}
                cornerRadius={14}
                shadowBlur={isSelected ? 25 : 20}
                shadowColor={isSelected ? "rgba(79, 70, 229, 0.2)" : "rgba(0,0,0,0.12)"}
                shadowOffset={{ x: 0, y: isSelected ? 12 : 8 }}
            />
            {/* Subtle top gloss/gradient effect */}
            <Rect
                width={150}
                height={20}
                fill="rgba(255,255,255,0.7)"
                cornerRadius={[14, 14, 0, 0]}
            />
            {/* Inner highlight for 3D effect */}
            <Rect
                width={146}
                height={56}
                x={2}
                y={2}
                stroke="rgba(255,255,255,0.8)"
                strokeWidth={1}
                cornerRadius={12}
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

export default PremiumNode;
