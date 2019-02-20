import apiUrl from './apiurl';

function isLoggedIn() {
    const token = window.localStorage.getItem(`${apiUrl()}token`);
    const reqStr = `${apiUrl()}auth/verify?token=${token}`;
    console.log(reqStr);
    return token && token.length > 0;
}

export default isLoggedIn;