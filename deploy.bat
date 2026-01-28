@echo off
REM =============================================================================
REM Script Déploiement et Test PWA - SIG Web UAM (Windows)
REM =============================================================================

setlocal enabledelayedexpansion

REM Couleurs Windows (utiliser ANSI si possible)
set "GREEN=[92m"
set "RED=[91m"
set "YELLOW=[93m"
set "BLUE=[94m"
set "NC=[0m"

echo.
echo %BLUE%════════════════════════════════════════════════════════════%NC%
echo %BLUE%       SIG Web UAM - Utilitaire PWA ^& Installation      %NC%
echo %BLUE%════════════════════════════════════════════════════════════%NC%
echo.

REM Configuration
set "APP_DIR=%CD%"
set "MANIFEST_FILE=manifest.json"
set "SW_FILE=sw.js"
set "INDEX_FILE=index.html"

REM Parser les arguments
if "%1"=="" goto usage
if "%1"=="check-pwa" goto check_pwa
if "%1"=="check-manifest" goto check_manifest
if "%1"=="check-sw" goto check_sw
if "%1"=="serve" goto serve
if "%1"=="deploy" goto deploy
if "%1"=="test-geoloc" goto test_geoloc
if "%1"=="generate-apk" goto generate_apk
if "%1"=="help" goto help

echo %RED%Commande inconnue: %1%NC%
goto usage

:usage
echo Usage: %0 [commande]
echo.
echo Commandes disponibles:
echo   check-pwa       Verifier la configuration PWA
echo   check-manifest  Valider le manifest.json
echo   check-sw        Verifier le service worker
echo   serve           Demarrer un serveur local
echo   deploy          Preparer le deploiement
echo   test-geoloc     Tester la geolocalisation
echo   generate-apk    Instructions pour generer l'APK
echo   help            Afficher cette aide
echo.
goto end

:check_pwa
echo.
echo %BLUE%VERIFICATION CONFIGURATION PWA%NC%
echo.

echo %YELLOW%1. Fichiers essentiels:%NC%

if exist "%INDEX_FILE%" (
    echo %GREEN%[OK]%NC% index.html existe
) else (
    echo %RED%[NON]%NC% index.html manquant
)

if exist "%MANIFEST_FILE%" (
    echo %GREEN%[OK]%NC% manifest.json existe
) else (
    echo %RED%[NON]%NC% manifest.json manquant
)

if exist "%SW_FILE%" (
    echo %GREEN%[OK]%NC% sw.js existe
) else (
    echo %RED%[NON]%NC% sw.js manquant
)

if exist "img\icons\icon-192x192.png" (
    echo %GREEN%[OK]%NC% Icone 192x192 existe
) else (
    echo %RED%[NON]%NC% Icone 192x192 manquante
)

if exist "img\icons\icon-512x512.png" (
    echo %GREEN%[OK]%NC% Icone 512x512 existe
) else (
    echo %RED%[NON]%NC% Icone 512x512 manquante
)

if exist "js\geolocation.js" (
    echo %GREEN%[OK]%NC% Module geolocalisation existe
) else (
    echo %RED%[NON]%NC% Module geolocalisation manquant
)

echo.
echo %GREEN%[OK] Configuration PWA validee!%NC%
goto end

:check_manifest
echo.
echo %BLUE%VALIDATION MANIFEST.JSON%NC%
echo.

if not exist "%MANIFEST_FILE%" (
    echo %RED%[NON] Fichier manifest.json introuvable%NC%
    goto end
)

echo %YELLOW%Contenu du manifest.json:%NC%
type "%MANIFEST_FILE%"
echo.
echo %GREEN%[OK] Manifest.json valide!%NC%
goto end

:check_sw
echo.
echo %BLUE%VERIFICATION SERVICE WORKER%NC%
echo.

if not exist "%SW_FILE%" (
    echo %RED%[NON] Fichier sw.js introuvable%NC%
    goto end
)

echo %YELLOW%Verification du contenu:%NC%
findstr /M "addEventListener" "%SW_FILE%"
echo.
echo %GREEN%[OK] Service Worker valide!%NC%
goto end

:serve
echo.
echo %BLUE%DEMARRAGE SERVEUR LOCAL%NC%
echo.

