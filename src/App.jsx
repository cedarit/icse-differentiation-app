import React, { useState } from 'react';
import { colors, phases } from './styles/theme';

// Phase 1 — Foundations
import RateOfChange        from './components/Phase1_Foundations/01_RateOfChange';
import SlopeOfLine         from './components/Phase1_Foundations/02_SlopeOfLine';
import SlopeOfCurve        from './components/Phase1_Foundations/03_SlopeOfCurve';
import LimitsVisualiser    from './components/Phase1_Foundations/04_LimitsVisualiser';
import FirstPrinciples     from './components/Phase1_Foundations/05_FirstPrinciples';
import StandardDerivatives from './components/Phase1_Foundations/06_StandardDerivatives';
import SumRule             from './components/Phase1_Foundations/07_SumRule';
import ProductRule         from './components/Phase1_Foundations/08_ProductRule';
import QuotientRule        from './components/Phase1_Foundations/09_QuotientRule';
import TrigDerivatives     from './components/Phase1_Foundations/10_TrigDerivatives';

// Phase 2 — Intermediate
import ChainRule              from './components/Phase2_Intermediate/11_ChainRule';
import ChainRuleTrig          from './components/Phase2_Intermediate/12_ChainRuleTrig';
import ExponentialDerivatives from './components/Phase2_Intermediate/13_ExponentialDerivatives';
import LogDerivatives         from './components/Phase2_Intermediate/14_LogDerivatives';
import LogDifferentiation     from './components/Phase2_Intermediate/15_LogDifferentiation';

// Phase 3 — Advanced
import InverseTrigDerivatives  from './components/Phase3_Advanced/16_InverseTrigDerivatives';
import ImplicitDiff            from './components/Phase3_Advanced/17_ImplicitDiff';
import ParametricDiff          from './components/Phase3_Advanced/18_ParametricDiff';
import SecondDerivative        from './components/Phase3_Advanced/19_SecondDerivative';
import DiffWrtAnotherFunction  from './components/Phase3_Advanced/20_DiffWrtAnotherFunction';

const TOPICS = [
  { id: 1,  phase: 1, title: 'Rate of Change',               icon: '📈', component: RateOfChange },
  { id: 2,  phase: 1, title: 'Slope of a Line',              icon: '📐', component: SlopeOfLine },
  { id: 3,  phase: 1, title: 'Slope of a Curve',             icon: '〰️', component: SlopeOfCurve },
  { id: 4,  phase: 1, title: 'Limits',                       icon: '🎯', component: LimitsVisualiser },
  { id: 5,  phase: 1, title: 'First Principles',             icon: '🔬', component: FirstPrinciples },
  { id: 6,  phase: 1, title: 'Standard Derivatives',         icon: '📋', component: StandardDerivatives },
  { id: 7,  phase: 1, title: 'Sum & Difference Rule',        icon: '➕', component: SumRule },
  { id: 8,  phase: 1, title: 'Product Rule',                 icon: '✖️', component: ProductRule },
  { id: 9,  phase: 1, title: 'Quotient Rule',                icon: '➗', component: QuotientRule },
  { id: 10, phase: 1, title: 'Trig Derivatives',             icon: '🌊', component: TrigDerivatives },
  { id: 11, phase: 2, title: 'Chain Rule',                   icon: '🔗', component: ChainRule },
  { id: 12, phase: 2, title: 'Chain Rule + Trig',            icon: '🌀', component: ChainRuleTrig },
  { id: 13, phase: 2, title: 'Exponential Derivatives',      icon: '🚀', component: ExponentialDerivatives },
  { id: 14, phase: 2, title: 'Log Derivatives',              icon: '📊', component: LogDerivatives },
  { id: 15, phase: 2, title: 'Log Differentiation',          icon: '🔁', component: LogDifferentiation },
  { id: 16, phase: 3, title: 'Inverse Trig Derivatives',     icon: '↩️', component: InverseTrigDerivatives },
  { id: 17, phase: 3, title: 'Implicit Differentiation',     icon: '🔀', component: ImplicitDiff },
  { id: 18, phase: 3, title: 'Parametric Differentiation',   icon: '🎬', component: ParametricDiff },
  { id: 19, phase: 3, title: 'Second Order Derivatives',     icon: '2️⃣', component: SecondDerivative },
  { id: 20, phase: 3, title: 'Diff w.r.t. Another Function', icon: '🔄', component: DiffWrtAnotherFunction },
];

const phaseColor = { 1: colors.phase1, 2: colors.phase2, 3: colors.phase3 };
const phaseLabel = { 1: 'Class XI', 2: 'XI → XII', 3: 'Class XII' };

