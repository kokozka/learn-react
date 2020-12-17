export const DEBUG = {
    MOCK_API_URL: 'http://localhost:3004/',
    REQUEST_TIMEOUT: 0
};
Object.freeze(DEBUG);

export const API_URL = DEBUG.MOCK_API_URL || '/';