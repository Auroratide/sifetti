export const error = (status: number, message: string) => new Response(JSON.stringify({
    message,
}), {
    status,
})
