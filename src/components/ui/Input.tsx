import React, { useState } from 'react';
import { TextInput, TextInputProps, View, Text } from 'react-native';

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
}

export const Input = ({ label, error, className, ...props }: InputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className="w-full mb-4">
      <Text className="text-[#2b4c8a] text-sm font-semibold mb-2 ml-1">
        {label}
      </Text>
      <View
        className={`w-full h-14 rounded-2xl border bg-white px-4 justify-center ${
          error
            ? 'border-red-500'
            : isFocused
            ? 'border-[#2b4c8a]'
            : 'border-gray-200'
        } ${className || ''}`}
      >
        <TextInput
          className="flex-1 text-base text-gray-800"
          placeholderTextColor="#9CA3AF"
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          {...props}
        />
      </View>
      {error ? (
        <Text className="text-red-500 text-xs mt-1 ml-1 font-medium">{error}</Text>
      ) : null}
    </View>
  );
};
