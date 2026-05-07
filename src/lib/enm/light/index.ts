/**
 * index.ts — Barrel export for src/lib/enm/light/.
 *
 * Coder agents: append your re-exports below as you implement each submodule.
 * Example:
 *   export { waveAt } from './wave';
 *   export { applySnell, applyFresnel } from './snell';
 *   export { doubleSlitIntensity, singleSlitIntensity } from './interference';
 *   export { intensityAtDistance } from './intensity';
 *   export { applyPolarization } from './polarization';
 *
 * Types and constants are always re-exported so callers only need one import path.
 */

export type {
  Vec3,
  WaveParams,
  WaveFieldSample,
  WaveAtFn,
  LinearPolarization,
  CircularPolarization,
  EllipticalPolarization,
  PolarizationState,
  RefractIO,
  SnellResult,
  FresnelCoefficients,
  SnellFn,
  FresnelFn,
  DoubleSlitParams,
  SingleSlitParams,
  DoubleSlitIntensityFn,
  SingleSlitIntensityFn,
  IntensityAtDistanceFn,
} from './types';

export {
  SPEED_OF_LIGHT,
  VACUUM_PERMITTIVITY,
  VACUUM_PERMEABILITY,
  VACUUM_IMPEDANCE,
  VISIBLE_MIN_M,
  VISIBLE_MAX_M,
  REFRACTIVE_INDEX,
} from './constants';

// --- wave.ts (coder agent appends here) ---
export { waveAt, angularFrequency, wavenumberInMedium } from './wave';

// --- polarization.ts ---
export {
  jonesFromPolarization,
  rotatePolarization,
  malusTransmittance,
  linear,
  circular,
  elliptical,
} from './polarization';
export type { Complex, JonesVector } from './polarization';

// --- snell.ts ---
export { applySnell, applyFresnel, criticalAngleRad, brewsterAngleRad } from './snell';

// --- interference.ts (coder agent appends here) ---
// export { doubleSlitIntensity, singleSlitIntensity } from './interference';
export { doubleSlitIntensity, singleSlitIntensity, doubleSlitFringePositionM, singleSlitMinimumPositionM } from './interference';

// --- intensity.ts ---
export { intensityAtDistance, poyntingMagnitude, peakEFieldFromIntensity } from './intensity';

// --- spectrum.ts ---
export { wavelengthToFrequency, frequencyToWavelength, isVisible, wavelengthToRgbCss } from './spectrum';
