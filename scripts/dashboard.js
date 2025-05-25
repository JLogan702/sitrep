
document.addEventListener('DOMContentLoaded', () => {
  const mainContent = document.getElementById('main-content');
  const viewSelect = document.getElementById('view-select');

  viewSelect.addEventListener('change', () => {
    loadView(viewSelect.value);
  });

  function loadView(view) {
    mainContent.innerHTML = ''; // Clear
    if (view === 'sitrep') {
      renderSITREP();
    } else {
      renderTeams(view);
    }
  }

  function renderSITREP() {
    fetch('data/sitrep_scores.json')
      .then(res => res.json())
      .then(data => {
        const percent = (data.readiness_score + data.backlog_score) / 2;
        const status = getStatus(percent);

        const block = document.createElement('div');
        block.className = 'card';
        block.innerHTML = `
          <h3>📌 Situation Report (SITREP)</h3>
          <div class="stoplight-wrapper">
            <div class="glow red ${status === 'red' ? 'blink' : ''}"></div>
            <div class="glow yellow ${status === 'yellow' ? 'blink' : ''}"></div>
            <div class="glow green ${status === 'green' ? 'blink' : ''}"></div>
          </div>
          <p><strong>Sprint Readiness:</strong> ${data.readiness_score}%</p>
          <p><strong>Backlog Health:</strong> ${data.backlog_score}%</p>
          <p>🔎 This score reflects an average across all teams. Green = Ready to go, Red = Requires urgent grooming effort.</p>
        `;
        mainContent.appendChild(block);
      });
  }

  function renderTeams(view) {
    const source = view === 'readiness' ? 'readiness_scores.json' : 'backlog_scores.json';
    fetch('data/' + source)
      .then(res => res.json())
      .then(data => {
        const grid = document.createElement('div');
        grid.className = 'card-grid';

        data.forEach(team => {
          const status = getStatus(team.score);
          const card = document.createElement('div');
          card.className = 'card';
          card.innerHTML = `
            <h3>${team.team}</h3>
            <div class="stoplight-wrapper">
              <div class="glow red ${status === 'red' ? 'blink' : ''}"></div>
              <div class="glow yellow ${status === 'yellow' ? 'blink' : ''}"></div>
              <div class="glow green ${status === 'green' ? 'blink' : ''}"></div>
            </div>
            <p>${team.numerator} of ${team.denominator} stories ${view === 'readiness' ? 'ready for dev' : 'in New or Grooming'}</p>
            <p>(${team.score.toFixed(1)}%)</p>
            <p>${getExplanation(view)}</p>
          `;
          grid.appendChild(card);
        });

        mainContent.appendChild(grid);
      });
  }

  function getStatus(score) {
    if (score >= 70) return 'green';
    if (score >= 40) return 'yellow';
    return 'red';
  }

  function getExplanation(view) {
    if (view === 'readiness') {
      return '💡 Measures how many stories in the next sprint are ready for development.';
    } else {
      return '💡 Measures how much of the backlog (not in a sprint) is groomed and ready.';
    }
  }

  loadView('sitrep'); // Load default
});
