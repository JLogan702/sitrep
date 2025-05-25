
import pandas as pd
import json

SPRINT_FIELD = 'Sprint'
STATUS_FIELD = 'Status'
COMPONENT_FIELD = 'Component'

def calculate_backlog_scores(csv_path):
    df = pd.read_csv(csv_path)
    backlog = df[df[SPRINT_FIELD].isna()]
    teams = backlog[COMPONENT_FIELD].unique()

    results = []
    for team in teams:
        subset = backlog[backlog[COMPONENT_FIELD] == team]

        def is_ready(row):
            status = row[STATUS_FIELD].lower()
            return 'new' in status or 'grooming' in status

        total = len(subset)
        ready = subset[subset.apply(is_ready, axis=1)].shape[0]
        score = (ready / total) * 100 if total > 0 else 0

        results.append({
            'team': team,
            'total': total,
            'ready': ready,
            'score': round(score, 1)
        })

    with open('sprint_dashboard/data/backlog_scores.json', 'w') as f:
        json.dump(results, f)

    print(f"✅ Backlog health scores updated: {results}")

if __name__ == '__main__':
    calculate_backlog_scores('sprint_dashboard/data/DashboardData.csv')
