import React, { useRef, useEffect, useState } from 'react';
import { colors } from '../../styles/theme';

/**
 * GraphCanvas — reusable SVG coordinate grid
 *
 * Props:
 *   width, height       — SVG dimensions (default 500×400)
 *   xRange, yRange      — [min, max] for each axis
 *   functions           — [{ fn, color, label, dashed }]
 *   showGrid            — draw grid lines (default true)
 *   showAxes            — draw x/y axes (default true)
 *   markedPoints        — [{ x, y, label, color }]
 *   tangentAt           — { x, fn, color } — draw tangent line at x
 *   draggablePoint      — { initial, onChange } — draggable x-position
 *   secantPoints        — { x1, x2, fn, color } — draw secant line
 *   annotations         — [{ x, y, text, color }] — text labels on graph
 */
const GraphCanvas = ({
  width = 500,
  height = 400,
  xRange = [-5, 5],
  yRange = [-3, 8],
  functions = [],
  showGrid = true,
  showAxes = true,
  markedPoints = [],
  tangentAt = null,
  draggablePoint = null,
  secantPoints = null,
  annotations = [],
}) => {
  const svgRef = useRef(null);
  const [dragX, setDragX] = useState(draggablePoint?.initial ?? 0);

  // Coordinate transforms
  const toSvgX = (x) => ((x - xRange[0]) / (xRange[1] - xRange[0])) * width;
  const toSvgY = (y) => height - ((y - yRange[0]) / (yRange[1] - yRange[0])) * height;
  const toMathX = (svgX) => xRange[0] + (svgX / width) * (xRange[1] - xRange[0]);

  // Grid lines
  const gridLines = () => {
    const lines = [];
    const xStep = Math.ceil((xRange[1] - xRange[0]) / 10);
    const yStep = Math.ceil((yRange[1] - yRange[0]) / 8);
    for (let x = Math.ceil(xRange[0]); x <= xRange[1]; x += xStep) {
      lines.push(
        <line key={`gx${x}`} x1={toSvgX(x)} y1={0} x2={toSvgX(x)} y2={height}
          stroke={colors.gridLine} strokeWidth={0.5} />
      );
    }
    for (let y = Math.ceil(yRange[0]); y <= yRange[1]; y += yStep) {
      lines.push(
        <line key={`gy${y}`} x1={0} y1={toSvgY(y)} x2={width} y2={toSvgY(y)}
          stroke={colors.gridLine} strokeWidth={0.5} />
      );
    }
    return lines;
  };

  // Axis tick labels
  const tickLabels = () => {
    const labels = [];
    const xStep = Math.ceil((xRange[1] - xRange[0]) / 10);
    const yStep = Math.ceil((yRange[1] - yRange[0]) / 8);
    for (let x = Math.ceil(xRange[0]); x <= xRange[1]; x += xStep) {
      if (x !== 0) labels.push(
        <text key={`tx${x}`} x={toSvgX(x)} y={toSvgY(0) + 14}
          fill={colors.muted} fontSize={10} textAnchor="middle">{x}</text>
      );
    }
    for (let y = Math.ceil(yRange[0]); y <= yRange[1]; y += yStep) {
      if (y !== 0) labels.push(
        <text key={`ty${y}`} x={toSvgX(0) - 8} y={toSvgY(y) + 4}
          fill={colors.muted} fontSize={10} textAnchor="end">{y}</text>
      );
    }
    return labels;
  };

  // Build SVG path for a function
  const buildPath = (fn, color, dashed = false) => {
    const SAMPLES = 300;
    const points = [];
    for (let i = 0; i <= SAMPLES; i++) {
      const x = xRange[0] + (i / SAMPLES) * (xRange[1] - xRange[0]);
      try {
        const y = fn(x);
        if (isFinite(y) && y >= yRange[0] - 2 && y <= yRange[1] + 2) {
          points.push(`${i === 0 || points.length === 0 ? 'M' : 'L'} ${toSvgX(x)} ${toSvgY(y)}`);
        } else {
          if (points.length > 0) points.push('M'); // lift pen
        }
      } catch (e) {}
    }
    return (
      <path key={color + Math.random()}
        d={points.join(' ')}
        stroke={color}
        strokeWidth={2.5}
        fill="none"
        strokeDasharray={dashed ? '6 3' : undefined}
        strokeLinecap="round"
      />
    );
  };

  // Tangent line at a point
  const buildTangent = ({ x, fn, color }) => {
    const slope = (fn(x + 0.0001) - fn(x - 0.0001)) / 0.0002;
    const y0 = fn(x);
    const x1 = x - 1.5; const x2 = x + 1.5;
    return (
      <line
        x1={toSvgX(x1)} y1={toSvgY(y0 + slope * (x1 - x))}
        x2={toSvgX(x2)} y2={toSvgY(y0 + slope * (x2 - x))}
        stroke={color} strokeWidth={2} strokeDasharray="5 3"
      />
    );
  };

  // Secant line between two points
  const buildSecant = ({ x1, x2, fn, color }) => {
    const y1 = fn(x1); const y2 = fn(x2);
    return (
      <line
        x1={toSvgX(x1)} y1={toSvgY(y1)}
        x2={toSvgX(x2)} y2={toSvgY(y2)}
        stroke={color} strokeWidth={2} strokeDasharray="4 2"
      />
    );
  };

  // Drag handler
  const handleMouseMove = (e) => {
    if (!draggablePoint) return;
    const rect = svgRef.current.getBoundingClientRect();
    const svgX = e.clientX - rect.left;
    const mathX = Math.max(xRange[0], Math.min(xRange[1], toMathX(svgX)));
    setDragX(mathX);
    draggablePoint.onChange?.(mathX);
  };

  const currentDragX = draggablePoint ? dragX : null;

  return (
    <svg
      ref={svgRef}
      width={width} height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="graph-canvas"
      style={{ background: '#0d0d1a', borderRadius: 12, cursor: draggablePoint ? 'crosshair' : 'default' }}
      onMouseMove={draggablePoint ? handleMouseMove : undefined}
    >
      {/* Grid */}
      {showGrid && gridLines()}

      {/* Axes */}
      {showAxes && (
        <>
          <line x1={0} y1={toSvgY(0)} x2={width} y2={toSvgY(0)}
            stroke={colors.axisLine} strokeWidth={1.5} />
          <line x1={toSvgX(0)} y1={0} x2={toSvgX(0)} y2={height}
            stroke={colors.axisLine} strokeWidth={1.5} />
          {/* Axis labels */}
          <text x={width - 10} y={toSvgY(0) - 6} fill={colors.muted} fontSize={12}>x</text>
          <text x={toSvgX(0) + 6} y={14} fill={colors.muted} fontSize={12}>y</text>
          {tickLabels()}
        </>
      )}

      {/* Functions */}
      {functions.map(({ fn, color, dashed }, i) => buildPath(fn, color, dashed))}

      {/* Secant */}
      {secantPoints && buildSecant(secantPoints)}

      {/* Tangent */}
      {tangentAt && buildTangent(tangentAt)}

      {/* Draggable point */}
      {currentDragX !== null && functions[0] && (() => {
        const fn = functions[0].fn;
        const y = fn(currentDragX);
        if (!isFinite(y)) return null;
        return (
          <circle cx={toSvgX(currentDragX)} cy={toSvgY(y)} r={7}
            fill={colors.accent} stroke="white" strokeWidth={2} />
        );
      })()}

      {/* Marked points */}
      {markedPoints.map(({ x, y, label, color: c }, i) => (
        <g key={i}>
          <circle cx={toSvgX(x)} cy={toSvgY(y)} r={5}
            fill={c || colors.secondary} stroke="white" strokeWidth={1.5} />
          {label && (
            <text x={toSvgX(x) + 8} y={toSvgY(y) - 6}
              fill={c || colors.secondary} fontSize={11} fontWeight="500">{label}</text>
          )}
        </g>
      ))}

      {/* Text annotations */}
      {annotations.map(({ x, y, text, color: c }, i) => (
        <text key={i} x={toSvgX(x)} y={toSvgY(y)}
          fill={c || colors.text} fontSize={12}>{text}</text>
      ))}
    </svg>
  );
};

export default GraphCanvas;
