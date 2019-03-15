let logged = false;

function apiUrl() { 
    let API_URL;
    process.env.REACT_APP_STAGE === 'dev'
    ? API_URL = 'http://localhost:3001'
    : API_URL = 'https://simplerp.herokuapp.com';

    const hostName = process.env.REACT_APP_HOSTNAME;

    if (process.env.REACT_APP_STAGE === 'dev' && hostName !== undefined) {
        API_URL = `http://${hostName}:3001`;
    }
    
    !logged && console.log(`Api requests will be sent to ${API_URL}`);
    logged = true;
    return API_URL;
}

export default apiUrl
