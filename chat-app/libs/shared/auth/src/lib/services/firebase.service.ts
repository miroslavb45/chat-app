import { Injectable } from '@nestjs/common';

import * as firebase from 'firebase-admin';
import { CONFIG } from '@chat-app/shared/config';

@Injectable()
export class FirebaseService {
  private defaultApp: any;

  public constructor() {
    this.defaultApp = firebase.initializeApp({
      credential: firebase.credential.cert(CONFIG.firebase),
    });
  }

  public getDefaultApp() {
    return this.defaultApp;
  }

  public validateToken(token) {
    return this.defaultApp.auth().verifyIdToken(token);
  }

}
