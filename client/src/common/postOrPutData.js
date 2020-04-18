
function postOrPutData(url = ``, data = {}, method = "POST") {
    // Default options are marked with * Function for posting data
    return fetch(url, {
        method: method,
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        referrer: "no-referrer",
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    }).then(response => response.json()).catch(err => console.log('putOrPost Error ' + err)); // returns a promise
}

export default postOrPutData;