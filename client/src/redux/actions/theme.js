import { SET_COLOR, SET_THEME } from '../../constants/actionTypes';

export const setTheme = (theme) => (dispatch) => {
  localStorage.setItem('theme', theme.name);
  dispatch({
    type: SET_THEME,
    payload: theme
  });
};

export const setColor = (color) => (dispatch) => {
  localStorage.setItem('color', color.name);
  dispatch({
    type: SET_COLOR,
    payload: color
  });
};
