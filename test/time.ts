export const secs = (n: number) => 1000 * n
export const mins = (n: number) => 60 * secs(n)
export const hours = (n: number) => 60 * mins(n)
export const days = (n: number) => 24 * hours(n)

export const Monday = new Date(Date.parse('2022-02-21T12:00:00.000Z'))
export const Tuesday = new Date(Monday.getTime() + days(1))
export const Wednesday = new Date(Tuesday.getTime() + days(1))
export const Thursday = new Date(Wednesday.getTime() + days(1))
export const Friday = new Date(Thursday.getTime() + days(1))
export const Saturday = new Date(Friday.getTime() + days(1))
export const Sunday = new Date(Saturday.getTime() + days(1))
