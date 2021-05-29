import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

const reduxer = combineReducers({});

const middleware = [thunk];

const init = {};

const store = createStore(
	reduxer,
	init,
	composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
