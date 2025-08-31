from celery import shared_task
from celery.schedules import crontab
from make_celery import flask_app
from src.models import Sensor, Task, User, Workspace
from src.service.ai_service import AIService
from src.service.analytics_service import AnalyticsService
from src.service.mail_service import MailService


@shared_task(ignore_result=True)
def treat_sleep_analysis():
    app = flask_app
    print("Starting sleep analysis task")
    with app.app_context():
        task_m = Task.query.filter_by(name="sleep").first()
        sensors = task_m.sensors if task_m else []
        for sensor in sensors[0:1]:
            treat_sensor_sleep_analysis.delay(sensor.to_dict())

    print(f"Analyzing sleep data for user")
    return f"Sleep analysis completed for user"


@shared_task(ignore_result=True)
def treat_work_analysis():
    app = flask_app
    print("Starting work analysis task")
    with app.app_context():
        task_m = Task.query.filter_by(name="work").first()
        sensors = task_m.sensors if task_m else []
        for sensor in sensors:
            treat_sensor_work_analysis.delay(sensor.to_dict())

    print(f"Analyzing work data for user")
    return f"Work analysis completed for user"


@shared_task(ignore_result=True)
def add(x, y):
    return x + y


@shared_task(ignore_result=True)
def treat_sensor_sleep_analysis(sensor):
    analytics = AnalyticsService()
    print(f"Processing sensor inside sleep: {sensor.get('source_id')})")
    res, err = analytics.get_sensor_data_last_8_hours(sensor.get("source_id"))
    if err:
        msg = f"Error processing sensor {sensor.get('name')} {sensor.get('source_id')}: {err}"
        print(msg)
        return f"Error for sensor {sensor.get('source_id')}"
    ai_msg = "\n".join(
        f"{data['source_address']} - {data['time']} - {data['temperature']}"
        for data in res
    )
    res_ai = AIService.analyze_sleep_data(ai_msg)
    if res_ai.get("success") == False:
        user = get_workspace_user(sensor)
        if user:
            body = construct_email_body(sensor, res_ai.get("response"))
            MailService.send_sleep_analysis_email(user.email, body)
        print(f"Analyzing sleep data for sensor {res_ai.get('response')}")
    return f"Sleep analysis completed for sensor {sensor.get('source_id')}"


@shared_task(ignore_result=True)
def treat_sensor_work_analysis(sensor: Sensor):
    analytics = AnalyticsService()
    print(f"Processing sensor inside work: {sensor} ------- {sensor.get('source_id')}")
    res, err = analytics.get_sensor_data_last_8_hours(sensor.get("source_id"))
    if err:
        msg = f"Error processing sensor {sensor.get('name')} {sensor.get('source_id')}: {err}"
        print(msg)
        return f"Error for sensor {sensor.get('source_id')}"
    ai_msg = ""
    for data in res:
        ai_msg += f"{data['time']} - {data['temperature']}\n"
    res_ai = AIService.analyze_work_data(ai_msg)
    if res_ai.get("success") == False:
        user = get_workspace_user(sensor)
        if user:
            body = construct_email_body(sensor, res_ai.get("response"))
            MailService.send_work_analysis_email(user.email, body)
    return f"Work analysis completed for sensor {sensor.get('source_id')}"


## ========================================== UTILS FUNCTIONS =============================


def get_workspace_user(sensor: Sensor):
    workspace = Workspace.query.filter_by(id=sensor.get("workspace_id")).first()
    if workspace and workspace.user_id:
        return User.query.filter_by(id=workspace.user_id).first()
    return None


def construct_email_body(sensor: Sensor, analysis_data: str) -> str:
    msg = f"""
    Sleep analysis report for {sensor.get('name')} - {sensor.get('source_id')}:
    <br/>
    <br/>
    {analysis_data}
    """
    return msg
