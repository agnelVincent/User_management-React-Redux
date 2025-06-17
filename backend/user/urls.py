from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.routers import DefaultRouter

from .views import (
    RegisterView , 
    CustomTokenObtainView , 
    ProfileView,
    AdminUserViewSet
)

urlpatterns = [
    path('register/' , RegisterView.as_view() , name = 'register'),
    path('login/' , CustomTokenObtainView.as_view() , name = 'token_obtain_pair'),
    path('token/refresh' , TokenRefreshView.as_view() , name = 'token_refresh'),
    path('profile/',ProfileView.as_view() , name = 'profile')
]

router = DefaultRouter()
router.register(r'admin/users' , AdminUserViewSet , basename='admin-users')

urlpatterns += router.urls