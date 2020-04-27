
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
        const jsresp = await response.json();
        if (jsresp.message.includes('Error')) {
            console.log `Not Authorized ${jsresp.message}`;
        }
        return jsresp;
    }
    catch (err) {
        return console.log('putOrPost Error ' + err);
    } // returns a promise
}

export default postOrPutData;