import _login from '../../util/http/login';
import { SET_USER } from '../type';

export const login = ({ email, password }) => async (dispatch) => {
	const user = await _login({ email, password });
	dispatch({
		type: SET_USER,
		payload: user
	});
};
