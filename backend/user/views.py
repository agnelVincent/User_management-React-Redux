from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import RegisterSerializer, UserSerializer , CustomTokenObtainPairSerializer
from .models import CustomUser
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import viewsets
from .permissions import IsAdminUserOnly

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer

class CustomTokenObtainView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser , FormParser]

    def get(self , request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    
    def put(self , request):
        print(request.FILES)
        user = request.user
        serializer = UserSerializer(user , data = request.data , partial = True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors , status=400)
    
class AdminUserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated , IsAdminUserOnly]

    def get_queryset(self):
        return CustomUser.objects.exclude(id = self.request.user.id)

    def get_serializer_class(self):
        if self.action in ['create']:
            return RegisterSerializer
        return UserSerializer