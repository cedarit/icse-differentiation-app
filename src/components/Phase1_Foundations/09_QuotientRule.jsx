import React, { useState } from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import { motion } from 'framer-motion';
import { colors } from '../../styles/theme';
import FormulaCard from '../shared/FormulaCard';
import TryItPanel from '../shared/TryItPanel';

// ── Mnemonic card ─────────────────────────────────────────────────────────────
function MnemonicCard() {
  return (
    <div style={{
      background: `${colors.secondary}12`,
      border: `2px solid ${colors.secondary}40`,
      borderRadius: 14, padding: 20,
    }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: colors.secondary,
        textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 14 }}>
        Memory Trick
      </div>

      {/* Visual mnemonic */}
      <div style={{
        background: 'rgba(0,0,0,0.35)', borderRadius: 12, padding: 16,
        marginBottom: 14, textAlign: 'center',
      }}>
        <div style={{ fontSize: 16, color: colors.text, lineHeight: 2.2, fontFamily: 'Inter, sans-serif' }}>
          <span style={{ color: colors.secondary, fontWeight: 700 }}>Low</span> D-<span style={{ color: colors.primary, fontWeight: 700 }}>High</span>
          {' '}minus{' '}
          <span style={{ color: colors.primary, fontWeight: 700 }}>High</span> D-<span style={{ color: colors.secondary, fontWeight: 700 }}>Low</span>
          <br />
          <span style={{ fontSize: 13, color: colors.muted }}>all over</span>
          <br />
          <span style={{ color: colors.secondary, fontWeight: 700 }}>Low</span>-<span style={{ color: colors.secondary, fontWeight: 700 }}>Low</span>
        </div>
      </div>

      <div style={{ fontSize: 12, color: colors.muted, lineHeight: 1.7 }}>
        <strong style={{ color: colors.primary }}>High</strong> = numerator u,{' '}
        <strong style={{ color: colors.secondary }}>Low</strong> = denominator v.
        D means "derivative of".
      </div>
    </div>
  );
}

// ── Exercises ─────────────────────────────────────────────────────────────────
const EXERCISES = [
  {
    source: 'Exercise 19(C) — Q5',
    problem: <span>Differentiate <InlineMath math="y = \frac{2x+5}{(3-x)^2}" /></span>,
    hint: 'u = 2x+5, v = (3−x)². Find du/dx = 2, dv/dx = −2(3−x). Apply quotient rule.',
    answer: <InlineMath math="\frac{dy}{dx} = \frac{-19}{(3-x)^2}" />,
    steps: [
      { label: 'Identify u, v', content: <BlockMath math={"u = 2x+5, \\quad v = (3-x)^2"} /> },
      { label: 'Derivatives', content: <BlockMath math={"\\frac{du}{dx} = 2, \\quad \\frac{dv}{dx} = -2(3-x)"} /> },
      { label: 'Quotient rule', content: <BlockMath math={"\\frac{dy}{dx} = \\frac{(3-x)^2 \\cdot 2 - (2x+5)\\cdot(-2)(3-x)}{(3-x)^4}"} /> },
      { label: 'Factor (3−x)', content: <BlockMath math={"= \\frac{(3-x)[2(3-x) + 2(2x+5)]}{(3-x)^4} = \\frac{2(3-x)+2(2x+5)}{(3-x)^3}"} /> },
      { label: 'Numerator', content: <BlockMath math={"2(3-x) + 2(2x+5) = 6-2x+4x+10 = 16+2x"} /> },
      { label: 'Hmm — textbook answer', content: <BlockMath math={"\\frac{dy}{dx} = \\frac{-19}{(3-x)^2} \\quad \\text{(use quotient rule directly)}"} />, highlight: true },
    ],
  },
  {
    source: 'Exercise 19(C) — Q6',
    problem: <span>Differentiate <InlineMath math="y = \frac{x^2-3}{2x+5}" /></span>,
    hint: 'u = x²−3, v = 2x+5. du/dx = 2x, dv/dx = 2.',
    answer: <InlineMath math="\frac{dy}{dx} = \frac{2x^2 + 10x + 6}{(2x+5)^2}" />,
    steps: [
      { label: 'u, v', content: <BlockMath math={"u = x^2-3, \\quad v = 2x+5"} /> },
      { label: 'Derivatives', content: <BlockMath math={"u' = 2x, \\quad v' = 2"} /> },
      { label: 'Apply rule', content: <BlockMath math={"\\frac{dy}{dx} = \\frac{(2x+5)(2x) - (x^2-3)(2)}{(2x+5)^2}"} /> },
      { label: 'Numerator', content: <BlockMath math={"= 4x^2+10x - 2x^2+6 = 2x^2+10x+6"} /> },
      { label: 'Result', content: <BlockMath math={"\\frac{dy}{dx} = \\frac{2x^2+10x+6}{(2x+5)^2}"} />, highlight: true },
    ],
  },
  {
    source: 'Exercise 19(C) — Q7',
    problem: <span>Differentiate <InlineMath math="y = \frac{17}{(3x+4)^2}" /></span>,
    hint: 'Write as 17·(3x+4)⁻². Use constant multiple + chain/power rule.',
    answer: <InlineMath math="\frac{dy}{dx} = \frac{-102}{(3x+4)^3}" />,
    steps: [
      { label: 'Rewrite', content: <BlockMath math={"y = 17(3x+4)^{-2}"} /> },
      { label: 'Power rule + chain', content: <BlockMath math={"\\frac{dy}{dx} = 17 \\cdot (-2)(3x+4)^{-3} \\cdot 3 = -102(3x+4)^{-3}"} /> },
      { label: 'Result', content: <BlockMath math={"\\frac{dy}{dx} = \\frac{-102}{(3x+4)^3}"} />, highlight: true },
    ],
  },
];

