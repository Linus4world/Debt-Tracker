import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FileOriginal } from '@ionic-native/file';

/*
  Generated class for the FilemanagerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FilemanagerProvider {
  

  constructor(public http: HttpClient, public file: FileOriginal) {
    console.log('Hello FilemanagerProvider Provider');
  }

  /**
   * function to read a persistent file from the file system.
   * @param fileName name of the target file
   */
  private readFile(fileName: string): Promise<string | void>{
    return this.file.readAsText(this.file.dataDirectory, fileName
        ).then(content => {return content;}
          ).catch(err => console.log('Could not read '+ fileName + '! Err: ' + err));
  }


  /**
   * function to write files on ios and android. Note that the old file gets replaced!
   * About file.dataDirectory:
   * Persistent and private data storage within the application's sandbox using internal memory 
   * (on Android, if you need to use external memory, use .externalDataDirectory).
   * On iOS, this directory is not synced with iCloud (use .syncedDataDirectory). (iOS, Android, BlackBerry 10, windows)
   * Read more: https://github.com/apache/cordova-plugin-file
   * @param fileName name of the file
   * @param content content of the file
   */
  private writeFile(fileName: string, content: string) {
    this.file.writeFile(this.file.dataDirectory, fileName, content, { replace: true }
    ).then(_ => { console.log("Successfully wrote file " + fileName); }
    ).catch(err => { console.log("Writing file " + fileName + "was not successful! Error:" + err); });
  }

}
