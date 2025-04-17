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
      { text:
