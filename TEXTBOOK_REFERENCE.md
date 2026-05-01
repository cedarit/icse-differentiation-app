# Textbook Reference — Differentiation (Class XI & XII)

> This file is the single source of truth for all formulas, worked examples,
> and exercise problems from the two textbooks. Every React component must
> use these exact examples, notation, and problem sets.

---

## CLASS XI — Chapter 19: Differentiation (ISC Mathematics XI)

### 19.1 Increments
- Let y = f(x). A small change in x is called an **increment** of x, written δx (or Δx or h).
- The corresponding change in y is δy = f(x + δx) − f(x).
- **Incremental ratio** = δy/δx

**Key table example** (y = x²; x changes from 3 to 3+h):

| δx   | x+δx  | y+δy    | δy      | δy/δx |
|------|-------|---------|---------|-------|
| 0.1  | 3.1   | 9.61    | 0.61    | 6.1   |
| 0.01 | 3.01  | 9.0601  | 0.0601  | 6.01  |
| 0.001| 3.001 | 9.006001| 0.006001| 6.001 |
| h    | 3+h   | 9+6h+h² | 6h+h²   | 6+h   |

As δx → 0, δy/δx → 6. So dy/dx at x=3 is **6**.

### 19.2 Derivative of a Function
- The **derivative** (differential coefficient) of y = f(x) is:
  dy/dx = lim(δx→0) [f(x+δx) − f(x)] / δx = f'(x)
- Physical meaning: if x = displacement, then dy/dx = instantaneous velocity.

### 19.3 Velocity Interpretation
- Displacement OP = f(t) at time t; PQ = f(t+h) − f(t) in time h
- Average velocity = [f(t+h) − f(t)] / h
- Instantaneous velocity = lim(h→0) [f(t+h) − f(t)] / h = f'(t)

### 19.4 Differentiation from First Principles (Ab Initio)

**Method — 4 steps:**
1. Let y = f(x)
2. Let δx be increment; y + δy = f(x + δx)
3. Find δy = f(x+δx) − f(x); divide by δx
4. Take limit as δx → 0

**Worked Examples from textbook:**

**Ex 1:** f(x) = (3+x)/(3−x), find f'(2)
> f'(2) = lim(h→0) [f(2+h)−f(2)]/h = lim(h→0) [(5+h)/(1−h) − 5]/h = 6/1 = **6**

**Ex 2:** y = √x
> δy = √(x+δx) − √x = δx / [√(x+δx) + √x]
> dy/dx = lim = 1/(2√x)

**Ex 3:** y = 1/x³
> dy/dx = −3/x⁴  [via binomial expansion]

**Ex 4:** y = (ax+b)/(cx+d)
> dy/dx = (ad−bc)/(cx+d)²

**Exercise answers (19A):**
1. 2    2. 2(x−1)    3. 3x²    4. −1/(2x^(3/2))    5. 1/2
7. −1/(3x+2)²    8. 1/[2√(x+a)]    9. 1/x²    10. −(5/2)x^(−7/2)
11. 4x−1    12. 1 − 1/x²

### 19.5 Standard Result: d/dx(xⁿ) = nxⁿ⁻¹

- Valid for x ∈ ℝ, n ∈ ℝ, x > 0
- d/dx(x⁷) = 7x⁶
- d/dx(x^(5/2)) = (5/2)x^(3/2)
- d/dx(x) = 1
- d/dx(1/x) = d/dx(x⁻¹) = −x⁻²= −1/x²
- d/dx(√x) = 1/(2√x)
- **Linear function rule:** d/dx[(ax+b)ⁿ] = n(ax+b)^(n−1) · a
  - e.g. d/dx[(5x+7)¹⁰] = 10(5x+7)⁹ · 5 = 50(5x+7)⁹
  - e.g. d/dx[√(1−8x)] = −4/√(1−8x)

### 19.6 General Theorems

**Theorem 1 — Constant Multiple:**
d/dx[k·f(x)] = k·f'(x)

**Theorem 2 — Sum/Difference:**
d/dx[u ± v] = du/dx ± dv/dx (extends to any finite sum)

