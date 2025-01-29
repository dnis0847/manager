from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib import messages
from .models import Project, Task, Comment, UserProfile, User
from .forms import LoginForm, ProjectForm, TaskForm
from django.contrib.auth.decorators import login_required
from django.db.models import Q
from django.http import JsonResponse
import json
from django.views.decorators.csrf import csrf_exempt, csrf_protect
from django.core.paginator import Paginator
from datetime import date, timedelta
from django.views.decorators.http import require_POST
from django.core.exceptions import PermissionDenied
import logging
from django.views.decorators.http import require_http_methods
from django.shortcuts import get_object_or_404

logger = logging.getLogger(__name__)

# Create your views here.


def index_view(request):
    title = 'Projects Box | Главная'
    return render(request, 'main_app/index.html', {'title': title})


def login_view(request):
    title = 'Projects Box | Вход'
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            login = form.cleaned_data.get('login')
            password = form.cleaned_data.get('password')
            remember = form.cleaned_data.get('remember')
            user = authenticate(request, username=login, password=password)
            if user is not None:
                auth_login(request, user)
                if not remember:
                    request.session.set_expiry(0)
                # Перенаправление после успешного входа
                return redirect('dashboard')
            else:
                messages.error(request, 'Неверный логин или пароль.')
    else:
        form = LoginForm()
    return render(request, 'main_app/login.html', {
        'form': form,
        'title': title
    })


def register_view(request):
    title = 'Projects Box | Регистрация'
    return render(request, 'main_app/register.html', {'title': title})


