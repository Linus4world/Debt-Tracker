import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { File } from '@ionic-native/file/ngx';
import { Group } from '../../models/group.model';
import { Timestamp } from '../../models/timestamp.model';

/*
  Generated class for the FilemanagerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FilemanagerProvider {
  private GROUP_FILE_NAME = 'groups.json';
  private FRIENDS_FILE_NAME = 'friends.json';
  private TIMESTAMPS_FILE_NAME = 'timestamps.json';
  

  constructor(public http: HttpClient, public file: File) {
    console.log('Hello FilemanagerProvider Provider');
  }

  public saveGroups(groups: Group[]){
    this.writeFile(this.GROUP_FILE_NAME, JSON.stringify(groups));
  }

  public loadGroups(): Promise<Group[]>{
    return this.readGroupObjectsFromFile(this.GROUP_FILE_NAME);
  }

  public saveFriends(friends: Group[]){
    this.writeFile(this.FRIENDS_FILE_NAME, JSON.stringify(friends));
  }

  public loadFriends(){
    return this.readGroupObjectsFromFile(this.FRIENDS_FILE_NAME);
  }
  public saveTimestamps(timestamps: Timestamp[]){
    this.writeFile(this.TIMESTAMPS_FILE_NAME, JSON.stringify(timestamps));
  }

  public loadTimeStamps(){
    return this.readTimeStampObjectsFromFile(this.TIMESTAMPS_FILE_NAME);
  }

  /**
   * Parses a JSON file into an Object and returns a Promise reloving in either
   * in the object or an error log.
   * @param fileName name of the file containing the JSON data
   */
  private readGroupObjectsFromFile(fileName : string): Promise<Group[]>{
    return new Promise((res, rej) => {
      this.readFile(fileName
        ).then((content) => {
          res(JSON.parse(''+content));
        }, (err) => {
          console.log(err);
          rej(null);
        })
    }) 
  }

  /**
   * Parses a JSON file into an Object and returns a Promise reloving in either
   * in the object or an error log.
   * @param fileName name of the file containing the JSON data
   */
  private readTimeStampObjectsFromFile(fileName : string): Promise<Timestamp[]>{
    return new Promise((res, rej) => {
      this.readFile(fileName
        ).then((content) => {
          res(JSON.parse(''+content));
        }, (err) => {
          console.log(err);
          rej(null);
        })
    }) 
  }

  /**
   * function to read a persistent file from the file system.
   * @param fileName name of the target file
   */
  private readFile(fileName: string): Promise<string | void>{
    return new Promise((res, rej) => {
      if( this.file.readAsText(this.file.dataDirectory, fileName) === undefined){
        rej("Could not read File! Are you running the app on a real device?");
      }else{
        res(this.file.readAsText(this.file.dataDirectory, fileName));
      }
    })
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
    //TODO Test on real device
    console.log(this.file.dataDirectory+fileName);
    this.file.writeFile(this.file.dataDirectory, fileName, content, { replace: true }
    // ).then(function (res){
    //   console.log("Successfully wrote file " + fileName); },
    //   function (err){console.log("Writing file " + fileName + "was not successful! Error:" + err)}
    // ).catch(err => { console.log("Writing file " + fileName + "was not successful! Error:" + err)});
    )
  }

}
