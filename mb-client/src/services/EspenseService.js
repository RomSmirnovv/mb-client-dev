import inMemoryJWT from "./inMemoryJWT";
import axios from 'axios';
import config from '../config';


export const EspenseClient = axios.create({
	baseURL: `${config.API_URL}/espense`,
});

export const EspensesClient = axios.create({
	baseURL: `${config.API_URL}/espenses`,
});

EspenseClient.interceptors.request.use(
	(config) => {
		const accessToken = inMemoryJWT.getToken();

		if (accessToken) {
			config.headers["Authorization"] = `Bearer ${accessToken}`;
		}

		return config;
	},
	(error) => {
		Promise.reject(error);
	}
);

EspensesClient.interceptors.request.use(
	(config) => {
		const accessToken = inMemoryJWT.getToken();

		if (accessToken) {
			config.headers["Authorization"] = `Bearer ${accessToken}`;
		}

		return config;
	},
	(error) => {
		Promise.reject(error);
	}
);

export const createEspense = async (espense) => {
	const data = await EspenseClient.post('', espense)
	return data

}

export const fetchEspenses = async () => {
	const { data } = await EspenseClient.get('')
	return data
}

export const fetchOneEspense = async (id) => {
	const { data } = await EspenseClient.get('/' + id)
	return data
}

export const fetchEspensesByProject = async (projectBy) => {
	const { data } = await EspenseClient.get('/?projectBy=' + projectBy)
	return data
}

export const updateEspense = async (espense) => {
	const data = await EspenseClient.patch('', espense)
	return data

}

export const deleteEspense = async (id) => {
	const data = await EspenseClient.delete('/' + id)
}

export const deleteEspensesByProject = async (projectBy) => {
	const data = await EspensesClient.delete('/?projectBy=' + projectBy)
	return data
}

export const deleteEspensesByChapter = async (chapterBy) => {
	const data = await EspensesClient.delete('/?chapterBy=' + chapterBy)
	return data
}

export const deleteEspensesBySubchapter = async (subchapterBy) => {
	const data = await EspensesClient.delete('/?subchapterBy=' + subchapterBy)
	return data
}


