// Theme-aware color utilities for inline styles
// These use CSS variables that automatically update when theme changes

export const themeColors = {
  // Text colors
  foreground: 'var(--foreground)',
  cardForeground: 'var(--card-foreground)',
  mutedForeground: 'var(--muted-foreground)',
  primary: 'var(--primary)',
  secondary: 'var(--secondary)',
  
  // Background colors
  background: 'var(--background)',
  card: 'var(--card)',
  input: 'var(--input)',
  muted: 'var(--muted)',
  
  // Border colors
  border: 'var(--border)',
  
  // Utility colors
  destructive: 'var(--destructive)',
  success: 'var(--success)',
  accent: 'var(--accent)',
}

export const createThemeStyle = (overrides: Record<string, string> = {}) => ({
  ...themeColors,
  ...overrides,
})
