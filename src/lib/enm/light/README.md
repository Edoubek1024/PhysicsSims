# `src/lib/enm/light`

Pure TypeScript module implementing wave-optics physics for electromagnetic light simulations.

---

## Conventions

| Convention | Detail |
|---|---|
| Units | SI throughout: meters, seconds, Hz, V/m, T, W, W/m², radians |
| Propagation axis | +z for plane waves; only `point.z` enters the phase |
| E/B orientation | E oscillates along +x, B along +y (right-hand rule: x̂ × ŷ = ẑ) |
| Magnetic medium | Non-magnetic (μᵣ = 1): `\|B\| = (n/c)·\|E\|`; equals `\|E\|/c` in vacuum |
| Jones vectors | RHCP = (1/√2)[1, −i]; LHCP = (1/√2)[1, +i] |
| Fresnel signs | Hecht / Born & Wolf convention: rs negative at low angle (air→glass) |
| Refractive indices | Measured near 589 nm sodium D line |

---

## Import paths

```ts
// Barrel — import anything from one path
import { waveAt, applySnell, doubleSlitIntensity, wavelengthToRgbCss } from 'src/lib/enm/light';

// Direct subpath — avoids barrel for tree-shaking in tight bundles
import { waveAt } from 'src/lib/enm/light/wave';
import { applySnell, applyFresnel } from 'src/lib/enm/light/snell';
```

To run the test suite, first install vitest: `npm install -D vitest`, then `npx vitest run src/lib/enm/light`.

---

## Wave Propagation

Samples the instantaneous E and B fields of a sinusoidal plane wave at an arbitrary point in space and time.

**Functions**

| Function | Returns |
|---|---|
| `waveAt(point, timeSec, params)` | `{ E: Vec3, B: Vec3 }` (V/m, T) |
| `angularFrequency(frequencyHz)` | ω = 2πf (rad/s) |
| `wavenumberInMedium(wavelengthVacuumM, n)` | k = 2πn/λ (rad/m) |

```ts
import { waveAt, SPEED_OF_LIGHT, REFRACTIVE_INDEX } from 'src/lib/enm/light';

const params = {
  amplitudeEVm: 100,          // peak E-field (V/m)
  wavelengthM: 633e-9,        // 633 nm (HeNe red)
  frequencyHz: SPEED_OF_LIGHT / 633e-9,
  phaseRad: 0,
  refractiveIndex: REFRACTIVE_INDEX.glassCrown,  // 1.52
};

const { E, B } = waveAt({ x: 0, y: 0, z: 0 }, 0, params);
// E.x ≈ 100 V/m, B.y ≈ 100 * 1.52 / c T
```

---

## Polarization

Jones-calculus-based polarization states with Malus's law transmittance.

**Types:** `PolarizationState` — discriminated union of `linear`, `circular`, `elliptical`.

**Functions**

| Function | Returns |
|---|---|
| `linear(angleRad)` | `PolarizationState` |
| `circular(handedness)` | `PolarizationState` |
| `elliptical(semiMajor, semiMinor, tiltRad, handedness)` | `PolarizationState` |
| `jonesFromPolarization(state)` | `JonesVector` (complex 2D) |
| `rotatePolarization(state, deltaRad)` | rotated `PolarizationState` |
| `malusTransmittance(state, polarizerAxisRad)` | transmittance ∈ [0, 1] |

```ts
import { linear, circular, malusTransmittance, rotatePolarization } from 'src/lib/enm/light';

// Crossed polarizers: no light passes
const hPol = linear(0);
const vPolarizer = Math.PI / 2;
console.log(malusTransmittance(hPol, vPolarizer)); // ≈ 0

// Circular light splits evenly through any linear polarizer
const rhcp = circular('right');
console.log(malusTransmittance(rhcp, 0));           // 0.5
console.log(malusTransmittance(rhcp, Math.PI / 3)); // 0.5

// Rotate linear polarization by 45°
const rotated = rotatePolarization(linear(0), Math.PI / 4);
console.log(malusTransmittance(rotated, Math.PI / 4)); // ≈ 1
```

---

## Reflection & Refraction

Snell's law and Fresnel amplitude/power coefficients at a planar dielectric interface.

**Functions**

