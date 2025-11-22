// API Endpoints - Uses environment variables for different environments
export const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
console.log('Environment variables:', import.meta.env);
console.log('Using API_BASE:', API_BASE);

// User endpoints
export const USER_API_END_POINT = `${API_BASE}/api/v1/user`;

// Job endpoints
export const JOB_API_END_POINT = `${API_BASE}/api/v1/job`;

// Company endpoints
export const COMPANY_API_END_POINT = `${API_BASE}/api/v1/company`;

// Application endpoints
export const APPLICATION_API_END_POINT = `${API_BASE}/api/v1/application`;

// export const API_BASE = "https://job-portal-backend-j7p6.onrender.com";