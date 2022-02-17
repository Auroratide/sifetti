export const postForm = (fetch: (info: RequestInfo, init?: RequestInit) => Promise<Response>) =>
    (url: string, data: { [key: string]: string }): Promise<Response> =>
        fetch(url, {
            method: 'POST',
            redirect: 'manual',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: Object.entries(data)
                .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
                .join('&'),
        })
