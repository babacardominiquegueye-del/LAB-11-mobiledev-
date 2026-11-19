/**
 * Colors of the active theme. The theme itself is chosen in
 * `context/ThemeContext.tsx` — this hook is the short path to its palette.
 */

import { useThemeContext } from '@/context/ThemeContext';

export function useTheme() {
  return useThemeContext().colors;
}
