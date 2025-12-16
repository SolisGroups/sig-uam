# 📱 Guide Mobile - SIG Web UAM

## 🎯 Fonctionnalités Mobiles Ajoutées

### ✅ Nouvelle Fonctionnalité GPS

- **Bouton GPS** dans la barre d'outils (icône verte avec croix de localisation)
- **Suivi en temps réel** de votre position
- **Précision affichée** avec cercle de précision
- **Activation/Désactivation** en un clic

### ✅ Affichage Responsive Corrigé

- **Mode Portrait** : Panneau de couches en haut, carte en bas
- **Mode Paysage** : Panneau de couches à gauche, carte à droite
- **Auto-ajustement** lors du changement d'orientation
- **Support tactile** optimisé

---

## 🚀 Comment Utiliser le GPS

### Activation du GPS

1. **Ouvrez l'application** sur votre smartphone
2. **Cliquez sur le bouton GPS** (icône verte avec croix)
3. **Autorisez l'accès** à votre position si demandé
4. **Attendez** que votre position soit trouvée (quelques secondes)

### Indicateurs Visuels

| État | Icône | Couleur | Description |
|------|-------|---------|-------------|
| Inactif | 🎯 | Vert (contour) | GPS désactivé |
| Recherche | ⏳ | Vert | Recherche en cours... |
| Actif | 📍 | Rouge (plein) | Position trouvée et suivie |

### Informations Affichées

Lorsque le GPS est actif, vous verrez :

- **Marqueur bleu** : Votre position exacte
- **Cercle bleu** : Zone de précision (rayon en mètres)
- **Popup** : Coordonnées GPS et précision

### Désactivation du GPS

- Cliquez à nouveau sur le bouton GPS (rouge)
- Le marqueur et le cercle disparaîtront
- Le bouton redeviendra vert

---

## 🔧 Résolution des Problèmes

### Problème 1 : La carte ne s'affiche pas

#### Symptômes

- Écran blanc ou gris à la place de la carte
- Seuls les boutons et le panneau sont visibles

#### Solutions

**Solution 1 : Rechargez la page**

```
Tirez vers le bas pour actualiser
ou
Fermez et rouvrez l'application
```

**Solution 2 : Vérifiez votre connexion**

- Assurez-vous d'avoir une connexion Internet active
- Le premier chargement nécessite Internet
- Après, l'app fonctionne hors ligne

**Solution 3 : Videz le cache**

1. Menu du navigateur → Paramètres
2. Confidentialité → Données de navigation
3. Cochez "Images et fichiers en cache"
4. Effacer les données
5. Rechargez l'application

**Solution 4 : Changez l'orientation**

- Passez en mode paysage
- Attendez 2 secondes
- Repassez en mode portrait

### Problème 2 : Le GPS ne fonctionne pas

#### Symptômes

- Message "Permission GPS refusée"
- Le GPS ne trouve pas votre position
- Le bouton reste en mode recherche

#### Solutions

**Solution 1 : Autorisez la géolocalisation**

**Sur Android (Chrome) :**

1. Paramètres du téléphone → Applications
2. Trouvez votre navigateur (Chrome, Firefox, etc.)
3. Autorisations → Localisation
4. Sélectionnez "Autoriser uniquement pendant l'utilisation"
5. Rechargez l'application

**Sur iOS (Safari) :**

1. Réglages → Confidentialité et sécurité
2. Service de localisation → Safari
3. Activez "Pendant l'utilisation de l'app"
4. Rechargez l'application

**Solution 2 : Activez le GPS du téléphone**

- Vérifiez que le GPS est activé dans les paramètres
- Activez la "Précision de localisation améliorée" si disponible

**Solution 3 : Testez en extérieur**

- Le GPS fonctionne mieux en extérieur
- Éloignez-vous des grands bâtiments
- Attendez quelques secondes pour l'acquisition satellite

**Solution 4 : Vérifiez les permissions dans le navigateur**

