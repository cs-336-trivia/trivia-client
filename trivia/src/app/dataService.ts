export interface Question {
    category: string;
    type: string;
    difficulty: string;
    question: string;
    correctAnswer: string;
    incorrectAnswers: string[];
}
   
export class DataService {
    data:Question[] = [];
    constructor() { } ;
    getData(numQuestions?: number): Question[] {
        if (numQuestions === undefined || numQuestions >= this.data.length) { return this.data };
        return (this.data.slice(0,numQuestions));
    };
    async fetchData(): Promise<void> {
        try {
            const result = await fetch('https://opentdb.com/api.php?amount=10&type=multiple'); //This url will eventually be dynamic based on options
            if (!result.ok) {
                console.log('Looks like there was a problem. Status Code: ' + result.status);
                return;
            }
            const formated = await result.json();
            this.data = formated.results;
        } catch (err) {
            console.log('Fetch Error :-S', err);
        }
        return;
    };
}

