export interface Group{
    id: string,
    name: string,
    members: Map<string,string>,
    balances: Map<string, number>,
    moneypoolBalance?: {current: number, initial: number}
}