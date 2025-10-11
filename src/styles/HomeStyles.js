import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  screen: { flex: 1 },
  container: {
    flex: 1,
    padding: 18,
    paddingTop: 36,
  },

  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  avatarWrap: {
    width: 72,
    height: 72,
    borderRadius: 999,
    overflow: 'hidden',
    marginRight: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: { width: 72, height: 72, borderRadius: 999, resizeMode: 'cover' },
  headerText: { flex: 1 },
  greeting: { color: '#fff', fontSize: 20, fontWeight: '700' },
  subGreeting: { color: 'rgba(255,255,255,0.7)', marginTop: 4 },

  logoutTopRight: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 8,
  },
  logoutTopRightText: {
    color: '#fff',
    fontWeight: '700',
  },

  quickRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  quickAction: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: 12,
    borderRadius: 12,
    alignItems: 'flex-start',
  },
  quickTitle: { color: '#fff', fontWeight: '700', fontSize: 15 },
  quickSubtitle: { color: 'rgba(255,255,255,0.7)', marginTop: 6, fontSize: 12 },

  adminCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  adminTitle: { color: '#fff', fontWeight: '700', marginBottom: 8 },
  adminRow: { flexDirection: 'row', justifyContent: 'space-between' },
  adminAction: {
    backgroundColor: '#e9e9e9ff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginRight: 8,
  },
  adminActionText: { color: '#0b0b0b', fontWeight: '700' },

  statsRow: { flexDirection: 'row', justifyContent: 'flex-start', marginTop: 8 },
  statCard: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.03)',
    alignItems: 'center',
  },
  statNumber: { color: '#fff', fontSize: 20, fontWeight: '800' },
  statLabel: { color: 'rgba(255,255,255,0.75)', marginTop: 6, fontSize: 12 },

  section: { marginTop: 12 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  sectionTitle: { color: '#fff', fontWeight: '700', fontSize: 16 },
  viewAll: { color: 'rgba(255,255,255,0.7)', fontSize: 13 },

  appCard: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.02)',
    alignItems: 'center',
  },
  appTitle: { color: '#fff', fontWeight: '700', marginBottom: 4 },
  appText: { color: 'rgba(255,255,255,0.75)', fontSize: 12 },
  appDate: { color: 'rgba(255,255,255,0.85)', fontSize: 12, textAlign: 'right' },
  appStatus: { marginTop: 6, color: 'rgba(255,255,255,0.8)', fontWeight: '600' },

  emptyRow: { padding: 12, alignItems: 'center' },
  emptyText: { color: 'rgba(255,255,255,0.7)', marginBottom: 8 },

  servicesRow: { flexDirection: 'row', justifyContent: 'flex-start', flexWrap: 'wrap' },
  serviceCard: {
    width: '48%',
    margin: '1%',
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  serviceImg: { width: '100%', height: 90, borderRadius: 8, marginBottom: 8 },
  serviceImgPlaceholder: { width: '100%', height: 90, borderRadius: 8, marginBottom: 8, backgroundColor: '#222' },
  serviceName: { color: '#fff', fontWeight: '700' },
  servicePrice: { color: 'rgba(255,255,255,0.85)', marginTop: 6, fontWeight: '700' },

  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
