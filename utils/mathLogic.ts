export interface QuestionData {
    question: string;
    correctAnswer: number;
    options: number[];
  }
  
  export function generateQuestion(level: number): QuestionData {
    const maxNumber = 10 + ((level - 1) * 5); 
    
    const num1 = Math.floor(Math.random() * maxNumber) + 1;
    const num2 = Math.floor(Math.random() * maxNumber) + 1;
    
    const isAddition = Math.random() > 0.5;
    
    let questionStr = '';
    let correctAnswer = 0;
  
    if (isAddition) {
      questionStr = `${num1} + ${num2}`;
      correctAnswer = num1 + num2;
    } else {
      const big = Math.max(num1, num2);
      const small = Math.min(num1, num2);
      questionStr = `${big} - ${small}`;
      correctAnswer = big - small;
    }
  
    let options: number[] = [correctAnswer];
    while(options.length < 4) {
      const wrongAnswer = correctAnswer + (Math.floor(Math.random() * 10) - 5);
      if(wrongAnswer !== correctAnswer && !options.includes(wrongAnswer) && wrongAnswer >= 0) {
        options.push(wrongAnswer);
      }
    }
  
    options = options.sort(() => Math.random() - 0.5);
  
    return { question: questionStr, correctAnswer, options };
  }