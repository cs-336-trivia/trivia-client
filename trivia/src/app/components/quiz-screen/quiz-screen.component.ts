import { Component, OnInit } from '@angular/core';
import { UserStatsService } from 'src/app/services/userStats.service';
import FirestoreRec from 'src/app/services/userStats.service';
import { AngularFirestoreDocument } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';

// Question elements
export interface Question {
    category: string;
    type: string;
    difficulty: string;
    question: string;
    correct_answer: string;
    incorrect_answers: string[];
    choiceList: string[];
    gotIt: boolean;
    gotItWrong: boolean;
    chosenWrongChoice: string;
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
<<<<<<< HEAD

// Quiz main page typescript breakdown
=======
>>>>>>> 3c0ccdbc5978c16d8a766bbc0e383027fea1b830
export class QuizScreenComponent implements OnInit {
  // Particular page elements and states
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
  timeLeft: number = 15;
  processing: boolean = false;
  started: boolean = false;

  // User specific elements
  public currentUser: string = localStorage.getItem('currentUser');
  public userStatsCollection: FirestoreRec[];
  public userStatsRef: AngularFirestoreDocument<FirestoreRec>;
  public userStatsDoc: FirestoreRec;

  constructor(
    private userStatsService: UserStatsService,
    public dialog: MatDialog,
    ) {
      // Getter for user data
      this.userStatsRef = this.userStatsService.getAll().doc(this.currentUser);
      this.userStatsRef.valueChanges().subscribe(result => {
        this.userStatsDoc = result;
      });
    }

  ngOnInit(): void {
    this.data;
  }

  // This function found here: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  shuffleArray(array: string[]): string[] {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return(array)
  }

