export const themes = {
  light: {
    name: "light",
    colors: {
      background: "#fafafa",
      foreground: "#0a0a0a",
      card: "#ffffff",
      cardForeground: "#0a0a0a",
      primary: "#7c3aed",
      primaryForeground: "#ffffff",
      secondary: "#f4f4f5",
      secondaryForeground: "#18181b",
      muted: "#f4f4f5",
      mutedForeground: "#71717a",
      destructive: "#ef4444",
      destructiveForeground: "#fafafa",
      border: "#e4e4e7",
      input: "#e4e4e7",
      ring: "#7c3aed",
      success: "#22c55e",
      warning: "#f59e0b",
    },
  },
  dark: {
    name: "dark",
    colors: {
      background: "#09090b",
      foreground: "#fafafa",
      card: "#111113",
      cardForeground: "#fafafa",
      primary: "#8b5cf6",
      primaryForeground: "#ffffff",
      secondary: "#1c1c1f",
      secondaryForeground: "#fafafa",
      muted: "#1c1c1f",
      mutedForeground: "#a1a1aa",
      destructive: "#dc2626",
      destructiveForeground: "#fafafa",
      border: "#27272a",
      input: "#27272a",
      ring: "#8b5cf6",
      success: "#22c55e",
      warning: "#f59e0b",
    },
  },
} as const;

export type ThemeName = keyof typeof themes;
export type ThemeColors = (typeof themes)[ThemeName]["colors"];
