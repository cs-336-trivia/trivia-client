import { Component, OnInit } from '@angular/core';
import { UserStatsService } from 'src/app/services/userStats.service';
import FirestoreRec from 'src/app/services/userStats.service';
import { AngularFirestoreDocument } from '@angular/fire/firestore';

@Component({
  selector: 'app-stats-screen',
  templateUrl: './stats-screen.component.html',
  styleUrls: ['./stats-screen.component.scss']
})
export class StatsScreenComponent implements OnInit {

  public currentUser: string = localStorage.getItem('currentUser');
  public userStatsCollection: FirestoreRec[];
  public userStatsRef: AngularFirestoreDocument<FirestoreRec>;
  public userStatsDoc: FirestoreRec;

  public currentUserQuizzesCompleted: number;
  public currentUserRightCount: number;
  public currentUserWrongCount: number;
  public currentUserWinPercentage: number;

  constructor(
    private userStatsService: UserStatsService,
  ) {
    // this.userStatsService.getAll().valueChanges().subscribe(result => {
    //   this.userStatsCollection = result;
    //   console.log(this.userStatsCollection);
    // });

    this.userStatsRef = this.userStatsService.getAll().doc(this.currentUser);

    this.userStatsRef.valueChanges().subscribe(result => {
      this.userStatsDoc = result;

      this.currentUserQuizzesCompleted = this.userStatsDoc.quizzesCompleted;
      this.currentUserRightCount = this.userStatsDoc.rightCount;
      this.currentUserWrongCount = this.userStatsDoc.wrongCount;
      this.currentUserWinPercentage = this.userStatsDoc.winPercentage;
    });
  }



  ngOnInit(): void {}

}
