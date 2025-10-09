import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0c0b0b',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    logo: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
        shadowColor: '#b4b4b4ff',
        elevation: 40,
        marginBottom: 18,
    },
    salonName: {
        color: '#f5f5f5',
        fontSize: 22,
        fontWeight: '700',
        letterSpacing: 1,
        marginTop: 6,
        marginBottom: 150,
        textShadowColor: 'rgba(255, 255, 255, 0.57)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 10,
    },
    inputContainer: {
        width: '100%',
        marginTopa: 30,
        paddingHorizontal: 10,
    },
    inputField: {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 12,
        marginBottom: 16,
        color: '#f5f5f5',
        fontSize: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    inputFieldFocused: {
        borderColor: 'rgba(255,255,255,0.5)',
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    loginButton: {
        width: '100%',
        backgroundColor: '#6a1b9a',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20,
        shadowColor: '#ffffff8f',
        elevation: 4,
    },
    loginButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '700',
        letterSpacing: 1,
    },
});

export default styles;