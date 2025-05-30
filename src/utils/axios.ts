import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchData = async (url: string) => {
  const response = await axios.get(url);
  return response.data;
};

export const postData = async (url: string, data: object) => {
  const response = await axios.post(url, data);
  return response.data;
};

export const updateData = async (url: string, data: object) => {
  const response = await axios.put(url, data);
  return response.data;
};

export const deleteData = async (url: string) => {
  const response = await axios.delete(url);
  return response.data;
};

export default axiosInstance;
