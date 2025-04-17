// XOR Cipher Implementation
const xorEncrypt = (str, key) => {
  // Ensure key is not empty
  if (!key || key.length === 0) return str;
  
  return Array.from(str).map((c, i) => {
    // Apply XOR operation between character code and key character code
    const charCode = c.charCodeAt(0);
    const keyCode = key.charCodeAt(i % key.length);
    return String.fromCharCode(charCode ^ keyCode);
  }).join('');
};

// UI hookup
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('encrypt-btn').addEventListener('click', () => {
    const algo = document.getElementById('algo-select').value;
    if (algo !== 'xor') return;
    
    const text = document.getElementById('plaintext').value;
    const key = document.getElementById('key-input').value;
    
    // Validate input
    if (!key) {
      alert('XOR cipher requires a key');
      return;
    }
    
    // Encrypt the text
    const out = xorEncrypt(text, key);
    document.getElementById('ciphertext').value = out;
  });
});
