from django.shortcuts import render, HttpResponse
from .apps import  YandMlDiplomaConfig
from django.apps import apps
#from .__init__ import classifier

# Create your views here.
def index(request):
    classifier = apps.get_app_config('yand_ml_diploma').classifier

    text = request.POST["text"] if request.method == "POST" else ''

    print('text:',text)

    prediction_message = classifier.get_prediction_message(text) if len(text)>0 else ''
    print('message:',prediction_message)

    is_pos = True if prediction_message.endswith("положительный") else False

    context = {'text':text, 'prediction_message':prediction_message, 'is_pos':is_pos}
    return render(request, 'ml_diploma_index.html', context)
