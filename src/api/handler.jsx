export function fetchHandler(f, actionObject) {
    f.then((response) => {
        if (response.status >= 200 && response.status < 300) {
           return Promise.resolve(response)
        } else {
            const error = new Error(response.statusText);
            error.response = response;
            throw error
        }
    })
    .then((response) => {
        const contentType = response.headers.get('content-type');
        if(contentType && contentType.includes('application/json')) {
            return response.json();
        }
    })
    .then((content) => {
        if (actionObject.hasOwnProperty('onSuccess')) {
            actionObject.onSuccess(content);
        }
    })
    .catch((error) => {
        return error.response && error.response.json().then((json) => {
            if (actionObject.hasOwnProperty('onError')) {
                actionObject.onError(json)
            }
        });
    })
}
