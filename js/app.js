// --- VARIABLES GLOBALES ---
var map;
var geojsonData = {}; // Stocke les données brutes
var layers = {};      // Stocke les couches Leaflet
var currentResult = null; // Pour le téléchargement
var browserPrintControl; // Variable pour l'imprimante
var drawControl; // Variable pour le contrôle de dessin
var gpsMarker = null; // Marqueur pour la position GPS
var gpsCircle = null; // Cercle de précision GPS
var gpsWatchId = null; // ID pour le suivi GPS

// --- 1. INITIALISATION DE LA PAGE ---
document.addEventListener('DOMContentLoaded', function () {
    initMap();
    initPrinter();
    initCatalogListener();
    initSpatialQueryListeners();
});

// Recalculer la taille de la carte lors du redimensionnement
window.addEventListener('resize', function() {
    if (map) {
        setTimeout(function() {
            map.invalidateSize();
        }, 100);
    }
});

// Recalculer la taille lors du changement d'orientation sur mobile
window.addEventListener('orientationchange', function() {
    if (map) {
        setTimeout(function() {
            map.invalidateSize();
        }, 300);
    }
});

// --- 2. FONCTIONS D'INITIALISATION ---

function initMap() {
    // Attendre que le DOM soit complètement chargé
    setTimeout(function() {
        map = L.map('map', {
            center: [14.514, -14.575],
            zoom: 7,
            zoomControl: false,
            tap: true, // Active le support tactile sur mobile
            tapTolerance: 15 // Tolérance pour les clics tactiles
        });

        L.control.zoom({ position: 'topleft' }).addTo(map);
        L.control.scale({ imperial: false, position: 'bottomright' }).addTo(map);

        // Fonds de carte
        var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: 'OSM' }).addTo(map);
        var satellite = L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', { attribution: 'Google Sat' });
        var dark = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { attribution: 'CartoDB Dark' });

        L.control.layers({ "OpenStreetMap": osm, "Satellite": satellite, "Fond Sombre": dark }, null, { position: 'topright' }).addTo(map);

        // MiniMap
        if (typeof L.Control.MiniMap !== 'undefined') {
            var osmMini = new L.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
            new L.Control.MiniMap(osmMini, { toggleDisplay: true, position: 'bottomleft', width: 150, height: 150 }).addTo(map);
        }

        // Chargement des données initiales
        loadGeoJSONLayer('data/arrondissement.geojson', 'Arrondissements', 'Polygon');
        loadGeoJSONLayer('data/rail.geojson', 'Rails', 'LineString');
        loadGeoJSONLayer('data/routes.geojson', 'Routes', 'LineString');
        loadGeoJSONLayer('data/localites.geojson', 'Localités', 'Point');

        // Force le redimensionnement de la carte après l'initialisation
        setTimeout(function() {
            if (map) {
                map.invalidateSize();
            }
        }, 500);
    }, 100);
}

function initPrinter() {
    // Vérification que le plugin est chargé
    if (typeof L.control !== 'undefined' && typeof L.control.browserPrint !== 'undefined') {
        browserPrintControl = L.control.browserPrint({
            position: 'topleft',
            title: 'Imprimer la carte',
            printModesNames: { Portrait: "Portrait", Landscape: "Paysage", Auto: "Auto", Custom: "Zone personnalisée" }
        });
        // Ne pas ajouter automatiquement à la carte pour éviter les doublons
    } else {
        console.warn("Plugin leaflet.browser.print non chargé");
    }
}

// Fonction déclenchée par le bouton de la barre d'outils
function triggerPrint() {
    if (browserPrintControl) {
        try {
            // Utiliser le mode Paysage par défaut
            browserPrintControl.addTo(map);
            // Simuler un clic sur le bouton d'impression après un court délai
            setTimeout(function () {
                var printButtons = document.querySelectorAll('.leaflet-control-browser-print a');
                if (printButtons.length > 0) {
                    printButtons[0].click();
                }
            }, 100);
        } catch (e) {
            console.error("Erreur impression:", e);
            alert("Erreur d'impression. Utilisez Ctrl+P pour imprimer.");
        }
    } else {
        alert("L'outil d'impression n'est pas disponible. Utilisez Ctrl+P.");
    }
}

// --- 3. GESTION DU CATALOGUE ---

