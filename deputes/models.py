from django.db import models

class Depute(models.Model):
    departement = models.CharField(max_length=100)
    circonscription = models.CharField(max_length=100)
    nom = models.CharField(max_length=200)
    email = models.EmailField()

    def __str__(self):
        return f"{self.nom} ({self.departement}, {self.circonscription})"
