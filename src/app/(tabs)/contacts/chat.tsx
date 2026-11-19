import { File, Paths } from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import type { Message } from '@/types/message';

const SEED: Message[] = [
  { id: 'm1', kind: 'text', text: 'Hi! Are you coming to the lab session?', mine: false },
  { id: 'm2', kind: 'text', text: 'Yes, I will be there at 10.', mine: true },
];

async function keepPhoto(tempUri: string): Promise<string> {
  const source = new File(tempUri);
  const rawExt = source.extension || '.jpg';
  const ext = rawExt.startsWith('.') ? rawExt : `.${rawExt}`;
  const destination = new File(Paths.document, `photo-${Date.now()}${ext}`);
  source.copy(destination);
  return destination.uri;
}

export default function Chat() {
  const { name } = useLocalSearchParams<{ id: string; name: string }>();
  const colors = useTheme();
  const [messages, setMessages] = useState<Message[]>(SEED);
  const [draft, setDraft] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [canOpenSettings, setCanOpenSettings] = useState(false);

  function sendText() {
    const text = draft.trim();
    if (!text) return;
    setMessages((current) => [
      ...current,
      { id: `m${current.length}-${Date.now()}`, kind: 'text', text, mine: true },
    ]);
    setDraft('');
  }

  async function pickPhoto() {
    setNotice(null);
    setCanOpenSettings(false);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.7,
    });
    if (result.canceled) return;
    const asset = result.assets[0];
    if (asset) {
      setPhotoUri(asset.uri);
    }
  }

  async function takePhoto() {
    setNotice(null);
    setCanOpenSettings(false);

    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      if (!permission.canAskAgain) {
        setNotice('Camera access is blocked. Enable it in Settings to take a photo.');
        setCanOpenSettings(true);
      } else {
        setNotice(
          'Camera access was refused. You can still send text or attach a photo from your library.'
        );
      }
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.7,
    });
    if (result.canceled) return;
    const asset = result.assets[0];
    if (asset) {
      setPhotoUri(asset.uri);
    }
  }

  async function sendPhoto() {
    if (!photoUri) return;
    try {
      const uri = await keepPhoto(photoUri);
      setMessages((current) => [
        ...current,
        { id: `m${current.length}-${Date.now()}`, kind: 'photo', uri, mine: true },
      ]);
      setPhotoUri(null);
    } catch {
      setNotice('Could not save the selected photo. Please try again.');
      setCanOpenSettings(false);
    }
  }

  async function handleSend() {
    if (photoUri) {
      await sendPhoto();
      return;
    }
    sendText();
  }

  function renderBubbleContent(message: Message, textColor: string) {
    switch (message.kind) {
      case 'text':
        return <Text style={[styles.bubbleText, { color: textColor }]}>{message.text}</Text>;
      case 'photo':
        return <Image source={{ uri: message.uri }} style={styles.photoMessage} />;
      case 'location':
        return (
          <Text style={[styles.bubbleText, { color: textColor }]}>
            Location{message.approximate ? ' (approximate)' : ''}
          </Text>
        );
    }
  }

  return (
    <KeyboardAvoidingView
      style={[styles.screen, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}>
      <Stack.Screen options={{ title: name ?? 'Chat' }} />
      <FlatList
        data={messages}
        keyExtractor={(message) => message.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const isMine = item.mine ?? true;
          const textColor = isMine ? colors.onTint : colors.text;
          return (
            <View
              style={[
                styles.bubbleRow,
                { justifyContent: isMine ? 'flex-end' : 'flex-start' },
              ]}>
              <View
                style={[
                  styles.bubble,
                  item.kind === 'photo' && styles.photoBubble,
                  { backgroundColor: isMine ? colors.tint : colors.card },
                ]}>
                {renderBubbleContent(item, textColor)}
              </View>
            </View>
          );
        }}
      />

      {notice && (
        <View
          style={[
            styles.noticeBar,
            { backgroundColor: colors.card, borderTopColor: colors.border },
          ]}>
          <Text style={[styles.noticeText, { color: colors.text }]}>{notice}</Text>
          <View style={styles.noticeActions}>
            {canOpenSettings && (
              <Pressable
                onPress={() => Linking.openSettings()}
                style={({ pressed }) => [
                  styles.noticeButton,
                  { backgroundColor: colors.tint },
                  pressed && styles.pressed,
                ]}>
                <Text style={[styles.noticeButtonText, { color: colors.onTint }]}>
                  Open Settings
                </Text>
              </Pressable>
            )}
            <Pressable
              onPress={() => {
                setNotice(null);
                setCanOpenSettings(false);
              }}
              style={({ pressed }) => [styles.dismissButton, pressed && styles.pressed]}>
              <Text style={[styles.dismissText, { color: colors.textSecondary }]}>Dismiss</Text>
            </Pressable>
          </View>
        </View>
      )}

      {photoUri && (
        <View
          style={[
            styles.previewBar,
            { backgroundColor: colors.card, borderTopColor: colors.border },
          ]}>
          <Image source={{ uri: photoUri }} style={styles.previewImage} />
          <Pressable
            onPress={() => setPhotoUri(null)}
            style={({ pressed }) => [
              styles.removeButton,
              { borderColor: colors.border },
              pressed && styles.pressed,
            ]}>
            <Text style={[styles.removeLabel, { color: colors.text }]}>Remove</Text>
          </Pressable>
        </View>
      )}

      <View
        style={[
          styles.composer,
          { backgroundColor: colors.card, borderTopColor: colors.border },
        ]}>
        <Pressable
          onPress={pickPhoto}
          accessibilityLabel="Attach photo from library"
          style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}>
          <Text style={styles.iconLabel}>📎</Text>
        </Pressable>
        <Pressable
          onPress={takePhoto}
          accessibilityLabel="Take photo with camera"
          style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}>
          <Text style={styles.iconLabel}>📷</Text>
        </Pressable>
        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholder="Type a message"
          placeholderTextColor={colors.textSecondary}
          value={draft}
          onChangeText={setDraft}
          onSubmitEditing={handleSend}
          returnKeyType="send"
        />
        <Pressable
          onPress={handleSend}
          style={({ pressed }) => [
            styles.send,
            { backgroundColor: colors.tint },
            pressed && styles.pressed,
          ]}>
          <Text style={[styles.sendLabel, { color: colors.onTint }]}>Send</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  list: {
    padding: 16,
    gap: 8,
  },
  bubbleRow: {
    flexDirection: 'row',
  },
  bubble: {
    maxWidth: '80%',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  photoBubble: {
    padding: 4,
  },
  bubbleText: {
    fontSize: 15,
    lineHeight: 20,
  },
  photoMessage: {
    width: 220,
    height: 220,
    borderRadius: 12,
  },
  noticeBar: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    gap: 8,
  },
  noticeText: {
    fontSize: 14,
    lineHeight: 19,
  },
  noticeActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  noticeButton: {
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  noticeButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  dismissButton: {
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  dismissText: {
    fontSize: 13,
    fontWeight: '500',
  },
  previewBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
  },
  previewImage: {
    width: 72,
    height: 72,
    borderRadius: 10,
  },
  removeButton: {
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  removeLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderTopWidth: 1,
  },
  iconButton: {
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  iconLabel: {
    fontSize: 20,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  send: {
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  sendLabel: {
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.7,
  },
});
