export const config = {
    supabase: {
        url: process.env.SUPABASE_URL,
        key: process.env.SUPABASE_KEY,
        superkey: process.env.SUPABASE_SUPERKEY,
    },
    testAccountPrefix: process.env.TEST_ACCOUNT_PREFIX,
    testAccounts: {
        alpha: {
            email: process.env.TEST_ALPHA_EMAIL,
            password: process.env.TEST_ALPHA_PASSWORD,
        },
        beta: {
            email: process.env.TEST_BETA_EMAIL,
            password: process.env.TEST_BETA_PASSWORD,
        },
    },
}
