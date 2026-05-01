import React, { useState } from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import { motion } from 'framer-motion';
import { colors } from '../../styles/theme';
import QuizCard from '../shared/QuizCard';

// ── f(x) = (x²−1)/(x−1) — approaching x = 1 ─────────────────────────────────
function limitFn(x) {
  if (Math.abs(x - 1) < 0.00001) return null; // undefined at x=1
  return (x * x - 1) / (x - 1); // simplifies to x+1
}

// ── Table rows approaching x=1 ────────────────────────────────────────────────
const LEFT_ROWS = [
  { x: '0.5',   fx: '1.500' },
  { x: '0.9',   fx: '1.900' },
  { x: '0.99',  fx: '1.990' },
  { x: '0.999', fx: '1.999' },
];
const RIGHT_ROWS = [
  { x: '1.5',   fx: '2.500' },
  { x: '1.1',   fx: '2.100' },
  { x: '1.01',  fx: '2.010' },
  { x: '1.001', fx: '2.001' },
];

// ── Graph of f(x) = (x²−1)/(x−1) with hollow point at x=1 ───────────────────
const GW = 320, GH = 220;
const GXL = -0.5, GXR = 3, GYB = 0.5, GYT = 4;

function gSX(x) { return ((x - GXL) / (GXR - GXL)) * GW; }
function gSY(y) { return GH - ((y - GYB) / (GYT - GYB)) * GH; }

function LimitGraph({ highlightX }) {
  const pts = [];
  for (let i = 0; i <= 300; i++) {
    const x = GXL + (i / 300) * (GXR - GXL);
    if (Math.abs(x - 1) < 0.02) continue;
    const y = x + 1;
    if (y < GYB || y > GYT) continue;
    pts.push(`${pts.length === 0 ? 'M' : 'L'} ${gSX(x)} ${gSY(y)}`);
  }

  const hx = highlightX;
  const hy = hx !== null && Math.abs(hx - 1) > 0.005 ? hx + 1 : null;

  return (
    <svg width="100%" viewBox={`0 0 ${GW} ${GH}`}
      style={{ background: '#05050f', borderRadius: 12, display: 'block' }}>
      {/* Grid */}
      {[0, 1, 2, 3].map(x => (
        <line key={`gx${x}`} x1={gSX(x)} y1={0} x2={gSX(x)} y2={GH}
          stroke={x === 0 ? '#2d3748' : '#111827'} strokeWidth={x === 0 ? 1.5 : 0.5} />
      ))}
      {[1, 2, 3, 4].map(y => (
        <line key={`gy${y}`} x1={0} y1={gSY(y)} x2={GW} y2={gSY(y)}
          stroke={y === 0 ? '#2d3748' : '#111827'} strokeWidth={0.5} />
      ))}
      {/* Axes */}
      <line x1={gSX(0)} y1={0} x2={gSX(0)} y2={GH} stroke="#334155" strokeWidth={1.5} />
      <line x1={0} y1={gSY(0)} x2={GW} y2={gSY(0)} stroke="#334155" strokeWidth={1.5} />
      {/* Tick labels */}
      {[1, 2, 3].map(x => (
        <text key={`xl${x}`} x={gSX(x)} y={gSY(GYB) + 12} fill="#374151" fontSize={9} textAnchor="middle">{x}</text>
      ))}
      {[1, 2, 3].map(y => (
        <text key={`yl${y}`} x={gSX(0) - 5} y={gSY(y) + 3} fill="#374151" fontSize={9} textAnchor="end">{y}</text>
      ))}

      {/* Function line */}
      <path d={pts.join(' ')} stroke={colors.primary} strokeWidth={2.5} fill="none" strokeLinecap="round" />

      {/* Hollow circle at x=1, y=2 */}
      <circle cx={gSX(1)} cy={gSY(2)} r={6}
        fill="#05050f" stroke={colors.danger} strokeWidth={2} />

      {/* Limit line y=2 */}
      <line x1={gSX(GXL)} y1={gSY(2)} x2={gSX(GXR)} y2={gSY(2)}
        stroke={colors.accent} strokeWidth={1} strokeDasharray="5 3" opacity={0.5} />
      <text x={gSX(GXR) - 5} y={gSY(2) - 5} fill={colors.accent} fontSize={9} textAnchor="end">y→2</text>

      {/* Highlighted point */}
      {hy !== null && (
        <g>
          <circle cx={gSX(hx)} cy={gSY(hy)} r={5}
            fill={hx < 1 ? colors.secondary : colors.phase3} stroke="white" strokeWidth={1.5} />
          <line x1={gSX(hx)} y1={gSY(GYB)} x2={gSX(hx)} y2={gSY(hy)}
            stroke={hx < 1 ? colors.secondary : colors.phase3} strokeWidth={1} strokeDasharray="3 2" opacity={0.6} />
        </g>
      )}

      {/* Labels */}
      <text x={gSX(GXR) - 5} y={14} fill={colors.primary} fontSize={10} textAnchor="end">
        f(x) = (x²−1)/(x−1)
      </text>
      <text x={gSX(1) + 8} y={gSY(2) - 8} fill={colors.danger} fontSize={9}>hole!</text>
    </svg>
  );
}

