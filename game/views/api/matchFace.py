from rest_framework.views import APIView
from rest_framework.response import Response
from webGame import settings
import os
import cv2 as cv
import numpy as np


class MatchFace(APIView):
    def post(self, request):
        path = settings.MEDIA_ROOT
        files = request.FILES
        face = request.POST.get('face')
        cnt = request.POST.get('cnt')
        if 'image' in files:
            image = files['image']
            predictPath = path + '/predict/' + face + '_' + cnt +'.png'
            with open(predictPath, 'wb+') as f:
                for c in image.chunks():
                    f.write(c)

            # predict
            fId, confident = self.predict(path, predictPath)
            return Response({
                'result': "success",
                'faceId': fId,
                'confident': confident
                })

        return Response({
            'result': "error",
            })

    def predict(self, path, predictPath):
        recognizer = cv.face.LBPHFaceRecognizer_create()
        recognizer.read(path + '/trainer.yml')
        face_detector = cv.CascadeClassifier(path + '/haarcascade_frontalface_default.xml')

        img = cv.imread(predictPath)
        os.remove(predictPath)
        gray = cv.cvtColor(img, cv.COLOR_BGR2GRAY)
        h, w = gray.shape
        faces = face_detector.detectMultiScale(gray,
                    scaleFactor=1.01,
                    minNeighbors=4,
                    minSize=(w // 3, h // 3))

        if len(faces) != 1:
            return (-1, -1)
        fId, confident = -1, -1
        for face in faces:
            x, y, w, h = face
            faceImg = gray[y:y + h, x:x + w]
            fId, confident = recognizer.predict(faceImg)
            print('这是第%d个人，置信度为%f' % (fId, confident))
        return (fId, confident)
