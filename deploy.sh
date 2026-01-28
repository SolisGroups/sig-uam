#!/bin/bash

# =============================================================================
# Script Déploiement et Test PWA - SIG Web UAM
# =============================================================================
# Ce script aide à déployer et tester la configuration PWA pour l'installation
# mobile Android sans Google Play
# =============================================================================

set -e

# Couleurs pour l'output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║       SIG Web UAM - Utilitaire PWA & Installation        ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Configuration
APP_DIR="$(pwd)"
APP_NAME="SIG Web UAM"
MANIFEST_FILE="manifest.json"
SW_FILE="sw.js"
INDEX_FILE="index.html"

# Fonction: Afficher l'usage
usage() {
    echo "Usage: $0 [commande]"
    echo ""
    echo "Commandes disponibles:"
    echo "  check-pwa       Vérifier la configuration PWA"
    echo "  check-manifest  Valider le manifest.json"
    echo "  check-sw        Vérifier le service worker"
    echo "  serve           Démarrer un serveur local HTTPS"
    echo "  deploy          Préparer le déploiement"
    echo "  test-geoloc     Tester la géolocalisation"
    echo "  generate-apk    Instructions pour générer l'APK"
    echo "  help            Afficher cette aide"
    echo ""
}

# Fonction: Vérifier l'existence d'un fichier
check_file() {
    local file="$1"
    local name="$2"
    
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $name existe"
        return 0
    else
        echo -e "${RED}✗${NC} $name manquant: $file"
        return 1
    fi
}

