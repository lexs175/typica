/**
 * Breakpoints oficiales del proyecto Typica
 * Fuente única de verdad para lógica responsiva en JavaScript y GSAP.
 */
export const BREAKPOINTS = {
  desktopXL: 1440,
  laptop: 1024,
  tablet: 768,
  mobileLandscape: 480,
  mobilePortrait: 320,
} as const;

export const MEDIA_QUERIES = {
  isDesktop: `(min-width: ${BREAKPOINTS.laptop}px)`,
  isTabletOrBelow: `(max-width: ${BREAKPOINTS.laptop - 1}px)`,
  isTablet: `(min-width: ${BREAKPOINTS.tablet}px) and (max-width: ${BREAKPOINTS.laptop - 1}px)`,
  isMobileLandscape: `(min-width: ${BREAKPOINTS.mobileLandscape}px) and (max-width: ${BREAKPOINTS.tablet - 1}px)`,
  isMobile: `(max-width: ${BREAKPOINTS.mobileLandscape - 1}px)`,
} as const;
