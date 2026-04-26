import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { Button } from './Button';

interface AlertModalProps {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
}

export const AlertModal = ({ visible, title, message, onClose }: AlertModalProps) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable 
        style={styles.overlay} 
        onPress={onClose}
      >
        <View className="w-[85%] bg-white rounded-[32px] p-8 shadow-2xl items-center border border-red-50">
          <View className="w-16 h-16 bg-red-100 rounded-full items-center justify-center mb-6">
            <Text className="text-red-600 text-3xl font-bold">!</Text>
          </View>
          
          <Text className="text-2xl font-bold text-gray-800 mb-2 text-center">
            {title}
          </Text>
          
          <Text className="text-gray-500 text-center mb-8 text-base leading-6">
            {message}
          </Text>
          
          <Button 
            label="Got it" 
            onPress={onClose} 
            className="bg-red-600 h-14 rounded-2xl"
          />
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Standard dark dimmed background
    justifyContent: 'center',
    alignItems: 'center',
  },
});
