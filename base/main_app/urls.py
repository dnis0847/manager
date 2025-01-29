from django.urls import path
from . import views

urlpatterns = [
    path('', views.index_view, name='index'),
    path('login', views.login_view, name='login'),
    path('register', views.register_view, name='register'),
    path('dashboard', views.dashboard_view, name='dashboard'),
    path('projects', views.projects_view, name='projects'),
    path('tasks', views.tasks_view, name='tasks'),
    path('update-task-status', views.update_task_status, name='update_task_status'),
    path('api/tasks/<int:task_id>/delete/',
         views.delete_task, name='delete_task'),
    path('api/tasks/<int:task_id>/edit/', views.edit_task, name='edit_task'),
    path('task/<int:task_id>/', views.task_detail, name='task_detail'),
    path('task/<int:task_id>/add_comment/',
         views.add_comment, name='add_comment'),
    path('teams', views.teams_view, name='teams'),
    path('get_events/', views.get_events, name='get_events'),
    path('calendar', views.calendar_view, name='calendar'),
    path('logout', views.logout_view, name='logout'),
]
