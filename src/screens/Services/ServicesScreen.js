import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  TextInput,
  RefreshControl,
  Modal,
  Alert,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../../services/supabase';
import styles from '../../styles/ServicesStyles';

export default function ServiceScreen({ navigation }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [query, setQuery] = useState('');
  const [user, setUser] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [svcForm, setSvcForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image_url: '',
  });
  const [savingService, setSavingService] = useState(false);

  const normalizePrice = (priceStr) => {
    if (priceStr == null || priceStr === '') return null;
    const cleaned = String(priceStr).replace(/\s/g, '').replace(',', '.');
    const n = parseFloat(cleaned);
    return Number.isFinite(n) ? n : null;
  };

  const fetchServices = async () => {
    if (!refreshing) setLoading(true);
    try {
      const { data, error } = await supabase.from('services').select('*').order('name', { ascending: true });
      if (error) throw error;
      setServices(data || []);
    } catch (e) {
      console.warn('Erro buscar services', e);
      setServices([]);
      Alert.alert('Erro', 'Não foi possível carregar serviços.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchServices();
  }, []);

  useFocusEffect(
    useCallback(() => {
      let mounted = true;
      (async () => {
        setLoading(true);
        try {
          const raw = await AsyncStorage.getItem('user');
          let parsed = raw ? JSON.parse(raw) : null;

          if (parsed?.id) {
            try {
              const { data: freshUser } = await supabase.from('users').select('*').eq('id', parsed.id).maybeSingle();
              if (freshUser) {
                parsed = freshUser;
                await AsyncStorage.setItem('user', JSON.stringify(freshUser));
              }
            } catch (e) {
            }
            if (mounted) setUser(parsed);
          } else {
            if (mounted) setUser(null);
          }

          await fetchServices();
        } catch (e) {
        } finally {
          if (mounted) setLoading(false);
        }
      })();

      return () => {
        mounted = false;
      };
    }, [])
  );

  const openNewServiceModal = () => {
    setEditingService(null);
    setSvcForm({ name: '', description: '', price: '', category: '', image_url: '' });
    setModalVisible(true);
  };

  const openEditServiceModal = (svc) => {
    setEditingService(svc);
    setSvcForm({
      name: svc.name || '',
      description: svc.description || '',
      price: svc.price != null ? String(svc.price) : '',
      category: svc.category || '',
      image_url: svc.image_url || '',
    });
    setModalVisible(true);
  };

  const handleDeleteService = async (svc) => {
    Alert.alert(
      'Confirmar exclusão',
      `Excluir o serviço "${svc.name}"? Esta ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              const { error } = await supabase.from('services').delete().eq('id', svc.id);
              if (error) throw error;
              await fetchServices();
              Alert.alert('Sucesso', 'Serviço excluído');
            } catch (e) {
              console.warn('Erro ao excluir service:', e);
              Alert.alert('Erro', 'Não foi possível excluir o serviço.');
            } finally {
              setLoading(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleSaveService = async () => {
    if (!svcForm.name.trim()) {
      Alert.alert('Erro', 'Nome é obrigatório');
      return;
    }
    const priceVal = normalizePrice(svcForm.price);

    setSavingService(true);
    try {
      const payload = {
        name: svcForm.name.trim(),
        description: svcForm.description ? svcForm.description.trim() : null,
        price: priceVal,
        category: svcForm.category ? svcForm.category.trim() : null,
        image_url: svcForm.image_url ? svcForm.image_url.trim() : null,
      };

      if (editingService) {
        const { error } = await supabase.from('services').update(payload).eq('id', editingService.id);
        if (error) throw error;
        Alert.alert('Sucesso', 'Serviço atualizado');
      } else {
        const { error } = await supabase.from('services').insert([payload]);
        if (error) throw error;
        Alert.alert('Sucesso', 'Serviço criado');
      }

      setModalVisible(false);
      fetchServices();
    } catch (e) {
      console.warn('Erro salvar service', e);
      Alert.alert('Erro', 'Não foi possível salvar o serviço.');
    } finally {
      setSavingService(false);
    }
  };

  const filtered = services.filter((s) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (s.name || '').toLowerCase().includes(q) || (s.description || '').toLowerCase().includes(q);
  });

  const renderItem = ({ item }) => {
    const priceText = item.price != null ? `R$ ${Number(item.price).toFixed(2).replace('.', ',')}` : '--';
    const imageSource = item.image_url && typeof item.image_url === 'string' && item.image_url.startsWith('http')
      ? { uri: item.image_url }
      : require('../../../assets/logo.png');

    return (
      <View style={styles.card}>
        <View style={styles.cardLeft}>
          <Image source={imageSource} style={styles.thumb} resizeMode="contain" />
        </View>

        <View style={styles.cardBody}>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.desc}>
            {item.description ? (item.description.length > 80 ? `${item.description.slice(0, 80)}...` : item.description) : ''}
          </Text>

          <View style={styles.cardFooter}>
            <Text style={styles.price}>{priceText}</Text>

            {user?.user_type === 'admin' ? (
              <View style={styles.adminActionsRow}>
                <TouchableOpacity style={styles.editBtn} onPress={() => openEditServiceModal(item)}>
                  <Text style={styles.editBtnText}>Editar</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.outlineBtn} onPress={() => handleDeleteService(item)}>
                  <Text style={styles.outlineBtnText}>Excluir</Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        </View>
      </View>
    );
  };

  if (loading && !refreshing) {
    return (
      <LinearGradient colors={['#0b0b0b', '#121212']} style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#0b0b0b', '#121212']} style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <View style={[styles.header, { justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }]}>
          <View>
            <Text style={styles.headerTitle}>Serviços</Text>
            <Text style={styles.headerSubtitle}>Escolha o serviço</Text>
          </View>

          {user?.user_type === 'admin' && (
            <TouchableOpacity onPress={openNewServiceModal} style={styles.actionBtn}>
              <Text style={styles.actionBtnText}>+ Novo</Text>
            </TouchableOpacity>
          )}
        </View>

        {user?.user_type === 'admin' ? (
          <View style={{ backgroundColor: 'rgba(42,124,255,0.08)', padding: 10, borderRadius: 10, marginBottom: 10 }}>
            <Text style={{ color: '#fff', fontWeight: '700' }}>MODO ADMIN — você pode criar, editar e excluir serviços</Text>
          </View>
        ) : null}

        <View style={styles.searchRow}>
          <TextInput
            placeholder="Buscar serviço..."
            placeholderTextColor="rgba(255,255,255,0.55)"
            value={query}
            onChangeText={setQuery}
            style={styles.searchInput}
            returnKeyType="search"
          />
          <TouchableOpacity style={styles.refreshBtn} onPress={fetchServices}>
            <Text style={styles.refreshBtnText}>Atualizar</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={filtered}
          keyExtractor={(it) => it.id}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          contentContainerStyle={{ paddingBottom: 120, paddingTop: 6 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={() => (
            <View style={styles.center}>
              <Text style={styles.emptyText}>Nenhum serviço encontrado.</Text>
            </View>
          )}
        />

        <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => setModalVisible(false)}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'center', padding: 20 }}>
              <ScrollView style={{ maxHeight: '92%' }} contentContainerStyle={{ padding: 12, backgroundColor: '#1a1a1a', borderRadius: 12 }}>
                <Text style={styles.modalTitle}>{editingService ? 'Editar Serviço' : 'Novo Serviço'}</Text>

                <TextInput
                  placeholder="Nome"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  value={svcForm.name}
                  onChangeText={(t) => setSvcForm((f) => ({ ...f, name: t }))}
                  style={styles.modalInput}
                />

                <TextInput
                  placeholder="Descrição"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  value={svcForm.description}
                  onChangeText={(t) => setSvcForm((f) => ({ ...f, description: t }))}
                  multiline
                  style={[styles.modalInput, { height: 100 }]}
                />

                <TextInput
                  placeholder="Preço (ex: 85.00)"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  value={svcForm.price}
                  onChangeText={(t) => setSvcForm((f) => ({ ...f, price: t }))}
                  keyboardType="numeric"
                  style={styles.modalInput}
                />

                <TextInput
                  placeholder="Categoria"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  value={svcForm.category}
                  onChangeText={(t) => setSvcForm((f) => ({ ...f, category: t }))}
                  style={styles.modalInput}
                />

                <TextInput
                  placeholder="Imagem (url) - deixar vazio para usar logo"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  value={svcForm.image_url}
                  onChangeText={(t) => setSvcForm((f) => ({ ...f, image_url: t }))}
                  style={styles.modalInput}
                  autoCapitalize="none"
                />

                {svcForm.image_url ? (
                  <View style={{ alignItems: 'center', marginBottom: 8 }}>
                    <Image source={{ uri: svcForm.image_url }} style={{ width: 160, height: 90, borderRadius: 8 }} resizeMode="contain" />
                  </View>
                ) : null}

                <View style={styles.modalBtnRow}>
                  <TouchableOpacity
                    onPress={() => {
                      setModalVisible(false);
                    }}
                    style={[styles.modalBtn, { backgroundColor: 'rgba(255,255,255,0.06)' }]}
                  >
                    <Text style={{ color: '#fff', textAlign: 'center' }}>Cancelar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={handleSaveService} style={[styles.modalBtn, savingService ? { opacity: 0.7 } : null]} disabled={savingService}>
                    {savingService ? <ActivityIndicator color="#0b0b0b" /> : <Text style={{ textAlign: 'center', fontWeight: '700' }}>{editingService ? 'Salvar' : 'Criar'}</Text>}
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
}
