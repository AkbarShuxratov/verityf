/* ============================================
   VERITY — Admin Panel Logic
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  Verity.renderUserNav(document.getElementById('userNav'));
  renderScoresTable();
  renderManageTests();
});
// static/script.js
fetch("https://verityb.onrender.com")
  .then(response => response.json())
  .then(data => {
    console.log(data);
    document.getElementById("quiz-container").innerText = JSON.stringify(data);
  });
// --- Tab switching ---
function switchTab(tabName, el) {
  document.querySelectorAll('.admin-main > section').forEach(s => s.classList.add('hidden'));
  document.querySelectorAll('.admin-sidebar a').forEach(a => a.classList.remove('active'));
  el.classList.add('active');

  const panel = {
    scores: 'panelScores',
    addTest: 'panelAddTest',
    manage: 'panelManage'
  }[tabName];

  if (tabName === 'addTest' && document.querySelectorAll('.question-block').length === 0) {
    addQuestionField();
  }
  document.getElementById(panel).classList.remove('hidden');
}

// --- Scores Table ---
function renderScoresTable() {
  const results = Verity.getResults();
  const filter = document.getElementById('filterCategory').value;
  const filtered = filter ? results.filter(r => r.category === filter) : results;

  // Update stats
  document.getElementById('adminTotal').textContent = filtered.length;
  const uniqueStudents = new Set(filtered.map(r => r.userEmail));
  document.getElementById('adminStudents').textContent = uniqueStudents.size;

  if (filtered.length > 0) {
    const avg = Math.round(filtered.reduce((a, r) => a + r.percentage, 0) / filtered.length);
    document.getElementById('adminAvg').textContent = avg + '%';

    const passCount = filtered.filter(r => r.percentage >= 70).length;
    document.getElementById('adminPass').textContent = Math.round((passCount / filtered.length) * 100) + '%';
  } else {
    document.getElementById('adminAvg').textContent = '—';
    document.getElementById('adminPass').textContent = '—';
  }

  const tbody = document.getElementById('scoresBody');
  if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:32px;color:var(--text-muted)">No results found.</td></tr>';
    return;
  }

  // Sort by date descending
  filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

  tbody.innerHTML = filtered.map(r => {
    const cls = r.percentage >= 80 ? 'success' : r.percentage >= 60 ? 'warning' : 'danger';
    const date = new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return `
      <tr>
        <td><strong>${r.userName || r.userEmail}</strong><br><span style="font-size:0.8rem;color:var(--text-muted)">${r.userEmail}</span></td>
        <td>${r.testName}</td>
        <td><span class="badge badge-${cls === 'success' ? 'success' : cls === 'warning' ? 'warning' : 'danger'}">${r.category}</span></td>
        <td><span class="badge badge-${cls}">${r.percentage}%</span></td>
        <td>${r.correct}/${r.total}</td>
        <td>${r.timeTaken || '—'}m</td>
        <td style="font-size:0.85rem;color:var(--text-muted)">${date}</td>
      </tr>
    `;
  }).join('');
}

// --- CSV Export ---
function exportCSV() {
  const results = Verity.getResults();
  if (results.length === 0) {
    Verity.toast('No data to export', 'error');
    return;
  }

  const headers = ['Student', 'Email', 'Test', 'Category', 'Score%', 'Correct', 'Total', 'Time(min)', 'Date'];
  const rows = results.map(r => [
    r.userName, r.userEmail, r.testName, r.category,
    r.percentage, r.correct, r.total, r.timeTaken || '',
    new Date(r.date).toLocaleDateString()
  ]);

  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `verity_results_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  Verity.toast('CSV exported!', 'success');
}

// --- User-Friendly Test Addition ---
let questionIndex = 0;

function addQuestionField() {
  const container = document.getElementById('questionsContainer');
  questionIndex++;
  const div = document.createElement('div');
  div.className = 'card question-block';
  div.style.padding = '16px';
  div.style.background = 'var(--bg)';
  div.style.border = '1px solid var(--border)';
  div.id = `qBlock-${questionIndex}`;

  div.innerHTML = `
    <div class="flex justify-between items-center" style="margin-bottom: 12px;">
      <h4>Question ${questionIndex}</h4>
      <button type="button" class="btn btn-ghost btn-sm" style="color:var(--danger);" onclick="document.getElementById('qBlock-${questionIndex}').remove()">Remove</button>
    </div>
    <div class="input-group" style="margin-bottom: 12px;">
      <textarea class="input q-text" rows="2" placeholder="Enter the question text..." required></textarea>
    </div>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
      <input type="text" class="input q-opt1" placeholder="Option 1" required>
      <input type="text" class="input q-opt2" placeholder="Option 2" required>
      <input type="text" class="input q-opt3" placeholder="Option 3" required>
      <input type="text" class="input q-opt4" placeholder="Option 4" required>
    </div>
    <div style="display: grid; grid-template-columns: 120px 1fr; gap: 12px; align-items: center;">
      <select class="input q-correct" required title="Correct Option">
        <option value="0">Option 1</option>
        <option value="1">Option 2</option>
        <option value="2">Option 3</option>
        <option value="3">Option 4</option>
      </select>
      <input type="text" class="input q-expl" placeholder="Explanation (optional)" />
    </div>
  `;
  container.appendChild(div);
}

function submitUserFriendlyTest() {
  const idEl = document.getElementById('testId').value.trim();
  const nameEl = document.getElementById('testName').value.trim();
  const catEl = document.getElementById('testCategory').value.trim();
  const durEl = document.getElementById('testDuration').value;
  const iconEl = document.getElementById('testIcon').value.trim();
  const colorEl = document.getElementById('testColor').value;
  const descEl = document.getElementById('testDesc').value.trim();

  // Questions
  const qBlocks = document.querySelectorAll('.question-block');
  const feedback = document.getElementById('formFeedback');

  if (qBlocks.length === 0) {
    feedback.innerHTML = '<div style="color:var(--danger);font-size:0.9rem">Please add at least one question.</div>';
    return;
  }

  const questions = [];
  let valid = true;

  qBlocks.forEach((block, idx) => {
    const text = block.querySelector('.q-text').value.trim();
    const opt1 = block.querySelector('.q-opt1').value.trim();
    const opt2 = block.querySelector('.q-opt2').value.trim();
    const opt3 = block.querySelector('.q-opt3').value.trim();
    const opt4 = block.querySelector('.q-opt4').value.trim();
    const correct = parseInt(block.querySelector('.q-correct').value);
    const expl = block.querySelector('.q-expl').value.trim();

    if (!text || !opt1 || !opt2 || !opt3 || !opt4) valid = false;

    questions.push({
      id: idx + 1,
      text,
      options: [opt1, opt2, opt3, opt4],
      correct,
      explanation: expl || 'No explanation provided.'
    });
  });

  if (!valid) {
    feedback.innerHTML = '<div style="color:var(--danger);font-size:0.9rem">Please fill in all question texts and options.</div>';
    return;
  }

  const newTest = {
    id: idEl,
    name: nameEl,
    category: catEl,
    duration: parseInt(durEl),
    icon: iconEl || '📋',
    color: colorEl || '#6366f1',
    description: descEl,
    questions: questions
  };

  const allTests = [...VERITY_TESTS, ...Verity.getCustomTests()];
  if (allTests.find(t => t.id === newTest.id)) {
    feedback.innerHTML = `<div style="color:var(--danger);font-size:0.9rem">✗ A test with ID "${newTest.id}" already exists.</div>`;
    return;
  }

  Verity.addCustomTest(newTest);
  Verity.toast(`Test "${newTest.name}" added successfully!`, 'success');

  // reset form
  document.getElementById('addTestForm').reset();
  document.getElementById('questionsContainer').innerHTML = '';
  addQuestionField();

  feedback.innerHTML = `<div style="color:var(--success);font-size:0.9rem">✓ Test created and ready in the dashboard!</div>`;
  renderManageTests();
}



// --- Manage Tests ---
function renderManageTests() {
  const container = document.getElementById('manageTestsList');
  const builtIn = VERITY_TESTS;
  const custom = Verity.getCustomTests();

  let html = '<h3 style="margin-bottom:12px">Built-in Tests</h3>';
  html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px;margin-bottom:32px">';
  builtIn.forEach(t => {
    html += `
      <div class="card">
        <div class="flex items-center gap-sm" style="margin-bottom:8px">
          <span style="font-size:1.3rem">${t.icon}</span>
          <h4>${t.name}</h4>
        </div>
        <p style="font-size:0.85rem;color:var(--text-muted)">${t.questions.length} questions · ${t.duration} min</p>
        <span class="badge badge-success" style="margin-top:8px">Built-in</span>
      </div>`;
  });
  html += '</div>';

  if (custom.length > 0) {
    html += '<h3 style="margin-bottom:12px">Custom Tests</h3>';
    html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px">';
    custom.forEach((t, i) => {
      html += `
        <div class="card">
          <div class="flex justify-between items-center" style="margin-bottom:8px">
            <div class="flex items-center gap-sm">
              <span style="font-size:1.3rem">${t.icon}</span>
              <h4>${t.name}</h4>
            </div>
            <button class="btn btn-ghost btn-sm" style="color:var(--danger)" onclick="deleteCustomTest(${i})" title="Delete">🗑</button>
          </div>
          <p style="font-size:0.85rem;color:var(--text-muted)">${t.questions.length} questions · ${t.duration} min</p>
          <span class="badge badge-warning" style="margin-top:8px">Custom</span>
        </div>`;
    });
    html += '</div>';
  } else {
    html += '<p style="color:var(--text-muted);font-size:0.95rem">No custom tests added yet. Use the "Add New Test" tab to create one.</p>';
  }

  container.innerHTML = html;
}

function deleteCustomTest(index) {
  if (!confirm('Delete this custom test?')) return;
  const tests = Verity.getCustomTests();
  tests.splice(index, 1);
  localStorage.setItem('verity_custom_tests', JSON.stringify(tests));
  Verity.toast('Test deleted', 'success');
  renderManageTests();
}
