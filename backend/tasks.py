from celery import shared_task
from celery.schedules import crontab


@shared_task(ignore_result=True)
def treat_sleep_analysis():
    # Analyze sleep data for the given user_id
    # Placeholder logic
    print(f"Analyzing sleep data for user")
    return f"Sleep analysis completed for user"


@shared_task(ignore_result=True)
def treat_work_analysis():
    # Analyze work data for the given user_id
    # Placeholder logic
    print(f"Analyzing work data for user")
    return f"Work analysis completed for user"


@shared_task(ignore_result=True)
def add(x, y):
    return x + y