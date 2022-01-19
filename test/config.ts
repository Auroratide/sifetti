export const config = {
    supabase: {
        url: process.env.SUPABASE_URL,
        key: process.env.SUPABASE_KEY,
        superkey: process.env.SUPABASE_SUPERKEY,
    },
    securityAccounts: {
        alpha: {
            email: process.env.SECURITY_ALPHA_EMAIL,
            password: process.env.SECURITY_ALPHA_PASSWORD,
        },
        beta: {
            email: process.env.SECURITY_BETA_EMAIL,
            password: process.env.SECURITY_BETA_PASSWORD,
        },
    },
}
