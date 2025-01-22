from django.contrib import admin
from .models import Project, Task, Comment, UserProfile

# Register your models here.


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['title', 'status', 'created_at',
                    'manager', 'start_date', 'end_date']
    list_filter = ['status', 'manager']
    search_fields = ['title', 'description']
    list_per_page = 10


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ['title', 'project', 'priority',
                    'status', 'start_date', 'end_date']
    list_filter = ['project', 'priority', 'status', 'assigned_to']
    search_fields = ['title', 'description']


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ['task', 'user', 'text', 'created_at']
    list_filter = ['task', 'user']
    search_fields = ['text']


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'role']
    list_filter = ['role']
    search_fields = ['user__username', 'user__email']