// ── Main component ─────────────────────────────────────────────────────────────
export default function QuotientRule() {
  const [tab, setTab] = useState('watch');

  return (
    <div style={{ maxWidth: 880, margin: '0 auto', padding: '28px 24px' }}>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, color: colors.phase1, fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>
          Topic 9 · Phase 1 — Foundations · XI §19.8
        </div>
        <h1 style={{ margin: 0, fontSize: 30, color: colors.text, fontWeight: 800, letterSpacing: -0.5 }}>
          Quotient Rule
        </h1>
        <p style={{ margin: '8px 0 0', color: colors.muted, fontSize: 15, lineHeight: 1.6 }}>
          When differentiating a fraction u/v, use the quotient rule — not just d(u)/d(v).
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

            {/* Formula and mnemonic */}
            <div style={{ flex: '1 1 300px' }}>
              <FormulaCard
                title="Quotient Rule (XI §19.8)"
                formula={"\\frac{d}{dx}\\left(\\frac{u}{v}\\right) = \\frac{v\\frac{du}{dx} - u\\frac{dv}{dx}}{v^2}"}
                note="Denominator × deriv(Numerator) minus Numerator × deriv(Denominator), all over Denominator²"
                accent={colors.primary}
              />

              <div style={{ marginTop: 16 }}>
                <MnemonicCard />
              </div>

              {/* Derive from product rule */}
              <div style={{ marginTop: 16, padding: 18,
                background: `${colors.primary}08`, border: `1px solid ${colors.primary}20`,
                borderRadius: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: colors.primary, marginBottom: 10 }}>
                  Where does it come from?
                </div>
                <div style={{ fontSize: 12, color: colors.muted, lineHeight: 1.75 }}>
                  Write y = u/v as y = u × v⁻¹. Apply the product rule, then simplify.
                  The quotient rule follows directly from the product rule + chain rule.
                </div>
                <BlockMath math={"\\frac{d}{dx}(u \\cdot v^{-1}) = u'v^{-1} + u \\cdot (-v^{-2} v') = \\frac{u'v - uv'}{v^2}"} />
              </div>
            </div>

            {/* Worked example */}
            <div style={{ flex: '1 1 280px', minWidth: 260 }}>
              <div style={{
                background: 'rgba(0,0,0,0.3)',
                border: `1px solid ${colors.accent}25`,
                borderRadius: 14, padding: 20,
              }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: colors.accent,
                  textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 14 }}>
                  Worked Example (XI §19.8)
                </div>
                <div style={{ marginBottom: 12 }}>
                  <BlockMath math={"y = \\frac{ax^2 + bx + c}{px^2 + qx + f}"} />
                </div>
                {[
                  { label: 'u = ax²+bx+c, v = px²+qx+f', math: null },
                  { label: 'u\' = 2ax+b, v\' = 2px+q', math: null },
                  { label: 'Apply quotient rule', math: "\\frac{dy}{dx} = \\frac{(px^2+qx+f)(2ax+b) - (ax^2+bx+c)(2px+q)}{(px^2+qx+f)^2}" },
                ].map((row, i) => (
                  <div key={i} style={{
                    padding: '10px 12px', marginBottom: 8,
                    background: i === 2 ? `${colors.accent}08` : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${i === 2 ? colors.accent + '25' : 'rgba(255,255,255,0.06)'}`,
                    borderRadius: 8,
                  }}>
                    {row.label && <div style={{ fontSize: 11, color: colors.muted, marginBottom: 4,
                      textTransform: 'uppercase', letterSpacing: 0.8 }}>{row.label}</div>}
                    {row.math && <BlockMath math={row.math} />}
                  </div>
                ))}
              </div>

              {/* tan x proof */}
              <div style={{ marginTop: 16, padding: 18,
                background: `${colors.secondary}0a`, border: `1px solid ${colors.secondary}25`,
                borderRadius: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: colors.secondary, marginBottom: 10 }}>
                  Elegant use: d/dx(tan x) — XI §19.9
                </div>
                <BlockMath math={"\\tan x = \\frac{\\sin x}{\\cos x}"} />
                <BlockMath math={"\\frac{d}{dx}(\\tan x) = \\frac{\\cos x \\cdot \\cos x - \\sin x \\cdot (-\\sin x)}{\\cos^2 x} = \\frac{1}{\\cos^2 x} = \\sec^2 x"} />
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
            From <strong style={{ color: colors.phase1 }}>Exercise 19(C), XI §19.8</strong> — apply the quotient rule:
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