function initCatalogListener() {
    var modalCatalogEl = document.getElementById('modalCatalog');
    if (modalCatalogEl) {
        modalCatalogEl.addEventListener('show.bs.modal', function () {
            updateCatalogContent();
        });
    }
}

function updateCatalogContent() {
    let container = document.getElementById('catalog-content');
    if (!container) return;

    let htmlContent = `<div class="table-responsive"><table class="table table-hover table-bordered">
                    <thead class="table-light"><tr><th>Nom de la Couche</th><th>Nombre d'objets</th><th>Type Géométrique</th></tr></thead>
                    <tbody>`;

    let hasData = false;

    for (let name in geojsonData) {
        hasData = true;
        let data = geojsonData[name];
        let count = data.features ? data.features.length : 0;
        let type = "Inconnu";
        if (count > 0 && data.features[0].geometry) {
            type = data.features[0].geometry.type;
        }

        htmlContent += `<tr>
            <td><strong>${name}</strong></td>
            <td><span class="badge bg-primary rounded-pill">${count}</span></td>
            <td>${type}</td>
        </tr>`;
    }

    if (!hasData) {
        htmlContent += `<tr><td colspan="3" class="text-center text-muted"><em>Aucune donnée chargée pour le moment...</em></td></tr>`;
    }

    htmlContent += `</tbody></table></div>`;
    container.innerHTML = htmlContent;
}

// --- 4. CHARGEMENT DES DONNEES ---

const styles = {
    'Arrondissements': { color: 'white', fillColor: '#e67e22', fillOpacity: 0.3, weight: 1 },
    'Rails': { color: 'black', weight: 3, dashArray: '10, 5' },
    'Routes': { color: '#e74c3c', weight: 2 },
    'Localités': { radius: 6, fillColor: '#8e44ad', color: 'white', weight: 1, fillOpacity: 1 }
};

function loadGeoJSONLayer(url, name, type) {
    fetch(url)
        .then(res => {
            if (!res.ok) throw new Error("Fichier introuvable : " + url);
            return res.json();
        })
        .then(data => {
            geojsonData[name] = data;

            let myStyle = styles[name] || { color: 'blue', weight: 2 };
            let options = {
                style: myStyle,
                onEachFeature: (feature, layer) => {
                    let popup = '<div style="max-height:200px;overflow:auto;"><table class="table table-sm table-striped" style="font-size:12px;">';
                    if (feature.properties) {
                        for (let k in feature.properties) {
                            popup += `<tr><td><b>${k}</b></td><td>${feature.properties[k]}</td></tr>`;
                        }
                    }
                    popup += '</table></div>';
                    layer.bindPopup(popup);
                }
            };

            if (type === 'Point') {
                options.pointToLayer = (feature, latlng) => L.circleMarker(latlng, myStyle);
            }

            layers[name] = L.geoJSON(data, options);

            // CORRECTION : Vérifier que map existe avant d'ajouter
            if (typeof map !== 'undefined' && map) {
                layers[name].addTo(map);
            }

            addLayerToTOC(name, type, data.features ? data.features.length : 0);
            addToLegend(name, type, myStyle);
            updateAllDropdowns(name);
        })
        .catch(err => console.error("Erreur chargement " + name, err));
}

// --- 5. INTERFACE (TOC, Légende, Champs) ---

// ========================================
// NOUVELLE FONCTION addLayerToTOC STYLISÉE
// ========================================
function addLayerToTOC(name, type, featureCount) {
    let list = document.getElementById('layers-list');
    if (!list) return;

    // Supprimer le message de chargement s'il existe
    let loadingMsg = document.getElementById('loading-layers');
    if (loadingMsg) {
        loadingMsg.remove();
    }

    // Déterminer la classe du symbole selon le type et le nom
    let symbolClass = 'polygon';
    let typeLabel = 'Polygone';
    let typeIcon = 'fa-draw-polygon';

    if (type === 'Point') {
        symbolClass = 'point';
        typeLabel = 'Point';
        typeIcon = 'fa-map-marker-alt';
    } else if (type === 'LineString') {
        if (name === 'Rails') {
            symbolClass = 'line-rail';
            typeLabel = 'Ligne (Rail)';
        } else {
            symbolClass = 'line-route';
            typeLabel = 'Ligne';
        }
        typeIcon = 'fa-route';
    }

    // Créer la carte de couche stylisée
    let card = document.createElement('div');
    card.className = 'layer-card active';
    card.id = `layer-card-${name.replace(/\s+/g, '-')}`;

    card.innerHTML = `
        <div class="layer-item">
            <label class="custom-checkbox">
                <input type="checkbox" checked onchange="toggleLayerStyled('${name}', this)" id="chk-${name.replace(/\s+/g, '-')}">
                <span class="check-mark"></span>
            </label>
            <div class="layer-symbol ${symbolClass}"></div>
            <div class="layer-info">
                <div class="layer-name">${name}</div>
                <div class="layer-type">
                    <i class="fa ${typeIcon}"></i>
                    <span>${typeLabel} • ${featureCount} objets</span>
                </div>
            </div>
            <button class="layer-zoom-btn" onclick="zoomToLayerExtent('${name}')" title="Zoomer sur la couche">
                <i class="fa fa-search-plus"></i>
            </button>
        </div>
    `;

    list.appendChild(card);
}

