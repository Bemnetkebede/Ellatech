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
        <View className="w-[85%] bg-white rounded-[40px] p-8 shadow-2xl items-center border border-gray-100">
          <View className="w-24 h-24 bg-[#1a3f75] rounded-full items-center justify-center mb-6 shadow-xl">
            <Text className="text-white text-3xl font-black">{initials}</Text>
          </View>
          
          <Text className="text-2xl font-bold text-gray-800 mb-1 text-center">
            {user.name}
          </Text>
          
          <View className="flex-row items-center mb-8">
            <Ionicons name="mail-outline" size={16} color="#9ca3af" />
            <Text className="text-gray-400 ml-2 text-base">
              {user.email}
            </Text>
          </View>

          <View className="w-full h-[1px] bg-gray-100 mb-8" />
          
          <Button 
            label="Log Out" 
            onPress={() => { onClose(); onLogout(); }} 
            variant="outline"
            className="h-14 rounded-2xl mb-4 border-red-100"
            textClassName="text-red-500"
          />

          <Button 
            label="Close Profile" 
            onPress={onClose} 
            variant="primary"
            className="h-14 rounded-2xl"
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
});
