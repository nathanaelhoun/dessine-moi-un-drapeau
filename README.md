# Dessine-moi-un-drapeau

Robot pour dessiner un motif sur le drapeau du DirtyBiologystan. Fièrement créé pour aider le [Désert de l'Est](https://jules-10.github.io/Desert-de-l-est/).

**À n'utiliser que sur une zone dont vous avez les droits !**

## Utilisation

Première fois :

1. Installe les dépendances avec `npm install` ([nodeJS v16 testé uniquement](https://nodejs.org/))
2. Personnalise le script `initialize/1-update-pixel-list.js` pour récupérer les pixels de la bonne zone (utilise [l'API de CoDaTi](https://codati.ovh/), merci à lui !)
3. Récupérer les données avec `npm run initialize` (pour éviter des requêtes et alléger le serveur)
4. Créer un fichier `.env.json` avec la structure suivante :
   ```json
   {
   	"tokens": ["token_drapeau"]
   }
   ```

Ensuite :

1. Lancer `npm run update-data` pour mettre à jour les métadonnées de ta zone du drapeau
2. Lancer le script avec `npm start` et admirer !
