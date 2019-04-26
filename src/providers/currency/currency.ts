import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Currency } from '../../models/enums';

@Injectable()
export class CurrencyProvider {
  public currency: Currency = Currency.PHP;

  constructor(public http: HttpClient) {
    console.log('Hello CurrencyProvider Provider');
  }

}
