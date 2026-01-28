# 🚀 Guide Rapide - Installation Mobile (Android)

## ⚡ Installation en 3 minutes

### Méthode 1: PWA (Application Web Installable) - ⭐ RECOMMANDÉE

**Sur votre téléphone Android:**

1. **Ouvrir Chrome ou Edge**
   - Aller à: `http://192.168.x.x/sigweb-uam/`
   - Ou votre domaine: `http://sigweb.com/`

2. **Installer l'app**
   - Icône ⬇️ en haut à droite > "Installer l'app"
   - Ou Menu 3 barres > "Installer l'app"

3. **Valider**
   - Appuyer sur "Installer"
   - L'app s'ajoute automatiquement à l'écran d'accueil

4. **C'est fait!** 🎉
   - Icône "SIG UAM" est maintenant sur votre écran

---

## 🗺️ Utiliser la Géolocalisation

### 1️⃣ Localisation unique

```
Cliquez sur: "📍 Localiser"
- Affiche votre position exacte
- Précision en mètres
- Carte centrée sur vous
```

### 2️⃣ Suivi GPS continu (Enregistrement de trajet)

```
Cliquez sur: "🗺️ Suivi GPS"
- Lance l'enregistrement
- Trace votre route en rouge
- Affiche vitesse + direction en temps réel
```

### 3️⃣ Arrêter et exporter

```
Cliquez sur: "⬇️ Exporter"
- Télécharge votre trajet en format GeoJSON
- Compatible QGIS, Google Earth, ArcGIS
```

---

## 📊 Informations affichées

```
📍 Latitude: 14.514567
   Longitude: -14.575890
📏 Précision: ±15m

🚗 Vitesse: 25.5 km/h
🧭 Direction: 145°
⏱️ Depuis le démarrage: 15 minutes
🛣️ Distance parcourue: 6.35 km
```

---

## 🔧 Préalable: Activer le GPS

1. **Paramètres > Localisation**
2. Activer "Localisation"
3. Sélectionner "Précision élevée"
4. Autoriser l'app à accéder au GPS

---

## 💾 Fonctionnalités Hors-Ligne

L'app fonctionne **sans internet** après installation:

- ✅ Toutes les cartes disponibles
- ✅ Couches géographiques (routes, bâtiments, etc.)
- ✅ Outils de mesure
- ✅ GPS local (pas besoin de données)
- ⚠️ Certaines images satellite nécessitent internet

---

## 🎯 Astuces Mobiles

### Écran tactile

- **Pincer/Écarter**: Zoom avant/arrière
- **Double clic**: Zoom rapide
- **Clic long**: Obtenir les propriétés du lieu

### Accédez au menu

- Cliquez sur la **couche** (bas-gauche) pour voir toutes les couches
- Cliquez sur la **légende** (bas-droit) pour voir les symboles

### Imprimer

- Menu **⋯** > Imprimer
- Sélectionner orientation Portrait/Paysage
- Exporter en PDF

---

## 🆘 Problèmes courants

### "L'app n'apparaît pas à l'installation"

**Solution:**

- Videz le cache: Paramètres > Apps > Chrome > Forcer l'arrêt
- Relancez Chrome
- Réessayez l'installation

### "La géolocalisation ne marche pas"

**Solution:**

- ✓ Paramètres > Localisation > Activé
- ✓ Mode "Haute précision" sélectionné
- ✓ Attendez 30 secondes pour la première connexion GPS
- ✓ Appuyez de nouveau sur "Localiser"

### "La carte est vide"

**Solution:**

- Attendez le chargement (image de chargement visible)
- Utilisez les boutons Zoom +/- (en haut à gauche)
- Si hors ligne: seules les cartes mises en cache s'affichent

### "Espace disque insuffisant"

**Solution:**

- Minimum 50 MB requis
- Libérez de l'espace: Paramètres > Stockage

---

## 🔐 Permissions demandées

À l'ouverture, l'app demande:

- **Localisation**: Pour le GPS et la géolocalisation
- **Stockage**: Pour les données offline
- **Notifications**: Pour les alertes

Appuyez sur **"Accepter"** pour autoriser.

---

## 📲 Accès rapide

### Depuis le navigateur directement

```
URL: http://192.168.1.100:8080/sigweb-uam/
     (remplacer l'IP par celle de votre serveur)
```

### Depuis l'app installée

- Appuyez sur l'icône "SIG UAM" sur l'écran d'accueil
- Elle se lance en mode **fullscreen** (sans barres de navigation)

---

## 💡 Pour aller plus loin

### Partager votre trajet

1. Exportez en GeoJSON (bouton Exporter)
2. Partagez le fichier par:
   - Email
   - WhatsApp
   - Google Drive
   - Autre app

### Fusionner plusieurs trajets

- Importez plusieurs fichiers GeoJSON dans QGIS
- Fusionnez avec "Merge shapefiles"

### Générer un rapport

- Exportez en GeoJSON
- Ouvrez dans QGIS
- Générez une carte/rapport PDF

---

## 🌐 Hébergement

L'app doit être accessible à:

```
http://ip-serveur/sigweb-uam/
ou
https://votre-domaine.com/sigweb-uam/
```

**Important**: HTTPS est recommandé pour une meilleure compatibilité.

---

**Besoin d'aide?** Consultez le guide complet: `INSTALLATION-ANDROID.md`
