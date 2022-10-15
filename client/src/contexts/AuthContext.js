import { createContext, useEffect, useReducer } from 'react';
import axios from 'axios';
import authReducer from '../reducers/authReducer';
import {
  ADMIN,
  apiUrl,
  LOAD_ALL_USERS,
  LOCAL_STORAGE_TOKEN_NAME,
  SET_AUTH
} from './constants';
import setAuthToken from '../utils/setAuthToken';
import { checkIntersection } from '../utils/array';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [authState, dispatch] = useReducer(authReducer, {
    authLoading: true,
    isAuthenticated: false,
    user: null,
    users: [],
    usersLoad: false
  });

  const loadUser = async () => {
    if (localStorage[LOCAL_STORAGE_TOKEN_NAME]) {
      setAuthToken(localStorage[LOCAL_STORAGE_TOKEN_NAME]);
    }

    try {
      const response = await axios.get(`${apiUrl}/users/auth`);
      const canAccess = checkIntersection(
        response.data?.user?.positions,
        ADMIN
      );
      if (response.data.success && canAccess) {
        dispatch({
          type: SET_AUTH,
          payload: {
            isAuthenticated: true,
            user: response.data.user
          }
        });
      }
    } catch (error) {
      localStorage.removeItem(LOCAL_STORAGE_TOKEN_NAME);
      setAuthToken(null);
      dispatch({
        type: SET_AUTH,
        payload: {
          isAuthenticated: false,
          user: null
        }
      });
    }
  };

  useEffect(() => loadUser(), []);

  const login = async (userInfo) => {
    try {
      const response = await axios.post(`${apiUrl}/users/login`, userInfo);
      const canAccess = checkIntersection(response.data?.positions, ADMIN);
      if (!canAccess) {
        return {
          success: false,
          message: 'Không có quyền truy cập!'
        };
      }
      if (response.data.success) {
        localStorage.setItem(
          LOCAL_STORAGE_TOKEN_NAME,
          response.data.accessToken
        );
      }
      await loadUser();
      return response.data;
    } catch (error) {
      if (error.response.data) return error.response.data;
      else
        return {
          success: false,
          message: error.message
        };
    }
  };

  const logout = () => {
    localStorage.removeItem(LOCAL_STORAGE_TOKEN_NAME);
    dispatch({
      type: SET_AUTH,
      payload: {
        isAuthenticated: false,
        user: null
      }
    });
  };

  const getUsers = async () => {
    try {
      const response = await axios.get(`${apiUrl}/users`);

      if (response.data.success) {
        dispatch({
          type: LOAD_ALL_USERS,
          payload: response.data.users
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const authContextData = {
    authState,
    login,
    logout,
    getUsers
  };

  return (
    <AuthContext.Provider value={authContextData}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