export default function App() {
  const [activeTopic, setActiveTopic] = useState(1);
  const [completed, setCompleted]     = useState(new Set());
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const topic = TOPICS.find(t => t.id === activeTopic);
  const TopicComponent = topic?.component;
  const progress = Math.round((completed.size / TOPICS.length) * 100);

  const markDone = () => setCompleted(prev => new Set([...prev, activeTopic]));
  const goNext   = () => {
    markDone();
    if (activeTopic < 20) setActiveTopic(activeTopic + 1);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', fontFamily: 'Inter, sans-serif', background: colors.bg }}>

      {/* ── Sidebar ── */}
      <aside style={{
        width: sidebarOpen ? 280 : 0,
        minWidth: sidebarOpen ? 280 : 0,
        background: '#0c0b18',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'width 0.3s ease, min-width 0.3s ease',
        flexShrink: 0,
      }}>
        {/* Logo */}
        <div style={{ padding: '20px 20px 12px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: colors.primary }}>∂iff</div>
          <div style={{ fontSize: 11, color: colors.muted, marginTop: 2 }}>Differentiation · ICSE XI–XII</div>
          {/* Progress bar */}
          <div style={{ marginTop: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: colors.muted, marginBottom: 4 }}>
              <span>Progress</span><span>{progress}%</span>
            </div>
            <div style={{ height: 4, background: 'rgba(255,255,255,0.07)', borderRadius: 2 }}>
              <div style={{ height: '100%', width: `${progress}%`, background: colors.primary, borderRadius: 2, transition: 'width 0.5s ease' }} />
            </div>
          </div>
        </div>

        {/* Topic list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
          {phases.map(phase => (
            <div key={phase.id}>
              {/* Phase header */}
              <div style={{
                padding: '12px 20px 6px',
                fontSize: 10, fontWeight: 700,
                color: phaseColor[phase.id],
                textTransform: 'uppercase', letterSpacing: 1.5,
              }}>
                Phase {phase.id} · {phaseLabel[phase.id]}
              </div>

              {/* Topics in this phase */}
              {TOPICS.filter(t => t.phase === phase.id).map(t => {
                const isActive = t.id === activeTopic;
                const isDone   = completed.has(t.id);
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveTopic(t.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      width: '100%', textAlign: 'left',
                      padding: '9px 20px',
                      background: isActive ? `${phaseColor[t.phase]}18` : 'transparent',
                      borderLeft: isActive ? `3px solid ${phaseColor[t.phase]}` : '3px solid transparent',
                      border: 'none', cursor: 'pointer',
                      transition: 'background 0.15s',
                    }}
                  >
                    <span style={{ fontSize: 14 }}>{t.icon}</span>
                    <span style={{
                      flex: 1, fontSize: 13,
                      color: isActive ? colors.text : colors.muted,
                      fontWeight: isActive ? 600 : 400,
                    }}>
                      {t.id}. {t.title}
                    </span>
                    {isDone && <span style={{ fontSize: 10, color: colors.accent }}>✓</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </aside>

      {/* ── Main content ── */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Top bar */}
        <div style={{
          height: 52,
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center',
          padding: '0 20px', gap: 14, flexShrink: 0,
          background: '#0c0b18',
        }}>
          {/* Sidebar toggle */}
          <button
            onClick={() => setSidebarOpen(o => !o)}
            style={{ background: 'none', border: 'none', color: colors.muted, cursor: 'pointer', fontSize: 18, padding: 4 }}
          >
            ☰
          </button>

          {/* Breadcrumb */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, color: phaseColor[topic?.phase] || colors.muted, fontWeight: 600 }}>
              Phase {topic?.phase} · {phaseLabel[topic?.phase]}
            </span>
            <span style={{ color: 'rgba(255,255,255,0.15)' }}>›</span>
            <span style={{ fontSize: 13, color: colors.text, fontWeight: 500 }}>
              {topic?.icon} {topic?.title}
            </span>
          </div>

          {/* Nav buttons */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {activeTopic > 1 && (
              <button onClick={() => setActiveTopic(activeTopic - 1)} style={navBtn}>← Prev</button>
            )}
            {activeTopic < 20 && (
              <button onClick={goNext} style={{ ...navBtn, background: colors.primary, color: 'white' }}>
                Next → {completed.has(activeTopic) ? '' : '✓'}
              </button>
            )}
            {activeTopic === 20 && (
              <button onClick={markDone} style={{ ...navBtn, background: colors.accent, color: '#0f0e17' }}>
                ✓ Complete
              </button>
            )}
          </div>
        </div>

        {/* Topic content — scrollable */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {TopicComponent && <TopicComponent />}
        </div>
      </main>
    </div>
  );
}

const navBtn = {
  padding: '6px 14px', borderRadius: 8,
  border: '1px solid rgba(255,255,255,0.1)',
  background: 'transparent', color: colors.muted,
  fontSize: 12, fontWeight: 500, cursor: 'pointer',
  fontFamily: 'Inter, sans-serif',
};