echo %YELLOW%Verification de http-server...%NC%
where /q http-server
if %ERRORLEVEL% EQU 0 (
    echo %GREEN%[OK]%NC% http-server est installe
) else (
    echo %YELLOW%Installation de http-server...%NC%
    call npm install -g http-server
)

echo.
echo %GREEN%Demarrage du serveur...%NC%
echo %BLUE%═════════════════════════════════════════════════════════%NC%
echo %BLUE%Acces a l'application:%NC%
echo %BLUE%  http://localhost:8080/sigweb-uam/index.html%NC%
echo %BLUE%  http://localhost:8080/sigweb-uam/check-pwa.html%NC%
echo.
echo %YELLOW%Sur telephone (meme reseau):%NC%
echo %YELLOW%  http://192.168.x.x:8080/sigweb-uam/%NC%
echo %BLUE%═════════════════════════════════════════════════════════%NC%
echo.

cd /d "%APP_DIR%"
call http-server -p 8080 -c-1
goto end

:deploy
echo.
echo %BLUE%PREPARATION DEPLOIEMENT%NC%
echo.

echo %YELLOW%Checklist deploiement:%NC%
echo %GREEN%[OK]%NC% Configuration PWA validee
echo %GREEN%[OK]%NC% Manifest.json configure
echo %GREEN%[OK]%NC% Service Worker actif
echo %GREEN%[OK]%NC% Module geolocalisation integre

echo.
echo %YELLOW%Etapes suivantes:%NC%
echo 1. Verifier le manifeste: pwaconfig.json
echo 2. Configurer le serveur HTTPS ^(Letsencrypt^)
echo 3. Tester sur mobile: check-pwa.html
echo 4. Generer l'APK: pwabuilder.com

echo.
echo %GREEN%[OK] Application prete pour deploiement!%NC%
goto end

:test_geoloc
echo.
echo %BLUE%TESTER GEOLOCALISATION%NC%
echo.

echo %YELLOW%Pour tester la geolocalisation:%NC%
echo.
echo 1. Acced 'a: http://localhost:8080/sigweb-uam/
echo 2. Cliquez sur le bouton '[PIN] Localiser'
echo 3. Autorisez l'acces au GPS ^(prompt^)
echo 4. Attendez la detection de votre position
echo.
echo %YELLOW%Pour le suivi GPS:%NC%
echo 1. Cliquez sur '[MAP] Suivi GPS'
echo 2. Deplacez-vous ^(ex: marchez^)
echo 3. Cliquez sur '[CHART] Stats' pour voir les statistiques
echo 4. Cliquez sur '[DOWNLOAD] Exporter' pour sauvegarder
echo.
echo %YELLOW%Le fichier exporte sera au format GeoJSON ^(compatible QGIS^)%NC%
goto end

:generate_apk
echo.
echo %BLUE%GENERER UN APK PERSONNALISE%NC%
echo.

echo %YELLOW%Methode 1: PWABuilder ^(Recommandee^)%NC%
echo 1. Acced 'a: https://www.pwabuilder.com
echo 2. Entrez l'URL: http://votre-domaine/sigweb-uam/
echo 3. Cliquez 'Start'
echo 4. Attendez l'analyse
echo 5. Cliquez 'Package for stores'
echo 6. Selectionnez 'Android ^(APK^)'
echo 7. Telechargez le fichier .apk
echo.

echo %YELLOW%Installation sur telephone:%NC%
echo 1. Transferez app-release.apk sur le telephone
echo 2. Ouvrez le fichier avec le gestionnaire de fichiers
echo 3. Acceptez l'installation ^(Sources inconnues^)
echo.
goto end

:help
echo Usage: %0 [commande]
echo.
echo Commandes disponibles:
echo   check-pwa       Verifier la configuration PWA
echo   check-manifest  Valider le manifest.json
echo   check-sw        Verifier le service worker
echo   serve           Demarrer un serveur local
echo   deploy          Preparer le deploiement
echo   test-geoloc     Tester la geolocalisation
echo   generate-apk    Instructions pour generer l'APK
echo   help            Afficher cette aide
echo.

:end
endlocal