**Worked Examples:**
- y = 8 + 7x + 9x² + 6 sin x + 8 cosec x → dy/dx = 7 + 18x + 6cos x − 8 cosec x cot x
- y = x³ + 2x² → dy/dx = (2/3)x^(−1/3) + 4x
- y = (x²+1)(x+3) = x³+3x²+x+3 → expand then differentiate
- y = (x + 1/x)² = x² + 2 + x⁻² → dy/dx = 2x − 2x⁻³

**Exercise 19(B) problems:**
- x − 1/x,  √x + 1/√x,  3x + 2/x²
- (x²+1)/x,  (2x + x^(4/3))/x²,  (1+x²)/x³
- Prove: if y = x + 1/x, then x(dy/dx) − xy + 2 = 0
- Prove: if y = √x + 1/√x, then 2x(dy/dx) + y = 2√x

### 19.7 Product Rule
d/dx(uv) = u(dv/dx) + v(du/dx)

**Mnemonic:** "First × Deriv of Second + Second × Deriv of First"

**Worked Examples:**
- y = x^(−1) · sin x → dy/dx = x^(−1)·cos x + sin x·(−x^(−2))
- Extended to 3 functions: d/dx(uvw) = u'vw + uv'w + uvw'

**Exercise 19(C) selected:**
1. (ax+b)(cx+d)
2. (x¹⁰⁰ + 2x⁵⁰ − 3)(7x⁸ + 20x + 5)
3. x(2x−1)(x+2)
4. (x−2)(x+3)(2x+5)

### 19.8 Quotient Rule
d/dx(u/v) = [v·(du/dx) − u·(dv/dx)] / v²

**Mnemonic:** "Denom × Deriv(Num) − Num × Deriv(Denom), all over Denom²"  
Or: "Low D-High minus High D-Low, square the bottom"

**Worked Examples:**
- y = (2x+5)/(3−x)² → dy/dx = −19/(3−x)²   [Exercise answer]
- y = (x²−3)/(2x+5) → dy/dx = (x²+8x+3)/(x+4)²  [Exercise answer]
- y = (ax²+bx+c)/(px²+qx+f) → full quotient rule derivation

### 19.9 Derivatives of Trig Functions (with Proofs)

**From first principles:**

**1. d/dx(sin x) = cos x**
> δy = sin(x+δx) − sin x = 2cos(x + δx/2)·sin(δx/2)
> dy/dx = lim = cos x · 1 = cos x

**2. d/dx(cos x) = −sin x**
> δy = cos(x+δx) − cos x = −2sin(x + δx/2)·sin(δx/2)
> dy/dx = −sin x

**3. d/dx(tan x) = sec²x**
> Using quotient rule on sin x/cos x:
> = (cos x · cos x − sin x · (−sin x)) / cos²x = 1/cos²x = sec²x

**4. d/dx(cot x) = −cosec²x**

**5. d/dx(sec x) = sec x tan x**
> d/dx(1/cos x) = sin x/cos²x = sec x tan x

**6. d/dx(cosec x) = −cosec x cot x**

**Memory aid:** "Derivatives of functions beginning with 'co' are negative"

**With linear argument:**
- d/dx[sin(ax+b)] = a·cos(ax+b)
- d/dx[cos(ax+b)] = −a·sin(ax+b)
- d/dx[tan(ax+b)] = a·sec²(ax+b)
- d/dx[cot(ax+b)] = −a·cosec²(ax+b)
- d/dx[sec(ax+b)] = a·sec(ax+b)·tan(ax+b)
- d/dx[cosec(ax+b)] = −a·cosec(ax+b)·cot(ax+b)

**Exercise 19(D) — Selected first principles problems:**
- d/dx(sin x) proof
- d/dx(cos x) proof
- d/dx(tan x) via quotient rule
- d/dx(sec x) proof

---

## CLASS XII — Chapter 8: Differentiation (AaHana Maths XII)

### Overview Card (inside front cover of chapter)

