import React, { useState } from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import { motion, AnimatePresence } from 'framer-motion';
import { colors } from '../../styles/theme';
import QuizCard from '../shared/QuizCard';
import FormulaCard from '../shared/FormulaCard';

// ── Standard derivative flashcards ────────────────────────────────────────────
const CARDS = [
  {
    fn: 'x^n', fnLatex: 'x^n', deriv: 'nx^{n-1}',
    note: 'Power Rule — bring the power down, reduce by 1',
    examples: [
      { fn: 'x^7', d: '7x^6' },
      { fn: 'x^{5/2}', d: '\\frac{5}{2}x^{3/2}' },
      { fn: 'x',   d: '1' },
      { fn: 'x^0 = 1', d: '0' },
    ],
    color: colors.primary,
  },
  {
    fn: '1/x', fnLatex: 'x^{-1}', deriv: '-x^{-2} = -\\frac{1}{x^2}',
    note: 'Negative power rule: d/dx(x⁻¹) = −x⁻²',
    examples: [
      { fn: '\\frac{1}{x}', d: '-\\frac{1}{x^2}' },
      { fn: '\\frac{1}{x^2}', d: '-\\frac{2}{x^3}' },
    ],
    color: colors.phase3,
  },
  {
    fn: '\\sqrt{x}', fnLatex: 'x^{1/2}', deriv: '\\frac{1}{2\\sqrt{x}}',
    note: 'Square root is x^(1/2) — apply the power rule',
    examples: [
      { fn: '\\sqrt{x}', d: '\\frac{1}{2\\sqrt{x}}' },
      { fn: '\\sqrt[3]{x}', d: '\\frac{1}{3}x^{-2/3}' },
    ],
    color: colors.accent,
  },
  {
    fn: 'c', fnLatex: 'c \\text{ (constant)}', deriv: '0',
    note: 'A constant has no change — its derivative is always 0',
    examples: [
      { fn: '5', d: '0' },
      { fn: '\\pi', d: '0' },
      { fn: '-7', d: '0' },
    ],
    color: colors.secondary,
  },
  {
    fn: 'e^x', fnLatex: 'e^x', deriv: 'e^x',
    note: 'eˣ is its own derivative — the unique "self-mirror" function',
    examples: [
      { fn: 'e^x', d: 'e^x' },
      { fn: 'e^{3x}', d: '3e^{3x}' },
    ],
    color: colors.phase2,
  },
  {
    fn: '\\log x', fnLatex: '\\log_e x = \\ln x', deriv: '\\frac{1}{x}',
    note: 'Log base e (natural log). The derivative is beautifully simple: 1/x',
    examples: [
      { fn: '\\ln x', d: '\\frac{1}{x}' },
      { fn: '\\log_a x', d: '\\frac{1}{x \\log a}' },
    ],
    color: '#f59e0b',
  },
];

// ── Linear argument rule examples ─────────────────────────────────────────────
const LINEAR_EXAMPLES = [
  { fn: '(5x+7)^{10}', deriv: '50(5x+7)^9', source: 'XI §19.5' },
  { fn: '\\sqrt{1-8x}', deriv: '\\frac{-4}{\\sqrt{1-8x}}', source: 'XI §19.5' },
  { fn: '(3x^2+5)^9', deriv: '54x(3x^2+5)^8', source: 'Ex 8(A)' },
];

