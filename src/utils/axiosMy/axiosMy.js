'use client'

import axios from "axios";
import { apiSoftInsta } from "@/app/config/config";
import Router from "next/navigation"; // Импортируем Router для редиректа

const axiosRequest = axios.create({
    baseURL: apiSoftInsta,
    headers: {
        "Authorization": `Bearer ${localStorage.getItem("access_token")}`
    }
});

axiosRequest.interceptors.response.use(
    (response) => response, // Возвращаем ответ в случае успеха
    (error) => {
        if (error.response?.status === 401) { // Если ошибка авторизации
            console.log("Unauthorized, redirecting to login");
            // localStorage.removeItem("access_token"); // Удаляем токен из localStorage
            Router.push("/login"); // Редиректим пользователя на страницу логина без перезагрузки страницы
        }
        return Promise.reject(error); // Пробрасываем ошибку дальше
    }
);

export default axiosRequest;
