import inMemoryJWT from "./inMemoryJWT";
import axios from 'axios';
import config from '../config';


export const ShipmentClient = axios.create({
	baseURL: `${config.API_URL}/shipment`,
});

export const ShipmentsClient = axios.create({
	baseURL: `${config.API_URL}/shipments`,
});

ShipmentClient.interceptors.request.use(
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

ShipmentsClient.interceptors.request.use(
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

export const createShipment = async (shipment) => {
	const data = await ShipmentClient.post('', shipment)
	return data
}

export const fetchShipments = async () => {
	const { data } = await ShipmentClient.get('')
	return data
}

export const fetchShipmentsByProject = async (projectBy) => {
	const { data } = await ShipmentClient.get('/?projectBy=' + projectBy)
	return data
}

export const updateShipment = async (shipment) => {
	const data = await ShipmentClient.patch('', shipment)
	return data

}

export const deleteShipment = async (id) => {
	const data = await ShipmentClient.delete('/' + id)
	return data
}

export const deleteShipmentsByProject = async (projectBy) => {
	const data = await ShipmentsClient.delete('/?projectBy=' + projectBy)
	return data
}

export const deleteShipmentsByWork = async (workBy) => {
	const data = await ShipmentsClient.delete('/?workBy=' + workBy)
	return data
}

export const deleteShipmentsByChapter = async (chapterBy) => {
	const data = await ShipmentsClient.delete('/?chapterBy=' + chapterBy)
	return data
}

export const deleteShipmentsBySubchapter = async (subchapterBy) => {
	const data = await ShipmentsClient.delete('/?subchapterBy=' + subchapterBy)
	return data
}

export const deleteShipmentsByMaterial = async (materialBy) => {
	const data = await ShipmentsClient.delete('/?materialBy=' + materialBy)
	return data
}
