const MIN_GAMES = 1;
const MAX_GAMES = 10;
const LOTTO_MAX = 45;
const PICK_COUNT = 6;

const gameCountEl = document.getElementById('gameCount');
const decreaseBtn = document.getElementById('decreaseBtn');
const increaseBtn = document.getElementById('increaseBtn');
const generateBtn = document.getElementById('generateBtn');
const resultsEl = document.getElementById('results');
const actionsEl = document.getElementById('actions');
const copyBtn = document.getElementById('copyBtn');
const resetBtn = document.getElementById('resetBtn');
const toastEl = document.getElementById('toast');
const themeToggleBtn = document.getElementById('themeToggle');

// Theme init: prefer localStorage, fall back to system preference
const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const initialTheme = savedTheme ?? (prefersDark ? 'dark' : 'light');
document.documentElement.dataset.theme = initialTheme;

function toggleTheme() {
  const current = document.documentElement.dataset.theme;
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  localStorage.setItem('theme', next);
}

themeToggleBtn.addEventListener('click', toggleTheme);

let gameCount = 5;
let lastResults = [];

function updateCountUI() {
  gameCountEl.textContent = gameCount;
  decreaseBtn.disabled = gameCount <= MIN_GAMES;
  increaseBtn.disabled = gameCount >= MAX_GAMES;
}

function pickNumbers() {
  const pool = Array.from({ length: LOTTO_MAX }, (_, i) => i + 1);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, PICK_COUNT).sort((a, b) => a - b);
}

function ballClass(n) {
  if (n <= 10) return 'yellow-ball';
  if (n <= 20) return 'blue-ball';
  if (n <= 30) return 'red-ball';
  if (n <= 40) return 'gray-ball';
  return 'green-ball';
}

function renderResults(games) {
  resultsEl.innerHTML = '';
  games.forEach((numbers, i) => {
    const row = document.createElement('div');
    row.className = 'game-row';
    row.style.animationDelay = `${i * 60}ms`;

    const label = document.createElement('span');
    label.className = 'game-label';
    label.textContent = ['A','B','C','D','E','F','G','H','I','J'][i];

    const wrapper = document.createElement('div');
    wrapper.className = 'balls-wrapper';

    numbers.forEach((n, j) => {
      const ball = document.createElement('span');
      ball.className = `ball ${ballClass(n)}`;
      ball.style.animationDelay = `${i * 60 + j * 50}ms`;
      ball.textContent = n;
      wrapper.appendChild(ball);
    });

    row.appendChild(label);
    row.appendChild(wrapper);
    resultsEl.appendChild(row);
  });
}

function generate() {
  lastResults = Array.from({ length: gameCount }, () => pickNumbers());
  renderResults(lastResults);
  actionsEl.hidden = false;
}

function reset() {
  resultsEl.innerHTML = '';
  actionsEl.hidden = true;
  lastResults = [];
}

function showToast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  setTimeout(() => toastEl.classList.remove('show'), 2000);
}

function copyResults() {
  if (!lastResults.length) return;
  const labels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const text = lastResults
    .map((nums, i) => `[${labels[i]}] ${nums.join(', ')}`)
    .join('\n');
  navigator.clipboard.writeText(text).then(() => showToast('Copied to clipboard!'));
}

decreaseBtn.addEventListener('click', () => {
  if (gameCount > MIN_GAMES) { gameCount--; updateCountUI(); }
});

increaseBtn.addEventListener('click', () => {
  if (gameCount < MAX_GAMES) { gameCount++; updateCountUI(); }
});

generateBtn.addEventListener('click', generate);
copyBtn.addEventListener('click', copyResults);
resetBtn.addEventListener('click', reset);

updateCountUI();
