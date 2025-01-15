import axios from "axios"

const apios = axios.create({
    baseURL: import.meta.mode == "development"? "http://localhost:5011/api" : "/api",
    withCredentials: true
})

export default apios