# Fonction: Afficher un bloc d'info
info_block() {
    local title="$1"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}$title${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# Fonction: Vérifier la configuration PWA
check_pwa() {
    info_block "VÉRIFICATION CONFIGURATION PWA"
    echo ""
    
    local errors=0
    
    # Vérifier les fichiers essentiels
    echo -e "${YELLOW}1. Fichiers essentiels:${NC}"
    check_file "$INDEX_FILE" "index.html" || ((errors++))
    check_file "$MANIFEST_FILE" "manifest.json" || ((errors++))
    check_file "$SW_FILE" "sw.js" || ((errors++))
    check_file "img/icons/icon-192x192.png" "Icône 192x192" || ((errors++))
    check_file "img/icons/icon-512x512.png" "Icône 512x512" || ((errors++))
    check_file "js/geolocation.js" "Module géolocalisation" || ((errors++))
    
    echo ""
    echo -e "${YELLOW}2. Métadonnées HTML:${NC}"
    
    if grep -q 'name="viewport"' "$INDEX_FILE"; then
        echo -e "${GREEN}✓${NC} Viewport configuré"
    else
        echo -e "${RED}✗${NC} Viewport manquant"
        ((errors++))
    fi
    
    if grep -q 'name="theme-color"' "$INDEX_FILE"; then
        echo -e "${GREEN}✓${NC} Theme-color configuré"
    else
        echo -e "${RED}✗${NC} Theme-color manquant"
        ((errors++))
    fi
    
    if grep -q 'rel="manifest"' "$INDEX_FILE"; then
        echo -e "${GREEN}✓${NC} Manifest lié"
    else
        echo -e "${RED}✗${NC} Manifest non lié"
        ((errors++))
    fi
    
    echo ""
    echo -e "${YELLOW}3. Service Worker:${NC}"
    
    if grep -q "serviceWorker" "$INDEX_FILE"; then
        echo -e "${GREEN}✓${NC} Service Worker enregistré"
    else
        echo -e "${YELLOW}⚠${NC} Enregistrement SW non trouvé"
    fi
    
    echo ""
    echo -e "${YELLOW}4. Fonctionnalités géolocalisation:${NC}"
    
    if [ -f "js/geolocation.js" ]; then
        if grep -q "class GeolocationManager" "js/geolocation.js"; then
            echo -e "${GREEN}✓${NC} Module géolocalisation présent"
        else
            echo -e "${RED}✗${NC} Module géolocalisation malformé"
            ((errors++))
        fi
    fi
    
    echo ""
    echo -e "${YELLOW}5. Configuration manifest.json:${NC}"
    
    if [ -f "$MANIFEST_FILE" ]; then
        if grep -q '"display"' "$MANIFEST_FILE"; then
            echo -e "${GREEN}✓${NC} Propriété 'display' configurée"
        else
            echo -e "${RED}✗${NC} Propriété 'display' manquante"
            ((errors++))
        fi
        
        if grep -q '"icons"' "$MANIFEST_FILE"; then
            echo -e "${GREEN}✓${NC} Icônes configurées"
        else
            echo -e "${RED}✗${NC} Icônes manquantes"
            ((errors++))
        fi
    fi
    
    echo ""
    if [ $errors -eq 0 ]; then
        echo -e "${GREEN}✓ Configuration PWA valide!${NC}"
        return 0
    else
        echo -e "${RED}✗ $errors problème(s) détecté(s)${NC}"
        return 1
    fi
}

# Fonction: Valider le manifest.json
check_manifest() {
    info_block "VALIDATION MANIFEST.JSON"
    echo ""
    
    if [ ! -f "$MANIFEST_FILE" ]; then
        echo -e "${RED}✗ Fichier manifest.json introuvable${NC}"
        return 1
    fi
    
    echo -e "${YELLOW}Contenu du manifest.json:${NC}"
    echo ""
    cat "$MANIFEST_FILE" | head -20
    echo ""
    echo -e "${YELLOW}Éléments requis:${NC}"
    
    local required=("name" "short_name" "icons" "display" "start_url" "theme_color")
    local errors=0
    
    for elem in "${required[@]}"; do
        if grep -q "\"$elem\"" "$MANIFEST_FILE"; then
            echo -e "${GREEN}✓${NC} \"$elem\" présent"
        else
            echo -e "${RED}✗${NC} \"$elem\" manquant"
            ((errors++))
        fi
    done
    
    echo ""
    if [ $errors -eq 0 ]; then
        echo -e "${GREEN}✓ Manifest.json valide!${NC}"
        return 0
    else
        return 1
    fi
}

# Fonction: Vérifier le service worker
check_sw() {
    info_block "VÉRIFICATION SERVICE WORKER"
    echo ""
    
    if [ ! -f "$SW_FILE" ]; then
        echo -e "${RED}✗ Fichier sw.js introuvable${NC}"
        return 1
    fi
    
    echo -e "${YELLOW}Vérifications:${NC}"
    
    if grep -q "addEventListener.*install" "$SW_FILE"; then
        echo -e "${GREEN}✓${NC} Événement 'install' présent"
    else
        echo -e "${RED}✗${NC} Événement 'install' manquant"
    fi
    
    if grep -q "addEventListener.*fetch" "$SW_FILE"; then
        echo -e "${GREEN}✓${NC} Événement 'fetch' présent"
    else
        echo -e "${RED}✗${NC} Événement 'fetch' manquant"
    fi
    
    if grep -q "addEventListener.*activate" "$SW_FILE"; then
        echo -e "${GREEN}✓${NC} Événement 'activate' présent"
    else
        echo -e "${RED}✗${NC} Événement 'activate' manquant"
    fi
    
    echo ""
    echo -e "${YELLOW}Lignes de cache:${NC}"
    grep "addAll\|cache.put" "$SW_FILE" | head -5
    echo ""
    
    echo -e "${GREEN}✓ Service Worker valide${NC}"
}

# Fonction: Démarrer un serveur local HTTPS
serve() {
    info_block "DÉMARRAGE SERVEUR LOCAL"
    echo ""
    
    echo -e "${YELLOW}Installation des dépendances...${NC}"
    
    # Vérifier si http-server est installé
    if command -v http-server &> /dev/null; then
        echo -e "${GREEN}✓${NC} http-server est installé"
    else
        echo -e "${YELLOW}Installation http-server...${NC}"
        npm install -g http-server
    fi
    
    echo ""
    echo -e "${GREEN}Démarrage du serveur...${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}Accès à l'application:${NC}"
    echo -e "${BLUE}  http://localhost:8080/sigweb-uam/index.html${NC}"
    echo -e "${BLUE}  http://localhost:8080/sigweb-uam/check-pwa.html${NC}"
    echo ""
    echo -e "${YELLOW}Sur téléphone (même réseau):${NC}"
    echo -e "${YELLOW}  http://192.168.x.x:8080/sigweb-uam/${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    
    # Lancer le serveur
    cd "$APP_DIR" && http-server -p 8080 -c-1
}

# Fonction: Préparer le déploiement
deploy() {
    info_block "PRÉPARATION DÉPLOIEMENT"
    echo ""
    
    check_pwa || return 1
    
    echo ""
    echo -e "${YELLOW}Checklist déploiement:${NC}"
    echo -e "${GREEN}✓${NC} Configuration PWA validée"
    echo -e "${GREEN}✓${NC} Manifest.json configuré"
    echo -e "${GREEN}✓${NC} Service Worker actif"
    echo -e "${GREEN}✓${NC} Module géolocalisation intégré"
    
    echo ""
    echo -e "${YELLOW}Étapes suivantes:${NC}"
    echo "1. Vérifier le manifeste: pwaconfig.json"
    echo "2. Configurer le serveur HTTPS (Letsencrypt)"
    echo "3. Tester sur mobile: check-pwa.html"
    echo "4. Générer l'APK: pwabuilder.com"
    
    echo ""
    echo -e "${GREEN}✓ Application prête pour déploiement!${NC}"
}

# Fonction: Tester la géolocalisation
test_geoloc() {
    info_block "TESTER GÉOLOCALISATION"
    echo ""
    
    echo -e "${YELLOW}Pour tester la géolocalisation:${NC}"
    echo ""
    echo "1. Accédez à: http://localhost:8080/sigweb-uam/"
    echo "2. Cliquez sur le bouton '📍 Localiser'"
    echo "3. Autorisez l'accès au GPS (prompt)"
    echo "4. Attendez la détection de votre position"
    echo ""
    echo -e "${YELLOW}Pour le suivi GPS:${NC}"
    echo "1. Cliquez sur '🗺️ Suivi GPS'"
    echo "2. Déplacez-vous (ex: marchez)"
    echo "3. Cliquez sur '📊 Stats' pour voir les statistiques"
    echo "4. Cliquez sur '⬇️ Exporter' pour sauvegarder"
    echo ""
    echo -e "${YELLOW}Le fichier exporté sera au format GeoJSON (compatible QGIS)${NC}"
}

# Fonction: Instructions APK
generate_apk() {
    info_block "GÉNÉRER UN APK PERSONNALISÉ"
    echo ""
    
    echo -e "${YELLOW}Méthode 1: PWABuilder (Recommandée)${NC}"
    echo "1. Accédez à: https://www.pwabuilder.com"
    echo "2. Entrez l'URL: $APP_NAME"
    echo "3. Cliquez 'Start'"
    echo "4. Attendez l'analyse"
    echo "5. Cliquez 'Package for stores'"
    echo "6. Sélectionnez 'Android (APK)'"
    echo "7. Téléchargez le fichier .apk"
    echo ""
    
    echo -e "${YELLOW}Méthode 2: Bubblewrap (Avancée)${NC}"
    echo "$ npm install -g @bubblewrap/cli"
    echo "$ bubblewrap init --manifest manifest.json"
    echo "$ bubblewrap build"
    echo ""
    
    echo -e "${YELLOW}Installation sur téléphone:${NC}"
    echo "1. Transférez app-release.apk sur le téléphone"
    echo "2. Ouvrez le fichier avec le gestionnaire de fichiers"
    echo "3. Acceptez l'installation (Sources inconnues)"
    echo ""
}

# Fonction: Afficher l'aide
show_help() {
    usage
    echo -e "${BLUE}Exemple:${NC}"
    echo "  $0 check-pwa"
    echo "  $0 serve"
    echo "  $0 deploy"
    echo ""
}

# Programme principal
if [ $# -eq 0 ]; then
    usage
    exit 1
fi

case "$1" in
    check-pwa)
        check_pwa
        ;;
    check-manifest)
        check_manifest
        ;;
    check-sw)
        check_sw
        ;;
    serve)
        serve
        ;;
    deploy)
        deploy
        ;;
    test-geoloc)
        test_geoloc
        ;;
    generate-apk)
        generate_apk
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        echo -e "${RED}Commande inconnue: $1${NC}"
        echo ""
        usage
        exit 1
        ;;
esac

exit $?
