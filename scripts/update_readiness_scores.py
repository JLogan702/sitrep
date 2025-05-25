
import pandas as pd
import datetime
import json

SPRINT_FIELD = 'Sprint'
STATUS_FIELD = 'Status'
COMPONENT_FIELD = 'Component'
TODAY = datetime.date.today()

SPRINT_SWITCH_DATES = {
    'Sprint 6': datetime.date(2025, 5, 21),
    'Sprint 7': datetime.date(2025, 6, 4),
    'Sprint 8': datetime.date(2025, 6, 18)
}

def get_current_sprint():
    for sprint, date in reversed(SPRINT_SWITCH_DATES.items()):
        if TODAY >= date:
            return sprint
    return 'Sprint 6'

def calculate_readiness_scores(csv_path):
    df = pd.read_csv(csv_path)
    sprint = get_current_sprint()
    in_sprint = df[df[SPRINT_FIELD] == sprint]
    teams = in_sprint[COMPONENT_FIELD].unique()

    results = []
    for team in teams:
        subset = in_sprint[in_sprint[COMPONENT_FIELD] == team]

        def is_ready(row):
            status = row[STATUS_FIELD].lower()
            if team == 'Engineering - Product':
                return 'ready' in status
            return 'ready' in status or 'to do' in status

        total = len(subset)
        ready = subset[subset.apply(is_ready, axis=1)].shape[0]
        score = (ready / total) * 100 if total > 0 else 0

        results.append({
            'team': team,
            'total': total,
            'ready': ready,
            'score': round(score, 1)
        })

    with open('sprint_dashboard/data/readiness_scores.json', 'w') as f:
        json.dump(results, f)

    print(f"✅ Readiness scores updated for {sprint}: {results}")

if __name__ == '__main__':
    calculate_readiness_scores('sprint_dashboard/data/DashboardData.csv')
