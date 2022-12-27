from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from game.models.player.player import Player


class SetScore(APIView):
    permission_classes = ([IsAuthenticated])

    def post(self, request):
        data = request.POST
        username = data.get("username", "").strip()
        score = data.get("score", 0)
        player = Player.objects.get(user__username = username)
        player.score += int(score)
        player.save()
        return Response({
            'result': "success"
            })
