import { describe, it, expect } from 'vitest';
import { waveAt } from '../wave';
import { malusTransmittance, rotatePolarization, linear, circular, elliptical } from '../polarization';
import { intensityAtDistance, poyntingMagnitude, peakEFieldFromIntensity } from '../intensity';
import { SPEED_OF_LIGHT } from '../constants';

// Helper: magnitude of a 3-vector
const mag = (v: { x: number; y: number; z: number }) =>
  Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);

// Helper: dot product
const dot = (a: { x: number; y: number; z: number }, b: { x: number; y: number; z: number }) =>
  a.x * b.x + a.y * b.y + a.z * b.z;

const BASE_PARAMS = {
  amplitudeEVm: 100,
  wavelengthM: 633e-9,
  frequencyHz: SPEED_OF_LIGHT / 633e-9,
  phaseRad: 0,
  refractiveIndex: 1,
};

describe('waveAt — orthogonality and amplitude', () => {
  const samples: Array<[{ x: number; y: number; z: number }, number]> = [
    [{ x: 0, y: 0, z: 0 }, 0],
    [{ x: 1, y: 2, z: 0.3e-6 }, 1e-15],
    [{ x: 0, y: 0, z: 633e-9 / 4 }, 0],
    [{ x: 5, y: -3, z: 200e-9 }, 2e-15],
  ];

  for (const [point, time] of samples) {
    it(`E·B = 0 at z=${point.z.toExponential(1)}, t=${time}`, () => {
      const { E, B } = waveAt(point, time, BASE_PARAMS);
      expect(Math.abs(dot(E, B))).toBeLessThan(1e-30);
    });
  }

  it('E is perpendicular to propagation axis (+z): E.z = 0', () => {
    const { E } = waveAt({ x: 0, y: 0, z: 100e-9 }, 1e-15, BASE_PARAMS);
    expect(E.z).toBe(0);
  });

  it('B is perpendicular to propagation axis (+z): B.z = 0', () => {
    const { B } = waveAt({ x: 0, y: 0, z: 100e-9 }, 1e-15, BASE_PARAMS);
    expect(B.z).toBe(0);
  });

  it('vacuum (n=1): |B|·c ≈ |E| within 1e-9 relative', () => {
    const { E, B } = waveAt({ x: 0, y: 0, z: 50e-9 }, 5e-16, BASE_PARAMS);
    const absE = mag(E);
    const absB = mag(B);
    if (absE > 1e-30) {
      expect(Math.abs(absB * SPEED_OF_LIGHT - absE) / absE).toBeLessThan(1e-9);
    }
  });

  it('glass (n=1.5): |B|/|E| ≈ n/c within 1e-9 relative', () => {
    const glassParams = { ...BASE_PARAMS, refractiveIndex: 1.5 };
    const { E, B } = waveAt({ x: 0, y: 0, z: 50e-9 }, 5e-16, glassParams);
    const absE = mag(E);
    const absB = mag(B);
    if (absE > 1e-30) {
      const expected = 1.5 / SPEED_OF_LIGHT;
      expect(Math.abs(absB / absE - expected) / expected).toBeLessThan(1e-9);
    }
  });

  it('|E_x| ≤ amplitudeEVm at all sample points', () => {
    for (const [point, time] of samples) {
      const { E } = waveAt(point, time, BASE_PARAMS);
      expect(Math.abs(E.x)).toBeLessThanOrEqual(BASE_PARAMS.amplitudeEVm + 1e-12);
    }
  });
});

describe('waveAt — phase periodicity', () => {
  it('at z=0, t=0, phase=0: E.x = amplitudeEVm (cos(0)=1)', () => {
    const { E } = waveAt({ x: 0, y: 0, z: 0 }, 0, BASE_PARAMS);
    expect(E.x).toBeCloseTo(BASE_PARAMS.amplitudeEVm, 10);
  });

  it('after one full period T=1/f, value returns to start', () => {
    const point = { x: 0, y: 0, z: 100e-9 };
    const t0 = 0.5e-15;
    const T = 1 / BASE_PARAMS.frequencyHz;
    const { E: E0 } = waveAt(point, t0, BASE_PARAMS);
    const { E: E1 } = waveAt(point, t0 + T, BASE_PARAMS);
    expect(E1.x).toBeCloseTo(E0.x, 10);
  });

  it('shifting z by λ_medium returns same value (spatial period)', () => {
    const n = 1;
    const lambdaMedium = BASE_PARAMS.wavelengthM / n;
    const t = 1e-15;
    const z0 = 50e-9;
    const { E: E0 } = waveAt({ x: 0, y: 0, z: z0 }, t, BASE_PARAMS);
    const { E: E1 } = waveAt({ x: 0, y: 0, z: z0 + lambdaMedium }, t, BASE_PARAMS);
    expect(E1.x).toBeCloseTo(E0.x, 10);
  });

  it('in glass (n=1.5), λ_medium = λ_vacuum/1.5 is the spatial period', () => {
    const n = 1.5;
    const glassParams = { ...BASE_PARAMS, refractiveIndex: n };
    const lambdaMedium = BASE_PARAMS.wavelengthM / n;
    const t = 1e-15;
    const z0 = 50e-9;
    const { E: E0 } = waveAt({ x: 0, y: 0, z: z0 }, t, glassParams);
    const { E: E1 } = waveAt({ x: 0, y: 0, z: z0 + lambdaMedium }, t, glassParams);
    expect(E1.x).toBeCloseTo(E0.x, 10);
  });
});

