// Initialize IndexedDB
const dbName = 'encryptionDB';
const dbVersion = 2; // Increased version for schema updates
let db;
let currentUser = {
  name: 'Guest',
  score: 0
};

// Open database connection
const openDB = () => {
  const request = indexedDB.open(dbName, dbVersion);
  
  request.onupgradeneeded = (event) => {
    db = event.target.result;
    
    // Create object stores if they don't exist
    if (!db.objectStoreNames.contains('records')) {
      db.createObjectStore('records', { keyPath: 'id', autoIncrement: true });
    }
    
    if (!db.objectStoreNames.contains('users')) {
      const userStore = db.createObjectStore('users', { keyPath: 'name' });
      userStore.createIndex('score', 'score');
    }
    
    if (!db.objectStoreNames.contains('quizResults')) {
      db.createObjectStore('quizResults', { keyPath: 'id', autoIncrement: true });
    }
  };
  
  request.onsuccess = (event) => {
    db = event.target.result;
    loadHistory();
    checkForUser();
  };
  
  request.onerror = (event) => {
    console.error('Database error:', event.target.error);
    alert('Database error. Please try again or check browser settings.');
  };
};

// Save encryption record
const saveRecord = (algo, text, result, key) => {
  if (!db) return;
  
  const tx = db.transaction('records', 'readwrite');
  const store = tx.objectStore('records');
  
  store.add({ 
    algo, 
    text, 
    result, 
    key, 
    user: currentUser.name,
    date: new Date().toLocaleString() 
  });
  
  tx.oncomplete = loadHistory;
};

// Load encryption history
const loadHistory = () => {
  if (!db) return;
  
  const tx = db.transaction('records', 'readonly');
  const store = tx.objectStore('records');
  const list = document.getElementById('history-list');
  
  // Clear list
  list.innerHTML = '';
  
  // Get cursor to iterate through all records
  const request = store.openCursor();
  
  request.onsuccess = (event) => {
    const cursor = event.target.result;
    if (!cursor) return; // End of records
    
    // Only show records for current user
    if (cursor.value.user === currentUser.name) {
      const { algo, text, result, key, date } = cursor.value;
      
      const li = document.createElement('li');
      li.innerHTML = `
        <strong>${algo}</strong> (${date})
        <div class="record-details">
          <span>Original: "${text.substring(0, 20)}${text.length > 20 ? '...' : ''}"</span>
          <span>Encrypted: "${result.substring(0, 20)}${result.length > 20 ? '...' : ''}"</span>
          <span>Key: ${key}</span>
        </div>
      `;
      list.appendChild(li);
    }
    
    cursor.continue();
  };
};

// Check for existing user or show registration modal
const checkForUser = () => {
  // Check local storage first for recent user
  const savedUser = localStorage.getItem('encryptionUser');
  
  if (savedUser) {
    currentUser.name = savedUser;
    updateUserDisplay();
    loadUserScore();
    document.getElementById('user-modal').style.display = 'none';
  } else {
    document.getElementById('user-modal').style.display = 'flex';
  }
};

// Register a new user
const registerUser = (username) => {
  if (!username || username.trim() === '') {
    alert('Please enter a valid name');
    return false;
  }
  
  if (!db) return false;
  
  const tx = db.transaction('users', 'readwrite');
  const store = tx.objectStore('users');
  
  // Check if user already exists
  const request = store.get(username);
  
  request.onsuccess = (event) => {
    if (event.target.result) {
      // User exists, update current user
      currentUser = event.target.result;
    } else {
      // New user
      currentUser = {
        name: username,
        score: 0,
        dateJoined: new Date().toLocaleString(),
        quizzesTaken: 0
      };
      
      store.add(currentUser);
    }
    
    // Save to local storage
    localStorage.setItem('encryptionUser', username);
    
    // Update UI
    updateUserDisplay();
    document.getElementById('user-modal').style.display = 'none';
  };
  
  return true;
};

// Update user score
const updateUserScore = (points) => {
  if (!db || currentUser.name === 'Guest') return;
  
  currentUser.score += points;
  
  const tx = db.transaction('users', 'readwrite');
  const store = tx.objectStore('users');
  
  store.put(currentUser);
  
  // Update UI
  updateUserDisplay();
};

// Load user score from database
const loadUserScore = () => {
  if (!db || currentUser.name === 'Guest') return;
  
  const tx = db.transaction('users', 'readonly');
  const store = tx.objectStore('users');
  
  const request = store.get(currentUser.name);
  
  request.onsuccess = (event) => {
    if (event.target.result) {
      currentUser = event.target.result;
      updateUserDisplay();
    }
  };
};

// Update user display in header
const updateUserDisplay = () => {
  document.getElementById('current-user').textContent = currentUser.name;
  document.getElementById('user-score').textContent = `Score: ${currentUser.score}`;
};

// Save quiz result
const saveQuizResult = (score, totalQuestions) => {
  if (!db || currentUser.name === 'Guest') return;
  
  const tx = db.transaction(['quizResults', 'users'], 'readwrite');
  const quizStore = tx.objectStore('quizResults');
  const userStore = tx.objectStore('users');
  
  // Save quiz result
  quizStore.add({
    user: currentUser.name,
    score,
    totalQuestions,
    date: new Date().toLocaleString()
  });
  
  // Update user stats
  currentUser.quizzesTaken = (currentUser.quizzesTaken || 0) + 1;
  currentUser.score += score;
  
  userStore.put(currentUser);
  
  // Update UI
  updateUserDisplay();
};

// Reset user progress
const resetProgress = () => {
  if (confirm('Are you sure you want to reset all your progress? This cannot be undone.')) {
    localStorage.removeItem('encryptionUser');
    currentUser = {
      name: 'Guest',
      score: 0
    };
    
    updateUserDisplay();
    loadHistory();
    showModal();
  }
};

// Show user registration modal
const showModal = () => {
  document.getElementById('user-modal').style.display = 'flex';
};

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  openDB();
  
  // Start button click
  document.getElementById('start-btn').addEventListener('click', () => {
    const username = document.getElementById('username-input').value;
    registerUser(username);
  });
  
  // Reset progress link
  document.getElementById('reset-progress').addEventListener('click', (e) => {
    e.preventDefault();
    resetProgress();
  });
  
  // Save button click
  document.getElementById('save-btn').addEventListener('click', () => {
    const algo = document.getElementById('algo-select').value;
    const text = document.getElementById('plaintext').value;
    const key = document.getElementById('key-input').value;
    const result = document.getElementById('ciphertext').value;
    
    if (text && result) {
      saveRecord(algo, text, result, key);
    }
  });
});

// Export functions and variables for other scripts
window.appStorage = {
  currentUser,
  updateUserScore,
  saveQuizResult
};
