import React, { useState } from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import { colors } from '../../styles/theme';

/**
 * FormulaCard — styled KaTeX formula display with optional proof toggle
 *
 * Props:
 *   title      — string — card title
 *   formula    — string — KaTeX string for the main formula
 *   note       — string — plain English explanation
 *   proof      — JSX | string — expandable proof content
 *   examples   — [{ label, formula }] — quick examples
 *   accent     — color string — card accent color
 */
const FormulaCard = ({ title, formula, note, proof, examples = [], accent = colors.primary }) => {
  const [showProof, setShowProof] = useState(false);

  return (
    <div style={{
      background: `linear-gradient(135deg, rgba(99,102,241,0.08), rgba(99,102,241,0.03))`,
      border: `1px solid ${accent}40`,
      borderRadius: 14,
      overflow: 'hidden',
    }}>
      {/* Accent bar */}
      <div style={{ height: 3, background: `linear-gradient(90deg, ${accent}, ${accent}80)` }} />

      <div style={{ padding: 20 }}>
        {/* Title */}
        {title && (
          <div style={{
            fontSize: 12, fontWeight: 700, color: accent,
            textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12,
          }}>
            {title}
          </div>
        )}

        {/* Main formula */}
        {formula && (
          <div style={{
            background: 'rgba(0,0,0,0.3)',
            borderRadius: 10,
            padding: '14px 18px',
            marginBottom: note || examples.length ? 14 : 0,
            textAlign: 'center',
            fontSize: 18,
          }}>
            <BlockMath math={formula} />
          </div>
        )}

        {/* Plain English note */}
        {note && (
          <div style={{
            color: colors.muted, fontSize: 13, lineHeight: 1.7,
            marginBottom: examples.length ? 12 : 0,
            padding: '10px 14px',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: 8,
            borderLeft: `3px solid ${accent}60`,
          }}>
            {note}
          </div>
        )}

        {/* Examples */}
        {examples.length > 0 && (
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 11, color: colors.muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
              Quick Examples
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {examples.map((ex, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '8px 12px',
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: 8,
                }}>
                  {ex.label && (
                    <span style={{ color: colors.muted, fontSize: 12, minWidth: 80 }}>{ex.label}</span>
                  )}
                  <span style={{ fontSize: 14 }}>
                    <InlineMath math={ex.formula} />
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Proof toggle */}
        {proof && (
          <div style={{ marginTop: 14 }}>
            <button
              onClick={() => setShowProof(p => !p)}
              style={{
                background: 'none', border: `1px solid rgba(255,255,255,0.1)`,
                borderRadius: 8, padding: '7px 14px',
                color: colors.muted, fontSize: 12, cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              {showProof ? '▼ Hide Proof' : '▶ Show Proof'}
            </button>
            {showProof && (
              <div style={{
                marginTop: 12,
                padding: 16,
                background: 'rgba(0,0,0,0.2)',
                borderRadius: 10,
                color: colors.text,
                fontSize: 13,
                lineHeight: 1.8,
              }}>
                {proof}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FormulaCard;
