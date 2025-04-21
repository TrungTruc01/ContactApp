import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Share,
  Alert,
  Linking,
} from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, Contact } from '../types';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

type DetailsScreenRouteProp = RouteProp<RootStackParamList, 'Details'>;
type DetailsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Details'>;

interface DetailsScreenProps {
  route: DetailsScreenRouteProp;
}

const DetailsScreen: React.FC<DetailsScreenProps> = ({ route }) => {
  const navigation = useNavigation<DetailsScreenNavigationProp>();
  const { isDarkMode } = useTheme();
  const { contact } = route.params;

  const handleCall = () => {
    Linking.openURL(`tel:${contact.phone}`);
  };

  const handleMessage = () => {
    Linking.openURL(`sms:${contact.phone}`);
  };

  const handleVideoCall = () => {
    Alert.alert('Thông báo', 'Tính năng gọi video sẽ được thêm sau');
  };

  const handleEmail = () => {
    if (contact.email) {
      Linking.openURL(`mailto:${contact.email}`);
    }
  };

  const handleShare = async () => {
    try {
      const message = `Tên: ${contact.name}\nSố điện thoại: ${contact.phone}${
        contact.email ? `\nEmail: ${contact.email}` : ''
      }${contact.notes ? `\nGhi chú: ${contact.notes}` : ''}`;

      await Share.share({
        message,
      });
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể chia sẻ thông tin liên hệ');
    }
  };

  const handleBlock = () => {
    Alert.alert('Thông báo', 'Tính năng chặn người gọi sẽ được thêm sau');
  };

  const handleDelete = () => {
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
            try {
              const storedContacts = await AsyncStorage.getItem('contacts');
              if (storedContacts) {
                const contacts: Contact[] = JSON.parse(storedContacts);
                const updatedContacts = contacts.filter(c => c.id !== contact.id);
                await AsyncStorage.setItem('contacts', JSON.stringify(updatedContacts));
                navigation.goBack();
              }
            } catch (error) {
              Alert.alert('Lỗi', 'Không thể xóa liên hệ');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#fff' }]}>
      <View style={styles.avatarContainer}>
        {contact.avatar ? (
          <Image source={{ uri: contact.avatar }} style={styles.avatar} />
        ) : (
          <View style={[
            styles.avatarPlaceholder,
            { backgroundColor: isDarkMode ? '#2c3e50' : '#2196F3' }
          ]}>
            <Ionicons name="person" size={60} color="#fff" />
          </View>
        )}
        <Text style={[
          styles.name,
          { color: isDarkMode ? '#fff' : '#000' }
        ]}>
          {contact.name}
        </Text>
      </View>

      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.quickActionButton}
          onPress={handleMessage}
        >
          <Ionicons name="chatbubble-outline" size={24} color={isDarkMode ? '#4a90e2' : '#2196F3'} />
          <Text style={[
            styles.quickActionText,
            { color: isDarkMode ? '#aaa' : '#666' }
          ]}>
            Nhắn tin
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickActionButton}
          onPress={handleCall}
        >
          <Ionicons name="call-outline" size={24} color={isDarkMode ? '#4a90e2' : '#2196F3'} />
          <Text style={[
            styles.quickActionText,
            { color: isDarkMode ? '#aaa' : '#666' }
          ]}>
            Gọi
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickActionButton}
          onPress={handleVideoCall}
        >
          <Ionicons name="videocam-outline" size={24} color={isDarkMode ? '#4a90e2' : '#2196F3'} />
          <Text style={[
            styles.quickActionText,
            { color: isDarkMode ? '#aaa' : '#666' }
          ]}>
            Video
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickActionButton}
          onPress={handleEmail}
        >
          <Ionicons name="mail-outline" size={24} color={isDarkMode ? '#4a90e2' : '#2196F3'} />
          <Text style={[
            styles.quickActionText,
            { color: isDarkMode ? '#aaa' : '#666' }
          ]}>
            Email
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Text style={[
            styles.label,
            { color: isDarkMode ? '#aaa' : '#666' }
          ]}>
            Số điện thoại
          </Text>
          <Text style={[
            styles.value,
            { color: isDarkMode ? '#fff' : '#000' }
          ]}>
            {contact.phone}
          </Text>
        </View>

        {contact.email && (
          <View style={styles.infoItem}>
            <Text style={[
              styles.label,
              { color: isDarkMode ? '#aaa' : '#666' }
            ]}>
              Email
            </Text>
            <Text style={[
              styles.value,
              { color: isDarkMode ? '#fff' : '#000' }
            ]}>
              {contact.email}
            </Text>
          </View>
        )}

        {contact.notes && (
          <View style={styles.infoItem}>
            <Text style={[
              styles.label,
              { color: isDarkMode ? '#aaa' : '#666' }
            ]}>
              Ghi chú
            </Text>
            <Text style={[
              styles.value,
              { color: isDarkMode ? '#fff' : '#000' }
            ]}>
              {contact.notes}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: isDarkMode ? '#4a90e2' : '#2196F3' }
          ]}
          onPress={handleShare}
        >
          <Ionicons name="share-outline" size={24} color="#fff" />
          <Text style={styles.actionButtonText}>Chia sẻ liên hệ</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: isDarkMode ? '#4a90e2' : '#2196F3' }
          ]}
          onPress={handleBlock}
        >
          <Ionicons name="ban-outline" size={24} color="#fff" />
          <Text style={styles.actionButtonText}>Chặn người gọi</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: '#FF5252' }
          ]}
          onPress={handleDelete}
        >
          <Ionicons name="trash-outline" size={24} color="#fff" />
          <Text style={styles.actionButtonText}>Xóa liên hệ</Text>
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
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 15,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  quickActionButton: {
    alignItems: 'center',
  },
  quickActionText: {
    fontSize: 12,
    marginTop: 5,
  },
  infoContainer: {
    marginBottom: 30,
  },
  infoItem: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  actionsContainer: {
    gap: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    justifyContent: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
    fontWeight: 'bold',
  },
});

export default DetailsScreen; 