import { UInt64 } from "nem2-sdk";

export interface GroupStorage{
    id: string,
    name: string,
    members: [string, string][],
    balances: [string, number][],
    blockHeight: UInt64
}