// ── Quiz questions ─────────────────────────────────────────────────────────────
const QUIZ_QUESTIONS = [
  {
    question: <span>What is <InlineMath math="\frac{d}{dx}(x^5)" />?</span>,
    options: ['5x⁴', '5x⁵', 'x⁴', '4x⁵'],
    correct: 0,
    explanation: 'Power rule: bring down the power (5), reduce by 1. Result: 5x⁴.',
  },
  {
    question: <span>What is <InlineMath math="\frac{d}{dx}\left(\frac{1}{x^3}\right)" />?</span>,
    options: ['3x²', '−3x⁴', '−3/x⁴', '1/(3x²)'],
    correct: 2,
    explanation: 'Write 1/x³ = x⁻³. Apply power rule: −3x⁻⁴ = −3/x⁴.',
  },
  {
    question: <span>What is <InlineMath math="\frac{d}{dx}(\sqrt{x})" />?</span>,
    options: ['2√x', '½x^(−½)', '1/(2√x)', 'x^(3/2)'],
    correct: 2,
    explanation: '√x = x^(1/2). Power rule gives (1/2)x^(-1/2) = 1/(2√x).',
  },
  {
    question: <span>What is <InlineMath math="\frac{d}{dx}(7)" />?</span>,
    options: ['7', '1', '0', '7x'],
    correct: 2,
    explanation: 'The derivative of any constant is 0. Constants have no rate of change.',
  },
  {
    question: <span>What is <InlineMath math="\frac{d}{dx}[(5x+7)^{10}]" />?</span>,
    options: ['10(5x+7)⁹', '50(5x+7)⁹', '10x(5x+7)⁹', '(5x+7)¹⁰'],
    correct: 1,
    explanation: 'Linear rule: d/dx[(ax+b)ⁿ] = n(ax+b)^(n−1)·a = 10(5x+7)⁹ × 5 = 50(5x+7)⁹.',
  },
];

