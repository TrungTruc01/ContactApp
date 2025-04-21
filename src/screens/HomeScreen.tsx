import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  useColorScheme,
  Text,
  Image,
  SectionList,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, Contact, SortOrder } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { isDarkMode } = useTheme();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [personalInfo, setPersonalInfo] = useState({
    name: 'Tên của bạn',
    phone: 'Số điện thoại của bạn',
    avatar: undefined as string | undefined
  });

  useFocusEffect(
    React.useCallback(() => {
      loadContacts();
      loadPersonalInfo();
    }, [])
  );

  const loadPersonalInfo = async () => {
    try {
      const info = await AsyncStorage.getItem('personalInfo');
      if (info) {
        setPersonalInfo(JSON.parse(info));
      }
    } catch (error) {
      console.error('Error loading personal info:', error);
    }
  };

  const loadContacts = async () => {
    try {
      const storedContacts = await AsyncStorage.getItem('contacts');
      if (storedContacts) {
        setContacts(JSON.parse(storedContacts));
      }
    } catch (error) {
      console.error('Error loading contacts:', error);
    }
  };

  const getGroupedContacts = () => {
    const filtered = contacts
      .filter(contact => 
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.phone.includes(searchQuery)
      )
      .sort((a, b) => a.name.localeCompare(b.name, 'vi'));

    const groups: { [key: string]: Contact[] } = {};
    
    filtered.forEach(contact => {
      const firstLetter = contact.name.charAt(0).toUpperCase();
      if (!groups[firstLetter]) {
        groups[firstLetter] = [];
      }
      groups[firstLetter].push(contact);
    });

    return Object.entries(groups)
      .sort(([a], [b]) => a.localeCompare(b, 'vi'))
      .map(([title, data]) => ({
        title,
        data
      }));
  };

  const handleDeleteContact = (contactId: string) => {
    Alert.alert(
      'Xác nhận',
      'Bạn có chắc chắn muốn xóa liên hệ này?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            const updatedContacts = contacts.filter(c => c.id !== contactId);
            setContacts(updatedContacts);
            await AsyncStorage.setItem('contacts', JSON.stringify(updatedContacts));
          },
        },
      ]
    );
  };

  const renderPersonalCard = () => (
    <TouchableOpacity
      style={[
        styles.personalCard,
        {
          backgroundColor: isDarkMode ? '#1e1e1e' : '#f8f9fa',
          borderBottomColor: isDarkMode ? '#333' : '#e9ecef',
        }
      ]}
      onPress={() => navigation.navigate('EditPersonal')}
    >
      <View style={styles.avatarContainer}>
        {personalInfo.avatar ? (
          <Image source={{ uri: personalInfo.avatar }} style={styles.avatar} />
        ) : (
          <View style={[
            styles.avatarPlaceholder,
            { backgroundColor: isDarkMode ? '#2c3e50' : '#2196F3' }
          ]}>
            <Ionicons name="person" size={30} color="#fff" />
          </View>
        )}
      </View>
      <View style={styles.personalInfo}>
        <Text style={[
          styles.personalName,
          { color: isDarkMode ? '#fff' : '#000' }
        ]}>
          {personalInfo.name}
        </Text>
        <Text style={[
          styles.personalPhone,
          { color: isDarkMode ? '#aaa' : '#666' }
        ]}>
          {personalInfo.phone}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => navigation.navigate('EditPersonal')}
        style={styles.editButton}
      >
        <Ionicons name="create-outline" size={24} color={isDarkMode ? '#4a90e2' : '#2196F3'} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderSectionHeader = ({ section: { title } }: { section: { title: string } }) => (
    <View style={[
      styles.sectionHeader,
      {
        backgroundColor: isDarkMode ? '#1a1a1a' : '#f1f3f5',
        borderBottomColor: isDarkMode ? '#333' : '#e9ecef',
      }
    ]}>
      <Text style={[
        styles.sectionHeaderText,
        { color: isDarkMode ? '#aaa' : '#666' }
      ]}>
        {title}
      </Text>
    </View>
  );

  const renderContactItem = ({ item }: { item: Contact }) => (
    <TouchableOpacity
      style={[
        styles.contactItem,
        {
          backgroundColor: isDarkMode ? '#121212' : '#fff',
          borderBottomColor: isDarkMode ? '#333' : '#e9ecef',
        }
      ]}
      onPress={() => navigation.navigate('Details', { contact: item })}
    >
      <View style={styles.contactInfo}>
        <Text style={[
          styles.contactName,
          { color: isDarkMode ? '#fff' : '#000' }
        ]}>
          {item.name}
        </Text>
        <Text style={[
          styles.contactPhone,
          { color: isDarkMode ? '#aaa' : '#666' }
        ]}>
          {item.phone}
        </Text>
      </View>
      <View style={styles.contactActions}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Edit', { contact: item })}
        >
          <Ionicons name="create-outline" size={24} color={isDarkMode ? '#4a90e2' : '#2196F3'} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDeleteContact(item.id)}
          style={styles.deleteButton}
        >
          <Ionicons name="trash-outline" size={24} color="#FF5252" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[
      styles.container,
      { backgroundColor: isDarkMode ? '#121212' : '#fff' }
    ]}>
      <View style={styles.searchContainer}>
        <TextInput
          style={[
            styles.searchInput,
            {
              backgroundColor: isDarkMode ? '#1e1e1e' : '#f8f9fa',
              color: isDarkMode ? '#fff' : '#000',
              borderColor: isDarkMode ? '#333' : '#e9ecef',
            }
          ]}
          placeholder="Tìm kiếm..."
          placeholderTextColor={isDarkMode ? '#666' : '#999'}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
        >
          <Ionicons
            name={sortOrder === 'asc' ? 'arrow-up' : 'arrow-down'}
            size={24}
            color={isDarkMode ? '#4a90e2' : '#2196F3'}
          />
        </TouchableOpacity>
      </View>
      <SectionList
        sections={getGroupedContacts()}
        renderItem={renderContactItem}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={item => item.id}
        style={styles.list}
        ListHeaderComponent={renderPersonalCard}
        stickySectionHeadersEnabled
      />
      <TouchableOpacity
        style={[
          styles.addButton,
          { backgroundColor: isDarkMode ? '#4a90e2' : '#2196F3' }
        ]}
        onPress={() => navigation.navigate('Add')}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  searchInput: {
    flex: 1,
    height: 45,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginRight: 10,
    fontSize: 16,
  },
  sortButton: {
    padding: 10,
  },
  list: {
    flex: 1,
  },
  sectionHeader: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  personalCard: {
    flexDirection: 'row',
    padding: 20,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 15,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  personalInfo: {
    flex: 1,
  },
  personalName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  personalPhone: {
    fontSize: 14,
  },
  editButton: {
    padding: 8,
  },
  contactItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  contactPhone: {
    fontSize: 14,
  },
  contactActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteButton: {
    marginLeft: 15,
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default HomeScreen; 