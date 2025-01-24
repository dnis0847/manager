# main_app/views.py

from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib import messages
from .models import Project, Task, Comment, UserProfile
from .forms import LoginForm, ProjectForm
from django.contrib.auth.decorators import login_required
from django.db.models import Q
from django.http import JsonResponse
import json
from django.views.decorators.csrf import csrf_exempt


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
                return redirect('dashboard')  # Перенаправление после успешного входа
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



def logout_view(request):
    auth_logout(request)
    return redirect('index')
