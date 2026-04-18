import axios from 'axios';

const customerApi = axios.create({
    baseURL: 'http://10.0.2.2:8087/api/customers', // 10.0.2.2 para el emulador de Android Studio
    headers: { 'Content-Type': 'application/json' }
});

export default customerApi;