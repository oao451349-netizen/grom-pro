import colors from "@/constants/colors";

/**
 * Returns the design tokens for GROM PRO.
 * Always uses the dark space theme.
 */
export function useColors() {
  return { ...colors.dark, radius: colors.radius };
}
