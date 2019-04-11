import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class AccountProvider {
    private name: string;
    private ADRESS: string;
    private PUBLIC_KEY: string;
    private PRIVATE_KEY: string;

    constructor(public http: HttpClient) {
        console.log('Hello AccountProvider Provider');
        this.loadAccountDetails();
    }

    public loadAccountDetails() {
        //TODO
        this.setAccountDetails('Linus', 'TAWLSI7TPPXTTPVMCCZRCD2YAFXAY6IB2UH7BQ5Q',
            '2189cec45b3d9659178ad697891c2b19a4f88a7d4355759af4e553fe57b6ce92',
            '945ef5e3111f78334bac11cfb9ea0adde38d40844edc2315bf1cb82a96744075');
    }

    public setAccountDetails(name: string, adress: string, public_key: string, private_key: string) {
        if (this.ADRESS !== undefined && this.ADRESS !== '') { return; }
        this.name = name;
        this.ADRESS = adress;
        this.PUBLIC_KEY = public_key;
        this.PRIVATE_KEY = private_key;
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

    public getSelf() {
        return {
            name: this.name, ADRESS: this.ADRESS,
            PUBLIC_KEY: this.PUBLIC_KEY, PRIVATE_KEY: this.PRIVATE_KEY
        };
    }

}
