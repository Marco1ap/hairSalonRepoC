import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
    paddingBottom: 6,
    paddingTop: 6,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarWrap: {
    width: 68,
    height: 68,
    borderRadius: 34,
    overflow: 'hidden',
    marginRight: 12,
    backgroundColor: 'rgba(255,255,255,0.03)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
  },
  headerText: {
    flex: 1,
  },
  greeting: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
  },
  subGreeting: {
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
    fontSize: 12,
  },
  logoutTopRight: {
    marginLeft: 8,
    padding: 6,
  },
  logoutTopRightText: {
    color: '#fff',
    fontWeight: '700',
  },

  quickRow: {
    flexDirection: 'row',
    marginTop: 8,
    marginBottom: 12,
  },
  quickAction: {
    backgroundColor: 'rgba(255,255,255,0.02)',
    padding: 14,
    borderRadius: 12,
  },
  quickTitle: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 14,
  },
  quickSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
    fontSize: 12,
  },

  adminBadgeWrap: {
    marginVertical: 10,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(42,124,255,0.08)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  adminBadgeText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },

  statsRow: {
    marginTop: 8,
    marginBottom: 12,
  },
  statCard: {
    backgroundColor: 'rgba(255,255,255,0.02)',
    padding: 12,
    borderRadius: 12,
  },
  statNumber: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 20,
  },
  statLabel: {
    color: 'rgba(255,255,255,0.75)',
    marginTop: 4,
    fontSize: 12,
  },

  section: {
    marginTop: 8,
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
    marginBottom: 8,
  },

  appCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.02)',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  appTitle: {
    color: '#fff',
    fontWeight: '800',
  },
  appText: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 12,
    marginTop: 4,
  },
  appDate: {
    color: '#fff',
    fontWeight: '700',
  },
  appStatus: {
    color: 'rgba(255,255,255,0.8)',
    marginTop: 6,
  },

  emptyRow: {
    padding: 18,
    alignItems: 'center',
  },
  emptyText: {
    color: 'rgba(255,255,255,0.7)',
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