// Fonction toggle avec mise à jour du style de la carte
function toggleLayerStyled(name, checkbox) {
    let card = document.getElementById(`layer-card-${name.replace(/\s+/g, '-')}`);

    if (map.hasLayer(layers[name])) {
        map.removeLayer(layers[name]);
        if (card) card.classList.remove('active');
    } else {
        map.addLayer(layers[name]);
        if (card) card.classList.add('active');
    }
}

// Fonction pour zoomer sur l'étendue d'une couche
function zoomToLayerExtent(name) {
    if (layers[name]) {
        try {
            let bounds = layers[name].getBounds();
            if (bounds.isValid()) {
                map.fitBounds(bounds, { padding: [20, 20] });
            }
        } catch (e) {
            console.error("Erreur zoom sur couche:", e);
        }
    }
}

// Ancienne fonction toggle (conservée pour compatibilité)
function toggleLayer(name) {
    if (map.hasLayer(layers[name])) map.removeLayer(layers[name]);
    else map.addLayer(layers[name]);
}

function addToLegend(name, type, style) {
    let container = document.getElementById('legend-content');
    if (!container) return;
    let symbol = (type === 'Point')
        ? `<span style="display:inline-block;width:10px;height:10px;background:${style.fillColor};border-radius:50%;border:1px solid ${style.color};margin-right:5px;"></span>`
        : (type === 'LineString'
            ? `<span style="display:inline-block;width:15px;height:3px;background:${style.color};vertical-align:middle;margin-right:5px;"></span>`
            : `<span style="display:inline-block;width:15px;height:15px;background:${style.fillColor};border:1px solid ${style.color};margin-right:5px;opacity:0.7"></span>`);

    let div = document.createElement('div');
    div.innerHTML = symbol + name;
    container.appendChild(div);
}

// Mise à jour des listes déroulantes
function updateAllDropdowns(name) {
    let selAttr = document.getElementById('query-layer');
    if (selAttr && ![...selAttr.options].some(o => o.value === name)) selAttr.add(new Option(name, name));

    let selTarget = document.getElementById('spatial-target-layer');
    if (selTarget && ![...selTarget.options].some(o => o.value === name)) selTarget.add(new Option(name, name));

    let selRef = document.getElementById('spatial-ref-layer');
    if (selRef && ![...selRef.options].some(o => o.value === name)) selRef.add(new Option(name, name));
}

// --- 6. ECOUTE DES MODALS ---

function initSpatialQueryListeners() {
    // Ecouteur pour la requête attributaire
    let queryLayerSelect = document.getElementById('query-layer');
    if (queryLayerSelect) {
        queryLayerSelect.addEventListener('change', function () {
            let layerName = this.value;
            let fieldSelect = document.getElementById('query-field');
            if (fieldSelect) {
                fieldSelect.innerHTML = '';
                fieldSelect.disabled = !layerName;
                if (layerName && geojsonData[layerName] && geojsonData[layerName].features.length > 0) {
                    let props = geojsonData[layerName].features[0].properties;
                    Object.keys(props).forEach(k => fieldSelect.add(new Option(k, k)));
                }
            }
        });
    }

    // Ecouteur pour la requête spatiale - couche de référence
    let refLayerSelect = document.getElementById('spatial-ref-layer');
    if (refLayerSelect) {
        refLayerSelect.addEventListener('change', function () {
            let layerName = this.value;
            let fieldSelect = document.getElementById('spatial-ref-field');
            if (fieldSelect) {
                fieldSelect.innerHTML = '<option value="">-- Tous --</option>';
                if (layerName && geojsonData[layerName] && geojsonData[layerName].features.length > 0) {
                    let props = geojsonData[layerName].features[0].properties;
                    Object.keys(props).forEach(k => fieldSelect.add(new Option(k, k)));
                }
            }
        });
    }
}

