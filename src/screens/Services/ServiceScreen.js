import { View, Text } from 'react-native';
import { supabase } from '../../services/supabase';
import styles from '../../styles/ServicesStyles';

export default function ServiceScreen() {
  return (
    <View style={styles.container}>
      <Text>servicos</Text>
    </View>
  );
}