1. Cliquez sur le cadenas (🔒) dans la barre d'adresse
2. Vérifiez que "Localisation" est "Autorisée"
3. Si bloquée, changez en "Autoriser"
4. Rechargez la page

### Problème 3 : La carte est décalée ou mal alignée

#### Solution

```javascript
// La carte se recalibre automatiquement, mais vous pouvez :
1. Changez l'orientation de votre téléphone
2. Attendez 1 seconde
3. Revenez à l'orientation d'origine
```

### Problème 4 : Les couches ne s'affichent pas

#### Solutions

**Solution 1 : Vérifiez l'activation des couches**

- Ouvrez le panneau de couches (en haut sur mobile)
- Vérifiez que les cases sont cochées (vertes)
- Décochez puis recochez la couche

**Solution 2 : Rechargez les données**

- Fermez complètement l'application
- Videz le cache du navigateur
- Rouvrez l'application

**Solution 3 : Vérifiez le zoom**

- Certaines couches ne sont visibles qu'à certains niveaux de zoom
- Zoomez/dézoomez pour voir les couches

### Problème 5 : L'application est lente

#### Solutions

**Solution 1 : Désactivez les couches inutiles**

- Gardez seulement les couches nécessaires activées
- Moins de couches = meilleure performance

**Solution 2 : Fermez les autres applications**

- Libérez la mémoire de votre téléphone
- Fermez les onglets inutilisés

**Solution 3 : Rechargez l'application**

- Force la fermeture de l'app
- Rouvrez-la

### Problème 6 : Le GPS est imprécis

#### Causes possibles

- Signal GPS faible
- En intérieur ou dans un bâtiment
- Météo (nuages épais, orages)
- Téléphone en mode économie d'énergie

#### Solutions

- Sortez à l'extérieur
- Activez la "Haute précision" dans les paramètres GPS
- Désactivez le mode économie d'énergie
- Attendez quelques secondes pour améliorer la précision

---

## 📐 Modes d'Affichage Mobile

### Mode Portrait (Vertical)

```
┌─────────────────┐
│   Navigation    │
├─────────────────┤
│  Panneau des    │
│    Couches      │
│  (35% hauteur)  │
├─────────────────┤
│                 │
│     Carte       │
│  (65% hauteur)  │
│                 │
└─────────────────┘
```

### Mode Paysage (Horizontal)

```
┌────────┬─────────────────┐
│ Panel  │                 │
│  des   │                 │
│Couches │      Carte      │
│(250px) │    (Flexible)   │
│        │                 │
└────────┴─────────────────┘
```

---

## 🎯 Conseils d'Utilisation Mobile

### Performance Optimale

1. **Utilisez le WiFi** pour le premier chargement
2. **Désactivez les couches** non nécessaires
3. **Fermez les autres applications** en arrière-plan
4. **Gardez l'app installée** comme PWA (plus rapide)

### Navigation Efficace

1. **Zoom** : Pincement à deux doigts
2. **Panoramique** : Glisser avec un doigt
3. **Rotation** : Deux doigts en rotation (si supporté)
4. **Info** : Tapez sur un élément de la carte

### GPS en Mouvement

1. **Activez le GPS** avant de commencer à vous déplacer
2. Le **marqueur suit** automatiquement votre position
3. La **carte reste fixe** - vous voyez votre déplacement
4. **Désactivez** le GPS pour économiser la batterie

### Économie de Batterie

- Désactivez le GPS quand vous ne bougez pas
- Réduisez la luminosité de l'écran
- Utilisez le mode avion + WiFi si possible
- Désactivez les couches inutiles

---

## ✅ Checklist de Vérification

Avant de signaler un problème, vérifiez :

- [ ] L'application est à jour (dernière version)
- [ ] La connexion Internet est active
- [ ] Les permissions GPS sont accordées
- [ ] Le GPS du téléphone est activé
- [ ] Le cache du navigateur a été vidé
- [ ] L'application a été rechargée
- [ ] Vous êtes en extérieur (pour le GPS)
- [ ] Les couches sont activées (cases vertes)

