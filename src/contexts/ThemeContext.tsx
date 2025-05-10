import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeProvider as MUIThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeMode } from '../types';
import { getTheme, saveTheme } from '../utils/localStorage';

interface ThemeContextType {
  themeMode: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>({ mode: 'light' });

  useEffect(() => {
    const savedTheme = getTheme();
    setThemeMode({ mode: savedTheme });
  }, []);

  const toggleTheme = () => {
    const newMode = themeMode.mode === 'light' ? 'dark' : 'light';
    setThemeMode({ mode: newMode });
    saveTheme(newMode);
  };

  const theme = createTheme({
    palette: {
      mode: themeMode.mode,
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#f50057',
      },
      background: {
        default: themeMode.mode === 'light' ? '#f5f5f5' : '#121212',
        paper: themeMode.mode === 'light' ? '#ffffff' : '#1e1e1e',
      },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            transition: 'transform 0.3s',
            '&:hover': {
              transform: 'scale(1.03)',
            },
          },
        },
      },
    },
  });

  const value = {
    themeMode,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  );
}; 