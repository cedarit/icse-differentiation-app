export const colors = {
  primary:   '#6366f1',  // indigo — main function color
  secondary: '#f59e0b',  // amber — second function / highlight
  accent:    '#10b981',  // emerald — tangent lines / answers
  danger:    '#ef4444',  // red — wrong answers
  surface:   '#1e1b4b',  // dark indigo — card backgrounds
  bg:        '#0f0e17',  // near-black — page background
  text:      '#e2e8f0',  // light — main text
  muted:     '#94a3b8',  // slate — labels, secondary text
  phase1:    '#818cf8',  // indigo-400 — Phase 1 (XI foundations)
  phase2:    '#34d399',  // emerald-400 — Phase 2 (bridge)
  phase3:    '#f472b6',  // pink-400 — Phase 3 (XII advanced)
  gridLine:  '#1e293b',  // subtle grid lines
  axisLine:  '#334155',  // slightly visible axes
};

export const fonts = {
  heading: "'Inter', sans-serif",
  mono: "'JetBrains Mono', monospace",
};

export const phases = [
  {
    id: 1,
    name: 'Foundations',
    label: 'Class XI',
    color: colors.phase1,
    topics: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  },
  {
    id: 2,
    name: 'Intermediate',
    label: 'XI → XII',
    color: colors.phase2,
    topics: [11, 12, 13, 14, 15],
  },
  {
    id: 3,
    name: 'Advanced',
    label: 'Class XII',
    color: colors.phase3,
    topics: [16, 17, 18, 19, 20],
  },
];
