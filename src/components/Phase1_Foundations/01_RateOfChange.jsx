import React, { useState } from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import { motion, AnimatePresence } from 'framer-motion';
import { colors } from '../../styles/theme';
import TryItPanel from '../shared/TryItPanel';

// ── Textbook increment table (XI §19.1, y = x², x = 3) ───────────────────────
const TABLE_ROWS = [
  { dx: '0.1',   x_dx: '3.1',   y_dy: '9.61',     dy: '0.61',    ratio: '6.1' },
  { dx: '0.01',  x_dx: '3.01',  y_dy: '9.0601',   dy: '0.0601',  ratio: '6.01' },
  { dx: '0.001', x_dx: '3.001', y_dy: '9.006001', dy: '0.006001',ratio: '6.001' },
  { dx: 'h',     x_dx: '3+h',   y_dy: '9+6h+h²',  dy: '6h+h²',   ratio: '6+h' },
];

// ── Real-world scenarios ──────────────────────────────────────────────────────
const SCENARIOS = [
  {
    id: 'car',
    icon: '🚗',
    label: 'Car Speed',
    title: 'Distance vs Time',
    inputLabel: 'Time (hours)',
    outputLabel: 'Distance (km)',
    fn: t => 60 * t,
    rate: 60,
    rateLabel: '60 km/h',
    unit: 'km per hour',
    color: colors.primary,
    desc: 'For every extra hour driven, distance increases by 60 km.',
    tableX: [0, 1, 2, 3, 4],
  },
  {
    id: 'plant',
    icon: '🌱',
    label: 'Plant Growth',
    title: 'Height vs Days',
    inputLabel: 'Days',
    outputLabel: 'Height (cm)',
    fn: d => 2.5 * d,
    rate: 2.5,
    rateLabel: '2.5 cm/day',
    unit: 'cm per day',
    color: colors.accent,
    desc: 'For every extra day, the plant grows 2.5 cm.',
    tableX: [0, 1, 2, 3, 4],
  },
  {
    id: 'money',
    icon: '💰',
    label: 'Money Earned',
    title: 'Earnings vs Hours',
    inputLabel: 'Hours worked',
    outputLabel: 'Earnings (₹)',
    fn: h => 150 * h,
    rate: 150,
    rateLabel: '₹150/hr',
    unit: '₹ per hour',
    color: colors.secondary,
    desc: 'For every extra hour worked, you earn ₹150 more.',
    tableX: [0, 1, 2, 3, 4],
  },
];

// ── Mini bar chart ────────────────────────────────────────────────────────────
function MiniBarChart({ scenario }) {
  const maxVal = scenario.fn(4);
  const W = 280, H = 130, pad = 32;
  const bars = scenario.tableX.map(x => ({
    x, y: scenario.fn(x),
    sx: pad + x * ((W - pad * 1.5) / 4),
    h: (scenario.fn(x) / maxVal) * (H - 30),
  }));

  return (
    <svg width={W} height={H} style={{ display: 'block', margin: '0 auto' }}>
      {bars.map((b, i) => (
        <g key={i}>
          <rect
            x={b.sx - 18} y={H - 20 - b.h}
            width={36} height={b.h}
            fill={scenario.color} opacity={0.7 + i * 0.06}
            rx={4}
          />
          <text x={b.sx} y={H - 4} textAnchor="middle"
            fill={colors.muted} fontSize={10}>{b.x}</text>
          <text x={b.sx} y={H - 24 - b.h} textAnchor="middle"
            fill={scenario.color} fontSize={9} fontWeight="600">
            {b.y}
          </text>
        </g>
      ))}
      <text x={W / 2} y={H} textAnchor="middle"
        fill={colors.muted} fontSize={9}>{scenario.inputLabel}</text>
    </svg>
  );
}

