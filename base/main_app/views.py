from django.shortcuts import render
from . models import Project, Task, Comment, UserProfile


# Create your views here.
def index(request):
    title = 'Projects Box | Главная'
    projects = Project.objects.all()
    return render(request, 'main_app/index.html', {'projects': projects, 'title': title})