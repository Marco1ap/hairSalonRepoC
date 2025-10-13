import { StyleSheet } from 'react-native';

const ACCENT = '#2A7CFF';

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 6,
  },

  header: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyText: {
    color: 'rgba(255,255,255,0.7)',
  },

  card: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.02)',
    marginHorizontal: 16,
    marginBottom: 10,
    alignItems: 'center',
  },

  title: {
    color: '#fff',
    fontWeight: '700',
    marginBottom: 6,
  },

  desc: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 12,
  },

  price: {
    color: '#fff',
    fontWeight: '700',
  },

  statusText: {
    marginTop: 6,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '600',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    padding: 20,
  },

  modalContent: {
    width: '100%',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 14,
  },

  modalTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 12,
  },

  modalLabel: {
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 6,
    fontWeight: '700',
  },

  modalInput: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    color: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },

  modalServiceList: {
    marginBottom: 8,
  },

  modalServiceItem: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.03)',
    marginBottom: 8,
  },

  modalServiceItemSelected: {
    backgroundColor: 'rgba(42,124,255,0.12)',
  },

  modalDateBtn: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: 10,
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center',
  },

  modalDateText: {
    color: '#fff',
  },

  statusOption: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.03)',
    marginRight: 8,
  },

  statusOptionSelected: {
    backgroundColor: 'rgba(42,124,255,0.12)',
  },

  statusOptionText: {
    color: '#fff',
    fontWeight: '700',
  },

  modalButtons: {
    flexDirection: 'row',
    marginTop: 12,
    justifyContent: 'space-between',
  },

  modalCancel: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginRight: 8,
    alignItems: 'center',
  },

  modalSave: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    backgroundColor: ACCENT,
    marginLeft: 8,
    alignItems: 'center',
  },

  modalCancelText: {
    color: '#fff',
  },

  modalSaveText: {
    color: '#fff',
    fontWeight: '800',
  },
});
