/* ============================================
   VERITY — Test Engine Logic
   ============================================ */

let currentTest = null;
let currentIndex = 0;
let answers = {};
let flagged = new Set();
let timerInterval = null;
let remainingSeconds = 0;
let timerVisible = true;

document.addEventListener('DOMContentLoaded', () => {
  if (!Verity.requireAuth()) return;

  const params = new URLSearchParams(window.location.search);
  const testId = params.get('testId');

  if (!testId) {
    Verity.toast('No test specified', 'error');
    setTimeout(() => Verity.navigate('dashboard.html'), 1000);
    return;
  }

  // Find test in data
  const allTests = [...VERITY_TESTS, ...Verity.getCustomTests()];
  currentTest = allTests.find(t => t.id === testId);

  if (!currentTest) {
    Verity.toast('Test not found', 'error');
    setTimeout(() => Verity.navigate('dashboard.html'), 1000);
    return;
  }

  // Set title
  document.getElementById('testTitle').textContent = currentTest.name;
  document.title = `${currentTest.name} — Verity`;

  // Restore state if exists
  const savedState = Verity.getTestState(testId);
  if (savedState) {
    answers = savedState.answers || {};
    flagged = new Set(savedState.flagged || []);
    currentIndex = savedState.currentIndex || 0;
  }

  // Initialize timer
  const savedTimer = Verity.getTimer(testId);
  remainingSeconds = savedTimer !== null ? savedTimer : currentTest.duration * 60;

  // Build question grid
  buildQuestionGrid();

  // Show question after simulated load
  setTimeout(() => {
    document.getElementById('questionLoading').classList.add('hidden');
    document.getElementById('questionBlock').classList.remove('hidden');
    document.getElementById('btnFinish').style.display = '';
    renderQuestion();
    startTimer();
  }, 800);

  // Toggle timer visibility
  document.getElementById('toggleTimer').addEventListener('click', () => {
    timerVisible = !timerVisible;
    document.getElementById('timerDisplay').textContent = timerVisible
      ? Verity.formatTime(remainingSeconds) : 'Hidden';
  });

  // Save state on unload
  window.addEventListener('beforeunload', saveCurrentState);
});

function buildQuestionGrid() {
  const grid = document.getElementById('questionGrid');
  grid.innerHTML = '';
  currentTest.questions.forEach((q, i) => {
    const dot = document.createElement('button');
    dot.className = 'q-dot';
    dot.textContent = i + 1;
    dot.title = `Question ${i + 1}`;
    dot.addEventListener('click', () => goToQuestion(i));
    grid.appendChild(dot);
  });
  updateGrid();
}

function updateGrid() {
  const dots = document.querySelectorAll('.q-dot');
  const answeredCount = Object.keys(answers).length;
  document.getElementById('progressText').textContent =
    `${answeredCount} / ${currentTest.questions.length} answered`;

  dots.forEach((dot, i) => {
    dot.className = 'q-dot';
    if (i === currentIndex) dot.classList.add('active');
    else if (answers[i] !== undefined) dot.classList.add('answered');
    if (flagged.has(i)) dot.classList.add('flagged');
  });
}

function renderQuestion() {
  const q = currentTest.questions[currentIndex];
  const total = currentTest.questions.length;

  document.getElementById('questionLabel').textContent = `Question ${currentIndex + 1} of ${total}`;
  document.getElementById('questionText').textContent = q.text;

  // Flag button state
  const btnFlag = document.getElementById('btnFlag');
  btnFlag.textContent = flagged.has(currentIndex) ? '⚑ Unflag' : '⚑ Flag';
  btnFlag.style.color = flagged.has(currentIndex) ? 'var(--warning)' : '';

  // Options
  const container = document.getElementById('optionsContainer');
  container.innerHTML = '';
  const letters = ['A', 'B', 'C', 'D', 'E', 'F'];

  q.options.forEach((opt, i) => {
    const div = document.createElement('div');
    div.className = `option${answers[currentIndex] === i ? ' selected' : ''}`;
    div.innerHTML = `
      <span class="option-letter">${letters[i]}</span>
      <span>${opt}</span>
    `;
    div.addEventListener('click', () => selectOption(i));
    container.appendChild(div);
  });

  // Nav buttons
  document.getElementById('btnPrev').style.visibility = currentIndex === 0 ? 'hidden' : 'visible';
  document.getElementById('btnNext').textContent =
    currentIndex === total - 1 ? 'Review →' : 'Next →';

  updateGrid();

  // Animate question block
  const block = document.getElementById('questionBlock');
  block.style.animation = 'none';
  block.offsetHeight; // reflow
  block.style.animation = 'fadeIn 0.3s ease-out';
}

