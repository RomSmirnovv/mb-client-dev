import inMemoryJWT from "./inMemoryJWT";
import axios from "axios";
// import config from '../config';

export const ChapterClient = axios.create({
  // baseURL: `${config.API_URL}/chapter`,
});
export const ChaptersClient = axios.create({
  // baseURL: `${config.API_URL}/chapters`,
});

ChapterClient.interceptors.request.use(
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

ChaptersClient.interceptors.request.use(
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

export const createChapter = async (chapter) => {
  const data = await ChapterClient.post("", chapter);
  return data;
};

export const fetchChapters = async () => {
  const { data } = await ChapterClient.get("");
  return data;
};

export const fetchOneChapter = async (id) => {
  const { data } = await ChapterClient.get("/" + id);
  return data;
};

export const fetchChaptersByProject = async (projectBy) => {
  const { data } = await ChapterClient.get("/?projectBy=" + projectBy);
  return data;
};

export const updateChapter = async (chapter) => {
  const data = await ChapterClient.patch("", chapter);
  return data;
};

export const deleteChapter = async (id) => {
  const data = await ChapterClient.delete("/" + id);
  return data;
};

export const deleteChaptersByProject = async (projectBy) => {
  const data = await ChaptersClient.delete("/?projectBy=" + projectBy);
  return data;
};
