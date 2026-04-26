import React from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps, ActivityIndicator } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'outline';
  isLoading?: boolean;
}

export const Button = ({
  label,
  variant = 'primary',
  isLoading = false,
  className,
  ...props
}: ButtonProps) => {
  const getVariantStyle = () => {
    switch (variant) {
      case 'secondary':
        return 'bg-blue-100 border border-blue-200';
      case 'outline':
        return 'bg-transparent border border-gray-300';
      case 'primary':
      default:
        return 'bg-[#1a3f75]'; // Match the deep blue from the reference
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'secondary':
        return 'text-[#1a3f75]';
      case 'outline':
        return 'text-gray-700';
      case 'primary':
      default:
        return 'text-white';
    }
  };

  return (
    <TouchableOpacity
      className={`w-full h-14 rounded-2xl items-center justify-center flex-row ${getVariantStyle()} ${
        props.disabled ? 'opacity-50' : ''
      } ${className || ''}`}
      activeOpacity={0.8}
      disabled={props.disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={variant === 'primary' ? 'white' : '#1a3f75'} />
      ) : (
        <Text className={`font-semibold text-lg ${getTextStyle()}`}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};
