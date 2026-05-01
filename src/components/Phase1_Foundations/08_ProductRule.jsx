import React, { useState } from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import { motion } from 'framer-motion';
import { colors } from '../../styles/theme';
import FormulaCard from '../shared/FormulaCard';
import TryItPanel from '../shared/TryItPanel';

// ── Animated rectangle visual ─────────────────────────────────────────────────
function RectangleVisual({ u, v }) {
  const maxDim = 200;
  const scale = Math.min(maxDim / Math.max(u + 0.5, v + 0.5), 40);
  const W = u * scale, H = v * scale;
  const dh = 0.5 * scale; // small δu and δv for visual
  const dv = 0.5 * scale;
  const totalW = W + dh;
  const totalH = H + dv;
  const svgW = 260, svgH = 200;
  const offX = (svgW - totalW) / 2;
  const offY = (svgH - totalH) / 2;

  return (
    <svg width="100%" viewBox={`0 0 ${svgW} ${svgH}`}
      style={{ background: '#05050f', borderRadius: 12, display: 'block' }}>

      {/* Main area: u × v */}
      <rect x={offX} y={offY} width={W} height={H}
        fill={`${colors.primary}30`} stroke={colors.primary} strokeWidth={1.5} />
      <text x={offX + W / 2} y={offY + H / 2}
        fill={colors.primary} fontSize={11} textAnchor="middle" dominantBaseline="middle">
        u · v
      </text>

      {/* Right strip: v × δu */}
      <rect x={offX + W} y={offY} width={dh} height={H}
        fill={`${colors.secondary}40`} stroke={colors.secondary} strokeWidth={1} />
      <text x={offX + W + dh / 2} y={offY + H / 2}
        fill={colors.secondary} fontSize={9} textAnchor="middle" dominantBaseline="middle">
        v·δu
      </text>

      {/* Top strip: u × δv */}
      <rect x={offX} y={offY + H} width={W} height={dv}
        fill={`${colors.accent}40`} stroke={colors.accent} strokeWidth={1} />
      <text x={offX + W / 2} y={offY + H + dv / 2}
        fill={colors.accent} fontSize={9} textAnchor="middle" dominantBaseline="middle">
        u·δv
      </text>

      {/* Corner: δu × δv (negligible) */}
      <rect x={offX + W} y={offY + H} width={dh} height={dv}
        fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" strokeWidth={0.5} />
      <text x={offX + W + dh / 2} y={offY + H + dv / 2}
        fill={colors.muted} fontSize={7} textAnchor="middle" dominantBaseline="middle">≈0</text>

      {/* Dimension labels */}
      <text x={offX + W / 2} y={offY - 8}
        fill={colors.primary} fontSize={10} textAnchor="middle">u</text>
      <text x={offX - 8} y={offY + H / 2}
        fill={colors.primary} fontSize={10} textAnchor="middle" dominantBaseline="middle">v</text>
      <text x={offX + W + dh / 2} y={offY - 8}
        fill={colors.secondary} fontSize={9} textAnchor="middle">δu</text>
      <text x={offX - 8} y={offY + H + dv / 2}
        fill={colors.accent} fontSize={9} textAnchor="middle" dominantBaseline="middle">δv</text>
    </svg>
  );
}

