import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';

export default interface FirestoreRec {
  id: string;
  winPercentage: number;
  rightCount: number;
  wrongCount: number;
  quizzesCompleted: number;
}

@Injectable({
  providedIn: 'root'
})

export class UserStatsService {

  userStats: AngularFirestoreCollection<FirestoreRec> = null;

  constructor(private db: AngularFirestore) {
    this.userStats = db.collection<FirestoreRec>('/user-stats');
  }

  getAll(): AngularFirestoreCollection<FirestoreRec> {
    return this.userStats;
  }

  get(id: string): AngularFirestoreDocument<FirestoreRec> {
    return this.userStats.doc(id);
  }

  create(id: string): any {
    return this.userStats.doc(id).set({ id: id, winPercentage: 0, rightCount: 0, wrongCount: 0, quizzesCompleted: 0 });
  }

  update(id: string, data: any): Promise<void> {
    return this.userStats.doc(id).update(data);
  }

  delete(id: string): Promise<void> {
    return this.userStats.doc(id).delete();
  }

}