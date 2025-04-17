// Quiz functionality
let currentQuestionIndex = 0;
let score = 0;
let questions = [];

// Question bank
const quizQuestions = [
  {
    question: "Which cipher shifts each letter a fixed number of positions in the alphabet?",
    answers: [
      { text: "Caesar Cipher", correct: true },
      { text: "XOR Cipher", correct: false },
      { text: "Vigenère Cipher", correct: false },
      { text: "RSA Encryption", correct: false }
    ]
  },
  {
    question: "If you encrypt 'HELLO' with a Caesar Cipher using key 3, what is the result?",
    answers: [
      { text: "KHOOR", correct: true },
      { text: "IFMMP", correct: false },
      { text: "EBIIL", correct: false },
      { text: "JGNNQ", correct: false }
    ]
  },
  {
    question: "What is the main advantage of the Vigenère Cipher over the Caesar Cipher?",
    answers: [
      { text: "It's impossible to break", correct: false },
      { text: "It uses multiple shift values based on a keyword", correct: true },
      { text: "It's faster to compute", correct: false },
      { text: "It can encrypt numbers", correct: false }
    ]
  },
  {
    question: "In an XOR cipher, what happens if you encrypt something twice with the same key?",
    answers: [
      { text: "You get the original text back", correct: true },
      { text: "You get double encrypted text", correct: false },
      { text: "The algorithm fails", correct: false },
      { text: "The result is unpredictable", correct: false }
    ]
  },
  {
    question: "Which of these is NOT a characteristic of the Caesar Cipher?",
    answers: [
      { text: "It's a substitution cipher", correct: false },
      { text: "It was used by Julius Caesar", correct: false },
      { text: "It uses binary operations", correct: true },
      { text: "It can be broken by frequency analysis", correct: false }
    ]
  },
  {
    question: "In the Vigenère Cipher with key 'KEY', what shift would be applied to the 2nd letter of plaintext?",
    answers: [
      { text: "11 (K shift)", correct: false },
      { text: "5 (E shift)", correct: true },
      { text: "25 (Y shift)", correct: false },
      { text: "It depends on the plaintext", correct: false }
    ]
  },
  {
    question: "Which encryption method is vulnerable to frequency analysis?",
    answers: [
      { text: "RSA", correct: false },
      { text: "XOR with one-time pad", correct: false },
      { text: "Caesar Cipher", correct: true },
      { text: "AES", correct: false }
    ]
  },
  {
    question: "What does the XOR cipher operate on?",
    answers: [
      { text: "Letters in the alphabet", correct: false },
      { text: "Binary bits", correct: true },
      { text: "ASCII codes only", correct: false },
      { text: "Decimal numbers", correct: false }
    ]
  },
  {
    question: "If the plaintext is 'ABC' and the XOR key is 'KEY', how many characters of the key are actually used?",
    answers: [
      { text: "All 3 (KEY)", correct: false },
      { text: "Just 3 (KEY)", correct: true },
      { text: "Just 1 (K)", correct: false },
      { text: "None, XOR doesn't use character keys", correct: false }
    ]
  },
  {
    question: "Which of these ciphers uses a keyword to determine multiple shift values?",
    answers: [
      { text: "Caesar Cipher", correct: false },
      { text: "XOR Cipher", correct: false },
      { text: "Vigenère Cipher", correct: true },
      { text: "Morse Code", correct: false }
    ]
  }
];

// Initialize quiz
function initializeQuiz() {
  // Reset variables
  currentQuestionIndex = 0;
  score = 0;
  
  // Shuffle questions
  questions = [...quizQuestions].sort(() => Math.random() - 0.5);
  
  // Reset UI
  document.getElementById('question-container').style.display = 'block';
  document.getElementById('quiz-results').style.display = 'none';
  
  // Start quiz
  showQuestion();
}

// Show current question
function showQuestion() {
  resetState();
  
  const questionElement = document.getElementById('question-text');
  const answerButtonsElement = document.getElementById('answer-buttons');
  
  if (currentQuestionIndex >= questions.length) {
    // End of quiz
    finishQuiz();
    return;
  }
  
  const currentQuestion = questions[currentQuestionIndex];
  questionElement.textContent = `${currentQuestionIndex + 1}. ${currentQuestion.question}`;
  
  // Shuffle answers
  const shuffledAnswers = [...currentQuestion.answers].sort(() => Math.random() - 0.5);
  
  shuffledAnswers.forEach(answer => {
    const button = document.createElement('button');
    button.textContent = answer.text;
    button.classList.add('answer-btn');
    button.dataset.correct = answer.correct;
    button.addEventListener('click', selectAnswer);
    answerButtonsElement.appendChild(button);
  });
}

// Reset UI state
function resetState() {
  document.getElementById('next-btn').style.display = 'none';
  const answerButtonsElement = document.getElementById('answer-buttons');
  while (answerButtonsElement.firstChild) {
    answerButtonsElement.removeChild(answerButtonsElement.firstChild);
  }
}

// Handle answer selection
function selectAnswer(e) {
  const selectedButton = e.target;
  const correct = selectedButton.dataset.correct === 'true';
  
  if (correct) {
    selectedButton.classList.add('correct');
    score++;
  } else {
    selectedButton.classList.add('wrong');
    
    // Highlight correct answer
    document.querySelectorAll('.answer-btn').forEach(button => {
      if (button.dataset.correct === 'true') {
        button.classList.add('correct');
      }
    });
  }
  
  // Disable all buttons
  document.querySelectorAll('.answer-btn').forEach(button => {
    button.disabled = true;
  });
  
  // Show next button
  document.getElementById('next-btn').style.display = 'block';
}

// Finish quiz
function finishQuiz() {
  const scoreDisplay = document.getElementById('score-display');
  scoreDisplay.textContent = score;
  
  document.getElementById('quiz-results').style.display = 'block';
  document.getElementById('question-container').style.display = 'none';
  
  // Save quiz result if user is logged in
  if (window.appStorage && window.appStorage.saveQuizResult) {
    window.appStorage.saveQuizResult(score, questions.length);
  }
  
  // Add a "retry" button
  const nextButton = document.getElementById('next-btn');
  nextButton.textContent = 'Try Again';
  nextButton.style.display = 'block';
  nextButton.removeEventListener('click', nextQuestion);
  nextButton.addEventListener('click', initializeQuiz);
}

// Go to next question
function nextQuestion() {
  currentQuestionIndex++;
  showQuestion();
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  // Initialize quiz when the page loads
  if (document.getElementById('quiz-section')) {
    // Add event listener for the next button
    const nextButton = document.getElementById('next-btn');
    if (nextButton) {
      nextButton.addEventListener('click', nextQuestion);
    }
    
    // Make sure quiz is initialized when switching to the quiz tab
    document.querySelectorAll('.nav-link').forEach(link => {
      if (link.getAttribute('data-section') === 'quiz') {
        link.addEventListener('click', () => {
          // Short delay to ensure the section is visible
          setTimeout(initializeQuiz, 100);
        });
      }
    });
  }
});

// Make sure quiz initializes when directly accessing the quiz section
if (window.location.hash === '#quiz') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initializeQuiz, 100);
  });
}
