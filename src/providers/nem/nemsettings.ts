import { Injectable } from "@angular/core";
import { NetworkType } from "nem2-sdk";

@Injectable()

export class NemSettingsProvider{
    public readonly networkType: number = NetworkType.TEST_NET;
    public readonly networkURL: string = 'http://localhost:3000'; //Have to check on this
    public readonly listenerURL: string = 'ws://localhost:3000';    
}