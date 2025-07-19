const hostname = window.location.hostname;

const isNipIO = hostname.includes('nip.io');
const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';

// Base URL for current environment
export const BASE_URL = isNipIO
    ? `https://${hostname}` // e.g., https://wheel-of-life.54.166.45.176.nip.io
    : isLocalhost
        ? 'http://localhost:8080' // local backend default
        : 'https://opsontherocks.student.k8s.aet.cit.tum.de';

// API endpoints
export const API_URL = BASE_URL;

export const AUTH_URL = isLocalhost
    ? 'http://localhost:8081'
    : `${BASE_URL}/auth`;

export const WHEEL_URL = isLocalhost
    ? 'http://localhost:8080'
    : `${BASE_URL}/wheel`;

export const GENAI_URL = isLocalhost
    ? 'http://localhost:5001'
    : `${BASE_URL}/genai`;

// Auth endpoints
export const LOGIN_URL = `${AUTH_URL}/login`;
export const REGISTER_URL = `${AUTH_URL}/register`;
export const LOGOUT_URL = `${AUTH_URL}/logout`;
export const ME_URL = `${API_URL}/users/me`;

// GenAI endpoints
export const GENAI_CHAT_URL = `${GENAI_URL}/chat`;
export const GENAI_ANALYZE_URL = `${GENAI_URL}/analyze`;

// Health checks
export const AUTH_HEALTH_URL = `${AUTH_URL}/healthCheck`;
export const WHEEL_HEALTH_URL = `${WHEEL_URL}/healthCheck`;
export const GENAI_HEALTH_URL = `${GENAI_URL}/healthCheck`;

// --- Optional static definitions (for explicit override/debugging) ---

// Kubernetes Ingress URLs
export const K8S_BASE = 'https://opsontherocks.student.k8s.aet.cit.tum.de';
export const K8S_AUTH_URL = `${K8S_BASE}/auth`;
export const K8S_WHEEL_URL = `${K8S_BASE}/wheel`;
export const K8S_GENAI_URL = `${K8S_BASE}/genai`;

// AWS EC2 with nip.io
export const EC2_IP = '54.166.45.176';
export const NIPIO_BASE = `https://wheel-of-life.${EC2_IP}.nip.io`;
export const NIPIO_AUTH_URL = `https://authentication.${EC2_IP}.nip.io`;
export const NIPIO_GENAI_URL = `https://genai.${EC2_IP}.nip.io`;
