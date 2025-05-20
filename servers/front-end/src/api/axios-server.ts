import axios from "axios";

export const clientAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // Replace with your API endpoint
});

export const serverAxios = axios.create({
  baseURL: process.env.API_URL, // Replace with your API endpoint
});
