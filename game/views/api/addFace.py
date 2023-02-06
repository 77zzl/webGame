from rest_framework.views import APIView
from rest_framework.response import Response
from webGame import settings
import os
import cv2 as cv
import numpy as np


class AddFace(APIView):
    def post(self, request):
        path = settings.MEDIA_ROOT
        files = request.FILES
        face = request.POST.get('face')
        cnt = request.POST.get('cnt')
        photoPath = path + '/photo/' + face
        if not os.path.exists(photoPath):
            os.mkdir(photoPath)
        if 'image' in files:
            image = files['image']
            with open(photoPath + '/' + cnt + '.png', 'wb+') as f:
                for c in image.chunks():
                    f.write(c)

            # detect
            self.detect(path, face, cnt)
            return Response({
                'result': "success",
                })

        return Response({
            'result': "error",
            })


    def detect(self, path, face, cnt):
        savePath = path + '/face/' + face
        if not os.path.exists(savePath):
            os.mkdir(savePath)

        face_detector = cv.CascadeClassifier(path + '/haarcascade_frontalface_default.xml')
        photoPath = path + '/photo/' + face + '/'
        for i, f in enumerate(os.listdir(photoPath)):
            img = cv.imread(photoPath + f)
            os.remove(photoPath + f)
            gray_img = cv.cvtColor(img, cv.COLOR_BGR2GRAY)
            h, w = gray_img.shape
            faces = face_detector.detectMultiScale(gray_img,
                        scaleFactor=1.01,
                        minNeighbors=4,
                        minSize=(w // 3, h // 3))
            if len(faces) != 1:
                continue
            for face in faces:
                x, y, w, h = face
                faceImg = gray_img[y:y + h, x:x + w]
                cv.imwrite(savePath + '/' + cnt + '.png', faceImg)
