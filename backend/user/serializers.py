from rest_framework import serializers
from .models import CustomUser
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id' , 'email' , 'username' , 'profile_picture' , 'is_staff']
        read_only_fields = ['email']
    
    def update(self , instance , validated_data):
        instance.username = validated_data.get('username',instance.username)
        if 'profile_picture' in validated_data:
            instance.profile_picture = validated_data['profile_picture']
        instance.save()
        return instance


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only = True , required = True , validators = [validate_password])
    password2 = serializers.CharField(write_only = True , required = True)

    class Meta:
        model = CustomUser
        fields = [
            'id' , 'email' , 'username' , 'password' , 'password2'
        ]

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password" : "Passwords dont match"})
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password2')
        user = CustomUser.objects.create_user(**validated_data)
        return user

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['is_staff'] = user.is_staff

        return token