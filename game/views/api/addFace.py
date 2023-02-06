from rest_framework.views import APIView
from rest_framework.response import Response
from webGame import settings
import os
import cv2 as cv
import numpy as np


class AddFace(APIView):
    def post(self, request):
        files = request.FILES
        face = request.POST.get('face')
        path = settings.MEDIA_ROOT
        if 'video' in files:
            video = files['video']
            faceName = path + '/video/' + face + '.mp4'
            with open(faceName, 'wb+') as f:
                for c in video.chunks():
                    f.write(c)

            # detect
            self.detect(path, face, faceName)
            os.remove(faceName)

        return Response({
            'result': "error",
            })


    def detect(self, path, face, faceName):
        savePath = path + '/face/' + face
        if not os.path.exists(savePath):
            os.mkdir(savePath)
        cap, cnt = cv.VideoCapture(faceName), 0
        while True:
            flag, frame = cap.read()
            if not flag or cnt > 1:
                break
            gray = cv.cvtColor(frame, cv.COLOR_BGR2GRAY)
            face_detector = cv.CascadeClassifier(path + '/haarcascade_frontalface_default.xml')
            h, w = gray.shape
            faces = face_detector.detectMultiScale(gray,
                                           scaleFactor=1.01,
                                           minNeighbors=4)
            if len(faces) == 1:
                for face in faces:
                    x, y, w, h = face
                    faceImg = gray[y:y + h, x:x + w]
                    faceImg = cv.resize(faceImg, (w // 10, h // 10))
                    cv.imwrite(savePath + '/' + str(cnt) + '.png', faceImg)
                    cnt += 1

        cv.destroyAllWindows()
        cap.release()


