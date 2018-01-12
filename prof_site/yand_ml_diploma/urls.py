from django.conf.urls import url
from . import views
from .sentiment_classifier import SentimentClassifier

urlpatterns = [
    url(r'^$', views.index, name='ml_index')
]


#classifier = SentimentClassifier()
