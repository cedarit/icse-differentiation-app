import React, { useState } from 'react';
import { colors } from '../../styles/theme';

/**
 * QuizCard — MCQ with scoring and explanation
 *
 * Props:
 *   question    — string or JSX
 *   options     — string[] — 3 or 4 options
 *   correct     — index of correct option
 *   explanation — string — shown after answering
 *   onAnswer    — (correct: bool) => void
 */
const QuizCard = ({ question, options = [], correct = 0, explanation, onAnswer }) => {
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);

  const handleSelect = (i) => {
    if (answered) return;
    setSelected(i);
    setAnswered(true);
    onAnswer?.(i === correct);
  };

  const isCorrect = answered && selected === correct;

  const reset = () => { setSelected(null); setAnswered(false); };

  const optionStyle = (i) => {
    let bg = 'rgba(255,255,255,0.05)';
    let border = 'rgba(255,255,255,0.1)';
    let color = colors.text;
    if (answered) {
      if (i === correct) { bg = 'rgba(16,185,129,0.15)'; border = colors.accent; color = colors.accent; }
      else if (i === selected) { bg = 'rgba(239,68,68,0.15)'; border = colors.danger; color = colors.danger; }
      else { bg = 'rgba(255,255,255,0.02)'; color = colors.muted; }
    } else if (selected === i) {
      bg = 'rgba(99,102,241,0.15)'; border = colors.primary;
    }
    return {
      display: 'block', width: '100%', textAlign: 'left',
      background: bg, border: `1px solid ${border}`, borderRadius: 10,
      padding: '12px 16px', color, fontSize: 14, fontWeight: 500,
      cursor: answered ? 'default' : 'pointer',
      fontFamily: 'Inter, sans-serif',
      transition: 'all 0.2s',
    };
  };

  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 14,
      padding: 20,
    }}>
      {/* Question */}
      <div style={{ fontSize: 15, color: colors.text, marginBottom: 16, lineHeight: 1.5 }}>
        {question}
      </div>

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {options.map((opt, i) => (
          <button key={i} style={optionStyle(i)} onClick={() => handleSelect(i)}>
            <span style={{ color: colors.muted, marginRight: 8, fontSize: 12 }}>
              {['A', 'B', 'C', 'D'][i]}.
            </span>
            {opt}
            {answered && i === correct && <span style={{ float: 'right' }}>✓</span>}
            {answered && i === selected && i !== correct && <span style={{ float: 'right' }}>✗</span>}
          </button>
        ))}
      </div>

      {/* Result + explanation */}
      {answered && (
        <div style={{
          marginTop: 16,
          padding: '12px 16px',
          background: isCorrect ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
          border: `1px solid ${isCorrect ? colors.accent : colors.danger}40`,
          borderRadius: 10,
        }}>
          <div style={{ fontWeight: 600, color: isCorrect ? colors.accent : colors.danger, marginBottom: 6 }}>
            {isCorrect ? '🎉 Correct!' : '❌ Not quite'}
          </div>
          {explanation && (
            <div style={{ color: colors.muted, fontSize: 13, lineHeight: 1.6 }}>{explanation}</div>
          )}
        </div>
      )}

      {answered && (
        <button onClick={reset} style={{
          marginTop: 12, background: 'none',
          border: `1px solid rgba(255,255,255,0.1)`,
          borderRadius: 8, padding: '7px 14px',
          color: colors.muted, fontSize: 12, cursor: 'pointer',
          fontFamily: 'Inter, sans-serif',
        }}>
          Try again ↩
        </button>
      )}
    </div>
  );
};

export default QuizCard;
