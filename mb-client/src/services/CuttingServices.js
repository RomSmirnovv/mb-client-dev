import inMemoryJWT from "./inMemoryJWT";
import axios from 'axios';
import config from '../config';
import { useState } from 'react';


export const CuttingClient = axios.create({
	baseURL: `${config.API_URL}/cutting`,
});

export const CuttingsClient = axios.create({
	baseURL: `${config.API_URL}/cuttings`,
});

export const CuttingUploadClient = axios.create({
	baseURL: `${config.API_URL}/cuttingupload`,
});

export const CuttingDeleteClient = axios.create({
	baseURL: `${config.API_URL}/cuttingdeletefile`,
});

CuttingsClient.interceptors.request.use(
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

CuttingClient.interceptors.request.use(
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

CuttingUploadClient.interceptors.request.use(
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

CuttingDeleteClient.interceptors.request.use(
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

export const createCutting = async (cutting) => {
	const data = await CuttingClient.post('', cutting)
	return data
}

export const fetchCuttingsByProject = async (projectId) => {
	const { data } = await CuttingsClient.get('/' + projectId)
	return data
}

export const fetchOneCutting = async (id) => {
	const { data } = await CuttingClient.get('/' + id)
	return data
}

export const editCutting = async (cutting) => {
	const id = cutting._id
	const data = await CuttingClient.patch('/' + id, cutting)
	return data
}

export const uploadCutting = async (id, formData) => {
	try {
		const data = await CuttingUploadClient.post('/' + id, formData)
		return data
	} catch (err) {
		console.log("Eroor: ", err);
	}
}

export const deleteCutting = async (id) => {
	const data = await CuttingClient.delete('/' + id)
	return data
}

export const deleteCuttingFile = async (fileList, newFileList, file) => {
	const id = fileList[0].cuttingId
	const cutting = {
		_id: id,
		photos: newFileList,
	}
	try {
		const data = await CuttingDeleteClient.post('/' + id, { cutting, file })
		return data
	} catch (err) {
		console.log("Eroor: ", err);
	}
}

// export const editProjects = async (formData) => {
// 	let project = JSON.parse(formData.get('project'));
// 	const data = await ProjectClient.patch('/' + project._id, formData)
// 	return data
// }

// export const editProject = async (project) => {
// 	const id = project._id
// 	const data = await ProjectClient.patch('/' + id, project)
// 	return data
// }

// export const changeProjectStatus = async (id, status) => {
// 	const data = await ProjectChangeStatusClient.patch('/' + id, { status })
// 	return data
// }

// export const fetchProjects = async () => {
// 	const { data } = await ProjectClient.get('')
// 	return data
// }

// export const fetchOneProjects = async (id) => {
// 	const { data } = await ProjectClient.get('/' + id)
// 	return data
// }

// export const deleteProjects = async (id) => {
// 	const data = await ProjectClient.delete('/' + id)
// 	return data
// }

// export const uploadProjectData = async (fmData) => {
// 	try {
// 		const data = await ProjectUploadClient.post('/', fmData)
// 		return data
// 	} catch (err) {
// 		console.log("Eroor: ", err);
// 	}
// }
// 	const data = await ProjectDeleteClient.post('/' + id, dataProject)
// 	return data
// }