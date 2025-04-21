import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../context/ThemeContext';

type EditPersonalScreenNavigationProp = StackNavigationProp<RootStackParamList, 'EditPersonal'>;

const EditPersonalScreen = () => {
  const navigation = useNavigation<EditPersonalScreenNavigationProp>();
  const { isDarkMode } = useTheme();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    loadPersonalInfo();
  }, []);

  const loadPersonalInfo = async () => {
    try {
      const personalInfo = await AsyncStorage.getItem('personalInfo');
      if (personalInfo) {
        const { name, phone, email, avatar } = JSON.parse(personalInfo);
        setName(name);
        setPhone(phone);
        setEmail(email);
        setAvatar(avatar);
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải thông tin cá nhân');
    }
  };

  const handleSave = async () => {
    try {
      const personalInfo = {
        name,
        phone,
        email,
        avatar,
      };
      await AsyncStorage.setItem('personalInfo', JSON.stringify(personalInfo));
      navigation.goBack();
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể lưu thông tin cá nhân');
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Lỗi', 'Cần quyền truy cập thư viện ảnh');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#fff' }]}>
      <View style={styles.avatarContainer}>
        <TouchableOpacity onPress={pickImage}>
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.avatar} />
          ) : (
            <View style={[
              styles.avatarPlaceholder,
              { backgroundColor: isDarkMode ? '#2c3e50' : '#2196F3' }
            ]}>
              <Ionicons name="person" size={60} color="#fff" />
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.changeAvatarButton}
          onPress={pickImage}
        >
          <Text style={styles.changeAvatarText}>Thay đổi ảnh đại diện</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: isDarkMode ? '#aaa' : '#666' }]}>
            Tên
          </Text>
          <TextInput
            style={[
              styles.input,
              { 
                backgroundColor: isDarkMode ? '#333' : '#f5f5f5',
                color: isDarkMode ? '#fff' : '#000',
                borderColor: isDarkMode ? '#444' : '#ddd'
              }
            ]}
            value={name}
            onChangeText={setName}
            placeholder="Nhập tên"
            placeholderTextColor={isDarkMode ? '#666' : '#999'}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: isDarkMode ? '#aaa' : '#666' }]}>
            Số điện thoại
          </Text>
          <TextInput
            style={[
              styles.input,
              { 
                backgroundColor: isDarkMode ? '#333' : '#f5f5f5',
                color: isDarkMode ? '#fff' : '#000',
                borderColor: isDarkMode ? '#444' : '#ddd'
              }
            ]}
            value={phone}
            onChangeText={setPhone}
            placeholder="Nhập số điện thoại"
            placeholderTextColor={isDarkMode ? '#666' : '#999'}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: isDarkMode ? '#aaa' : '#666' }]}>
            Email
          </Text>
          <TextInput
            style={[
              styles.input,
              { 
                backgroundColor: isDarkMode ? '#333' : '#f5f5f5',
                color: isDarkMode ? '#fff' : '#000',
                borderColor: isDarkMode ? '#444' : '#ddd'
              }
            ]}
            value={email}
            onChangeText={setEmail}
            placeholder="Nhập email"
            placeholderTextColor={isDarkMode ? '#666' : '#999'}
            keyboardType="email-address"
          />
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.saveButton,
          { backgroundColor: isDarkMode ? '#4a90e2' : '#2196F3' }
        ]}
        onPress={handleSave}
      >
        <Text style={styles.saveButtonText}>Lưu</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  changeAvatarButton: {
    marginTop: 10,
  },
  changeAvatarText: {
    color: '#2196F3',
    fontSize: 16,
  },
  form: {
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  saveButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditPersonalScreen; 