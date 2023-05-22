import axios from 'axios';

export const api = axios.create({
    baseURL: 'https://jakunzler-notes.onrender.com',
});