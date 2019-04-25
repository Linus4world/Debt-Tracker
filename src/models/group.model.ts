import { UInt64 } from "nem2-sdk";

export interface Group{
    id: string,
    name: string,
    members: Map<string,string>,
    balances: Map<string, number>,
    blockHeight: UInt64
}