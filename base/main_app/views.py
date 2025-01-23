from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib import messages
from . models import Project, Task, Comment, UserProfile
from . forms import LoginForm
from django.contrib.auth.decorators import login_required

# Create your views here.
def index_view(request):
    title = 'Projects Box | Главная'
    projects = Project.objects.all()
    return render(request, 'main_app/index.html', {'projects': projects, 'title': title})


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
    projects = Project.objects.all()
    projects_active = Project.objects.filter(status='AC').count()
    project_data = [
        {
            'project': project,
            'progress': project.get_progress(),
            'days_until_end': project.days_until_end()
        }
        for project in projects
    ]
    return render(request, 'main_app/dashboard.html', {
        'title': title,
        'project_data': project_data,
        'projects_active': projects_active
    })
    
    
def logout_view(request):
    auth_logout(request)
    return redirect('index')