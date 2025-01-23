import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Button, Alert, Modal, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import polyline from '@mapbox/polyline';
import { EXPO_PUBLIC_API_HOST } from '@env';

export default function MapScreen() {
    const [location, setLocation] = useState(null);
    const [pharmacies, setPharmacies] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [directions, setDirections] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingPharmacies, setLoadingPharmacies] = useState(false);

    const { accessToken } = useAuth();

    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Error', 'Permission to access location was denied');
                return;
            }
            const userLocation = await Location.getCurrentPositionAsync({});
            setLocation(userLocation.coords);
            console.log("Your current coordinates are:", userLocation.coords);
        })();
    }, []);

    const fetchNearbyPharmacies = async () => {
        if (!location) {
            Alert.alert('Location Not Available', 'Please try again.');
            return;
        }

        if (!accessToken) {
            Alert.alert('Error', 'Authentication token not found. Please log in again.');
            return;
        }

        setLoadingPharmacies(true);
        try {
            const url = `${EXPO_PUBLIC_API_HOST}/pharmacies/nearby-guard?lat=${location.latitude}&lng=${location.longitude}`;
            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            if (response.data && response.data.length > 0) {
                setPharmacies(response.data);
                setModalVisible(true);
            } else {
                Alert.alert('No Pharmacies Found', 'No nearby pharmacies were found.');
            }
        } catch (error) {
            Alert.alert('Error', error.response?.data?.message || 'An error occurred.');
        } finally {
            setLoadingPharmacies(false);
        }
    };

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const toRad = (value) => (value * Math.PI) / 180;
        const R = 6371; 
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) *
                Math.cos(toRad(lat2)) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return (R * c).toFixed(2); 
    };

    const getDirections = async (latitude, longitude) => {
        if (!location) {
            Alert.alert('Location Not Available', 'Please try again.');
            return;
        }

        const origin = `${location.longitude},${location.latitude}`;
        const destination = `${longitude},${latitude}`;
        const url = `http://router.project-osrm.org/route/v1/driving/${origin};${destination}?overview=full&geometries=polyline`;

        setLoading(true);
        try {
            const response = await axios.get(url);
            const route = response.data.routes[0];
            if (route && route.geometry) {
                const decodedPoints = polyline.decode(route.geometry).map(([lat, lng]) => ({
                    latitude: lat,
                    longitude: lng,
                }));
                setDirections(decodedPoints);
                setModalVisible(false); 
            } else {
                Alert.alert('Error', 'No route found.');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch directions.');
        } finally {
            setLoading(false);
        }
    };

    if (!location) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                }}
            >
                <Marker
                    coordinate={{ latitude: location.latitude, longitude: location.longitude }}
                    title="Your Location"
                />
                {pharmacies.map((pharmacy, index) => (
                    <Marker
                        key={index}
                        coordinate={{
                            latitude: pharmacy.location.lat,
                            longitude: pharmacy.location.lng,
                        }}
                        title={pharmacy.name}
                        description={pharmacy.address}
                    />
                ))}
                {directions && (
                    <Polyline
                        coordinates={directions}
                        strokeColor="#FF0000"
                        strokeWidth={4}
                    />
                )}
            </MapView>

            <View style={styles.buttonContainer}>
                <Button
                    title={loadingPharmacies ? "Loading..." : "Get Nearby Pharmacies"}
                    onPress={fetchNearbyPharmacies}
                    disabled={loadingPharmacies}
                />
            </View>

            {loading && <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />}

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Pharmacies Nearby</Text>

                        {/* Separator line */}
                        <View style={styles.separator} />

                        <FlatList
                            data={pharmacies}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <View style={styles.pharmacyItem}>
                                    <Text style={styles.pharmacyName}>{item.name}</Text>
                                    <Text style={styles.pharmacyAddress}>{item.address}</Text>
                                    <Text>
                                        Distance:{" "}
                                        {calculateDistance(
                                            location.latitude,
                                            location.longitude,
                                            item.location.lat,
                                            item.location.lng
                                        )}{" "}
                                        km
                                    </Text>
                                    <TouchableOpacity
                                        style={styles.directionButton}
                                        onPress={() =>
                                            getDirections(item.location.lat, item.location.lng)
                                        }
                                    >
                                        <Text style={styles.directionButtonText}>Get Directions</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        />
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { flex: 1 },
    buttonContainer: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center', 
    },
    separator: {
        height: 1,
        backgroundColor: '#ccc',  
        marginVertical: 10,  
    },    
    pharmacyItem: { marginBottom: 15 },
    pharmacyName: { fontSize: 16, fontWeight: 'bold' },
    pharmacyAddress: { fontSize: 14 },
    directionButton: {
        marginTop: 10,
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 5,
    },
    directionButtonText: { color: 'white', fontWeight: 'bold' },
    closeButton: {
        marginTop: 20,
        backgroundColor: '#f44336',
        padding: 10,
        borderRadius: 5,
        alignSelf: 'center', 
    },
    closeButtonText: { color: 'white', fontWeight: 'bold' },
    loadingIndicator: {
        position: 'absolute',
        top: '50%',
        left: '50%',
    },
});
