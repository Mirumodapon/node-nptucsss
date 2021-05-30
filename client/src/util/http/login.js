import { auth } from './axios';

export default ({ email, password }) => {
	return auth.post('/login', { email, password });
};