// ── Exercise 19(E) limit problems ─────────────────────────────────────────────
const LIMIT_EXERCISES = [
  {
    source: 'Exercise 19(E) — Q1',
    question: 'Evaluate',
    latex: '\\lim_{x \\to -1} \\frac{(x-2)(x+5)}{x^2 - 5x + 6}',
    hint: 'Substitute x = −1 directly: check if denominator ≠ 0. x²−5x+6 at x=−1 is 1+5+6 = 12.',
    answer: <InlineMath math="\frac{(-3)(4)}{12} = -1" />,
    steps: [
      { label: 'Check substitution', content: <span>x = −1: denominator = 1+5+6 = 12 ≠ 0 ✓ Direct substitution works.</span> },
      { label: 'Numerator at x = −1', content: <BlockMath math="(−1−2)(−1+5) = (−3)(4) = −12" /> },
      { label: 'Result', content: <BlockMath math="\lim_{x \to -1} = \frac{-12}{12} = -1" />, highlight: true },
    ],
  },
  {
    source: 'Exercise 19(E) — Q3',
    question: 'Evaluate',
    latex: '\\lim_{x \\to 0} \\frac{(x+1)^5 - 1}{x}',
    hint: 'Use the standard result: lim(x→0) [(x+1)ⁿ − 1]/x = n. Here n = 5.',
    answer: <InlineMath math="5" />,
    steps: [
      { label: 'Standard result', content: <BlockMath math="\lim_{x \to 0} \frac{(1+x)^n - 1}{x} = n" /> },
      { label: 'Apply with n = 5', content: <BlockMath math="\lim_{x \to 0} \frac{(x+1)^5 - 1}{x} = 5" />, highlight: true },
    ],
  },
  {
    source: 'Exercise 19(E) — Q4',
    question: 'Evaluate',
    latex: '\\lim_{x \\to 0} \\frac{\\sin(px)}{x}',
    hint: 'Standard result: lim(x→0) sin(x)/x = 1. Multiply top and bottom by p.',
    answer: <InlineMath math="p" />,
    steps: [
      { label: 'Rewrite', content: <BlockMath math="\frac{\sin(px)}{x} = p \cdot \frac{\sin(px)}{px}" /> },
      { label: 'Standard result', content: <BlockMath math="\lim_{px \to 0} \frac{\sin(px)}{px} = 1" /> },
      { label: 'Result', content: <BlockMath math="\lim_{x \to 0} \frac{\sin(px)}{x} = p \cdot 1 = p" />, highlight: true },
    ],
  },
  {
    source: 'Exercise 19(E) — Q5',
    question: 'Evaluate',
    latex: '\\lim_{x \\to 1} \\frac{x^{1/2} - 1}{x^{1/4} - 1}',
    hint: 'Substitute t = x^(1/4), so x^(1/2) = t², x^(1/4) = t, and as x→1, t→1.',
    answer: <InlineMath math="2" />,
    steps: [
      { label: 'Substitution', content: <span>Let t = x^(1/4). Then x^(1/2) = t².</span> },
      { label: 'Rewrite', content: <BlockMath math="\lim_{t \to 1} \frac{t^2 - 1}{t - 1} = \lim_{t \to 1} \frac{(t-1)(t+1)}{t-1} = \lim_{t \to 1}(t+1)" /> },
      { label: 'Result', content: <BlockMath math="= 1 + 1 = 2" />, highlight: true },
    ],
  },
  {
    source: 'Exercise 19(E) — Q6',
    question: 'Evaluate',
    latex: '\\lim_{x \\to 0} \\frac{\\tan x}{x}',
    hint: 'Write tan x = sin x / cos x. Then use lim sin x/x = 1 and cos(0) = 1.',
    answer: <InlineMath math="1" />,
    steps: [
      { label: 'Rewrite', content: <BlockMath math="\frac{\tan x}{x} = \frac{\sin x}{x} \cdot \frac{1}{\cos x}" /> },
      { label: 'Apply limits', content: <BlockMath math="\lim_{x\to 0}\frac{\sin x}{x} = 1, \quad \lim_{x\to 0}\frac{1}{\cos x} = 1" /> },
      { label: 'Result', content: <BlockMath math="\lim_{x\to 0}\frac{\tan x}{x} = 1 \times 1 = 1" />, highlight: true },
    ],
  },
];

