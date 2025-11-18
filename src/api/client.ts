import axios from 'axios';

/**
 * Axios 클라이언트 설정
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// 요청 인터셉터 (향후 인증 토큰 추가 가능)
apiClient.interceptors.request.use(
  (config) => {
    // 향후 JWT 토큰 추가
    // const token = localStorage.getItem('access_token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // 인증 실패 처리 (향후 추가)
      console.error('Unauthorized');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
