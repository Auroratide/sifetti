export const error = (status: number, message: string) => ({
    status,
    body: { message },
})
