import React, { useState } from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import { motion } from 'framer-motion';
import { colors } from '../../styles/theme';
import FormulaCard from '../shared/FormulaCard';
import TryItPanel from '../shared/TryItPanel';

// ── Function options for the playground ───────────────────────────────────────
const U_OPTIONS = [
  { label: 'x²',     latex: 'x^2',      fn: x => x*x,         dfn: x => 2*x,      dlatex: '2x' },
  { label: 'x³',     latex: 'x^3',      fn: x => x**3,        dfn: x => 3*x*x,    dlatex: '3x^2' },
  { label: 'sin x',  latex: '\\sin x',  fn: x => Math.sin(x), dfn: x => Math.cos(x), dlatex: '\\cos x' },
  { label: '1/x',    latex: '\\frac{1}{x}', fn: x => 1/x, dfn: x => -1/x**2, dlatex: '-\\frac{1}{x^2}' },
];
const V_OPTIONS = [
  { label: 'x',      latex: 'x',        fn: x => x,           dfn: x => 1,        dlatex: '1' },
  { label: 'x²',     latex: 'x^2',      fn: x => x*x,         dfn: x => 2*x,      dlatex: '2x' },
  { label: 'cos x',  latex: '\\cos x',  fn: x => Math.cos(x), dfn: x => -Math.sin(x), dlatex: '-\\sin x' },
  { label: '√x',     latex: '\\sqrt{x}',fn: x => Math.sqrt(Math.max(0,x)), dfn: x => 0.5/Math.sqrt(Math.max(0.001,x)), dlatex: '\\frac{1}{2\\sqrt{x}}' },
];

// ── Mini dual graph ────────────────────────────────────────────────────────────
const GW = 300, GH = 160;
const GXMIN = -2, GXMAX = 3, GYMIN = -3, GYMAX = 6;

function gSX(x) { return ((x - GXMIN) / (GXMAX - GXMIN)) * GW; }
function gSY(y) { return GH - ((y - GYMIN) / (GYMAX - GYMIN)) * GH; }

function buildPath(fn, color) {
  const pts = [];
  for (let i = 0; i <= 200; i++) {
    const x = GXMIN + (i / 200) * (GXMAX - GXMIN);
    const y = fn(x);
    if (!isFinite(y) || y < GYMIN - 1 || y > GYMAX + 1) { if (pts.length) pts.push('M'); continue; }
    pts.push(`${pts.length === 0 || pts[pts.length-1] === 'M' ? 'M' : 'L'} ${gSX(x)} ${gSY(y)}`);
  }
  return <path d={pts.join(' ')} stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" />;
}

function DualGraph({ u, v }) {
  const sum = { fn: x => u.fn(x) + v.fn(x) };
  return (
    <svg width="100%" viewBox={`0 0 ${GW} ${GH}`}
      style={{ background: '#05050f', borderRadius: 10, display: 'block' }}>
      <line x1={gSX(0)} y1={0} x2={gSX(0)} y2={GH} stroke="#2d3748" strokeWidth={1} />
      <line x1={0} y1={gSY(0)} x2={GW} y2={gSY(0)} stroke="#2d3748" strokeWidth={1} />
      {buildPath(u.fn, colors.primary)}
      {buildPath(v.fn, colors.secondary)}
      {buildPath(sum.fn, colors.accent)}
      <text x={4} y={12} fill={colors.primary} fontSize={9}>u</text>
      <text x={14} y={12} fill={colors.secondary} fontSize={9}>v</text>
      <text x={24} y={12} fill={colors.accent} fontSize={9}>u+v</text>
    </svg>
  );
}


