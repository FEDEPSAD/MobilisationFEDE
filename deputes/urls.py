from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='deputes-index'),  # Page principale
    path('csv/depute/', views.serve_csv, name='serve_csv'),  # URL pour le fichier CSV
]
import logging
logger = logging.getLogger(__name__)
logger.info("Chargement de deputes/urls.py")
