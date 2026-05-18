export interface QuestionData {
  question: string;
  correctAnswer: number;
  options: number[];
}

export function generateQuestion(
  level: number, 
  allowedOperators: string[] = ['+', '-'],
  negativeAnswer: boolean = true,
  negativeNumber: boolean = true 
): QuestionData {
  const maxNumber = 10 + ((level - 1) * 5); 
  
  let num1 = Math.floor(Math.random() * maxNumber) + 1;
  let num2 = Math.floor(Math.random() * maxNumber) + 1;

  if (negativeNumber) {
    if (Math.random() > 0.5) num1 = -num1;
    if (Math.random() > 0.5) num2 = -num2;
  }
  
  let isAddition = true;
  if (allowedOperators.includes('+') && allowedOperators.includes('-')) {
    isAddition = Math.random() > 0.5;
  } else if (allowedOperators.includes('+')) {
    isAddition = true;
  } else if (allowedOperators.includes('-')) {
    isAddition = false;
  }
  
  let questionStr = '';
  let correctAnswer = 0;

  const formatSecondNumber = (num: number) => num < 0 ? `(${num})` : `${num}`;

  if (isAddition) {
    questionStr = `${num1} + ${formatSecondNumber(num2)}`;
    correctAnswer = num1 + num2;
  } else {
    if (negativeAnswer || negativeNumber) {
      questionStr = `${num1} - ${formatSecondNumber(num2)}`;
      correctAnswer = num1 - num2;
    } else {
      const big = Math.max(num1, num2);
      const small = Math.min(num1, num2);
      questionStr = `${big} - ${formatSecondNumber(small)}`;
      correctAnswer = big - small;
    }
  }

  let options: number[] = [correctAnswer];
  while(options.length < 4) {
    const wrongAnswer = correctAnswer + (Math.floor(Math.random() * 10) - 5);
    
    const isUnique = wrongAnswer !== correctAnswer && !options.includes(wrongAnswer);
    const isValidValue = (negativeAnswer || negativeNumber) ? true : wrongAnswer >= 0;

    if(isUnique && isValidValue) {
      options.push(wrongAnswer);
    }
  }

  options = options.sort(() => Math.random() - 0.5);

  return { question: questionStr, correctAnswer, options };
}