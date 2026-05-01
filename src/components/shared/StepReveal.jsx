import React, { useState, useEffect } from 'react';
import { colors } from '../../styles/theme';

/**
 * StepReveal — animated step-by-step algebraic derivation display
 *
 * Props:
 *   steps      — [{ label, content, highlight }] — array of steps
 *   autoPlay   — bool — auto-advance steps (default false)
 *   interval   — ms between auto-steps (default 1800)
 *   onComplete — callback when all steps shown
 */
const StepReveal = ({ steps = [], autoPlay = false, interval = 1800, onComplete }) => {
  const [revealed, setRevealed] = useState(0);
  const [playing, setPlaying] = useState(autoPlay);

  useEffect(() => {
    if (!playing) return;
    if (revealed >= steps.length) {
      setPlaying(false);
      onComplete?.();
      return;
    }
    const timer = setTimeout(() => setRevealed(r => r + 1), interval);
    return () => clearTimeout(timer);
  }, [playing, revealed, steps.length, interval, onComplete]);

  const showNext = () => {
    if (revealed < steps.length) setRevealed(r => r + 1);
    if (revealed + 1 >= steps.length) onComplete?.();
  };

  const reset = () => { setRevealed(0); setPlaying(false); };
  const playAll = () => { setRevealed(1); setPlaying(true); };

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Steps */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {steps.slice(0, revealed).map((step, i) => (
          <div
            key={i}
            className="step-enter"
            style={{
              background: step.highlight
                ? `rgba(99,102,241,0.12)`
                : 'rgba(255,255,255,0.04)',
              border: `1px solid ${step.highlight ? colors.primary : 'rgba(255,255,255,0.08)'}`,
              borderRadius: 10,
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 12,
            }}
          >
            {/* Step number badge */}
            <div style={{
              minWidth: 28, height: 28,
              borderRadius: '50%',
              background: colors.primary,
              color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700, flexShrink: 0,
            }}>
              {i + 1}
            </div>
            <div style={{ flex: 1 }}>
              {step.label && (
                <div style={{ fontSize: 11, color: colors.muted, fontWeight: 500, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>
                  {step.label}
                </div>
              )}
              <div style={{ color: colors.text, fontSize: 15 }}>
                {step.content}
              </div>
            </div>
          </div>
        ))}

        {/* Locked steps preview */}
        {steps.slice(revealed).map((_, i) => (
          <div
            key={`locked-${i}`}
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.04)',
              borderRadius: 10,
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              opacity: 0.4,
            }}
          >
            <div style={{
              minWidth: 28, height: 28, borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, color: colors.muted,
            }}>
              {revealed + i + 1}
            </div>
            <div style={{ height: 10, background: 'rgba(255,255,255,0.08)', borderRadius: 5, flex: 1 }} />
          </div>
        ))}
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 10, marginTop: 16, alignItems: 'center' }}>
        {revealed < steps.length && !playing && (
          <>
            <button onClick={showNext} style={btnStyle(colors.primary)}>
              Next Step →
            </button>
            <button onClick={playAll} style={btnStyle('rgba(255,255,255,0.1)')}>
              ▶ Play All
            </button>
          </>
        )}
        {playing && (
          <button onClick={() => setPlaying(false)} style={btnStyle(colors.secondary)}>
            ⏸ Pause
          </button>
        )}
        {revealed > 0 && (
          <button onClick={reset} style={btnStyle('rgba(255,255,255,0.07)')}>
            ↩ Reset
          </button>
        )}
        {revealed === steps.length && !playing && (
          <span style={{ color: colors.accent, fontSize: 13, fontWeight: 500 }}>
            ✓ All steps shown
          </span>
        )}
      </div>
    </div>
  );
};

const btnStyle = (bg) => ({
  background: bg,
  color: 'white',
  border: 'none',
  borderRadius: 8,
  padding: '8px 16px',
  fontSize: 13,
  fontWeight: 500,
  cursor: 'pointer',
  fontFamily: 'Inter, sans-serif',
});

export default StepReveal;
