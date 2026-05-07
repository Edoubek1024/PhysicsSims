/**
 * polarization.ts — Jones-vector optics and polarization utilities.
 *
 * All angles are in radians (SI). Amplitudes are relative (dimensionless).
 * No React or DOM dependencies.
 *
 * References:
 *   - Hecht, "Optics" §8.1–8.3 (Jones calculus)
 *   - Born & Wolf, "Principles of Optics" §1.4 (Malus's law)
 */

import type { PolarizationState } from './types';

// ---------------------------------------------------------------------------
// Primitive complex number shape (kept inline — no external math dep needed)
// ---------------------------------------------------------------------------

/** A complex number in rectangular form. */
export type Complex = { re: number; im: number };

/**
 * A Jones vector representing the complex amplitude of the two transverse
 * E-field components (ex along x̂, ey along ŷ) for a wave propagating along ẑ.
 * Units match the amplitude scale of the parent WaveParams.
 */
export type JonesVector = { ex: Complex; ey: Complex };

// ---------------------------------------------------------------------------
// Factory helpers
// ---------------------------------------------------------------------------

/**
 * Create a linear polarization state.
 *
 * @param angleRad - Polarization axis angle from +x toward +y (rad).
 * @returns A `LinearPolarization` state.
 */
export function linear(angleRad: number): PolarizationState {
  return { kind: 'linear', angleRad };
}

/**
 * Create a circular polarization state.
 *
 * @param handedness - `'right'` (RHCP) or `'left'` (LHCP) relative to +z propagation.
 * @returns A `CircularPolarization` state.
 */
export function circular(handedness: 'left' | 'right'): PolarizationState {
  return { kind: 'circular', handedness };
}

/**
 * Create an elliptical polarization state.
 *
 * @param semiMajor  - Semi-major axis of the polarization ellipse (relative units).
 * @param semiMinor  - Semi-minor axis (relative units, must be ≤ semiMajor).
 * @param tiltRad    - Tilt of the semi-major axis from +x toward +y (rad).
 * @param handedness - Rotation sense relative to +z propagation.
 * @returns An `EllipticalPolarization` state.
 */
export function elliptical(
  semiMajor: number,
  semiMinor: number,
  tiltRad: number,
  handedness: 'left' | 'right',
): PolarizationState {
  return { kind: 'elliptical', semiMajor, semiMinor, tiltRad, handedness };
}

// ---------------------------------------------------------------------------
// Jones vector construction
// ---------------------------------------------------------------------------

/**
 * Build the normalised Jones vector for a given polarization state.
 *
 * Conventions (all normalised to unit intensity where possible):
 *   - **Linear** at angle θ:  [cos θ, sin θ]  (both real)
 *   - **Circular** RHCP:      (1/√2)·[1, −i]
 *   - **Circular** LHCP:      (1/√2)·[1, +i]
 *   - **Elliptical** with semi-axes a, b, tilt ψ, RHCP sense:
 *       J = R(ψ)·[a, −i·b] / ||(a,b)||
 *     where R(ψ) is the 2×2 rotation matrix and the ±i encodes handedness.
 *
 * @param state - The polarization state to convert.
 * @returns Jones vector `{ ex, ey }` with complex components.
 */
export function jonesFromPolarization(state: PolarizationState): JonesVector {
  switch (state.kind) {
    case 'linear': {
      const { angleRad: a } = state;
      return {
        ex: { re: Math.cos(a), im: 0 },
        ey: { re: Math.sin(a), im: 0 },
      };
    }

    case 'circular': {
      // RHCP: (1/√2)[1, −i];  LHCP: (1/√2)[1, +i]
      const sign = state.handedness === 'right' ? -1 : 1;
      const inv = 1 / Math.SQRT2;
      return {
        ex: { re: inv, im: 0 },
        ey: { re: 0, im: sign * inv },
      };
    }

    case 'elliptical': {
      const { semiMajor: a, semiMinor: b, tiltRad: psi, handedness } = state;
      const norm = Math.sqrt(a * a + b * b) || 1;
      // Sign convention: RHCP → ey phase = −π/2 (ey = −i·b), LHCP → +π/2.
      const phaseSign = handedness === 'right' ? -1 : 1;
      // Jones vector before rotation: [a, phaseSign·i·b] / norm
      const ux: Complex = { re: a / norm, im: 0 };
      const uy: Complex = { re: 0, im: (phaseSign * b) / norm };
      // Apply rotation by ψ:  ex' = cos(ψ)·ux − sin(ψ)·uy
      //                        ey' = sin(ψ)·ux + cos(ψ)·uy
      const c = Math.cos(psi);
      const s = Math.sin(psi);
      return {
        ex: { re: c * ux.re - s * uy.re, im: c * ux.im - s * uy.im },
        ey: { re: s * ux.re + c * uy.re, im: s * ux.im + c * uy.im },
      };
    }
  }
}

// ---------------------------------------------------------------------------
// Rotation
// ---------------------------------------------------------------------------

/**
 * Rotate a polarization state about the propagation axis (+z) by `deltaRad`.
 *
 * - **Linear**: `angleRad` is incremented by `deltaRad` (mod 2π not enforced).
 * - **Circular**: rotation-invariant — the same state is returned unchanged.
 * - **Elliptical**: `tiltRad` is incremented by `deltaRad`.
 *
 * @param state    - Input polarization state.
 * @param deltaRad - Rotation angle (rad, positive = counter-clockwise from +x toward +y).
 * @returns New polarization state with the rotation applied.
 */
export function rotatePolarization(
  state: PolarizationState,
  deltaRad: number,
): PolarizationState {
  switch (state.kind) {
    case 'linear':
      return { ...state, angleRad: state.angleRad + deltaRad };
    case 'circular':
      return state; // Circular polarization is rotation-invariant.
    case 'elliptical':
      return { ...state, tiltRad: state.tiltRad + deltaRad };
  }
}

// ---------------------------------------------------------------------------
// Malus's law
// ---------------------------------------------------------------------------

/**
 * Compute the power transmittance through an ideal linear polarizer.
 *
 * Formulas used:
 *   - **Linear**:    T = cos²(axisRad − angleRad)   [exact Malus's law]
 *   - **Circular**:  T = 0.5   [exact: equal projection onto any linear axis]
 *   - **Elliptical**: T ≈ 0.5·(a²·cos²θ + b²·sin²θ) / (a²+b²)
 *     where θ = axisRad − tiltRad.
 *     This is the time-averaged transmittance for a fully coherent elliptically
 *     polarized wave (derived from the Jones matrix product); it is exact for a
 *     purely elliptical state with no global phase ambiguity.
 *
 * @param state          - Incoming polarization state.
 * @param polarizerAxisRad - Transmission axis of the ideal linear polarizer (rad from +x).
 * @returns Transmittance in [0, 1].
 */
export function malusTransmittance(
  state: PolarizationState,
  polarizerAxisRad: number,
): number {
  switch (state.kind) {
    case 'linear': {
      const delta = polarizerAxisRad - state.angleRad;
      const c = Math.cos(delta);
      return c * c;
    }

    case 'circular':
      return 0.5;

    case 'elliptical': {
      const { semiMajor: a, semiMinor: b, tiltRad } = state;
      const denom = a * a + b * b;
      if (denom === 0) return 0;
      const theta = polarizerAxisRad - tiltRad;
      const cos2 = Math.cos(theta) ** 2;
      const sin2 = 1 - cos2;
      return (a * a * cos2 + b * b * sin2) / denom;
    }
  }
}