@login_required
def dashboard_view(request):
    title = 'Projects Box | Панель управления'
    query = request.GET.get('q')
    projects = Project.objects.filter(status='AC')

    if query:
        projects = projects.filter(Q(title__iregex=r'(?i)' + query))

    projects_active_count = Project.objects.filter(status='AC').count()
    project_data = [
        {
            'project': project,
            'progress': project.get_progress(),
            'days_until_end': project.days_until_end()
        }
        for project in projects
    ]

    # Получение роли пользователя
    user_profile = UserProfile.objects.get(user=request.user)
    user_role = user_profile.role

    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            form = ProjectForm(data)
            if form.is_valid():
                project = form.save(commit=False)
                project.manager = request.user
                project.save()
                return JsonResponse({'success': True, 'project': {
                    'title': project.title,
                    'description': project.description,
                    'start_date': project.start_date,
                    'end_date': project.end_date,
                    'status': project.status,
                }})
            else:
                return JsonResponse({'success': False, 'errors': form.errors}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({'success': False, 'errors': 'Invalid JSON'}, status=400)

    return render(request, 'main_app/dashboard.html', {
        'title': title,
        'project_data': project_data,
        'projects_active_count': projects_active_count,
        'form': ProjectForm(),
        'user_role': user_role
    })


@login_required
def projects_view(request):
    title = 'Projects Box | Проекты'
    query = request.GET.get('q')
    status = request.GET.get('status')
    page_number = request.GET.get('page', 1)
    projects = Project.objects.all()

    if query:
        projects = projects.filter(
            Q(title__icontains=query) | Q(description__icontains=query))

    if status:
        projects = projects.filter(status=status)

    active_projects_count = Project.objects.filter(status='AC').count()
    completed_projects_count = Project.objects.filter(status='CO').count()
    paused_projects_count = Project.objects.filter(status='PA').count()
    all_projects_count = Project.objects.all().count()

    # Пагинация
    paginator = Paginator(projects, 10)  # 10 проектов на странице
    projects_page = paginator.get_page(page_number)

    project_data = []
    for project in projects_page:
        tasks = Task.objects.filter(project=project)
        project_data.append({
            'project': project,
            'progress': project.get_progress(),
            'days_until_end': project.days_until_end(),
            'tasks': tasks,
        })

    # Получение роли пользователя
    user_profile = UserProfile.objects.get(user=request.user)
    user_role = user_profile.role

    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            form = ProjectForm(data)
            if form.is_valid():
                project = form.save(commit=False)
                project.manager = request.user
                project.save()
                return JsonResponse({'success': True, 'project': {
                    'title': project.title,
                    'description': project.description,
                    'start_date': project.start_date,
                    'end_date': project.end_date,
                    'status': project.status,
                }})
            else:
                return JsonResponse({'success': False, 'errors': form.errors}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({'success': False, 'errors': 'Invalid JSON'}, status=400)

    return render(request, 'main_app/projects.html', {
        'title': title,
        'form': ProjectForm(),
        'active_projects_count': active_projects_count,
        'completed_projects_count': completed_projects_count,
        'paused_projects_count': paused_projects_count,
        'all_projects_count': all_projects_count,
        'project_data': project_data,
        'user_role': user_role,
        'projects_page': projects_page,
    })


@login_required
def tasks_view(request):
    title = 'Projects Box | Задачи'
    query = request.GET.get('q')
    tasks = Task.objects.all()
    projects = Project.objects.all()
    users = User.objects.all()

    not_started_tasks_count = Task.objects.filter(status='NS').count()
    in_progress_tasks_count = Task.objects.filter(status='IP').count()
    completed_tasks_count = Task.objects.filter(status='CO').count()
    all_tasks_count = Task.objects.all().count()

    if query:
        tasks = tasks.filter(Q(title__icontains=query) | Q(
            description__icontains=query) | Q(project__title__icontains=query))

    task_data = []
    for task in tasks:
        days_until_end = (task.end_date - date.today()).days
        task_data.append({
            'task': task,
            'days_until_end': days_until_end
        })

    # Получение роли пользователя
    user_profile = UserProfile.objects.get(user=request.user)
    user_role = user_profile.role

    if request.method == 'POST':
        form = TaskForm(request.POST)
        if form.is_valid():
            new_task = form.save()
            return JsonResponse({'success': True, 'message': 'Задача успешно создана'})
        else:
            return JsonResponse({'success': False, 'message': 'Ошибка в форме', 'errors': form.errors}, status=400)

    else:
        form = TaskForm()

    context = {
        'title': title,
        'task_data': task_data,
        'not_started_tasks_count': not_started_tasks_count,
        'in_progress_tasks_count': in_progress_tasks_count,
        'completed_tasks_count': completed_tasks_count,
        'all_tasks_count': all_tasks_count,
        'projects': projects,
        'users': users,
        'form': form,
        'user_role': user_role,
    }

    return render(request, 'main_app/tasks.html', context)


@login_required
def task_detail(request, task_id):
    task = get_object_or_404(Task, id=task_id)
    comments = Comment.objects.filter(task=task).order_by('-created_at')

    context = {
        'title': f'Projects Box | Задача: {task.title}',
        'task': task,
        'comments': comments,
    }

    return render(request, 'main_app/task_detail.html', context)


@login_required
@require_POST
def add_comment(request, task_id):
    task = get_object_or_404(Task, id=task_id)
    comment_text = request.POST.get('comment_text')

    if comment_text:
        Comment.objects.create(
            task=task,
            user=request.user,
            text=comment_text
        )

    return redirect('task_detail', task_id=task_id)


@login_required
@require_POST
@csrf_protect
def update_task_status(request):
    try:
        data = json.loads(request.body)
        task_id = data.get('taskId')
        new_status = data.get('newStatus')

        # Проверка валидности нового статуса
        valid_statuses = [choice[0] for choice in Task.Status.choices]
        if new_status not in valid_statuses:
            return JsonResponse({'success': False, 'message': 'Недопустимый статус'}, status=400)

        task = Task.objects.get(id=task_id)

        # Проверка прав доступа (пример: только назначенный пользователь, менеджер проекта или администратор может изменить статус)
        user_profile = UserProfile.objects.get(user=request.user)
        if request.user != task.assigned_to and request.user != task.project.manager and user_profile.role != 'AD':
            raise PermissionDenied(
                "У вас нет прав на изменение статуса этой задачи.")

        task.status = new_status
        task.save()

        logger.info(
            f"Статус задачи {task_id} обновлен на {new_status} пользователем {request.user.username}")

        return JsonResponse({'success': True, 'message': 'Статус задачи успешно обновлен'})
    except Task.DoesNotExist:
        logger.warning(
            f"Попытка обновить несуществующую задачу {task_id} пользователем {request.user.username}")
        return JsonResponse({'success': False, 'message': 'Задача не найдена'}, status=404)
    except PermissionDenied as e:
        logger.warning(
            f"Отказано в доступе пользователю {request.user.username} для обновления задачи {task_id}: {str(e)}")
        return JsonResponse({'success': False, 'message': str(e)}, status=403)
    except json.JSONDecodeError:
        logger.error(
            f"Неверный формат JSON в теле запроса от пользователя {request.user.username}")
        return JsonResponse({'success': False, 'message': 'Неверный формат JSON в теле запроса'}, status=400)
    except Exception as e:
        logger.error(
            f"Ошибка при обновлении статуса задачи: {str(e)}", exc_info=True)
        return JsonResponse({'success': False, 'message': 'Произошла ошибка при обновлении задачи'}, status=500)


@login_required
@require_http_methods(["DELETE"])
def delete_task(request, task_id):
    task = get_object_or_404(Task, id=task_id)

    # Check if the user has permission to delete the task
    user_profile = UserProfile.objects.get(user=request.user)
    if request.user != task.project.manager and user_profile.role != 'AD':
        return JsonResponse({'success': False, 'message': 'У вас нет прав на удаление этой задачи.'}, status=403)

    try:
        task.delete()
        return JsonResponse({'success': True, 'message': 'Задача успешно удалена.'})
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)}, status=500)


@login_required
@require_http_methods(["GET", "POST"])
def edit_task(request, task_id):
    task = get_object_or_404(Task, id=task_id)

    # Check if the user has permission to edit the task
    user_profile = UserProfile.objects.get(user=request.user)
    if request.user != task.project.manager and user_profile.role != 'AD':
        return JsonResponse({'success': False, 'message': 'У вас нет прав на редактирование этой задачи.'}, status=403)

    if request.method == "GET":
        # Return task data for editing
        task_data = {
            'id': task.id,
            'title': task.title,
            'description': task.description,
            'priority': task.priority,
            'status': task.status,
            'start_date': task.start_date.isoformat(),
            'end_date': task.end_date.isoformat(),
            'assigned_to': task.assigned_to.id if task.assigned_to else None,
            'project': task.project.id,
        }
        return JsonResponse({'success': True, 'task': task_data})
    elif request.method == "POST":
        # Update task data
        data = json.loads(request.body)
        form = TaskForm(data, instance=task)
        if form.is_valid():
            form.save()
            return JsonResponse({'success': True, 'message': 'Задача успешно обновлена'})
        else:
            return JsonResponse({'success': False, 'errors': form.errors}, status=400)


def teams_view(request):
    context = {
        'title': f'Projects Box | Команда',
    }
    
    return render(request, 'main_app/team.html', context)


def logout_view(request):
    auth_logout(request)
    return redirect('index')
