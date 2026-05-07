/**
 * types.ts — Shared type contracts for the electromagnetic light/optics module.
 *
 * All quantities are in SI units unless noted inline.
 * No physics is implemented here — this file is contracts only.
 */

// ---------------------------------------------------------------------------
// Shared primitives
// ---------------------------------------------------------------------------

/** A three-component vector in Cartesian space (SI units depend on context). */
export type Vec3 = {
  /** x-component */
  x: number;
  /** y-component */
  y: number;
  /** z-component */
  z: number;
};

// ---------------------------------------------------------------------------
// wave.ts contracts
// ---------------------------------------------------------------------------

/**
 * Parameters that fully describe a sinusoidal plane electromagnetic wave
 * propagating along +z.
 */
export type WaveParams = {
  /** Peak electric field amplitude (V/m). */
  amplitudeEVm: number;
  /** Vacuum wavelength (m). */
  wavelengthM: number;
  /** Frequency (Hz). */
  frequencyHz: number;
  /** Initial phase offset (rad). */
  phaseRad: number;
  /** Index of refraction of the medium (dimensionless, ≥ 1). Defaults to 1.0 (vacuum). */
  refractiveIndex: number;
};

/**
 * The instantaneous E and B field vectors at a point in space and time.
 * Returned by `waveAt`.
 */
export type WaveFieldSample = {
  /** Electric field vector (V/m). */
  E: Vec3;
  /** Magnetic flux density vector (T). */
  B: Vec3;
};

/**
 * Signature contract for the wave sampler in wave.ts.
 *
 * @param point  - Spatial location (m).
 * @param timeSec - Elapsed time (s).
 * @param params - Wave configuration.
 * @returns Instantaneous E and B field vectors at the given point and time.
 */
export type WaveAtFn = (point: Vec3, timeSec: number, params: WaveParams) => WaveFieldSample;

// ---------------------------------------------------------------------------
// polarization.ts contracts
// ---------------------------------------------------------------------------

/**
 * Linear polarization — the E-field oscillates along a fixed axis.
 */
export type LinearPolarization = {
  kind: 'linear';
  /** Angle of the polarization axis measured from +x toward +y (rad). */
  angleRad: number;
};

/**
 * Circular polarization — the E-field tip traces a circle.
 */
export type CircularPolarization = {
  kind: 'circular';
  /** Right-hand ('right') or left-hand ('left') rotation relative to +z propagation. */
  handedness: 'left' | 'right';
};

/**
 * Elliptical polarization — the most general fully-polarized state.
 */
export type EllipticalPolarization = {
  kind: 'elliptical';
  /** Semi-major axis length (relative units, same scale as E amplitude). */
  semiMajor: number;
  /** Semi-minor axis length (relative units). */
  semiMinor: number;
  /** Tilt angle of the semi-major axis from +x toward +y (rad). */
  tiltRad: number;
  /** Rotation sense relative to +z propagation. */
  handedness: 'left' | 'right';
};

/**
 * Discriminated union of all supported polarization states.
 * Use `state.kind` to narrow the type.
 */
export type PolarizationState = LinearPolarization | CircularPolarization | EllipticalPolarization;

// ---------------------------------------------------------------------------
// snell.ts contracts
// ---------------------------------------------------------------------------

/**
 * Input to both Snell's-law refraction and Fresnel coefficient calculations.
 */
export type RefractIO = {
  /** Angle of incidence measured from the surface normal (rad, 0 ≤ θ < π/2). */
  incidentAngleRad: number;
  /** Refractive index of the incident medium (dimensionless). */
  n1: number;
  /** Refractive index of the transmitted medium (dimensionless). */
  n2: number;
};

/**
 * Result of applying Snell's law.
 */
export type SnellResult = {
  /**
   * Refracted angle from the surface normal (rad).
   * `null` when total internal reflection occurs.
   */
  refractedAngleRad: number | null;
  /** True when n1 > n2 and θ_i exceeds the critical angle. */
  totalInternalReflection: boolean;
};

/**
 * Fresnel amplitude and power coefficients for a planar interface.
 * Subscript s = TE (perpendicular); subscript p = TM (parallel).
 * Capital letters (Rs, Rp, Ts, Tp) are power (intensity) reflectance/transmittance.
 */
export type FresnelCoefficients = {
  /** s-polarization amplitude reflectance (dimensionless, may be negative). */
  rs: number;
  /** p-polarization amplitude reflectance (dimensionless, may be negative). */
  rp: number;
  /** s-polarization amplitude transmittance (dimensionless). */
  ts: number;
  /** p-polarization amplitude transmittance (dimensionless). */
  tp: number;
  /** s-polarization power reflectance (0–1). */
  Rs: number;
  /** p-polarization power reflectance (0–1). */
  Rp: number;
  /** s-polarization power transmittance (0–1). */
  Ts: number;
  /** p-polarization power transmittance (0–1). */
  Tp: number;
};

/**
 * Signature contract for the Snell solver in snell.ts.
 *
 * @param input - Incident angle and refractive indices.
 * @returns Refracted angle and total-internal-reflection flag.
 */
export type SnellFn = (input: RefractIO) => SnellResult;

/**
 * Signature contract for the Fresnel solver in snell.ts.
 *
 * @param input - Incident angle and refractive indices.
 * @returns All eight Fresnel amplitude and power coefficients.
 *          When total internal reflection occurs, all transmission coefficients are 0.
 */
export type FresnelFn = (input: RefractIO) => FresnelCoefficients;

// ---------------------------------------------------------------------------
// interference.ts contracts
// ---------------------------------------------------------------------------

/**
 * Geometry parameters for a double-slit interference setup.
 */
export type DoubleSlitParams = {
  /** Centre-to-centre slit separation (m). */
  slitSeparationM: number;
  /** Distance from slits to the observation screen (m). */
  screenDistanceM: number;
  /** Vacuum wavelength of the monochromatic source (m). */
  wavelengthM: number;
};

/**
 * Geometry parameters for a single-slit diffraction setup.
 */
export type SingleSlitParams = {
  /** Width of the single slit (m). */
  slitWidthM: number;
  /** Distance from slit to the observation screen (m). */
  screenDistanceM: number;
  /** Vacuum wavelength of the monochromatic source (m). */
  wavelengthM: number;
};

/**
 * Signature contract for double-slit intensity in interference.ts.
 *
 * @param yOnScreenM - Position on the screen measured from the central axis (m).
 * @param params     - Double-slit geometry.
 * @returns Relative intensity (0–1, central maximum = 1).
 */
export type DoubleSlitIntensityFn = (yOnScreenM: number, params: DoubleSlitParams) => number;

/**
 * Signature contract for single-slit intensity in interference.ts.
 *
 * @param yOnScreenM - Position on the screen measured from the central axis (m).
 * @param params     - Single-slit geometry.
 * @returns Relative intensity (0–1, central maximum = 1).
 */
export type SingleSlitIntensityFn = (yOnScreenM: number, params: SingleSlitParams) => number;

// ---------------------------------------------------------------------------
// intensity.ts contracts
// ---------------------------------------------------------------------------

/**
 * Signature contract for the inverse-square irradiance helper in intensity.ts.
 *
 * Assumes an isotropic point source radiating into 4π steradians.
 *
 * @param sourcePowerW - Radiated power of the source (W).
 * @param distanceM    - Distance from the source (m, must be > 0).
 * @returns Irradiance at the given distance (W/m²).
 */
export type IntensityAtDistanceFn = (sourcePowerW: number, distanceM: number) => number;
