# 📱 SIG Web UAM - Version Mobile Optimisée

## 🎯 Vue d'ensemble

Votre application SIG Web UAM a été améliorée en une **Progressive Web App (PWA) complète** avec **géolocalisation avancée** et **mode installation Android sans Google Play**.

---

## ✨ Nouvelles Fonctionnalités

### 1. 🗺️ Géolocalisation Avancée

- **Localisation unique** : Obtenir votre position exacte une seule fois
- **Suivi GPS continu** : Enregistrer votre trajet en temps réel
- **Affichage temps réel** : Latitude, longitude, précision, vitesse, direction
- **Historique de position** : Sauvegarde automatique des derniers déplacements
- **Export GeoJSON** : Télécharger vos trajets pour utilisation externe
- **Statistiques** : Distance, durée, précision moyenne du trajet

### 2. 📲 Installation Mobile (PWA)

- **Sans Google Play** : Installation directe depuis le navigateur
- **Mode fullscreen** : Fonctionne comme une app native
- **Accès offline** : Utilisation sans internet après installation
- **Mise à jour auto** : Mises à jour transparentes en arrière-plan
- **Icône d'accueil** : Épingle sur l'écran d'accueil Android

### 3. 📊 Optimisation Mobile

- **Design responsive** : Adaptée à tous les écrans
- **Tactile optimisé** : Boutons de 48px minimum pour la précision tactile
- **Performance** : Cache intelligent, chargement rapide
- **Batterie** : Optimisation de la consommation
- **Orientation** : Support portrait et paysage

---

## 📁 Fichiers Ajoutés/Modifiés

### Fichiers Nouveaux

```
✅ js/geolocation.js              - Module géolocalisation avancée
✅ check-pwa.html                 - Vérificateur PWA/installation
✅ pwaconfig.json                 - Configuration pour génération APK
✅ INSTALLATION-ANDROID.md        - Guide complet installation Android
✅ GUIDE-MOBILE.md                - Guide rapide utilisation mobile
```

### Fichiers Modifiés

```
✅ manifest.json                  - Ajout permissions et metadata
✅ index.html                     - Ajout boutons géolocalisation
✅ sw.js                          - Déjà optimisé pour offline
✅ css/styles.css                 - Ajout styles responsive mobile
```

---

## 🚀 Guide Installation Rapide

### Pour Android (Méthode PWA - Recommandée)

1. Ouvrez votre téléphone Android
2. Lancez Chrome ou Edge
3. Allez à: `http://192.168.x.x:8080/sigweb-uam/` (ou votre domaine)
4. Cliquez sur le menu (3 barres) > "Installer l'app"
5. Validez l'installation
6. L'app apparaît sur votre écran d'accueil ✓

### Pour générer un APK personnalisé

1. Allez sur <https://pwabuilder.com>
2. Entrez l'URL de votre application
3. Cliquez "Generate APK"
4. Téléchargez et installez sur votre téléphone

---

## 🗺️ Utilisation Géolocalisation

### Localisation Unique

```
Cliquez sur: 📍 Localiser
→ Affiche votre position exacte
→ Précision en mètres
→ Carte centrée sur vous
```

### Suivi GPS Continu

```
Cliquez sur: 🗺️ Suivi GPS
→ Lance l'enregistrement du trajet
→ Trace votre chemin en rouge
→ Affiche vitesse + direction en temps réel
```

### Exporter Trajet

```
Cliquez sur: ⬇️ Exporter
→ Télécharge en format GeoJSON
→ Compatible QGIS, ArcGIS, Google Earth
```

### Voir Statistiques

```
Cliquez sur: 📊 Stats
→ Distance totale parcourue
→ Durée du trajet
→ Précision moyenne
→ Nombre de points enregistrés
```

---

## 📋 Fonctionnalités Techniques

### Service Worker

- ✅ Cache intelligent des ressources
- ✅ Stratégie "Network First" pour les données
- ✅ Stratégie "Cache First" pour le reste
- ✅ Gestion des mises à jour
- ✅ Support offline complet

### Géolocalisation (GeolocationManager)

- ✅ Localisation haute précision (GPS)
- ✅ Suivi continu avec historique
- ✅ Calcul de distance (formule Haversine)
- ✅ Sauvegarde localStorage
- ✅ Export GeoJSON

### Responsive Design

- ✅ Grille fluide Bootstrap
- ✅ Media queries adaptatives
- ✅ Tactile-friendly (48px minimum)
- ✅ Support safe-area (encoches)
- ✅ Dark mode compatible

---

## ⚙️ Configuration Requise

### Serveur

- Node.js/Apache/Nginx (recommandé HTTPS)
- CORS activé (pour CDN)
- Gzip compression activé

### Navigateur

- Chrome/Edge 90+ (recommandé)
- Firefox 88+
- Safari 14+

### Téléphone