| Function | Derivative | Function | Derivative |
|----------|------------|----------|------------|
| xⁿ | nxⁿ⁻¹ | sin x | cos x |
| √x | 1/(2√x) | cos x | −sin x |
| Constant | 0 | tan x | sec²x |
| eˣ | eˣ | cot x | −cosec²x |
| aˣ | aˣ log a | sec x | sec x tan x |
| log x | 1/x | cosec x | −cosec x cot x |
| log_a(x) | 1/(x log a) | sin⁻¹x | 1/√(1−x²) |
| | | cos⁻¹x | −1/√(1−x²) |
| | | tan⁻¹x | 1/(1+x²) |
| | | cot⁻¹x | −1/(1+x²) |
| | | sec⁻¹x | 1/(|x|√(x²−1)) |
| | | cosec⁻¹x | −1/(|x|√(x²−1)) |

### Algebra of Derivatives (recap)
1. d/dx(u ± v) = du/dx ± dv/dx
2. d/dx(au) = a·du/dx
3. d/dx(uv) = u·dv/dx + v·du/dx
4. d/dx(u/v) = [v·du/dx − u·dv/dx] / v²

### Chain Rule (Composite Functions)

**Outer-Inner Rule:**
y = f(g(x)) → dy/dx = f'(g(x)) · g'(x)

**Mnemonic:** "Differentiate outer (leave inner alone) × Differentiate inner"

**Multi-layer example from textbook:**
y = tan³(sin(√(ax+b)))

Differentiate in order 1 → 2 → 3 → 4:
- Layer 1 (outermost): tan³ u → 3tan²u
- Layer 2: tan(v) → sec²v
- Layer 3: sin(w) → cos w
- Layer 4 (innermost): √(ax+b) → a/(2√(ax+b))

dy/dx = 3tan²(sin√(ax+b)) · sec²(sin√(ax+b)) · cos(√(ax+b)) · a/(2√(ax+b))

**Exercise 8(A) — Selected problems:**
1. (i) (5x+7)¹⁰  (ii) √(5x+7)/(3x−1)  (iii) √(4−x²)  (iv) (3x²+5)⁹
2. (3x−x³+1)⁴
3. √(x²+a²)
5. √(ax²+bx+c)
17. (i) (3/2)cos x³·(−3x²)  (ii) −3sin x cos²x  (iii) sec²(√x)/(2√x)
18. 4a²sin 4x·cos 4x

**Exercise 8(A) Answers:**
1(i) 50(5x+7)⁹  1(ii) −9/(3x−1)²  1(iii) −x/√(4−x²)  1(iv) 54x(3x²+5)⁸

### Trigonometric Differentiation (Class XII Examples)

**Worked Example — Textbook:**
Differentiate: (i) tan(4x)  (ii) sin²(√x)  (iii) sin²(3x+5)  (iv) sin(cos x²)

- (i) d/dx[tan 4x] = sec²4x · 4 = 4sec²4x
- (ii) d/dx[sin²(√x)] = 2sin(√x)·cos(√x)·(1/(2√x)) = sin(√x)cos(√x)/√x
- (iii) d/dx[sin²(3x+5)] = 2sin(3x+5)cos(3x+5)·3 = 6sin(3x+5)cos(3x+5)
- (iv) d/dx[sin(cos x²)] = cos(cos x²)·(−sin x²)·2x

### Logarithmic Differentiation

**Standard results:**
- d/dx(log x) = 1/x (base e assumed when not stated)
- d/dx(logₐ x) = 1/(x log a)
- d/dx[log f(x)] = f'(x)/f(x)   ← chain rule form

**Key identity:** lim(x→0) [(aˣ − 1)/x] = log a

**Worked Examples from textbook:**
- d/dx[log(tan x)] = 1/tan x · sec²x = sec²x/tan x
- d/dx[log(sin x)] = cos x/sin x = cot x
- d/dx[log(x²+1)] = 2x/(x²+1)
- d/dx[log(log x)] = 1/(x log x)
- d/dx[log₇(log x)] = 1/(x·log x·(log 7)²)

