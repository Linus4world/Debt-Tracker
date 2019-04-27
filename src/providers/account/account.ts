import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AccountDetails } from '../../models/accountdetails.model';

@Injectable()
export class AccountProvider {
    private name: string;
    private ADRESS: string;
    private PUBLIC_KEY: string;
    private PRIVATE_KEY: string;

    constructor(public http: HttpClient) {
        console.log('Hello AccountProvider Provider');
    }

    public setAccountDetails(name: string, adress: string, public_key: string, private_key: string) {
        return new Promise((res, rej) => {
            if (this.ADRESS !== undefined && this.ADRESS !== '') { rej() }
            this.name = name;
            this.ADRESS = adress;
            this.PUBLIC_KEY = public_key;
            this.PRIVATE_KEY = private_key;
            console.log('Account set!');
            res();
        })
        
    }

    public getName() {
        return this.name;
    }

    public getAdress() {
        return this.ADRESS;
    }

    public getPublicKey() {
        return this.PUBLIC_KEY;
    }

    public getPrivateKey() {
        return this.PRIVATE_KEY;
    }

    public getSelf(): AccountDetails {
        return {
            name: this.name, ADRESS: this.ADRESS,
            PUBLIC_KEY: this.PUBLIC_KEY, PRIVATE_KEY: this.PRIVATE_KEY
        };
    }

}
