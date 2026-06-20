
import axios from "axios"
const BASE_URL = "https://edumoon-fs-ai.onrender.com"

const userLogin = (reqBody: any) => {
    return axios.post(`${BASE_URL}/user/login`, reqBody);
}

const getUserAccounts = () => {
    const headers = {"headers": {"Authorization": `Bearer ${localStorage.getItem("token")}`}};
    return axios.get(`${BASE_URL}/accounts`, headers);
}

const updateUserAccount = (reqBody: any) => {
    const headers = {"headers": {"Authorization": `Bearer ${localStorage.getItem("token")}`}};
    return axios.put(`${BASE_URL}/accounts/${reqBody._id}`, reqBody, headers);
}

const createUserAccount = (reqBody: any) => {
    const headers = {"headers": {"Authorization": `Bearer ${localStorage.getItem("token")}`}};
    return axios.post(`${BASE_URL}/accounts`, reqBody, headers);
}

export { userLogin, getUserAccounts, updateUserAccount, createUserAccount };