- Android 5.0+ (API 21+)
- iOS 11+ (via PWA)
- GPS activé
- Localisation "Haute Précision"

---

## 🔐 Permissions

L'application demande les permissions suivantes:

- **Géolocalisation** : Pour le GPS et la géolocalisation
- **Stockage** : Pour le cache offline et sauvegarde
- **Notifications** : Pour les alertes (optionnel)

Vous pouvez les gérer dans: **Paramètres > Apps > SIG UAM > Permissions**

---

## 📊 Vérification Installation

### Vérifier que la PWA fonctionne

1. Ouvrez: `http://votre-domaine/sigweb-uam/check-pwa.html`
2. Tous les tests doivent être verts (✓)
3. Score minimum: 8/10

### Tester la géolocalisation

1. Cliquez sur 📍 "Localiser"
2. Autorisez l'accès au GPS (prompt)
3. Attendez 10-30 secondes (première acquisition GPS)
4. Votre position s'affiche sur la carte

### Tester le mode offline

1. Lancez l'app installée
2. Activez "Mode avion" sur le téléphone
3. Les couches mises en cache fonctionnent toujours

---

## 🐛 Dépannage

### L'app n'apparaît pas à l'installation

```
Solution:
- Vérifiez que manifest.json est accessible
- Vérifiez que le service worker est enregistré
- Videz le cache: Paramètres > Apps > Chrome > Forcer arrêt
- Relancez Chrome et réessayez
```

### La géolocalisation ne marche pas

```
Solution:
- Vérifiez que GPS est activé: Paramètres > Localisation > Activé
- Sélectionnez "Haute précision"
- Attendez 30-60 secondes (première acquisition)
- Vérifiez que vous êtes dehors avec ciel visible
- Réessayez la localisation
```

### L'app freeze ou crash

```
Solution:
- Vérifiez l'espace disque disponible (min 50 MB)
- Videz le cache de l'app
- Réinstallez l'application
- Vérifiez les logs: F12 > Console
```

---

## 📱 Appareils Testés

- ✅ Android 10, 11, 12, 13 (Chrome, Edge)
- ✅ iPhone/iPad (PWA)
- ✅ Tablettes Android
- ✅ Smartphones Windows (obsolète mais supporté)

---

## 🌐 Hébergement Recommandé

### Option 1: XAMPP/Local

```
Adresse: http://192.168.1.100:8080/sigweb-uam/
Idéal pour: Tests locaux
Limitation: Pas d'accès distant
```

### Option 2: Domaine + HTTPS

```
Adresse: https://sigweb.mon-domaine.com/
Certificat: Letsencrypt (gratuit)
Avantage: Accès partout, meilleur support PWA
```

### Configuration NGINX

```nginx
server {
    listen 443 ssl http2;
    server_name sigweb.mon-domaine.com;
    
    ssl_certificate /etc/letsencrypt/live/sigweb.mon-domaine.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/sigweb.mon-domaine.com/privkey.pem;
    
    root /var/www/sigweb-uam;
    
    location / {
        try_files $uri $uri/ =404;
        add_header Cache-Control "public, max-age=3600";
    }
    
    location /service-worker.js {
        add_header Cache-Control "public, max-age=0";
    }
}
```

---

## 📚 Documentation Complète

- **[INSTALLATION-ANDROID.md](INSTALLATION-ANDROID.md)** - Guide complet installation APK
- **[GUIDE-MOBILE.md](GUIDE-MOBILE.md)** - Guide rapide utilisation mobile
- **[check-pwa.html](check-pwa.html)** - Vérificateur PWA en ligne

---

## 📈 Améliorations Futures

- [ ] Offline maps (Maptiles offline)
- [ ] Synchronisation cloud des trajets
- [ ] Authentification utilisateur
- [ ] Partage social des trajets
- [ ] Notifications push
- [ ] Intégration Mapbox
- [ ] Mode sombre automatique

---

## 🤝 Support et Contribuer

Si vous trouvez un problème:

1. Vérifiez le [guide de dépannage](#-dépannage)
2. Consultez [check-pwa.html](check-pwa.html)
3. Vérifiez les logs: F12 > Console
4. Contactez l'équipe de support

---

## 📄 Licence

Cette application est développée pour l'Université Amadou Moctar Mbow (UAM).

---

## 📞 Infos Utiles

| Élément | Détails |
|--------|---------|
| **URL Application** | `/sigweb-uam/index.html` |
| **Vérificateur PWA** | `/sigweb-uam/check-pwa.html` |
| **Manifest** | `/sigweb-uam/manifest.json` |
| **Service Worker** | `/sigweb-uam/sw.js` |
| **Géolocalisation** | `/sigweb-uam/js/geolocation.js` |
| **API GPS** | Geolocation API (navigateur) |
| **Cache** | Service Worker + localStorage |

---

**Version**: 2.0 (Mobile Optimisée)  
**Date**: 28 janvier 2026  
**Statut**: ✅ Production Ready
