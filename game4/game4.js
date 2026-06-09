let explanations = {
  2: `
\\(7^7 = 823543\\) 
<br><br>
\\(4^9 = 262144\\)
\\[\\frac{823543}{262144} \\approx 3.141567\\]`,
  5: String.raw`
\[
\sqrt{\sqrt{\frac{2143}{22}}}
\]

\[
\frac{2143}{22} \approx 97.4090909
\]

\[
\sqrt{97.4090909} \approx 9.869
\]

\[
\sqrt{9.869} \approx 3.1413
\]

\[
\sqrt{\sqrt{\frac{2143}{22}}} \approx 3.1413
\]
`,
  6: String.raw`
\[
\frac{63}{25} \approx 2.52
\]

\[
\sqrt{5} \approx 2.2360679
\]

\[
17 + 15\sqrt{5} \approx 17 + 33.541 = 50.541
\]

\[
7 + 15\sqrt{5} \approx 7 + 33.541 = 40.541
\]

\[
\frac{50.541}{40.541} \approx 1.2469
\]

\[
\frac{63}{25} \cdot 1.2469 \approx 2.52 \cdot 1.2469 \approx 3.1416
\]

\[
\frac{63}{25} \cdot \frac{17 + 15\sqrt{5}}{7 + 15\sqrt{5}} \approx 3.1416
\]
`,
  7: String.raw`
\[
10^{100} = \text{1 followed by 100 zeros}
\]

\[
\frac{10^{100}}{11222.11122} \approx 8.912 \times 10^{95}
\]

\[
\sqrt[193]{x} = x^{\frac{1}{193}}
\]

\[
\frac{1}{193} \approx 0.005181
\]

\[
\log_{10}(8.912 \times 10^{95}) \approx 95.95
\]

\[
\frac{95.95}{193} \approx 0.497
\]

\[
10^{0.497} \approx 3.1416
\]

\[
\sqrt[193]{\frac{10^{100}}{11222.11122}} \approx 3.1416
\]
`,
  8: String.raw`
\[
2^{48} = 281474976710656
\]

\[
\frac{884279719003555}{281474976710656}
\]


\[
\approx 3.14159265358979
\]

\[
\frac{884279719003555}{2^{48}} \approx 3.14159265
\]
`,
  9: String.raw`
\[
\frac{\pi}{4} = \sum_{n=0}^{\infty} (-1)^n \frac{1}{2n+1}
\]

\[
= 1 - \frac{1}{3} + \frac{1}{5} - \frac{1}{7} + \frac{1}{9}\cdots
\]

\[
= 1
\]

\[
- 0.333333...
\]

\[
+ 0.2
\]

\[
- 0.142857...
\]

\[
\approx 0.785398...
\]

\[
0.785398 \cdot 4 \approx \pi
\]
`,
  10: String.raw`
This formula works because it comes from elliptic functions and hypergeometric series related to π. Ramanujan discovered identities where 1/π can be written as an infinite series built from special function transformations.

Mathematically, the factorial terms and the 396^{4k} denominator force each term to shrink extremely fast, but the deeper reason is structural: the series is not random, it is derived from exact analytic identities that encode 1/π. So the infinite sum converges exactly to 1/π, not just an approximation.
`,
  11: `
This works because 163 is a Heegner number, which creates an almost-integer value inside certain modular functions.

The expression comes from the j-invariant (a deep object in complex analysis and number theory). For special values like 163, the j-function produces values extremely close to integers, and 640320^3 + 744 is one of these “almost perfect” cases.

Taking the logarithm and dividing by √163 transforms this near-integer structure into an approximation of π with very high precision. It works because of deep links between modular forms, complex multiplication, and elliptic curves, not because of numerical coincidence.`,
  12: String.raw`
This works because it is a continued fraction representation of π, derived from a specific recurrence pattern that encodes π through nested rational approximations.

Each level refines the previous approximation using odd squares (1², 3², 5², …), and the constant “6” in the denominator ensures the recursion converges instead of diverging. Mathematically, this structure comes from special transformations of trigonometric and arctangent-related series, where continued fractions provide increasingly accurate rational bounds for π.
`,
  13: String.raw`
This works because the Gaussian integral can be evaluated by squaring it and switching to polar coordinates.

Let I = ∫ e^{-x^2} dx. Then I² becomes a double integral over the plane, which transforms into polar coordinates:

\[
I^2 = \int_0^{2\pi} \int_0^{\infty} e^{-r^2} r\,dr\,d\theta
\]

The angular part gives 2π, and the radial part gives 1/2, so:

\[
I^2 = \pi \Rightarrow I = \sqrt{\pi}
\]

So π appears because the integral becomes an area in 2D space when rewritten geometrically.
`,
  14: String.raw`
This works because the integrand is the derivative of arcsin(x).

\[
\frac{d}{dx}(\arcsin x) = \frac{1}{\sqrt{1-x^2}}
\]

So the integral becomes:

\[
\int_0^1 \frac{1}{\sqrt{1-x^2}} dx = \arcsin(1) - \arcsin(0)
\]

\[
= \frac{\pi}{2} - 0
\]

So the result is exactly:

\[
\frac{\pi}{2}
\]

It works because this integral is literally measuring an angle in a unit circle, and π appears as the total angle measure of a half-circle.
`,
15: String.raw`
It works because it comes from modular functions (like the j-invariant), where certain algebraic numbers are “almost integers” when plugged into deep complex formulas.

The expression is carefully engineered so that massive cancellations happen after taking the log and dividing by √427, leaving a value extremely close to π.
`,
16: String.raw`
This works because of the Basel problem.

The sum \(\sum_{k=1}^{\infty} \frac{1}{k^2}\) is exactly equal to \(\frac{\pi^2}{6}\), a result proven by Euler using Fourier series.

So:

\[
\sum_{k=1}^{\infty} \frac{1}{k^2} = \frac{\pi^2}{6}
\]

Multiply by 6 and take the square root:

\[
\pi = \sqrt{6 \sum_{k=1}^{\infty} \frac{1}{k^2}}
\]

It works because π appears naturally when analyzing how squares of integers behave in infinite sums.
`,
17: String.raw`
This works because both sides represent the same function: \(\frac{\sin(\pi x)}{\pi x}\).

On the left, it's built from trigonometry. On the right, Euler rewrote it as an infinite product using its zeros.

Since \(\sin(\pi x)\) is zero at every integer \(x = \pm n\), the function can be reconstructed from those roots:

\[
1 - \frac{x^2}{n^2}
\]

Multiplying all these factors reproduces exactly the same function, so both sides are identical.
`,
  18:  String.raw`
This works because it is Wallis’ product, derived from comparing integrals of powers of sine.

When you analyze integrals like \(\int_0^\pi \sin^n(x)\,dx\), you get ratios that approach π. Rearranging those ratios produces an infinite product of even and odd terms:

\[
\frac{2n}{2n-1} \cdot \frac{2n}{2n+1}
\]

As \(n\) grows, these ratios converge so that the whole product tends exactly to \(\frac{\pi}{2}\). π appears because it is built into the geometry of the sine function over a half-circle.
`,
19: String.raw`
This works because it is the Chudnovsky formula, derived from modular forms and elliptic curve theory.

It is built from a hypergeometric series whose structure is tightly linked to π through complex analysis. The factorials and powers are arranged so that each term gives a highly accurate correction to 1/π.

The huge numbers (like 640320) come from special values of modular functions that force extremely fast convergence, making the series produce π with very high precision in very few steps.
`,
20: String.raw`
This works because it is built from deep identities in algebraic number theory and hyperbolic functions.

Each term like \(a + \sqrt{a^2 - 1}\) is of the form used to generate hyperbolic cosine identities:
\[
a + \sqrt{a^2 - 1} = e^{\operatorname{arcosh}(a)}
\]

So the product defining \(u\) is secretly a sum of logarithms of hyperbolic angles, carefully chosen so that everything collapses into a single structured constant.

Then:
- \((2u)^6 + 24\) is engineered to match a modular-form-related expression
- the logarithm linearizes the exponential structure hidden in \(u\)
- dividing by \(\sqrt{3502}\) normalizes the result to match π

So despite looking like chaos, it is actually a very rigid construction: nested hyperbolic identities + modular symmetries arranged so that all constants cancel except π.
`
}
let index = 0;
let explanationEnabled = false;
const slides = document.querySelectorAll(".slide");
const total = slides.length;
function next() {
    explanationEnabled = false;

  index = (index + 1) % total;
  document.getElementById("container").style.transform =
    `translateX(${-index * 800}px)`;
updateExplanation();
}
function previous() {
  explanationEnabled = false;
  index = (index - 1 + total) % total;
    document.getElementById("container").style.transform =
    `translateX(${-index * 800}px)`;
updateExplanation();
}
function toggleExplanation() {
  explanationEnabled = !explanationEnabled;
  updateExplanation();
}
  const el = document.getElementById("explanationText");

