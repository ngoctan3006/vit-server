import { LOAD_ALL_USERS, SET_AUTH } from '../contexts/constants';

const authReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case SET_AUTH:
      return {
        ...state,
        authLoading: false,
        isAuthenticated: payload.isAuthenticated,
        user: payload.user
      };
    case LOAD_ALL_USERS:
      return {
        ...state,
        usersLoad: true,
        users: payload
      };
    default:
      return state;
  }
};

export default authReducer;
