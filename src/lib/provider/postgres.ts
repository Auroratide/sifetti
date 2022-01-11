export namespace Postgres {
    /**
     * Error codes used by Postgres, and therefore Supabase.
     * https://www.postgresql.org/docs/14/errcodes-appendix.html
     */
    export enum ErrorCode {
        ForeignKeyViolation = '23503',
        UniqueViolation = '23505',
    }
}
