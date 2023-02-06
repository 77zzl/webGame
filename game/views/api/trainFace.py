from rest_framework.views import APIView
from rest_framework.response import Response
from webGame import settings
import os
import cv2 as cv
import numpy as np


class TrainFace(APIView):
    def post(self, request):
        path = settings.MEDIA_ROOT
        if self.check(path, request.data.get('face')):
            faceSamples, ids = [], []
            face_detector = cv.CascadeClassifier('./media/haarcascade_frontalface_default.xml')

            for face in os.listdir(path + '/face'):
                facePath = path + '/face/' + face
                for img in os.listdir(facePath):
                    faceImg = cv.imread(facePath + '/' + img)
                    gray_img = cv.cvtColor(faceImg, cv.COLOR_BGR2GRAY)
                    faceSamples.append(gray_img)
                    ids.append(int(face))

            recognizer = cv.face.LBPHFaceRecognizer_create()
            recognizer.train(faceSamples, np.array(ids))
            recognizer.write(path + '/trainer.yml')
            return Response({
                'result': "success",
                })

        return Response({
            'result': "error",
            })

    def check(self, path, face):
        facePath = path + '/face/' + str(face)
        if os.path.exists(facePath) and len(os.listdir(facePath)) > 10:
            return True
        return False

