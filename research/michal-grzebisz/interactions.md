# Kinetic Typography Proximity Interaction Engine (`michalgrzebisz.com`)

**Target Reference**: `michalgrzebisz.com` (Kinetic Typography & Minimalist Hero Canvas)  
**Document**: Euclidean Distance Tracking, Cosine Bell Falloff, Variable Font Modulation & Vector Displacement  
**Classification Standard**: `[CONFIRMED]`, `[INFERRED]`, `[ESTIMATED]`, `[UNKNOWN]`  
**Design System Anchor**: `d:\CODE\Html\test\design.md`

---

## 1. Character Segmentation & DOM Architecture

Text strings are segmented into individual character `<span>` elements while preserving screen reader accessibility:

```html
<h1 class="hero-title" aria-label="Michał Grzebisz">
  <span class="word" aria-hidden="true">
    <span class="char" data-char="M">M</span>
    <span class="char" data-char="i">i</span>
    <span class="char" data-char="c">c</span>
    <span class="char" data-char="h">h</span>
    <span class="char" data-char="a">a</span>
    <span class="char" data-char="ł">ł</span>
  </span>
  <span class="word-spacer" aria-hidden="true">&nbsp;</span>
  <span class="word" aria-hidden="true">
    <span class="char" data-char="G">G</span>
    <span class="char" data-char="r">r</span>
    <span class="char" data-char="z">z</span>
    <span class="char" data-char="e">e</span>
    <span class="char" data-char="b">b</span>
    <span class="char" data-char="i">i</span>
    <span class="char" data-char="s">s</span>
    <span class="char" data-char="z">z</span>
  </span>
</h1>
```

- **CSS Properties**: `.word { display: inline-block; white-space: nowrap; }`, `.char { display: inline-block; will-change: transform, font-variation-settings; }` `[CONFIRMED]`.

---

## 2. Mathematical Proximity Field & Vector Mechanics

### 2.1 Centroid & Euclidean Distance Formulation
Let pointer coordinates in viewport space be $P = \begin{pmatrix} x_m \\ y_m \end{pmatrix}$.  
For each character $i$, let $C_i = \begin{pmatrix} cx_i \\ cy_i \end{pmatrix}$ be its cached centroid:

$$cx_i = \text{left}_i + \frac{\text{width}_i}{2}, \quad cy_i = \text{top}_i + \frac{\text{height}_i}{2}$$

The 2D Euclidean distance $d_i$ is:
$$d_i = \|P - C_i\| = \sqrt{(x_m - cx_i)^2 + (y_m - cy_i)^2} \quad [CONFIRMED]$$

---

### 2.2 Cosine Bell Falloff Function `[INFERRED]`
Within the calibrated influence radius $R = 220\text{px} \pm 40\text{px}$ `[ESTIMATED]`, the continuous transfer coefficient $f(d_i)$ is computed as:

$$f(d_i) = \begin{cases} 
\cos^2\left(\dfrac{\pi d_i}{2R}\right) = \dfrac{1}{2}\left[1 + \cos\left(\dfrac{\pi d_i}{R}\right)\right] & \text{if } d_i < R \\ 
0 & \text{if } d_i \ge R 
\end{cases}$$

- **Smooth Peak at Cursor Center ($d = 0$)**: $f(0) = 1.0$, $\left.\frac{df}{dd}\right|_{0} = 0$.
- **Seamless Perimeter Decay ($d = R$)**: $f(R) = 0.0$, $\left.\frac{df}{dd}\right|_{R} = 0$.

---

### 2.3 Multi-Property Morphing Equations `[CONFIRMED]`

Using the transfer coefficient $f_i = f(d_i) \in [0, 1]$:

1. **Variable Font Weight ($\text{wght}$)**:
   $$\text{wght}_i^{\text{target}} = \text{wght}_{\text{base}} + (\text{wght}_{\text{max}} - \text{wght}_{\text{base}}) \cdot f_i$$
   Where $\text{wght}_{\text{base}} = 600$ (harmonized with `design.md`) and $\text{wght}_{\text{max}} = 850$ `[CONFIRMED]`.

2. **Spatial Scale ($s$)**:
   $$s_i^{\text{target}} = 1.0 + (s_{\text{max}} - 1.0) \cdot f_i \quad (\text{where } s_{\text{max}} = 1.12) \quad [ESTIMATED]$$

3. **2D Repulsion Vector Displacement $(\Delta x, \Delta y)$**:
   Let unit direction vector radiating from cursor $P$ to centroid $C_i$ be:
   $$\vec{u}_i = \frac{C_i - P}{d_i + \epsilon} = \begin{pmatrix} \frac{cx_i - x_m}{d_i + \epsilon} \\ \frac{cy_i - y_m}{d_i + \epsilon} \end{pmatrix} \quad (\epsilon = 0.001\text{px})$$
   $$\begin{pmatrix} \Delta x_i^{\text{target}} \\ \Delta y_i^{\text{target}} \end{pmatrix} = \vec{u}_i \cdot \text{Disp}_{\text{max}} \cdot f_i \quad (\text{where } \text{Disp}_{\text{max}} = 8.0\text{px}) \quad [ESTIMATED]$$

---

## 3. DOM Transform Pipeline

Values are applied directly to hardware-accelerated CSS properties:
```css
.char {
  font-variation-settings: 'wght' var(--char-wght, 600);
  transform: translate3d(var(--char-dx, 0px), var(--char-dy, 0px), 0) scale(var(--char-scale, 1));
}
```
Zero layout reflow occurs as transformations touch only the Composite layer `[CONFIRMED]`.
