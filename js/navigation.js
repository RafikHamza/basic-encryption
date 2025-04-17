// Navigation functionality
document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('main > section');
  
  // Algo selection logic for practice section
  const algoSelect = document.getElementById('algo-select');
  const algoDescription = document.getElementById('algorithm-description');
  
  // Algorithm descriptions
  const algoDescriptions = {
    caesar: "Shift each letter in the alphabet by the key amount. For example, with key 3: A→D, B→E, etc.",
    xor: "Apply XOR binary operation between each character and the corresponding character in the key.",
    vigenere: "Use a different shift for each letter of the message, with the shifts defined by the key word."
  };
  
  // Update algorithm description when selection changes
  algoSelect.addEventListener('change', () => {
    const selected = algoSelect.value;
    algoDescription.textContent = algoDescriptions[selected];
  });
  
  // Initialize with default algorithm description
  algoDescription.textContent = algoDescriptions[algoSelect.value];
  
  // Navigation click handling
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Get target section
      const targetSectionId = link.getAttribute('data-section');
      const targetSection = document.getElementById(`${targetSectionId}-section`);
      
      // Update active states
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      
      sections.forEach(section => {
        section.classList.remove('active-section');
      });
      
      // Show target section with animation
      setTimeout(() => {
        targetSection.classList.add('active-section');
      }, 50);
      
      // Special actions for specific sections
      if (targetSectionId === 'leaderboard') {
        loadLeaderboard();
      } else if (targetSectionId === 'quiz') {
        initializeQuiz();
      }
    });
  });
  
  // Decrypt button functionality
  const decryptBtn = document.getElementById('decrypt-btn');
  decryptBtn.addEventListener('click', () => {
    const algo = algoSelect.value;
    const text = document.getElementById('plaintext').value;
    let key = document.getElementById('key-input').value;
    let result = '';
    
    // Apply appropriate decryption
    switch(algo) {
      case 'caesar':
        // For Caesar, decryption is encryption with negative key
        key = parseInt(key) || 0;
        result = caesarEncrypt(text, (26 - (key % 26)) % 26);
        break;
      case 'xor':
        // XOR is its own inverse, so encryption function works for decryption too
        result = xorEncrypt(text, key);
        break;
      case 'vigenere':
        // For Vigenère, generate inverse key
        const inverseKey = key.split('').map(char => {
          const code = char.toLowerCase().charCodeAt(0) - 97;
          return String.fromCharCode(((26 - code) % 26) + 97);
        }).join('');
        result = vigenereEncrypt(text, inverseKey);
        break;
    }
    
    document.getElementById('ciphertext').value = result;
  });
});
