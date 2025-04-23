import { useCallback, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from './useRedux';
import { setTheme, ThemeMode } from '../features/theme/themeSlice';

export const useTheme = () => {
  const dispatch = useAppDispatch();
  const { mode } = useAppSelector(state => state.theme);
  
  // Function to change theme
  const changeTheme = useCallback((newTheme: ThemeMode) => {
    dispatch(setTheme(newTheme));
  }, [dispatch]);
  
  // Toggle between light and dark mode
  const toggleTheme = useCallback(() => {
    const newTheme = mode === 'light' ? 'dark' : 'light';
    dispatch(setTheme(newTheme));
  }, [dispatch, mode]);
  
  // Effect to apply theme to document
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove previous theme classes
    root.classList.remove('light-theme', 'dark-theme');
    
    // Determine which theme to use
    let themeToApply = mode;
    
    // If system preference is selected, check user's system preference
    if (mode === 'system') {
      themeToApply = window.matchMedia('(prefers-color-scheme: dark)').matches 
        ? 'dark' 
        : 'light';
    }
    
    // Apply the theme class
    root.classList.add(`${themeToApply}-theme`);
    
    // Set a data attribute for easier CSS targeting
    root.setAttribute('data-theme', themeToApply);
  }, [mode]);
  
  return {
    mode,
    isDarkMode: mode === 'dark' || (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches),
    isLightMode: mode === 'light' || (mode === 'system' && !window.matchMedia('(prefers-color-scheme: dark)').matches),
    changeTheme,
    toggleTheme
  };
};