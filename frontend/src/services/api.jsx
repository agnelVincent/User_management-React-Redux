import axios from 'axios'
import store from '../redux/store'

const BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL : BASE_URL,
    timeout : 5000,
    headers : {
        'Content-Type' : 'application/json'
    }
})

api.interceptors.request.use(
    config => {
        const token = store.getState().auth?.accessToken
        if(token){
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    error => Promise.reject(error)
)

api.interceptors.response.use(
    response => response,
    error => {
        if(error.response?.status === 401){
            console.warn('Unauthorized access - maybe redirect to login')
        }
        return Promise.reject(error)
    }
)

export default api