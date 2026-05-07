/**
 * constants.ts — Physical and optical constants for the light/optics module.
 *
 * All values are in SI units.
 * Sources: CODATA 2018 recommended values; NIST refractive-index tables.
 */

// ---------------------------------------------------------------------------
// Fundamental electromagnetic constants
// ---------------------------------------------------------------------------

/** Speed of light in vacuum (m/s). Exact by SI 2019 definition. */
export const SPEED_OF_LIGHT = 299_792_458; // m/s

/** Electric permittivity of free space (F/m). CODATA 2018. */
export const VACUUM_PERMITTIVITY = 8.8541878128e-12; // F/m

/** Magnetic permeability of free space (H/m). CODATA 2018. */
export const VACUUM_PERMEABILITY = 1.25663706212e-6; // H/m

/**
 * Characteristic impedance of free space (Ω).
 * Derived: Z₀ = √(μ₀ / ε₀) ≈ 376.730 Ω.
 */
export const VACUUM_IMPEDANCE = 376.730_313_668; // Ω

// ---------------------------------------------------------------------------
// Visible spectrum bounds
// ---------------------------------------------------------------------------

/** Approximate short-wavelength limit of the human visible spectrum (m). */
export const VISIBLE_MIN_M = 380e-9; // 380 nm

/** Approximate long-wavelength limit of the human visible spectrum (m). */
export const VISIBLE_MAX_M = 700e-9; // 700 nm

// ---------------------------------------------------------------------------
// Refractive indices (dimensionless, at ~589 nm sodium D line)
// ---------------------------------------------------------------------------

/**
 * Refractive indices for common optical media.
 *
 * All values are approximate and measured near 589 nm.
 * - `vacuum`     — exact (1 by definition)
 * - `air`        — standard conditions (15 °C, 1 atm)
 * - `water`      — liquid, 20 °C
 * - `glassCrown` — borosilicate crown glass (e.g., BK7)
 * - `glassFlint` — dense flint glass
 * - `diamond`    — type IIa at 589 nm
 */
export const REFRACTIVE_INDEX: Record<
  'vacuum' | 'air' | 'water' | 'glassCrown' | 'glassFlint' | 'diamond',
  number
> = {
  vacuum: 1,
  air: 1.000_293,
  water: 1.333,
  glassCrown: 1.52,
  glassFlint: 1.62,
  diamond: 2.417,
};
