import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from '../../styles/AuthStyles';
import Image from 'react-native/Libraries/Image/Image';
import { createUser } from '../../services/supabase';

const RegisterScreen = ({ navigation }) => {
  const { width } = Dimensions.get('window');
  const logoSize = Math.min(width * 0.28, 120);

  const [focusedInput, setFocusedInput] = useState(null);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
  if (!name.trim() || !cpf.trim() || !phone.trim() || !password) return;
  setLoading(true);
  const { data, error } = await createUser({ name, cpf, phone, password });
  setLoading(false);
  if (error) {
    alert(error.message || 'Erro ao cadastrar');
    return;
  }
  alert('Cadastro realizado com sucesso!');
  navigation.replace('Login');
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
          <Text style={styles.salonTextName}>Criar Conta</Text>

          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Nome completo"
              placeholderTextColor="rgba(255,255,255,0.65)"
              style={[styles.inputField, focusedInput === 'nome' && styles.inputFieldFocused]}
              value={name}
              onChangeText={setName}
              onFocus={() => setFocusedInput('nome')}
              onBlur={() => setFocusedInput(null)}
              returnKeyType="next"
            />

            <TextInput
              placeholder="CPF"
              placeholderTextColor="rgba(255,255,255,0.65)"
              style={[styles.inputField, focusedInput === 'cpf' && styles.inputFieldFocused]}
              value={cpf}
              onChangeText={setCpf}
              keyboardType="number-pad"
              onFocus={() => setFocusedInput('cpf')}
              onBlur={() => setFocusedInput(null)}
              returnKeyType="next"
            />

            <TextInput
              placeholder="Número de celular"
              placeholderTextColor="rgba(255,255,255,0.65)"
              style={[styles.inputField, focusedInput === 'cel' && styles.inputFieldFocused]}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              onFocus={() => setFocusedInput('cel')}
              onBlur={() => setFocusedInput(null)}
              returnKeyType="next"
            />

            <TextInput
              placeholder="Senha"
              placeholderTextColor="rgba(255,255,255,0.65)"
              style={[styles.inputField, focusedInput === 'senha' && styles.inputFieldFocused]}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              onFocus={() => setFocusedInput('senha')}
              onBlur={() => setFocusedInput(null)}
              returnKeyType="done"
            />
          </View>

          <TouchableOpacity style={styles.primaryButton} onPress={handleRegister} disabled={loading}>
            {loading ? <ActivityIndicator size="small" color="#0b0b0b" /> : <Text style={styles.primaryButtonText}>Cadastrar conta</Text>}
          </TouchableOpacity>

          <TouchableOpacity style={styles.outlineButton} onPress={() => navigation.goBack()}>
            <Text style={styles.outlineButtonText}>Já tenho uma conta — Entrar</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </LinearGradient>
  );
};

export default RegisterScreen;
