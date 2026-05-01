# CLAUDE.md — Differentiation Interactive App

## What This Project Is

An interactive, animated React app that teaches **Differentiation** to ICSE students,
starting from Class XI foundations and building to Class XII advanced techniques.

**Two source textbooks:**
- Class XI: Chapter 19 — ISC Mathematics XI (increments, first principles, basic rules, trig proofs)
- Class XII: Chapter 8 — AaHana Maths XII (chain rule, log/exp/inverse trig, implicit, parametric)

**Key design principles:**
- Visual first — every concept has an animation before the formula
- Every topic has two modes: **Watch** (animated) and **Try It** (playground)
- Every solved example has **"Show Me"** and **"I'll Try"** modes
- All formulas and examples must match TEXTBOOK_REFERENCE.md exactly
- Students are Class XI age — keep language friendly, not dry

---

## Tech Stack

```
React 18 (Create React App)
KaTeX + react-katex       → math formula rendering
Framer Motion             → animations
recharts                  → simple function plots
SVG (inline)              → custom coordinate graphs
Tailwind CSS              → styling
```

Install command:
```bash
npm install react-katex katex framer-motion recharts
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

---

## Project Structure

```
src/
  App.jsx                          ← navigation shell + progress tracker
  index.css                        ← global styles + KaTeX import
  styles/
    theme.js                       ← color palette, font sizes
  components/
    shared/
      GraphCanvas.jsx              ← reusable SVG coordinate grid ✅ BUILT
      StepReveal.jsx               ← animated step-by-step reveal ✅ BUILT
      TryItPanel.jsx               ← Try It / Show Me toggle ✅ BUILT
      QuizCard.jsx                 ← MCQ with scoring ✅ BUILT
      FormulaCard.jsx              ← styled KaTeX formula display ✅ BUILT
    Phase1_Foundations/
      01_RateOfChange.jsx          ← Topic 1
      02_SlopeOfLine.jsx           ← Topic 2
      03_SlopeOfCurve.jsx          ← Topic 3
      04_LimitsVisualiser.jsx      ← Topic 4
      05_FirstPrinciples.jsx       ← Topic 5
      06_StandardDerivatives.jsx   ← Topic 6
      07_SumRule.jsx               ← Topic 7
      08_ProductRule.jsx           ← Topic 8
      09_QuotientRule.jsx          ← Topic 9
      10_TrigDerivatives.jsx       ← Topic 10
    Phase2_Intermediate/
      11_ChainRule.jsx             ← Topic 11
      12_ChainRuleTrig.jsx         ← Topic 12
      13_ExponentialDerivatives.jsx← Topic 13
      14_LogDerivatives.jsx        ← Topic 14
      15_LogDifferentiation.jsx    ← Topic 15
    Phase3_Advanced/
      16_InverseTrigDerivatives.jsx← Topic 16
      17_ImplicitDiff.jsx          ← Topic 17
      18_ParametricDiff.jsx        ← Topic 18
      19_SecondDerivative.jsx      ← Topic 19
      20_DiffWrtAnotherFunction.jsx← Topic 20
```

---

## Shared Components — API Reference

### `<GraphCanvas>`
```jsx
<GraphCanvas
  width={500} height={400}
  xRange={[-5, 5]} yRange={[-3, 8]}
  functions={[
    { fn: x => x*x, color: '#6366f1', label: 'y = x²' },
    { fn: x => 2*x,  color: '#f59e0b', label: "y' = 2x" }
  ]}
  showGrid={true}
  showAxes={true}
  markedPoints={[{ x: 2, y: 4, label: 'P(2,4)' }]}
  tangentAt={{ x: 2, fn: x => x*x, color: '#10b981' }}
  draggablePoint={{ initial: 2, onChange: (x) => setX(x) }}
/>
```

### `<StepReveal>`
```jsx
<StepReveal
  steps={[
    { label: 'Step 1', content: <KaTeX>{'\\frac{dy}{dx} = \\lim_{h \\to 0}'}</KaTeX> },
    { label: 'Step 2', content: <p>Simplify...</p> },
  ]}
  autoPlay={false}
