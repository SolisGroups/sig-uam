# 📱 Configuration PWA - SIG Web UAM

## 🎯 Qu'est-ce qu'une PWA ?

Une Progressive Web App (PWA) est une application web qui peut être installée sur un appareil mobile ou desktop et fonctionner comme une application native, même hors ligne.

## ✅ Fichiers PWA ajoutés

Voici les fichiers qui ont été créés pour transformer votre application en PWA :

### 1. **manifest.json**
- Fichier de configuration principal de la PWA
- Définit le nom, les icônes, les couleurs et le comportement de l'app
- Localisation : `/sigweb-uam/manifest.json`

### 2. **sw.js** (Service Worker)
- Gère le cache et le fonctionnement hors ligne
- Intercepte les requêtes réseau
- Localisation : `/sigweb-uam/sw.js`

### 3. **generate-icons.html**
- Outil pour générer automatiquement les icônes PWA
- Basé sur votre logo existant (img/uam.jpg)
- Localisation : `/sigweb-uam/generate-icons.html`

### 4. **index.html** (modifié)
- Ajout des balises meta PWA
- Liens vers le manifest et les icônes
- Script d'enregistrement du Service Worker

## 🚀 Instructions d'installation

### Étape 1 : Générer les icônes

1. Ouvrez votre navigateur et accédez à :
   ```
   http://localhost:8080/sigweb-uam/generate-icons.html
   ```

2. Les icônes seront générées automatiquement à partir de votre logo

3. Téléchargez chaque icône en cliquant sur le bouton "⬇️ Télécharger" sous chaque icône

4. Placez toutes les icônes dans le dossier :
   ```
   img/icons/
   ```

Les icônes nécessaires sont :
- icon-72x72.png
- icon-96x96.png
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- icon-192x192.png
- icon-384x384.png
- icon-512x512.png

### Étape 2 : Tester la PWA en local

1. Démarrez votre serveur XAMPP

2. Accédez à l'application via HTTPS (obligatoire pour les PWA) :
   ```
   https://localhost:8443/sigweb-uam/
   ```

   ⚠️ **Important** : Les Service Workers ne fonctionnent qu'en HTTPS (sauf sur localhost)

3. Ouvrez les DevTools (F12) et vérifiez :
   - Console : Vous devriez voir "✅ Service Worker enregistré avec succès"
   - Application → Service Workers : Votre SW doit être actif
   - Application → Manifest : Vérifiez que le manifest est bien chargé

### Étape 3 : Installer l'application

#### Sur Chrome/Edge (Desktop) :
1. Ouvrez l'application dans Chrome
2. Cliquez sur l'icône d'installation (➕) dans la barre d'adresse
3. Ou cliquez sur le bouton "Installer l'App" dans la navigation
4. Confirmez l'installation

#### Sur Android :
1. Ouvrez l'application dans Chrome
2. Appuyez sur le menu (⋮)
3. Sélectionnez "Installer l'application" ou "Ajouter à l'écran d'accueil"
4. Confirmez l'installation

#### Sur iOS/Safari :
1. Ouvrez l'application dans Safari
2. Appuyez sur l'icône de partage (□↑)
3. Sélectionnez "Sur l'écran d'accueil"
4. Nommez l'application et confirmez

## 🌐 Déploiement sur GitHub Pages

### Configuration pour GitHub Pages

1. **Créez un repository GitHub** pour votre projet

2. **Modifiez les chemins dans les fichiers** :

   Dans `manifest.json`, changez :
   ```json
   "start_url": "/sigweb-uam/index.html",
   "scope": "/sigweb-uam/",
   ```

   Par (remplacez `VOTRE-USERNAME` et `VOTRE-REPO`) :
   ```json
   "start_url": "/VOTRE-REPO/index.html",
   "scope": "/VOTRE-REPO/",
   ```

   Dans `index.html`, changez :
   ```javascript
   navigator.serviceWorker.register('/sigweb-uam/sw.js')
   ```

   Par :
   ```javascript
   navigator.serviceWorker.register('/VOTRE-REPO/sw.js')
   ```

   Dans `sw.js`, changez tous les chemins `/sigweb-uam/` par `/VOTRE-REPO/`

3. **Poussez votre code sur GitHub** :
   ```bash
   git init
   git add .
   git commit -m "Initial commit - PWA SIG Web UAM"
   git branch -M main
   git remote add origin https://github.com/VOTRE-USERNAME/VOTRE-REPO.git
   git push -u origin main
   ```

4. **Activez GitHub Pages** :
   - Allez dans Settings → Pages
   - Source : Sélectionnez la branche `main` et le dossier `/ (root)`
   - Cliquez sur Save

5. **Accédez à votre application** :
   ```
   https://VOTRE-USERNAME.github.io/VOTRE-REPO/
   ```

### Pour un domaine personnalisé

Si vous avez un nom de domaine personnalisé :

1. Dans les paramètres GitHub Pages, ajoutez votre domaine personnalisé

2. Modifiez les chemins pour utiliser des chemins relatifs :

   Dans `manifest.json` :
   ```json
   "start_url": "./index.html",
   "scope": "./",
   ```

   Dans `index.html` :
   ```javascript
   navigator.serviceWorker.register('./sw.js')
   ```

   Dans `sw.js` :
   ```javascript
   const urlsToCache = [
     './',
     './index.html',
     './css/styles.css',
     // etc.
   ];
   ```

