import { combineReducers } from 'redux';

import theme from './theme';
import auth from './auth';

export const reducers = combineReducers({ theme, auth });
