# Guide Installation APK Android sans Google Play

## 📱 Vue d'ensemble

Cette application SIG est une Progressive Web App (PWA) qui peut être installée sur Android de plusieurs façons :

1. **Installation directe via PWA** (Recommandé)
2. **Installation via APK personnalisé**
3. **Installation via Progressive Web App Web+**

---

## 🚀 Méthode 1 : Installation PWA directe (Recommandé)

### Sur Android Chrome/Edge

1. **Ouvrir l'application dans le navigateur**
   - Accédez à: `http://votre-serveur/sigweb-uam/index.html`

2. **Installer l'application**
   - Chrome détectera automatiquement qu'il s'agit d'une PWA
   - Un bouton d'installation apparaîtra en haut à droite (icône de téléchargement)
   - Appuyez sur "Installer" ou "Ajouter à l'écran d'accueil"

3. **Autoriser les permissions**
   - La première fois, autorisez l'accès à:
     - Stockage local
     - Localisation GPS
     - Caméra (si utilisée)

### Avantages

✅ Mise à jour automatique
✅ Accès hors ligne
✅ Moins d'espace disque
✅ Pas d'accord Google Play
✅ Lancée comme app native

---

## 🎯 Méthode 2 : Générer un APK personnalisé

### Avec Pwabuilder.com (le plus simple)

**Étape 1: Préparer votre PWA**

```bash
# S'assurer que tous les fichiers sont corrects:
- manifest.json (✓ configuré)
- service worker (✓ sw.js)
- icônes (✓ img/icons/)
- https activé (recommandé)
```

**Étape 2: Générer l'APK**

1. Allez sur <https://www.pwabuilder.com>
2. Entrez l'URL: `http://votre-domaine/sigweb-uam/index.html`
3. Cliquez sur "Start"
4. Attendez l'analyse de la PWA
5. Cliquez sur "Package for stores" en bas
6. Sélectionnez "Generate APK" pour Android
7. Téléchargez le fichier APK

**Étape 3: Installer sur Android**

```bash
# Via ADB (Android Debug Bridge)
adb install app-release.apk

# Ou transférez le fichier APK sur votre téléphone
# et double-cliquez pour installer
```

### Avec Bubblewrap (approche avancée)

```bash
# Installer les dépendances
npm install -g @bubblewrap/cli

# Initialiser le projet
bubblewrap init \
  --manifest "http://votre-domaine/sigweb-uam/manifest.json" \
  --packageId "com.sguam.web"

# Générer l'APK
bubblewrap build

# L'APK est généré dans: ./dist/app-release.apk
```

---

## 📋 Prérequis pour une bonne PWA sur Android

### ✅ Manifest.json

```json
{
  "name": "SIG Web UAM - Cartographie Interactive",
  "short_name": "SIG UAM",
  "display": "standalone",
  "orientation": "any",
  "start_url": "/sigweb-uam/index.html",
  "scope": "/sigweb-uam/",
  "theme_color": "#3498db",
  "background_color": "#2c3e50",
  "icons": [
    {
      "src": "img/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "img/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ]
}
```

### ✅ Service Worker (sw.js)

- ✓ Déjà configuré pour le cache
- ✓ Support offline
- ✓ Gestion des données GeoJSON

### ✅ Métadonnées HTML

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="theme-color" content="#3498db">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<link rel="manifest" href="manifest.json">
<link rel="icon" href="img/icons/icon-192x192.png">
```

---

## 🗺️ Caractéristiques Géolocalisation

### Localisation unique

- Cliquez sur "Localiser" pour obtenir votre position actuelle
- Affiche la précision (rayon en mètres)
- Centre automatiquement la carte

### Suivi GPS continu

- Cliquez sur "Suivi GPS" pour enregistrer votre trajet
- Affiche:
  - Position en temps réel
  - Cercle de précision
  - Trajet tracé en rouge
  - Vitesse et direction

### Export du trajet

- Exporte en format GeoJSON
- Compatible avec:
  - QGIS
  - ArcGIS
  - Google Earth
  - Leaflet

### Statistiques

- Distance totale parcourue
- Durée du trajet
- Nombre de points enregistrés
- Précision moyenne

---

## 🔧 Configuration Android

### Activer le mode développeur

1. Paramètres > À propos du téléphone
2. Appuyer 7 fois sur "Numéro de build"
3. Retour aux paramètres > Options de développement
4. Activer "Débogage USB"

### Installer via ADB

```bash
# Lister les appareils connectés
adb devices

