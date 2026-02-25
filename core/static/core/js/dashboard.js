/* ============================================
   VERITY — Dashboard Logic
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  if (!Verity.requireAuth()) return;

  const user = Verity.getUser();
  Verity.renderUserNav(document.getElementById('userNav'));

  // Welcome message
  const firstName = (user.name || 'Student').split(' ')[0];
  document.getElementById('welcomeMsg').textContent = `Welcome back, ${firstName}`;

  // Load stats
  loadStats();

  // Load test categories with simulated delay for skeleton effect
  setTimeout(loadTestCategories, 600);

  // Load score history
  loadScoreHistory();
});

function loadStats() {
  const results = Verity.getResults();
  const user = Verity.getUser();
  const userResults = results.filter(r => r.userEmail === user.email);

  document.getElementById('statTests').textContent = userResults.length;

  if (userResults.length > 0) {
    const scores = userResults.map(r => r.percentage);
    const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    const best = Math.max(...scores);
    const totalMinutes = userResults.reduce((a, r) => a + (r.timeTaken || 0), 0);

    document.getElementById('statAvg').textContent = avg + '%';
    document.getElementById('statBest').textContent = best + '%';
    document.getElementById('statTime').textContent = totalMinutes >= 60
      ? `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`
      : `${totalMinutes}m`;
  }
}

function loadTestCategories() {
  const container = document.getElementById('testCategories');
  const allTests = [...VERITY_TESTS, ...Verity.getCustomTests()];

  // Group by category
  const categories = {};
  allTests.forEach(test => {
    if (!categories[test.category]) {
      categories[test.category] = {
        name: test.category,
        icon: test.icon,
        color: test.color,
        tests: []
      };
    }
    categories[test.category].tests.push(test);
  });

  container.innerHTML = '';
  Object.values(categories).forEach((cat, i) => {
    const card = document.createElement('div');
    card.className = 'test-cat-card';
    card.style.animationDelay = `${i * 0.1}s`;
    card.style.animation = 'slideUp 0.4s ease-out both';
    card.innerHTML = `
      <div class="cat-icon" style="background:${cat.color}15;color:${cat.color}">
        ${cat.icon}
      </div>
      <h3>${cat.name}</h3>
      <p>${cat.tests.length} test${cat.tests.length > 1 ? 's' : ''} available</p>
      <div style="margin-top:12px">
        <span class="btn btn-sm btn-secondary" style="font-size:0.8rem">Start Practice →</span>
      </div>
    `;
    card.addEventListener('click', () => openTestPicker(cat));
    container.appendChild(card);
  });
}

function openTestPicker(category) {
  const modal = document.getElementById('testPickerModal');
  const title = document.getElementById('pickerTitle');
  const list = document.getElementById('pickerList');

  title.textContent = `${category.name} Tests`;
  list.innerHTML = '';

  category.tests.forEach(test => {
    const item = document.createElement('div');
    item.className = 'card card-interactive';
    item.style.cursor = 'pointer';
    item.innerHTML = `
      <div class="flex justify-between items-center">
        <div>
          <h4>${test.name}</h4>
          <p style="font-size:0.85rem;color:var(--text-muted);margin-top:4px">${test.description}</p>
          <div class="flex gap-sm" style="margin-top:8px">
            <span class="badge badge-success">${test.questions.length} questions</span>
            <span class="badge badge-warning">${test.duration} min</span>
          </div>
        </div>
        <span style="font-size:1.5rem;color:var(--accent)">→</span>
      </div>
    `;
    item.addEventListener('click', () => {
      Verity.navigate(`test-engine.html?testId=${test.id}`);
    });
    list.appendChild(item);
  });

  modal.classList.remove('hidden');
}

function closeTestPicker() {
  document.getElementById('testPickerModal').classList.add('hidden');
}

// Close modal on backdrop click
document.addEventListener('click', (e) => {
  const modal = document.getElementById('testPickerModal');
  if (e.target === modal) closeTestPicker();
});

function loadScoreHistory() {
  const container = document.getElementById('scoreHistory');
  const results = Verity.getResults();
  const user = Verity.getUser();
  const userResults = results
    .filter(r => r.userEmail === user.email)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 8);

  if (userResults.length === 0) return;

  container.innerHTML = '';
  userResults.forEach(result => {
    const cls = result.percentage >= 80 ? 'high' : result.percentage >= 60 ? 'mid' : 'low';
    const date = new Date(result.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const item = document.createElement('div');
    item.className = 'score-item';
    item.innerHTML = `
      <div class="score-badge ${cls}">${result.percentage}%</div>
      <div style="flex:1">
        <div style="font-weight:600;font-size:0.9rem">${result.testName}</div>
        <div style="font-size:0.8rem;color:var(--text-muted)">${date} · ${result.correct}/${result.total} correct</div>
      </div>
    `;
    container.appendChild(item);
  });
}
