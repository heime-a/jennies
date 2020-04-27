let logged = false;

function apiUrl() { 
    let API_URL = window.origin;
    !logged && console.log(`Api requests will be sent to ${API_URL}`);
    logged = true;
    return API_URL;
}

export default apiUrl
