import React, { useState } from 'react';
import {
    View,
    FlatList,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Switch,
    Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { useCustomer } from '../../hooks/useCustomer';
import { CustomerForm } from '../../components/CustomerForm';

export default function App() {
    const router = useRouter();
    const { customers, loading, saveCustomer, deleteCustomer, restoreCustomer, fetchCustomers } = useCustomer();

    const [modalVisible, setModalVisible] = useState(false);
    const [selected, setSelected] = useState<any>(null);
    const [showDeleted, setShowDeleted] = useState(false);

    // --- Lógica de Cerrar Sesión ---
    const handleLogout = () => {
        Alert.alert(
            "Cerrar Sesión",
            "¿Deseas salir del sistema de El Chino?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Salir",
                    style: "destructive",
                    onPress: () => {
                        // replace asegura que el usuario no pueda volver atrás con el botón físico del cel
                        router.replace('/login');
                    }
                }
            ]
        );
    };

    const handleToggle = (value: boolean) => {
        setShowDeleted(value);
        fetchCustomers(value);
    };

    const openForm = (c?: any) => {
        setSelected(c || null);
        setModalVisible(true);
    };

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#0077b6" />
                <Text style={styles.loaderText}>Sincronizando con MongoDB...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Cabecera con Botón de Salir */}
            <View style={styles.headerContainer}>
                <View>
                    <Text style={styles.headerTitle}>El Chino</Text>
                    <Text style={styles.headerSubtitle}>Gestión de Clientes</Text>
                </View>
                <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                    <Text style={styles.logoutBtnText}>Salir</Text>
                </TouchableOpacity>
            </View>

            {/* Selector de Activos / Papelera */}
            <View style={styles.toggleContainer}>
                <Text style={[styles.toggleText, showDeleted && { color: '#E94B3C' }]}>
                    {showDeleted ? "Papelera de Reciclaje" : "Listado de Activos"}
                </Text>
                <Switch
                    value={showDeleted}
                    onValueChange={handleToggle}
                    trackColor={{ false: "#D1D1D1", true: "#FADBD8" }}
                    thumbColor={showDeleted ? "#E94B3C" : "#f4f3f4"}
                />
            </View>

            {/* Lista de Registros */}
            <FlatList
                data={customers}
                keyExtractor={(item: any) => item.id!}
                contentContainerStyle={{ paddingBottom: 100 }}
                ListEmptyComponent={<Text style={styles.emptyText}>No hay registros marinos aquí.</Text>}
                renderItem={({ item }) => (
                    <View style={[styles.card, item.isDeleted && styles.cardDeleted]}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.name}>{item.firstName} {item.lastName}</Text>
                            <Text style={styles.sub}>
                                <Text style={{fontWeight: 'bold'}}>{item.docType}:</Text> {item.docNum}
                            </Text>
                            <Text style={styles.sub}>Celular: {item.phone}</Text>
                        </View>

                        <View style={styles.actions}>
                            {!item.isDeleted ? (
                                <>
                                    <TouchableOpacity onPress={() => openForm(item)}>
                                        <Text style={styles.editBtn}>Editar</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => deleteCustomer(item.id!)}>
                                        <Text style={styles.deleteBtn}>X</Text>
                                    </TouchableOpacity>
                                </>
                            ) : (
                                <TouchableOpacity onPress={() => restoreCustomer(item.id!)}>
                                    <Text style={styles.restoreBtn}>Restaurar</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                )}
            />

            {/* Botón Flotante para Agregar */}
            {!showDeleted && (
                <TouchableOpacity style={styles.fab} onPress={() => openForm()}>
                    <Text style={styles.fabText}>+</Text>
                </TouchableOpacity>
            )}

            <CustomerForm
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onSave={saveCustomer}
                customerToEdit={selected}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F0F4F8', padding: 20, paddingTop: 60 },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20
    },
    headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#03045e' },
    headerSubtitle: { fontSize: 14, color: '#0077b6', marginTop: -5 },
    logoutBtn: {
        backgroundColor: '#E94B3C',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 10,
        elevation: 2
    },
    logoutBtnText: { color: 'white', fontWeight: 'bold' },
    toggleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 15,
        elevation: 2
    },
    toggleText: { fontWeight: '700', color: '#0077b6' },
    card: { backgroundColor: 'white', padding: 18, borderRadius: 15, marginBottom: 12, flexDirection: 'row', elevation: 3 },
    cardDeleted: { borderLeftWidth: 6, borderLeftColor: '#E94B3C', backgroundColor: '#FEF9F9' },
    name: { fontWeight: 'bold', fontSize: 18, color: '#2C3E50' },
    sub: { color: '#7F8C8D', marginTop: 4, fontSize: 14 },
    emptyText: { textAlign: 'center', marginTop: 50, color: '#BDC3C7', fontSize: 16 },
    actions: { justifyContent: 'space-between', alignItems: 'center', marginLeft: 10, minWidth: 80 },
    editBtn: { color: '#0077b6', fontWeight: 'bold', fontSize: 16, marginBottom: 12 },
    deleteBtn: { color: '#E94B3C', fontWeight: 'bold', fontSize: 22 },
    restoreBtn: { color: '#27AE60', fontWeight: 'bold', fontSize: 13, backgroundColor: '#E8F5E9', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
    fab: { position: 'absolute', right: 25, bottom: 25, backgroundColor: '#0077b6', width: 65, height: 65, borderRadius: 32.5, justifyContent: 'center', alignItems: 'center', elevation: 8 },
    fabText: { color: 'white', fontSize: 35, fontWeight: '300' },
    loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F0F4F8' },
    loaderText: { marginTop: 15, color: '#0077b6', fontSize: 16, fontWeight: '500' }
});