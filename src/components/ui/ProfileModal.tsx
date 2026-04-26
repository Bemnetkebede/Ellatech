import React from 'react';
import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';
import { Button } from './Button';
import { Ionicons } from '@expo/vector-icons';

interface ProfileModalProps {
  visible: boolean;
  user: {
    name: string;
    email: string;
  };
  onClose: () => void;
  onLogout: () => void;
}

export const ProfileModal = ({ visible, user, onClose, onLogout }: ProfileModalProps) => {
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.profileCard}>
          <View style={styles.initialsCircle}>
            <Text style={styles.initialsText}>{initials}</Text>
          </View>
          
          <Text style={styles.userName}>
            {user.name}
          </Text>
          
          <View style={styles.emailRow}>
            <Ionicons name="mail-outline" size={16} color="#9ca3af" />
            <Text style={styles.emailText}>
              {user.email}
            </Text>
          </View>

          <View style={styles.divider} />
          
          <Button 
            label="Log Out" 
            onPress={() => { onClose(); onLogout(); }} 
            variant="outline"
            style={styles.logoutBtn}
          />

          <Button 
            label="Close Profile" 
            onPress={onClose} 
            variant="primary"
            style={styles.closeBtn}
          />
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCard: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 40,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  initialsCircle: {
    width: 96,
    height: 96,
    backgroundColor: '#1a3f75',
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#1a3f75',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  initialsText: {
    color: 'white',
    fontSize: 32,
    fontWeight: '900',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
    textAlign: 'center',
  },
  emailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  emailText: {
    color: '#9ca3af',
    marginLeft: 8,
    fontSize: 16,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#f3f4f6',
    marginBottom: 32,
  },
  logoutBtn: {
    height: 56,
    borderRadius: 16,
    marginBottom: 16,
    borderColor: '#fee2e2',
  },
  closeBtn: {
    height: 56,
    borderRadius: 16,
  }
});
