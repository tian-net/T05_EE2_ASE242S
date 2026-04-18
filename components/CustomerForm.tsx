import React, { useState, useEffect } from 'react';
import {
    View, Text, TextInput, StyleSheet, Switch,
    Modal, ScrollView, TouchableOpacity, Alert
} from 'react-native';
import { Customer } from '../interfaces/Customer';

export const CustomerForm = ({ visible, onClose, onSave, customerToEdit }: any) => {
    const defaultForm: Customer = {
        firstName: '', lastName: '', phone: '',
        email: '', docType: 'DNI', docNum: '', isFrequent: false
    };

    const [form, setForm] = useState<Customer>(defaultForm);
    const [errors, setErrors] = useState({ email: '', phone: '', docNum: '' });

    useEffect(() => {
        setForm(customerToEdit || defaultForm);
        setErrors({ email: '', phone: '', docNum: '' });
    }, [customerToEdit, visible]);

    // --- VALIDACIONES Y FILTROS EN TIEMPO REAL ---

    const handleNameChange = (field: 'firstName' | 'lastName', value: string) => {
        // Filtro: Solo letras, espacios y caracteres especiales de español
        const cleanValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]/g, '');
        setForm({ ...form, [field]: cleanValue });
    };

    const handlePhoneChange = (value: string) => {
        const cleanValue = value.replace(/[^0-9]/g, ''); // Solo números
        setForm({ ...form, phone: cleanValue });

        if (cleanValue.length > 0) {
            if (cleanValue[0] !== '9') {
                setErrors(prev => ({ ...prev, phone: 'Debe iniciar con 9' }));
            } else if (cleanValue.length !== 9) {
                setErrors(prev => ({ ...prev, phone: 'Deben ser 9 dígitos' }));
            } else {
                setErrors(prev => ({ ...prev, phone: '' }));
            }
        } else {
            setErrors(prev => ({ ...prev, phone: '' }));
        }
    };

    const handleDocChange = (value: string) => {
        let cleanValue = value;
        // DNI y RUC: Solo números. CE y Pasaporte: Alfanumérico.
        if (form.docType === 'DNI' || form.docType === 'RUC') {
            cleanValue = value.replace(/[^0-9]/g, '');
        } else {
            cleanValue = value.replace(/[^a-zA-Z0-9]/g, '');
        }

        setForm({ ...form, docNum: cleanValue });

        // Validación de longitud según reglas del negocio
        if (form.docType === 'DNI' && cleanValue.length !== 8) {
            setErrors(prev => ({ ...prev, docNum: 'DNI requiere 8 dígitos' }));
        } else if (form.docType === 'RUC' && cleanValue.length !== 11) {
            setErrors(prev => ({ ...prev, docNum: 'RUC requiere 11 dígitos' }));
        } else if ((form.docType === 'CarnetExtranjeria' || form.docType === 'Pasaporte') && (cleanValue.length < 5)) {
            setErrors(prev => ({ ...prev, docNum: 'Mínimo 5 caracteres' }));
        } else {
            setErrors(prev => ({ ...prev, docNum: '' }));
        }
    };

    const handleEmailChange = (value: string) => {
        setForm({ ...form, email: value });
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value.length > 0 && !emailRegex.test(value)) {
            setErrors(prev => ({ ...prev, email: 'Formato: ejemplo@dominio.com' }));
        } else {
            setErrors(prev => ({ ...prev, email: '' }));
        }
    };

    const handleSave = () => {
        // Verificación de campos obligatorios
        if (!form.firstName || !form.lastName || !form.email || !form.docNum || !form.phone) {
            Alert.alert("Campos incompletos", "Por favor, llena todos los campos antes de guardar.");
            return;
        }

        if (errors.email || errors.phone || errors.docNum) {
            Alert.alert("Error de validación", "Existen errores en los datos ingresados.");
            return;
        }

        onSave(form);
        onClose();
    };

    return (
        <Modal visible={visible} animationType="slide">
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>{customerToEdit ? 'Editar Cliente' : 'Nuevo Cliente'}</Text>

                <Text style={styles.label}>Nombres</Text>
                <TextInput
                    style={styles.input}
                    value={form.firstName}
                    placeholder="Ej. Juan Manuel"
                    placeholderTextColor="#BDC3C7"
                    onChangeText={v => handleNameChange('firstName', v)}
                />

                <Text style={styles.label}>Apellidos</Text>
                <TextInput
                    style={styles.input}
                    value={form.lastName}
                    placeholder="Ej. Pérez Rossi"
                    placeholderTextColor="#BDC3C7"
                    onChangeText={v => handleNameChange('lastName', v)}
                />

                <Text style={styles.label}>Tipo de Documento</Text>
                <View style={styles.typeSelector}>
                    {['DNI', 'RUC', 'CarnetExtranjeria', 'Pasaporte'].map((type) => (
                        <TouchableOpacity
                            key={type}
                            style={[styles.typeBtn, form.docType === type && styles.typeBtnActive]}
                            onPress={() => {
                                setForm({...form, docType: type as any, docNum: ''});
                                setErrors(prev => ({...prev, docNum: ''}));
                            }}
                        >
                            <Text style={[styles.typeBtnText, form.docType === type && styles.typeBtnTextActive]}>
                                {type === 'CarnetExtranjeria' ? 'C.E.' : type}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.labelRow}>
                    <Text style={styles.label}>Nro. de {form.docType}</Text>
                    {errors.docNum ? <Text style={styles.errorText}>{errors.docNum}</Text> : null}
                </View>
                <TextInput
                    style={[styles.input, errors.docNum ? styles.inputError : null]}
                    value={form.docNum}
                    autoCapitalize="characters"
                    placeholder={form.docType === 'DNI' ? "Ej. 70605040" : form.docType === 'RUC' ? "Ej. 20123456789" : "Ej. AB123456"}
                    placeholderTextColor="#BDC3C7"
                    keyboardType={form.docType === 'DNI' || form.docType === 'RUC' ? "numeric" : "default"}
                    maxLength={form.docType === 'DNI' ? 8 : form.docType === 'RUC' ? 11 : 12} // Límites según esquema
                    onChangeText={handleDocChange}
                />

                <View style={styles.labelRow}>
                    <Text style={styles.label}>Celular (Perú)</Text>
                    {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}
                </View>
                <TextInput
                    style={[styles.input, errors.phone ? styles.inputError : null]}
                    value={form.phone}
                    keyboardType="numeric"
                    maxLength={9} // Límite exacto de 9 dígitos
                    placeholder="Ej. 912345678"
                    placeholderTextColor="#BDC3C7"
                    onChangeText={handlePhoneChange}
                />

                <View style={styles.labelRow}>
                    <Text style={styles.label}>Correo Electrónico</Text>
                    {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
                </View>
                <TextInput
                    style={[styles.input, errors.email ? styles.inputError : null]}
                    value={form.email}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    placeholder="Ej. cliente@chino.com"
                    placeholderTextColor="#BDC3C7"
                    onChangeText={handleEmailChange}
                />

                <View style={styles.row}>
                    <Text style={{fontWeight: 'bold'}}>¿Es Cliente Frecuente?</Text>
                    <Switch
                        value={form.isFrequent}
                        onValueChange={v => setForm({...form, isFrequent: v})}
                    />
                </View>

                <View style={styles.rowBtn}>
                    <TouchableOpacity style={[styles.actionBtn, {backgroundColor: '#E94B3C'}]} onPress={onClose}>
                        <Text style={styles.actionBtnText}>CANCELAR</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionBtn, {backgroundColor: '#4A90E2'}]} onPress={handleSave}>
                        <Text style={styles.actionBtnText}>GUARDAR</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: { padding: 25, backgroundColor: '#fff', paddingBottom: 50 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#2C3E50' },
    labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15 },
    label: { fontWeight: 'bold', color: '#34495E' },
    input: { borderBottomWidth: 1, borderColor: '#BDC3C7', paddingVertical: 8, marginBottom: 5, fontSize: 16, color: '#2C3E50' },
    inputError: { borderColor: '#E94B3C' },
    errorText: { color: '#E94B3C', fontSize: 11, fontWeight: '600' },
    typeSelector: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10, gap: 5 },
    typeBtn: { padding: 8, borderWidth: 1, borderColor: '#4A90E2', alignItems: 'center', borderRadius: 8, minWidth: '22%' },
    typeBtnActive: { backgroundColor: '#4A90E2' },
    typeBtnText: { color: '#4A90E2', fontWeight: 'bold', fontSize: 11 },
    typeBtnTextActive: { color: '#fff' },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 20 },
    rowBtn: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
    actionBtn: { paddingVertical: 14, width: '45%', borderRadius: 10, elevation: 3 },
    actionBtnText: { color: 'white', fontWeight: 'bold', textAlign: 'center' }
});