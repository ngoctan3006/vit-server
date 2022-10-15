import { SET_COLOR, SET_THEME } from '../contexts/constants';

const themeReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case SET_THEME:
      return {
        ...state,
        theme: payload
      };
    case SET_COLOR:
      return {
        ...state,
        color: payload
      };
    default:
      return state;
  }
};

export default themeReducer;
