/**
 * intensity.ts — Irradiance (intensity) helpers for the light/optics module.
 *
 * All quantities are in SI units.
 */

import { SPEED_OF_LIGHT, VACUUM_PERMITTIVITY } from './constants';

/**
 * Intensity from an isotropic point source at distance r.
 *
 * Formula: I = P / (4π r²)
 *
 * @param sourcePowerW - Total radiated power of the source (W).
 * @param distanceM    - Distance from the source (m, must be > 0).
 * @returns Irradiance at the given distance (W/m²).
 * @throws {RangeError} When distanceM is ≤ 0.
 */
export function intensityAtDistance(sourcePowerW: number, distanceM: number): number {
  if (distanceM <= 0) {
    throw new RangeError(`distanceM must be > 0, got ${distanceM}`);
  }
  return sourcePowerW / (4 * Math.PI * distanceM * distanceM);
}

/**
 * Time-averaged Poynting vector magnitude for a sinusoidal plane wave
 * with peak electric field amplitude E₀ in a non-magnetic medium of index n.
 *
 * Formula: ⟨|S|⟩ = ½ · n · ε₀ · c · E₀²
 *
 * @param peakEFieldVm   - Peak electric field amplitude E₀ (V/m).
 * @param refractiveIndex - Refractive index of the medium (dimensionless, ≥ 1). Defaults to 1 (vacuum).
 * @returns Time-averaged irradiance (W/m²).
 */
export function poyntingMagnitude(peakEFieldVm: number, refractiveIndex = 1): number {
  return 0.5 * refractiveIndex * VACUUM_PERMITTIVITY * SPEED_OF_LIGHT * peakEFieldVm * peakEFieldVm;
}

/**
 * Peak electric field amplitude required to produce a given time-averaged intensity
 * in a non-magnetic medium of index n.
 *
 * Inverse of {@link poyntingMagnitude}.
 * Formula: E₀ = sqrt(2 · I / (n · ε₀ · c))
 *
 * @param intensityWm2   - Time-averaged irradiance (W/m²).
 * @param refractiveIndex - Refractive index of the medium (dimensionless, ≥ 1). Defaults to 1 (vacuum).
 * @returns Peak electric field amplitude E₀ (V/m).
 */
export function peakEFieldFromIntensity(intensityWm2: number, refractiveIndex = 1): number {
  return Math.sqrt((2 * intensityWm2) / (refractiveIndex * VACUUM_PERMITTIVITY * SPEED_OF_LIGHT));
}