// ── Increment table row (animated) ────────────────────────────────────────────
function IncrementRow({ row, revealed, i }) {
  if (!revealed) return null;
  const isLast = i === 3;
  return (
    <motion.tr
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: i * 0.12 }}
      style={{
        background: isLast ? `${colors.primary}15` : i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
      }}
    >
      {[row.dx, row.x_dx, row.y_dy, row.dy, row.ratio].map((cell, j) => (
        <td key={j} style={{
          padding: '8px 12px', textAlign: 'center',
          fontSize: isLast ? 13 : 12,
          fontWeight: isLast ? 700 : 400,
          color: j === 4 ? colors.accent : isLast ? colors.secondary : colors.text,
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          fontFamily: isLast ? 'Inter, sans-serif' : "'JetBrains Mono', monospace",
        }}>
          {isLast ? <InlineMath math={cell.replace('²', '^2')} /> : cell}
        </td>
      ))}
    </motion.tr>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function RateOfChange() {
  const [tab, setTab] = useState('watch');
  const [scenIdx, setScenIdx] = useState(0);
  const [tableRevealed, setTableRevealed] = useState(0);
  const [hours, setHours] = useState(3);
  const sc = SCENARIOS[scenIdx];

  const earnings = 150 * hours;
  const prevEarnings = 150 * (hours - 1);
  const rate = 150;

  return (
    <div style={{ maxWidth: 880, margin: '0 auto', padding: '28px 24px' }}>

      {/* ── Header ── */}
      <div style={{ marginBottom: 28 }}>
        <div style={{
          fontSize: 11, color: colors.phase1, fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8,
        }}>
          Topic 1 · Phase 1 — Foundations · XI §19.1
        </div>
        <h1 style={{ margin: 0, fontSize: 30, color: colors.text, fontWeight: 800, letterSpacing: -0.5 }}>
          Rate of Change &amp; Increments
        </h1>
        <p style={{ margin: '8px 0 0', color: colors.muted, fontSize: 15, lineHeight: 1.6 }}>
          How fast does one thing change when another changes? That question is the heart of Differentiation.
        </p>
      </div>

      {/* ── Tab bar ── */}
      <div style={{
        display: 'flex', gap: 4, marginBottom: 28,
        background: 'rgba(255,255,255,0.04)', padding: 4,
        borderRadius: 10, width: 'fit-content',
      }}>
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
          }}>
            {label}
          </button>
        ))}
      </div>

      {/* ════════════ WATCH TAB ════════════ */}
      {tab === 'watch' && (
        <motion.div key="watch"
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}>

          {/* Scenario selector */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
            {SCENARIOS.map((s, i) => (
              <button key={s.id} onClick={() => { setScenIdx(i); setTableRevealed(0); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '9px 18px', borderRadius: 9,
                  border: `1px solid ${scenIdx === i ? s.color : 'rgba(255,255,255,0.1)'}`,
                  background: scenIdx === i ? `${s.color}18` : 'transparent',
                  color: scenIdx === i ? s.color : colors.muted,
                  fontSize: 13, fontWeight: scenIdx === i ? 700 : 400,
                  cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                }}>
                <span style={{ fontSize: 18 }}>{s.icon}</span>
                {s.label}
              </button>
            ))}
          </div>

          {/* Main content */}
          <AnimatePresence mode="wait">
            <motion.div key={scenIdx}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.25 }}>

              <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'flex-start' }}>

                {/* Left: chart + scenario */}
                <div style={{ flex: '1 1 280px', minWidth: 260 }}>
                  <div style={{
                    background: 'rgba(0,0,0,0.35)',
                    border: `1px solid ${sc.color}30`,
                    borderRadius: 14, padding: 20, marginBottom: 16,
                  }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: sc.color, marginBottom: 4 }}>
                      {sc.icon} {sc.title}
                    </div>
                    <MiniBarChart scenario={sc} />
                    <div style={{
                      marginTop: 12, fontSize: 12, color: colors.muted,
                      lineHeight: 1.65, textAlign: 'center',
                    }}>
                      {sc.desc}
                    </div>
                  </div>

                  {/* Rate badge */}
                  <div style={{
                    background: `${sc.color}12`,
                    border: `1px solid ${sc.color}35`,
                    borderRadius: 12, padding: '14px 18px', textAlign: 'center',
                  }}>
                    <div style={{ fontSize: 11, color: sc.color, fontWeight: 700,
                      textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 6 }}>
                      Rate of Change
                    </div>
                    <div style={{ fontSize: 28, fontWeight: 900, color: sc.color,
                      fontFamily: "'JetBrains Mono', monospace", marginBottom: 4 }}>
                      {sc.rateLabel}
                    </div>
                    <div style={{ fontSize: 12, color: colors.muted }}>
                      Output changes by {sc.rateLabel.split(' ')[0]} for every 1 unit increase in input
                    </div>
                  </div>
                </div>

                {/* Right: increment table */}
                <div style={{ flex: '1 1 340px', minWidth: 300 }}>
                  <div style={{
                    background: 'rgba(0,0,0,0.3)',
                    border: `1px solid rgba(255,255,255,0.08)`,
                    borderRadius: 14, overflow: 'hidden',
                  }}>
                    <div style={{
                      padding: '14px 18px',
                      borderBottom: '1px solid rgba(255,255,255,0.07)',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    }}>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: colors.phase1,
                          textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 2 }}>
                          Textbook Table (XI §19.1)
                        </div>
                        <div style={{ fontSize: 12, color: colors.muted }}>
                          y = x², starting at x = 3
                        </div>
                      </div>
                      <button
                        onClick={() => setTableRevealed(r => Math.min(r + 1, TABLE_ROWS.length))}
                        disabled={tableRevealed >= TABLE_ROWS.length}
                        style={{
                          padding: '7px 14px', borderRadius: 8, border: 'none',
                          background: tableRevealed >= TABLE_ROWS.length
                            ? 'rgba(255,255,255,0.07)' : colors.phase1,
                          color: tableRevealed >= TABLE_ROWS.length ? colors.muted : '#0f0e17',
                          fontSize: 12, fontWeight: 700, cursor: tableRevealed >= TABLE_ROWS.length ? 'default' : 'pointer',
                          fontFamily: 'Inter, sans-serif',
                        }}>
                        {tableRevealed >= TABLE_ROWS.length ? '✓ All shown' : '+ Next row'}
                      </button>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ background: 'rgba(255,255,255,0.04)' }}>
                            {['δx', 'x + δx', 'y + δy', 'δy', 'δy/δx'].map((h, i) => (
                              <th key={i} style={{
                                padding: '10px 12px', textAlign: 'center',
                                fontSize: 11, fontWeight: 700, color: colors.phase1,
                                textTransform: 'uppercase', letterSpacing: 1,
                                borderBottom: '1px solid rgba(255,255,255,0.08)',
                              }}>
                                <InlineMath math={h === 'δy/δx' ? '\\delta y/\\delta x' : h === 'δx' ? '\\delta x' : h === 'x + δx' ? 'x + \\delta x' : h === 'y + δy' ? 'y + \\delta y' : '\\delta y'} />
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {TABLE_ROWS.map((row, i) => (
                            <IncrementRow key={i} row={row} revealed={i < tableRevealed} i={i} />
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {tableRevealed >= TABLE_ROWS.length && (
                      <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        style={{
                          padding: '12px 18px',
                          background: `${colors.accent}10`,
                          borderTop: `1px solid ${colors.accent}25`,
                        }}>
                        <div style={{ fontSize: 12, color: colors.accent, fontWeight: 600, marginBottom: 4 }}>
                          As δx → 0, the ratio δy/δx → 6
                        </div>
                        <div style={{ fontSize: 12, color: colors.muted }}>
                          So <InlineMath math="\frac{dy}{dx}\bigg|_{x=3} = 6" /> — the derivative at x = 3 is 6.
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Unified message */}
                  <div style={{
                    marginTop: 16,
                    padding: '14px 18px',
                    background: `${colors.primary}0e`,
                    border: `1px solid ${colors.primary}25`,
                    borderRadius: 12,
                  }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: colors.primary, marginBottom: 8 }}>
                      The Big Idea
                    </div>
                    <BlockMath math={"\\text{Rate of Change} = \\frac{\\delta y}{\\delta x} = \\frac{\\text{change in output}}{\\text{change in input}}"} />
                    <div style={{ fontSize: 12, color: colors.muted, marginTop: 8 }}>
                      As the increment δx → 0, this ratio approaches the <strong style={{ color: colors.text }}>derivative</strong> dy/dx.
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Key insight */}
          <div style={{
            marginTop: 24, padding: '16px 20px',
            background: `${colors.primary}08`,
            border: `1px solid ${colors.primary}20`,
            borderRadius: 12,
            display: 'flex', alignItems: 'flex-start', gap: 12,
          }}>
            <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>💡</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: colors.primary, marginBottom: 4 }}>
                Why this connects to Topic 2 (Slope of a Line)
              </div>
              <div style={{ fontSize: 13, color: colors.text, lineHeight: 1.75 }}>
                Rate of change = slope! For a linear function, the rate is <em>constant</em> (same slope everywhere).
                For curved functions, the rate <em>changes</em> — and that's exactly what differentiation measures.
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ════════════ TRY IT TAB ════════════ */}
      {tab === 'try' && (
        <motion.div key="try"
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}>

          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'flex-start' }}>

            {/* Slider panel */}
            <div style={{ flex: '1 1 300px', minWidth: 280 }}>
              <div style={{
                background: 'rgba(0,0,0,0.35)',
                border: `1px solid ${colors.secondary}30`,
                borderRadius: 14, padding: 24,
              }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: colors.secondary, marginBottom: 20 }}>
                  💰 Earnings Playground
                </div>

                <div style={{ marginBottom: 20 }}>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    fontSize: 13, color: colors.muted, marginBottom: 8,
                  }}>
                    <span>Hours worked</span>
                    <span style={{ color: colors.secondary, fontWeight: 700 }}>{hours} hrs</span>
                  </div>
                  <input
                    type="range" min={1} max={10} value={hours}
                    onChange={e => setHours(Number(e.target.value))}
                    style={{ width: '100%', accentColor: colors.secondary }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between',
                    fontSize: 10, color: colors.muted, marginTop: 4 }}>
                    <span>1 hr</span><span>10 hrs</span>
                  </div>
                </div>

                {/* Output display */}
                <div style={{
                  background: `${colors.secondary}10`,
                  border: `1px solid ${colors.secondary}30`,
                  borderRadius: 12, padding: 18, textAlign: 'center', marginBottom: 16,
                }}>
                  <div style={{ fontSize: 11, color: colors.secondary, fontWeight: 700,
                    textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 }}>
                    Total Earnings
                  </div>
                  <div style={{ fontSize: 42, fontWeight: 900, color: colors.secondary,
                    fontFamily: "'JetBrains Mono', monospace" }}>
                    ₹{earnings}
                  </div>
                  <div style={{ fontSize: 12, color: colors.muted, marginTop: 6 }}>
                    = 150 × {hours}
                  </div>
                </div>

                {/* Increment display */}
                <div style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 12, overflow: 'hidden',
                }}>
                  {[
                    { label: 'Previous (h−1 hrs)', val: `₹${prevEarnings}`, col: colors.muted },
                    { label: 'Current (h hrs)',    val: `₹${earnings}`,     col: colors.secondary },
                    { label: 'δy (change in earnings)', val: `₹${earnings - prevEarnings}`, col: colors.accent },
                    { label: 'δx (change in hours)',    val: '1 hr',          col: colors.primary },
                    { label: 'Rate δy/δx',              val: `₹${rate}/hr`,   col: colors.secondary },
                  ].map((row, i) => (
                    <div key={i} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '9px 14px',
                      borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                    }}>
                      <span style={{ fontSize: 12, color: colors.muted }}>{row.label}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: row.col,
                        fontFamily: "'JetBrains Mono', monospace" }}>
                        {row.val}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: visual bar + formula */}
            <div style={{ flex: '1 1 280px', minWidth: 260 }}>

              {/* Bar visualization */}
              <div style={{
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 14, padding: 20, marginBottom: 16,
              }}>
                <div style={{ fontSize: 12, color: colors.muted, marginBottom: 12 }}>
                  Earnings bar — each unit = ₹150
                </div>
                <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height: 120 }}>
                  {Array.from({ length: hours }, (_, i) => (
                    <motion.div key={i}
                      initial={{ height: 0 }} animate={{ height: `${(i + 1) * (110 / 10)}px` }}
                      transition={{ delay: i * 0.04 }}
                      style={{
                        flex: 1,
                        background: `${colors.secondary}${i < hours - 1 ? '70' : 'ff'}`,
                        borderRadius: '4px 4px 0 0',
                        minWidth: 8,
                      }}
                    />
                  ))}
                </div>
                <div style={{ fontSize: 11, color: colors.muted, marginTop: 8, textAlign: 'center' }}>
                  Last bar (highlighted) = the increment δy = ₹{rate}
                </div>
              </div>

              {/* Formula card */}
              <div style={{
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 14, padding: 20,
              }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: colors.phase1,
                  textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 14 }}>
                  Increment Notation (XI §19.1)
                </div>
                <BlockMath math={"\\frac{\\delta y}{\\delta x} = \\frac{f(x + \\delta x) - f(x)}{\\delta x}"} />
                <div style={{ fontSize: 12, color: colors.muted, marginTop: 12, lineHeight: 1.7 }}>
                  As <InlineMath math="\delta x \to 0" />, the ratio becomes the <strong style={{ color: colors.text }}>
                    derivative</strong> <InlineMath math="\frac{dy}{dx}" />.
                </div>
                <div style={{
                  marginTop: 14, padding: '10px 14px',
                  background: `${colors.accent}10`,
                  border: `1px solid ${colors.accent}25`,
                  borderRadius: 8,
                  fontSize: 12, color: colors.accent,
                }}>
                  For f(x) = 150x (your earnings), the rate is always 150 — constant slope!
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ════════════ EXERCISES TAB ════════════ */}
      {tab === 'exercises' && (
        <motion.div key="exercises"
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}>

          <div style={{ marginBottom: 20, padding: '12px 16px',
            background: `${colors.phase1}0e`, border: `1px solid ${colors.phase1}25`,
            borderRadius: 10, fontSize: 13, color: colors.muted }}>
            These are the exact increment problems from <strong style={{ color: colors.phase1 }}>
              Exercise 19(A), XI §19.1</strong> — try each one on paper first!
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Worked example from textbook: y = x², x = 3 */}
            <TryItPanel
              source="Textbook Worked Example — XI §19.1"
              problem="Fill the increment table for y = x² at x = 3. What is δy/δx as δx → 0?"
              hint="Substitute x = 3, x+δx = 3+h into y = x². Then δy = (3+h)² − 9 = 6h + h². Divide by h."
              answer={<span>As δx → 0, δy/δx → <InlineMath math="6" />. So <InlineMath math="\frac{dy}{dx}\big|_{x=3} = 6" /></span>}
              steps={[
                {
                  label: 'Step 1 — Set up',
                  content: <span>Let y = x². At x = 3: y = 9. At x = 3 + h: y + δy = (3+h)²</span>,
                },
                {
                  label: 'Step 2 — Expand',
                  content: <BlockMath math={"y + \\delta y = (3+h)^2 = 9 + 6h + h^2"} />,
                },
                {
                  label: 'Step 3 — Find δy',
                  content: <BlockMath math={"\\delta y = (9 + 6h + h^2) - 9 = 6h + h^2"} />,
                },
                {
                  label: 'Step 4 — Divide by δx = h',
                  content: <BlockMath math={"\\frac{\\delta y}{\\delta x} = \\frac{6h + h^2}{h} = 6 + h"} />,
                },
                {
                  label: 'Step 5 — Take limit',
                  content: <BlockMath math={"\\lim_{h \\to 0} (6 + h) = 6"} />,
                  highlight: true,
                },
              ]}
            />

            <TryItPanel
              source="Exercise 19(A) — Q1"
              problem="Find dy/dx from first principles for y = x²"
              hint="Use the same method: f(x+h) = (x+h)², expand, subtract f(x) = x², divide by h, then h→0."
              answer={<InlineMath math="\frac{dy}{dx} = 2x" />}
              steps={[
                { label: 'Let', content: <BlockMath math={"y = x^2, \\quad y + \\delta y = (x+h)^2 = x^2 + 2xh + h^2"} /> },
                { label: 'δy', content: <BlockMath math={"\\delta y = 2xh + h^2"} /> },
                { label: 'Ratio', content: <BlockMath math={"\\frac{\\delta y}{h} = 2x + h"} /> },
                { label: 'Limit', content: <BlockMath math={"\\frac{dy}{dx} = \\lim_{h\\to 0}(2x+h) = 2x"} />, highlight: true },
              ]}
            />

            <TryItPanel
              source="Exercise 19(A) — Q2"
              problem="Find dy/dx from first principles for y = 2(x − 1)"
              hint="This is a linear function. f(x+h) = 2(x+h−1). Subtract f(x) = 2(x−1), divide by h."
              answer={<InlineMath math="\frac{dy}{dx} = 2" />}
              steps={[
                { label: 'Setup', content: <BlockMath math={"y + \\delta y = 2(x+h-1) = 2x - 2 + 2h"} /> },
                { label: 'δy', content: <BlockMath math={"\\delta y = 2h"} /> },
                { label: 'Ratio then limit', content: <BlockMath math={"\\frac{\\delta y}{h} = 2 \\xrightarrow{h\\to 0} 2"} />, highlight: true },
              ]}
            />

            <TryItPanel
              source="Exercise 19(A) — Q3"
              problem="Find dy/dx from first principles for y = x³"
              hint="Expand (x+h)³ = x³ + 3x²h + 3xh² + h³. Subtract x³. Divide by h. Let h→0."
              answer={<InlineMath math="\frac{dy}{dx} = 3x^2" />}
              steps={[
                { label: 'Expand', content: <BlockMath math={"(x+h)^3 = x^3 + 3x^2h + 3xh^2 + h^3"} /> },
                { label: 'δy', content: <BlockMath math={"\\delta y = 3x^2 h + 3xh^2 + h^3"} /> },
                { label: 'Ratio', content: <BlockMath math={"\\frac{\\delta y}{h} = 3x^2 + 3xh + h^2"} /> },
                { label: 'Limit', content: <BlockMath math={"\\frac{dy}{dx} = 3x^2"} />, highlight: true },
              ]}
            />

            <TryItPanel
              source="Exercise 19(A) — Q9"
              problem="Find dy/dx from first principles for y = 1/x"
              hint="f(x+h) = 1/(x+h). Then δy = 1/(x+h) − 1/x. Combine fractions, divide by h, let h→0."
              answer={<InlineMath math="\frac{dy}{dx} = -\frac{1}{x^2}" />}
              steps={[
                { label: 'δy', content: <BlockMath math={"\\delta y = \\frac{1}{x+h} - \\frac{1}{x} = \\frac{x - (x+h)}{x(x+h)} = \\frac{-h}{x(x+h)}"} /> },
                { label: 'Ratio', content: <BlockMath math={"\\frac{\\delta y}{h} = \\frac{-1}{x(x+h)}"} /> },
                { label: 'Limit', content: <BlockMath math={"\\frac{dy}{dx} = \\lim_{h\\to 0}\\frac{-1}{x(x+h)} = \\frac{-1}{x^2}"} />, highlight: true },
              ]}
            />

          </div>
        </motion.div>
      )}
    </div>
  );
}
