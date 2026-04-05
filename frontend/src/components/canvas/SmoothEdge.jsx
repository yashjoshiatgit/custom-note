import React from 'react';
import { Path } from 'react-konva';

const SmoothEdge = ({ fromX, fromY, toX, toY }) => {
    const startX = fromX + 75; // center of 150 width node
    const startY = fromY + 60; // bottom of 60 height node
    const endX = toX + 75;     // center of target node
    const endY = toY;          // top of target node

    // Calculate a smooth vertical S-curve using cubic bezier
    const controlPointY = Math.max(Math.abs(endY - startY) / 2, 40);
    const path = `M ${startX} ${startY} C ${startX} ${startY + controlPointY}, ${endX} ${endY - controlPointY}, ${endX} ${endY}`;

    return (
        <Path
            data={path}
            stroke="#818cf8"
            strokeWidth={4}
            lineCap="round"
            lineJoin="round"
            shadowBlur={8}
            shadowColor="rgba(129, 140, 248, 0.4)"
            shadowOffset={{ x: 0, y: 3 }}
        />
    );
};

export default SmoothEdge;