// ── Main component ────────────────────────────────────────────────────────────
export default function LimitsVisualiser() {
  const [tab, setTab] = useState('watch');
  const [rowsLeft, setRowsLeft] = useState(0);
  const [rowsRight, setRowsRight] = useState(0);
  const [sliderX, setSliderX] = useState(0.5);
  const [side, setSide] = useState('left');

  const sliderVal = side === 'left'
    ? 1 - (1 - sliderX) * 0.999
    : 1 + sliderX * 0.999;

  const fAtSlider = limitFn(sliderVal);
  const allRevealed = rowsLeft >= 4 && rowsRight >= 4;

  const revealNext = () => {
    if (rowsLeft < 4) setRowsLeft(r => r + 1);
    else if (rowsRight < 4) setRowsRight(r => r + 1);
  };

  return (
    <div style={{ maxWidth: 880, margin: '0 auto', padding: '28px 24px' }}>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, color: colors.phase1, fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>
          Topic 4 · Phase 1 — Foundations · XI §19.2, Ex 19(E)
        </div>
        <h1 style={{ margin: 0, fontSize: 30, color: colors.text, fontWeight: 800, letterSpacing: -0.5 }}>
          Limits: Getting Closer
        </h1>
        <p style={{ margin: '8px 0 0', color: colors.muted, fontSize: 15, lineHeight: 1.6 }}>
          A limit asks: what value does f(x) <em>approach</em> as x gets close to some number?
          The function might not even be defined there — but the limit still exists.
        </p>
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 28,
        background: 'rgba(255,255,255,0.04)', padding: 4, borderRadius: 10, width: 'fit-content' }}>
        {[
          { key: 'watch',     label: '▶ Watch' },
          { key: 'try',       label: '🧪 Try It' },
          { key: 'exercises', label: '📝 Exercises' },
        ].map(({ key, label }) => (
          <button key={key} onClick={() => setTab(key)} style={{
            padding: '8px 18px', borderRadius: 7, border: 'none',
            background: tab === key ? colors.phase1 : 'transparent',
            color: tab === key ? '#0f0e17' : colors.muted,
            fontWeight: tab === key ? 700 : 400,
            fontSize: 13, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
          }}>{label}</button>
        ))}
      </div>

      {/* ════════════ WATCH TAB ════════════ */}
      {tab === 'watch' && (
        <motion.div key="watch" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>

          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'flex-start' }}>

            {/* Graph */}
            <div style={{ flex: '1 1 280px', minWidth: 260 }}>
              <LimitGraph highlightX={null} />
              <div style={{ marginTop: 8, fontSize: 11, color: colors.muted, textAlign: 'center' }}>
                Graph of <InlineMath math="f(x) = \frac{x^2-1}{x-1}" /> — note the hole at x = 1
              </div>

              {/* Key limit results */}
              <div style={{
                marginTop: 16, background: `${colors.phase1}0e`,
                border: `1px solid ${colors.phase1}28`, borderRadius: 12, padding: 16,
              }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: colors.phase1,
                  textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12 }}>
                  Key Limits (needed later!)
                </div>
                {[
                  { latex: '\\lim_{x\\to 0}\\frac{\\sin x}{x} = 1', note: 'Fundamental trig limit' },
                  { latex: '\\lim_{x\\to 0}\\frac{\\tan x}{x} = 1', note: 'Follows from above' },
                ].map((item, i) => (
                  <div key={i} style={{
                    padding: '10px 14px', marginBottom: 8,
                    background: 'rgba(0,0,0,0.3)', borderRadius: 8,
                  }}>
                    <BlockMath math={item.latex} />
                    <div style={{ fontSize: 11, color: colors.muted, marginTop: 4 }}>{item.note}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Table */}
            <div style={{ flex: '1 1 320px', minWidth: 280 }}>
              <div style={{
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 14, overflow: 'hidden',
              }}>
                <div style={{
                  padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,0.07)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: colors.phase1,
                      textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 2 }}>
                      Values Table — XI §19.2
                    </div>
                    <InlineMath math="f(x) = \frac{x^2 - 1}{x - 1}, \quad x \to 1" />
                  </div>
                  <button
                    onClick={revealNext}
                    disabled={allRevealed}
                    style={{
                      padding: '7px 14px', borderRadius: 8, border: 'none',
                      background: allRevealed ? 'rgba(255,255,255,0.07)' : colors.phase1,
                      color: allRevealed ? colors.muted : '#0f0e17',
                      fontSize: 12, fontWeight: 700, cursor: allRevealed ? 'default' : 'pointer',
                      fontFamily: 'Inter, sans-serif',
                    }}>
                    {allRevealed ? '✓ All shown' : '+ Next row'}
                  </button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: 'rgba(255,255,255,0.04)' }}>
                        <th style={thStyle}>x (from left)</th>
                        <th style={thStyle}>f(x)</th>
                        <th style={thStyle}>x (from right)</th>
                        <th style={thStyle}>f(x)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[0, 1, 2, 3].map(i => (
                        <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                          <td style={{ ...tdStyle, color: colors.secondary }}>
                            {i < rowsLeft ? LEFT_ROWS[i].x : '...'}
                          </td>
                          <td style={{ ...tdStyle, color: i < rowsLeft ? colors.secondary : colors.muted }}>
                            {i < rowsLeft ? LEFT_ROWS[i].fx : '?'}
                          </td>
                          <td style={{ ...tdStyle, color: colors.phase3 }}>
                            {i < rowsRight ? RIGHT_ROWS[i].x : '...'}
                          </td>
                          <td style={{ ...tdStyle, color: i < rowsRight ? colors.phase3 : colors.muted }}>
                            {i < rowsRight ? RIGHT_ROWS[i].fx : '?'}
                          </td>
                        </tr>
                      ))}
                      <tr style={{ background: `${colors.accent}10` }}>
                        <td style={{ ...tdStyle, color: colors.accent, fontWeight: 700 }}>→ 1</td>
                        <td style={{ ...tdStyle, color: colors.accent, fontWeight: 700 }}>→ 2</td>
                        <td style={{ ...tdStyle, color: colors.accent, fontWeight: 700 }}>1 ←</td>
                        <td style={{ ...tdStyle, color: colors.accent, fontWeight: 700 }}>2 ←</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {allRevealed && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    style={{ padding: '12px 18px', background: `${colors.accent}10`,
                      borderTop: `1px solid ${colors.accent}25` }}>
                    <BlockMath math={"\\lim_{x \\to 1} \\frac{x^2 - 1}{x - 1} = 2"} />
                    <div style={{ fontSize: 12, color: colors.muted }}>
                      Even though f(1) is undefined, the limit exists and equals 2.
                      This is because (x²−1)/(x−1) = x+1 for all x ≠ 1, and x+1 → 2 as x → 1.
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Definition */}
              <div style={{
                marginTop: 16, padding: '16px 18px',
                background: `${colors.primary}0a`,
                border: `1px solid ${colors.primary}25`,
                borderRadius: 12,
              }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: colors.primary, marginBottom: 10 }}>
                  Definition of a Limit
                </div>
                <BlockMath math={"\\lim_{x \\to a} f(x) = L"} />
                <div style={{ fontSize: 12, color: colors.muted, marginTop: 6, lineHeight: 1.7 }}>
                  means: as x gets arbitrarily close to a (from either side),
                  f(x) gets arbitrarily close to L. f(a) need not exist!
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ════════════ TRY IT TAB ════════════ */}
      {tab === 'try' && (
        <motion.div key="try" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>

          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'flex-start' }}>

            {/* Graph with highlight */}
            <div style={{ flex: '1 1 280px', minWidth: 260 }}>
              <LimitGraph highlightX={sliderVal} />
              <div style={{ marginTop: 8, textAlign: 'center', fontSize: 11, color: colors.muted }}>
                Moving point approaches x = 1 from the {side}
              </div>
            </div>

            <div style={{ flex: '1 1 260px', minWidth: 240 }}>
              {/* Side selector */}
              <div style={{
                display: 'flex', gap: 8, marginBottom: 20,
                background: 'rgba(255,255,255,0.04)', padding: 4, borderRadius: 10,
              }}>
                {['left', 'right'].map(s => (
                  <button key={s} onClick={() => setSide(s)} style={{
                    flex: 1, padding: '8px 0', borderRadius: 7, border: 'none',
                    background: side === s
                      ? (s === 'left' ? colors.secondary : colors.phase3)
                      : 'transparent',
                    color: side === s ? '#0f0e17' : colors.muted,
                    fontWeight: side === s ? 700 : 400,
                    fontSize: 13, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                  }}>
                    From {s} {s === 'left' ? '→' : '←'}
                  </button>
                ))}
              </div>

              {/* Slider */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between',
                  fontSize: 12, color: colors.muted, marginBottom: 8 }}>
                  <span>{side === 'left' ? 'Far from 1' : 'Close to 1'}</span>
                  <span style={{ fontWeight: 700, color: side === 'left' ? colors.secondary : colors.phase3 }}>
                    x = {sliderVal.toFixed(4)}
                  </span>
                  <span>{side === 'left' ? 'Close to 1' : 'Far from 1'}</span>
                </div>
                <input type="range" min={0.001} max={0.999} step={0.001}
                  value={sliderX}
                  onChange={e => setSliderX(Number(e.target.value))}
                  style={{ width: '100%', accentColor: side === 'left' ? colors.secondary : colors.phase3 }}
                />
              </div>

              {/* Output display */}
              <div style={{
                background: 'rgba(0,0,0,0.4)',
                border: `2px solid ${colors.accent}40`,
                borderRadius: 14, padding: 20, textAlign: 'center', marginBottom: 16,
              }}>
                <div style={{ fontSize: 11, color: colors.muted,
                  textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>
                  f({sliderVal.toFixed(4)})
                </div>
                <div style={{ fontSize: 36, fontWeight: 900, color: colors.accent, lineHeight: 1,
                  fontFamily: "'JetBrains Mono', monospace", marginBottom: 6 }}>
                  {fAtSlider !== null ? fAtSlider.toFixed(6) : 'undefined'}
                </div>
                <div style={{ fontSize: 12, color: colors.muted }}>
                  approaching <strong style={{ color: colors.accent }}>2</strong>
                </div>
              </div>

              {/* Formula simplification */}
              <div style={{
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 12, padding: 16,
              }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: colors.phase1,
                  textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
                  Why does the limit = 2?
                </div>
                <BlockMath math={"\\frac{x^2-1}{x-1} = \\frac{(x-1)(x+1)}{x-1} = x+1 \\quad (x \\neq 1)"} />
                <div style={{ fontSize: 12, color: colors.muted, marginTop: 8 }}>
                  So as x → 1, f(x) → 1 + 1 = 2. The "hole" is filled by the limit!
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ════════════ EXERCISES TAB ════════════ */}
      {tab === 'exercises' && (
        <motion.div key="exercises" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>

          <div style={{ marginBottom: 20, padding: '12px 16px',
            background: `${colors.phase1}0e`, border: `1px solid ${colors.phase1}25`,
            borderRadius: 10, fontSize: 13, color: colors.muted }}>
            Limit problems from <strong style={{ color: colors.phase1 }}>Exercise 19(E), XI</strong> — try each one first!
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {LIMIT_EXERCISES.map((ex, i) => (
              <div key={i} style={{
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14,
                overflow: 'hidden', background: 'rgba(255,255,255,0.03)',
              }}>
                <LimitExercise ex={ex} />
              </div>
            ))}
          </div>

          {/* Quiz card */}
          <div style={{ marginTop: 24 }}>
            <QuizCard
              question={<span>Which of these equals <InlineMath math="\lim_{x\to 0} \frac{\sin(3x)}{x}" />?</span>}
              options={['1', '3', '0', '1/3']}
              correct={1}
              explanation="Write sin(3x)/x = 3 × sin(3x)/(3x). As x→0, sin(3x)/(3x)→1. So the limit = 3."
            />
          </div>
        </motion.div>
      )}
    </div>
  );
}

