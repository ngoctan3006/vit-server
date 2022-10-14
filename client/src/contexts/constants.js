export const apiUrl =
    process.env.NODE_ENV !== 'production'
        ? 'http://localhost:2109/api/v1'
        : 'https://vit-api-server.herokuapp.com/api/v1';

export const LOCAL_STORAGE_TOKEN_NAME = 'VIT';

export const SET_THEME = 'SET_THEME';
export const SET_COLOR = 'SET_COLOR';

export const SET_AUTH = 'SET_AUTH';
export const LOAD_ALL_USERS = 'LOAD_ALL_USERS';

export const ADMIN = ['admin'];
