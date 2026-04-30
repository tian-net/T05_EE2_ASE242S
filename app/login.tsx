import React, { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
// IMPORTANTE: Nombres en minúsculas para evitar errores en Metro
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const MOCK_USER = {
  email: 'admin@elchino.com',
  password: 'password123'
};

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Campos vacíos", "Por favor, completa tus credenciales para zarpar.");
      return;
    }

    setIsLoading(true);

    // Simulación de consulta a la base de datos
    setTimeout(() => {
      setIsLoading(false);

      if (email === MOCK_USER.email && password === MOCK_USER.password) {
        // Navegación a la carpeta de tabs
        router.replace('/(tabs)');
      } else {
        Alert.alert(
          "Error de Autenticación",
          "El usuario o contraseña no coinciden con nuestros registros marinos."
        );
      }
    }, 1200);
  };

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>🌊 El Chino</ThemedText>
          <ThemedText style={styles.subtitle}>Sabor Marino & Marketplace</ThemedText>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="admin@elchino.com"
              placeholderTextColor="#90e0ef"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="password123"
              placeholderTextColor="#90e0ef"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!isLoading}
            />
          </View>

          <TouchableOpacity
            style={[styles.loginButton, isLoading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <ThemedText style={styles.buttonText}>INGRESAR</ThemedText>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <ThemedText style={styles.footerText}>© 2026 Valle Grande - Cañete</ThemedText>
        </View>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0077b6' },
  content: { flex: 1, justifyContent: 'center', padding: 25 },
  header: { alignItems: 'center', marginBottom: 40 },
  title: { color: '#caf0f8', fontSize: 42, fontWeight: 'bold' },
  subtitle: { color: '#ade8f4', fontSize: 16, marginTop: 10 },
  form: { backgroundColor: 'rgba(255, 255, 255, 0.15)', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.3)' },
  inputContainer: { backgroundColor: '#fff', borderRadius: 12, marginBottom: 15, paddingHorizontal: 15, height: 55, justifyContent: 'center' },
  input: { fontSize: 16, color: '#03045e' },
  loginButton: { backgroundColor: '#00b4d8', height: 55, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  buttonDisabled: { backgroundColor: '#90e0ef' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  footer: { position: 'absolute', bottom: 40, left: 0, right: 0, alignItems: 'center' },
  footerText: { color: '#caf0f8', fontSize: 12, opacity: 0.7 }
});