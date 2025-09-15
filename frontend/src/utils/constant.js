// API Base URL from environment variable, fallback to localhost for development
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

export const USER_API_END_POINT = `${API_BASE}/api/v1/user`;
export const JOB_API_END_POINT = `${API_BASE}/api/v1/job`;
export const APPLICATION_API_END_POINT = `${API_BASE}/api/v1/application`;
export const COMPANY_API_END_POINT = `${API_BASE}/api/v1/company`;