from django.http import HttpResponse

def index(request):
    str = '<h1 style="text-align: center">Index Page</h1>'
    return HttpResponse(str)

def play(request):
    str = '<h1 style="text-align: center">Game Page</h1>'
    return HttpResponse(str)
