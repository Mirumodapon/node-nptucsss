import { SET_USER } from '../type';

const init = {
	token: null,
	uuid: null,
	authority: 0
};

const reduces = (state = init, { type, payload }) => {
	switch (type) {
		case SET_USER:
			return {
				...state,
				token: payload.token,
				authority: payload.authority,
				uuid: payload.uuid
			};
		default:
			return state;
	}
};

export default reduces;
