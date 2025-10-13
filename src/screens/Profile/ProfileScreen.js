import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  ScrollView,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../../services/supabase';
import styles from '../../styles/ProfileStyles';
import AuthContext from '../../contexts/AuthContext';

export default function ProfileScreen({ navigation }) {
  const auth = useContext(AuthContext);
  const [userData, setUserData] = useState(auth.user || null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '' });

  useEffect(() => {
    (async () => {
      try {
        const u = auth.user;
        setUserData(u || null);
        setForm({ name: u?.name || '', phone: u?.phone || '' });
      } catch (e) {
        console.warn('Erro ao carregar usuário:', e);
      } finally {
        setLoadingUser(false);
      }
    })();
  }, [auth.user]);

  const pickImage = async () => {
    try {
      const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!granted) {
        Alert.alert('Permissão negada', 'Permita o acesso à galeria para mudar a foto.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });
      if (!result.canceled) {
        setUploading(true);
        const uri = result.assets[0].uri;
        const updated = { ...userData, avatar: uri, photo_url: uri };
        setUserData(updated);
        try {
          await AsyncStorage.setItem('user', JSON.stringify(updated));
          auth.setUser && auth.setUser(updated);
        } catch (e) {
          console.warn('Erro salvando sessão local imagem:', e);
        }
        try {
          const { error } = await supabase.from('users').update({ photo_url: uri }).eq('id', userData.id);
          if (error) console.warn('Erro atualizar photo_url no Supabase:', error);
        } catch (e) {
          console.warn('Erro ao atualizar photo_url supabase:', e);
        }
        Alert.alert('Sucesso', 'Foto atualizada!');
      }
    } catch (e) {
      console.warn('Erro image pick:', e);
      Alert.alert('Erro', 'Não foi possível selecionar a imagem.');
    } finally {
      setUploading(false);
    }
  };

  const validatePhone = (phone) => {
    return phone === '' || /^[0-9+\-\s()]*$/.test(phone);
  };

  const handleSave = async () => {
    Keyboard.dismiss();
    if (!form.name.trim()) {
      Alert.alert('Erro', 'O nome é obrigatório.');
      return;
    }
    if (!validatePhone(form.phone)) {
      Alert.alert('Erro', 'Telefone contém caracteres inválidos.');
      return;
    }
    if (!userData?.id) {
      Alert.alert('Erro', 'Usuário inválido.');
      return;
    }
    setSaving(true);
    try {
      const payload = { name: form.name.trim(), phone: form.phone.trim() || null };
      const { error } = await supabase.from('users').update(payload).eq('id', userData.id);
      if (error) {
        console.warn('Erro supabase update:', error);
        Alert.alert('Erro', 'Não foi possível salvar os dados.');
      } else {
        const updatedUser = { ...userData, ...payload };
        setUserData(updatedUser);
        try {
          await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
        } catch (e) {
          console.warn('Erro salvar sessão local:', e);
        }
        auth.setUser && auth.setUser(updatedUser);
        Alert.alert('Sucesso', 'Perfil atualizado!');
        setEditing(false);
      }
    } catch (e) {
      console.warn('Erro salvar perfil:', e);
      Alert.alert('Erro', 'Falha ao salvar alterações.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert('Sair da conta', 'Deseja realmente sair?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          try {
            await auth.signOut();
          } catch (e) {
            console.warn('Erro durante signOut:', e);
            Alert.alert('Erro', 'Não foi possível sair. Tente novamente.');
          }
        },
      },
    ]);
  };

  if (loadingUser) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.center}>
        <Text style={{ color: '#fff' }}>Usuário não encontrado.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileCard}>
        <TouchableOpacity onPress={pickImage} style={styles.avatarWrap}>
          {userData.avatar ? (
            <Image source={{ uri: userData.avatar }} style={styles.avatar} />
          ) : userData.photo_url ? (
            <Image source={{ uri: userData.photo_url }} style={styles.avatar} />
          ) : (
            <Text style={styles.avatarPlaceholder}>📷</Text>
          )}
        </TouchableOpacity>

        {editing ? (
          <>
            <TextInput
              style={styles.input}
              placeholder="Nome"
              placeholderTextColor="rgba(255,255,255,0.5)"
              value={form.name}
              onChangeText={(t) => setForm((f) => ({ ...f, name: t }))}
              autoCapitalize="words"
            />
            <TextInput
              style={styles.input}
              placeholder="Telefone"
              placeholderTextColor="rgba(255,255,255,0.5)"
              value={form.phone}
              onChangeText={(t) => setForm((f) => ({ ...f, phone: t }))}
              keyboardType="phone-pad"
            />
          </>
        ) : (
          <>
            <Text style={styles.name}>{userData.name || 'Usuário'}</Text>
            <Text style={styles.email}>{userData.phone || 'Telefone não informado'}</Text>
          </>
        )}

        {uploading && <ActivityIndicator size="small" color="#fff" style={{ marginTop: 8 }} />}
      </View>

      <View style={styles.optionsCard}>
        {editing ? (
          <>
            <TouchableOpacity style={[styles.optionButton, styles.saveButton]} onPress={handleSave} disabled={saving}>
              <Text style={styles.saveButtonText}>{saving ? 'Salvando...' : 'Salvar alterações'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.optionButton, styles.cancelButton]}
              onPress={() => {
                setEditing(false);
                setForm({ name: userData.name || '', phone: userData.phone || '' });
              }}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity style={styles.optionButton} onPress={() => setEditing(true)}>
              <Text style={styles.optionText}>Editar Perfil</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.optionButton, styles.logoutButton]} onPress={handleLogout}>
              <Text style={styles.logoutText}>Sair da Conta</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
}
