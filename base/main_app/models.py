from django.db import models
from django.contrib.auth.models import User

# Create your models here.


class Role(models.TextChoices):
    ADMIN = 'AD', 'Администратор'
    PROJECT_MANAGER = 'PM', 'Менеджер проекта'
    EXECUTOR = 'EX', 'Исполнитель'


class Project(models.Model):
    class Status(models.TextChoices):
        ACTIVE = 'AC', 'Активный'
        COMPLETED = 'CO', 'Завершен'
        PAUSED = 'PA', 'Приостановлен'

    title = models.CharField(max_length=200)
    description = models.TextField()
    start_date = models.DateField()
    end_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=2,
        choices=Status.choices,
        default=Status.ACTIVE
    )
    manager = models.ForeignKey(User,
                                on_delete=models.SET_NULL,
                                null=True,
                                blank=True,
                                related_name='managed_projects')

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = 'Проект'
        verbose_name_plural = 'Проекты'


class Task(models.Model):
    class Priority(models.TextChoices):
        HIGH = 'HI', 'High'
        MEDIUM = 'ME', 'Medium'
        LOW = 'LO', 'Low'

    class Status(models.TextChoices):
        NOT_STARTED = 'NS', 'Not Started'
        IN_PROGRESS = 'IP', 'In Progress'
        COMPLETED = 'CO', 'Completed'

    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField()
    priority = models.CharField(
        max_length=2,
        choices=Priority.choices,
        default=Priority.MEDIUM
    )
    status = models.CharField(
        max_length=2,
        choices=Status.choices,
        default=Status.NOT_STARTED
    )
    start_date = models.DateField()
    end_date = models.DateField()
    assigned_to = models.ForeignKey(User,
                                    on_delete=models.SET_NULL,
                                    null=True,
                                    blank=True,
                                    related_name='assigned_tasks')

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = 'Задача'
        verbose_name_plural = 'Задачи'


class Comment(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User,
                             on_delete=models.CASCADE,
                             related_name='comments')

    def __str__(self):
        return self.text

    class Meta:
        verbose_name = 'Комментарий'
        verbose_name_plural = 'Комментарии'


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(
        max_length=2,
        choices=Role.choices,
        default=Role.EXECUTOR
    )

    def __str__(self):
        return self.user.username

    class Meta:
        verbose_name = 'Профиль'
        verbose_name_plural = 'Профили'