  // Start Quiz variable initialization and setup
  startQuiz(): void {
    if(!this.started) {
      this.started = true; //So they can't spam the start button
      this.data = [];
      this.questionCount = 0;
      this.fetchData();
      this.questionCount = 1;
      this.rightCount = 0;
      this.wrongCount = 0;
      this.winPercentage = 0;
    }
  }

<<<<<<< HEAD
  // Question timeout functionality
  async startTimer() {
    // One second increments
=======
  async startTimer(): Promise<void> {
>>>>>>> 3c0ccdbc5978c16d8a766bbc0e383027fea1b830
    await new Promise(r => setTimeout(r, 1000))
    // While time is on the clock, decrement counter
    while(this.timeLeft > 0) {
      this.timeLeft--;
      await new Promise(r => setTimeout(r, 1000))
    }
    // If question goes unanswered after allotted time,
    // -> User forfeits question and "selected" answer becomes "oof"
    // -> This assumes that the database has no question for which
    //    the correct answer is "oof"
    if(this.data[0].gotIt === undefined) {
      this.chooseAnswer("oof",this.data[0].question); //Sends a fake answer choice that's obviously wrong
    }
  }

<<<<<<< HEAD
  // Handler for question pulling
  async fetchData(): Promise<void> {
    this.timeLeft = 15;
    this.gameOver = false;
    // If no difficulty is selected
=======
  async endQuiz(): Promise<void> {
    this.gameOver = true;
    this.started = false;
    this.dialog.open(QuizCompletedDialog);
    await this.userStatsService.update(this.currentUser, { quizzesCompleted: this.userStatsDoc.quizzesCompleted + 1 });
  }

  async fetchData(): Promise<void> {
    this.timeLeft = 15;
    this.gameOver = false;
    //Defaults to random if nothing chosen
>>>>>>> 3c0ccdbc5978c16d8a766bbc0e383027fea1b830
    if(!this.difficulty) {
      this.difficulty = "Random";
    }
    // If no category is selected
    if(!this.category) {
      this.category = "Random";
    }

    try {
        const result = await fetch(`https://opentdb.com/api.php?amount=1&type=multiple&difficulty=${this.difficultyKeys[this.difficulties.indexOf(this.difficulty)]}&category=${this.categoryKeys[this.categories.indexOf(this.category)]}`); //This url will eventually be dynamic based on options
        // Error message in event of failure
        if (!result.ok) {
            console.log('Looks like there was a problem. Status Code: ' + result.status);
            return;
        }
<<<<<<< HEAD

        const formatted = await result.json();
=======
        const formated = await result.json();
>>>>>>> 3c0ccdbc5978c16d8a766bbc0e383027fea1b830
        let newQuestion = true;

        // Checking if we already have this question
        for(let i = 0; i < this.data.length; i++) {
          if(this.data[i].correct_answer === formatted.results[0].correct_answer) {
            newQuestion = false;
          }
        }

        // If question is new
        if(newQuestion) {
<<<<<<< HEAD
          this.data.unshift(formatted.results[0]); //adds new thing to beginning of the array
=======
          this.data.unshift(formated.results[0]); //adds new question to the beginning of the array
>>>>>>> 3c0ccdbc5978c16d8a766bbc0e383027fea1b830

          //For some reason, doing .json() doesn't handle many special characters, so I had to manually do it here for the question and answers
          //You mentioned decodeURI, it works on the w3schools test code editor things, but for some reason not in the web console

          // this.data[0].question = decodeURI(this.data[0].question);
          // this.data[0].correct_answer = decodeURI(this.data[0].correct_answer);
          // this.data[0].incorrect_answers = this.data[0].incorrect_answers.map((answer) => decodeURI(answer));

          // Handlers for special symbols/characters in question
          this.data[0].question = this.data[0].question.replace(/&quot;/g,'"');
          this.data[0].question = this.data[0].question.replace(/&#039;/g,"'");
          this.data[0].question = this.data[0].question.replace(/&rsquo;/g,"'");
          this.data[0].question = this.data[0].question.replace(/&amp;/g,"&");
          this.data[0].question = this.data[0].question.replace(/&eacute;/g,"é");
          this.data[0].question = this.data[0].question.replace(/&ouml;/g,"ö");

          // Handlers for special symbols/characters in correct answer
          this.data[0].correct_answer = this.data[0].correct_answer.replace(/&quot;/g,'"');
          this.data[0].correct_answer = this.data[0].correct_answer.replace(/&#039;/g,"'");
          this.data[0].correct_answer = this.data[0].correct_answer.replace(/&rsquo;/g,"'");
          this.data[0].correct_answer = this.data[0].correct_answer.replace(/&amp;/g,"&");
          this.data[0].correct_answer = this.data[0].correct_answer.replace(/&eacute;/g,"é");
          this.data[0].correct_answer = this.data[0].correct_answer.replace(/&ouml;/g,"ö");

          // Handlers for special symbols/characters in incorrect answers
          this.data[0].incorrect_answers = this.data[0].incorrect_answers.map((answer) => answer.replace(/&quot;/g,'"'));
          this.data[0].incorrect_answers = this.data[0].incorrect_answers.map((answer) => answer.replace(/&#039;/g,"'"));
          this.data[0].incorrect_answers = this.data[0].incorrect_answers.map((answer) => answer.replace(/&rsquo;/g,"'"));
          this.data[0].incorrect_answers = this.data[0].incorrect_answers.map((answer) => answer.replace(/&amp;/g,"&"));
          this.data[0].incorrect_answers = this.data[0].incorrect_answers.map((answer) => answer.replace(/&eacute;/g,"é"));
          this.data[0].incorrect_answers = this.data[0].incorrect_answers.map((answer) => answer.replace(/&ouml;/g,"ö"));

          // Puts the correct and incorrect answers into 1 array and randomizes them for display purposes
          this.data[0].choiceList = this.shuffleArray([this.data[0].correct_answer, this.data[0].incorrect_answers[0], this.data[0].incorrect_answers[1], this.data[0].incorrect_answers[2]]);
          this.data[0].gotIt = undefined;
          this.data[0].gotItWrong = undefined;
          this.startTimer();
        } else {
          // If question is previously seen on current quiz, pull a new one
          this.fetchData();
        }
    } catch (err) {
        // In event of fetch failure
        console.log('Fetch Error :-S', err);
    }
    return;
  }

  // Handler for chosen answer
  async chooseAnswer(choice, question) {
<<<<<<< HEAD
    if(this.data[0].question === question && !this.gameOver && !this.processing) {
      this.processing = true;
      console.log(choice);
      // If user selects correct option
=======
    if(this.data[0].question === question && !this.gameOver && !this.processing) { //Part of this logic is to "disable" the click events for previous questions
      this.processing = true; //So they can't spam an answer choice
>>>>>>> 3c0ccdbc5978c16d8a766bbc0e383027fea1b830
      if(choice === this.data[0].correct_answer) {
        this.data[0].gotIt = true;
        this.data[0].gotItWrong = false;
        this.timeLeft = 0; //Implicitly breaks out of the timer loop
        await new Promise(r => setTimeout(r, 1250))
        this.rightCount++;
        await this.userStatsService.update(this.currentUser, { rightCount: this.userStatsDoc.rightCount + 1 });

        // If quiz isn't over
        if(this.questionCount < 10) {
          this.questionCount++;
          this.fetchData();
        } else {
          this.endQuiz();
        }
      } else {
        // If incorrect option is selected
        this.data[0].gotIt = false;
        this.data[0].gotItWrong = true;
        this.data[0].chosenWrongChoice = choice;
        this.timeLeft = 0;
        await new Promise(r => setTimeout(r, 1250))
        this.wrongCount++;
        await this.userStatsService.update(this.currentUser, { wrongCount: this.userStatsDoc.wrongCount + 1 });

        // If quiz isn't over
        if(this.questionCount < 10) {
          this.questionCount++;
          this.fetchData();
        } else {
          this.endQuiz();
        }
      }
      this.winPercentage = this.rightCount / (this.wrongCount + this.rightCount)
      await this.userStatsService.update(this.currentUser, { winPercentage: this.userStatsDoc.rightCount / (this.userStatsDoc.rightCount + this.userStatsDoc.wrongCount) });
      this.processing = false;
    }
  }
}

@Component({
  selector: 'quiz-completed-dialog',
  templateUrl: '../../alerts/quiz-completed-dialog.html',
})
export class QuizCompletedDialog {}
