from django.urls import path
from game.views.api.addFace import AddFace
from game.views.api.trainFace import TrainFace
from game.views.api.matchFace import MatchFace
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


urlpatterns = [
    path("addFace/", AddFace.as_view(), name="api_addFace"),
    path("trainFace/", TrainFace.as_view(), name="api_trainFace"),
    path("matchFace/", MatchFace.as_view(), name="api_matchFace"),
]

