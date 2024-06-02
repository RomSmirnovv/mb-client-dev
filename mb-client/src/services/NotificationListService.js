import inMemoryJWT from "./inMemoryJWT";
import axios from "axios";
// import config from '../config';

export const NotificationListClient = axios.create({
  // baseURL: `${config.API_URL}/notification_list`,
});

// NotificationListClient.interceptors.request.use(
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

export const createNotificationList = async (notificationList) => {
  const data = await NotificationListClient.post("", notificationList);
  return data;
};

export const editNotificationList = async (notificationList) => {
  const id = notificationList._id;
  const data = await NotificationListClient.patch("/" + id, notificationList);
  return data;
};

export const fetchNotificationLists = async () => {
  const { data } = await NotificationListClient.get("");
  return data;
};

export const fetchOneNotificationList = async (id) => {
  const { data } = await NotificationListClient.get("/" + id);
  return data;
};

export const deleteNotificationList = async (id) => {
  const data = await NotificationListClient.delete("/" + id);
  return data;
};
