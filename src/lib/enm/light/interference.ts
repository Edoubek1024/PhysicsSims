/**
 * interference.ts — Far-field (Fraunhofer) interference and diffraction intensities.
 *
 * Approximations adopted throughout:
 *   1. Small-angle: sin θ ≈ tan θ ≈ y / L  (valid when y « L).
 *   2. Double-slit uses ideal (zero-width) slits, so the single-slit sinc²
 *      envelope is dropped.  The full result with finite slit width would be
 *      I/I₀ = cos²(πdy/(λL)) · sinc²(πay/(λL)); here the sinc² factor = 1.
 *   3. All quantities are in SI units (metres, no scaling factors needed).
 */

import type { DoubleSlitParams, SingleSlitParams } from './types';

// ---------------------------------------------------------------------------
// Internal helper
// ---------------------------------------------------------------------------

/**
 * Normalised sinc function: sinc(x) = sin(x) / x, with sinc(0) = 1.
 *
 * Uses a Taylor-series branch for |x| < 1e-6 to avoid 0/0 at the origin.
 *
 * @param x - Argument (dimensionless).
 * @returns sinc(x) in the range (−∞, 1].
 */
function sinc(x: number): number {
  if (Math.abs(x) < 1e-6) {
    // Taylor: sin(x)/x ≈ 1 − x²/6 + x⁴/120
    return 1 - (x * x) / 6 + (x * x * x * x) / 120;
  }
  return Math.sin(x) / x;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Far-field double-slit intensity at a screen position.
 *
 * Model: ideal (zero-width) slits — the single-slit sinc² envelope is unity.
 *
 *   I(y) / I₀ = cos²( π d y / (λ L) )
 *
 * Full Fraunhofer result (finite slit width a) would multiply by sinc²(π a y / (λ L));
 * that factor is omitted here.
 *
 * @param yOnScreenM      - Position on the screen from the central axis (m).
 * @param params.slitSeparationM  - Centre-to-centre slit separation d (m).
 * @param params.screenDistanceM  - Slit-to-screen distance L (m).
 * @param params.wavelengthM      - Vacuum wavelength λ (m).
 * @returns Relative intensity in [0, 1] (central maximum = 1).
 */
export function doubleSlitIntensity(yOnScreenM: number, params: DoubleSlitParams): number {
  const { slitSeparationM: d, screenDistanceM: L, wavelengthM: lambda } = params;
  const arg = (Math.PI * d * yOnScreenM) / (lambda * L);
  const cosVal = Math.cos(arg);
  return cosVal * cosVal;
}

/**
 * Far-field single-slit diffraction intensity at a screen position.
 *
 *   I(y) / I₀ = sinc²( π a y / (λ L) )
 *
 * where sinc(x) = sin(x)/x, sinc(0) = 1.
 *
 * @param yOnScreenM      - Position on the screen from the central axis (m).
 * @param params.slitWidthM       - Slit width a (m).
 * @param params.screenDistanceM  - Slit-to-screen distance L (m).
 * @param params.wavelengthM      - Vacuum wavelength λ (m).
 * @returns Relative intensity in [0, 1] (central maximum = 1).
 */
export function singleSlitIntensity(yOnScreenM: number, params: SingleSlitParams): number {
  const { slitWidthM: a, screenDistanceM: L, wavelengthM: lambda } = params;
  const arg = (Math.PI * a * yOnScreenM) / (lambda * L);
  const s = sinc(arg);
  return s * s;
}

/**
 * Screen position of the m-th double-slit bright fringe.
 *
 *   y_m = m λ L / d
 *
 * m = 0 is the central maximum; m = ±1, ±2, … are the side maxima.
 *
 * @param orderM                  - Fringe order m (integer, dimensionless).
 * @param params.slitSeparationM  - Centre-to-centre slit separation d (m).
 * @param params.screenDistanceM  - Slit-to-screen distance L (m).
 * @param params.wavelengthM      - Vacuum wavelength λ (m).
 * @returns Screen position y_m (m).
 */
export function doubleSlitFringePositionM(orderM: number, params: DoubleSlitParams): number {
  const { slitSeparationM: d, screenDistanceM: L, wavelengthM: lambda } = params;
  return (orderM * lambda * L) / d;
}

/**
 * Screen position of the m-th single-slit diffraction minimum.
 *
 *   y_m = m λ L / a    (m ≠ 0)
 *
 * m = ±1, ±2, … give successive dark fringes on either side of centre.
 * Passing m = 0 is physically meaningless (the central maximum); the function
 * returns 0 in that case as a degenerate result.
 *
 * @param orderM                  - Minimum order m (non-zero integer, dimensionless).
 * @param params.slitWidthM       - Slit width a (m).
 * @param params.screenDistanceM  - Slit-to-screen distance L (m).
 * @param params.wavelengthM      - Vacuum wavelength λ (m).
 * @returns Screen position y_m (m).
 */
export function singleSlitMinimumPositionM(orderM: number, params: SingleSlitParams): number {
  const { slitWidthM: a, screenDistanceM: L, wavelengthM: lambda } = params;
  return (orderM * lambda * L) / a;
}
