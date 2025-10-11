import { View, Text } from 'react-native';
import { supabase } from '../../services/supabase';
import styles from '../../styles/ProfileStyles';

export default function ProfileScreen() {
    return (
      <View style={styles.center}>
        <Text>perfil legal uhul</Text>
    </View>
  );
}