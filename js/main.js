document.addEventListener('DOMContentLoaded', () => {
    // Sélectionner les éléments HTML
    const departementsSelect = document.getElementById('departements');
    const circonscriptionsSelect = document.getElementById('circonscriptions');
    const emailContainer = document.getElementById('email-container');
    const emailSpan = document.getElementById('depute-email');
    const emailButton = document.getElementById('email-button');
    const csvFilePath = "/csv/depute/";
    
    let deputesData = {}; // Structure pour stocker les données des départements

    // Charger le fichier CSV avec PapaParse
    Papa.parse(csvFilePath, {
        download: true,
        header: true,
        delimiter: ";", // Délimiteur utilisé dans le fichier CSV
        skipEmptyLines: true, // Ignorer les lignes vides
        complete: function(results) {
            console.log("Données chargées :", results.data);
            results.data.forEach(row => {
            console.log("Ligne du CSV :", row);// Vérifier si le fichier CSV contient des données valides
        });
            if (results.data.length === 0) {
                console.error("Le fichier CSV est vide ou mal formaté.");
                return;
            }


            // Traiter les données
            results.data.forEach(row => {
                const departement = row['Département']?.trim();
                const circonscription = row['Circonscription']?.trim();
                const email = row['Email']?.trim();

                if (!departement || !circonscription || !email) {
                    console.warn("Ligne ignorée : informations incomplètes", row);
                    return;
                }

                // Ajouter au tableau des départements
                if (!deputesData[departement]) {
                    deputesData[departement] = [];
                }
                deputesData[departement].push({
                    circonscription: circonscription,
                    email: email
                });
            });

            // Remplir la liste des départements
            populateDepartements(deputesData);
        },
        error: function(error) {
            console.error("Erreur lors du chargement du fichier CSV :", error);
        }
    });

    // Fonction pour remplir la liste des départements
    function populateDepartements(data) {
        Object.keys(data).sort().forEach(departement => {
            const option = document.createElement('option');
            option.value = departement;
            option.textContent = departement;
            departementsSelect.appendChild(option);
        });
    }

    
    // Gérer la sélection d'un département
    departementsSelect.addEventListener('change', () => {
        const selectedDepartement = departementsSelect.value;
        console.log("Département sélectionné :", selectedDepartement);

        // Réinitialiser la liste des circonscriptions
        circonscriptionsSelect.innerHTML = '<option value="">Choisissez une circonscription</option>';
        circonscriptionsSelect.disabled = true;
        emailContainer.style.display = 'none';
        emailButton.style.display = 'none';

        // Si un département est sélectionné, remplir la liste des circonscriptions
        if (selectedDepartement && deputesData[selectedDepartement]) {
            const sortedCirconscriptions = deputesData[selectedDepartement].sort((a, b) => {
                // Trier par numéro de circonscription (numéro en début de chaîne)
                const numA = parseInt(a.circonscription.match(/^\d+/)) || 0;
                const numB = parseInt(b.circonscription.match(/^\d+/)) || 0;
                return numA - numB;
            });

            // Ajouter les options triées
            sortedCirconscriptions.forEach((depute, index) => {
                console.log("Ajout de la circonscription :", depute.circonscription);
                const option = document.createElement('option');
                option.value = index;
                option.textContent = depute.circonscription;
                circonscriptionsSelect.appendChild(option);
            });
            circonscriptionsSelect.disabled = false; // Activer la liste des circonscriptions
        }
    });
    
    // Gérer la sélection d'une circonscription
    circonscriptionsSelect.addEventListener('change', () => {
        const selectedDepartement = departementsSelect.value;
        const selectedIndex = circonscriptionsSelect.value;

        // Afficher l'email correspondant à la circonscription sélectionnée
        if (selectedDepartement && deputesData[selectedDepartement] && selectedIndex !== "") {
            const selectedDepute = deputesData[selectedDepartement][selectedIndex];
            emailSpan.textContent = selectedDepute.email; // Afficher l'email dans le conteneur
            emailContainer.style.display = 'block';
            emailButton.style.display = 'inline-block';

            // Configurer le bouton pour ouvrir un client de messagerie
            emailButton.addEventListener("click", function () {
                const email = emailSpan.textContent; // Récupérer l'email sélectionné
                const subject = encodeURIComponent("Réforme de la prise en charge des fauteuils roulants");
                const body = encodeURIComponent(`
Madame la Députée / Monsieur le Député,

Je me permets de vous adresser le communiqué de presse intersyndical ci-joint concernant la réforme de la prise en charge des fauteuils roulants par l’Assurance Maladie.

Bien que cette réforme soit attendue et nécessaire, sa mise en œuvre dans sa forme actuelle soulève de graves inquiétudes pour les usagers et les acteurs économiques de la filière, comme détaillé dans le communiqué.

Vous pouvez consulter le communiqué via le lien suivant :
https://www.fedepsad.fr/communiques/FEDEPSAD_1733156492_2024%2012%2002_CP%20VPH%20intersyndical%20VD.pdf

Nous vous remercions de l’attention que vous porterez à ces enjeux majeurs et restons disponibles pour échanger si nécessaire.

Avec mes salutations respectueuses,
                `);
            
                // Créer le lien mailto et rediriger l'utilisateur
                if (email) {
                    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
                }
            });
        } else {
            emailContainer.style.display = 'none';
            emailButton.style.display = 'none';
        }
    });
});
