import { describe, it, expect } from 'vitest';
import { applySnell, criticalAngleRad, brewsterAngleRad, applyFresnel } from '../snell';

const DEG = Math.PI / 180;

describe('applySnell — basic refraction', () => {
  it('air→water at 30°: θ₂ ≈ 22.08°, no TIR', () => {
    const result = applySnell({ incidentAngleRad: 30 * DEG, n1: 1, n2: 1.333 });
    expect(result.totalInternalReflection).toBe(false);
    expect(result.refractedAngleRad).not.toBeNull();
    expect(result.refractedAngleRad! / DEG).toBeCloseTo(22.08, 1);
  });

  it('normal incidence (θ₁=0): θ₂=0, no TIR', () => {
    const result = applySnell({ incidentAngleRad: 0, n1: 1, n2: 1.333 });
    expect(result.totalInternalReflection).toBe(false);
    expect(result.refractedAngleRad).toBeCloseTo(0, 12);
  });

  it('reversibility: round-trip recovers original angle', () => {
    const n1 = 1, n2 = 1.5, theta1 = 40 * DEG;
    const forward = applySnell({ incidentAngleRad: theta1, n1, n2 });
    const backward = applySnell({ incidentAngleRad: forward.refractedAngleRad!, n1: n2, n2: n1 });
    expect(backward.refractedAngleRad!).toBeCloseTo(theta1, 12);
  });
});

describe('applySnell — TIR', () => {
  it('water→air at 50°: TIR=true, refractedAngleRad=null', () => {
    const result = applySnell({ incidentAngleRad: 50 * DEG, n1: 1.333, n2: 1 });
    expect(result.totalInternalReflection).toBe(true);
    expect(result.refractedAngleRad).toBeNull();
  });

  it('just below critical angle: TIR=false, angle finite', () => {
    const critical = criticalAngleRad(1.333, 1)!;
    const result = applySnell({ incidentAngleRad: critical - 1e-6, n1: 1.333, n2: 1 });
    expect(result.totalInternalReflection).toBe(false);
    expect(Number.isFinite(result.refractedAngleRad!)).toBe(true);
  });

  it('criticalAngleRad(1.0, 1.5) → null', () => {
    expect(criticalAngleRad(1.0, 1.5)).toBeNull();
  });

  it('criticalAngleRad(1.5, 1.0) ≈ asin(1/1.5) ≈ 0.7297 rad', () => {
    expect(criticalAngleRad(1.5, 1.0)).toBeCloseTo(Math.asin(1 / 1.5), 12);
  });
});

describe('brewsterAngleRad', () => {
  it('air→glass (n2=1.5): ≈ 56.31°', () => {
    expect(brewsterAngleRad(1, 1.5) / DEG).toBeCloseTo(56.31, 1);
  });

  it('complementarity: sum ≈ π/2', () => {
    expect(brewsterAngleRad(1, 1.5) + brewsterAngleRad(1.5, 1)).toBeCloseTo(Math.PI / 2, 12);
  });
});

describe('applyFresnel — energy conservation', () => {
  for (const deg of [0, 15, 30, 45, 60, 75]) {
    it(`air→glass at ${deg}°: Rs+Ts=1 and Rp+Tp=1`, () => {
      const { Rs, Rp, Ts, Tp } = applyFresnel({ incidentAngleRad: deg * DEG, n1: 1, n2: 1.5 });
      expect(Rs + Ts).toBeCloseTo(1, 12);
      expect(Rp + Tp).toBeCloseTo(1, 12);
    });
  }

  it('normal incidence: Rs ≈ Rp ≈ 0.04', () => {
    const { Rs, Rp } = applyFresnel({ incidentAngleRad: 0, n1: 1, n2: 1.5 });
    const expected = ((1.5 - 1) / (1.5 + 1)) ** 2;
    expect(Rs).toBeCloseTo(expected, 10);
    expect(Rp).toBeCloseTo(expected, 10);
  });
});

describe('applyFresnel — TIR case', () => {
  it('water→air at 60°: Rs=Rp=1, Ts=Tp=0', () => {
    const { Rs, Rp, Ts, Tp } = applyFresnel({ incidentAngleRad: 60 * DEG, n1: 1.333, n2: 1 });
    expect(Rs).toBe(1); expect(Rp).toBe(1);
    expect(Ts).toBe(0); expect(Tp).toBe(0);
  });
});

describe('applyFresnel — Brewster angle', () => {
  it('at brewsterAngleRad(1,1.5): |rp| < 1e-10, Rp < 1e-20; rs and Rs > 0', () => {
    const theta_b = brewsterAngleRad(1, 1.5);
    const { rp, Rp, rs, Rs } = applyFresnel({ incidentAngleRad: theta_b, n1: 1, n2: 1.5 });
    expect(Math.abs(rp)).toBeLessThan(1e-10);
    expect(Rp).toBeLessThan(1e-20);
    expect(Math.abs(rs)).toBeGreaterThan(0);
    expect(Rs).toBeGreaterThan(0);
  });
});