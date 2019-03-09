import apiUrl from './apiurl';

function isLoggedIn() {
    const token = window.localStorage.getItem(`${apiUrl()}token`);
    //TODO: CHeck token to make sure its valid
    return token && token.length > 0;
}

export default isLoggedIn;