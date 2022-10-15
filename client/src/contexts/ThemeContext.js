import { createContext, useReducer } from 'react';
import themeReducer from '../reducers/themeReducer';
import { SET_COLOR, SET_THEME } from './constants';

export const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const [themeState, dispatch] = useReducer(themeReducer, {
    color: {
      name: 'blue',
      background: 'blue-color',
      class: 'theme-color-blue'
    },
    theme: {
      name: 'light',
      background: 'light-background',
      class: 'theme-mode-light'
    }
  });

  const setTheme = (theme) => {
    localStorage.setItem('theme', theme.name);
    dispatch({
      type: SET_THEME,
      payload: theme
    });
  };

  const setColor = (color) => {
    localStorage.setItem('color', color.name);
    dispatch({
      type: SET_COLOR,
      payload: color
    });
  };

  const themeContextData = { themeState, setTheme, setColor };

  return (
    <ThemeContext.Provider value={themeContextData}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
