import { createContext, useEffect, useReducer } from 'react';
import axios from 'axios';
import authReducer from '../reducers/authReducer';
import { apiUrl, LOCAL_STORAGE_TOKEN_NAME, SET_AUTH } from './constants';
import setAuthToken from '../utils/setAuthToken';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [authState, dispatch] = useReducer(authReducer, {
        authLoading: true,
        isAuthenticated: false,
        user: null
    });

    const loadUser = async () => {
        if (localStorage[LOCAL_STORAGE_TOKEN_NAME]) {
            setAuthToken(localStorage[LOCAL_STORAGE_TOKEN_NAME]);
        }

        try {
            const response = await axios.get(`${apiUrl}/users/auth`);
            if (response.data.success) {
                dispatch({
                    type: SET_AUTH,
                    payload: {
                        isAuthenticated: true,
                        user: response.data.user
                    }
                });
            }
        } catch (err) {
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
            const response = await axios.post(
                `${apiUrl}/users/login`,
                userInfo
            );
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

    const authContextData = {
        authState,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={authContextData}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