function selectOption(index) {
  answers[currentIndex] = index;
  renderQuestion();
  saveCurrentState();
}

function toggleFlag() {
  if (flagged.has(currentIndex)) {
    flagged.delete(currentIndex);
  } else {
    flagged.add(currentIndex);
  }
  renderQuestion();
  saveCurrentState();
}

function goToQuestion(index) {
  currentIndex = index;
  renderQuestion();
}

function prevQuestion() {
  if (currentIndex > 0) {
    currentIndex--;
    renderQuestion();
  }
}

function nextQuestion() {
  if (currentIndex < currentTest.questions.length - 1) {
    currentIndex++;
    renderQuestion();
  } else {
    openReview();
  }
}

// --- Timer ---
function startTimer() {
  updateTimerDisplay();
  timerInterval = setInterval(() => {
    remainingSeconds--;
    if (remainingSeconds <= 0) {
      remainingSeconds = 0;
      clearInterval(timerInterval);
      Verity.toast('Time is up! Submitting your test...', 'error');
      setTimeout(submitTest, 1500);
    }
    updateTimerDisplay();
    // Save timer every 10 seconds
    if (remainingSeconds % 10 === 0) {
      Verity.saveTimer(currentTest.id, remainingSeconds);
    }
  }, 1000);
}

function updateTimerDisplay() {
  const display = document.getElementById('timerDisplay');
  if (!timerVisible) {
    display.textContent = 'Hidden';
    return;
  }
  display.textContent = Verity.formatTime(remainingSeconds);
  const btn = document.getElementById('toggleTimer');
  btn.className = 'btn btn-sm';
  btn.style.background = 'rgba(255,255,255,0.1)';
  btn.style.color = '#fff';
  btn.style.border = 'none';

  if (remainingSeconds <= 60) {
    display.classList.add('danger');
    display.classList.remove('warning');
  } else if (remainingSeconds <= 300) {
    display.classList.add('warning');
    display.classList.remove('danger');
  } else {
    display.classList.remove('warning', 'danger');
  }
}

// --- Review ---
function openReview() {
  const total = currentTest.questions.length;
  const answeredCount = Object.keys(answers).length;

  document.getElementById('reviewAnswered').textContent = answeredCount;
  document.getElementById('reviewUnanswered').textContent = total - answeredCount;
  document.getElementById('reviewFlagged').textContent = flagged.size;

  const grid = document.getElementById('reviewGrid');
  grid.innerHTML = '';
  currentTest.questions.forEach((q, i) => {
    const item = document.createElement('div');
    const isAnswered = answers[i] !== undefined;
    item.className = `review-item ${isAnswered ? 'answered' : 'unanswered'}`;
    item.innerHTML = `
      <span style="font-weight:600">Q${i + 1}</span>
      <span>${isAnswered ? 'Answered' : 'Skipped'}${flagged.has(i) ? ' ⚑' : ''}</span>
    `;
    item.style.cursor = 'pointer';
    item.addEventListener('click', () => {
      closeReview();
      goToQuestion(i);
    });
    grid.appendChild(item);
  });

  document.getElementById('reviewOverlay').classList.remove('hidden');
}

function closeReview() {
  document.getElementById('reviewOverlay').classList.add('hidden');
}

document.getElementById('btnFinish').addEventListener('click', openReview);

