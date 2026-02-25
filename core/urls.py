from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('index.html', views.index, name='index_html'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('dashboard.html', views.dashboard, name='dashboard_html'),
    path('admin/', views.admin_view, name='admin'),
    path('admin.html', views.admin_view, name='admin_html'),
    path('test-engine/', views.test_engine, name='test_engine'),
    path('test-engine.html', views.test_engine, name='test_engine_html'),

    # Auth API
    path('api/signin/', views.api_signin, name='api_signin'),
    path('api/signup/', views.api_signup, name='api_signup'),
    path('api/logout/', views.api_logout, name='api_logout'),
    path('api/user/', views.api_user, name='api_user'),
]
