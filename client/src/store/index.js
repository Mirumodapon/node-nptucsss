import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import auth from './reduces/auth';
const reduxer = combineReducers({
	auth
});

const middleware = [thunk];

const init = {};

const store = createStore(
	reduxer,
	init,
	composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
