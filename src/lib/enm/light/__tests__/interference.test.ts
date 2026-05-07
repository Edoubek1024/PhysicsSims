import { describe, it, expect } from 'vitest';
import {
  doubleSlitIntensity,
  singleSlitIntensity,
  doubleSlitFringePositionM,
  singleSlitMinimumPositionM,
} from '../interference';

// Standard HeNe laser params
const LAMBDA = 633e-9; // m
const L = 1.0;         // m
const D = 1e-4;        // slit separation (100 µm)
const A = 2e-5;        // slit width (20 µm)

const dblParams = { slitSeparationM: D, screenDistanceM: L, wavelengthM: LAMBDA };
const sglParams = { slitWidthM: A, screenDistanceM: L, wavelengthM: LAMBDA };

describe('doubleSlitIntensity — bright fringes', () => {
  it('y=0: central maximum = 1', () => {
    expect(doubleSlitIntensity(0, dblParams)).toBeCloseTo(1, 12);
  });

  for (const m of [-2, -1, 1, 2]) {
    it(`m=${m} bright fringe position gives intensity ≈ 1`, () => {
      const y = doubleSlitFringePositionM(m, dblParams);
      expect(doubleSlitIntensity(y, dblParams)).toBeCloseTo(1, 10);
    });
  }

  it('fringe position formula: m=1 → λL/d', () => {
    const y = doubleSlitFringePositionM(1, dblParams);
    expect(y).toBeCloseTo((LAMBDA * L) / D, 12);
  });

  it('fringe position formula: m=2 → 2λL/d', () => {
    const y = doubleSlitFringePositionM(2, dblParams);
    expect(y).toBeCloseTo((2 * LAMBDA * L) / D, 12);
  });

  it('fringe position formula: m=-1 → -λL/d', () => {
    const y = doubleSlitFringePositionM(-1, dblParams);
    expect(y).toBeCloseTo((-LAMBDA * L) / D, 12);
  });
});

describe('doubleSlitIntensity — dark fringes', () => {
  for (const m of [-1, 0, 1, 2]) {
    it(`half-integer position m=${m}: intensity ≈ 0`, () => {
      const y = (m + 0.5) * (LAMBDA * L) / D;
      expect(doubleSlitIntensity(y, dblParams)).toBeCloseTo(0, 12);
    });
  }

  it('periodicity: I(y) = I(y + λL/d) for several y values', () => {
    const period = (LAMBDA * L) / D;
    for (const y of [0, period * 0.3, period * 0.7, period * 1.2]) {
      const I0 = doubleSlitIntensity(y, dblParams);
      const I1 = doubleSlitIntensity(y + period, dblParams);
      expect(I1).toBeCloseTo(I0, 12);
    }
  });
});

describe('singleSlitIntensity — central max and minima', () => {
  it('y=0: intensity = 1 (sinc²(0) = 1, no NaN)', () => {
    const I = singleSlitIntensity(0, sglParams);
    expect(Number.isNaN(I)).toBe(false);
    expect(I).toBeCloseTo(1, 12);
  });

  it('very small y (1e-15 m): intensity ≈ 1 (sinc continuity)', () => {
    expect(singleSlitIntensity(1e-15, sglParams)).toBeCloseTo(1, 8);
  });

  for (const m of [-2, -1, 1, 2]) {
    it(`m=${m} minimum position: intensity < 1e-14`, () => {
      const y = singleSlitMinimumPositionM(m, sglParams);
      expect(singleSlitIntensity(y, sglParams)).toBeLessThan(1e-14);
    });
  }

  it('minimum position formula: m=1 → λL/a', () => {
    expect(singleSlitMinimumPositionM(1, sglParams)).toBeCloseTo((LAMBDA * L) / A, 12);
  });

  it('minimum position formula: m=-1 → -λL/a', () => {
    expect(singleSlitMinimumPositionM(-1, sglParams)).toBeCloseTo((-LAMBDA * L) / A, 12);
  });
});

describe('singleSlitIntensity — envelope bounds', () => {
  it('I(y) ∈ [0, 1] for many y values', () => {
    const period = (LAMBDA * L) / A;
    for (let i = -5; i <= 5; i++) {
      const y = i * period * 0.37;
      const I = singleSlitIntensity(y, sglParams);
      expect(I).toBeGreaterThanOrEqual(-1e-15);
      expect(I).toBeLessThanOrEqual(1 + 1e-15);
    }
  });

  it('secondary maximum near y ≈ 1.43·λL/a: I ≈ 0.047 within 5%', () => {
    const y = 1.43 * (LAMBDA * L) / A;
    const I = singleSlitIntensity(y, sglParams);
    expect(Math.abs(I - 0.047) / 0.047).toBeLessThan(0.05);
  });

  it('secondary maximum near y ≈ -1.43·λL/a: I ≈ 0.047 within 5%', () => {
    const y = -1.43 * (LAMBDA * L) / A;
    const I = singleSlitIntensity(y, sglParams);
    expect(Math.abs(I - 0.047) / 0.047).toBeLessThan(0.05);
  });

  it('central max is the global maximum', () => {
    const period = (LAMBDA * L) / A;
    const I0 = singleSlitIntensity(0, sglParams);
    for (let i = -10; i <= 10; i++) {
      const y = i * period * 0.25;
      expect(singleSlitIntensity(y, sglParams)).toBeLessThanOrEqual(I0 + 1e-12);
    }
  });
});