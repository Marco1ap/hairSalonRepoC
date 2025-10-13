import { StyleSheet, Platform } from 'react-native';

const ACCENT = '#2A7CFF';
const CARD_BG = 'rgba(255,255,255,0.02)';
const INPUT_BG = 'rgba(255,255,255,0.03)';
const MUTED = 'rgba(255,255,255,0.7)';

const styles = StyleSheet.create({
  card: {
    width: '100%',
    maxWidth: 520,
    backgroundColor: CARD_BG,
    borderRadius: 16,
    paddingVertical: 28,
    paddingHorizontal: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 20,
    elevation: 12,
  },

  logo: {
    resizeMode: 'contain',
    marginBottom: 12,
    width: 140,
    height: 140,
    borderRadius: 999,
  },

  salonTextName: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: 0.4,
  },

  loginText: {
    color: '#FFFFFFFF',
    fontSize: 18,
    marginBottom: 10,
  },

  inputContainer: {
    width: '100%',
    marginTop: 6,
  },

  inputField: {
    backgroundColor: INPUT_BG,
    color: '#FFFFFF',
    paddingVertical: Platform.OS === 'ios' ? 14 : 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginBottom: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },

  inputFieldFocused: {
    borderColor: 'rgba(42,124,255,0.9)',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },

  primaryButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 14,
    backgroundColor: ACCENT,
    shadowColor: '#0b2345',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 12,
    elevation: 8,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  outlineButton: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  outlineButtonText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 15,
    fontWeight: '600',
  },

  linksRow: {
    width: '100%',
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 2,
  },

  linkText: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 14,
  },

  backButton: {
    position: 'absolute',
    left: 12,
    top: 12,
    padding: 8,
    borderRadius: 8,
    zIndex: 20,
  },
  backButtonText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 16,
    fontWeight: '600',
  },

  smallMuted: {
    color: MUTED,
    fontSize: 13,
  },

  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default styles;
