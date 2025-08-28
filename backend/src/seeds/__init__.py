from .seed_task import seed_tasks
from .seed_users import seed_users
from .seed_workspaces import seed_workspaces


def run_seeds():
    seed_users()
    seed_workspaces()
    seed_tasks()
