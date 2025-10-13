import { StyleSheet } from 'react-native';

const ACCENT = '#2A7CFF';

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 18,
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
  },

  header: {
    paddingBottom: 10,
    marginBottom: 6,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
    fontSize: 13,
  },

  actionBtn: {
    backgroundColor: ACCENT,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnText: {
    color: '#fff',
    fontWeight: '700',
  },

  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.03)',
    color: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginRight: 8,
  },
  refreshBtn: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  refreshBtnText: {
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '700',
  },

  card: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.02)',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  cardLeft: {
    marginRight: 12,
  },

  thumb: {
    width: 84,
    height: 84,
    borderRadius: 8,
    resizeMode: 'contain',
    backgroundColor: 'transparent',
  },

  cardBody: {
    flex: 1,
  },
  title: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 15,
    marginBottom: 6,
  },
  desc: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 12,
  },

  cardFooter: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    color: '#fff',
    fontWeight: '700',
  },

  adminActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editBtn: {
    backgroundColor: ACCENT,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginLeft: 8,
  },
  editBtnText: {
    color: '#fff',
    fontWeight: '700',
  },
  outlineBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    marginLeft: 8,
  },
  outlineBtnText: {
    color: '#fff',
    fontWeight: '700',
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: 'rgba(255,255,255,0.7)',
  },

  modalTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 12,
  },
  modalInput: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    color: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  modalBtnRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  modalBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },

  thinText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
  },
});
