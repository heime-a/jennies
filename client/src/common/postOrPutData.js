
async function postOrPutData(url = ``, data = {}, method = "POST") {
    // Default options are marked with * Function for posting data
    try {
        const response = await fetch(url, {
            method: method,
            cache: "no-cache",
            credentials: "same-origin",
            headers: { "Content-Type": "application/json; charset=utf-8" },
            referrer: "no-referrer",
            body: JSON.stringify(data) // body data type must match "Content-Type" header
        });
        return await response.json();
    }
    catch (err) {
        return console.log('putOrPost Error ' + err);
    } // returns a promise
}

export default postOrPutData;