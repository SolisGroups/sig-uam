# 🎨 Guide de l'Interface Améliorée - SIG Web UAM

## 🎯 Vue d'Ensemble

L'interface a été repensée pour **mettre la carte en avant** tout en gardant un accès facile aux outils. Les panneaux sont maintenant **dynamiques** : vous pouvez les afficher ou les masquer selon vos besoins.

---

## 🆕 Nouvelles Fonctionnalités

### 1. 📂 Panneau des Couches Dynamique

Le panneau des couches peut maintenant être **affiché** ou **masqué** pour maximiser l'espace de la carte.

#### Comment l'utiliser

**Pour masquer le panneau :**

- Cliquez sur le bouton `←` (flèche gauche) dans l'en-tête du panneau
- Le panneau se rétracte vers la gauche
- La carte s'agrandit automatiquement

**Pour afficher le panneau :**

- Cliquez sur le bouton flottant `📂` en haut à gauche de la carte
- Le panneau réapparaît depuis la gauche
- La carte s'ajuste automatiquement

#### Avantages

- ✅ Plus d'espace pour visualiser la carte
- ✅ Accès rapide aux couches quand nécessaire
- ✅ Interface épurée et professionnelle

---

### 2. 📋 Légende Dynamique

La légende peut être **affichée** ou **masquée** indépendamment du panneau des couches.

#### Comment l'utiliser

**Pour masquer la légende :**

- Cliquez sur le bouton `×` dans l'en-tête de la légende
- La légende se rétracte vers la droite

**Pour afficher la légende :**

- Cliquez sur le bouton flottant `☰` en bas à droite de la carte
- La légende réapparaît depuis la droite

#### Avantages

- ✅ Contrôle total sur l'affichage
- ✅ Libère l'espace de la carte
- ✅ Toujours accessible en un clic

---

### 3. 🗺️ Carte en Plein Écran

En masquant les deux panneaux, vous obtenez une **vue carte maximale** pour :

- Analyser de grandes zones
- Présenter la carte à d'autres personnes
- Capturer des captures d'écran
- Imprimer la carte

#### Pour obtenir le mode plein écran

1. Masquez le panneau des couches (`←`)
2. Masquez la légende (`×`)
3. La carte occupe maintenant tout l'écran !

---

## 🎮 Contrôles de l'Interface

### Boutons Flottants

#### 📂 Bouton Couches

- **Position** : Haut gauche de la carte
- **Fonction** : Affiche/Masque le panneau des couches
- **Visible** : Uniquement quand le panneau est fermé
- **Raccourci** : Clic sur le bouton

#### ☰ Bouton Légende

- **Position** : Bas droite de la carte
- **Fonction** : Affiche/Masque la légende
- **Visible** : Toujours
- **Raccourci** : Clic sur le bouton

### Boutons dans les Panneaux

#### ← Fermer le Panneau des Couches

- **Position** : En-tête du panneau des couches (droite)
- **Fonction** : Masque le panneau vers la gauche
- **Animation** : Transition fluide de 0.3 secondes

#### × Fermer la Légende

- **Position** : En-tête de la légende (droite)
- **Fonction** : Masque la légende vers la droite
- **Animation** : Transition fluide avec effet de slide

---

## 📱 Comportement Mobile

### Mode Portrait (Vertical)

Le panneau des couches se positionne **en haut** de l'écran :

```
┌─────────────────┐
│   Navigation    │
├─────────────────┤
│  [×] Couches    │ ← Panneau rétractable
├─────────────────┤
│                 │
│      Carte      │
│   [📂]     [☰]  │ ← Boutons flottants
│                 │
└─────────────────┘
```

**Comportement :**

- Cliquez sur `×` pour masquer le panneau
- Le panneau se rétracte vers le haut (hauteur = 0)
- La carte occupe tout l'espace disponible
- Cliquez sur `📂` pour le réafficher

### Mode Paysage (Horizontal)

Le panneau revient sur le **côté gauche** :

