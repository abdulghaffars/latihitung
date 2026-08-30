export interface QuestionData {
  question: string;
  correctAnswer: number;
  options: number[];
}

export function generateQuestion(
  level: number, 
  allowedOperators: string[] = ['+', '-', 'x', '÷'],
  negativeAnswer: boolean = true,
  negativeNumber: boolean = true 
): QuestionData {
  
  const hasAddSub = allowedOperators.includes('+') || allowedOperators.includes('-');
  const hasMulDiv = allowedOperators.includes('x') || allowedOperators.includes('÷');
  
  let isAddSubCategory = true;
  if (hasAddSub && hasMulDiv) {
    isAddSubCategory = Math.random() <= 0.5;
  } else if (hasAddSub) {
    isAddSubCategory = true;
  } else if (hasMulDiv) {
    isAddSubCategory = false;
  }

  let questionStr = '';
  let correctAnswer = 0;
  let num1 = 0;
  let num2 = 0;
  
  const traps: number[] = []; 

  const formatSecondNumber = (num: number) => num < 0 ? `(${num})` : `${num}`;

  // ==========================================
  // LOGIC ADDITION & SUBTRACTION
  // ==========================================
  if (isAddSubCategory) {
    const maxNumber = 10 + ((level - 1) * 5); 
    
    num1 = Math.floor(Math.random() * maxNumber) + 1;
    num2 = Math.floor(Math.random() * maxNumber) + 1;

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

    if (isAddition) {
      questionStr = `${num1} + ${formatSecondNumber(num2)}`;
      correctAnswer = num1 + num2;
      
      traps.push(num1 - num2); // false operation
      if (num1 < 0 || num2 < 0) traps.push(Math.abs(num1) + Math.abs(num2)); // Abaikan tanda
    } else {
      if (negativeAnswer || negativeNumber) {
        questionStr = `${num1} - ${formatSecondNumber(num2)}`;
        correctAnswer = num1 - num2;
        
        traps.push(num1 + num2); // false operation
        if (num1 < 0 || num2 < 0) {
          traps.push(Math.abs(num1) + Math.abs(num2));
          traps.push(Math.abs(num1) - Math.abs(num2));
        }
      } else {
        const big = Math.max(num1, num2);
        const small = Math.min(num1, num2);
        questionStr = `${big} - ${formatSecondNumber(small)}`;
        correctAnswer = big - small;
        
        traps.push(big + small); // false operation
      }
    }

    // General Trap Add/Sub
    traps.push(correctAnswer + 10); // false save tens (+10)
    traps.push(correctAnswer - 10); // false borrow tens (-10)
    traps.push(correctAnswer + 1);  // false finger calculation (+1)
    traps.push(correctAnswer - 1);  // false finger calculation (-1)
  } 
  
  // ==========================================
  // LOGIC MULTIPLICATION & DIVISION
  // ==========================================
  else {
    let maxMulDiv = 10;
    
    if (level <= 30) maxMulDiv = 10 + Math.floor(level / 2);
    else if (level <= 80) maxMulDiv = 25 + Math.floor((level - 30) / 1.5);
    else if (level <= 120) maxMulDiv = 60 + Math.floor((level - 80) / 2);
    else maxMulDiv = 100;

    num1 = Math.floor(Math.random() * maxMulDiv) + 1;
    num2 = Math.floor(Math.random() * maxMulDiv) + 1;

    if (negativeNumber) {
      if (Math.random() > 0.5) num1 = -num1;
      if (Math.random() > 0.5) num2 = -num2;
    }

    let isMultiply = true;
    if (allowedOperators.includes('x') && allowedOperators.includes('÷')) {
      isMultiply = Math.random() > 0.5;
    } else if (allowedOperators.includes('x')) {
      isMultiply = true;
    } else if (allowedOperators.includes('÷')) {
      isMultiply = false;
    }

    if (isMultiply) {
      questionStr = `${num1} x ${formatSecondNumber(num2)}`;
      correctAnswer = num1 * num2;
      
      const slip1 = num1 * (num2 + 1);
      const slip2 = num1 * (num2 - 1);

      traps.push(num1 + num2); // false operation
      traps.push(slip1, slip2); // false memory
      if (slip1 !== 0) traps.push(-slip1);
      if (slip2 !== 0) traps.push(-slip2);
      
      traps.push(correctAnswer + 10, correctAnswer - 10); // false tens
      if (correctAnswer + 10 !== 0) traps.push(-(correctAnswer + 10));
      if (correctAnswer - 10 !== 0) traps.push(-(correctAnswer - 10));

    } else {
      const dividend = num1 * num2;
      questionStr = `${dividend} ÷ ${formatSecondNumber(num1)}`;
      correctAnswer = num2;
      
      traps.push(num2 + 1, num2 - 1); // false memory
      if (num1 !== correctAnswer) {
        traps.push(num1);
        traps.push(-num1);
      }
      traps.push(dividend - Math.abs(num1)); // false operation
      traps.push(dividend + Math.abs(num1));
      traps.push(correctAnswer + 10, correctAnswer - 10); // false tens
    }
  }

  // ==========================================
  // FORMING ANSWER OPTIONS (Traps formed)
  // ==========================================

  // 1. false sign absolute (all operations)
  if (correctAnswer !== 0 && (negativeAnswer || negativeNumber)) {
    traps.push(-correctAnswer); 
  }

  let options: number[] = [correctAnswer];

  // 2. shuffle traps to ensure variety
  const shuffledTraps = traps.sort(() => Math.random() - 0.5);

  // 3. insert 3 top traps that are unique and valid
  for (const trap of shuffledTraps) {
    if (options.length >= 4) break;
    
    const isUnique = trap !== correctAnswer && !options.includes(trap);
    const isValidValue = (negativeAnswer || negativeNumber) ? true : trap >= 0;
    
    if (isUnique && isValidValue) {
      options.push(trap);
    }
  }

  // 4. fallback if trap is valid less than 3
  const variance = Math.max(10, Math.floor(Math.abs(correctAnswer) * 0.25)); 
  while(options.length < 4) {
    const offset = Math.floor(Math.random() * (variance * 2 + 1)) - variance;
    const wrongAnswer = correctAnswer + offset;
    
    const isUnique = wrongAnswer !== correctAnswer && !options.includes(wrongAnswer);
    const isValidValue = (negativeAnswer || negativeNumber) ? true : wrongAnswer >= 0;

    if(isUnique && isValidValue) {
      options.push(wrongAnswer);
    }
  }

  // 5. shuffle options A, B, C, D
  options = options.sort(() => Math.random() - 0.5);

  return { question: questionStr, correctAnswer, options };
}