# Installer l'APK
adb install -r chemin/vers/app.apk

# Lancer l'app
adb shell am start -n com.sguam.web/.MainActivity

# Voir les logs
adb logcat | grep sguam
```

---

## 🌐 Hébergement recommandé

### Important: HTTPS fortement recommandé

- Certains navigateurs refusent la PWA en HTTP
- Letsencrypt offre des certificats gratuits

```bash
# Générer certificat Letsencrypt
sudo certbot certonly --standalone -d votre-domaine.com

# NGINX configuration
server {
    listen 443 ssl http2;
    server_name votre-domaine.com;
    
    ssl_certificate /etc/letsencrypt/live/votre-domaine.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/votre-domaine.com/privkey.pem;
    
    location /sigweb-uam/ {
        root /var/www;
        try_files $uri $uri/ =404;
    }
}
```

---

## 🔐 Permissions Android pour PWA

### Dans manifest.json

```json
"permissions": [
  "geolocation",
  "storage",
  "camera",
  "microphone"
]
```

### À la première utilisation

L'application demande les permissions nécessaires:

- ✓ Localisation GPS
- ✓ Stockage local
- ✓ Autres selon les besoins

---

## 📊 Vérifier l'installation

### Tester la PWA

```bash
# Vérifier le manifest
curl http://votre-domaine/sigweb-uam/manifest.json

# Tester le service worker
curl http://votre-domaine/sigweb-uam/sw.js

# Vérifier HTTPS
curl -I https://votre-domaine/sigweb-uam/
```

### Utiliser Lighthouse (Chrome DevTools)

1. Ouvrir Chrome DevTools (F12)
2. Aller à "Lighthouse"
3. Cliquer "Generate PWA Report"
4. Vérifier les critères

---

## 🐛 Dépannage

### L'app ne s'installe pas

- ✓ Vérifiez que manifest.json est accessible
- ✓ Vérifiez le service worker (sw.js)
- ✓ Utilisez HTTPS si possible
- ✓ Videz le cache du navigateur

### La géolocalisation ne marche pas

- ✓ Vérifiez que le GPS est activé
- ✓ Autorisez la localisation pour l'app
- ✓ Attendez la connexion au satellite (30s)
- ✓ Vérifiez les logs: F12 > Console

### L'app freeze ou crash

- ✓ Videz le cache (Paramètres > Stockage)
- ✓ Réinstallez l'application
- ✓ Vérifiez les logs en F12

---

## 📱 Installation complète pas à pas

### Étape 1: Via navigateur mobile

```
URL: http://192.168.x.x/sigweb-uam/
(ou http://votre-domaine.com/sigweb-uam/)
```

### Étape 2: Menu du navigateur

```
Chrome: Menu > "Installer l'app"
Edge: Menu > "Installer cette app"
```

### Étape 3: Confirmation

```
Appuyer sur "Installer"
L'app s'ajoute à l'écran d'accueil
```

### Étape 4: Lancer l'app

```
Appuyer sur l'icône "SIG UAM" sur l'écran d'accueil
L'app se lance en mode fullscreen
```

---

## 🎨 Personnalisation de l'APK

Pour personnaliser l'APK généré:

1. **Icône de l'app**: `img/icons/icon-512x512.png`
2. **Couleur du thème**: `manifest.json` > `theme_color`
3. **Fond d'écran**: `manifest.json` > `background_color`
4. **Nom de l'app**: `manifest.json` > `name` et `short_name`

---

## 📞 Support

Pour toute question sur:

- **PWA Installation**: Voir Lighthouse dans Chrome DevTools
- **Géolocalisation**: Vérifier paramètres > Localisation
- **APK Custom**: Consulter <https://pwabuilder.com/docs>

---

**Version**: 1.0  
**Dernière mise à jour**: 28 janvier 2026  
**Auteur**: SIG Web UAM
