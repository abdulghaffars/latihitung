export type Operator = '+' | '-' | 'x' | '÷';

export interface QuestionData {
  question: string;
  correctAnswer: number;
  options: number[];
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const formatSecondNumber = (num: number): string => num < 0 ? `(${num})` : `${num}`;

/** Fisher-Yates Shuffle (Unbiased) */
const shuffleArray = <T>(array: T[]): T[] => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

/** determine magnitude step (56 -> 10, 125 -> 10, 1000 -> 100) */
const getMagnitudeStep = (num: number): number => {
  if (num === 0) return 1;
  const abs = Math.abs(num);
  if (abs < 100) return 10;
  return Math.pow(10, Math.floor(Math.log10(abs)) - 1);
};
  
// ==========================================
// OPTIONS GENERATOR
// ==========================================

function generateOptions(
  correctAnswer: number, 
  traps: number[], 
  allowNegative: boolean
): number[] {
  // 1. deduplicate and clean up decimal/invalid traps
  const validTraps = [...new Set(traps)]
    .map(t => Math.floor(t))
    .filter(t => t !== correctAnswer && (allowNegative ? true : t >= 0));

  // 2. execute false sign (always prioritized if relevant)
  if (correctAnswer !== 0 && allowNegative && !validTraps.includes(-correctAnswer)) {
    validTraps.unshift(-correctAnswer);
  }

  const options: number[] = [correctAnswer];
  
  // 3. take priority traps (because traps array has been pushed based on cognitive priority)
  for (const trap of validTraps) {
    if (options.length >= 4) break;
    options.push(trap);
  }

  // 4. fallback false digit (force last digit to be the same)
  const magnitude = getMagnitudeStep(correctAnswer);
  let multiplier = 1;
  while(options.length < 4) {
    // add/subtract based on magnitude to keep unit digit similar
    const offset = magnitude * multiplier * (Math.random() > 0.5 ? 1 : -1);
    const wrongAnswer = correctAnswer + offset;
    
    if (!options.includes(wrongAnswer) && (allowNegative ? true : wrongAnswer >= 0)) {
      options.push(wrongAnswer);
    }
    multiplier++;
  }

  // 5. shuffle position A, B, C, D with the correct algorithm
  return shuffleArray(options);
}

// ==========================================
// ADDITION & SUBTRACTION GENERATOR
// ==========================================

function generateAddSubQuestion(level: number, allowedOperators: Operator[], allowNegative: boolean) {
  const maxNumber = 10 + ((level - 1) * 5); 
  
  // 0 is allowed, but frequency is pressed in level > 5 (optional extended logic)
  let num1 = getRandomInt(0, maxNumber);
  let num2 = getRandomInt(0, maxNumber);

  if (allowNegative) {
    if (Math.random() > 0.5) num1 = -num1;
    if (Math.random() > 0.5) num2 = -num2;
  }
  
  let isAddition = true;
  if (allowedOperators.includes('+') && allowedOperators.includes('-')) {
    isAddition = Math.random() > 0.5;
  } else if (allowedOperators.includes('-')) {
    isAddition = false;
  }

  const traps: number[] = [];
  let questionStr = '';
  let correctAnswer = 0;

  if (isAddition) {
    questionStr = `${num1} + ${formatSecondNumber(num2)}`;
    correctAnswer = num1 + num2;
    
    // Tier 1 Traps (false operation)
    traps.push(num1 - num2);
    if (num1 < 0 || num2 < 0) traps.push(Math.abs(num1) + Math.abs(num2));
  } else {
    // subtraction logic
    if (allowNegative) {
      questionStr = `${num1} - ${formatSecondNumber(num2)}`;
      correctAnswer = num1 - num2;
      traps.push(num1 + num2);
    } else {
      const big = Math.max(num1, num2);
      const small = Math.min(num1, num2);
      questionStr = `${big} - ${formatSecondNumber(small)}`;
      correctAnswer = big - small;
      traps.push(big + small);
    }
  }

  // Tier 2 Traps (Magnitude / false save tens)
  const mag = getMagnitudeStep(correctAnswer);
  traps.push(correctAnswer + mag, correctAnswer - mag, correctAnswer + 1, correctAnswer - 1);

  return { questionStr, correctAnswer, traps };
}

// ==========================================
// MULTIPLICATION & DIVISION GENERATOR
// ==========================================

function generateMulDivQuestion(level: number, allowedOperators: Operator[], allowNegative: boolean) {
  let maxMulDiv = 10;
  if (level <= 30) maxMulDiv = 10 + Math.floor(level / 2);
  else if (level <= 80) maxMulDiv = 25 + Math.floor((level - 30) / 1.5);
  else maxMulDiv = 60 + Math.floor((level - 80) / 2);

  // prevent trivial question 0 * n = 0 in middle level and above
  const minDigit = level > 5 ? 1 : 0;
  let num1 = getRandomInt(minDigit, maxMulDiv);
  let num2 = getRandomInt(minDigit, maxMulDiv);

  if (allowNegative) {
    if (Math.random() > 0.5) num1 = -num1;
    if (Math.random() > 0.5) num2 = -num2;
  }

  let isMultiply = true;
  if (allowedOperators.includes('x') && allowedOperators.includes('÷')) {
    isMultiply = Math.random() > 0.5;
  } else if (allowedOperators.includes('÷')) {
    isMultiply = false;
  }

  const traps: number[] = [];
  let questionStr = '';
  let correctAnswer = 0;

  if (isMultiply) {
    questionStr = `${num1} x ${formatSecondNumber(num2)}`;
    correctAnswer = num1 * num2;
    
    // Tier 1 traps
    traps.push(num1 + num2);
    traps.push(num1 * (num2 + 1), num1 * (num2 - 1)); 
    
    // Tier 2 traps (Magnitude)
    const mag = getMagnitudeStep(correctAnswer);
    traps.push(correctAnswer + mag, correctAnswer - mag);
  } else {
    // strict protection division by zero
    if (num1 === 0) {
      num1 = getRandomInt(1, maxMulDiv) * (allowNegative && Math.random() > 0.5 ? -1 : 1);
    }

    const dividend = num1 * num2;
    questionStr = `${dividend} ÷ ${formatSecondNumber(num1)}`;
    correctAnswer = num2;
    
    // Tier 1 traps
    traps.push(num2 + 1, num2 - 1);
    if (num1 !== correctAnswer) traps.push(num1);
    
    const mag = getMagnitudeStep(dividend);
    traps.push(Math.floor(dividend / (Math.abs(num1) + 1))); 
    traps.push(correctAnswer + (mag >= 10 ? mag / 10 : mag)); 
  }

  return { questionStr, correctAnswer, traps };
}

// ==========================================
// MAIN EXPORT FUNCTION
// ==========================================

export function generateQuestion(
  level: number, 
  allowedOperators: Operator[] = ['+', '-', 'x', '÷'],
  negativeAnswer: boolean = true,
  negativeNumber: boolean = true 
): QuestionData {
  
  if (!allowedOperators || allowedOperators.length === 0) {
    throw new Error("At least one operator must be selected.");
  }

  const hasAddSub = allowedOperators.includes('+') || allowedOperators.includes('-');
  const hasMulDiv = allowedOperators.includes('x') || allowedOperators.includes('÷');
  
  let isAddSubCategory = true;
  if (hasAddSub && hasMulDiv) {
    isAddSubCategory = Math.random() <= 0.5;
  } else if (hasMulDiv) {
    isAddSubCategory = false;
  }

  const allowNegative = negativeAnswer || negativeNumber;
  
  const questionResult = isAddSubCategory 
    ? generateAddSubQuestion(level, allowedOperators, allowNegative)
    : generateMulDivQuestion(level, allowedOperators, allowNegative);

  const finalOptions = generateOptions(
    questionResult.correctAnswer, 
    questionResult.traps, 
    allowNegative
  );

  return { 
    question: questionResult.questionStr, 
    correctAnswer: questionResult.correctAnswer, 
    options: finalOptions 
  };
}