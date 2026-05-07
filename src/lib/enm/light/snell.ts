/**
 * snell.ts — Snell's law, Fresnel equations, critical angle, and Brewster's angle.
 *
 * All angles are in radians measured from the surface normal.
 * No I/O, no side effects — pure functions only.
 */

import type { RefractIO } from './types';

// ---------------------------------------------------------------------------
// Snell's law
// ---------------------------------------------------------------------------

/**
 * Apply Snell's law: n1·sin(θ1) = n2·sin(θ2).
 *
 * @param input - `incidentAngleRad` (rad, 0 ≤ θ < π/2), `n1`, `n2`.
 * @returns `refractedAngleRad` (rad) — `null` on total internal reflection —
 *          and `totalInternalReflection` boolean.
 */
export function applySnell(input: RefractIO): {
  refractedAngleRad: number | null;
  totalInternalReflection: boolean;
} {
  const { incidentAngleRad, n1, n2 } = input;
  const sinT2 = (n1 / n2) * Math.sin(incidentAngleRad);
  if (sinT2 > 1) {
    return { refractedAngleRad: null, totalInternalReflection: true };
  }
  return { refractedAngleRad: Math.asin(sinT2), totalInternalReflection: false };
}

// ---------------------------------------------------------------------------
// Critical angle
// ---------------------------------------------------------------------------

/**
 * Critical angle θ_c = asin(n2/n1) for a dense-to-rare interface (n1 > n2).
 *
 * @param n1 - Refractive index of the incident medium.
 * @param n2 - Refractive index of the transmitted medium.
 * @returns Critical angle (rad), or `null` when n1 ≤ n2 (TIR cannot occur).
 */
export function criticalAngleRad(n1: number, n2: number): number | null {
  if (n1 <= n2) return null;
  return Math.asin(n2 / n1);
}

// ---------------------------------------------------------------------------
// Brewster's angle
// ---------------------------------------------------------------------------

/**
 * Brewster's angle θ_B = atan(n2/n1).
 *
 * At this angle of incidence the reflected p-polarization amplitude vanishes (rp = 0).
 *
 * @param n1 - Refractive index of the incident medium.
 * @param n2 - Refractive index of the transmitted medium.
 * @returns Brewster angle (rad).
 */
export function brewsterAngleRad(n1: number, n2: number): number {
  return Math.atan2(n2, n1);
}

// ---------------------------------------------------------------------------
// Fresnel equations
// ---------------------------------------------------------------------------

/**
 * Fresnel amplitude and power coefficients at a planar dielectric interface.
 *
 * Amplitude conventions (Hecht/Born-Wolf):
 *   rs = (n1 cosθ1 − n2 cosθ2) / (n1 cosθ1 + n2 cosθ2)
 *   rp = (n2 cosθ1 − n1 cosθ2) / (n2 cosθ1 + n1 cosθ2)
 *   ts = 2 n1 cosθ1  / (n1 cosθ1 + n2 cosθ2)
 *   tp = 2 n1 cosθ1  / (n2 cosθ1 + n1 cosθ2)
 *
 * Power coefficients (energy conservation):
 *   Rs = rs², Rp = rp², Ts = 1 − Rs, Tp = 1 − Rp
 *
 * On total internal reflection |rs| = |rp| = 1 (magnitude), ts = tp = 0,
 * Rs = Rp = 1, Ts = Tp = 0.
 *
 * Handles normal incidence (θ1 = 0) without division by zero.
 *
 * @param input - `incidentAngleRad` (rad, 0 ≤ θ < π/2), `n1`, `n2`.
 * @returns Eight Fresnel coefficients (dimensionless).
 */
export function applyFresnel(input: RefractIO): {
  rs: number; rp: number; ts: number; tp: number;
  Rs: number; Rp: number; Ts: number; Tp: number;
} {
  const { incidentAngleRad, n1, n2 } = input;
  const { refractedAngleRad, totalInternalReflection } = applySnell(input);

  if (totalInternalReflection) {
    return { rs: 1, rp: 1, ts: 0, tp: 0, Rs: 1, Rp: 1, Ts: 0, Tp: 0 };
  }

  const c1 = Math.cos(incidentAngleRad);
  // refractedAngleRad is non-null here (TIR was false)
  const c2 = Math.cos(refractedAngleRad as number);

  const n1c1 = n1 * c1;
  const n2c2 = n2 * c2;
  const n2c1 = n2 * c1;
  const n1c2 = n1 * c2;

  const rs = (n1c1 - n2c2) / (n1c1 + n2c2);
  const rp = (n2c1 - n1c2) / (n2c1 + n1c2);
  const ts = (2 * n1c1) / (n1c1 + n2c2);
  const tp = (2 * n1c1) / (n2c1 + n1c2);

  const Rs = rs * rs;
  const Rp = rp * rp;

  return { rs, rp, ts, tp, Rs, Rp, Ts: 1 - Rs, Tp: 1 - Rp };
}
