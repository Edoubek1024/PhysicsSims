/**
 * spectrum.ts — Wavelength/frequency conversions and visible-light colorization.
 *
 * All wavelengths are in meters (SI). Frequencies are in Hz.
 *
 * Color algorithm: Dan Bruton's piecewise RGB approximation.
 * Reference: https://www.physics.sfasu.edu/astro/color/spectra.html
 */

import { SPEED_OF_LIGHT, VISIBLE_MIN_M, VISIBLE_MAX_M } from './constants';

// ---------------------------------------------------------------------------
// Conversions
// ---------------------------------------------------------------------------

/**
 * Convert wavelength to frequency using f = c / λ.
 *
 * @param wavelengthM - Vacuum wavelength (m). Must be > 0.
 * @returns Frequency (Hz).
 */
export function wavelengthToFrequency(wavelengthM: number): number {
  return SPEED_OF_LIGHT / wavelengthM;
}

/**
 * Convert frequency to wavelength using λ = c / f.
 *
 * @param frequencyHz - Frequency (Hz). Must be > 0.
 * @returns Vacuum wavelength (m).
 */
export function frequencyToWavelength(frequencyHz: number): number {
  return SPEED_OF_LIGHT / frequencyHz;
}

// ---------------------------------------------------------------------------
// Visibility test
// ---------------------------------------------------------------------------

/**
 * Returns true iff the wavelength falls within the human visible range
 * [380 nm, 700 nm] inclusive.
 *
 * @param wavelengthM - Wavelength (m).
 */
export function isVisible(wavelengthM: number): boolean {
  return wavelengthM >= VISIBLE_MIN_M && wavelengthM <= VISIBLE_MAX_M;
}

// ---------------------------------------------------------------------------
// Wavelength → sRGB color string (Dan Bruton piecewise approximation)
// ---------------------------------------------------------------------------

/** Gamma exponent for the Bruton approximation. */
const GAMMA = 0.8;

/** Intensity rolloff factor at spectrum edges (Bruton's "Let the eye..." factor). */
const EDGE_INTENSITY = 0.3;

/**
 * Clamp a value to [0, 1].
 */
function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

/**
 * Apply gamma correction and scale to [0, 255].
 *
 * @param raw       - Linear channel value (0–1).
 * @param intensity - Intensity multiplier for edge rolloff (0–1).
 */
function toSrgbChannel(raw: number, intensity: number): number {
  if (raw <= 0) return 0;
  return Math.round(255 * Math.pow(clamp01(raw) * intensity, GAMMA));
}

/**
 * Approximate sRGB CSS color string ("rgb(r,g,b)") for a visible-light wavelength
 * using Dan Bruton's piecewise approximation.
 *
 * Outside 380–700 nm the function returns "rgb(0,0,0)".
 * Intensity rolloff (factor 0.3–1.0) is applied at both ends of the visible range.
 * Gamma 0.8 is applied to all channels.
 *
 * Algorithm reference:
 *   Bruton, D. (1996). "Approximate RGB Values for Visible Wavelengths."
 *   https://www.physics.sfasu.edu/astro/color/spectra.html
 *
 * @param wavelengthM - Vacuum wavelength (m).
 * @returns CSS color string, e.g. "rgb(255,0,0)".
 */
export function wavelengthToRgbCss(wavelengthM: number): string {
  if (!isVisible(wavelengthM)) return 'rgb(0,0,0)';

  // Work in nanometers for readability — Bruton's table uses nm.
  const nm = wavelengthM * 1e9;

  let r: number, g: number, b: number;

  if (nm < 440) {
    r = (440 - nm) / (440 - 380);
    g = 0;
    b = 1;
  } else if (nm < 490) {
    r = 0;
    g = (nm - 440) / (490 - 440);
    b = 1;
  } else if (nm < 510) {
    r = 0;
    g = 1;
    b = (510 - nm) / (510 - 490);
  } else if (nm < 580) {
    r = (nm - 510) / (580 - 510);
    g = 1;
    b = 0;
  } else if (nm < 645) {
    r = 1;
    g = (645 - nm) / (645 - 580);
    b = 0;
  } else {
    r = 1;
    g = 0;
    b = 0;
  }

  // Edge intensity rolloff.
  let intensity: number;
  if (nm < 420) {
    intensity = EDGE_INTENSITY + (1 - EDGE_INTENSITY) * (nm - 380) / (420 - 380);
  } else if (nm > 700) {
    intensity = 0;
  } else if (nm > 645) {
    intensity = EDGE_INTENSITY + (1 - EDGE_INTENSITY) * (700 - nm) / (700 - 645);
  } else {
    intensity = 1;
  }

  return `rgb(${toSrgbChannel(r, intensity)},${toSrgbChannel(g, intensity)},${toSrgbChannel(b, intensity)})`;
}
