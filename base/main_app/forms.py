from django import forms
from .models import Project, Task
from django.contrib.auth.models import User

class LoginForm(forms.Form):
    login = forms.CharField(widget=forms.TextInput(attrs={
        'placeholder': 'Введите ваш логин',
        'class': 'form-control',
    }))
    password = forms.CharField(widget=forms.PasswordInput(attrs={
        'placeholder': 'Введите ваш пароль',
        'class': 'form-control',
    }))
    remember = forms.BooleanField(required=False)


class RegisterForm(forms.Form):
    login = forms.CharField(widget=forms.TextInput(attrs={
        'placeholder': 'Введите логин',
        'required': True,
        'id': 'login',
    }))
    firstName = forms.CharField(widget=forms.TextInput(attrs={
        'placeholder': 'Введите имя',
        'required': True,
        'id': 'firstName',
    }))
    lastName = forms.CharField(widget=forms.TextInput(attrs={
        'placeholder': 'Введите фамилию',
        'required': True,
        'id': 'lastName',
    }))
    email = forms.EmailField(widget=forms.EmailInput(attrs={
        'placeholder': 'Введите email',
        'required': True,
        'id': 'email',
    }))
    password = forms.CharField(widget=forms.PasswordInput(attrs={
        'placeholder': 'Создайте пароль',
        'required': True,
        'id': 'password',
    }))
    confirmPassword = forms.CharField(widget=forms.PasswordInput(attrs={
        'placeholder': 'Повторите пароль',
        'required': True,
        'id': 'confirmPassword',
    }))
    terms = forms.BooleanField(required=True)

    def clean_login(self):
        login = self.cleaned_data['login']
        if User.objects.filter(username=login).exists():
            raise forms.ValidationError("Пользователь с таким логином уже существует")
        return login

    def clean_email(self):
        email = self.cleaned_data['email']
        if User.objects.filter(email=email).exists():
            raise forms.ValidationError("Пользователь с таким email уже существует")
        return email

    def clean(self):
        cleaned_data = super().clean()
        password = cleaned_data.get("password")
        confirm_password = cleaned_data.get("confirmPassword")

        if password and confirm_password and password != confirm_password:
            raise forms.ValidationError("Пароли не совпадают")

        return cleaned_data

    

class ProjectForm(forms.ModelForm):
    class Meta:
        model = Project
        fields = ['title', 'description', 'start_date', 'end_date', 'status']
        widgets = {
            'start_date': forms.DateInput(attrs={'type': 'date'}),
            'end_date': forms.DateInput(attrs={'type': 'date'}),
        }
        
        
class TaskForm(forms.ModelForm):
    class Meta:
        model = Task
        fields = ['title', 'description', 'project', 'priority', 'status', 'start_date', 'end_date', 'assigned_to']
        widgets = {
            'start_date': forms.DateInput(attrs={'type': 'date'}),
            'end_date': forms.DateInput(attrs={'type': 'date'}),
            'description': forms.Textarea(attrs={'rows': 3}),
            'project': forms.Select(attrs={'class': 'form-control'}),
            'priority': forms.Select(attrs={'class': 'form-control'}),
            'status': forms.Select(attrs={'class': 'form-control'}),
            'assigned_to': forms.Select(attrs={'class': 'form-control'}),
        }

    def __init__(self, *args, **kwargs):
        super(TaskForm, self).__init__(*args, **kwargs)
        for field in self.fields:
            self.fields[field].widget.attrs.update({'class': 'form-control'})