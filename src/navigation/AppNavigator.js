import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';

import AuthContext from '../contexts/AuthContext';

import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import RecoverScreen from '../screens/Auth/RecoverScreen';
import HomeScreen from '../screens/Home/HomeScreen';
import ServiceScreen from '../screens/Services/ServicesScreen';
import AppointmentsScreen from '../screens/Appointments/AppointmentsScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';

const RootStack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AuthStackScreen() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
      <AuthStack.Screen name="Recover" component={RecoverScreen} />
    </AuthStack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: styles.tabBar,
        tabBarIcon: ({ focused, color }) => {
          let name = 'ellipse';
          if (route.name === 'Home') name = focused ? 'home' : 'home-outline';
          if (route.name === 'Serviços') name = focused ? 'briefcase' : 'briefcase-outline';
          if (route.name === 'Agendamentos') name = focused ? 'calendar' : 'calendar-outline';
          if (route.name === 'Perfil') name = focused ? 'person' : 'person-outline';
          return <Ionicons name={name} size={20} color={color} />;
        },
        tabBarActiveTintColor: '#2A7CFF',
        tabBarInactiveTintColor: 'rgba(255,255,255,0.6)',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
      <Tab.Screen name="Serviços" component={ServiceScreen} options={{ title: 'Serviços' }} />
      <Tab.Screen name="Agendamentos" component={AppointmentsScreen} options={{ title: 'Agendamentos' }} />
      <Tab.Screen name="Perfil" component={ProfileScreen} options={{ title: 'Perfil' }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem('user');
        if (!mounted) return;
        if (raw) setUser(JSON.parse(raw));
        else setUser(null);
      } catch (e) {
        console.warn('Erro carregando sessão', e);
        if (mounted) setUser(null);
      }
    })();
    return () => (mounted = false);
  }, []);

  const signIn = async (userObj) => {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(userObj));
    } catch (e) {
      console.warn('Erro salvando sessão', e);
    }
    setUser(userObj);
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('user');
    } catch (e) {
      console.warn('Erro removendo sessão', e);
    }
    setUser(null);
  };

  if (typeof user === 'undefined') {
    return (
      <View style={{ flex: 1, backgroundColor: '#0b0b0b', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, setUser }}>
      <NavigationContainer>
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
          {user ? (
            <RootStack.Screen name="Main" component={MainTabs} />
          ) : (
            <RootStack.Screen name="Auth" component={AuthStackScreen} />
          )}
        </RootStack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#0f0f10',
    position: 'absolute',
    marginHorizontal: 16,
    marginBottom: 12,
    height: 62,
    borderRadius: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
    borderTopWidth: 0,
  },
});
