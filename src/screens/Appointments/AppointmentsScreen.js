import React, { useEffect, useState, useMemo, useContext, useCallback } from 'react';
import {
  View,
  Text,
  SectionList,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Alert,
  TextInput,
  Platform,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase, onlyDigits } from '../../services/supabase';
import styles from '../../styles/AppointmentsStyles';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import AuthContext from '../../contexts/AuthContext';

export default function AppointmentsScreen({ navigation }) {
  const auth = useContext(AuthContext);

  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [activeTab, setActiveTab] = useState('future');
  const [formData, setFormData] = useState({
    service_id: '',
    appointment_time: new Date(),
    status: 'Pendente',
    notes: '',
    final_price: '',
    client_id: '',
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [saving, setSaving] = useState(false);

  const [nameSearch, setNameSearch] = useState('');
  const [cpfSearch, setCpfSearch] = useState('');
  const [searchingClients, setSearchingClients] = useState(false);
  const [clientResults, setClientResults] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientSearchMessage, setClientSearchMessage] = useState('');

  const STATUS_OPTIONS = ['Pendente', 'Confirmado', 'Cancelado'];

  const [user, setUser] = useState(auth?.user || null);

  useEffect(() => {
    setUser(auth?.user || null);
  }, [auth?.user]);

  const isUserAdmin = (u) => {
    if (!u) return false;
    const role = (u.user_type || u.role || u.type || '').toString().toLowerCase();
    return role === 'admin';
  };

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase.from('services').select('id, name, price, description, image_url, category').order('name');
      if (error) throw error;
      setServices(data || []);
    } catch (e) {
      console.warn('Erro ao buscar serviços:', e);
      setServices([]);
    }
  };

  const fetchAppointments = async (useUser) => {
    setLoading(true);
    try {
      let query = supabase
        .from('appointments')
        .select('id, client_id, service_id, appointment_datetime, status, final_price, notes, created_at, services(id,name,price,description), client:users(id,name,phone,cpf)')
        .order('appointment_datetime', { ascending: true });

      if (!isUserAdmin(useUser) && useUser?.id) {
        query = query.eq('client_id', useUser.id);
      } else if (!useUser?.id && !isUserAdmin(useUser)) {
        setAppointments([]);
        setLoading(false);
        return;
      }

      const { data, error } = await query;
      if (error) throw error;
      setAppointments(data || []);
    } catch (e) {
      console.warn('Erro ao buscar agendamentos:', e);
      setAppointments([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      let mounted = true;
      (async () => {
        setLoading(true);
        try {
          const ctxUser = auth?.user;
          let effectiveUser = ctxUser;
          if (!ctxUser) {
            const raw = await AsyncStorage.getItem('user');
            effectiveUser = raw ? JSON.parse(raw) : null;
          }
          if (mounted) setUser(effectiveUser);
          await fetchServices();
          await fetchAppointments(effectiveUser);
        } catch (e) {
          console.warn('Erro useFocusEffect Appointments:', e);
        } finally {
          if (mounted) setLoading(false);
        }
      })();
      return () => {
        mounted = false;
      };
    }, [auth?.user])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchServices();
    fetchAppointments(user);
  }, [user]);

  const categorize = (list) => {
    const now = new Date();
    const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startTomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const past = [], today = [], future = [];
    list.forEach((a) => {
      const raw = a.appointment_datetime || a.appointments_datetime || a.appointment_time;
      const dt = new Date(raw);
      if (dt < startToday) past.push(a);
      else if (dt >= startToday && dt < startTomorrow) today.push(a);
      else future.push(a);
    });
    return { past, today, future };
  };

  const organizeByDay = (arr) => {
    const buckets = {};
    arr.forEach((a) => {
      const raw = a.appointment_datetime || a.appointments_datetime || a.appointment_time;
      const dt = new Date(raw);
      const monthYear = dt.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
      const dayHeader = dt.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
      if (!buckets[monthYear]) buckets[monthYear] = {};
      if (!buckets[monthYear][dayHeader]) buckets[monthYear][dayHeader] = [];
      buckets[monthYear][dayHeader].push(a);
    });
    const sections = [];
    Object.keys(buckets).forEach((monthYear) => {
      Object.keys(buckets[monthYear]).forEach((day) => {
        sections.push({ title: day, monthYear, data: buckets[monthYear][day] });
      });
    });
    sections.sort((s1, s2) => {
      const d1 = new Date(s1.data[0].appointment_datetime || s1.data[0].appointments_datetime || s1.data[0].appointment_time);
      const d2 = new Date(s2.data[0].appointment_datetime || s2.data[0].appointments_datetime || s2.data[0].appointment_time);
      return d1 - d2;
    });
    return sections;
  };

  const categorized = useMemo(() => categorize(appointments), [appointments]);

  const getActiveSections = (tab = activeTab) => {
    switch (tab) {
      case 'past': return organizeByDay(categorized.past.slice().reverse());
      case 'today': return organizeByDay(categorized.today);
      default: return organizeByDay(categorized.future);
    }
  };

  const getTabCounts = () => ({ past: categorized.past.length, today: categorized.today.length, future: categorized.future.length });

  const searchClients = async () => {
    setClientResults([]);
    setClientSearchMessage('');
    setSearchingClients(true);
    try {
      const cpfNorm = onlyDigits(cpfSearch || '');
      if (cpfNorm && cpfNorm.length >= 3) {
        const { data, error } = await supabase.from('users').select('id,name,cpf,phone').eq('cpf', cpfNorm).limit(10);
        if (error) throw error;
        if (!data || data.length === 0) {
          setClientSearchMessage('Nenhum cliente encontrado');
          setClientResults([]);
        } else setClientResults(data);
        setSearchingClients(false);
        return;
      }
      const q = (nameSearch || '').trim();
      if (q.length < 2) {
        setClientSearchMessage('Digite pelo menos 2 caracteres para buscar por nome, ou insira CPF.');
        setClientResults([]);
        setSearchingClients(false);
        return;
      }
      const { data, error } = await supabase.from('users').select('id,name,cpf,phone').ilike('name', `%${q}%`).limit(30);
      if (error) throw error;
      if (!data || data.length === 0) {
        setClientSearchMessage('Nenhum cliente encontrado');
        setClientResults([]);
      } else setClientResults(data);
    } catch (e) {
      console.warn('Erro buscar clientes', e);
      setClientSearchMessage('Erro ao buscar clientes');
      setClientResults([]);
    } finally {
      setSearchingClients(false);
    }
  };

  const loadClientById = async (id) => {
    if (!id) return null;
    try {
      const { data, error } = await supabase.from('users').select('id,name,cpf,phone').eq('id', id).maybeSingle();
      if (error) throw error;
      return data || null;
    } catch (e) {
      console.warn('Erro loadClientById', e);
      return null;
    }
  };

  const openModal = async (appt = null) => {
    if (appt) {
      setEditingAppointment(appt);
      setFormData({
        service_id: appt.service_id,
        appointment_time: new Date(appt.appointment_datetime || appt.appointments_datetime || appt.appointment_time),
        status: appt.status || 'Pendente',
        notes: appt.notes || '',
        final_price: appt.final_price ? String(appt.final_price) : (appt.services?.price ? String(appt.services.price) : ''),
        client_id: appt.client_id || (appt.client && appt.client.id) || '',
      });
      const clientObj = appt.client || (appt.client_id ? await loadClientById(appt.client_id) : null);
      setSelectedClient(clientObj || null);
      setNameSearch('');
      setCpfSearch('');
      setClientResults([]);
      setClientSearchMessage('');
    } else {
      setEditingAppointment(null);
      const defaultService = services.length ? services[0] : null;
      setFormData({
        service_id: defaultService?.id || '',
        appointment_time: new Date(),
        status: 'Pendente',
        notes: '',
        final_price: defaultService ? String(defaultService.price) : '',
        client_id: user?.id || '',
      });
      const preClient = isUserAdmin(user) ? null : { id: user?.id, name: user?.name, cpf: user?.cpf, phone: user?.phone };
      setSelectedClient(preClient);
      setNameSearch('');
      setCpfSearch('');
      setClientResults([]);
      setClientSearchMessage('');
    }
    setModalVisible(true);
    setShowDatePicker(false);
    setShowTimePicker(false);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingAppointment(null);
    setFormData({ service_id: '', appointment_time: new Date(), status: 'Pendente', notes: '', final_price: '', client_id: '' });
    setShowDatePicker(false);
    setShowTimePicker(false);
    setNameSearch('');
    setCpfSearch('');
    setClientResults([]);
    setClientSearchMessage('');
    setSelectedClient(null);
  };

  const saveAppointment = async () => {
    if (!formData.service_id) return Alert.alert('Erro', 'Selecione um serviço');
    if (!formData.appointment_time) return Alert.alert('Erro', 'Selecione data e hora');

    const clientIdToUse = (selectedClient && selectedClient.id) || formData.client_id || user?.id;
    if (!clientIdToUse) return Alert.alert('Erro', 'Selecione um cliente');

    setSaving(true);
    try {
      const svc = services.find((s) => s.id === formData.service_id);
      const enforcedPrice = svc ? Number(svc.price) : (formData.final_price ? parseFloat(String(formData.final_price).replace(',', '.')) : null);

      const payload = {
        client_id: clientIdToUse,
        service_id: formData.service_id,
        appointment_datetime: formData.appointment_time.toISOString(),
        status: isUserAdmin(user) ? formData.status : (editingAppointment ? editingAppointment.status : 'Pendente'),
        notes: formData.notes?.trim() || null,
        final_price: isUserAdmin(user) ? (formData.final_price ? parseFloat(String(formData.final_price).replace(',', '.')) : enforcedPrice) : enforcedPrice,
      };

      if (editingAppointment) {
        const { error } = await supabase.from('appointments').update(payload).eq('id', editingAppointment.id);
        if (error) throw error;
        Alert.alert('Sucesso', 'Agendamento atualizado');
      } else {
        const { error } = await supabase.from('appointments').insert([payload]);
        if (error) throw error;
        Alert.alert('Sucesso', 'Agendamento criado');
      }

      closeModal();
      await fetchAppointments(user);
    } catch (e) {
      console.warn('Erro salvar agendamento:', e);
      Alert.alert('Erro', e?.message || 'Não foi possível salvar agendamento');
    } finally {
      setSaving(false);
    }
  };

  const deleteAppointment = (appt) => {
    Alert.alert(
      'Excluir agendamento',
      `Excluir agendamento em ${new Date(appt.appointment_datetime || appt.appointments_datetime || appt.appointment_time).toLocaleString()}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              const { error } = await supabase.from('appointments').delete().eq('id', appt.id);
              if (error) throw error;
              Alert.alert('Excluído');
              await fetchAppointments(user);
            } catch (e) {
              console.warn('Erro excluir:', e);
              Alert.alert('Erro ao excluir');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const onDateChange = (event, selected) => {
    try {
      if (Platform.OS === 'android') setShowDatePicker(false);
      if (event && event.type === 'dismissed') return;
      if (selected) setFormData((f) => ({ ...f, appointment_time: selected }));
    } catch (e) {
      console.warn('onDateChange error:', e);
    }
  };

  const onTimeChange = (event, selected) => {
    try {
      if (Platform.OS === 'android') setShowTimePicker(false);
      if (event && event.type === 'dismissed') return;
      if (selected) setFormData((f) => ({ ...f, appointment_time: selected }));
    } catch (e) {
      console.warn('onTimeChange error:', e);
    }
  };

  const renderAppointmentItem = ({ item }) => {
    const raw = item.appointment_datetime || item.appointments_datetime || item.appointment_time;
    const dt = new Date(raw);
    const client = item.client || (item.client_id ? { id: item.client_id, name: 'Cliente', phone: '' } : null);
    return (
      <View style={styles.card}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{item.services?.name || 'Serviço'}</Text>
          {client ? <Text style={styles.desc}>{client.name} • {client.phone || ''}</Text> : null}
          <Text style={[styles.desc, { marginTop: 6 }]}>{dt.toLocaleDateString()} às {dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
          <Text style={[styles.price, { marginTop: 6 }]}>{item.final_price != null ? `R$ ${Number(item.final_price).toFixed(2).replace('.', ',')}` : item.services?.price ? `R$ ${Number(item.services.price).toFixed(2).replace('.', ',')}` : '--'}</Text>
          <Text style={styles.statusText}>Status: {item.status}</Text>
        </View>
        <View style={{ marginLeft: 8 }}>
          <TouchableOpacity onPress={() => openModal(item)} style={{ marginBottom: 8 }}>
            <Text style={{ color: '#fff' }}>✏️</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => deleteAppointment(item)}>
            <Text style={{ color: '#fff' }}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderSectionHeader = ({ section }) => (
    <View>
      <View style={{ paddingHorizontal: 20, paddingVertical: 8 }}>
        <Text style={{ color: 'rgba(255,255,255,0.8)', fontWeight: '700' }}>{section.title}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <LinearGradient colors={['#0b0b0b', '#121212']} style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.center}>
            <ActivityIndicator size="large" />
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const tabCounts = getTabCounts();

  return (
    <LinearGradient colors={['#0b0b0b', '#121212']} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation?.goBack?.()}>
            <Text style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 4 }}>← Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Agendamentos</Text>
          <TouchableOpacity onPress={() => openModal()}>
            <Text style={{ color: '#fff', fontWeight: '700' }}>+ Novo</Text>
          </TouchableOpacity>
        </View>

        {isUserAdmin(user) && (
          <View style={{ backgroundColor: 'rgba(42,124,255,0.08)', padding: 10, borderRadius: 10, marginBottom: 10 }}>
            <Text style={{ color: '#fff', fontWeight: '700' }}>MODO ADMIN — você pode criar, editar e excluir agendamentos</Text>
          </View>
        )}

        <View style={{ flexDirection: 'row', paddingHorizontal: 12, marginBottom: 8 }}>
          <TouchableOpacity onPress={() => setActiveTab('past')} style={{ flex: 1, padding: 10, alignItems: 'center' }}>
            <Text style={{ color: activeTab === 'past' ? '#fff' : 'rgba(255,255,255,0.6)', fontWeight: activeTab === 'past' ? '700' : '400' }}>
              Passados ({tabCounts.past})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab('today')} style={{ flex: 1, padding: 10, alignItems: 'center' }}>
            <Text style={{ color: activeTab === 'today' ? '#fff' : 'rgba(255,255,255,0.6)', fontWeight: activeTab === 'today' ? '700' : '400' }}>
              Hoje ({tabCounts.today})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab('future')} style={{ flex: 1, padding: 10, alignItems: 'center' }}>
            <Text style={{ color: activeTab === 'future' ? '#fff' : 'rgba(255,255,255,0.6)', fontWeight: activeTab === 'future' ? '700' : '400' }}>
              Futuros ({tabCounts.future})
            </Text>
          </TouchableOpacity>
        </View>

        <SectionList
          sections={getActiveSections()}
          keyExtractor={(item) => item.id}
          renderItem={renderAppointmentItem}
          renderSectionHeader={renderSectionHeader}
          contentContainerStyle={{ paddingBottom: 120 }}
          ListEmptyComponent={() => (
            <View style={styles.center}>
              <Text style={styles.emptyText}>
                {activeTab === 'past' ? 'Nenhum agendamento passado' : activeTab === 'today' ? 'Nenhum agendamento para hoje' : 'Nenhum agendamento futuro'}
              </Text>
            </View>
          )}
        />

        <Modal animationType="slide" transparent visible={modalVisible} onRequestClose={closeModal}>
          <View style={styles.modalOverlay}>
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 20 }} keyboardShouldPersistTaps="handled">
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>{editingAppointment ? 'Editar Agendamento' : 'Novo Agendamento'}</Text>

                <Text style={styles.modalLabel}>Cliente:</Text>
                {isUserAdmin(user) ? (
                  <>
                    {selectedClient ? (
                      <View style={{ backgroundColor: 'rgba(255,255,255,0.03)', padding: 10, borderRadius: 8, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View>
                          <Text style={{ color: '#fff', fontWeight: '700' }}>{selectedClient.name}</Text>
                          <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>{selectedClient.cpf ? `CPF: ${selectedClient.cpf}` : selectedClient.phone || ''}</Text>
                        </View>
                        <TouchableOpacity onPress={() => { setSelectedClient(null); setFormData((f) => ({ ...f, client_id: '' })); }}>
                          <Text style={{ color: 'rgba(255,255,255,0.7)', fontWeight: '700' }}>Remover</Text>
                        </TouchableOpacity>
                      </View>
                    ) : null}

                    <TextInput
                      placeholder="Pesquisar por nome (mín. 2 chars)"
                      placeholderTextColor="rgba(255,255,255,0.5)"
                      value={nameSearch}
                      onChangeText={setNameSearch}
                      style={styles.modalInput}
                    />
                    <TextInput
                      placeholder="Pesquisar por CPF (somente números)"
                      placeholderTextColor="rgba(255,255,255,0.5)"
                      value={cpfSearch}
                      onChangeText={(t) => setCpfSearch(onlyDigits(t))}
                      keyboardType="number-pad"
                      style={styles.modalInput}
                    />

                    <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
                      <TouchableOpacity onPress={searchClients} style={{ flex: 1, padding: 10, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 8, alignItems: 'center' }}>
                        {searchingClients ? <ActivityIndicator color="#fff" /> : <Text style={{ color: '#fff' }}>Pesquisar</Text>}
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => { setNameSearch(''); setCpfSearch(''); setClientResults([]); setClientSearchMessage(''); }} style={{ padding: 10, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 8, alignItems: 'center' }}>
                        <Text style={{ color: 'rgba(255,255,255,0.8)' }}>Limpar</Text>
                      </TouchableOpacity>
                    </View>

                    {clientSearchMessage ? <Text style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 8 }}>{clientSearchMessage}</Text> : null}

                    {clientResults.length > 0 ? (
                      <View style={{ width: '100%', marginBottom: 8 }}>
                        {clientResults.map((item) => (
                          <TouchableOpacity
                            key={item.id}
                            onPress={() => {
                              setSelectedClient(item);
                              setFormData((f) => ({ ...f, client_id: item.id }));
                              setClientResults([]);
                              setNameSearch('');
                              setCpfSearch('');
                              setClientSearchMessage('');
                            }}
                            style={{ padding: 10, backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 8, marginBottom: 8 }}
                          >
                            <Text style={{ color: '#fff', fontWeight: '700' }}>{item.name}</Text>
                            <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>{item.cpf ? `CPF: ${item.cpf}` : item.phone || ''}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    ) : null}

                    {clientSearchMessage === 'Nenhum cliente encontrado' ? (
                      <TouchableOpacity
                        onPress={() => {
                          setModalVisible(false);
                          navigation.navigate('Register', { prefill: { name: nameSearch, cpf: cpfSearch } });
                        }}
                        style={{ padding: 10, backgroundColor: 'rgba(42,124,255,0.12)', borderRadius: 8, alignItems: 'center', marginBottom: 8 }}
                      >
                        <Text style={{ color: '#fff', fontWeight: '700' }}>Cadastrar novo cliente</Text>
                      </TouchableOpacity>
                    ) : null}
                  </>
                ) : (
                  <Text style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 8 }}>{user?.name || 'Você'}</Text>
                )}

                <Text style={styles.modalLabel}>Serviço:</Text>

                <ScrollView style={{ width: '100%', maxHeight: 220, marginBottom: 12 }} nestedScrollEnabled>
                  {services.map((s) => {
                    const selected = formData.service_id === s.id;
                    return (
                      <TouchableOpacity
                        key={s.id}
                        onPress={() => {
                          setFormData((f) => ({ ...f, service_id: s.id, final_price: String(s.price) }));
                        }}
                        style={[
                          styles.modalServiceItem,
                          selected && styles.modalServiceItemSelected,
                          { marginBottom: 8 },
                        ]}
                      >
                        <Text style={styles.modalServiceText}>{s.name} — R$ {Number(s.price).toFixed(2).replace('.', ',')}</Text>
                        {s.description ? <Text style={{ color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>{s.description.length > 80 ? `${s.description.slice(0, 80)}...` : s.description}</Text> : null}
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>

                <Text style={styles.modalLabel}>Data e Hora:</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                  <TouchableOpacity style={styles.modalDateBtn} onPress={() => setShowDatePicker(true)}>
                    <Text style={styles.modalDateText}>{formData.appointment_time.toLocaleDateString()}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.modalDateBtn} onPress={() => setShowTimePicker(true)}>
                    <Text style={styles.modalDateText}>{formData.appointment_time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                  </TouchableOpacity>
                </View>

                {showDatePicker && <DateTimePicker value={formData.appointment_time} mode="date" display={Platform.OS === 'ios' ? 'spinner' : 'default'} onChange={onDateChange} />}
                {showTimePicker && <DateTimePicker value={formData.appointment_time} mode="time" display={Platform.OS === 'ios' ? 'spinner' : 'default'} onChange={onTimeChange} />}

                {isUserAdmin(user) ? (
                  <>
                    <Text style={styles.modalLabel}>Status:</Text>
                    <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                      {STATUS_OPTIONS.map((s) => (
                        <TouchableOpacity key={s} onPress={() => setFormData((f) => ({ ...f, status: s }))} style={[styles.statusOption, formData.status === s && styles.statusOptionSelected]}>
                          <Text style={styles.statusOptionText}>{s}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </>
                ) : null}

                <Text style={styles.modalLabel}>Valor (R$):</Text>
                {isUserAdmin(user) ? (
                  <TextInput style={styles.modalInput} keyboardType="numeric" value={formData.final_price} onChangeText={(t) => setFormData((f) => ({ ...f, final_price: t }))} />
                ) : (
                  <View style={{ padding: 10, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 8, marginBottom: 8 }}>
                    <Text style={{ color: '#fff' }}>{formData.final_price ? `R$ ${Number(formData.final_price).toFixed(2).replace('.', ',')}` : '--'}</Text>
                  </View>
                )}

                <Text style={styles.modalLabel}>Observações:</Text>
                <TextInput style={[styles.modalInput, { minHeight: 80 }]} value={formData.notes} onChangeText={(t) => setFormData((f) => ({ ...f, notes: t }))} multiline />

                <View style={styles.modalButtons}>
                  <TouchableOpacity style={styles.modalCancel} onPress={closeModal}>
                    <Text style={styles.modalCancelText}>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.modalSave} onPress={saveAppointment}>
                    <Text style={styles.modalSaveText}>{saving ? 'Salvando...' : (editingAppointment ? 'Atualizar' : 'Salvar')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
}
