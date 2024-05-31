import inMemoryJWT from "./inMemoryJWT";
import axios from 'axios';
import config from '../config';


export const MaterialClient = axios.create({
	baseURL: `${config.API_URL}/material`,
});

export const MaterialsClient = axios.create({
	baseURL: `${config.API_URL}/materials`,
});

MaterialClient.interceptors.request.use(
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

MaterialsClient.interceptors.request.use(
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

export const createMaterial = async (material) => {
	const data = await MaterialClient.post('', material)
	return data
}

export const fetchMaterials = async () => {
	const { data } = await MaterialClient.get('')
	return data
}

export const fetchOneMaterial = async (id) => {
	const { data } = await MaterialClient.get('/' + id)
	return data
}

export const fetchMaterialsByProject = async (projectBy) => {
	const { data } = await MaterialClient.get('/?projectBy=' + projectBy)
	return data
}

export const updateMaterial = async (material) => {
	const data = await MaterialClient.patch('', material)
	return data

}

export const deleteMaterial = async (id) => {
	const data = await MaterialClient.delete('/' + id)
	return data
}

export const deleteMaterialsByProject = async (projectBy) => {
	const data = await MaterialsClient.delete('/?projectBy=' + projectBy)
	return data
}

export const deleteMaterialsByWork = async (workBy) => {
	const data = await MaterialsClient.delete('/?workBy=' + workBy)
	return data
}

export const deleteMaterialsByChapter = async (chapterBy) => {
	const data = await MaterialsClient.delete('/?chapterBy=' + chapterBy)
	return data
}

export const deleteMaterialsBySubchapter = async (subchapterBy) => {
	const data = await MaterialsClient.delete('/?subchapterBy=' + subchapterBy)
	return data
}
