document.addEventListener('DOMContentLoaded', function() {
  // Find all check answer buttons and add event listeners
  const checkButtons = document.querySelectorAll('.check-answer-btn');
  
  checkButtons.forEach(button => {
    button.addEventListener('click', function() {
      const validationContainer = this.closest('.practice-validation');
      
      if (validationContainer.classList.contains('multianswer')) {
        checkMultipleAnswers(validationContainer);
      } else {
        checkSingleAnswer(validationContainer);
      }
    });
  });
  
  // Single answer validation (text, select inputs)
  function checkSingleAnswer(container) {
    const input = container.querySelector('.answer-input');
    const correctAnswer = input.dataset.correct;
    const userAnswer = input.value.trim().toUpperCase();
    const feedbackElement = container.querySelector('.feedback-message');
    
    if (userAnswer === correctAnswer.toUpperCase()) {
      feedbackElement.textContent = "Correct";
    } else {
      feedbackElement.textContent = "Incorrect";
    }
  }
  
  // Multiple answer validation (checkboxes)
  function checkMultipleAnswers(container) {
    const checkboxes = container.querySelectorAll('input[type="checkbox"]');
    const feedbackElement = container.querySelector('.feedback-message');
    let allCorrect = true;
    
    checkboxes.forEach(checkbox => {
      const shouldBeChecked = checkbox.dataset.correct === "true";
      if ((checkbox.checked && !shouldBeChecked) || (!checkbox.checked && shouldBeChecked)) {
        allCorrect = false;
      }
    });
    
    if (allCorrect) {
      feedbackElement.textContent = "Correct";
    } else {
      feedbackElement.textContent = "Incorrect";
    }
  }
  
  // Accordion functionality
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  
  accordionHeaders.forEach(header => {
    header.addEventListener('click', function() {
      const content = this.nextElementSibling;
      const isActive = content.classList.contains('active');
      
      // Close all accordion items
      document.querySelectorAll('.accordion-content').forEach(item => {
        item.classList.remove('active');
      });
      
      // Open clicked item if it wasn't already open
      if (!isActive) {
        content.classList.add('active');
      }
    });
  });
  
  // Apply shift for Caesar cipher example
  const applyShiftBtn = document.getElementById('apply-shift');
  if (applyShiftBtn) {
    applyShiftBtn.addEventListener('click', function() {
      const shiftValue = parseInt(document.getElementById('shift-input').value);
      const ciphertext = "YMNX NX F XJHWJY";
      const result = document.getElementById('shift-result');
      
      result.textContent = applyCaesarShift(ciphertext, shiftValue);
    });
  }
  
  function applyCaesarShift(text, shift) {
    return text.split('').map(char => {
      if (char.match(/[A-Z]/)) {
        const code = char.charCodeAt(0);
        return String.fromCharCode(((code - 65 - shift + 26) % 26) + 65);
      }
      return char;
    }).join('');
  }
});
