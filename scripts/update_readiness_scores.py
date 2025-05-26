
import pandas as pd
import json

SPRINT_FIELD = "Sprint"
STATUS_FIELD = "Status"
COMPONENT_FIELD = "Component"
READY_STATUSES = ["To Do", "Ready for Development"]

# Define team-to-sprint ID mapping for Sprint 7
SPRINT_IDS = {
    "Engineering - Platform": 982,
    "Engineering - Product": 985,
    "Data Science": 1000,
    "Design": 987,
    "Engineering - AI Ops": 0,  # If known, replace with correct ID
    "AdTech 1.0": 0             # If known, replace with correct ID
}

def calculate_readiness_scores(csv_path):
    df = pd.read_csv(csv_path)
    df = df[[SPRINT_FIELD, STATUS_FIELD, COMPONENT_FIELD]].copy()

    team_scores = []
    for team, sprint_id in SPRINT_IDS.items():
        if sprint_id == 0:
            continue  # Skip teams without configured sprint IDs

        # Match rows containing the numeric sprint ID
        mask = df[SPRINT_FIELD].astype(str).str.contains(str(sprint_id), na=False)
        team_data = df[mask & (df[COMPONENT_FIELD] == team)]

        total = len(team_data)
        ready = team_data[team_data[STATUS_FIELD].isin(READY_STATUSES)]
        count_ready = len(ready)
        score = round((count_ready / total) * 100, 1) if total > 0 else 0

        print("🛠️ ", team, f": {count_ready}/{total} stories ready ({score}%)")

        team_scores.append({
            "team": team,
            "score": score,
            "numerator": count_ready,
            "denominator": total
        })

    with open("data/readiness_scores.json", "w") as f:
        json.dump(team_scores, f, indent=2)

    print("✅ readiness_scores.json updated!")

calculate_readiness_scores("data/DashboardData.csv")
