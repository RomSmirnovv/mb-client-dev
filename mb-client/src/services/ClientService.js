import inMemoryJWT from "./inMemoryJWT";
import axios from "axios";
// import config from '../config';

export const ClientClient = axios.create({
  // baseURL: `${config.API_URL}/client`,
});

ClientClient.interceptors.request.use(
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

export const createClient = async (clientData) => {
  const data = await ClientClient.post("", clientData);
  return data;
};

export const editClients = async (clientData) => {
  const { _id } = clientData;
  const data = await ClientClient.patch("/" + _id, clientData);
  return data;
};

export const fetchClients = async () => {
  const { data } = await ClientClient.get("");
  return data;
};

export const fetchOneClients = async (id) => {
  const { data } = await ClientClient.get("/" + id);
  return data;
};

export const deleteClients = async (id) => {
  const data = await ClientClient.delete("/" + id);
  return data;
};
