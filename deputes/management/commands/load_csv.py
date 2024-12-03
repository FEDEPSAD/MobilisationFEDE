import csv
from django.core.management.base import BaseCommand
from deputes.models import Depute

class Command(BaseCommand):
    help = 'Load deputes data from a CSV file'

    def handle(self, *args, **kwargs):
        csv_file_path = "data/Depute2024.csv"  # Chemin du fichier CSV

        try:
            with open(csv_file_path, mode='r', encoding='utf-8-sig') as file:  # Ignorer le BOM
                reader = csv.DictReader(file, delimiter=';')  # Utiliser le point-virgule comme séparateur
                
                # Afficher les colonnes détectées pour vérification
                self.stdout.write(f"Colonnes détectées : {reader.fieldnames}")

                # Vérifiez que 'Département' existe
                if 'Département' not in reader.fieldnames:
                    self.stdout.write(self.style.ERROR("Colonne 'Département' introuvable dans le fichier CSV."))
                    return

                # Charger les données dans la base de données
                for row in reader:
                    depute, created = Depute.objects.update_or_create(
                        departement=row['Département'].strip(),
                        circonscription=row['Circonscription'].strip(),
                        defaults={
                            'nom': row['Députés'].strip(),
                            'email': row['Email'].strip(),
                        }
                    )
                    action = "créé" if created else "mis à jour"
                    self.stdout.write(f"Député {action} : {depute.nom}")

            self.stdout.write(self.style.SUCCESS("Données chargées avec succès."))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Une erreur est survenue : {e}"))