// --- 7. REQUETES ET OUTILS ---

var resultLayer = L.geoJSON(null, {
    style: { color: 'yellow', weight: 4, opacity: 1 },
    pointToLayer: (f, latlng) => L.circleMarker(latlng, { radius: 8, fillColor: 'yellow', color: 'red', fillOpacity: 0.8 })
});

// CORRECTION : Ajouter seulement après que map soit initialisé
setTimeout(function () {
    if (typeof map !== 'undefined' && map) {
        resultLayer.addTo(map);
    }
}, 1000);

function displayResults(features) {
    resultLayer.clearLayers();
    currentResult = { type: "FeatureCollection", features: features };
    if (features.length > 0) {
        resultLayer.addData(currentResult);
        map.fitBounds(resultLayer.getBounds());
        showAlert(features.length + " résultat(s) trouvé(s)", "success");
    } else {
        showAlert("Aucun résultat trouvé", "warning");
    }
}

function showAlert(message, type) {
    let alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.style.position = 'fixed';
    alertDiv.style.top = '80px';
    alertDiv.style.right = '20px';
    alertDiv.style.zIndex = '9999';
    alertDiv.innerHTML = `${message}<button type="button" class="btn-close" data-bs-dismiss="alert"></button>`;
    document.body.appendChild(alertDiv);

    setTimeout(() => alertDiv.remove(), 3000);
}

function runAttributeQuery() {
    let layerName = document.getElementById('query-layer').value;
    let field = document.getElementById('query-field').value;
    let val = document.getElementById('query-value').value.toLowerCase();
    if (!layerName || !field) {
        alert("Veuillez sélectionner une couche et un champ");
        return;
    }

    let results = geojsonData[layerName].features.filter(f => String(f.properties[field]).toLowerCase().includes(val));
    displayResults(results);

    // Fermer le modal
    var modal = bootstrap.Modal.getInstance(document.getElementById('modalAttr'));
    if (modal) modal.hide();
}

function runGlobalSearch() {
    let txt = document.getElementById('global-search-input').value.toLowerCase();
    if (!txt) {
        alert("Veuillez entrer un terme de recherche");
        return;
    }

    let hits = [];
    for (let name in geojsonData) {
        hits = hits.concat(geojsonData[name].features.filter(f => Object.values(f.properties).some(v => String(v).toLowerCase().includes(txt))));
    }
    let info = document.getElementById('search-results-info');
    if (info) info.innerText = hits.length + " résultat(s) trouvé(s)";
    displayResults(hits);
}

// ===== FONCTION MANQUANTE : REQUETE SPATIALE AVANCEE =====
function runAdvancedSpatialQuery() {
    let targetLayerName = document.getElementById('spatial-target-layer').value;
    let relation = document.getElementById('spatial-relation').value;
    let refLayerName = document.getElementById('spatial-ref-layer').value;
    let refField = document.getElementById('spatial-ref-field').value;
    let refValue = document.getElementById('spatial-ref-value').value;

    if (!targetLayerName || !refLayerName) {
        alert("Veuillez sélectionner les couches cible et de référence");
        return;
    }

    // Filtrer la couche de référence si nécessaire
    let refFeatures = geojsonData[refLayerName].features;
    if (refField && refValue) {
        refFeatures = refFeatures.filter(f =>
            String(f.properties[refField]).toLowerCase().includes(refValue.toLowerCase())
        );
    }

    if (refFeatures.length === 0) {
        alert("Aucun objet trouvé dans la couche de référence");
        return;
    }

    // Effectuer le croisement spatial
    let results = [];
    let targetFeatures = geojsonData[targetLayerName].features;

    for (let targetFeature of targetFeatures) {
        for (let refFeature of refFeatures) {
            try {
                let match = false;

                if (relation === 'intersects') {
                    match = turf.booleanIntersects(targetFeature, refFeature);
                } else if (relation === 'within') {
                    match = turf.booleanWithin(targetFeature, refFeature);
                }

                if (match) {
                    results.push(targetFeature);
                    break;
                }
            } catch (e) {
                console.error("Erreur test spatial:", e);
            }
        }
    }

    displayResults(results);

    // Fermer le modal
    var modal = bootstrap.Modal.getInstance(document.getElementById('modalSpatialAdvanced'));
    if (modal) modal.hide();
}

