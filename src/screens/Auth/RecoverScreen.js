import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from '../../styles/AuthStyles';

export default function RecoverScreen({ navigation }) {
  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRecover = async () => {
    if (!identifier.trim()) {
      Alert.alert('Aviso', 'Digite CPF ou telefone para recuperar.');
      return;
    }
    setLoading(true);
    try {
      setTimeout(() => {
        setLoading(false);
        Alert.alert('Pronto', 'Se o usuário existir, recebeu instruções por SMS/e-mail (simulado).');
        navigation.goBack();
      }, 700);
    } catch (e) {
      console.warn('Erro recover:', e);
      setLoading(false);
      Alert.alert('Erro', 'Falha ao tentar recuperar a senha.');
    }
  };

  return (
    <LinearGradient colors={['#0b0b0b', '#121212']} style={{ flex: 1 }}>
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 20, alignItems: 'center' }}
        enableOnAndroid
        extraScrollHeight={Platform.OS === 'ios' ? 120 : 80}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Text style={styles.salonTextName}>Recuperar senha</Text>
          <Text style={[styles.loginText, { marginBottom: 8 }]}>Informe CPF ou número de celular</Text>

          <TextInput
            placeholder="CPF ou celular"
            placeholderTextColor="rgba(255,255,255,0.6)"
            style={styles.inputField}
            value={identifier}
            onChangeText={setIdentifier}
            keyboardType="phone-pad"
            returnKeyType="send"
          />

          <TouchableOpacity style={styles.primaryButton} onPress={handleRecover} disabled={loading}>
            {loading ? <ActivityIndicator size="small" color="#0b0b0b" /> : <Text style={styles.primaryButtonText}>Enviar instruções</Text>}
          </TouchableOpacity>

          <TouchableOpacity style={styles.outlineButton} onPress={() => navigation.goBack()}>
            <Text style={styles.outlineButtonText}>Voltar ao login</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </LinearGradient>
  );
}
