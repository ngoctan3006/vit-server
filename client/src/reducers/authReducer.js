import { SET_AUTH } from '../contexts/constants';

const authReducer = (state, action) => {
    const {
        type,
        payload: { isAuthenticated, user }
    } = action;

    switch (type) {
        case SET_AUTH:
            return {
                ...state,
                authLoading: false,
                isAuthenticated,
                user
            };
        default:
            return state;
    }
};

export default authReducer;