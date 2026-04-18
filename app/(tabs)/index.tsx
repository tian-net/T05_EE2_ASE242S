import React, { useState } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Switch } from 'react-native';
import { useCustomer } from '../../hooks/useCustomer';
import { CustomerForm } from '../../components/CustomerForm';

export default function App() {
    const { customers, loading, saveCustomer, deleteCustomer, restoreCustomer, fetchCustomers } = useCustomer();
    const [modalVisible, setModalVisible] = useState(false);
    const [selected, setSelected] = useState<any>(null);
    const [showDeleted, setShowDeleted] = useState(false);

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
                <ActivityIndicator size="large" color="#4A90E2" />
                <Text style={styles.loaderText}>Sincronizando con MongoDB...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Gestión de Clientes</Text>

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

            <FlatList
                data={customers}
                keyExtractor={(item: any) => item.id!}
                ListEmptyComponent={<Text style={styles.emptyText}>No hay registros para mostrar.</Text>}
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
    container: { flex: 1, backgroundColor: '#F5F7FA', padding: 15, paddingTop: 60 },
    header: { fontSize: 26, fontWeight: 'bold', marginBottom: 15, textAlign: 'center', color: '#2C3E50' },
    toggleContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, backgroundColor: '#fff', padding: 12, borderRadius: 12, elevation: 2 },
    toggleText: { fontWeight: '700', color: '#4A90E2' },
    card: { backgroundColor: 'white', padding: 18, borderRadius: 12, marginBottom: 12, flexDirection: 'row', elevation: 3 },
    cardDeleted: { borderLeftWidth: 6, borderLeftColor: '#E94B3C', backgroundColor: '#FEF9F9' },
    name: { fontWeight: 'bold', fontSize: 18, color: '#2C3E50' },
    sub: { color: '#7F8C8D', marginTop: 4, fontSize: 14 },
    emptyText: { textAlign: 'center', marginTop: 50, color: '#BDC3C7', fontSize: 16 },
    actions: { justifyContent: 'space-between', alignItems: 'center', marginLeft: 10, minWidth: 80 },
    editBtn: { color: '#4A90E2', fontWeight: 'bold', fontSize: 16, marginBottom: 12 },
    deleteBtn: { color: '#E94B3C', fontWeight: 'bold', fontSize: 22 },
    restoreBtn: { color: '#27AE60', fontWeight: 'bold', fontSize: 13, backgroundColor: '#E8F5E9', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
    fab: { position: 'absolute', right: 25, bottom: 25, backgroundColor: '#4A90E2', width: 65, height: 65, borderRadius: 32.5, justifyContent: 'center', alignItems: 'center', elevation: 8 },
    fabText: { color: 'white', fontSize: 35, fontWeight: '300' },
    loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F7FA' },
    loaderText: { marginTop: 15, color: '#7F8C8D', fontSize: 16 }
});