| Function | Returns |
|---|---|
| `applySnell({ incidentAngleRad, n1, n2 })` | `{ refractedAngleRad: number\|null, totalInternalReflection: boolean }` |
| `applyFresnel({ incidentAngleRad, n1, n2 })` | `{ rs, rp, ts, tp, Rs, Rp, Ts, Tp }` |
| `criticalAngleRad(n1, n2)` | `number\|null` (null when n1 ≤ n2) |
| `brewsterAngleRad(n1, n2)` | θ_B = atan(n2/n1) (rad) |

```ts
import { applySnell, applyFresnel, criticalAngleRad, REFRACTIVE_INDEX } from 'src/lib/enm/light';

const n1 = REFRACTIVE_INDEX.air;
const n2 = REFRACTIVE_INDEX.water;
const theta1 = 30 * (Math.PI / 180); // 30°

const { refractedAngleRad, totalInternalReflection } = applySnell({ incidentAngleRad: theta1, n1, n2 });
// refractedAngleRad ≈ 0.3857 rad (22.1°), totalInternalReflection: false

const { Rs, Rp, Ts, Tp } = applyFresnel({ incidentAngleRad: theta1, n1, n2 });
// Rs + Ts = 1, Rp + Tp = 1 (energy conservation)

// Total internal reflection
const thetaC = criticalAngleRad(n2, n1)!; // ≈ 48.6° for water→air
const tir = applySnell({ incidentAngleRad: thetaC + 0.1, n1: n2, n2: n1 });
// tir.totalInternalReflection: true, tir.refractedAngleRad: null
```

---

## Interference & Diffraction

Far-field (Fraunhofer) intensity distributions for double-slit and single-slit apertures.

**Types:** `DoubleSlitParams`, `SingleSlitParams`

**Functions**

| Function | Returns |
|---|---|
| `doubleSlitIntensity(yOnScreenM, params)` | relative intensity ∈ [0, 1] |
| `singleSlitIntensity(yOnScreenM, params)` | relative intensity ∈ [0, 1] |
| `doubleSlitFringePositionM(orderM, params)` | y_m = mλL/d (m) |
| `singleSlitMinimumPositionM(orderM, params)` | y_m = mλL/a (m) |

```ts
import {
  doubleSlitIntensity, singleSlitIntensity,
  doubleSlitFringePositionM, singleSlitMinimumPositionM,
} from 'src/lib/enm/light';

const dblParams = { slitSeparationM: 1e-4, screenDistanceM: 1.0, wavelengthM: 633e-9 };
const sglParams = { slitWidthM: 2e-5,      screenDistanceM: 1.0, wavelengthM: 633e-9 };

// Fringe spacing for double slit
const fringeSpacing = doubleSlitFringePositionM(1, dblParams); // ≈ 6.33 mm

// Intensity at the 2nd bright fringe
const y2 = doubleSlitFringePositionM(2, dblParams);
console.log(doubleSlitIntensity(y2, dblParams)); // ≈ 1

// First single-slit minimum
const y_min1 = singleSlitMinimumPositionM(1, sglParams); // ≈ 31.65 mm
console.log(singleSlitIntensity(y_min1, sglParams)); // ≈ 0
```

---

## Intensity & Poynting

Inverse-square irradiance from a point source, and time-averaged Poynting magnitude.

**Functions**

| Function | Returns |
|---|---|
| `intensityAtDistance(sourcePowerW, distanceM)` | I = P / (4πr²) in W/m² |
| `poyntingMagnitude(peakEFieldVm, refractiveIndex?)` | ⟨\|S\|⟩ = ½nε₀c·E₀² (W/m²) |
| `peakEFieldFromIntensity(intensityWm2, refractiveIndex?)` | E₀ = √(2I/nε₀c) (V/m) |

```ts
import { intensityAtDistance, poyntingMagnitude, peakEFieldFromIntensity } from 'src/lib/enm/light';

// Irradiance 1 m from a 10 W isotropic source
const I = intensityAtDistance(10, 1.0); // ≈ 0.796 W/m²

// Peak E-field for that intensity in vacuum
const E0 = peakEFieldFromIntensity(I); // ≈ 24.5 V/m

// Round-trip consistency
const I2 = poyntingMagnitude(E0);
console.log(Math.abs(I2 - I) / I); // < 1e-12
```

---

## Spectrum

