import inMemoryJWT from "./inMemoryJWT";
import axios from 'axios';
import config from '../config';


export const NotificationClient = axios.create({
	baseURL: `${config.API_URL}/notification`,
});

export const NotificationClientForList = axios.create({
	baseURL: `${config.API_URL}/notification_for_list`,
});

NotificationClient.interceptors.request.use(
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

NotificationClientForList.interceptors.request.use(
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

export const createNotification = async (notification) => {
	const data = await NotificationClient.post('', notification)
	return data
}

export const createNotificationForList = async (notification, listName) => {
	const data = await NotificationClientForList.post('/' + listName, notification)
	return data
}

export const editNotification = async (notification) => {
	const id = notification._id
	const data = await NotificationClient.patch('/' + id, notification)
	return data
}

export const fetchNotifications = async () => {
	const { data } = await NotificationClient.get('')
	return data
}

export const fetchOneNotification = async (id) => {
	const { data } = await NotificationClient.get('/' + id)
	return data
}

export const deleteNotification = async (id) => {
	const data = await NotificationClient.delete('/' + id)
	return data
}