/>
```

### `<TryItPanel>`
```jsx
<TryItPanel
  problem="Find d/dx of sin(3x²)"
  hint="Apply chain rule: outer = sin, inner = 3x²"
  answer={<KaTeX>{'6x\\cos(3x^2)'}</KaTeX>}
  steps={[...]}
/>
```

### `<QuizCard>`
```jsx
<QuizCard
  question="What is d/dx(x⁵)?"
  options={['5x⁴', '5x⁵', 'x⁴', '4x⁵']}
  correct={0}
  explanation="Power rule: bring power down, reduce by 1"
/>
```

### `<FormulaCard>`
```jsx
<FormulaCard
  title="Chain Rule"
  formula={'\\frac{dy}{dx} = f\'(g(x)) \\cdot g\'(x)'}
  note="Differentiate outer, evaluate at inner, multiply by derivative of inner"
/>
```

---

## Topic Build Instructions

Work on **one topic at a time**. For each topic:
1. Read the topic spec below
2. Check TEXTBOOK_REFERENCE.md for exact examples and exercise problems to use
3. Use shared components wherever possible
4. Build the Watch animation first, then the Try It playground, then the exercise problems
5. Test that it renders without errors before moving on

**Build order (do not skip ahead):**
1. Shared components (already scaffolded — complete them first)
2. Topics 2 → 3 → 5 (visual spine — get these looking great)
3. Topics 1 → 4 (intuition builders)
4. Topics 6 → 10 (rules)
5. Topics 11 → 15 (chain rule family)
6. Topics 16 → 20 (advanced)

---

## Topic Specs

### Topic 1 — Rate of Change
**File:** `Phase1_Foundations/01_RateOfChange.jsx`  
**XI link:** Section 19.1 — Increments (δx, δy)  
**Animation:** Three real-world examples (car speed, plant growth, money earned). Each shows output changing as input changes. Unified message: "Change in output per unit change in input."  
**Playground:** Slider for "hours worked" → money earned. Change rate → see slope change.  
**Key visual:** Show the increment table from textbook (y = x², x goes from 3 to 3+h)  
**Exercise problems:** The numerical increment table from Section 19.1

---

### Topic 2 — Slope of a Line
**File:** `Phase1_Foundations/02_SlopeOfLine.jsx`  
**Animation:** Coordinate grid, two draggable points, right-angle triangle showing rise/run, slope = Δy/Δx computed live.  
**Playground:** Drag either point → triangle, values, slope all update live.  
**Covers:** positive slope, negative slope, zero slope, undefined (vertical line)  
**No textbook exercises** — this is pure visual intuition.

---

### Topic 3 — Slope of a Curve: The Problem
**File:** `Phase1_Foundations/03_SlopeOfCurve.jsx`  
**Animation:** y = x² drawn. Point P placed. Ask "what is the slope here?" Show secant from P to Q. Bring Q → P. Secant becomes tangent.  
**Playground:** Drag P along the curve. Tangent rotates. Slope = 2x updates. Show how slope is negative left of 0, zero at 0, positive right of 0.  
**Key line:** "The slope of a curve changes at every point — that's why we need Differentiation."

---

### Topic 4 — Limits: Getting Closer
**File:** `Phase1_Foundations/04_LimitsVisualiser.jsx`  
**XI link:** Section 19.2 and Exercise 19(E) limit problems  
**Animation:** f(x) = (x²−1)/(x−1). Table of values approaching x=1. Graph with hollow circle at x=1.  
**Playground:** Slider → x approaches 1 from both sides. Table fills row by row.  
**Exercise problems:** Use the 6 limit VSA problems from Exercise 19(E)  
**Key results shown:** lim(x→0)[sin x/x] = 1, lim(x→0)[tan x/x] = 1 (needed later for trig derivatives)

---

### Topic 5 — First Principles
**File:** `Phase1_Foundations/05_FirstPrinciples.jsx`  
**XI link:** Section 19.4 — full first principles method  
**Animation:** y = x². P at (x, x²), Q at (x+h, (x+h)²). Secant → tangent as h→0. Algebra simplifies step by step.  
**Playground:** Dropdown: y = x², y = x³, y = √x, y = 1/x³, y = (ax+b)/(cx+d). Slider for h. Watch Q move and algebra update.  
**Exercises:** Use Exercise 19(A) problems 1–12 with Try It / Show Me mode  
**Must include:** The velocity interpretation (Section 19.3) as a tab/panel

---

### Topic 6 — Standard Derivatives
**File:** `Phase1_Foundations/06_StandardDerivatives.jsx`  
**XI + XII link:** Section 19.5 (xⁿ) + XII overview card  
**Animation:** Flashcard flip for each formula. Mini graph showing f and f' side by side.  
**Quiz mode:** Show function → pick derivative from 3 options → score  
**Must include:** Linear function rule [d/dx[(ax+b)ⁿ] = n(ax+b)^(n−1)·a] with examples from textbook

---

### Topic 7 — Sum & Difference Rule
**File:** `Phase1_Foundations/07_SumRule.jsx`  
**XI link:** Section 19.6 (General Theorems)  
**Animation:** Two function graphs → sum graph → show derivatives add  
**Playground:** Pick u, v from dropdown → auto-compute d/dx(u+v) step by step  
**Exercises:** Textbook worked examples from Section 19.6

---

### Topic 8 — Product Rule
**File:** `Phase1_Foundations/08_ProductRule.jsx`  
**XI link:** Section 19.7  
**Animation:** Rectangle with sides u, v. Area = uv. Growing rectangle shows three new pieces.  
**Worked example:** y = x⁻¹·sin x (from textbook)  
**Exercises:** Exercise 19(C) problems 1–4

---

### Topic 9 — Quotient Rule
**File:** `Phase1_Foundations/09_QuotientRule.jsx`  
**XI link:** Section 19.8  
**Mnemonic card:** "Low D-High minus High D-Low, square the bottom"  
**Worked examples:** y = (2x+5)/(3−x)², y = (x²−3)/(2x+5) from Exercise 19(C)  
**Exercises:** 19(C) problems 5–7

---

### Topic 10 — Derivatives of Trig Functions
**File:** `Phase1_Foundations/10_TrigDerivatives.jsx`  
**XI link:** Section 19.9 (full proofs from first principles)  
**Animation:** Synchronized graphs of sin x and cos x. Moving point on sin x, tangent slope = cos x value.  
**Playground:** Slider x ∈ [0, 2π] → point moves on sin x, tangent updates, slope value shown = cos(x)  
**Include:** All 6 trig proofs (sin, cos, tan, cot, sec, cosec) in expandable panels  
**Include:** Linear argument rule — d/dx[sin(ax+b)] etc.  
**Memory aid:** "co-functions have negative derivatives"

---

### Topic 11 — Chain Rule
**File:** `Phase2_Intermediate/11_ChainRule.jsx`  
**XII link:** Section 8.3  
**Animation:** Function machine diagram — x → [g] → g(x) → [f] → f(g(x))  
**Main example:** y = sin(x²) → outer = sin, inner = x² → dy/dx = cos(x²)·2x  
**Multi-layer:** y = tan³(sin(√(ax+b))) — the textbook example with 4 layers  
**Exercises:** Exercise 8(A) problems 1–6

---

### Topic 12 — Chain Rule with Trig (Extended)
**File:** `Phase2_Intermediate/12_ChainRuleTrig.jsx`  
**XII link:** Section 8.6 (examples from EXERCISE 8A #17–21)  
**Worked examples from textbook:**
  - d/dx[tan 4x] = 4sec²4x
  - d/dx[sin²(√x)] = sin(√x)cos(√x)/√x
  - d/dx[sin²(3x+5)] = 6sin(3x+5)cos(3x+5)
  - d/dx[sin(cos x²)] = −2x·cos(cos x²)·sin x²  
**Playground:** Drag-and-drop function tile builder

---

### Topic 13 — Exponential Derivatives
**File:** `Phase2_Intermediate/13_ExponentialDerivatives.jsx`  
**XII link:** Section 8.11  
**Animation:** eˣ and its derivative overlapping (the "self-mirror" reveal)  
**Playground:** Slider for base a → see aˣ and aˣ·log(a) scale  
**Exercises:** Exercise 8(C) problems 1–4

---

### Topic 14 — Logarithmic Derivatives
**File:** `Phase2_Intermediate/14_LogDerivatives.jsx`  
**XII link:** Section 8.12  
**Animation:** Graph of log x with tangent — slope = 1/x  
**Worked examples:** log(tan x), log(sin x), log(x²+1), log(log x) from textbook  
**Exercises:** Exercise 8(D)

---

### Topic 15 — Logarithmic Differentiation (y = uᵛ)
**File:** `Phase2_Intermediate/15_LogDifferentiation.jsx`  
**XII link:** Section 8.13  
**Animation:** "Why normal rules fail" → "Take log both sides" → step-by-step  
**Examples:** y = xˣ, y = xˢⁱⁿˣ, y = (sin x)ˣ from textbook

---

### Topic 16 — Inverse Trig Derivatives
**File:** `Phase3_Advanced/16_InverseTrigDerivatives.jsx`  
**XII link:** Sections 8.14–8.17  
**Animation:** Unit circle + proof for sin⁻¹x  
**Include:** All 6 inverse trig derivatives with proofs, formula table  
**Worked examples:** sin⁻¹(4x), tan⁻¹(sin√x), substitution examples (sin⁻¹(2x√(1−x²)), cos⁻¹(4x³−3x))

---

### Topic 17 — Implicit Differentiation
**File:** `Phase3_Advanced/17_ImplicitDiff.jsx`  
**XII link:** Section 8.4 (Implicit functions)  
**Main example:** x² + 5xy − y² = 2x from textbook  
**Visual:** Click a point on a circle → see tangent + slope = −x/y

---

### Topic 18 — Parametric Differentiation
**File:** `Phase3_Advanced/18_ParametricDiff.jsx`  
**XII link:** Section 8.5  
**Animation:** Particle tracing x = cos t, y = sin t. Clock for t. dx/dt and dy/dt as velocity arrows.  
**Formula:** dy/dx = (dy/dt)/(dx/dt)  
**Example:** x = t², y = 2t → dy/dx = 1/t

---

### Topic 19 — Second Order Derivatives
**File:** `Phase3_Advanced/19_SecondDerivative.jsx`  
**XII link:** Section 8.8  
**Animation:** Three stacked graphs: f, f', f'' synchronized  
**Textbook example:** y = tan x → d²y/dx² = 2tan x·sec²x  
**Show:** Concave up (f''>0) vs concave down (f''<0)

---

### Topic 20 — Differentiation w.r.t. Another Function
**File:** `Phase3_Advanced/20_DiffWrtAnotherFunction.jsx`  
**XII link:** Section 8.9  
**Formula:** du/dv = (du/dx)/(dv/dx)  
**Example:** u = sin x, v = cos x → du/dv = −cot x (from textbook)

---

## Color Palette (theme.js)

```js
export const colors = {
  primary:   '#6366f1',  // indigo — main function color
  secondary: '#f59e0b',  // amber — second function / highlight
  accent:    '#10b981',  // emerald — tangent lines / answers
  danger:    '#ef4444',  // red — wrong answers
  surface:   '#1e1b4b',  // dark indigo — card backgrounds
  bg:        '#0f0e17',  // near-black — page background
  text:      '#e2e8f0',  // light — main text
  muted:     '#94a3b8',  // slate — labels, secondary text
  phase1:    '#818cf8',  // XI topics
  phase2:    '#34d399',  // bridge topics
  phase3:    '#f472b6',  // XII advanced topics
}
```

---

## App Navigation (App.jsx)

The app has a left sidebar showing all 20 topics grouped by phase.
Each topic shows:
- A lock icon if previous topic not completed
- A checkmark if completed
- Progress bar within completed topics

Top bar shows: current topic name + phase badge + overall progress %.

Student can navigate freely — the lock is soft (can bypass with a click).

---

## Getting Started

```bash
cd differentiation-app
npm install
npm start
```

First task: complete the 5 shared components in `src/components/shared/`.
Then build Topic 2 (Slope of a Line) as the first real topic to establish the visual language.
