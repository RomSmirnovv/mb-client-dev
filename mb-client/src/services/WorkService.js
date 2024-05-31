import inMemoryJWT from "./inMemoryJWT";
import axios from 'axios';
import config from '../config';


export const WorkClient = axios.create({
	baseURL: `${config.API_URL}/work`,
});

export const WorksClient = axios.create({
	baseURL: `${config.API_URL}/works`,
});

export const SheduleByWorkClient = axios.create({
	baseURL: `${config.API_URL}/schedule`,
});

WorkClient.interceptors.request.use(
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

WorksClient.interceptors.request.use(
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

SheduleByWorkClient.interceptors.request.use(
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

export const createWork = async (work) => {
	const data = await WorkClient.post('', work)
	return data

}

export const fetchWorks = async () => {
	const { data } = await WorkClient.get('')
	return data
}

export const fetchOneWork = async (id) => {
	const { data } = await WorkClient.get('/' + id)
	return data
}

export const fetchWorksByProject = async (projectBy) => {
	const { data } = await WorkClient.get('/?projectBy=' + projectBy)
	return data
}

export const updateWork = async (work) => {
	const data = await WorkClient.patch('', work)
	return data

}

export const updateWorksScheduleByProject = async (projectBy) => {
	const work = { deleteActualSchedule: false }
	const data = await WorksClient.patch('/?projectBy=' + projectBy, work)
	return data
}

export const deleteWorksScheduleByProject = async (projectBy) => {
	const work = { deleteActualSchedule: true }
	const data = await WorksClient.patch('/?projectBy=' + projectBy, work)
	return data
}

export const deleteWork = async (id) => {
	const data = await WorkClient.delete('/' + id)
}

export const deleteWorksByProject = async (projectBy) => {
	const data = await WorksClient.delete('/?projectBy=' + projectBy)
	return data
}

export const deleteWorksByChapter = async (chapterBy) => {
	const data = await WorksClient.delete('/?chapterBy=' + chapterBy)
	return data
}

export const deleteWorksBySubchapter = async (subchapterBy) => {
	const data = await WorksClient.delete('/?subchapterBy=' + subchapterBy)
	return data
}


export const createSheduleByWork = async (work) => {
	const data = await SheduleByWorkClient.patch('', work)
	return data

}

export const deleteSheduleByWork = async (id) => {
	const data = await SheduleByWorkClient.delete('/' + id)
	return data
}

export const saveActualScheduleByWork = async (workBy) => {
	const work = { _id: workBy }
	const data = await SheduleByWorkClient.patch('', work)
	return data
}