// ── Flashcard component ────────────────────────────────────────────────────────
function Flashcard({ card, active, onClick }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      onClick={() => { onClick(); setFlipped(f => !f); }}
      style={{
        cursor: 'pointer',
        perspective: 600,
        height: 130,
        userSelect: 'none',
      }}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.4, type: 'spring', stiffness: 200 }}
        style={{
          width: '100%', height: '100%',
          transformStyle: 'preserve-3d',
          position: 'relative',
        }}
      >
        {/* Front */}
        <div style={{
          position: 'absolute', width: '100%', height: '100%',
          backfaceVisibility: 'hidden',
          background: `${card.color}12`,
          border: `1px solid ${active ? card.color : card.color + '40'}`,
          borderRadius: 12, padding: 16,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ fontSize: 11, color: card.color, fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 }}>
            Differentiate:
          </div>
          <div style={{ fontSize: 20 }}>
            <InlineMath math={card.fnLatex} />
          </div>
          <div style={{ fontSize: 10, color: colors.muted, marginTop: 8 }}>tap to flip</div>
        </div>

        {/* Back */}
        <div style={{
          position: 'absolute', width: '100%', height: '100%',
          backfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          background: `${card.color}20`,
          border: `2px solid ${card.color}`,
          borderRadius: 12, padding: 16,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ fontSize: 11, color: card.color, fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 }}>
            Answer:
          </div>
          <div style={{ fontSize: 20, color: card.color }}>
            <InlineMath math={card.deriv} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function StandardDerivatives() {
  const [tab, setTab] = useState('watch');
  const [activeCard, setActiveCard] = useState(0);
  const [quizIdx, setQuizIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);

  const card = CARDS[activeCard];

  const handleQuizAnswer = (correct) => {
    setAnswered(a => a + 1);
    if (correct) setScore(s => s + 1);
  };

  const nextQuiz = () => {
    if (quizIdx < QUIZ_QUESTIONS.length - 1) setQuizIdx(i => i + 1);
  };

  return (
    <div style={{ maxWidth: 880, margin: '0 auto', padding: '28px 24px' }}>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, color: colors.phase1, fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>
          Topic 6 · Phase 1 — Foundations · XI §19.5
        </div>
        <h1 style={{ margin: 0, fontSize: 30, color: colors.text, fontWeight: 800, letterSpacing: -0.5 }}>
          Standard Derivatives
        </h1>
        <p style={{ margin: '8px 0 0', color: colors.muted, fontSize: 15, lineHeight: 1.6 }}>
          Every derivative we need was proved once from first principles. Now we just remember the results.
        </p>
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 28,
        background: 'rgba(255,255,255,0.04)', padding: 4, borderRadius: 10, width: 'fit-content' }}>
        {[
          { key: 'watch',  label: '▶ Flashcards' },
          { key: 'linear', label: '🔗 Linear Rule' },
          { key: 'quiz',   label: '🎯 Quiz' },
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

      {/* ════════════ FLASHCARDS TAB ════════════ */}
      {tab === 'watch' && (
        <motion.div key="watch" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>

          {/* Card grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12, marginBottom: 28 }}>
            {CARDS.map((c, i) => (
              <Flashcard key={c.fn} card={c} active={activeCard === i} onClick={() => setActiveCard(i)} />
            ))}
          </div>

          {/* Selected card detail */}
          <AnimatePresence mode="wait">
            <motion.div key={activeCard}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.22 }}>

              <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'flex-start' }}>

                <div style={{ flex: '1 1 280px' }}>
                  <FormulaCard
                    title={`d/dx(${card.fn})`}
                    formula={`\\frac{d}{dx}\\left(${card.fnLatex}\\right) = ${card.deriv}`}
                    note={card.note}
                    examples={card.examples.map(ex => ({
                      label: `d/dx(${ex.fn.replace(/[{}\\]/g, '')})`,
                      formula: `\\frac{d}{dx}\\left(${ex.fn}\\right) = ${ex.d}`,
                    }))}
                    accent={card.color}
                  />
                </div>

                {/* Mini graph */}
                <div style={{ flex: '1 1 240px' }}>
                  <div style={{
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 14, padding: 20,
                  }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: colors.muted,
                      textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 14 }}>
                      Quick Reference Table (XII Overview)
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, overflow: 'hidden', borderRadius: 8 }}>
                      {CARDS.map((c, i) => (
                        <div key={i} onClick={() => setActiveCard(i)} style={{
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          padding: '8px 14px',
                          background: activeCard === i ? `${c.color}15` : i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                          borderLeft: `3px solid ${activeCard === i ? c.color : 'transparent'}`,
                          cursor: 'pointer',
                          transition: 'background 0.15s',
                        }}>
                          <span style={{ fontSize: 12, color: colors.muted }}>
                            <InlineMath math={c.fnLatex} />
                          </span>
                          <span style={{ fontSize: 12, fontWeight: 600, color: activeCard === i ? c.color : colors.text }}>
                            <InlineMath math={c.deriv} />
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      )}

      {/* ════════════ LINEAR RULE TAB ════════════ */}
      {tab === 'linear' && (
        <motion.div key="linear" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>

          <FormulaCard
            title="Linear Function Rule (XI §19.5)"
            formula={"\\frac{d}{dx}[(ax+b)^n] = n(ax+b)^{n-1} \\cdot a"}
            note="When the argument is linear (ax+b), multiply by the inner derivative a."
            accent={colors.secondary}
          />

          <div style={{ marginTop: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: colors.secondary, marginBottom: 14 }}>
              Textbook Examples (XI §19.5):
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {LINEAR_EXAMPLES.map((ex, i) => (
                <div key={i} style={{
                  background: 'rgba(0,0,0,0.3)',
                  border: `1px solid ${colors.secondary}25`,
                  borderRadius: 12, padding: 16,
                  display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
                }}>
                  <div style={{ flex: '0 0 auto', minWidth: 120 }}>
                    <div style={{ fontSize: 11, color: colors.muted, marginBottom: 4 }}>{ex.source} — differentiate:</div>
                    <InlineMath math={ex.fn} />
                  </div>
                  <div style={{ fontSize: 20, color: colors.muted }}>→</div>
                  <div style={{ flex: 1 }}>
                    <InlineMath math={ex.deriv} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Extension: why does a appear? */}
          <div style={{
            marginTop: 20, padding: 20,
            background: `${colors.primary}08`, border: `1px solid ${colors.primary}20`,
            borderRadius: 14,
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: colors.primary, marginBottom: 12 }}>
              Why the extra ×a? (Preview of Chain Rule)
            </div>
            <BlockMath math={"\\frac{d}{dx}[(ax+b)^n] = n(ax+b)^{n-1} \\cdot \\underbrace{\\frac{d}{dx}(ax+b)}_{= a}"} />
            <div style={{ fontSize: 12, color: colors.muted, marginTop: 10, lineHeight: 1.7 }}>
              This is the Chain Rule in disguise! In Topic 11 you'll see the full version.
              For now, remember: when the inner argument is (ax+b), multiply your answer by a.
            </div>
          </div>

          {/* Full standard table */}
          <div style={{ marginTop: 24 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: colors.muted, marginBottom: 14 }}>
              All Standard Derivatives at a Glance (XII Overview):
            </div>
            <div style={{
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 12, overflow: 'hidden',
            }}>
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr',
                background: 'rgba(255,255,255,0.04)',
                padding: '10px 14px',
              }}>
                {['Function', 'Derivative', 'Function', 'Derivative'].map((h, i) => (
                  <div key={i} style={{ fontSize: 11, fontWeight: 700, color: colors.muted,
                    textTransform: 'uppercase', letterSpacing: 1 }}>{h}</div>
                ))}
              </div>
              {[
                ['x^n', 'nx^{n-1}', '\\sin x', '\\cos x'],
                ['\\sqrt{x}', '\\frac{1}{2\\sqrt{x}}', '\\cos x', '-\\sin x'],
                ['e^x', 'e^x', '\\tan x', '\\sec^2 x'],
                ['a^x', 'a^x \\log a', '\\cot x', '-\\text{cosec}^2 x'],
                ['\\ln x', '\\frac{1}{x}', '\\sec x', '\\sec x \\tan x'],
                ['\\log_a x', '\\frac{1}{x \\log a}', '\\text{cosec}\\, x', '-\\text{cosec}\\, x \\cot x'],
              ].map((row, i) => (
                <div key={i} style={{
                  display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr',
                  padding: '9px 14px',
                  background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)',
                  borderTop: '1px solid rgba(255,255,255,0.04)',
                }}>
                  {row.map((cell, j) => (
                    <span key={j} style={{
                      fontSize: 13,
                      color: j % 2 === 0 ? colors.text : colors.accent,
                      fontWeight: j % 2 === 1 ? 600 : 400,
                    }}>
                      <InlineMath math={cell} />
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* ════════════ QUIZ TAB ════════════ */}
      {tab === 'quiz' && (
        <motion.div key="quiz" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>

          {/* Score bar */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: 20,
          }}>
            <div style={{ fontSize: 13, color: colors.muted }}>
              Question {quizIdx + 1} of {QUIZ_QUESTIONS.length}
            </div>
            {answered > 0 && (
              <div style={{ fontSize: 13, color: colors.accent, fontWeight: 700 }}>
                Score: {score}/{answered}
              </div>
            )}
          </div>

          <QuizCard
            key={quizIdx}
            question={QUIZ_QUESTIONS[quizIdx].question}
            options={QUIZ_QUESTIONS[quizIdx].options}
            correct={QUIZ_QUESTIONS[quizIdx].correct}
            explanation={QUIZ_QUESTIONS[quizIdx].explanation}
            onAnswer={handleQuizAnswer}
          />

          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            {quizIdx < QUIZ_QUESTIONS.length - 1 && (
              <button onClick={nextQuiz} style={{
                padding: '10px 24px', borderRadius: 9, border: 'none',
                background: colors.phase1, color: '#0f0e17', fontSize: 13, fontWeight: 700,
                cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              }}>Next Question →</button>
            )}
            {quizIdx > 0 && (
              <button onClick={() => setQuizIdx(i => i - 1)} style={{
                padding: '10px 24px', borderRadius: 9,
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'transparent', color: colors.muted, fontSize: 13,
                cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              }}>← Previous</button>
            )}
          </div>

          {quizIdx === QUIZ_QUESTIONS.length - 1 && answered >= QUIZ_QUESTIONS.length && (
            <div style={{
              marginTop: 20, padding: 20,
              background: `${colors.accent}10`, border: `1px solid ${colors.accent}30`,
              borderRadius: 12, textAlign: 'center',
            }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: colors.accent, marginBottom: 8 }}>
                Quiz Complete!
              </div>
              <div style={{ fontSize: 14, color: colors.text }}>
                You scored <strong style={{ color: colors.accent }}>{score}</strong> / {QUIZ_QUESTIONS.length}
              </div>
              <button onClick={() => { setQuizIdx(0); setScore(0); setAnswered(0); }}
                style={{
                  marginTop: 12, padding: '8px 20px', borderRadius: 8, border: 'none',
                  background: colors.primary, color: 'white', fontSize: 13, fontWeight: 600,
                  cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                }}>Try Again ↩</button>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
