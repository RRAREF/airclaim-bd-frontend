import axios from "axios";

const API = axios.create({
  baseURL: "https://airclaim-bd-backend-production.up.railway.app/api"
});

export default API;