---

## 📞 Support et Assistance

### Informations Utiles pour le Support

Si vous devez contacter le support, préparez ces informations :

1. **Modèle de téléphone** : (ex: Samsung Galaxy S21)
2. **Système d'exploitation** : (ex: Android 13, iOS 16)
3. **Navigateur utilisé** : (ex: Chrome 120, Safari 17)
4. **Type de problème** : (Carte, GPS, Performance, etc.)
5. **Message d'erreur** : (Screenshot si possible)
6. **Étapes déjà tentées** : (Liste des solutions essayées)

### Tests à Effectuer

Avant de contacter le support, testez :

```
✅ Test 1 : Rechargez la page
✅ Test 2 : Videz le cache
✅ Test 3 : Testez dans un autre navigateur
✅ Test 4 : Testez sur un autre réseau WiFi
✅ Test 5 : Redémarrez votre téléphone
```

---

## 🔄 Mises à Jour

### Comment Mettre à Jour l'Application PWA

1. **Fermez complètement** l'application
2. **Ouvrez** l'application
3. Si une mise à jour est disponible, un message apparaîtra
4. Cliquez sur **"Mettre à jour"**
5. L'application se rechargera automatiquement

### Force la Mise à Jour

Si l'application ne se met pas à jour :

1. Supprimez l'application de votre écran d'accueil
2. Videz le cache de votre navigateur
3. Visitez l'URL de l'application dans le navigateur
4. Réinstallez l'application

---

## 🌐 Fonctionnement Hors Ligne

### Ce qui fonctionne hors ligne

✅ Visualisation de la carte (si déjà visitée)
✅ Consultation des couches en cache
✅ Navigation dans l'interface
✅ GPS (utilise le GPS du téléphone)

### Ce qui nécessite Internet

❌ Chargement initial des données
❌ Mise à jour des couches
❌ Fonds de carte détaillés
❌ Nouvelles fonctionnalités

---

## 📊 Compatibilité

### Navigateurs Supportés

- ✅ Chrome 90+ (Android)
- ✅ Safari 15.4+ (iOS)
- ✅ Firefox 88+ (Android)
- ✅ Samsung Internet 14+
- ✅ Edge 90+ (Android)

### Systèmes d'Exploitation

- ✅ Android 8.0+
- ✅ iOS 15.4+

### Fonctionnalités par Plateforme

| Fonctionnalité | Android | iOS |
|----------------|---------|-----|
| GPS | ✅ | ✅ |
| Mode hors ligne | ✅ | ✅ |
| Installation PWA | ✅ | ✅ |
| Notifications | ✅ | ❌ |
| Écran d'accueil | ✅ | ✅ |

---

## 🎓 Tutoriel Vidéo (Simulation)

### 1. Installation de l'App (30 secondes)

```
1. Ouvrez l'app dans Chrome/Safari
2. Menu (⋮) → "Installer l'application"
3. Confirmez l'installation
4. L'icône apparaît sur votre écran d'accueil
```

### 2. Utilisation du GPS (45 secondes)

```
1. Ouvrez l'app
2. Cliquez sur le bouton GPS (vert)
3. Autorisez l'accès à la localisation
4. Attendez la localisation (5-10 secondes)
5. Votre position s'affiche avec un marqueur bleu
6. Déplacez-vous - le marqueur suit automatiquement
```

### 3. Navigation de Base (1 minute)

```
1. Pincer pour zoomer/dézoomer
2. Glisser pour se déplacer
3. Taper sur un élément pour voir ses infos
4. Ouvrir le panneau de couches pour activer/désactiver
5. Utiliser le menu pour rechercher
```

---

**Version** : 2.0.0
**Date** : 2026-12-03
**Pour** : SIG Web UAM - Application Mobile

---

**💡 Astuce** : Installez l'application sur votre écran d'accueil pour une expérience optimale !
