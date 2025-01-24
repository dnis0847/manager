from django import forms
from .models import Project

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


class ProjectForm(forms.ModelForm):
    class Meta:
        model = Project
        fields = ['title', 'description', 'start_date', 'end_date', 'status']
        widgets = {
            'start_date': forms.DateInput(attrs={'type': 'date'}),
            'end_date': forms.DateInput(attrs={'type': 'date'}),
        }