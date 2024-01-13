from django.urls import path
from game.views.api.addFace import AddFace
from game.views.api.trainFace import TrainFace
from game.views.api.matchFace import MatchFace
from game.views.api.removeFace import RemoveFace
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


urlpatterns = [
]

