<template>
    <div>
        <h2>Import des donnees</h2>
        <div>
            <label for="csv1">csv1 :</label>
            <input type="file" id="csv1" accept=".csv" :disabled="isImporting" @change="handleFile">
        </div>
        <div>
            <label for="csv2">csv2 :</label>
            <input type="file" id="csv2" accept=".csv" :disabled="isImporting" @change="handleFile">
        </div>
        <div>
            <label for="csv2">csv3 :</label>
            <input type="file" id="csv2" accept=".csv" :disabled="isImporting" @change="handleFile">
        </div>
        <button @click="startImport" :disabled="!pretPourImport || isImporting">Import</button>
    </div>
</template>

<script setup>
    import { reactive, ref } from 'vue'
    import Papa from 'papaparse'

    const isImporting = ref(false);
    const fichiersPrets = reactive({ produits: null, stock: null, commandes: null });
    const pretPourImport = ref(false);

    const startImport = async () => {
        isImporting.value = true; // On bloque les boutons
        console.log("🚀 Lancement de l'importation vers Prestashop...");
        
        try {
            // Pour l'instant on affiche juste ce qu'on va envoyer
            console.log("📦 Produits prêts :", fichiersPrets.produits.length);
            console.log("📦 Stocks prêts :", fichiersPrets.stock.length);
            console.log("📦 Commandes prêtes :", fichiersPrets.commandes.length);

            // C'est ici qu'on va faire appel à notre API
            // await ImportService.envoyerDonnees(fichiersPrets);

        } catch (error) {
            console.error("❌ Erreur pendant l'import :", error);
        } finally {
            isImporting.value = false; // On débloque à la fin
        }
    }

    const detecterTypeFichier = (colonnes) => {
        // Si la colonne 'date_availability_produit' est là, c'est forcement les produits
        if (colonnes.includes("date_availability_produit")) return "produits";
        
        // Si la colonne 'stock_initial' est là, c'est le fichier des stock/declinaisons
        if (colonnes.includes("stock_initial")) return "stock";
        
        // Si la colonne 'email' est là, c'est les commandes/clients
        if (colonnes.includes("email")) return "commandes";
        
        return "inconnu";
    }

    const handleFile = (event) => {
        const file = event.target.files[0];
        console.log("Fichier selectionne :",file);

        //utilise papaparse pour lire les fichier
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const data = results.data;
                const colonnes = results.meta.fields;
                console.log("Colonnes trouvées :", colonnes);
                console.log("Données :", data);

                // On appelle notre fonction de validation
                verifierDonnees(data, colonnes);
            }
        })
    }

    const verifierDonnees= (data, colonne) => {
        let erreurs = []; 
        const typeCsv = detecterTypeFichier(colonne);
        //verifier les noms des colonnes
        let colonneAttendu = [];
        // Selon le type de fichier, on vérifie différentes colonnes
        if (typeCsv === "produits") {
            colonneAttendu = ["date_availability_produit", "nom", "reference", "prix_ttc", "Taxe", "categorie", "prix_achat"];
        } else if (typeCsv === "stock") {
            colonneAttendu = ["reference", "specificité", "karazany", "stock_initial", "prix_vente_ttc"];
        } else if (typeCsv === "commandes") {
            colonneAttendu = ["date", "nom", "email", "pwd", "adresse", "achat", "etat"];
        } else {
            erreurs.push("Type de fichier non reconnu.");
        }

        data.forEach((ligne,index) => {
            const numLigne = index + 1;  // +1 car l'index commence à 0
            
            //verfier format de date DD//MM//YYYY
            //expression reguliere regex
            const regexDate = /^\d{2}\/\d{2}\/\d{4}$/;
            if(ligne.date_avalability_produit && !regexDate.test(ligne.date_availability_produit)){
                erreurs.push(`Ligne ${numLigne} : La date "${ligne.date_availability_produit}" n'est pas au format DD/MM/YYYY`);
            }

            //verifier montant positif
            if(ligne.prix_ttc){
                const prix = parseFloat(ligne.prix_ttc.replace(',' , '.'));
                if(prix < 0){
                    erreurs.push(`Ligne ${numLigne} : Le prix = (${ligne.prix_ttc}) est negatif`);
                }
            }
        });

        if(erreurs.length > 0){
            console.error("⚠️ Des erreurs ont été trouvées :", erreurs);

        } else {
            console.log("✅ Les données sont conformes !");
            //on sauvegarde les donnes en memoire d abord
            if(typeCsv !== "inconnu"){
                fichiersPrets[typeCsv] = data;
            }
            // On vérifie si les 3 fichiers obligatoires sont chargés
            if (fichiersPrets.produits && fichiersPrets.stock && fichiersPrets.commandes) {
                 pretPourImport.value = true;
                 console.log("🚀 Les 3 fichiers sont prêts, vous pouvez lancer l'import !");
            }
        }
    }
</script>