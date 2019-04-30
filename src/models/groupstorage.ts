
export interface GroupStorage{
    id: string,
    name: string,
    members: [string, string][],
    balances: [string, number][],
    deadline: string
}