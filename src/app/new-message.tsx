import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

export default function NewMessage() {
  const colors = useTheme();
  const router = useRouter();
  const [to, setTo] = useState('');
  const [message, setMessage] = useState('');

  const canSend = to.trim().length > 0 && message.trim().length > 0;

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>To</Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.backgroundElement,
            borderColor: colors.border,
            color: colors.text,
          },
        ]}
        placeholder="Contact name"
        placeholderTextColor={colors.textSecondary}
        value={to}
        onChangeText={setTo}
        autoCapitalize="words"
      />

      <Text style={[styles.label, { color: colors.textSecondary }]}>Message</Text>
      <TextInput
        style={[
          styles.input,
          styles.messageInput,
          {
            backgroundColor: colors.backgroundElement,
            borderColor: colors.border,
            color: colors.text,
          },
        ]}
        placeholder="Write a message"
        placeholderTextColor={colors.textSecondary}
        value={message}
        onChangeText={setMessage}
        multiline
      />

      <Pressable
        disabled={!canSend}
        onPress={() => router.back()}
        style={[
          styles.sendButton,
          { backgroundColor: colors.tint },
          !canSend && styles.sendDisabled,
        ]}>
        <Text style={[styles.sendLabel, { color: colors.onTint }]}>Send</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 16,
    gap: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
  },
  messageInput: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  sendButton: {
    marginTop: 20,
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: 'center',
  },
  sendDisabled: {
    opacity: 0.5,
  },
  sendLabel: {
    fontWeight: '600',
    fontSize: 16,
  },
});
