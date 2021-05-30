import axios from 'axios';

export const auth = axios.create({
	baseURL: 'http://localhost:5001/api/v1/auth'
});
