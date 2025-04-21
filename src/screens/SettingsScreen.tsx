import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  useColorScheme,
  Switch,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

type SettingsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Settings'>;

const SettingsScreen = () => {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const colorScheme = useColorScheme();

  const handleResetContacts = () => {
    Alert.alert(
      'Xác nhận',
      'Bạn có chắc chắn muốn xóa tất cả liên hệ?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('contacts');
            Alert.alert('Thành công', 'Đã xóa tất cả liên hệ');
          },
        },
      ]
    );
  };

  return (
    <View style={[
      styles.container,
      { backgroundColor: isDarkMode ? '#121212' : '#fff' }
    ]}>
      <View style={styles.section}>
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Ionicons 
              name={isDarkMode ? 'moon' : 'sunny'} 
              size={24} 
              color={isDarkMode ? '#4a90e2' : '#2196F3'} 
            />
            <Text style={[
              styles.settingText,
              { color: isDarkMode ? '#fff' : '#000' }
            ]}>
              Chế độ tối
            </Text>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={toggleDarkMode}
            trackColor={{ false: '#767577', true: '#4a90e2' }}
            thumbColor={isDarkMode ? '#2196F3' : '#f4f3f4'}
          />
        </View>
      </View>

      <View style={styles.section}>
        <TouchableOpacity
          style={[
            styles.settingItem,
            { borderBottomColor: isDarkMode ? '#333' : '#e9ecef' }
          ]}
          onPress={handleResetContacts}
        >
          <View style={styles.settingInfo}>
            <Ionicons name="trash-outline" size={24} color="#FF5252" />
            <Text style={[
              styles.settingText,
              { color: isDarkMode ? '#fff' : '#000' }
            ]}>
              Xóa tất cả liên hệ
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={isDarkMode ? '#666' : '#999'} />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <TouchableOpacity
          style={[
            styles.settingItem,
            { borderBottomColor: isDarkMode ? '#333' : '#e9ecef' }
          ]}
          onPress={() => navigation.navigate('EditPersonal')}
        >
          <View style={styles.settingInfo}>
            <Ionicons name="person-outline" size={24} color={isDarkMode ? '#4a90e2' : '#2196F3'} />
            <Text style={[
              styles.settingText,
              { color: isDarkMode ? '#fff' : '#000' }
            ]}>
              Chỉnh sửa thông tin cá nhân
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={isDarkMode ? '#666' : '#999'} />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={[
          styles.sectionTitle,
          { color: isDarkMode ? '#fff' : '#000' }
        ]}>
          Thông tin ứng dụng
        </Text>
        <View style={styles.infoItem}>
          <Text style={[
            styles.infoLabel,
            { color: isDarkMode ? '#aaa' : '#666' }
          ]}>
            Phiên bản
          </Text>
          <Text style={[
            styles.infoValue,
            { color: isDarkMode ? '#fff' : '#000' }
          ]}>
            1.0.0
          </Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={[
            styles.infoLabel,
            { color: isDarkMode ? '#aaa' : '#666' }
          ]}>
            Nhà phát triển
          </Text>
          <Text style={[
            styles.infoValue,
            { color: isDarkMode ? '#fff' : '#000' }
          ]}>
            Nguyễn Trung Trực
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginTop: 20,
    backgroundColor: 'transparent',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    marginLeft: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  infoLabel: {
    fontSize: 16,
  },
  infoValue: {
    fontSize: 16,
  },
});

export default SettingsScreen; 