import inMemoryJWT from "./inMemoryJWT";
import axios from "axios";
// import config from '../config';

export const UserClient = axios.create({
  // baseURL: `${config.API_URL}/user`,
});

export const UsersClient = axios.create({
  // baseURL: `${config.API_URL}/users`,
});

// UserClient.interceptors.request.use(
//   (config) => {
//     const accessToken = inMemoryJWT.getToken();

//     if (accessToken) {
//       config.headers["Authorization"] = `Bearer ${accessToken}`;
//     }

//     return config;
//   },
//   (error) => {
//     Promise.reject(error);
//   }
// );

// UsersClient.interceptors.request.use(
//   (config) => {
//     const accessToken = inMemoryJWT.getToken();

//     if (accessToken) {
//       config.headers["Authorization"] = `Bearer ${accessToken}`;
//     }

//     return config;
//   },
//   (error) => {
//     Promise.reject(error);
//   }
// );

export const fetchUserByProfile = async (id) => {
  const { data } = await UserClient.get("/" + id);
  return data;
};

export const fetchUsersByRole = async (role) => {
  const { data } = await UsersClient.get("/" + role);
  return data;
};

export const fetchAllUsers = async () => {
  const { data } = await UserClient.get("/");
  return data;
};
