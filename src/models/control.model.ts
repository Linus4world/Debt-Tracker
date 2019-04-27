export interface InviteMessage{
    senderName: string,
    groupName: string,
    isGroup: boolean 
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

export interface InfoMessage{
    sender: string,
    receipients: string[],
    amount: number,
    purpose: string
}