```
┌──────┬──────────────────┐
│ [×]  │                  │
│Panel │      Carte       │
│Couch │   [📂]      [☰]  │
│  es  │                  │
└──────┴──────────────────┘
```

**Comportement :**

- Même comportement que sur desktop
- Panneau se rétracte vers la gauche
- Boutons flottants adaptés à la taille

---

## 🎯 Cas d'Utilisation

### Cas 1 : Analyse de Données

**Objectif** : Visualiser plusieurs couches simultanément

**Configuration recommandée :**

- ✅ Panneau des couches **ouvert** (pour activer/désactiver rapidement)
- ✅ Légende **visible** (pour identifier les symboles)
- ✅ Zoom sur la zone d'intérêt

### Cas 2 : Présentation

**Objectif** : Montrer la carte à un public

**Configuration recommandée :**

- ❌ Panneau des couches **fermé** (interface épurée)
- ✅ Légende **visible** (pour les explications)
- ✅ Carte en plein écran

### Cas 3 : Capture d'Écran

**Objectif** : Exporter une image de la carte

**Configuration recommandée :**

- ❌ Panneau des couches **fermé**
- ❌ Légende **fermée** (ou visible selon besoin)
- ✅ Zoom parfait sur la zone
- ✅ Couches nécessaires activées

### Cas 4 : Navigation GPS

**Objectif** : Suivre sa position en temps réel

**Configuration recommandée :**

