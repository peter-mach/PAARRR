export const ACCENT_PRESETS = {
  Crimson: "#c8324a",
  Coral: "#ee6c3d",
  Gold: "#c89c3a",
  Teal: "#1f9e8e",
  Violet: "#7a4cd6",
} as const;

export type AccentName = keyof typeof ACCENT_PRESETS;

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const cleaned = hex.replace("#", "");
  const m = cleaned.match(/.{2}/g);
  if (!m) return { r: 0, g: 0, b: 0 };
  const [r, g, b] = m.map((x) => Number.parseInt(x, 16));
  return { r, g, b };
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((x) =>
        Math.max(0, Math.min(255, Math.round(x)))
          .toString(16)
          .padStart(2, "0"),
      )
      .join("")
  );
}

export function darken(hex: string, amount: number): string {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex(r * (1 - amount), g * (1 - amount), b * (1 - amount));
}

export function lighten(hex: string, amount: number): string {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex(r + (255 - r) * amount, g + (255 - g) * amount, b + (255 - b) * amount);
}

export type AccentTriplet = {
  accent: string;
  accent600: string;
  accent100: string;
};

export function deriveAccent(hex: string): AccentTriplet {
  return {
    accent: hex,
    accent600: darken(hex, 0.12),
    accent100: lighten(hex, 0.86),
  };
}
