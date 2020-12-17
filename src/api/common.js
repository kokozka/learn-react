import { DEBUG, API_URL } from '../config/app.js';

function doRequest(path) {
    const headers = {
        'Content-Type': 'application/json'
    };
    const options = {
        method: 'GET',
        headers: headers,
        cache: 'no-cache'
    };
    const url = API_URL + path;

    return fetch(url, options)
        .then(res => res.ok ? res.json() : Promise.reject(res))
        .catch(error => console.log(`fetch failed ${url}`, error));
}

let apiRequest;
if (DEBUG.REQUEST_TIMEOUT) {
    apiRequest = function() {
        return new Promise(resolve => {
            setTimeout(() => resolve(doRequest.call(null, ...arguments)), DEBUG.REQUEST_TIMEOUT);
        })
    }
} else {
    apiRequest = doRequest;
} 

export default apiRequest;