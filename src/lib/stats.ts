// Real statistics for experiment design and readout. No dependencies.

// Error function (Abramowitz & Stegun 7.1.26) → standard normal CDF.
function erf(x: number): number {
  const t = 1 / (1 + 0.3275911 * Math.abs(x));
  const y =
    1 -
    (((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) *
      t) *
      Math.exp(-x * x);
  return x >= 0 ? y : -y;
}

export function normalCdf(z: number): number {
  return 0.5 * (1 + erf(z / Math.SQRT2));
}

// Inverse standard normal CDF — Peter Acklam's rational approximation.
export function normalQuantile(p: number): number {
  if (p <= 0) return -Infinity;
  if (p >= 1) return Infinity;
  const a = [-3.969683028665376e1, 2.209460984245205e2, -2.759285104469687e2, 1.38357751867269e2, -3.066479806614716e1, 2.506628277459239];
  const b = [-5.447609879822406e1, 1.615858368580409e2, -1.556989798598866e2, 6.680131188771972e1, -1.328068155288572e1];
  const c = [-7.784894002430293e-3, -3.223964580411365e-1, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783];
  const d = [7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996, 3.754408661907416];
  const plow = 0.02425;
  const phigh = 1 - plow;
  let q: number;
  let r: number;
  if (p < plow) {
    q = Math.sqrt(-2 * Math.log(p));
    return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }
  if (p <= phigh) {
    q = p - 0.5;
    r = q * q;
    return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
  }
  q = Math.sqrt(-2 * Math.log(1 - p));
  return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
}

export interface SampleSizeInput {
  baseline: number; // control conversion rate (0..1)
  mde: number; // relative minimum detectable effect (e.g., 0.2 = +20%)
  alpha?: number;
  power?: number;
}

// Two-proportion sample size per arm (two-sided).
export function sampleSizePerArm({ baseline, mde, alpha = 0.05, power = 0.8 }: SampleSizeInput): number {
  const p1 = baseline;
  const p2 = baseline * (1 + mde);
  const zAlpha = normalQuantile(1 - alpha / 2);
  const zBeta = normalQuantile(power);
  const pBar = (p1 + p2) / 2;
  const numerator = Math.pow(zAlpha * Math.sqrt(2 * pBar * (1 - pBar)) + zBeta * Math.sqrt(p1 * (1 - p1) + p2 * (1 - p2)), 2);
  const denominator = Math.pow(p2 - p1, 2);
  return Math.ceil(numerator / denominator);
}

export interface ZTestInput {
  controlConv: number;
  controlN: number;
  treatmentConv: number;
  treatmentN: number;
}

export interface ZTestResult {
  controlRate: number;
  treatmentRate: number;
  absLift: number;
  relLift: number;
  z: number;
  pValue: number;
  ciLow: number;
  ciHigh: number;
}

// Two-proportion z-test (pooled), two-sided p-value, 95% CI on the difference.
export function twoProportionZTest(i: ZTestInput): ZTestResult {
  const p1 = i.controlConv / i.controlN;
  const p2 = i.treatmentConv / i.treatmentN;
  const pPool = (i.controlConv + i.treatmentConv) / (i.controlN + i.treatmentN);
  const sePool = Math.sqrt(pPool * (1 - pPool) * (1 / i.controlN + 1 / i.treatmentN));
  const z = (p2 - p1) / sePool;
  const pValue = 2 * (1 - normalCdf(Math.abs(z)));
  const seDiff = Math.sqrt((p1 * (1 - p1)) / i.controlN + (p2 * (1 - p2)) / i.treatmentN);
  const zCrit = normalQuantile(0.975);
  const diff = p2 - p1;
  return {
    controlRate: p1,
    treatmentRate: p2,
    absLift: diff,
    relLift: diff / p1,
    z,
    pValue,
    ciLow: diff - zCrit * seDiff,
    ciHigh: diff + zCrit * seDiff,
  };
}
