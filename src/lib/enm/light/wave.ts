/**
 * wave.ts — Sinusoidal plane electromagnetic wave sampler.
 *
 * Models a linearly polarized plane EM wave propagating along +z,
 * with the electric field along +x and the magnetic field along +y
 * (right-hand rule: x̂ × ŷ = ẑ).
 *
 * ## Field equations
 *
 *   Phase:  ψ(z, t) = k·z − ω·t + φ
 *   E_x(z,t) = E₀ · cos(ψ)
 *   B_y(z,t) = (n/c) · E₀ · cos(ψ)
 *
 * ## Magnetic field convention
 *
 * In a non-magnetic (μᵣ = 1) medium of refractive index n, Maxwell's
 * equations give |B| = (n/c)·|E|, not |B| = |E|/c (vacuum form).
 * This implementation uses the non-magnetic form `B = (n / c) * E`
 * so that energy transport is correctly described in glass, water, etc.
 * For vacuum (n = 1) the two forms are identical.
 *
 * ## Propagation coordinate
 *
 * Only `point.z` contributes to the phase; this is a 1-D plane wave
 * uniform in x and y.
 *
 * All quantities use SI units throughout.
 */

import { SPEED_OF_LIGHT } from './constants';
import type { Vec3, WaveParams, WaveFieldSample } from './types';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Returns the angular frequency ω for a wave of the given frequency.
 *
 * @param frequencyHz - Wave frequency (Hz).
 * @returns Angular frequency ω = 2π·f (rad/s).
 */
export function angularFrequency(frequencyHz: number): number {
  return 2 * Math.PI * frequencyHz;
}

/**
 * Returns the angular wavenumber k in a medium of refractive index n.
 *
 * Derived from k = 2π / λ_medium = 2π·n / λ_vacuum.
 *
 * @param wavelengthVacuumM - Vacuum wavelength λ₀ (m).
 * @param refractiveIndex   - Refractive index n of the medium (dimensionless, ≥ 1).
 * @returns Angular wavenumber k (rad/m).
 */
export function wavenumberInMedium(wavelengthVacuumM: number, refractiveIndex: number): number {
  return (2 * Math.PI * refractiveIndex) / wavelengthVacuumM;
}

// ---------------------------------------------------------------------------
// Primary sampler
// ---------------------------------------------------------------------------

/**
 * Samples the instantaneous E and B field vectors of a linearly polarized
 * plane EM wave at a given spatial point and time.
 *
 * The wave propagates along +z; E oscillates along +x; B oscillates along +y.
 * Only the z-coordinate of `point` affects the phase (1-D plane wave).
 *
 * @param point    - Spatial location (m). Only `point.z` enters the phase.
 * @param timeSec  - Elapsed time (s).
 * @param params   - Wave configuration (amplitude, wavelength, frequency, phase, n).
 * @returns Instantaneous electric field (V/m) and magnetic flux density (T).
 */
export function waveAt(point: Vec3, timeSec: number, params: WaveParams): WaveFieldSample {
  const { amplitudeEVm, wavelengthM, frequencyHz, phaseRad, refractiveIndex } = params;

  const omega = angularFrequency(frequencyHz);
  const k = wavenumberInMedium(wavelengthM, refractiveIndex);
  const phase = k * point.z - omega * timeSec + phaseRad;
  const cosPhase = Math.cos(phase);

  const Ex = amplitudeEVm * cosPhase;
  const By = (refractiveIndex / SPEED_OF_LIGHT) * amplitudeEVm * cosPhase;

  return {
    E: { x: Ex, y: 0, z: 0 },
    B: { x: 0, y: By, z: 0 },
  };
}
