import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#0b0b0b',
    alignItems: 'center',
    padding: 20,
    paddingTop: 70,
  },

  profileCard: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    paddingVertical: 30,
    paddingHorizontal: 20,
    width: '100%',
    marginBottom: 20,
  },

  avatarWrap: {
    width: 120,
    height: 120,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 16,
  },

  avatar: {
    width: 120,
    height: 120,
    borderRadius: 999,
    resizeMode: 'cover',
  },

  avatarPlaceholder: {
    fontSize: 32,
    color: 'rgba(255,255,255,0.6)',
  },

  name: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    marginTop: 6,
  },

  email: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    marginTop: 4,
  },

  input: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    color: '#fff',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 8,
    width: '90%',
    textAlign: 'center',
  },

  optionsCard: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },

  optionButton: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
  },

  optionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  saveButton: {
    backgroundColor: '#1E88E5',
    borderRadius: 10,
    marginVertical: 6,
  },

  saveButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    paddingVertical: 12,
  },

  cancelButton: {
    backgroundColor: '#444',
    borderRadius: 10,
    marginTop: 6,
  },

  cancelButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
    paddingVertical: 12,
  },

  logoutButton: {
    borderBottomWidth: 0,
    marginTop: 10,
  },

  logoutText: {
    color: '#ff5555',
    fontSize: 16,
    fontWeight: '700',
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0b0b0b',
  },
});
