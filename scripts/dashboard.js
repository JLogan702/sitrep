
function switchView() {
  const view = document.getElementById("viewSelector").value;
  const sitrepView = document.getElementById("sitrep-view");

  if (view === "sitrep") {
    sitrepView.style.display = "block";
    loadSitrepData();
  } else {
    sitrepView.style.display = "none";
  }
}

function loadSitrepData() {
  fetch("data/sitrep_scores.json")
    .then(response => response.json())
    .then(data => {
      const readiness = data.readiness_score;
      const backlog = data.backlog_score;
      document.getElementById("sitrep-score").innerHTML =
        `Sprint Readiness: ${readiness}%<br>Backlog Health: ${backlog}%`;

      let summary = "";
      let avgScore = (readiness + backlog) / 2;

      if (avgScore >= 70) {
        summary = "🟢 Overall program status is healthy.";
        showLight("green");
      } else if (avgScore >= 40) {
        summary = "🟡 Overall program status needs attention.";
        showLight("yellow");
      } else {
        summary = "🔴 Overall program status is critical.";
        showLight("red");
      }

      document.getElementById("sitrep-explanation").innerText = summary;
    })
    .catch(error => {
      console.error("Error loading SITREP data:", error);
    });
}

function showLight(color) {
  document.getElementById("sitrep-red").style.display = "none";
  document.getElementById("sitrep-yellow").style.display = "none";
  document.getElementById("sitrep-green").style.display = "none";

  if (color === "red") {
    document.getElementById("sitrep-red").style.display = "inline";
  } else if (color === "yellow") {
    document.getElementById("sitrep-yellow").style.display = "inline";
  } else if (color === "green") {
    document.getElementById("sitrep-green").style.display = "inline";
  }
}

// Initialize view
document.addEventListener("DOMContentLoaded", () => {
  switchView();  // Load initial view
});

function switchView() {
  const view = document.getElementById("viewSelector").value;
  document.getElementById("sitrep-view").style.display = "none";
  document.getElementById("readiness-view").style.display = "none";

  if (view === "sitrep") {
    document.getElementById("sitrep-view").style.display = "block";
    loadSitrepData();
  } else if (view === "readiness") {
    document.getElementById("readiness-view").style.display = "block";
    loadReadinessData();
  }
}

function loadReadinessData() {
  fetch("data/readiness_scores.json")
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById("readiness-teams");
      container.innerHTML = "";
      data.forEach(teamData => {
        const { team, total, ready, score } = teamData;
        const block = document.createElement("div");
        block.className = "team-block";

        let light = "red";
        if (score >= 70) light = "green";
        else if (score >= 40) light = "yellow";

        block.innerHTML = `
          <h3>${team}</h3>
          <div class="stoplight-container">
            <img src="img/blinking_stoplight_red.gif" style="display: ${light === 'red' ? 'inline' : 'none'};" class="stoplight">
            <img src="img/blinking_stoplight_yellow.gif" style="display: ${light === 'yellow' ? 'inline' : 'none'};" class="stoplight">
            <img src="img/blinking_stoplight_green.gif" style="display: ${light === 'green' ? 'inline' : 'none'};" class="stoplight">
          </div>
          <p>${ready} of ${total} stories ready (${score}%)</p>
        `;
        container.appendChild(block);
      });
    })
    .catch(error => console.error("Failed to load readiness scores:", error));
}

function switchView() {
  const view = document.getElementById("viewSelector").value;
  document.getElementById("sitrep-view").style.display = "none";
  document.getElementById("readiness-view").style.display = "none";
  document.getElementById("backlog-view").style.display = "none";

  if (view === "sitrep") {
    document.getElementById("sitrep-view").style.display = "block";
    loadSitrepData();
  } else if (view === "readiness") {
    document.getElementById("readiness-view").style.display = "block";
    loadReadinessData();
  } else if (view === "backlog") {
    document.getElementById("backlog-view").style.display = "block";
    loadBacklogData();
  }
}

function loadBacklogData() {
  fetch("data/backlog_scores.json")
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById("backlog-teams");
      container.innerHTML = "";
      data.forEach(teamData => {
        const { team, total, ready, score } = teamData;
        const block = document.createElement("div");
        block.className = "team-block";

        let light = "red";
        if (score >= 70) light = "green";
        else if (score >= 40) light = "yellow";

        block.innerHTML = `
          <h3>${team}</h3>
          <div class="stoplight-container">
            <img src="img/blinking_stoplight_red.gif" style="display: ${light === 'red' ? 'inline' : 'none'};" class="stoplight">
            <img src="img/blinking_stoplight_yellow.gif" style="display: ${light === 'yellow' ? 'inline' : 'none'};" class="stoplight">
            <img src="img/blinking_stoplight_green.gif" style="display: ${light === 'green' ? 'inline' : 'none'};" class="stoplight">
          </div>
          <p>${ready} of ${total} stories in New or Grooming (${score}%)</p>
        `;
        container.appendChild(block);
      });
    })
    .catch(error => console.error("Failed to load backlog scores:", error));
}

function showSitrepGlow(color) {
  const red = document.getElementById("sitrep-glow-red");
  const yellow = document.getElementById("sitrep-glow-yellow");
  const green = document.getElementById("sitrep-glow-green");

  red.classList.remove("blink");
  yellow.classList.remove("blink");
  green.classList.remove("blink");

  if (color === "red") red.classList.add("blink");
  else if (color === "yellow") yellow.classList.add("blink");
  else if (color === "green") green.classList.add("blink");
}