**For y = uᵛ (log differentiation method):**
- Take log: log y = v·log u
- Differentiate: (1/y)·dy/dx = v·(u'/u) + v'·log u
- Multiply by y: dy/dx = uᵛ·[v·u'/u + v'·log u]

**Textbook examples:**
- y = xˣ → dy/dx = xˣ(1 + log x)
- y = xˢⁱⁿˣ → dy/dx = xˢⁱⁿˣ·[cos x·log x + sin x/x]
- y = (sin x)ˣ → dy/dx = (sin x)ˣ·[log sin x + x·cot x]

### Exponential Derivatives

- d/dx(eˣ) = eˣ
- d/dx(aˣ) = aˣ·log a
- d/dx[e^f(x)] = e^f(x)·f'(x)

**Worked Examples from textbook:**
- d/dx(e^(3x)) = 3e^(3x)
- d/dx(e^(x²)) = 2x·e^(x²)
- d/dx(7^(x³)) = 7^(x³)·log 7·3x²

**Exercise 8(C) selected problems:**
1. (i) 3ˣ  (ii) 9^(cos x)  (iii) e^(sin x)  (iv) e^(√x)  (v) 9^(sin x)
3. (i) xe^(−x)  (ii) e^x·cot x  (iii) e^(ax)·sin bx  (iv) eˣ/x  (v) (1+sin x)
   (vi) xe^x  (vii) e^(x²)·sin x  (viii) e^(ax)·cos(bx+c)

### Inverse Trig Derivatives (with proofs)

**Proof of d/dx(sin⁻¹x):**
Let y = sin⁻¹x → x = sin y
Differentiate w.r.t. x: 1 = cos y · dy/dx
dy/dx = 1/cos y = 1/√(1−sin²y) = **1/√(1−x²)**   (domain: x ∈ (−1,1))

**Proof of d/dx(tan⁻¹x):**
Let y = tan⁻¹x → x = tan y
1 = sec²y · dy/dx
dy/dx = 1/sec²y = 1/(1+tan²y) = **1/(1+x²)**   (domain: x ∈ ℝ)

**Proof of d/dx(sec⁻¹x):**
dy/dx = **1/(|x|√(x²−1))**   (domain: x ∈ ℝ−[−1,1])

**Worked Examples (textbook):**
- d/dx[sin⁻¹(4x)] = 4/√(1−16x²)
- d/dx[tan⁻¹(sin √x)] = cos(√x) / [2√x·(1+sin²(√x))]
- d/dx[cos⁻¹(tan x²)] = −2x/√(1−tan²x⁴)
- d/dx[cos⁻¹((a+cos x)/(b+a cos x))] (textbook formula)
- d/dx[tan⁻¹(sec x + tan x)] = 1/2

**Differentiation by substitution — textbook examples:**
- y = sin⁻¹(2x√(1−x²)) → Put x = sin θ → y = 2θ = 2sin⁻¹x → dy/dx = 2/√(1−x²)
- y = cos⁻¹(4x³−3x) → Put x = cos θ → y = 3cos⁻¹x → dy/dx = −3/√(1−x²)
- y = tan⁻¹[(√(1+x²)−1)/x] → Put x = tan θ → y = θ/2 → dy/dx = 1/[2(1+x²)]

### Implicit Differentiation

**Method:**
- Differentiate both sides w.r.t. x
- Every y-term gets an extra (dy/dx) factor by chain rule
- Collect dy/dx terms, solve

**Textbook Examples:**
- x² + 5xy − y² = 2x → differentiate: 2x + 5y + 5x(dy/dx) − 2y(dy/dx) = 2
  → dy/dx(5x − 2y) = 2 − 2x − 5y → dy/dx = (2−2x−5y)/(5x−2y)

### Parametric Differentiation

If x = f(t) and y = g(t), then:
**dy/dx = (dy/dt) / (dx/dt)**

**Textbook Example:**
y = p, x = (x−1)²/(x−1) style problems
- x = t², y = 2t → dx/dt = 2t, dy/dt = 2 → dy/dx = 2/2t = 1/t
- General: dy/dx = (dy/dt)/(dx/dt)

### Second Order Derivatives

dy/dx = f'(x)  
d²y/dx² = d/dx[f'(x)] = f''(x) = "derivative of the derivative"

**Textbook Examples:**
- y = tan x → dy/dx = sec²x → d²y/dx² = 2sec x · sec x tan x = 2tan x·sec²x
- y = parametric: d²y/dx² = d/dx(dy/dx) = [d/dt(dy/dx)] / (dx/dt)

### Differentiation of a Function w.r.t. Another Function

If u = f(x) and v = g(x), then:
du/dv = (du/dx) / (dv/dx)

**Textbook Example:**
Differentiate u = sin x w.r.t. v = cos x
du/dx = cos x, dv/dx = −sin x
du/dv = cos x/(−sin x) = −cot x

---

## EXERCISE BANK — All Practice Problems

### Class XI Exercises

**Exercise 19(A) — First Principles:**
Find dy/dx from first principles:
1. y = x² (at general x)
2. y = 2(x−1)
3. y = x³
4. y = 1/√(2x)  [ans: −1/(2x^(3/2))]
5. y = 1/2
7. y = 1/(3x+2)
8. y = 1/√(x+a)
9. y = 1/x
10. y = −(5/2)x^(−7/2)

**Exercise 19(B) — Basic Rules:**
1. (i) x − 1/x  (ii) √x + 1/√x  (iii) 3x + 2/x²
2. (iv) (x²+1)/x  (v) (2x+x^(4/3))/x²  (vi) (1+x²)/x³
Prove:
18. y = x + 1/x → x(dy/dx) − xy + 2 = 0
19. y = √x + 1/√x → 2x(dy/dx) + y = 2√x
21. y = 1 + x + x²/2! + x³/3! + ... → dy/dx = y

**Exercise 19(C) — Product & Quotient Rule:**
1. (ax+b)(cx+d)
2. (x¹⁰⁰ + 2x⁵⁰ − 3)(7x⁸ + 20x + 5)
3. x(2x−1)(x+2)
4. (x−2)(x+3)(2x+5)
5. y = (2x+5)/(3−x)²
6. y = (x²−3)/(2x+5)
7. y = 17/(3x+4)²

**Exercise 19(E) — Limits Review (VSAs):**
1. lim(x→−1) (x−2)(x+5)/(x²−5x+6)
2. lim(x→5) |x|−5
3. lim(x→0) (x+1)⁵−1)/x = 5
4. lim(x→0) sin(px)/x = p
5. lim(x→1) (x^(1/2)−1)/(x^(1/4)−1) = 2
6. lim(x→0) tan x/x = 1

### Class XII Exercises

**Exercise 8(A) — Chain Rule:**
1. (i) (5x+7)¹⁰  (ii) √(5x+7)/(3x−1)  (iii) √(4−x²)  (iv) √(x²−5)  (v) (x²−5)⁴
2. (3x−x³+1)⁴
3. √(x²+a²)
4. (x³/(3x−2))^(1/2)
5. √(ax²+bx+c)
6. x(x+4)^(1/2)·(2x³−1)²

**Exercise 8(B) — Further Chain Rule:**
1. (i) (5x+7)¹⁰  (ii) (5x+7)/(3x−1)  (iii) √(4−x⁶)  (iv) √(2−x)  (v) (x²−5)⁴

**Exercise 8(C) — Exponential:**
1. 3ˣ, 9^(cos x), e^(sin x), e^(√x), 9^(sin x)
2. 3^(−7x), (3−7x), 3^(6x)
3. xe^(−x), e^x·cot x, e^(ax)sin(bx), eˣ/x, (1+sin x)
4. e^(1/x), e^(x+1/x), e^x·sin(x²)

**Exercise 8(D) — Logarithmic:**
Topics: log(tan x), log(sin x), log(x²+1), log(log x), log₇(log x)
Prove problems involving: cot²(x/2), log(sin²x)

**Exercise 8(E) — Inverse Trig:**
Problems: sin⁻¹(4x), tan⁻¹(sin√x), substitution types
Standard results to prove from first principles

---

## NOTATION CONVENTIONS

- Use dy/dx (not y' in JSX, use y' only in labels)
- Use δx for increment in XI content, h for limit variable
- Write sin⁻¹x not arcsin x (ICSE convention)
- Formulas rendered with KaTeX
- All proofs from the textbook should use exact same algebraic steps
