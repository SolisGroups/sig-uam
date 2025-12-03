# 🚀 Instructions Rapides - Configuration PWA

## Étapes pour activer la PWA (5 minutes)

### ✅ Étape 1 : Générer les icônes (2 min)

1. Ouvrez votre navigateur
2. Accédez à : `http://localhost:8080/sigweb-uam/generate-icons.html`
3. Les icônes seront générées automatiquement
4. Téléchargez chaque icône (8 icônes au total)
5. Placez-les dans le dossier : `img/icons/`

### ✅ Étape 2 : Tester localement (1 min)

1. Accédez à : `http://localhost:8080/sigweb-uam/`
2. Ouvrez la console (F12)
3. Vérifiez le message : "✅ Service Worker enregistré avec succès"
4. Un bouton "Installer l'App" devrait apparaître dans la navigation

### ✅ Étape 3 : Installer l'application (1 min)

**Sur Chrome/Edge :**
- Cliquez sur le bouton "Installer l'App" dans la navbar
- OU cliquez sur l'icône ➕ dans la barre d'adresse

**Sur Mobile :**
- Ouvrez le menu (⋮) → "Installer l'application"

### ✅ Étape 4 : Déployer sur GitHub (1 min + temps de configuration)

#### A. Préparer le code

1. **Modifiez les chemins dans `manifest.json`** (lignes 6-7) :
   ```json
   "start_url": "/VOTRE-REPO/index.html",
   "scope": "/VOTRE-REPO/",
   ```

2. **Modifiez le chemin dans `index.html`** (ligne ~680) :
   ```javascript
   navigator.serviceWorker.register('/VOTRE-REPO/sw.js')
   ```

3. **Modifiez tous les chemins dans `sw.js`** :
   - Remplacez `/sigweb-uam/` par `/VOTRE-REPO/`
   - (Lignes 6-14 et autres occurrences)

#### B. Pousser sur GitHub

```bash
# Initialisez git (si pas déjà fait)
git init

# Ajoutez tous les fichiers
git add .

# Créez le premier commit
git commit -m "Initial commit - PWA SIG Web UAM"

# Ajoutez le remote GitHub
git remote add origin https://github.com/VOTRE-USERNAME/VOTRE-REPO.git

# Poussez sur GitHub
git branch -M main
git push -u origin main
```

#### C. Activer GitHub Pages

1. Allez sur votre repo GitHub
2. Settings → Pages
3. Source : `main` branch, `/ (root)` folder
4. Save

**Votre app sera accessible à :**
```
https://VOTRE-USERNAME.github.io/VOTRE-REPO/
```

---

## 🎯 Checklist finale

- [ ] Les 8 icônes sont dans `img/icons/`
- [ ] Le Service Worker s'enregistre correctement
- [ ] L'app peut être installée
- [ ] Les chemins sont modifiés pour GitHub
- [ ] Le code est poussé sur GitHub
- [ ] GitHub Pages est activé
- [ ] L'app est accessible en ligne

---

## ⚠️ Points importants

1. **HTTPS requis** : Les PWA nécessitent HTTPS (GitHub Pages le fournit automatiquement)
2. **Chemins absolus** : Utilisez des chemins absolus pour GitHub Pages
3. **Version du cache** : Incrémentez `CACHE_VERSION` dans `sw.js` à chaque mise à jour
4. **Test hors ligne** : Testez en mode avion pour vérifier le fonctionnement hors ligne

---

## 📞 Besoin d'aide ?

Consultez le fichier `README-PWA.md` pour la documentation complète.

---

**Temps total estimé : 5-10 minutes** ⏱️

Bonne chance avec votre PWA ! 🎉
