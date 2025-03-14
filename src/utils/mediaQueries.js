// src/mediaQueries.js
import { useMediaQuery } from 'react-responsive';

export const useIsXSmallScreen = () => useMediaQuery({ query: '(max-width: 300px)' });
export const useIsSmallScreen = () => useMediaQuery({ query: '(max-width: 575px)' });
export const useIsMediumScreen = () => useMediaQuery({ query: '(max-width: 768px)' });
export const useIsLargeScreen = () => useMediaQuery({ query: '(max-width: 992px)' });
export const useIsXLargeScreen = () => useMediaQuery({ query: '(max-width: 1200px)' });
export const useIsXXLargeScreen = () => useMediaQuery({ query: '(min-width: 1201px)' });
