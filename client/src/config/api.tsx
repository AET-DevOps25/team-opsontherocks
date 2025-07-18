// const hostname = window.location.hostname;
// const isNipIO = hostname.includes('nip.io');

// Dynamic base URL based on current domain
// export const BASE_URL = isNipIO
//     ? `https://${hostname}` // e.g. https://wheel-of-life.54.166.45.176.nip.io
//     : 'https://opsontherocks.student.k8s.aet.cit.tum.de';

export const BASE_URL = 'https://opsontherocks.student.k8s.aet.cit.tum.de';

//  Dynamic URLs (used by default)
export const API_URL = BASE_URL;
export const AUTH_URL = `${BASE_URL}/auth`;
export const WHEEL_URL = `${BASE_URL}/wheel`;
export const GENAI_URL = `${BASE_URL}/genai`;

export const LOGIN_URL = `${AUTH_URL}/login`;
export const REGISTER_URL = `${AUTH_URL}/register`;
export const LOGOUT_URL = `${AUTH_URL}/logout`;
export const ME_URL = `${API_URL}/users/me`;

export const GENAI_CHAT_URL = `${GENAI_URL}/chat`;
export const GENAI_ANALYZE_URL = `${GENAI_URL}/analyze`;

export const AUTH_HEALTH_URL = `${AUTH_URL}/healthCheck`;
export const WHEEL_HEALTH_URL = `${WHEEL_URL}/healthCheck`;
export const GENAI_HEALTH_URL = `${GENAI_URL}/healthCheck`;

//  Kubernetes Ingress URLs (static)
export const K8S_BASE = 'https://opsontherocks.student.k8s.aet.cit.tum.de';
export const K8S_AUTH_URL = `${K8S_BASE}/auth`;
export const K8S_WHEEL_URL = `${K8S_BASE}/wheel`;
export const K8S_GENAI_URL = `${K8S_BASE}/genai`;

//  AWS EC2 `.nip.io` URLs (static)
export const EC2_IP = '54.166.45.176'; // You can replace this with an env var if needed
export const NIPIO_BASE = `https://wheel-of-life.${EC2_IP}.nip.io`;
export const NIPIO_AUTH_URL = `https://authentication.${EC2_IP}.nip.io`;
export const NIPIO_GENAI_URL = `https://genai.${EC2_IP}.nip.io`;
