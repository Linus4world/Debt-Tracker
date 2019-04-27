import { Injectable } from "@angular/core";
import { NetworkType } from "nem2-sdk";

@Injectable()

export class NemSettingsProvider{
    public readonly networkType: number = NetworkType.TEST_NET;
    public readonly networkURL: string = 'http://localhost:3000'; //Have to check on this
    public readonly listenerURL: string = 'ws://localhost:3000';    
    public readonly mosaicID: string = '7cdf3b117a3c40cc'; // Replace with our mosaicId
    public readonly superAccPrivateKey: string = '9df3098825bc542a81553077a7f7e0e8de278523e5bfb54591b5a5346daa354d';
    public readonly initialSupply: number = 500;
}