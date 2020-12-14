import { Component, OnInit } from '@angular/core';
import { UserStatsService } from 'src/app/services/userStats.service';
import FirestoreRec from 'src/app/services/userStats.service';
import { AngularFirestoreDocument } from '@angular/fire/firestore';

export interface Question {
    category: string;
    type: string;
    difficulty: string;
    question: string;
    correct_answer: string;
    incorrect_answers: string[];
    choiceList: string[];
    gotIt: boolean;
}
export interface Category {
  code: string;
  displayVal: string;
}
export interface Difficulty {
  code: string;
  displayVal: string;
}
@Component({
  selector: 'app-quiz-screen',
  templateUrl: './quiz-screen.component.html',
  styleUrls: ['./quiz-screen.component.scss']
})


export class QuizScreenComponent implements OnInit {
  data:Question[] = [];
  difficulty: string;
  difficulties: string[] = ["Random","Easy","Medium","Hard"];
  difficultyKeys: string[] = ["","easy","medium","hard"];
  category: string;
  categories: string[] = ["Random","Science","Sports","History","Books","Movies","Art","Videogames"];
  categoryKeys: string[] = ["","17","21","23","10","11","25","15"];
  rightCount: number = 0;
  wrongCount: number = 0;
  winPercentage: number = 0.0;
  questionCount: number = 0;
  gameOver: boolean = false;
  timeLeft: number = 10;
  public currentUser: string = localStorage.getItem('currentUser');
  public userStatsRef: AngularFirestoreDocument<FirestoreRec>;
  public userStatsDoc: FirestoreRec;

  constructor(
    private userStatsService: UserStatsService,
    ) {
      this.userStatsRef = this.userStatsService.getAll().doc(this.currentUser);

      this.userStatsRef.valueChanges().subscribe(result => {
        this.userStatsDoc = result;
      });
    }

  ngOnInit(): void {
    this.data;
  }
  //This function found here: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  shuffleArray(array: string[]): string[] {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return(array)
  }

  startQuiz(): void {
    this.data = [];
    this.questionCount = 0;
    this.fetchData();
  }

  async startTimer() {
    while(this.timeLeft > 0) {
      this.timeLeft--;
      await new Promise(r => setTimeout(r, 1000))
    }
    if(this.data[0].gotIt === undefined) {
      this.chooseAnswer("oof");
    }
    // this.chooseAnswer("Out of Time");
    // if(this.timeLeft != -1) {
    //   this.chooseAnswer("Out of Time");
    // }
  }

  async fetchData(): Promise<void> {
    this.timeLeft = 10;
    this.gameOver = false;
    if(!this.difficulty) {
      this.difficulty = "Random";
    }
    if(!this.category) {
      this.category = "Random";
    }
    try {
        const result = await fetch(`https://opentdb.com/api.php?amount=1&type=multiple&difficulty=${this.difficultyKeys[this.difficulties.indexOf(this.difficulty)]}&category=${this.categoryKeys[this.categories.indexOf(this.category)]}`); //This url will eventually be dynamic based on options
        if (!result.ok) {
            console.log('Looks like there was a problem. Status Code: ' + result.status);
            return;
        }
        // console.log(result);
        const formated = await result.json();

        // console.log(formated);
        let newQuestion = true;

        //Checking if we already have this question
        for(let i = 0; i < this.data.length; i++) {
          if(this.data[i].correct_answer === formated.results[0].correct_answer) {
            newQuestion = false;
          }
        }

        if(newQuestion) {
          this.data.unshift(formated.results[0]); //adds new thing to beginning of the array

          //For some reason, doing .json() doesn't handle many special characters, so I had to manually do it here for the question and answers
          this.data[0].question = this.data[0].question.replace(/&quot;/g,'"');
          this.data[0].question = this.data[0].question.replace(/&#039;/g,"'");
          this.data[0].question = this.data[0].question.replace(/&rsquo;/g,"'");
          this.data[0].question = this.data[0].question.replace(/&amp;/g,"&");
          this.data[0].question = this.data[0].question.replace(/&eacute;/g,"é");
          this.data[0].question = this.data[0].question.replace(/&ouml;/g,"ö");

          this.data[0].correct_answer = this.data[0].correct_answer.replace(/&quot;/g,'"');
          this.data[0].correct_answer = this.data[0].correct_answer.replace(/&#039;/g,"'");
          this.data[0].correct_answer = this.data[0].correct_answer.replace(/&rsquo;/g,"'");
          this.data[0].correct_answer = this.data[0].correct_answer.replace(/&amp;/g,"&");
          this.data[0].correct_answer = this.data[0].correct_answer.replace(/&eacute;/g,"é");
          this.data[0].correct_answer = this.data[0].correct_answer.replace(/&ouml;/g,"ö");

          this.data[0].incorrect_answers = this.data[0].incorrect_answers.map((answer) => answer.replace(/&quot;/g,'"'));
          this.data[0].incorrect_answers = this.data[0].incorrect_answers.map((answer) => answer.replace(/&#039;/g,"'"));
          this.data[0].incorrect_answers = this.data[0].incorrect_answers.map((answer) => answer.replace(/&rsquo;/g,"'"));
          this.data[0].incorrect_answers = this.data[0].incorrect_answers.map((answer) => answer.replace(/&amp;/g,"&"));
          this.data[0].incorrect_answers = this.data[0].incorrect_answers.map((answer) => answer.replace(/&eacute;/g,"é"));
          this.data[0].incorrect_answers = this.data[0].incorrect_answers.map((answer) => answer.replace(/&ouml;/g,"ö"));

          //Puts the correct and incorrect answers into 1 array and randomizes them for display purposes
          this.data[0].choiceList = this.shuffleArray([this.data[0].correct_answer, this.data[0].incorrect_answers[0], this.data[0].incorrect_answers[1], this.data[0].incorrect_answers[2]]);
          this.data[0].gotIt = undefined;
          
          this.startTimer();
        // console.log(this.data);
        } 
    } catch (err) {
        console.log('Fetch Error :-S', err);
    }
    return;
  }

  async chooseAnswer(choice) {
    console.log(choice);
    if(choice === this.data[0].correct_answer) {
      console.log(1);
      this.data[0].gotIt = true;
      this.timeLeft = -1;
      await new Promise(r => setTimeout(r, 1250))
      this.rightCount++;
      await this.userStatsService.update(this.currentUser, { rightCount: this.userStatsDoc.rightCount + 1 });
      if(this.questionCount <= 3) {
        this.questionCount++;
        this.fetchData();
      } else {
        this.gameOver = true;
      }
    } else {
      this.data[0].gotIt = false;
      this.timeLeft = -1;
      await new Promise(r => setTimeout(r, 1250))
      this.wrongCount++;
      await this.userStatsService.update(this.currentUser, { wrongCount: this.userStatsDoc.wrongCount + 1 });
      if(this.questionCount <= 3) {
        this.questionCount++;
        this.fetchData();
      } else {
        this.gameOver = true;
      }
    }
    this.winPercentage = this.rightCount / (this.wrongCount + this.rightCount)
    await this.userStatsService.update(this.currentUser, { winPercentage: this.userStatsDoc.rightCount / (this.userStatsDoc.rightCount + this.userStatsDoc.wrongCount) });
  }
}
