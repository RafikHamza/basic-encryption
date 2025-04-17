// Caesar Cipher Implementation
const caesarEncrypt = (str, shift) => {
  // Handle negative shifts
  shift = ((shift % 26) + 26) % 26;
  
  return str.replace(/[a-z]/gi, c => {
    // Determine if character is uppercase or lowercase
    const base = c <= 'Z' ? 65 : 97;
    
    // Apply shift with modulo to keep within alphabet bounds
    return String.fromCharCode((c.charCodeAt(0) - base + shift) % 26 + base);
  });
};

// UI hookup
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('encrypt-btn').addEventListener('click', () => {
    const algo = document.getElementById('algo-select').value;
    if (algo !== 'caesar') return;
    
    const text = document.getElementById('plaintext').value;
    const key = parseInt(document.getElementById('key-input').value, 10) || 0;
    
    // Encrypt the text
    const out = caesarEncrypt(text, key);
    document.getElementById('ciphertext').value = out;
  });
});
