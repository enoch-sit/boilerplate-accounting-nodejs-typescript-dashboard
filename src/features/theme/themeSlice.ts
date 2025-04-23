import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  mode: ThemeMode;
}

// Get the initial theme from localStorage, or default to 'light'
const getInitialTheme = (): ThemeMode => {
  if (typeof window === 'undefined') return 'light';
  
  const savedTheme = localStorage.getItem('theme') as ThemeMode;
  if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
    return savedTheme;
  }
  
  return 'light';
};

const initialState: ThemeState = {
  mode: getInitialTheme(),
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', action.payload);
      }
    },
  },
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;