// ── Textbook exercise problems ─────────────────────────────────────────────────
const EXERCISES = [
  {
    source: 'Exercise 19(C) — Q1',
    problem: <span>Differentiate <InlineMath math="(ax+b)(cx+d)" /></span>,
    hint: 'u = ax+b, v = cx+d. Apply product rule: u(dv/dx) + v(du/dx).',
    answer: <InlineMath math="(ax+b)c + (cx+d)a = ac(x+x) + (bc+ad) = 2acx + (bc+ad)" />,
    steps: [
      { label: 'Identify u, v', content: <BlockMath math={"u = ax+b, \\quad v = cx+d"} /> },
      { label: 'Derivatives', content: <BlockMath math={"\\frac{du}{dx} = a, \\quad \\frac{dv}{dx} = c"} /> },
      { label: 'Apply product rule', content: <BlockMath math={"\\frac{d}{dx}[(ax+b)(cx+d)] = (ax+b)\\cdot c + (cx+d)\\cdot a"} /> },
      { label: 'Simplify', content: <BlockMath math={"= acx + bc + acx + ad = 2acx + (bc+ad)"} />, highlight: true },
    ],
  },
  {
    source: 'Exercise 19(C) — Q3',
    problem: <span>Differentiate <InlineMath math="x(2x-1)(x+2)" /></span>,
    hint: 'First expand: x(2x-1)(x+2) = x(2x²+3x−2) = 2x³+3x²−2x. Then differentiate.',
    answer: <InlineMath math="6x^2 + 6x - 2" />,
    steps: [
      { label: 'Expand', content: <BlockMath math={"x(2x-1)(x+2) = x[(2x-1)(x+2)] = x[2x^2+3x-2] = 2x^3+3x^2-2x"} /> },
      { label: 'Differentiate', content: <BlockMath math={"\\frac{dy}{dx} = 6x^2 + 6x - 2"} />, highlight: true },
    ],
  },
  {
    source: 'Exercise 19(C) — Q4',
    problem: <span>Differentiate <InlineMath math="(x-2)(x+3)(2x+5)" /></span>,
    hint: 'Expand step by step: first (x−2)(x+3) = x²+x−6, then multiply by (2x+5).',
    answer: <InlineMath math="6x^2 + 2x - 7" />,
    steps: [
      { label: 'Step 1', content: <BlockMath math={"(x-2)(x+3) = x^2 + x - 6"} /> },
      { label: 'Step 2', content: <BlockMath math={"(x^2+x-6)(2x+5) = 2x^3+7x^2-7x-30"} /> },
      { label: 'Differentiate', content: <BlockMath math={"\\frac{dy}{dx} = 6x^2 + 14x - 7"} />, highlight: true },
    ],
  },
  {
    source: 'XI §19.7 — Textbook Worked Example',
    problem: <span>Differentiate <InlineMath math="y = x^{-1} \cdot \sin x" /></span>,
    hint: 'u = x⁻¹, v = sin x. Product rule: u(dv/dx) + v(du/dx).',
    answer: <InlineMath math="\frac{\cos x}{x} - \frac{\sin x}{x^2}" />,
    steps: [
      { label: 'u, v', content: <BlockMath math={"u = x^{-1}, \\quad v = \\sin x"} /> },
      { label: 'Derivatives', content: <BlockMath math={"u' = -x^{-2}, \\quad v' = \\cos x"} /> },
      { label: 'Product rule', content: <BlockMath math={"\\frac{dy}{dx} = x^{-1}\\cos x + \\sin x \\cdot(-x^{-2})"} /> },
      { label: 'Simplify', content: <BlockMath math={"= \\frac{\\cos x}{x} - \\frac{\\sin x}{x^2}"} />, highlight: true },
    ],
  },
];

