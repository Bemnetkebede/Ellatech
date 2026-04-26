import React, { useState } from 'react';
import { TextInput, TextInputProps, View, Text, StyleSheet } from 'react-native';

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
}

export const Input = ({ label, error, style, ...props }: InputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
      </Text>
      <View
        style={[
          styles.inputContainer,
          error ? styles.borderError : isFocused ? styles.borderFocused : styles.borderDefault,
          style
        ]}
      >
        <TextInput
          style={styles.input}
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
        <Text style={styles.errorText}>{error}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: '100%', marginBottom: 16 },
  label: { color: '#1a3f75', fontSize: 13, fontWeight: '700', marginBottom: 8, marginLeft: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  inputContainer: { width: '100%', height: 56, borderRadius: 16, borderWidth: 1.5, backgroundColor: 'white', px: 16, justifyContent: 'center' },
  input: { flex: 1, fontSize: 16, color: '#1f2937', paddingHorizontal: 16 },
  borderDefault: { borderColor: '#e5e7eb' },
  borderFocused: { borderColor: '#1a3f75' },
  borderError: { borderColor: '#ef4444' },
  errorText: { color: '#ef4444', fontSize: 12, marginTop: 4, marginLeft: 4, fontWeight: '600' }
});
