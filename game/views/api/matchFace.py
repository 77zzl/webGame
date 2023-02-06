from rest_framework.views import APIView
from rest_framework.response import Response
from webGame import settings
import os
import cv2 as cv
import numpy as np


class MatchFace(APIView):
    def post(self, request):
        files = request.FILES
        name = request.POST.get('img_id')
        if 'img' in files:
            pic1 = files['img']
            picName = os.path.join(settings.MEDIA_ROOT, 'predict/' + name + '.png')
            with open(picName, 'wb+') as pic:
                for c in pic1.chunks():
                    pic.write(c)

            status = self.predict(settings.MEDIA_ROOT, name)
            if not status:
                return Response({
                    'result': "error",
                    })

            return Response({
                'result': "success",
                })

        return Response({
            'result': "error",
            })

    def predict(self, path, name):
        recognizer = cv.face.LBPHFaceRecognizer_create()
        recognizer.read(path + '/model/trainer.yml')
        # 检测人脸的工具
        face_detector = cv.CascadeClassifier(path + '/haarcascade_frontalface_default.xml')

        img = cv.imread(path + '/predict/' + name + '.png')
        # 灰度
        gray = cv.cvtColor(img, cv.COLOR_BGR2GRAY)
        # 进行人脸检测
        h, w = gray.shape
        faces = face_detector.detectMultiScale(gray,
                    scaleFactor=1.01,
                    minNeighbors=4,
                    minSize=(w // 2, h // 2))

        if len(faces) > 1:
            return 0
        for face in faces:
            x, y, w, h = face
            faceImg = gray[y:y + h, x:x + w]
            cv.imwrite(path + '/face/predict_' + name + '.png', faceImg)
            # 预测
            fId, confident = recognizer.predict(faceImg)
            print('这是第%d个人，置信度为%f' % (fId, confident))
        os.remove(path + '/predict/' + name + '.png')
        return 1