- ❌ Panneau des couches **fermé** (plus d'espace)
- ❌ Légende **fermée** (maximiser la carte)
- ✅ GPS activé
- ✅ Zoom sur ma position

---

## ⚙️ Paramètres Techniques

### Animations

**Panneau des Couches :**

- **Durée** : 300ms
- **Easing** : ease
- **Propriété** : margin-left

**Légende :**

- **Durée** : 300ms
- **Easing** : ease
- **Propriété** : transform (translateX)

### Dimensions

**Desktop :**

- Panneau des couches : 280px
- Légende : max 250px
- Boutons flottants : 48x48px

**Mobile Portrait :**

- Panneau des couches : 100% largeur, max 40vh hauteur
- Légende : max 180px
- Boutons flottants : 40x40px

**Mobile Paysage :**

- Panneau des couches : 250px
- Légende : max 200px
- Boutons flottants : 40x40px

---

## 🎨 Personnalisation

### Modifier la Taille du Panneau

Dans `css/styles.css`, ligne 25 :

```css
#toc-panel {
    width: 280px; /* Changez cette valeur */
    min-width: 280px; /* Même valeur */
}
```

### Modifier la Vitesse d'Animation

Dans `css/styles.css`, ligne 33 :

```css
transition: transform 0.3s ease, margin-left 0.3s ease;
/* Changez 0.3s pour une animation plus rapide/lente */
```

### Modifier la Position des Boutons

Dans `css/styles.css`, lignes 176-189 :

```css
.floating-btn-left {
    top: 20px;    /* Distance du haut */
    left: 20px;   /* Distance de la gauche */
}

.floating-btn-bottom-right {
    bottom: 80px; /* Distance du bas */
    right: 20px;  /* Distance de la droite */
}
```

---

## 🔧 Dépannage

### Problème 1 : Le panneau ne se ferme pas

**Solution :**

1. Rechargez la page (F5)
2. Videz le cache du navigateur
3. Vérifiez la console pour les erreurs JavaScript

### Problème 2 : La carte ne se redimensionne pas

**Solution :**

- C'est normal ! La carte se redimensionne automatiquement après 350ms
- Si le problème persiste, cliquez sur le bouton de zoom

### Problème 3 : Les boutons flottants sont cachés

**Cause :** D'autres éléments de la carte peuvent les masquer

**Solution :**

1. Vérifiez que la carte est complètement chargée
2. Fermez le panneau puis rouvrez-le
3. Rafraîchissez la page

### Problème 4 : Animation saccadée

**Cause :** Performances du navigateur ou de l'appareil

**Solution :**

1. Fermez les autres onglets du navigateur
2. Désactivez les couches inutilisées
3. Réduisez le niveau de zoom

---

## 💡 Astuces et Raccourcis

### Astuces d'Utilisation

1. **Double-clic sur l'en-tête** : (fonctionnalité future) pourrait permettre de réduire/agrandir le panneau

2. **Glisser-déposer** : (fonctionnalité future) pourrait permettre de réorganiser les couches

3. **Ctrl + Clic** : (fonctionnalité future) pourrait permettre de sélectionner plusieurs couches

### Workflow Recommandé

**Pour une session de travail typique :**

1. **Ouverture** :
   - Panneau des couches **ouvert**
   - Légende **visible**
   - Activez les couches nécessaires

2. **Analyse** :
   - Fermez le panneau pour plus d'espace
   - Gardez la légende visible
   - Utilisez les outils de mesure

3. **Export/Capture** :
   - Fermez tous les panneaux
   - Ajustez le zoom
   - Capturez ou imprimez

---

## 📊 Comparaison Avant/Après

### Avant (Ancienne Interface)

❌ Panneau des couches toujours visible
❌ Légende toujours visible
❌ Espace carte réduit
❌ Interface encombrée

### Après (Nouvelle Interface)

✅ Panneaux masquables
✅ Légende dynamique
✅ Carte maximisée
✅ Interface épurée
✅ Boutons flottants élégants
✅ Animations fluides
✅ Responsive optimisé

---

## 🎓 Tutoriel Vidéo (Simulation)

### 1. Masquer le Panneau des Couches (10 secondes)

```
1. Localisez le bouton ← dans l'en-tête du panneau
2. Cliquez dessus
3. Le panneau se rétracte vers la gauche
4. La carte s'agrandit automatiquement
```

### 2. Réafficher le Panneau (10 secondes)

```
1. Localisez le bouton flottant 📂 en haut à gauche
2. Cliquez dessus
3. Le panneau réapparaît
4. La carte s'ajuste
```

### 3. Masquer la Légende (5 secondes)

```
1. Cliquez sur × dans l'en-tête de la légende
2. La légende disparaît vers la droite
```

### 4. Mode Plein Écran (15 secondes)

```
1. Fermez le panneau des couches
2. Fermez la légende
3. Admirez la carte en plein écran !
4. Utilisez les outils depuis la navbar
```

---

## 🌟 Fonctionnalités Futures

### Court Terme

- [ ] Mémoriser l'état des panneaux (localStorage)
- [ ] Raccourcis clavier (P pour panneau, L pour légende)
- [ ] Thème sombre pour les panneaux

### Moyen Terme

- [ ] Redimensionnement manuel du panneau (drag)
- [ ] Position personnalisable des boutons flottants
- [ ] Mini-panneau avec icônes uniquement

### Long Terme

- [ ] Panneau détachable (fenêtre séparée)
- [ ] Multiples configurations sauvegardées
- [ ] Interface personnalisable par rôle (admin, utilisateur)

---

## 📞 Support

### Questions Fréquentes

**Q : Puis-je garder les panneaux fermés par défaut ?**
R : Oui, modifiez le JavaScript pour démarrer avec `.collapsed`

**Q : Les paramètres sont-ils sauvegardés ?**
R : Pas encore, mais c'est prévu dans une future mise à jour

**Q : Puis-je déplacer les boutons flottants ?**
R : Oui, en modifiant le CSS (voir section Personnalisation)

**Q : L'interface fonctionne-t-elle hors ligne ?**
R : Oui, une fois la PWA installée, tout fonctionne hors ligne

---

## ✅ Checklist d'Utilisation

Avant de commencer votre travail :

- [ ] J'ai compris comment masquer/afficher le panneau des couches
- [ ] J'ai testé le bouton de la légende
- [ ] J'ai essayé le mode plein écran
- [ ] J'ai vérifié le comportement sur mobile
- [ ] Je sais où trouver les boutons flottants

---

**Version** : 2.1.0
**Date** : 2026-12-03
**Pour** : SIG Web UAM - Interface Dynamique

---

**🎉 Profitez de votre nouvelle interface épurée et professionnelle !**
