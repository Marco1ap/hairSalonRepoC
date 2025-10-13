import React, { useEffect, useState, useCallback, useContext } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, ActivityIndicator, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../../services/supabase';
import styles from '../../styles/HomeStyles';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AuthContext from '../../contexts/AuthContext';

export default function HomeScreen() {
  const navigation = useNavigation();
  const auth = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [servicesPreview, setServicesPreview] = useState([]);
  const [stats, setStats] = useState({ todayCount: 0 });

  const loadUserFromStorage = async () => {
    try {
      if (auth && auth.user) {
        setUser(auth.user);
        return;
      }
      const raw = await AsyncStorage.getItem('user');
      if (raw) setUser(JSON.parse(raw));
      else setUser(null);
    } catch (e) {
      console.warn('Erro lendo sessão', e);
      setUser(null);
    }
  };

  const getTodayRangeISO = () => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    return { startISO: start.toISOString(), endISO: end.toISOString() };
  };

  const fetchTodayAppointments = async (uid, isAdmin) => {
    try {
      const { startISO, endISO } = getTodayRangeISO();
      let query = supabase
        .from('appointments')
        .select('*, services(*), client:users(id,name,phone,cpf)')
        .gte('appointment_datetime', startISO)
        .lte('appointment_datetime', endISO)
        .order('appointment_datetime', { ascending: true });

      if (!isAdmin && uid) {
        query = query.eq('client_id', uid);
      }
      const { data, error } = await query;
      if (error) throw error;
      setTodayAppointments(data || []);
      const count = (data && data.length) ? data.length : 0;
      setStats({ todayCount: count });
    } catch (e) {
      console.warn('Erro fetchTodayAppointments', e);
      setTodayAppointments([]);
      setStats({ todayCount: 0 });
    }
  };

  const fetchServicesPreview = async () => {
    try {
      const { data, error } = await supabase.from('services').select('*').order('name', { ascending: true }).limit(4);
      if (error) throw error;
      setServicesPreview(data || []);
    } catch (e) {
      console.warn('Erro fetchServicesPreview', e);
      setServicesPreview([]);
    }
  };

  useFocusEffect(
    useCallback(() => {
      let mounted = true;
      (async () => {
        setLoading(true);
        await loadUserFromStorage();
        const raw = await AsyncStorage.getItem('user');
        if (raw) {
          const parsed = JSON.parse(raw);
          await fetchTodayAppointments(parsed.id, parsed.user_type === 'admin');
        } else {
          await fetchTodayAppointments(null, false);
        }
        await fetchServicesPreview();
        if (mounted) setLoading(false);
      })();
      return () => { mounted = false; };
    }, [])
  );

  const handleLogout = async () => {
    try {
      if (auth && typeof auth.signOut === 'function') {
        await auth.signOut();
        return;
      }
      await AsyncStorage.removeItem('user');
      navigation.replace('Auth');
    } catch (e) {
      console.warn('Erro logout', e);
      Alert.alert('Erro', 'Não foi possível deslogar. Tente novamente.');
    }
  };

  const goToServices = () => navigation.navigate('Serviços');
  const goToAppointments = () => navigation.navigate('Agendamentos');
  const goToProfile = () => navigation.navigate('Perfil');

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const Header = () => (
    <View style={styles.headerRow}>
      <TouchableOpacity style={styles.headerLeft} onPress={goToProfile} activeOpacity={0.85}>
        <View style={styles.avatarWrap}>
          <Image source={user?.photo_url ? { uri: user.photo_url } : require('../../../assets/logo.png')} style={styles.avatar} />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.greeting}>Olá{user?.name ? `, ${user.name.split(' ')[0]}` : '!'}</Text>
          <Text style={styles.subGreeting}>{user?.user_type === 'admin' ? 'Administrador' : 'Cliente'} • Beauty Studio</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logoutTopRight} onPress={handleLogout}>
        <Text style={styles.logoutTopRightText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );

  const QuickAction = ({ title, subtitle, onPress }) => (
    <TouchableOpacity style={styles.quickAction} onPress={onPress}>
      <Text style={styles.quickTitle}>{title}</Text>
      {subtitle ? <Text style={styles.quickSubtitle}>{subtitle}</Text> : null}
    </TouchableOpacity>
  );

  const AppointmentItem = ({ item }) => {
    const svc = item.services || item.service;
    const dt = new Date(item.appointment_datetime);
    const client = item.client;
    return (
      <View style={styles.appCard}>
        <View style={{ flex: 1 }}>
          <Text style={styles.appTitle}>{svc?.name || 'Serviço'}</Text>
          <Text style={styles.appText}>{svc?.description ? `${svc.description.slice(0, 60)}${svc.description.length > 60 ? '...' : ''}` : ''}</Text>
          <Text style={styles.appText}>{client ? `${client.name} • ${client.phone || ''}` : ''}</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.appDate}>{dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
          <Text style={styles.appStatus}>{item.status}</Text>
        </View>
      </View>
    );
  };

  const StatsPanel = () => (
    <View style={styles.statsRow}>
      <View style={[styles.statCard, { flex: 1 }]}>
        <Text style={styles.statNumber}>{stats.todayCount}</Text>
        <Text style={styles.statLabel}>Agendamentos hoje</Text>
      </View>
    </View>
  );

  return (
    <LinearGradient colors={['#0b0b0b', '#121212']} style={styles.screen}>
      <View style={styles.container}>
        <Header />
        <View style={styles.quickRow}>
          <View style={{ flex: 1, marginRight: 6 }}>
            <QuickAction title="Serviços" subtitle="Ver catálogo" onPress={goToServices} />
          </View>
          <View style={{ flex: 1, marginLeft: 6 }}>
            <QuickAction title="Agendar" subtitle="Marcar um serviço" onPress={goToAppointments} />
          </View>
        </View>

        {user?.user_type === 'admin' && (
          <View style={styles.adminBadge}>
            <Text style={styles.adminBadgeText}>MODO ADMIN</Text>
          </View>
        )}

        <StatsPanel />

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Agendamentos de Hoje</Text>
          </View>

          {todayAppointments.length === 0 ? (
            <View style={styles.emptyRow}>
              <Text style={styles.emptyText}>Nenhum agendamento para hoje.</Text>
            </View>
          ) : (
            <FlatList
              data={todayAppointments}
              keyExtractor={(it) => it.id}
              renderItem={({ item }) => <AppointmentItem item={item} />}
              ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            />
          )}
        </View>
      </View>
    </LinearGradient>
  );
}