describe('polarization — Malus law', () => {
  it('linear(0) through polarizer at 0 → transmittance = 1', () => {
    expect(malusTransmittance(linear(0), 0)).toBeCloseTo(1, 12);
  });

  it('linear(0) through polarizer at π/2 → transmittance ≈ 0', () => {
    expect(malusTransmittance(linear(0), Math.PI / 2)).toBeCloseTo(0, 12);
  });

  it('linear(θ) through polarizer at θ+π/4 → transmittance ≈ 0.5', () => {
    const theta = 0.8;
    expect(malusTransmittance(linear(theta), theta + Math.PI / 4)).toBeCloseTo(0.5, 12);
  });

  it('circular (right) through any polarizer axis → 0.5', () => {
    for (const axis of [0, Math.PI / 4, Math.PI / 3, Math.PI]) {
      expect(malusTransmittance(circular('right'), axis)).toBeCloseTo(0.5, 12);
    }
  });

  it('circular (left) through any polarizer axis → 0.5', () => {
    expect(malusTransmittance(circular('left'), 1.23)).toBeCloseTo(0.5, 12);
  });
});

describe('polarization — rotation invariants', () => {
  it('rotatePolarization(linear(0), π/2) → transmittance at π/2 = 1', () => {
    const rotated = rotatePolarization(linear(0), Math.PI / 2);
    expect(malusTransmittance(rotated, Math.PI / 2)).toBeCloseTo(1, 12);
  });

  it('rotating a circular state returns same kind and handedness', () => {
    const state = circular('right');
    const rotated = rotatePolarization(state, Math.PI / 3);
    expect(rotated.kind).toBe('circular');
    if (rotated.kind === 'circular') {
      expect(rotated.handedness).toBe('right');
    }
  });

  it('rotating circular: transmittance is unchanged (rotation-invariant)', () => {
    const state = circular('left');
    const rotated = rotatePolarization(state, 1.23);
    expect(malusTransmittance(rotated, 0.5)).toBeCloseTo(malusTransmittance(state, 0.5), 12);
  });

  it('elliptical: rotating by π preserves Malus transmittance for all test axes', () => {
    const state = elliptical(2, 1, 0.3, 'right');
    const rotated = rotatePolarization(state, Math.PI);
    for (const axis of [0, 0.5, 1.0, 1.5]) {
      expect(malusTransmittance(rotated, axis)).toBeCloseTo(malusTransmittance(state, axis), 10);
    }
  });
});

describe('intensity — inverse square law', () => {
  it('doubling distance quarters intensity', () => {
    const P = 100;
    const r = 5;
    const I1 = intensityAtDistance(P, r);
    const I2 = intensityAtDistance(P, 2 * r);
    expect(I2 / I1).toBeCloseTo(0.25, 12);
  });

  it('4π r² · I(P, r) = P (energy conservation)', () => {
    const P = 50;
    const r = 3;
    const I = intensityAtDistance(P, r);
    expect(4 * Math.PI * r * r * I).toBeCloseTo(P, 10);
  });

  it('throws RangeError for distanceM = 0', () => {
    expect(() => intensityAtDistance(1, 0)).toThrow(RangeError);
  });

  it('throws RangeError for distanceM < 0', () => {
    expect(() => intensityAtDistance(1, -1)).toThrow(RangeError);
  });
});

describe('intensity — Poynting round-trip', () => {
  it('peakEFieldFromIntensity(poyntingMagnitude(E0)) ≈ E0 within 1e-9 relative', () => {
    const E0 = 273.6;
    const roundTrip = peakEFieldFromIntensity(poyntingMagnitude(E0));
    expect(Math.abs(roundTrip - E0) / E0).toBeLessThan(1e-9);
  });

  it('for I=1 W/m² in vacuum, peak E ≈ 27.46 V/m within 0.1%', () => {
    const E0 = peakEFieldFromIntensity(1);
    expect(Math.abs(E0 - 27.46) / 27.46).toBeLessThan(0.001);
  });

  it('poyntingMagnitude scales quadratically with E0', () => {
    const S1 = poyntingMagnitude(10);
    const S2 = poyntingMagnitude(20);
    expect(S2 / S1).toBeCloseTo(4, 10);
  });
});