Wavelength–frequency conversions and visible-light CSS color mapping.

**Functions**

| Function | Returns |
|---|---|
| `wavelengthToFrequency(wavelengthM)` | f = c/λ (Hz) |
| `frequencyToWavelength(frequencyHz)` | λ = c/f (m) |
| `isVisible(wavelengthM)` | `boolean` (380–700 nm) |
| `wavelengthToRgbCss(wavelengthM)` | CSS string, e.g. `"rgb(255,80,0)"` |

```ts
import { wavelengthToFrequency, isVisible, wavelengthToRgbCss } from 'src/lib/enm/light';

const lambda = 532e-9; // 532 nm green laser
console.log(wavelengthToFrequency(lambda)); // ≈ 5.64e14 Hz
console.log(isVisible(lambda));             // true
console.log(wavelengthToRgbCss(lambda));    // "rgb(69,255,0)" (approximate)

// UV (not visible)
console.log(wavelengthToRgbCss(300e-9));   // "rgb(0,0,0)"
```

---

## Constants reference

| Export | Value | Unit |
|---|---|---|
| `SPEED_OF_LIGHT` | 299 792 458 | m/s |
| `VACUUM_PERMITTIVITY` | 8.8541878128 × 10⁻¹² | F/m |
| `VACUUM_PERMEABILITY` | 1.25663706212 × 10⁻⁶ | H/m |
| `VACUUM_IMPEDANCE` | 376.730 313 668 | Ω |
| `VISIBLE_MIN_M` | 380 × 10⁻⁹ | m |
| `VISIBLE_MAX_M` | 700 × 10⁻⁹ | m |
| `REFRACTIVE_INDEX.vacuum` | 1 | — |
| `REFRACTIVE_INDEX.air` | 1.000 293 | — |
| `REFRACTIVE_INDEX.water` | 1.333 | — |
| `REFRACTIVE_INDEX.glassCrown` | 1.52 | — |
| `REFRACTIVE_INDEX.glassFlint` | 1.62 | — |
| `REFRACTIVE_INDEX.diamond` | 2.417 | — |

---

## Common tasks

**Reflectance at 45° incidence on a water surface**

```ts
import { applyFresnel, REFRACTIVE_INDEX } from 'src/lib/enm/light';

const { Rs, Rp } = applyFresnel({
  incidentAngleRad: 45 * (Math.PI / 180),
  n1: REFRACTIVE_INDEX.air,
  n2: REFRACTIVE_INDEX.water,
});
console.log(`s-polarization reflectance: ${(Rs * 100).toFixed(2)}%`);
console.log(`p-polarization reflectance: ${(Rp * 100).toFixed(2)}%`);
```

**Double-slit fringe spacing: 532 nm laser, 0.5 mm slit separation, 2 m screen**

```ts
import { doubleSlitFringePositionM } from 'src/lib/enm/light';

const spacing = doubleSlitFringePositionM(1, {
  wavelengthM: 532e-9,
  slitSeparationM: 0.5e-3,
  screenDistanceM: 2.0,
});
console.log(`Fringe spacing: ${(spacing * 1000).toFixed(2)} mm`); // ≈ 2.13 mm
```

**Render a 600 nm photon as a CSS color**

```ts
import { wavelengthToRgbCss } from 'src/lib/enm/light';

const color = wavelengthToRgbCss(600e-9);
document.body.style.backgroundColor = color; // orange-red
```

---

## Approximations and limitations

- **1D plane wave**: only `point.z` contributes to phase; the wave is uniform in x and y.
- **Non-magnetic medium**: all formulas assume μᵣ = 1 (no magnetic response).
- **Isotropic point source**: `intensityAtDistance` assumes uniform radiation over 4π steradians.
- **Small-angle (Fraunhofer) interference**: `sin θ ≈ y/L`; valid when y ≪ L.
- **Ideal (zero-width) slits**: `doubleSlitIntensity` omits the single-slit sinc² envelope.
- **Refractive indices at 589 nm**: dispersion is not modeled; `REFRACTIVE_INDEX` values are fixed.
- **Visible-range color mapping**: Bruton piecewise RGB is a perceptual approximation, not a CIE-calibrated transform.
- **Isotropic medium**: anisotropic media (birefringence, optical activity) are not modeled.