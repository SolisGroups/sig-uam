/**
 * Module de Géolocalisation Avancée pour SIG Web UAM
 * Fournit des fonctionnalités de localisation avec précision, suivi en temps réel et historique
 */

class GeolocationManager {
    constructor(map) {
        this.map = map;
        this.currentMarker = null;
        this.accuracyCircle = null;
        this.trackingEnabled = false;
        this.watchId = null;
        this.locationHistory = [];
        this.polyline = null;
        this.isPermissionGranted = false;
        this.maxHistoryPoints = 100;
        this.lastLocation = null;

        this.initPermissions();
    }

    /**
     * Vérifier et initialiser les permissions de géolocalisation
     */
    initPermissions() {
        if ('permissions' in navigator && 'geolocation' in navigator) {
            navigator.permissions.query({ name: 'geolocation' }).then(permissionStatus => {
                this.isPermissionGranted = permissionStatus.state === 'granted';
                console.log('[Géolocalisation] Permission:', permissionStatus.state);

                permissionStatus.addEventListener('change', () => {
                    this.isPermissionGranted = permissionStatus.state === 'granted';
                    console.log('[Géolocalisation] Permission changée:', permissionStatus.state);
                });
            });
        }
    }

    /**
     * Obtenir la position actuelle une seule fois
     */
    getCurrentLocation(callback, errorCallback) {
        if (!('geolocation' in navigator)) {
            const error = 'La géolocalisation n\'est pas supportée par ce navigateur.';
            console.error('[Géolocalisation] ' + error);
            if (errorCallback) errorCallback(error);
            return;
        }

        const options = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        };

