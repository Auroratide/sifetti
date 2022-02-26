export const isFormData = (request: Request): boolean => {
    return request.headers.get('content-type') === 'application/x-www-form-urlencoded'
}

export const isJson = (request: Request): boolean => {
    return request.headers.get('content-type') === 'application/json'
}
