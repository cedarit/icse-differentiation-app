import React, { useState } from 'react';
import { colors } from '../../styles/theme';
import StepReveal from './StepReveal';

/**
 * TryItPanel — "Try It" / "Show Me" toggle for practice problems
 *
 * Props:
 *   problem    — string or JSX — the problem statement
 *   hint       — string — hint shown after first attempt
 *   answer     — JSX — the final answer
 *   steps      — array for StepReveal — step-by-step solution
 *   source     — string — textbook reference (e.g. "Exercise 19(A), Q3")
 */
const TryItPanel = ({ problem, hint, answer, steps = [], source }) => {
  const [mode, setMode] = useState(null); // null | 'try' | 'show'
  const [showHint, setShowHint] = useState(false);

  return (
    <div style={{
      border: `1px solid rgba(255,255,255,0.1)`,
      borderRadius: 14,
      overflow: 'hidden',
      background: 'rgba(255,255,255,0.03)',
    }}>
      {/* Header */}
      <div style={{
        padding: '14px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 8,
      }}>
        <div>
          <div style={{ fontSize: 13, color: colors.muted, marginBottom: 4 }}>
            {source || 'Practice Problem'}
          </div>
          <div style={{ fontSize: 16, color: colors.text, fontWeight: 500 }}>
            {problem}
          </div>
        </div>

        {/* Mode buttons */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => { setMode('try'); setShowHint(false); setAttempted(true); }}
            style={{
              ...modeBtnStyle,
              background: mode === 'try' ? colors.accent : 'rgba(255,255,255,0.07)',
              color: mode === 'try' ? '#0f0e17' : colors.text,
            }}
          >
            ✏️ I'll Try
          </button>
          <button
            onClick={() => setMode('show')}
            style={{
              ...modeBtnStyle,
              background: mode === 'show' ? colors.primary : 'rgba(255,255,255,0.07)',
              color: mode === 'show' ? 'white' : colors.text,
            }}
          >
            👁 Show Me
          </button>
        </div>
      </div>

      {/* Content area */}
      {mode === 'try' && (
        <div style={{ padding: 20 }}>
          <div style={{
            background: 'rgba(16,185,129,0.08)',
            border: '1px solid rgba(16,185,129,0.2)',
            borderRadius: 10,
            padding: 16,
            marginBottom: 16,
            color: colors.muted,
            fontSize: 14,
          }}>
            Work it out on paper, then reveal your hint or the answer below.
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {hint && (
              <button onClick={() => setShowHint(h => !h)} style={btnStyle('rgba(245,158,11,0.15)', colors.secondary)}>
                {showHint ? 'Hide Hint' : '💡 Show Hint'}
              </button>
            )}
            <button onClick={() => setMode('show')} style={btnStyle('rgba(99,102,241,0.15)', colors.primary)}>
              Reveal Answer →
            </button>
          </div>

          {showHint && hint && (
            <div style={{
              marginTop: 14,
              padding: 14,
              background: 'rgba(245,158,11,0.08)',
              border: '1px dashed rgba(245,158,11,0.3)',
              borderRadius: 10,
              color: colors.secondary,
              fontSize: 14,
            }}>
              💡 <strong>Hint:</strong> {hint}
            </div>
          )}
        </div>
      )}

      {mode === 'show' && (
        <div style={{ padding: 20 }}>
          {/* Final answer */}
          {answer && (
            <div style={{
              padding: '12px 18px',
              background: 'rgba(16,185,129,0.1)',
              border: '1px solid rgba(16,185,129,0.25)',
              borderRadius: 10,
              marginBottom: steps.length ? 20 : 0,
              color: colors.accent,
              fontSize: 16,
              fontWeight: 500,
            }}>
              ✓ Answer: {answer}
            </div>
          )}

          {/* Step-by-step */}
          {steps.length > 0 && (
            <>
              <div style={{ fontSize: 13, color: colors.muted, marginBottom: 12, fontWeight: 500 }}>
                Step-by-step solution:
              </div>
              <StepReveal steps={steps} />
            </>
          )}
        </div>
      )}
    </div>
  );
};

const modeBtnStyle = {
  padding: '8px 16px',
  borderRadius: 8,
  border: 'none',
  fontSize: 13,
  fontWeight: 500,
  cursor: 'pointer',
  fontFamily: 'Inter, sans-serif',
};

const btnStyle = (bg, color) => ({
  background: bg,
  color: color,
  border: `1px solid ${color}40`,
  borderRadius: 8,
  padding: '8px 16px',
  fontSize: 13,
  fontWeight: 500,
  cursor: 'pointer',
  fontFamily: 'Inter, sans-serif',
});

export default TryItPanel;
