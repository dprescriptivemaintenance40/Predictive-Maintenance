import { Injectable } from '@angular/core';



@Injectable({
  providedIn: 'root'
})
export class ProfileService {
    public _profilePicSrcPath: string = "";
    public _imageName

    // <----------Relationship--------->
    get ProfilePicSrcPath(): string {
        return this._profilePicSrcPath;
    }
    set ProfilePicSrcPath(path: string) {
        this._profilePicSrcPath = path;
    }


    get ImageName(): string {
        return this._imageName;
    }
    set ImageName(imagename: string) {
        this._imageName = imagename;
    }

    
 


}


