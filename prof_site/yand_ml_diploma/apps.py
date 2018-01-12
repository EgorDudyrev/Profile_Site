from django.apps import AppConfig
from .sentiment_classifier import SentimentClassifier


class YandMlDiplomaConfig(AppConfig):
    name = 'yand_ml_diploma'
    #verbose_name = "Yandex ML diploma"
    classifier = None


    def ready(self):
        clf = SentimentClassifier()
        self.classifier = clf