// ── Main component ─────────────────────────────────────────────────────────────
export default function ProductRule() {
  const [tab, setTab] = useState('watch');
  const [u, setU] = useState(3);
  const [v, setV] = useState(2);
  const [watchStep, setWatchStep] = useState(0);

  const WATCH_STEPS = [
    {
      title: 'The Rectangle',
      desc: 'Think of u and v as the sides of a rectangle. Area = u × v.',
      content: <RectangleVisual u={u} v={v} />,
    },
    {
      title: 'Increase both sides',
      desc: 'When u increases by δu and v increases by δv, the area gains three new pieces.',
      content: <RectangleVisual u={u} v={v} />,
      note: 'New area = v·δu + u·δv + δu·δv',
    },
    {
      title: 'Take the limit',
      desc: 'As δu, δv → 0, the corner piece δu·δv is negligible. We get the product rule.',
      content: null,
      formula: '\\frac{d}{dx}(uv) = u\\frac{dv}{dx} + v\\frac{du}{dx}',
    },
  ];

  const step = WATCH_STEPS[watchStep];

  return (
    <div style={{ maxWidth: 880, margin: '0 auto', padding: '28px 24px' }}>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, color: colors.phase1, fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>
          Topic 8 · Phase 1 — Foundations · XI §19.7
        </div>
        <h1 style={{ margin: 0, fontSize: 30, color: colors.text, fontWeight: 800, letterSpacing: -0.5 }}>
          Product Rule
        </h1>
        <p style={{ margin: '8px 0 0', color: colors.muted, fontSize: 15, lineHeight: 1.6 }}>
          When two functions are multiplied, you can't just multiply their derivatives.
        </p>
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 28,
        background: 'rgba(255,255,255,0.04)', padding: 4, borderRadius: 10, width: 'fit-content' }}>
        {[
          { key: 'watch',     label: '▶ Watch' },
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

            {/* Step panel */}
            <div style={{ flex: '1 1 300px' }}>

              {/* Step navigator */}
              <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
                {WATCH_STEPS.map((s, i) => (
                  <button key={i} onClick={() => setWatchStep(i)} style={{
                    flex: 1, padding: '8px 4px', borderRadius: 9,
                    border: `1px solid ${watchStep === i ? colors.phase1 : 'rgba(255,255,255,0.1)'}`,
                    background: watchStep === i ? `${colors.phase1}18` : 'transparent',
                    color: watchStep === i ? colors.phase1 : colors.muted,
                    fontSize: 11, fontWeight: watchStep === i ? 700 : 400,
                    cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                  }}>{i + 1}. {s.title}</button>
                ))}
              </div>

              <div style={{
                background: 'rgba(0,0,0,0.35)',
                border: `1px solid ${colors.phase1}25`,
                borderRadius: 14, padding: 20,
              }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: colors.phase1, marginBottom: 10 }}>
                  {step.title}
                </div>
                <p style={{ margin: '0 0 14px', fontSize: 14, color: colors.text, lineHeight: 1.75 }}>
                  {step.desc}
                </p>
                {step.content && step.content}
                {step.note && (
                  <div style={{ marginTop: 12, padding: '10px 14px',
                    background: `${colors.secondary}0a`, border: `1px solid ${colors.secondary}25`,
                    borderRadius: 8, fontSize: 13, color: colors.secondary }}>
                    {step.note}
                  </div>
                )}
                {step.formula && (
                  <div style={{ marginTop: 12, padding: '14px 18px',
                    background: `${colors.accent}10`, border: `1px solid ${colors.accent}30`,
                    borderRadius: 10 }}>
                    <BlockMath math={step.formula} />
                  </div>
                )}
              </div>

              {/* Sliders */}
              {watchStep < 2 && (
                <div style={{ marginTop: 14, padding: 16,
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 12 }}>
                  <div style={{ fontSize: 12, color: colors.muted, marginBottom: 12 }}>Adjust rectangle dimensions:</div>
                  {[
                    { label: 'u', val: u, setter: setU, color: colors.primary },
                    { label: 'v', val: v, setter: setV, color: colors.secondary },
                  ].map(dim => (
                    <div key={dim.label} style={{ marginBottom: 10 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between',
                        fontSize: 12, marginBottom: 4 }}>
                        <span style={{ color: dim.color, fontWeight: 700 }}>{dim.label}</span>
                        <span style={{ color: dim.color }}>{dim.val.toFixed(1)}</span>
                      </div>
                      <input type="range" min={1} max={5} step={0.1} value={dim.val}
                        onChange={e => dim.setter(Number(e.target.value))}
                        style={{ width: '100%', accentColor: dim.color }} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right: formula card + mnemonic */}
            <div style={{ flex: '1 1 260px', minWidth: 240 }}>

              <FormulaCard
                title="Product Rule (XI §19.7)"
                formula={"\\frac{d}{dx}(uv) = u\\frac{dv}{dx} + v\\frac{du}{dx}"}
                note="'First times deriv of Second, plus Second times deriv of First'"
                accent={colors.primary}
              />

              <div style={{ marginTop: 16, padding: 16,
                background: `${colors.secondary}0a`, border: `1px solid ${colors.secondary}25`,
                borderRadius: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: colors.secondary, marginBottom: 10 }}>
                  Extended — 3 functions (XI §19.7)
                </div>
                <BlockMath math={"\\frac{d}{dx}(uvw) = u'vw + uv'w + uvw'"} />
                <div style={{ fontSize: 12, color: colors.muted, marginTop: 8 }}>
                  Each factor gets its turn being differentiated, while the others stay as-is.
                </div>
              </div>

              <div style={{ marginTop: 16, padding: 16,
                background: `${colors.primary}08`, border: `1px solid ${colors.primary}20`,
                borderRadius: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: colors.primary, marginBottom: 10 }}>
                  Why NOT u'×v'?
                </div>
                <div style={{ fontSize: 13, color: colors.text, lineHeight: 1.75 }}>
                  If f = x², g = x³, then fg = x⁵, so (fg)' = 5x⁴.
                  But f'·g' = 2x × 3x² = 6x³ — completely wrong!
                  The product rule exists because multiplication interacts with differentiation in a non-trivial way.
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
            From <strong style={{ color: colors.phase1 }}>Exercise 19(C), XI §19.7</strong> — use the product rule or expand:
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {EXERCISES.map((ex, i) => (
              <TryItPanel key={i}
                source={ex.source}
                problem={ex.problem}
                hint={ex.hint}
                answer={ex.answer}
                steps={ex.steps}
              />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