// Outil Sélection Spatiale
function activateSpatialTool() {
    // CORRECTION : Initialiser seulement si pas déjà fait
    if (!drawControl) {
        drawControl = new L.Control.Draw({
            draw: {
                polygon: false,
                rectangle: true,
                marker: false,
                circle: false,
                polyline: false
            },
            edit: false
        });
    }

    // CORRECTION : Vérifier si map existe et si le contrôle n'est pas déjà ajouté
    if (map && !map.hasControl(drawControl)) {
        drawControl.addTo(map);
        showAlert("Dessinez un rectangle pour sélectionner", "info");
    }
}

map.on(L.Draw.Event.CREATED, function (e) {
    if (e.layerType === 'polyline') return;
    let searchArea = e.layer.toGeoJSON();
    let hits = [];
    for (let name in geojsonData) {
        hits = hits.concat(geojsonData[name].features.filter(f => {
            try {
                return turf.booleanIntersects(searchArea, f);
            } catch (err) {
                return false;
            }
        }));
    }
    displayResults(hits);

    // Retirer le contrôle
    if (drawControl && map.hasControl(drawControl)) {
        map.removeControl(drawControl);
    }
});

// Outil Mesure
function triggerMeasure(type) {
    let Cls = (type === 'distance') ? L.Draw.Polyline : L.Draw.Polygon;
    let drawer = new Cls(map, { shapeOptions: { color: 'red', weight: 4 } });
    drawer.enable();
    map.once(L.Draw.Event.CREATED, e => {
        let l = e.layer;
        let v = (type === 'distance') ? turf.length(l.toGeoJSON()).toFixed(2) + " km" : (turf.area(l.toGeoJSON()) / 10000).toFixed(2) + " ha";
        l.bindTooltip(v, { permanent: true, direction: "center" }).openTooltip();
        map.addLayer(l);
    });
}

function zoomToGlobal() {
    map.setView([14.514, -14.575], 7);
}

function downloadData(fmt) {
    if (!currentResult || !currentResult.features.length) {
        alert("Aucun résultat à télécharger");
        return;
    }

    let content = (fmt === 'geojson') ? JSON.stringify(currentResult, null, 2) : "CSV...";
    if (fmt === 'csv') {
        let p = currentResult.features.map(f => f.properties);
        let k = Object.keys(p[0]);
        content = k.join(',') + '\n' + p.map(row => k.map(key => `"${row[key] || ''}"`).join(',')).join('\n');
    }
    let a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([content], { type: "text/plain" }));
    a.download = "export." + fmt;
    a.click();

    showAlert("Fichier téléchargé", "success");
}

// --- 8. FONCTIONNALITÉ GPS ---

