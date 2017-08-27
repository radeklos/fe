export function fetchHandler(f, actionObject) {
    f.then(function (response) {
        if (response.status >= 200 && response.status < 300) {
            return Promise.resolve(response)
        } else {
            const error = new Error(response.statusText);
            error.response = response;
            throw error
        }
    })
    .then((resp) => resp.json())
    .then((json) => {
        if (actionObject.hasOwnProperty('onSuccess')) {
            actionObject.onSuccess(json);
        }
    })
    .catch((error) => {
        console.log(error)
        return error.response.json().then((json) => {
            if (actionObject.hasOwnProperty('onError')) {
                actionObject.onError(json)
            }
        });
    })
}