        navigator.geolocation.getCurrentPosition(
            (position) => this.handleLocationSuccess(position, callback),
            (error) => this.handleLocationError(error, errorCallback),
            options
        );
    }

    /**
     * Démarrer le suivi continu de la position
     */
    startTracking(options = {}) {
        if (this.trackingEnabled) {
            console.warn('[Géolocalisation] Suivi déjà actif');
            return;
        }

        if (!('geolocation' in navigator)) {
            console.error('[Géolocalisation] Géolocalisation non supportée');
            return;
        }

        const defaultOptions = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        };

        const finalOptions = { ...defaultOptions, ...options };

        this.trackingEnabled = true;
        this.locationHistory = [];
        this.polyline = null;

        this.watchId = navigator.geolocation.watchPosition(
            (position) => {
                this.handleLocationSuccess(position, null, true);
                console.log('[Géolocalisation] Suivi mis à jour');
            },
            (error) => this.handleLocationError(error),
            finalOptions
        );

        console.log('[Géolocalisation] Suivi démarré (ID: ' + this.watchId + ')');
    }

    /**
     * Arrêter le suivi continu
     */
    stopTracking() {
        if (this.watchId !== null) {
            navigator.geolocation.clearWatch(this.watchId);
            this.watchId = null;
            this.trackingEnabled = false;
            console.log('[Géolocalisation] Suivi arrêté');
        }
    }

    /**
     * Gérer le succès de la localisation
     */
    handleLocationSuccess(position, callback, isTracking = false) {
        const { latitude, longitude, accuracy, altitude, altitudeAccuracy, heading, speed } = position.coords;
        const timestamp = position.timestamp;

        this.lastLocation = {
            latitude,
            longitude,
            accuracy,
            altitude,
            altitudeAccuracy,
            heading,
            speed,
            timestamp
        };

        // Mettre en cache la position
        this.saveLocationToStorage(this.lastLocation);

        // Centrer la carte et afficher le marqueur
        this.updateMarkerAndCircle(latitude, longitude, accuracy);

        // Si c'est un suivi, ajouter à l'historique
        if (isTracking) {
            this.addToHistory(latitude, longitude, accuracy, timestamp);
        }

        // Afficher les informations de localisation
        this.updateLocationDisplay(latitude, longitude, accuracy, speed, heading);

        if (callback) {
            callback({ latitude, longitude, accuracy, altitude, heading, speed });
        }

        return { latitude, longitude, accuracy, altitude, heading, speed };
    }

    /**
     * Gérer les erreurs de localisation
     */
    handleLocationError(error, errorCallback) {
        let message = '';

        switch (error.code) {
            case error.PERMISSION_DENIED:
                message = 'Permission refusée. Autorisez l\'accès à votre localisation dans les paramètres.';
                break;
            case error.POSITION_UNAVAILABLE:
                message = 'Localisation indisponible. Vérifiez votre connexion GPS.';
                break;
            case error.TIMEOUT:
                message = 'Délai d\'attente dépassé pour la localisation.';
                break;
            default:
                message = 'Erreur inconnue lors de la localisation.';
        }

        console.error('[Géolocalisation] Erreur:', message);
        this.showNotification(message, 'error');

        if (errorCallback) {
            errorCallback(message);
        }
    }

    /**
     * Mettre à jour le marqueur et le cercle de précision
     */
    updateMarkerAndCircle(latitude, longitude, accuracy) {
        const latlng = [latitude, longitude];

        // Créer ou mettre à jour le marqueur
        if (this.currentMarker) {
            this.currentMarker.setLatLng(latlng);
        } else {
            this.currentMarker = L.circleMarker(latlng, {
                radius: 8,
                fillColor: '#3498db',
                color: '#fff',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.8,
                className: 'location-marker'
            })
                .bindPopup(`<strong>Votre position</strong><br>Précision: ${Math.round(accuracy)}m`)
                .addTo(this.map);
        }

        // Créer ou mettre à jour le cercle de précision
        if (this.accuracyCircle) {
            this.accuracyCircle.setLatLng(latlng).setRadius(accuracy);
        } else {
            this.accuracyCircle = L.circle(latlng, {
                radius: accuracy,
                fillColor: '#3498db',
                color: '#2980b9',
                weight: 1,
                opacity: 0.3,
                fillOpacity: 0.1,
                className: 'accuracy-circle'
            }).addTo(this.map);
        }

        // Centrer la carte
        this.map.panTo(latlng);
    }

    /**
     * Ajouter une position à l'historique et dessiner la polyline
     */
    addToHistory(latitude, longitude, accuracy, timestamp) {
        this.locationHistory.push({
            latlng: [latitude, longitude],
            accuracy,
            timestamp
        });

        // Limiter l'historique
        if (this.locationHistory.length > this.maxHistoryPoints) {
            this.locationHistory.shift();
        }

        // Redessiner la polyline
        this.updatePolyline();
    }

    /**
     * Mettre à jour la polyline de l'historique
     */
    updatePolyline() {
        const points = this.locationHistory.map(point => point.latlng);

        if (points.length > 1) {
            if (this.polyline) {
                this.polyline.setLatLngs(points);
            } else {
                this.polyline = L.polyline(points, {
                    color: '#e74c3c',
                    weight: 3,
                    opacity: 0.7,
                    smoothFactor: 1.0,
                    className: 'tracking-path'
                }).addTo(this.map);
            }
        }
    }

    /**
     * Mettre à jour l'affichage des informations de localisation
     */
    updateLocationDisplay(latitude, longitude, accuracy, speed, heading) {
        const displayId = document.getElementById('location-info');
        if (!displayId) return;

        const speedKmh = speed !== null ? (speed * 3.6).toFixed(2) : 'N/A';
        const headingDeg = heading !== null ? heading.toFixed(0) : 'N/A';

        displayId.innerHTML = `
            <div class="alert alert-info alert-dismissible fade show" role="alert">
                <strong>📍 Localisation en temps réel</strong><br>
                <small>
                    <strong>Latitude:</strong> ${latitude.toFixed(6)}<br>
                    <strong>Longitude:</strong> ${longitude.toFixed(6)}<br>
                    <strong>Précision:</strong> ±${Math.round(accuracy)}m<br>
                    <strong>Vitesse:</strong> ${speedKmh} km/h<br>
                    <strong>Direction:</strong> ${headingDeg}°
                </small>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
    }

    /**
     * Sauvegarder la position en localStorage
     */
    saveLocationToStorage(location) {
        try {
            localStorage.setItem('lastLocation', JSON.stringify({
                ...location,
                savedAt: new Date().toISOString()
            }));
        } catch (e) {
            console.warn('[Géolocalisation] Impossible de sauvegarder la position:', e);
        }
    }

    /**
     * Récupérer la dernière position sauvegardée
     */
    getLastSavedLocation() {
        try {
            const saved = localStorage.getItem('lastLocation');
            return saved ? JSON.parse(saved) : null;
        } catch (e) {
            console.warn('[Géolocalisation] Impossible de récupérer la position:', e);
            return null;
        }
    }

    /**
     * Exporter l'historique de suivi en GeoJSON
     */
    exportTrackingAsGeoJSON() {
        const features = [];

        // Ajouter les points de l'historique
        this.locationHistory.forEach((point, index) => {
            features.push({
                type: 'Feature',
                properties: {
                    index,
                    accuracy: point.accuracy,
                    timestamp: new Date(point.timestamp).toISOString()
                },
                geometry: {
                    type: 'Point',
                    coordinates: [point.latlng[1], point.latlng[0]]
                }
            });
        });

        // Ajouter la ligne de suivi
        if (this.locationHistory.length > 1) {
            const coords = this.locationHistory.map(p => [p.latlng[1], p.latlng[0]]);
            features.push({
                type: 'Feature',
                properties: {
                    name: 'Trajet suivi',
                    distance: this.calculateTrackDistance(),
                    timestamp: new Date().toISOString()
                },
                geometry: {
                    type: 'LineString',
                    coordinates: coords
                }
            });
        }

        return {
            type: 'FeatureCollection',
            features
        };
    }

    /**
     * Calculer la distance totale parcourue
     */
    calculateTrackDistance() {
        let distance = 0;

        for (let i = 1; i < this.locationHistory.length; i++) {
            const from = this.locationHistory[i - 1].latlng;
            const to = this.locationHistory[i].latlng;
            distance += this.getDistance(from, to);
        }

        return distance;
    }

    /**
     * Calculer la distance entre deux points (Haversine)
     */
    getDistance(from, to) {
        const R = 6371; // Rayon de la Terre en km
        const dLat = (to[0] - from[0]) * Math.PI / 180;
        const dLon = (to[1] - from[1]) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(from[0] * Math.PI / 180) * Math.cos(to[0] * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    /**
     * Afficher une notification
     */
    showNotification(message, type = 'info') {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show`;
        alertDiv.setAttribute('role', 'alert');
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;

        const container = document.querySelector('.container-fluid') || document.body;
        container.insertBefore(alertDiv, container.firstChild);

        setTimeout(() => alertDiv.remove(), 5000);
    }

    /**
     * Nettoyer et réinitialiser
     */
    clear() {
        this.stopTracking();

        if (this.currentMarker) {
            this.map.removeLayer(this.currentMarker);
            this.currentMarker = null;
        }

        if (this.accuracyCircle) {
            this.map.removeLayer(this.accuracyCircle);
            this.accuracyCircle = null;
        }

        if (this.polyline) {
            this.map.removeLayer(this.polyline);
            this.polyline = null;
        }

        this.locationHistory = [];
    }

    /**
     * Obtenir les statistiques de suivi
     */
    getTrackingStats() {
        if (this.locationHistory.length === 0) {
            return null;
        }

        const distance = this.calculateTrackDistance();
        const duration = this.locationHistory[this.locationHistory.length - 1].timestamp -
            this.locationHistory[0].timestamp;
        const avgAccuracy = this.locationHistory.reduce((sum, p) => sum + p.accuracy, 0) /
            this.locationHistory.length;

        return {
            totalPoints: this.locationHistory.length,
            totalDistance: distance.toFixed(3),
            duration: Math.round(duration / 1000),
            averageAccuracy: avgAccuracy.toFixed(1),
            startTime: new Date(this.locationHistory[0].timestamp).toLocaleString(),
            endTime: new Date(this.locationHistory[this.locationHistory.length - 1].timestamp).toLocaleString()
        };
    }
}

// Exporter la classe pour utilisation globale
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GeolocationManager;
}