function updateExplanation() {

  const panel = document.getElementById("explanationPanel");
  const spacer = document.getElementById("spacer")

  const exp = explanations[index];

  // pas d'explication
  if (exp === undefined) {
    panel.style.display = "none";
    spacer.style.width = "300px";
    el.innerHTML = "";
    return;
  }

  // explication existe → panel visible
  panel.style.display = "none";

  // mais texte dépend du bouton
  if (explanationEnabled) {
    panel.style.display = ""
    el.innerHTML = exp;
    spacer.style.width = "";
    MathJax.typesetPromise([el]);
  } else {
    el.innerHTML = "";
    spacer.style.width = "300px"
  }
  if (index == 6) {
    el.style.fontSize = "16px"
  } else if (index == 2 || index == 5) {
    el.style.fontSize = "25px";
  } else if (index == 14) {
    el.style.fontSize = "14px"
  } else if (index == 20) {
    el.style.fontSize = "17px"
  } else if (index == 8 || index == 13 || index == 7) {
    el.style.fontSize = "18px"
  } else if (index == 15) {
    el.style.fontSize = "25px"
  } else if (index > 6) {
    el.style.fontSize = "20px"
  } 
}
updateExplanation()

function getCurrentValue() {
  const slide = document.querySelectorAll(".slide")[index];
  return slide.dataset.value;
}
function updateBar(value) {

  let percent = 0;

  if (value === "pi") {

    percent = 100;
        document.getElementById("precisionText").textContent =
    Math.round(percent) + "%"

  } else if (value === "15") {
    percent = 80;
        document.getElementById("precisionText").textContent =
    Math.round(percent) + "%"
  }else if (value === "161") {

    percent = 99;
    document.getElementById("precisionText").textContent =
    Math.round(percent) + "%"

  } else if(value === "53") {
    percent = 95;
    document.getElementById("precisionText").textContent =
    Math.round(percent) + "%"
  } else if (value === "30") {
    percent = 90; 
    document.getElementById("precisionText").textContent =
    Math.round(percent) + "%"
  }else {

    let approx = parseFloat(value);

    if (isNaN(approx)) return;

    let error = Math.abs(approx - Math.PI);

    if (error === 0) error = 1e-15;

    let precision = -Math.log10(error);

    let maxPrecision = 15;

    percent = (precision / maxPrecision) * 100;

    percent = Math.max(0, Math.min(percent, 100));
    document.getElementById("precisionText").textContent =
    Math.round(percent) + "%"
  }

document.getElementById("bar").style.height =
    (percent * 6) + "px";
}

setInterval(() => {
  let currentApprox = getCurrentValue();
  updateBar(currentApprox);
}, 20);
