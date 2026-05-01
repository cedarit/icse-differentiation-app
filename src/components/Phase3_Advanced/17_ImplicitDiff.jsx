import React, { useState } from 'react';
// import { InlineMath, BlockMath } from 'react-katex';
// import GraphCanvas from '../shared/GraphCanvas';
// import StepReveal from '../shared/StepReveal';
// import TryItPanel from '../shared/TryItPanel';
// import QuizCard from '../shared/QuizCard';
// import FormulaCard from '../shared/FormulaCard';

/**
 * Topic 17: Implicit Differentiation
 * Textbook reference: XII §8.4
 * 
 * TODO — Build in this order:
 *   1. Watch section (animation / visual explanation)
 *   2. Try It section (interactive playground)
 *   3. Exercise problems (TryItPanel with steps)
 *
 * See CLAUDE.md → "Topic 17" for full spec.
 * See TEXTBOOK_REFERENCE.md for exact formulas, examples, exercise problems.
 */
const ImplicitDiff = () => {
  const [tab, setTab] = useState('watch');

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: '#f472b6', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 6 }}>
          Topic 17 · XII §8.4
        </div>
        <h1 style={{ margin: 0, fontSize: 28, color: '#e2e8f0', fontWeight: 700 }}>
          Implicit Differentiation
        </h1>
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 28, background: 'rgba(255,255,255,0.04)', padding: 4, borderRadius: 10, width: 'fit-content' }}>
        {['watch', 'try', 'exercises'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '8px 18px', borderRadius: 7, border: 'none',
            background: tab === t ? '#f472b6' : 'transparent',
            color: tab === t ? '#0f0e17' : '#94a3b8',
            fontWeight: tab === t ? 700 : 400,
            fontSize: 13, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
            textTransform: 'capitalize',
          }}>
            {{ watch: '▶ Watch', try: '🧪 Try It', exercises: '📝 Exercises' }[t]}
          </button>
        ))}
      </div>

      {/* Watch tab */}
      {tab === 'watch' && (
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 32, textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🚧</div>
          <div style={{ color: '#94a3b8', fontSize: 15 }}>
            Animation for <strong style={{ color: '#e2e8f0' }}>Topic 17: Implicit Differentiation</strong> coming soon.
          </div>
          <div style={{ marginTop: 8, color: '#64748b', fontSize: 12 }}>
            See CLAUDE.md for the build spec.
          </div>
        </div>
      )}

      {/* Try It tab */}
      {tab === 'try' && (
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 32, textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🎮</div>
          <div style={{ color: '#94a3b8', fontSize: 15 }}>
            Interactive playground for <strong style={{ color: '#e2e8f0' }}>Topic 17</strong> coming soon.
          </div>
        </div>
      )}

      {/* Exercises tab */}
      {tab === 'exercises' && (
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 32, textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📝</div>
          <div style={{ color: '#94a3b8', fontSize: 15 }}>
            Exercises from <strong style={{ color: '#e2e8f0' }}>{'XII §8.4'}</strong> coming soon.
          </div>
        </div>
      )}
    </div>
  );
};

export default ImplicitDiff;
