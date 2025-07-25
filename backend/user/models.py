from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin


class CustomUserManager(BaseUserManager):
    def create_user(self , email , username , password = None):
        if not email:
            raise ValueError('Email is required')
        if not username:
            raise ValueError('Username is required')
        
        email = self.normalize_email(email)
        user = self.model(email = email , username = username)
        user.set_password(password)
        user.save(using = self._db)
        return user
    
    def create_superuser(self , email , username , password = None):
        user = self.create_user(email , username , password)
        user.is_staff = True
        user.is_superuser = True
        user.save(using = self._db)
        return True
    

class CustomUser(AbstractBaseUser , PermissionsMixin):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=100 , unique= True)
    profile_picture = models.ImageField(upload_to='profile/' , blank=True ,null = True)
    is_active = models.BooleanField(default= True)
    is_staff = models.BooleanField(default = False)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email