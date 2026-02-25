from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.views.decorators.http import require_POST
import json


def index(request):
    # If already logged in, go to dashboard
    if request.user.is_authenticated:
        return redirect('dashboard')
    return render(request, 'core/index.html')


def dashboard(request):
    if not request.user.is_authenticated:
        return redirect('index')
    return render(request, 'core/dashboard.html', {
        'user_data': json.dumps({
            'name': request.user.get_full_name() or request.user.username,
            'email': request.user.email,
            'role': 'admin' if request.user.is_staff else 'student',
        })
    })


def admin_view(request):
    if not request.user.is_authenticated:
        return redirect('index')

    if request.method == "POST":
        if request.POST.get("password") == "algoritm":
            request.session['admin_auth'] = True
            return render(request, 'core/admin.html', {
                'user_data': json.dumps({
                    'name': request.user.get_full_name() or request.user.username,
                    'email': request.user.email,
                    'role': 'admin' if request.user.is_staff else 'student',
                })
            })
        else:
            return render(request, 'core/admin_login.html', {'error': 'Invalid password'})

    if not request.session.get('admin_auth'):
        return render(request, 'core/admin_login.html')

    return render(request, 'core/admin.html', {
        'user_data': json.dumps({
            'name': request.user.get_full_name() or request.user.username,
            'email': request.user.email,
            'role': 'admin' if request.user.is_staff else 'student',
        })
    })


def test_engine(request):
    if not request.user.is_authenticated:
        return redirect('index')
    return render(request, 'core/test-engine.html', {
        'user_data': json.dumps({
            'name': request.user.get_full_name() or request.user.username,
            'email': request.user.email,
            'role': 'admin' if request.user.is_staff else 'student',
        })
    })


# --- Auth API Endpoints ---

@require_POST
def api_signin(request):
    try:
        data = json.loads(request.body)
        email = data.get('email', '').strip()
        password = data.get('password', '')

        if not email or not password:
            return JsonResponse({'ok': False, 'error': 'Please fill in all fields.'}, status=400)

        # Try to find user by email
        try:
            user_obj = User.objects.get(email=email)
            username = user_obj.username
        except User.DoesNotExist:
            return JsonResponse({'ok': False, 'error': 'No account found with this email.'}, status=400)

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return JsonResponse({
                'ok': True,
                'user': {
                    'name': user.get_full_name() or user.username,
                    'email': user.email,
                    'role': 'admin' if user.is_staff else 'student',
                }
            })
        else:
            return JsonResponse({'ok': False, 'error': 'Incorrect password.'}, status=400)

    except json.JSONDecodeError:
        return JsonResponse({'ok': False, 'error': 'Invalid request.'}, status=400)


@require_POST
def api_signup(request):
    try:
        data = json.loads(request.body)
        name = data.get('name', '').strip()
        email = data.get('email', '').strip()
        password = data.get('password', '')

        if not name or not email or not password:
            return JsonResponse({'ok': False, 'error': 'Please fill in all fields.'}, status=400)

        if len(password) < 6:
            return JsonResponse({'ok': False, 'error': 'Password must be at least 6 characters.'}, status=400)

        if User.objects.filter(email=email).exists():
            return JsonResponse({'ok': False, 'error': 'An account with this email already exists.'}, status=400)

        # Create username from email (before @)
        username = email.split('@')[0]
        # Ensure unique username
        base_username = username
        counter = 1
        while User.objects.filter(username=username).exists():
            username = f"{base_username}{counter}"
            counter += 1

        # Split name into first/last
        name_parts = name.split(' ', 1)
        first_name = name_parts[0]
        last_name = name_parts[1] if len(name_parts) > 1 else ''

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
        )
        login(request, user)
        return JsonResponse({
            'ok': True,
            'user': {
                'name': user.get_full_name() or user.username,
                'email': user.email,
                'role': 'student',
            }
        })

    except json.JSONDecodeError:
        return JsonResponse({'ok': False, 'error': 'Invalid request.'}, status=400)


def api_logout(request):
    logout(request)
    return redirect('index')


def api_user(request):
    """Return current user info as JSON (for JS to read)."""
    if request.user.is_authenticated:
        return JsonResponse({
            'ok': True,
            'user': {
                'name': request.user.get_full_name() or request.user.username,
                'email': request.user.email,
                'role': 'admin' if request.user.is_staff else 'student',
            }
        })
    return JsonResponse({'ok': False}, status=401)
