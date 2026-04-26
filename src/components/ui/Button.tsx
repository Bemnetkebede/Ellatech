import React from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps, ActivityIndicator, StyleSheet } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'outline';
  isLoading?: boolean;
}

export const Button = ({
  label,
  variant = 'primary',
  isLoading = false,
  style,
  ...props
}: ButtonProps) => {
  const getVariantStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.secondary;
      case 'outline':
        return styles.outline;
      case 'primary':
      default:
        return styles.primary;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.textSecondary;
      case 'outline':
        return styles.textOutline;
      case 'primary':
      default:
        return styles.textPrimary;
    }
  };

  return (
    <TouchableOpacity
      style={[styles.base, getVariantStyle(), props.disabled && styles.disabled, style]}
      activeOpacity={0.8}
      disabled={props.disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={variant === 'primary' ? 'white' : '#1a3f75'} />
      ) : (
        <Text style={[styles.textBase, getTextStyle()]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    width: '100%',
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  primary: { backgroundColor: '#1a3f75' },
  secondary: { backgroundColor: '#dbeafe', borderWidth: 1, borderColor: '#bfdbfe' },
  outline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#d1d5db' },
  disabled: { opacity: 0.5 },
  textBase: { fontSize: 18, fontWeight: '600' },
  textPrimary: { color: 'white' },
  textSecondary: { color: '#1a3f75' },
  textOutline: { color: '#374151' },
});