// ── Limit exercise panel ──────────────────────────────────────────────────────
function LimitExercise({ ex }) {
  const [mode, setMode] = useState(null);
  const [showHint, setShowHint] = useState(false);

  return (
    <>
      <div style={{
        padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8,
      }}>
        <div>
          <div style={{ fontSize: 13, color: colors.muted, marginBottom: 4 }}>{ex.source}</div>
          <div style={{ fontSize: 15, color: colors.text }}>
            {ex.question}: <InlineMath math={ex.latex} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => { setMode('try'); setShowHint(false); }}
            style={modeBtnStyle(mode === 'try', colors.accent)}>✏️ I'll Try</button>
          <button onClick={() => setMode('show')}
            style={modeBtnStyle(mode === 'show', colors.primary)}>👁 Show Me</button>
        </div>
      </div>

      {mode === 'try' && (
        <div style={{ padding: 20 }}>
          <div style={{ fontSize: 13, color: colors.muted, marginBottom: 12 }}>
            Work it out on paper — reveal hint if needed.
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => setShowHint(h => !h)}
              style={{ padding: '7px 14px', borderRadius: 8, border: `1px solid ${colors.secondary}40`,
                background: 'transparent', color: colors.secondary, fontSize: 12, cursor: 'pointer',
                fontFamily: 'Inter, sans-serif' }}>
              💡 {showHint ? 'Hide Hint' : 'Show Hint'}
            </button>
            <button onClick={() => setMode('show')}
              style={{ padding: '7px 14px', borderRadius: 8, border: 'none',
                background: `${colors.primary}20`, color: colors.primary, fontSize: 12, cursor: 'pointer',
                fontFamily: 'Inter, sans-serif' }}>
              Reveal →
            </button>
          </div>
          {showHint && (
            <div style={{ marginTop: 12, padding: '10px 14px',
              background: `${colors.secondary}08`, border: `1px dashed ${colors.secondary}30`,
              borderRadius: 8, color: colors.secondary, fontSize: 13 }}>
              💡 {ex.hint}
            </div>
          )}
        </div>
      )}

      {mode === 'show' && (
        <div style={{ padding: 20 }}>
          <div style={{ padding: '10px 16px', background: `${colors.accent}10`,
            border: `1px solid ${colors.accent}25`, borderRadius: 10, color: colors.accent,
            fontSize: 15, fontWeight: 500, marginBottom: 16 }}>
            ✓ Answer: {ex.answer}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {ex.steps.map((st, i) => (
              <div key={i} style={{
                padding: '10px 14px',
                background: st.highlight ? `${colors.primary}12` : 'rgba(255,255,255,0.03)',
                border: `1px solid ${st.highlight ? colors.primary : 'rgba(255,255,255,0.07)'}`,
                borderRadius: 8,
              }}>
                {st.label && <div style={{ fontSize: 11, color: colors.muted, marginBottom: 4,
                  textTransform: 'uppercase', letterSpacing: 1 }}>{i + 1}. {st.label}</div>}
                <div style={{ color: colors.text }}>{st.content}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

const modeBtnStyle = (active, col) => ({
  padding: '8px 16px', borderRadius: 8, border: 'none',
  background: active ? col : 'rgba(255,255,255,0.07)',
  color: active ? '#0f0e17' : colors.text,
  fontWeight: active ? 700 : 500,
  fontSize: 13, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
});

const thStyle = {
  padding: '10px 12px', textAlign: 'center',
  fontSize: 11, fontWeight: 700, color: colors.muted,
  textTransform: 'uppercase', letterSpacing: 0.8,
  borderBottom: '1px solid rgba(255,255,255,0.08)',
};

const tdStyle = {
  padding: '8px 12px', textAlign: 'center',
  fontSize: 12,
  fontFamily: "'JetBrains Mono', monospace",
  borderBottom: '1px solid rgba(255,255,255,0.04)',
};
