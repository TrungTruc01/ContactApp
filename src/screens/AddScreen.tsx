import React, { useState } from 'react';
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
import { RootStackParamList, Contact } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

type AddScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Add'>;

const AddScreen = () => {
  const navigation = useNavigation<AddScreenNavigationProp>();
  const { isDarkMode } = useTheme();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [avatar, setAvatar] = useState<string | undefined>();

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Cần quyền truy cập thư viện ảnh');
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

  const handleSave = async () => {
    if (!name || !phone) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên và số điện thoại');
      return;
    }

    const newContact: Contact = {
      id: Date.now().toString(),
      name,
      phone,
      email: email || undefined,
      notes: notes || undefined,
      avatar,
    };

    try {
      const storedContacts = await AsyncStorage.getItem('contacts');
      const contacts: Contact[] = storedContacts ? JSON.parse(storedContacts) : [];
      contacts.push(newContact);
      await AsyncStorage.setItem('contacts', JSON.stringify(contacts));
      navigation.goBack();
    } catch (error) {
      console.error('Error saving contact:', error);
      Alert.alert('Lỗi', 'Không thể lưu liên hệ');
    }
  };

  return (
    <View style={[
      styles.container,
      { backgroundColor: isDarkMode ? '#121212' : '#fff' }
    ]}>
      <View style={styles.avatarContainer}>
        <TouchableOpacity onPress={pickImage} style={styles.avatarButton}>
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.avatar} />
          ) : (
            <View style={[
              styles.avatarPlaceholder,
              { backgroundColor: isDarkMode ? '#2c3e50' : '#2196F3' }
            ]}>
              <Ionicons name="camera" size={40} color="#fff" />
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={[
            styles.label,
            { color: isDarkMode ? '#aaa' : '#666' }
          ]}>
            Tên
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: isDarkMode ? '#1e1e1e' : '#fff',
                color: isDarkMode ? '#fff' : '#000',
                borderColor: isDarkMode ? '#333' : '#ddd',
              }
            ]}
            value={name}
            onChangeText={setName}
            placeholder="Nhập tên"
            placeholderTextColor={isDarkMode ? '#666' : '#999'}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={[
            styles.label,
            { color: isDarkMode ? '#aaa' : '#666' }
          ]}>
            Số điện thoại
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: isDarkMode ? '#1e1e1e' : '#fff',
                color: isDarkMode ? '#fff' : '#000',
                borderColor: isDarkMode ? '#333' : '#ddd',
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
          <Text style={[
            styles.label,
            { color: isDarkMode ? '#aaa' : '#666' }
          ]}>
            Email
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: isDarkMode ? '#1e1e1e' : '#fff',
                color: isDarkMode ? '#fff' : '#000',
                borderColor: isDarkMode ? '#333' : '#ddd',
              }
            ]}
            value={email}
            onChangeText={setEmail}
            placeholder="Nhập email"
            placeholderTextColor={isDarkMode ? '#666' : '#999'}
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={[
            styles.label,
            { color: isDarkMode ? '#aaa' : '#666' }
          ]}>
            Ghi chú
          </Text>
          <TextInput
            style={[
              styles.input,
              styles.notesInput,
              {
                backgroundColor: isDarkMode ? '#1e1e1e' : '#fff',
                color: isDarkMode ? '#fff' : '#000',
                borderColor: isDarkMode ? '#333' : '#ddd',
              }
            ]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Nhập ghi chú"
            placeholderTextColor={isDarkMode ? '#666' : '#999'}
            multiline
          />
        </View>

        <TouchableOpacity 
          style={[
            styles.saveButton,
            { backgroundColor: isDarkMode ? '#4a90e2' : '#2196F3' }
          ]} 
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>Thêm liên hệ</Text>
        </TouchableOpacity>
      </View>
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
    marginBottom: 20,
  },
  avatarButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    flex: 1,
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
  notesInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddScreen; 