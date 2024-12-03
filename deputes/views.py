from django.shortcuts import render

def index(request):
    return render(request, 'deputes/index.html')

from django.http import FileResponse, HttpResponse
import os
from django.conf import settings

def serve_csv(request):
    # Chemin vers le fichier CSV
    file_path = os.path.join(settings.BASE_DIR, 'Depute2024.csv')  # Modifiez si le fichier est ailleurs
    if os.path.exists(file_path):
        return FileResponse(open(file_path, 'rb'), content_type='text/csv')
    else:
        return HttpResponse("Fichier introuvable", status=404)