// ── Main component ─────────────────────────────────────────────────────────────
export default function SumRule() {
  const [tab, setTab] = useState('watch');
  const [uIdx, setUIdx] = useState(0);
  const [vIdx, setVIdx] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const u = U_OPTIONS[uIdx];
  const v = V_OPTIONS[vIdx];

  return (
    <div style={{ maxWidth: 880, margin: '0 auto', padding: '28px 24px' }}>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, color: colors.phase1, fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>
          Topic 7 · Phase 1 — Foundations · XI §19.6
        </div>
        <h1 style={{ margin: 0, fontSize: 30, color: colors.text, fontWeight: 800, letterSpacing: -0.5 }}>
          Sum &amp; Difference Rule
        </h1>
        <p style={{ margin: '8px 0 0', color: colors.muted, fontSize: 15, lineHeight: 1.6 }}>
          The derivative of a sum is the sum of the derivatives. Differentiate term by term.
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

            {/* Theorems */}
            <div style={{ flex: '1 1 280px' }}>
              <FormulaCard
                title="Theorem 1 — Constant Multiple (XI §19.6)"
                formula={"\\frac{d}{dx}[k \\cdot f(x)] = k \\cdot f'(x)"}
                note="Pull constants out — they multiply through after differentiation."
                accent={colors.secondary}
              />
              <div style={{ marginTop: 16 }}>
                <FormulaCard
                  title="Theorem 2 — Sum/Difference Rule (XI §19.6)"
                  formula={"\\frac{d}{dx}(u \\pm v) = \\frac{du}{dx} \\pm \\frac{dv}{dx}"}
                  note="Differentiate each term independently. Works for any finite sum."
                  accent={colors.accent}
                />
              </div>
            </div>

            {/* Visual + textbook example */}
            <div style={{ flex: '1 1 280px' }}>
              <div style={{
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 14, padding: 20, marginBottom: 16,
              }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: colors.phase1,
                  textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12 }}>
                  Three functions — one graph
                </div>
                <DualGraph u={U_OPTIONS[0]} v={V_OPTIONS[0]} />
                <div style={{ marginTop: 10, display: 'flex', gap: 16, fontSize: 11 }}>
                  {[
                    { label: 'u = x²', col: colors.primary },
                    { label: 'v = x', col: colors.secondary },
                    { label: 'u+v', col: colors.accent },
                  ].map(item => (
                    <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 16, height: 2, background: item.col, borderRadius: 1 }} />
                      <span style={{ color: item.col }}>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Textbook worked example */}
              <div style={{
                background: `${colors.primary}0a`,
                border: `1px solid ${colors.primary}25`,
                borderRadius: 14, padding: 18,
              }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: colors.primary, marginBottom: 12 }}>
                  Textbook Example (XI §19.6)
                </div>
                <div style={{ marginBottom: 8 }}>
                  <InlineMath math={"y = (x + \\tfrac{1}{x})^2"} />
                  <span style={{ color: colors.muted, fontSize: 12, marginLeft: 8 }}>— expand first, then differentiate</span>
                </div>
                {[
                  { label: 'Expand', math: 'y = x^2 + 2 + x^{-2}' },
                  { label: 'Differentiate', math: '\\frac{dy}{dx} = 2x + 0 + (-2)x^{-3} = 2x - \\frac{2}{x^3}' },
                ].map((row, i) => (
                  <div key={i} style={{
                    padding: '8px 12px', marginBottom: 6,
                    background: i === 1 ? `${colors.accent}10` : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${i === 1 ? colors.accent + '30' : 'rgba(255,255,255,0.06)'}`,
                    borderRadius: 8,
                  }}>
                    <div style={{ fontSize: 10, color: colors.muted, marginBottom: 4,
                      textTransform: 'uppercase', letterSpacing: 1 }}>{row.label}</div>
                    <BlockMath math={row.math} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ════════════ TRY IT TAB ════════════ */}
      {tab === 'try' && (
        <motion.div key="try" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>

          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'flex-start' }}>

            {/* Function picker */}
            <div style={{ flex: '1 1 300px' }}>
              <div style={{
                background: 'rgba(0,0,0,0.35)',
                border: `1px solid rgba(255,255,255,0.08)`,
                borderRadius: 14, padding: 20, marginBottom: 16,
              }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: colors.phase1, marginBottom: 14 }}>
                  Build your sum: u + v
                </div>

                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 12, color: colors.primary, fontWeight: 700, marginBottom: 8 }}>
                    u =
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {U_OPTIONS.map((opt, i) => (
                      <button key={i} onClick={() => { setUIdx(i); setShowResult(false); }} style={{
                        padding: '6px 14px', borderRadius: 8,
                        border: `1px solid ${uIdx === i ? colors.primary : 'rgba(255,255,255,0.1)'}`,
                        background: uIdx === i ? `${colors.primary}18` : 'transparent',
                        color: uIdx === i ? colors.primary : colors.muted,
                        fontSize: 12, fontWeight: uIdx === i ? 700 : 400,
                        cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                      }}>{opt.label}</button>
                    ))}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: 12, color: colors.secondary, fontWeight: 700, marginBottom: 8 }}>
                    v =
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {V_OPTIONS.map((opt, i) => (
                      <button key={i} onClick={() => { setVIdx(i); setShowResult(false); }} style={{
                        padding: '6px 14px', borderRadius: 8,
                        border: `1px solid ${vIdx === i ? colors.secondary : 'rgba(255,255,255,0.1)'}`,
                        background: vIdx === i ? `${colors.secondary}18` : 'transparent',
                        color: vIdx === i ? colors.secondary : colors.muted,
                        fontSize: 12, fontWeight: vIdx === i ? 700 : 400,
                        cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                      }}>{opt.label}</button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Graph */}
              <div style={{
                background: 'rgba(0,0,0,0.25)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 12, padding: 14,
              }}>
                <DualGraph u={u} v={v} />
                <div style={{ marginTop: 8, display: 'flex', gap: 16, fontSize: 11, justifyContent: 'center' }}>
                  {[
                    { label: `u = ${u.label}`, col: colors.primary },
                    { label: `v = ${v.label}`, col: colors.secondary },
                    { label: 'u + v', col: colors.accent },
                  ].map(item => (
                    <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <div style={{ width: 14, height: 2, background: item.col, borderRadius: 1 }} />
                      <span style={{ color: item.col }}>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Step-by-step */}
            <div style={{ flex: '1 1 260px', minWidth: 240 }}>
              <div style={{
                background: 'rgba(0,0,0,0.3)',
                border: `1px solid ${colors.accent}25`,
                borderRadius: 14, padding: 20,
              }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: colors.accent,
                  textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 14 }}>
                  Step-by-step Solution
                </div>

                {/* y = u + v */}
                <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.03)',
                  borderRadius: 8, marginBottom: 10 }}>
                  <div style={{ fontSize: 11, color: colors.muted, marginBottom: 4 }}>Function:</div>
                  <InlineMath math={`y = ${u.latex} + ${v.latex}`} />
                </div>

                {/* du/dx */}
                <div style={{ padding: '10px 14px', background: `${colors.primary}0a`,
                  border: `1px solid ${colors.primary}20`, borderRadius: 8, marginBottom: 8 }}>
                  <div style={{ fontSize: 11, color: colors.primary, marginBottom: 4 }}>d/dx(u):</div>
                  <InlineMath math={`\\frac{d}{dx}(${u.latex}) = ${u.dlatex}`} />
                </div>

                {/* dv/dx */}
                <div style={{ padding: '10px 14px', background: `${colors.secondary}0a`,
                  border: `1px solid ${colors.secondary}20`, borderRadius: 8, marginBottom: 8 }}>
                  <div style={{ fontSize: 11, color: colors.secondary, marginBottom: 4 }}>d/dx(v):</div>
                  <InlineMath math={`\\frac{d}{dx}(${v.latex}) = ${v.dlatex}`} />
                </div>

                <button onClick={() => setShowResult(r => !r)} style={{
                  width: '100%', padding: '10px 0', borderRadius: 9, border: 'none',
                  background: showResult ? `${colors.accent}20` : colors.accent,
                  color: showResult ? colors.accent : '#0f0e17',
                  fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                  marginBottom: 10,
                }}>
                  {showResult ? '▼ Result shown' : '▶ Show Result'}
                </button>

                {showResult && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    style={{ padding: '12px 16px', background: `${colors.accent}10`,
                      border: `1px solid ${colors.accent}30`, borderRadius: 10 }}>
                    <div style={{ fontSize: 11, color: colors.accent, fontWeight: 700,
                      textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
                      dy/dx
                    </div>
                    <BlockMath math={`\\frac{d}{dx}(${u.latex} + ${v.latex}) = ${u.dlatex} + ${v.dlatex}`} />
                  </motion.div>
                )}
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
            From <strong style={{ color: colors.phase1 }}>Exercise 19(B), XI §19.6</strong> — differentiate each:
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            <TryItPanel
              source="Exercise 19(B) — Q1(i)"
              problem={<span>Differentiate <InlineMath math="y = x - \frac{1}{x}" /></span>}
              hint="Rewrite as x − x⁻¹. Then use power rule on each term."
              answer={<InlineMath math="\frac{dy}{dx} = 1 + \frac{1}{x^2}" />}
              steps={[
                { label: 'Rewrite', content: <BlockMath math={"y = x - x^{-1}"} /> },
                { label: 'Differentiate', content: <BlockMath math={"\\frac{dy}{dx} = 1 - (-1)x^{-2} = 1 + \\frac{1}{x^2}"} />, highlight: true },
              ]}
            />

            <TryItPanel
              source="Exercise 19(B) — Q1(ii)"
              problem={<span>Differentiate <InlineMath math="y = \sqrt{x} + \frac{1}{\sqrt{x}}" /></span>}
              hint="Rewrite as x^(1/2) + x^(−1/2). Apply power rule to each term."
              answer={<InlineMath math="\frac{dy}{dx} = \frac{1}{2\sqrt{x}} - \frac{1}{2x^{3/2}}" />}
              steps={[
                { label: 'Rewrite', content: <BlockMath math={"y = x^{1/2} + x^{-1/2}"} /> },
                { label: 'Differentiate', content: <BlockMath math={"\\frac{dy}{dx} = \\frac{1}{2}x^{-1/2} + \\left(-\\frac{1}{2}\\right)x^{-3/2} = \\frac{1}{2\\sqrt{x}} - \\frac{1}{2x^{3/2}}"} />, highlight: true },
              ]}
            />

            <TryItPanel
              source="Exercise 19(B) — Q2(iv)"
              problem={<span>Differentiate <InlineMath math="y = \frac{x^2 + 1}{x}" /></span>}
              hint="Split the fraction: y = x + 1/x. Then differentiate term by term."
              answer={<InlineMath math="\frac{dy}{dx} = 1 - \frac{1}{x^2}" />}
              steps={[
                { label: 'Split', content: <BlockMath math={"y = \\frac{x^2+1}{x} = x + \\frac{1}{x} = x + x^{-1}"} /> },
                { label: 'Differentiate', content: <BlockMath math={"\\frac{dy}{dx} = 1 - x^{-2} = 1 - \\frac{1}{x^2}"} />, highlight: true },
              ]}
            />

            <TryItPanel
              source="Exercise 19(B) — Q2(vi)"
              problem={<span>Differentiate <InlineMath math="y = \frac{1 + x^2}{x^3}" /></span>}
              hint="Split: y = x⁻³ + x⁻¹. Apply power rule to each."
              answer={<InlineMath math="\frac{dy}{dx} = -\frac{3}{x^4} - \frac{1}{x^2}" />}
              steps={[
                { label: 'Split', content: <BlockMath math={"y = \\frac{1}{x^3} + \\frac{x^2}{x^3} = x^{-3} + x^{-1}"} /> },
                { label: 'Differentiate', content: <BlockMath math={"\\frac{dy}{dx} = -3x^{-4} - x^{-2} = -\\frac{3}{x^4} - \\frac{1}{x^2}"} />, highlight: true },
              ]}
            />

            <TryItPanel
              source="Exercise 19(B) — Q1(iii)"
              problem={<span>Differentiate <InlineMath math="y = 3x + \frac{2}{x^2}" /></span>}
              hint="Rewrite 2/x² = 2x⁻². Power rule on each term."
              answer={<InlineMath math="\frac{dy}{dx} = 3 - \frac{4}{x^3}" />}
              steps={[
                { label: 'Rewrite', content: <BlockMath math={"y = 3x + 2x^{-2}"} /> },
                { label: 'Differentiate', content: <BlockMath math={"\\frac{dy}{dx} = 3 + 2(-2)x^{-3} = 3 - \\frac{4}{x^3}"} />, highlight: true },
              ]}
            />

          </div>
        </motion.div>
      )}
    </div>
  );
}
