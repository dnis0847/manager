from django import forms

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