## 🔧 Personnalisation

### Changer les couleurs de la PWA

Dans `manifest.json` :
```json
"background_color": "#2c3e50",  // Couleur de fond au démarrage
"theme_color": "#3498db"         // Couleur de la barre d'adresse mobile
```

### Ajouter des captures d'écran

Les captures d'écran s'affichent dans la page d'installation de la PWA :

1. Créez le dossier `img/screenshots/`

2. Ajoutez vos captures d'écran :
   - `desktop-screenshot.png` (1280x720px minimum)
   - `mobile-screenshot.png` (540x720px minimum)

### Mode d'affichage

Dans `manifest.json`, vous pouvez changer le mode d'affichage :

```json
"display": "standalone"  // Options: standalone, fullscreen, minimal-ui, browser
```

- `standalone` : Comme une app native (recommandé)
- `fullscreen` : Plein écran sans barre de navigation
- `minimal-ui` : Barre minimale avec boutons navigation
- `browser` : Dans le navigateur normal

## 📊 Vérification et Debug

### Tester le manifest
1. DevTools → Application → Manifest
2. Vérifiez que toutes les propriétés sont correctes

### Tester le Service Worker
1. DevTools → Application → Service Workers
2. Vérifiez qu'il est "activated and running"

### Tester le cache
1. DevTools → Application → Cache Storage
2. Vérifiez que les fichiers sont bien mis en cache

### Tester le mode hors ligne
1. DevTools → Network
2. Cochez "Offline"
3. Rechargez la page
4. L'application devrait fonctionner hors ligne

### Lighthouse Audit
1. DevTools → Lighthouse
2. Sélectionnez "Progressive Web App"
3. Cliquez sur "Generate report"
4. Corrigez les problèmes signalés

## 🔒 Sécurité et Bonnes Pratiques

### HTTPS obligatoire
- Les Service Workers ne fonctionnent qu'en HTTPS
- Utilisez un certificat SSL valide pour la production
- GitHub Pages fournit automatiquement HTTPS

### Mise à jour du cache
Quand vous modifiez votre application :
1. Changez la version du cache dans `sw.js` :
   ```javascript
   const CACHE_VERSION = 'v1.0.1'; // Incrémentez la version
   ```
2. Le Service Worker supprimera automatiquement l'ancien cache

### Performance
- Les fichiers critiques sont mis en cache au premier chargement
- Les données GeoJSON utilisent une stratégie "Network First"
- Les autres ressources utilisent "Cache First"

## 📱 Compatibilité

### Navigateurs supportés
- ✅ Chrome/Edge 67+
- ✅ Firefox 79+
- ✅ Safari 15.4+ (iOS/macOS)
- ✅ Opera 54+
- ✅ Samsung Internet 9.2+

### Fonctionnalités par plateforme

| Fonctionnalité | Android | iOS | Desktop |
|----------------|---------|-----|---------|
| Installation PWA | ✅ | ✅ | ✅ |
| Mode hors ligne | ✅ | ✅ | ✅ |
| Notifications Push | ✅ | ❌ | ✅ |
| Badge d'app | ✅ | ❌ | ✅ |
| Écran d'accueil | ✅ | ✅ | ✅ |

## 🆘 Dépannage

### Le Service Worker ne s'enregistre pas
- Vérifiez que vous êtes en HTTPS
- Vérifiez les chemins dans le code
- Regardez la console pour les erreurs

### Les icônes ne s'affichent pas
- Vérifiez que les icônes sont dans `img/icons/`
- Vérifiez les chemins dans `manifest.json`
- Videz le cache et rechargez

### L'app ne fonctionne pas hors ligne
- Vérifiez que le Service Worker est actif
- Vérifiez les fichiers en cache dans DevTools
- Incrémentez la version du cache

### Le bouton d'installation n'apparaît pas
- Vérifiez que le manifest est valide
- L'app doit être servie en HTTPS
- Certains navigateurs ont des critères spécifiques

## 📚 Ressources supplémentaires

- [MDN - Progressive Web Apps](https://developer.mozilla.org/fr/docs/Web/Progressive_web_apps)
- [Google Web.dev - PWA](https://web.dev/progressive-web-apps/)
- [PWA Builder](https://www.pwabuilder.com/)
- [Manifest Generator](https://app-manifest.firebaseapp.com/)

## ✨ Fonctionnalités PWA de votre application

Votre application SIG Web UAM en mode PWA offre :

- 📱 **Installation** sur mobile et desktop
- 🔌 **Fonctionnement hors ligne** (carte et données mises en cache)
- ⚡ **Chargement rapide** grâce au cache
- 🎨 **Interface native** (pas de barre d'adresse)
- 🔄 **Mises à jour automatiques** du contenu
- 💾 **Économie de bande passante** (cache intelligent)
- 🚀 **Performance optimale**

---

**Créé pour SIG Web UAM - Université Adventiste de Mudende**

*Pour toute question ou assistance, consultez la documentation ci-dessus.*
