export const pct = (x: number, dp = 0): string => `${(x * 100).toFixed(dp)}%`;

export const signedPct = (x: number, dp = 0): string => `${x >= 0 ? "+" : ""}${(x * 100).toFixed(dp)}%`;

export const usd = (x: number): string => `$${Math.round(x).toLocaleString("en-US")}`;

export const num = (x: number): string => Math.round(x).toLocaleString("en-US");

export const compact = (x: number): string => {
  if (Math.abs(x) >= 1000) return `${(x / 1000).toFixed(1)}k`;
  return `${Math.round(x)}`;
};

export const pValueLabel = (p: number): string => {
  if (p < 0.001) return "p < 0.001";
  if (p < 0.01) return `p = ${p.toFixed(3)}`;
  return `p = ${p.toFixed(3)}`;
};
