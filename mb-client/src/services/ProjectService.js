import inMemoryJWT from "./inMemoryJWT";
import axios from "axios";
// import config from '../config';
import { useState } from "react";

export const ProjectClient = axios.create({
  // baseURL: `${config.API_URL}/project`,
});

export const ProjectUploadClient = axios.create({
  // baseURL: `${config.API_URL}/upload`,
});

export const ProjectDeleteClient = axios.create({
  // baseURL: `${config.API_URL}/deletefile`,
});

export const ProjectChangeStatusClient = axios.create({
  // baseURL: `${config.API_URL}/changestatus`,
});

// ProjectClient.interceptors.request.use(
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

// ProjectUploadClient.interceptors.request.use(
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

// ProjectDeleteClient.interceptors.request.use(
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

// ProjectChangeStatusClient.interceptors.request.use(
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

export const createProjects = async (formData) => {
  const data = await ProjectClient.post("", formData);
  return data;
};

export const editProjects = async (formData) => {
  let project = JSON.parse(formData.get("project"));
  const data = await ProjectClient.patch("/" + project._id, formData);
  return data;
};

export const editProject = async (project) => {
  const id = project._id;
  const data = await ProjectClient.patch("/" + id, project);
  return data;
};

export const changeProjectStatus = async (id, status) => {
  const data = await ProjectChangeStatusClient.patch("/" + id, { status });
  return data;
};

export const fetchProjects = async () => {
  const { data } = await ProjectClient.get("");
  return data;
};

export const fetchOneProjects = async (id) => {
  const { data } = await ProjectClient.get("/" + id);
  return data;
};

export const deleteProjects = async (id) => {
  const data = await ProjectClient.delete("/" + id);
  return data;
};

export const uploadProjectData = async (fmData) => {
  try {
    const data = await ProjectUploadClient.post("/", fmData);
    return data;
  } catch (err) {
    console.log("Eroor: ", err);
  }
};

export const deleteProjectData = async (id, newFileList, file) => {
  const dataProject = {
    fileList: newFileList,
    file: file,
  };
  const data = await ProjectDeleteClient.post("/" + id, dataProject);
  return data;
};
