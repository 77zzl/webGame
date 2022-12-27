from django.urls import path
from game.views.playground.setScore import SetScore
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


urlpatterns = [
    path("score/", SetScore.as_view(), name="playground_setScore")
]
