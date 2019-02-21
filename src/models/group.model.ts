export interface Group{
    name: string,
    members: string[],
    balances: number[],
    moneypoolBalance?: {current: number, initial: number}
}