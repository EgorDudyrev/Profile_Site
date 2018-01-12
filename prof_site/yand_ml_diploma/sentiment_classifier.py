# This Python file uses the following encoding: utf-8
__author__ = 'Egor Dudyrev'
from sklearn.externals import joblib
import time


class SentimentClassifier(object):
    def __init__(self):
        print("Preparing classifier")
        start_time = time.time()
        self.pipe = joblib.load("yand_ml_diploma/best_pipe.jblib")
        print("Classifier is ready")
        print(time.time() - start_time, "seconds")
        print('THE PIPE IS')
        print('===========================')
        print(self.pipe)
        print('===========================')
        self.classes_dict = {0: u"отрицательный", 1: u"положительный", -1: u"ошибка предсказания"}

    @staticmethod
    def get_probability_words(probability):
        if probability == -1:
            return u"вероятность неизвестна"
        if probability < 0.55:
            return u"нейтральный или неуверенно"
        if probability < 0.7:
            return u"вероятно"
        if probability > 0.95:
            return u"точно"
        else:
            return ""

    def predict_text(self, text):
        pred, proba = 0, 0
        try:
            pred = self.pipe.predict([text])[0]#, self.pipe.predict_proba([text])[0].max()
        except:
            print(u"ошибка предсказания")
            pred = -1
        try:
            proba = self.pipe.predict_proba([text])[0].max()
        except:
            proba = 0.7195 #Cross-validation value

        return pred, proba

    def predict_list(self, list_of_texts):
        try:
            return self.pipe.predict(list_of_texts), self.pipe.predict_proba(list_of_texts)
        except:
            print(u'Ошибка предсказания')
            return None

    def get_prediction_message(self, text):
        prediction = self.predict_text(text)
        class_prediction = prediction[0]
        prediction_probability = prediction[1]
        return self.get_probability_words(prediction_probability) + " " + self.classes_dict[class_prediction]
