import apiUrl from "./apiurl";

function isLoggedIn(): boolean {
  const token = window.localStorage.getItem(`${apiUrl()}token`);
  //TODO: CHeck token to make sure its valid
  let loggedIn : boolean = false;
  if(token && token.length > 0) loggedIn = true;
  return loggedIn;
}

export default isLoggedIn;
