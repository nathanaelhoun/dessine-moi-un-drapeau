# Dessine-moi-un-drapeau

Robot pour dessiner un motif sur le drapeau du DirtyBiologystan. Fièrement créé pour aider le [Désert de l'Est](https://jules-10.github.io/Desert-de-l-est/).

**À n'utiliser que sur une zone dont vous avez les droits !**

## Utilisation

Première fois :

1. Installe les dépendances avec `npm install` ([nodeJS v16 testé uniquement](https://nodejs.org/))
2. Crée le fichier `./data/image-colors.json`, au format ressorti par [le programme de @STM3900](https://github.com/STM3900/imgAnalyser).
   ```json
   [
     {
       "#d09e3c": ["x1:y1", "x2:y2"],
       "#bababa": ["x3:y3"]
       // ...
     }
   ]
   ```
3. Récupérer les données avec `npm run initialize` (pour éviter des requêtes et alléger le serveur) (sur Windows, exécuter les trois fichiers dans le dossier `./initialize` avec `node initialize/nom-du-fichier.js`)
4. Créer un fichier `.env.json` avec la structure suivante :
   ```json
   {
     "tokens": ["token_drapeau"]
   }
   ```

Ensuite :

1. Lancer `npm run update-data` pour mettre à jour les métadonnées de ta zone du drapeau
2. Lancer le script avec `npm start` et admirer !
