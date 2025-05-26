
document.addEventListener('DOMContentLoaded', () => {
  const mainContent = document.getElementById('main-content');
  const viewSelect = document.getElementById('view-select');

  viewSelect.addEventListener('change', () => {
    loadView(viewSelect.value);
  });

  function loadView(view) {
    mainContent.innerHTML = '';
    if (view === 'sitrep') {
      renderSITREP();
    } else {
      renderTeamCards(view);
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
            <img src="img/stoplight.png" width="50">
            <div class="glow red ${status === 'red' ? 'blink' : ''}"></div>
            <div class="glow yellow ${status === 'yellow' ? 'blink' : ''}"></div>
            <div class="glow green ${status === 'green' ? 'blink' : ''}"></div>
          </div>
          <p><strong>Sprint Readiness:</strong> ${data.readiness_score}%</p>
          <p><strong>Backlog Health:</strong> ${data.backlog_score}%</p>
          <p>🧠 This reflects the average readiness and grooming across all teams.</p>
        `;
        mainContent.appendChild(block);
      });
  }

  function renderTeamCards(view) {
    const source = view === 'readiness' ? 'readiness_scores.json' : 'backlog_scores.json';
    fetch('data/' + source)
      .then(res => res.json())
      .then(data => {
        const grid = document.createElement('div');
        grid.className = 'card-grid';

        data.forEach(team => {
          const status = getStatus(team.score);
          const chartFile = `img/${team.team.toLowerCase().replace(/\s+/g, '_')}_${view}_chart.png`;

          const card = document.createElement('div');
          card.className = 'card';
          card.innerHTML = `
            <h3>${team.team}</h3>
            <div class="stoplight-wrapper">
              <img src="img/stoplight.png" width="50">
              <div class="glow red ${status === 'red' ? 'blink' : ''}"></div>
              <div class="glow yellow ${status === 'yellow' ? 'blink' : ''}"></div>
              <div class="glow green ${status === 'green' ? 'blink' : ''}"></div>
            </div>
            <p>${team.numerator} of ${team.denominator} stories ${view === 'readiness' ? 'ready for dev' : 'groomed'}</p>
            <p>Score: ${team.score}%</p>
            <img src="${chartFile}" alt="Chart" onerror="this.style.display='none'; this.insertAdjacentHTML('afterend', '<p>📉 No chart available</p>');">
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
      return '💡 Stories considered ready must be in "To Do" or "Ready for Development" and assigned to the next sprint.';
    } else {
      return '💡 Groomed backlog means stories in "New" or "Grooming" that are not in any sprint.';
    }
  }

  loadView('sitrep');
});
