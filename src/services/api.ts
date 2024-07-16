import axios from 'axios';
import config from '../config';


const api = axios.create({
    baseURL: config.BACKEND_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.response.use(
    response => response,
    error => {
        console.error('API error:', error);
        return Promise.reject(error);
    }
);

// manage auth
export const userRegister = (data: any) => api.post('/auth/register', data);
export const userLogin = (data: any) => api.post('/auth/login', data);

// manage posts and comments
export const getPosts = (params: any) => api.get('/posts', { params });
export const getPost = (id: string) => api.get(`/posts/${id}`);
export const createPost = (data: any) => api.post('/posts', data);
export const updatePost = (id: string, data: any) => api.put(`/posts/${id}`, data);
export const deletePost = (id: string) => api.delete(`/posts/${id}`);
export const createComment = (postId: string, data: any) => api.post(`/posts/${postId}/comments`, data);
export const deleteComment = (postId: string, commentId: string) => api.delete(`/posts/${postId}/comments/${commentId}`);