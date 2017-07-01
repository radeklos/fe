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
    .then(function (response) {
        return response.json()
    })
    .then(function (json) {
        if (actionObject.hasOwnProperty('onSuccess')) {
            actionObject.onSuccess(json);
        }
    })
    .catch(function (error) {
        console.error('fetchHandler', error);
        if (actionObject.hasOwnProperty('onError')) {
            actionObject.onError(error);
        }
    })
}