// --- Submit ---
function submitTest() {
  clearInterval(timerInterval);

  const total = currentTest.questions.length;
  let correct = 0;
  currentTest.questions.forEach((q, i) => {
    if (answers[i] === q.correct) correct++;
  });
  const percentage = Math.round((correct / total) * 100);
  const timeTaken = Math.round((currentTest.duration * 60 - remainingSeconds) / 60);

  // Save result
  const user = Verity.getUser();
  Verity.saveResult({
    testId: currentTest.id,
    testName: currentTest.name,
    category: currentTest.category,
    userEmail: user.email,
    userName: user.name,
    correct,
    total,
    percentage,
    timeTaken,
    answers: { ...answers }
  });

  // Clear saved state
  Verity.clearTimer(currentTest.id);
  Verity.clearTestState(currentTest.id);

  // Show results
  document.getElementById('reviewOverlay').classList.add('hidden');
  const resultsOverlay = document.getElementById('resultsOverlay');
  resultsOverlay.classList.remove('hidden');

  document.getElementById('resultEmoji').textContent =
    percentage >= 80 ? '🎉' : percentage >= 60 ? '👍' : '📚';
  document.getElementById('resultTitle').textContent =
    percentage >= 80 ? 'Excellent Work!' : percentage >= 60 ? 'Good Effort!' : 'Keep Practicing!';
  document.getElementById('resultSubtitle').textContent = currentTest.name;
  document.getElementById('resultScore').textContent = `${percentage}%`;
  document.getElementById('resultDetail').textContent =
    `${correct} out of ${total} correct · ${timeTaken} min spent`;
}

function viewAnswers() {
  document.getElementById('resultsOverlay').classList.add('hidden');
  // Show answers inline
  currentIndex = 0;
  showAnswerReview();
}

function showAnswerReview() {
  const q = currentTest.questions[currentIndex];
  const total = currentTest.questions.length;

  document.getElementById('questionLabel').textContent = `Review: Question ${currentIndex + 1} of ${total}`;
  document.getElementById('questionText').textContent = q.text;
  document.getElementById('btnFlag').style.display = 'none';

  const container = document.getElementById('optionsContainer');
  container.innerHTML = '';
  const letters = ['A', 'B', 'C', 'D', 'E', 'F'];

  q.options.forEach((opt, i) => {
    const div = document.createElement('div');
    const isCorrect = i === q.correct;
    const wasSelected = answers[currentIndex] === i;
    let cls = 'option';
    let extra = '';

    if (isCorrect) {
      div.style.borderColor = 'var(--success)';
      div.style.background = 'var(--success-soft)';
      extra = ' ✓';
    } else if (wasSelected && !isCorrect) {
      div.style.borderColor = 'var(--danger)';
      div.style.background = 'var(--danger-soft)';
      extra = ' ✗';
    }

    div.className = cls;
    div.innerHTML = `
      <span class="option-letter" style="${isCorrect ? 'background:var(--success);color:#fff;border-color:var(--success)' : ''}">${letters[i]}</span>
      <span>${opt}${extra}</span>
    `;
    container.appendChild(div);
  });

  // Show explanation
  if (q.explanation) {
    const expl = document.createElement('div');
    expl.style.cssText = 'margin-top:16px;padding:14px 18px;background:var(--bg-alt);border-radius:var(--radius);font-size:0.9rem;color:var(--text-secondary);border-left:3px solid var(--accent)';
    expl.innerHTML = `<strong>Explanation:</strong> ${q.explanation}`;
    container.appendChild(expl);
  }

  // Nav
  document.getElementById('btnPrev').style.visibility = currentIndex === 0 ? 'hidden' : 'visible';
  document.getElementById('btnNext').textContent = currentIndex === total - 1 ? 'Done' : 'Next →';
  document.getElementById('btnNext').onclick = () => {
    if (currentIndex < total - 1) {
      currentIndex++;
      showAnswerReview();
    } else {
      Verity.navigate('dashboard.html');
    }
  };
  document.getElementById('btnPrev').onclick = () => {
    if (currentIndex > 0) {
      currentIndex--;
      showAnswerReview();
    }
  };

  updateGrid();
}

function saveCurrentState() {
  if (!currentTest) return;
  Verity.saveTestState(currentTest.id, {
    answers: { ...answers },
    flagged: [...flagged],
    currentIndex
  });
  Verity.saveTimer(currentTest.id, remainingSeconds);
}
