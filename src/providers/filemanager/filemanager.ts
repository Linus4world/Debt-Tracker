import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {File} from '@ionic-native/file';

/*
  Generated class for the FilemanagerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FilemanagerProvider {

  constructor(public http: HttpClient, public file: File) {
    console.log('Hello FilemanagerProvider Provider');
  }

  private writeFile(fileEntry, content: string){
    this.file.writeFile(this.file.dataDirectory, 'test.csv', 'hello,world,', {replace: true})
  }

}
