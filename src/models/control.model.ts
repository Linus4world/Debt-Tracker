import { GroupStorage } from "./groupstorage";

export interface InviteMessage{
    senderName: string,
    isGroup: boolean,
    group: GroupStorage
}

export interface AnswerMessage{
    username: string,
    accept: boolean
}

export interface MemberMessage{
    username: string,
    address: string
}

export interface LeaveMessage{
    address: string
}

export interface TxMessage{
    sender: string,
    receipients: string[],
    amount: number,
    purpose: string
}