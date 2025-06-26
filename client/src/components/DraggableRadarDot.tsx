"use client";

import React, { useRef, useState } from "react";

export interface DraggableRadarDotProps {
    cx: number;
    cy: number;
    index: number;
    total: number;
    color: string;
    onChange: (nextValue: number) => void;
}

const getAngle = (idx: number, total: number): number =>
    (360 / total) * idx;

const THRESHOLD_SQ = 25;

export const DraggableRadarDot: React.FC<DraggableRadarDotProps> = ({
                                                                        index,
                                                                        total,
                                                                        color,
                                                                        onChange,
                                                                        ...circlePos
                                                                    }) => {
    const [dragging, setDragging] = useState(false);
    const [toggled, setToggled]   = useState(false);
    const [moved, setMoved]       = useState(false);
    const startPt = useRef<{ x: number; y: number } | null>(null);

    const pointerDown = (
        e: React.PointerEvent | React.MouseEvent | React.TouchEvent,
    ) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(true);
        setMoved(false);

        let sx: number | undefined, sy: number | undefined;
        if ("touches" in e && e.touches.length) {
            sx = e.touches[0].clientX;
            sy = e.touches[0].clientY;
        } else if ("clientX" in e) {
            sx = (e as React.MouseEvent).clientX;
            sy = (e as React.MouseEvent).clientY;
        }
        if (sx == null || sy == null) return;
        startPt.current = { x: sx, y: sy };

        const svg   = (e.target as SVGCircleElement).ownerSVGElement;
        if (!svg) return;
        const rect  = svg.getBoundingClientRect();
        const cX    = rect.width  / 2;
        const cY    = rect.height / 2;
        const ang   = ((getAngle(index, total) - 90) * Math.PI) / 180;
        const maxR  = Math.min(rect.width, rect.height) * 0.4;

        const move = (ev: MouseEvent | TouchEvent) => {
            let cx: number | undefined, cy: number | undefined;
            if (ev instanceof TouchEvent && ev.touches.length) {
                cx = ev.touches[0].clientX;
                cy = ev.touches[0].clientY;
            } else if (ev instanceof MouseEvent) {
                cx = ev.clientX;
                cy = ev.clientY;
            }
            if (cx == null || cy == null) return;

            if (startPt.current && !moved) {
                const dx = cx - startPt.current.x;
                const dy = cy - startPt.current.y;
                if (dx * dx + dy * dy > THRESHOLD_SQ) setMoved(true);
            }

            const svgX = cx - rect.left;
            const svgY = cy - rect.top;
            const vecX = svgX - cX;
            const vecY = svgY - cY;
            const dot  = vecX * Math.cos(ang) + vecY * Math.sin(ang);
            let value  = (dot / maxR) * 10;

            value = Math.max(1, Math.min(10, Math.round(value * 10) / 10));

            onChange(value);
        };

        const up = () => {
            setDragging(false);
            if (!moved) setToggled((p) => !p);
            startPt.current = null;
            document.removeEventListener("mousemove", move);
            document.removeEventListener("mouseup",   up);
            document.removeEventListener("touchmove", move);
            document.removeEventListener("touchend",  up);
        };

        document.addEventListener("mousemove", move);
        document.addEventListener("mouseup",   up);
        document.addEventListener("touchmove", move, { passive: false });
        document.addEventListener("touchend",  up);
    };

    return (
        <circle
            {...circlePos}
            r={dragging ? 8 : 7}
            fill={toggled ? "#000" : color}
            stroke="#fff"
            strokeWidth={3}
            style={{ cursor: dragging ? "grabbing" : "grab", transition: "r 0.12s" }}
            onMouseDown={pointerDown}
            onTouchStart={pointerDown}
            tabIndex={0}
        />
    );
};