function activateGPS() {
    const button = document.getElementById('gps-button');

    if (!navigator.geolocation) {
        alert("La géolocalisation n'est pas supportée par votre navigateur");
        return;
    }

    // Si le GPS est déjà actif, on le désactive
    if (gpsWatchId !== null) {
        navigator.geolocation.clearWatch(gpsWatchId);
        gpsWatchId = null;

        // Retirer les marqueurs
        if (gpsMarker) {
            map.removeLayer(gpsMarker);
            gpsMarker = null;
        }
        if (gpsCircle) {
            map.removeLayer(gpsCircle);
            gpsCircle = null;
        }

        // Remettre le bouton en état normal
        button.classList.remove('btn-danger');
        button.classList.add('btn-outline-success');
        button.innerHTML = '<i class="fa fa-location-crosshairs"></i>';

        showAlert("GPS désactivé", "info");
        return;
    }

    // Activer le GPS
    button.innerHTML = '<i class="fa fa-spinner fa-spin"></i>';
    showAlert("Activation du GPS...", "info");

    // Options de géolocalisation
    const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
    };

    // Première position (pour centrer la carte)
    navigator.geolocation.getCurrentPosition(
        function(position) {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            const accuracy = position.coords.accuracy;

            // Créer ou mettre à jour le marqueur
            updateGPSMarker(lat, lng, accuracy);

            // Centrer la carte sur la position
            map.setView([lat, lng], 15);

            // Activer le suivi continu
            gpsWatchId = navigator.geolocation.watchPosition(
                function(pos) {
                    updateGPSMarker(pos.coords.latitude, pos.coords.longitude, pos.coords.accuracy);
                },
                function(error) {
                    console.error("Erreur GPS:", error);
                    showAlert("Erreur GPS: " + error.message, "warning");
                },
                options
            );

            // Changer l'apparence du bouton
            button.classList.remove('btn-outline-success');
            button.classList.add('btn-danger');
            button.innerHTML = '<i class="fa fa-location-dot"></i>';

            showAlert(`Position trouvée (±${Math.round(accuracy)}m)`, "success");
        },
        function(error) {
            let message = "Erreur lors de l'activation du GPS";
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    message = "Permission GPS refusée. Autorisez l'accès à votre position.";
                    break;
                case error.POSITION_UNAVAILABLE:
                    message = "Position non disponible. Vérifiez votre connexion.";
                    break;
                case error.TIMEOUT:
                    message = "Délai d'attente GPS dépassé.";
                    break;
            }

            alert(message);
            button.innerHTML = '<i class="fa fa-location-crosshairs"></i>';
            console.error("Erreur GPS:", error);
        },
        options
    );
}

function updateGPSMarker(lat, lng, accuracy) {
    // Supprimer les anciens marqueurs
    if (gpsMarker) {
        map.removeLayer(gpsMarker);
    }
    if (gpsCircle) {
        map.removeLayer(gpsCircle);
    }

    // Créer le cercle de précision
    gpsCircle = L.circle([lat, lng], {
        radius: accuracy,
        color: '#4285F4',
        fillColor: '#4285F4',
        fillOpacity: 0.15,
        weight: 2
    }).addTo(map);

    // Créer le marqueur de position
    const icon = L.divIcon({
        className: 'gps-marker',
        html: '<div style="background: #4285F4; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(66, 133, 244, 0.8);"></div>',
        iconSize: [22, 22],
        iconAnchor: [11, 11]
    });

    gpsMarker = L.marker([lat, lng], { icon: icon })
        .bindPopup(`
            <div style="text-align: center;">
                <strong>📍 Votre Position</strong><br>
                <small>
                    Latitude: ${lat.toFixed(6)}°<br>
                    Longitude: ${lng.toFixed(6)}°<br>
                    Précision: ±${Math.round(accuracy)}m
                </small>
            </div>
        `)
        .addTo(map);
}

// --- 9. GESTION DES PANNEAUX DYNAMIQUES ---

function toggleTOCPanel() {
    const panel = document.getElementById('toc-panel');
    const btn = document.querySelector('.btn-collapse i');

    if (panel.classList.contains('collapsed')) {
        // Ouvrir le panneau
        panel.classList.remove('collapsed');
        btn.classList.remove('fa-chevron-right');
        btn.classList.add('fa-chevron-left');
    } else {
        // Fermer le panneau
        panel.classList.add('collapsed');
        btn.classList.remove('fa-chevron-left');
        btn.classList.add('fa-chevron-right');
    }

    // Recalculer la taille de la carte après l'animation
    setTimeout(function() {
        if (map) {
            map.invalidateSize();
        }
    }, 350);
}

function toggleLegend() {
    const legend = document.getElementById('legend-panel');
    const btn = document.getElementById('btn-toggle-legend');

    if (legend.classList.contains('hidden')) {
        // Afficher la légende
        legend.classList.remove('hidden');
        btn.style.opacity = '1';
    } else {
        // Masquer la légende
        legend.classList.add('hidden');
        btn.style.opacity = '0.6';
    }
}

// Initialiser l'état des panneaux au chargement
document.addEventListener('DOMContentLoaded', function() {
    // Démarrer avec le panneau des couches ouvert
    const tocPanel = document.getElementById('toc-panel');
    if (tocPanel) {
        tocPanel.classList.remove('collapsed');
    }

    // Démarrer avec la légende visible
    const legendPanel = document.getElementById('legend-panel');
    if (legendPanel) {
        legendPanel.classList.remove('hidden');
    }
});