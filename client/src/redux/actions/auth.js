import * as api from '../../api';
import { LOAD_ALL_USERS, SET_AUTH } from '../../constants/actionTypes';
import { PROFILE } from '../../constants/localStorageItemName';
import { ADMIN } from '../../constants/positions';
import { checkIntersection } from '../../utils/array';

export const loadUser = () => async (dispatch) => {
  try {
    const response = await api.get('/users/auth');
    const canAccess = checkIntersection(response.data?.user?.positions, ADMIN);
    if (canAccess) {
      dispatch({
        type: SET_AUTH,
        payload: {
          isAuthenticated: true,
          user: response.data.user
        }
      });
    }
  } catch (error) {
    localStorage.removeItem(PROFILE);
    dispatch({
      type: SET_AUTH,
      payload: {
        isAuthenticated: false,
        user: null
      }
    });
    console.log(error);
  }
};

export const login = (userInfo) => async (dispatch) => {
  try {
    const response = await api.post('/users/login', userInfo);
    const canAccess = checkIntersection(response.data?.positions, ADMIN);
    if (!canAccess) {
      return {
        message: 'Không có quyền truy cập!'
      };
    }
    if (response.data.success) {
      localStorage.setItem(PROFILE, JSON.stringify(response.data.user));
    }
    await loadUser();
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const logout = () => (dispatch) => {
  localStorage.removeItem(PROFILE);
  dispatch({
    type: SET_AUTH,
    payload: {
      isAuthenticated: false,
      user: null
    }
  });
};

export const getMembers = () => async (dispatch) => {
  try {
    const response = await api.get('/users');
    dispatch({
      type: LOAD_ALL_USERS,
      payload: response.data.users
    });
  } catch (error) {
    console.log(error);
  }
};
