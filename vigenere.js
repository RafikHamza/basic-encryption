// Vigenère Cipher Implementation
const vigenereEncrypt = (str, key) => {
  // Ensure key is not empty
  if (!key || key.length === 0) return str;
  
  // Convert key to lowercase for consistency
  key = key.toLowerCase();
  
  let j = 0; // Key index tracker
  
  return str.replace(/[a-z]/gi, c => {
    // Handle uppercase and lowercase letters
    const base = c <= 'Z' ? 65 : 97;
    
    // Get shift value from current key character (0-25)
    const k = key[j % key.length].charCodeAt(0) - 97;
    
    // Only increment key index for valid characters
    j++;
    
    // Apply shift with modulo to keep within alphabet bounds
    return String.fromCharCode((c.charCodeAt(0) - base + k) % 26 + base);
  });
};

// UI hookup
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('encrypt-btn').addEventListener('click', () => {
    const algo = document.getElementById('algo-select').value;
    if (algo !== 'vigenere') return;
    
    const text = document.getElementById('plaintext').value;
    const key = document.getElementById('key-input').value;
    
    // Validate input
    if (!key.match(/^[a-zA-Z]+$/)) {
      alert('Vigenère cipher requires an alphabetic key');
      return;
    }
    
    // Encrypt the text
    const out = vigenereEncrypt(text, key);
    document.getElementById('ciphertext').value = out;
  });
});
