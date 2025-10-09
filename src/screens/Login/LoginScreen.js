import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './LoginScreen.style';

const LoginScreen = ({ navigation }) => {
  const { width } = Dimensions.get('window');
  const logoSize = Math.min(width * 0.55, 220);
  const [focusedInput, setFocusedInput] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.replace('Home');
    }, 1500);
  };

  return (
    <LinearGradient
      colors={['#000000', '#1a1a1a', '#474747ff']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1, width: '100%' }}
      >
        <ScrollView
          contentContainerStyle={{ alignItems: 'center', justifyContent: 'center', flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <Image source={require('../../../assets/logo.png')}
            style={[styles.logo, { width: logoSize, height: logoSize }]}
          />
          <Text style={styles.salonName}>Beauty Studio</Text>

          <View style={styles.inputContainer}>
            <TextInput
              placeholder='CPF ou Telefone'
              placeholderTextColor="rgba(245,245,245,0.6)"
              style={[
                styles.inputField,
                focusedInput === 'cpf' && styles.inputFieldFocused
              ]}
              onFocus={() => setFocusedInput('cpf')}
              onBlur={() => setFocusedInput(null)}
            />

            <TextInput
              placeholder='Senha'
              placeholderTextColor="rgba(245,245,245,0.6)"
              style={[
                styles.inputField,
                focusedInput === 'senha' && styles.inputFieldFocused
              ]}
              secureTextEntry
              onFocus={() => setFocusedInput('senha')}
              onBlur={() => setFocusedInput(null)}
            />
          </View>
          <TouchableOpacity style={styles.loginButton}
            activeOpacity={0.8}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>Entrar</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default LoginScreen;
