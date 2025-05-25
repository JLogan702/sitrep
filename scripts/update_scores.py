
import pandas as pd
import datetime
import json
import os

# === CONFIGURATION ===
TODAY = datetime.date.today()
SPRINT_SWITCH_DATES = {
    'Sprint 6': datetime.date(2025, 5, 21),
    'Sprint 7': datetime.date(2025, 6, 4),
    'Sprint 8': datetime.date(2025, 6, 18)
}
SPRINT_FIELD = 'Sprint'
STATUS_FIELD = 'Status'
COMPONENT_FIELD = 'Component'

# === DETERMINE CURRENT SPRINT ===
def get_current_sprint():
    for sprint, date in reversed(SPRINT_SWITCH_DATES.items()):
        if TODAY >= date:
            return sprint
    return 'Sprint 6'

def calculate_sitrep_scores(csv_path):
    df = pd.read_csv(csv_path)
    sprint = get_current_sprint()
    in_sprint = df[df[SPRINT_FIELD] == sprint]
    not_in_sprint = df[df[SPRINT_FIELD].isna()]

    # SPRINT READINESS
    def is_ready(row):
        status = row[STATUS_FIELD].lower()
        if row[COMPONENT_FIELD] == 'Engineering - Product':
            return 'ready' in status
        return 'ready' in status or 'to do' in status

    readiness_total = len(in_sprint)
    readiness_ready = in_sprint[in_sprint.apply(is_ready, axis=1)].shape[0]
    readiness_score = (readiness_ready / readiness_total) * 100 if readiness_total > 0 else 0

    # BACKLOG HEALTH
    def is_backlog_ready(row):
        status = row[STATUS_FIELD].lower()
        return 'new' in status or 'grooming' in status

    backlog_total = len(not_in_sprint)
    backlog_ready = not_in_sprint[not_in_sprint.apply(is_backlog_ready, axis=1)].shape[0]
    backlog_score = (backlog_ready / backlog_total) * 100 if backlog_total > 0 else 0

    # SAVE OUTPUT
    scores = {
        'sprint': sprint,
        'readiness_score': round(readiness_score, 1),
        'backlog_score': round(backlog_score, 1)
    }
    with open('sprint_dashboard/data/sitrep_scores.json', 'w') as f:
        json.dump(scores, f)

    print(f"✅ SITREP scores updated for {sprint}: {scores}")

if __name__ == '__main__':
    calculate_sitrep_scores('sprint_dashboard/data/DashboardData.csv')
