from datetime import timedelta

from celery import Celery, Task
from celery.schedules import crontab
from flask import Flask

# from tasks import treat_sleep_analysis, treat_work_analysis


def celery_init_app(app: Flask) -> Celery:
    class FlaskTask(Task):
        def __call__(self, *args: object, **kwargs: object) -> object:
            with app.app_context():
                return self.run(*args, **kwargs)

    celery_app = Celery(app.name, task_cls=FlaskTask, include=["tasks"])
    celery_app.config_from_object(app.config["CELERY"])
    celery_app.set_default()
    app.extensions["celery"] = celery_app
    return celery_app

def create_celery_app(app: Flask) -> Flask:
    # app = Flask(__name__)
    app.config.from_mapping(
        CELERY=dict(
            broker_url="redis://redis:6379",
            result_backend="redis://redis:6379",
            task_ignore_result=True,
            beat_schedule={
                'every-1-hours': {
                    'task': 'tasks.add',
                    'schedule': timedelta(hours=1),  # runs every 1 hour
                },
                'work-analysis-at-17': {
                    'task': 'tasks.treat_work_analysis',
                    'schedule': crontab(minute=0, hour=17),  # runs every day at 17:00 Local Time
                },
                'sleep-analysis-at-8': {
                    'task': 'tasks.treat_sleep_analysis',
                    'schedule': crontab(minute=0, hour=8),  # runs every day at 8:00 Local Time
                },
            }
        )
    )
    # app.config.from_prefixed_env()
    celery_init_app(app)
    return app