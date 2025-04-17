// Leaderboard functionality
function loadLeaderboard() {
  if (!window.db) return;
  
  const tx = window.db.transaction('users', 'readonly');
  const store = tx.objectStore('users');
  const scoreIndex = store.index('score');
  
  // Get all users ordered by score
  const request = scoreIndex.openCursor(null, 'prev'); // descending order
  
  const leaderboardBody = document.getElementById('leaderboard-body');
  leaderboardBody.innerHTML = '';
  
  let rank = 1;
  
  request.onsuccess = (event) => {
    const cursor = event.target.result;
    if (!cursor) return; // End of records
    
    const { name, score, dateJoined, quizzesTaken } = cursor.value;
    
    // Create table row
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${rank}</td>
      <td>${name}</td>
      <td>${score}</td>
      <td>${quizzesTaken || 0} quiz${quizzesTaken !== 1 ? 'zes' : ''}</td>
    `;
    
    // Highlight current user
    if (window.appStorage && window.appStorage.currentUser && name === window.appStorage.currentUser.name) {
      tr.classList.add('current-user-row');
      tr.style.backgroundColor = 'rgba(124, 77, 255, 0.2)';
      tr.style.fontWeight = 'bold';
    }
    
    leaderboardBody.appendChild(tr);
    
    rank++;
    cursor.continue();
  };
}

// Update leaderboard when section becomes active
document.addEventListener('DOMContentLoaded', () => {
  const leaderboardLink = document.querySelector('.nav-link[data-section="leaderboard"]');
  
  if (leaderboardLink) {
    leaderboardLink.addEventListener('click', loadLeaderboard);
  }
});
