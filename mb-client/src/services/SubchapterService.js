import inMemoryJWT from "./inMemoryJWT";
import axios from 'axios';
import config from '../config';


export const SubchapterClient = axios.create({
	baseURL: `${config.API_URL}/subchapter`,
});
export const SubchaptersClient = axios.create({
	baseURL: `${config.API_URL}/subchapters`,
});

SubchapterClient.interceptors.request.use(
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

SubchaptersClient.interceptors.request.use(
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

export const createSubchapter = async (chapter) => {
	const data = await SubchapterClient.post('', chapter)
	return data

}

export const fetchSubchapters = async () => {
	const { data } = await SubchapterClient.get('')
	return data
}

export const fetchOneSubchapter = async (id) => {
	const { data } = await SubchapterClient.get('/' + id)
	return data
}

export const fetchSubchaptersByProject = async (projectBy) => {
	const { data } = await SubchapterClient.get('/?projectBy=' + projectBy)
	return data
}

export const updateSubchapter = async (chapter) => {
	const data = await SubchapterClient.patch('', chapter)
	return data
}

export const deleteSubchapter = async (id) => {
	const data = await SubchapterClient.delete('/' + id)
	return data
}

export const deleteSubchaptersByProject = async (projectBy) => {
	const data = await SubchaptersClient.delete('/?projectBy=' + projectBy)
	return data
}

export const deleteSubchaptersByChapter = async (chapterBy) => {
	const data = await SubchaptersClient.delete('/?chapterBy=' + chapterBy)
	return data
}

