import React, { useState } from 'react';
import { View, Text, Image, Dimensions, TextInput, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from '../../styles/AuthStyles';

const LoginScreen = ({ navigation }) => {
  const { width } = Dimensions.get('window');
  const logoSize = Math.min(width * 0.36, 140);

  const [focusedInput, setFocusedInput] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.replace('Home');
    }, 1200);
  };

  return (
    <LinearGradient
      colors={['#0b0b0b', '#121212']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.8, y: 1 }}
      style={{ flex: 1 }}
    >
      <KeyboardAwareScrollView
        contentContainerStyle={{ alignItems: 'center', justifyContent: 'center', flexGrow: 1, padding: 20 }}
        enableOnAndroid
        extraScrollHeight={Platform.OS === 'ios' ? 120 : 80}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Image source={require('../../../assets/logo.png')} style={[styles.logo, { width: logoSize, height: logoSize }]} />
          <Text style={styles.salonTextName}>Bem-vinda(o) à Beauty Studio</Text>
          <Text style={styles.loginText}>Entre em sua conta</Text>

          <View style={styles.inputContainer}>
            <TextInput
              placeholder="CPF ou Número de celular"
              placeholderTextColor="rgba(255,255,255,0.65)"
              style={[styles.inputField, focusedInput === 'cpf' && styles.inputFieldFocused]}
              onFocus={() => setFocusedInput('cpf')}
              onBlur={() => setFocusedInput(null)}
              keyboardType="phone-pad"
              returnKeyType="next"
              selectionColor="#fff"
            />

            <TextInput
              placeholder="Senha"
              placeholderTextColor="rgba(255,255,255,0.65)"
              style={[styles.inputField, focusedInput === 'senha' && styles.inputFieldFocused]}
              secureTextEntry
              onFocus={() => setFocusedInput('senha')}
              onBlur={() => setFocusedInput(null)}
              returnKeyType="done"
              selectionColor="#fff"
            />
          </View>

          <TouchableOpacity style={styles.primaryButton} onPress={handleLogin} disabled={loading}>
            {loading ? <ActivityIndicator size="small" color="#0b0b0b" /> : <Text style={styles.primaryButtonText}>Entrar</Text>}
          </TouchableOpacity>

          <View style={styles.linksRow}>
            <TouchableOpacity onPress={() => navigation.navigate('Recover')}>
              <Text style={styles.linkText}>Recuperar senha</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.linkText}>Cadastrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </LinearGradient>
  );
};

export default LoginScreen;
