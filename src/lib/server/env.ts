const VITE_ENV = (import.meta as any).env

export const env = {
    environment: process.env.ENVIRONMENT ?? 'local',
    supabase: {
        url: VITE_ENV?.VITE_SUPABASE_URL,
        key: VITE_ENV?.VITE_SUPABASE_KEY,
    },
    local: {
        latency: Number(process.env.IN_MEMORY_LATENCY) ?? 0,
    },
    jwt: {
        secret: VITE_ENV?.VITE_SUPABASE_KEY ?? process.env.TEST_JWT_SECRET,
    },
}
