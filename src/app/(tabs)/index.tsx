import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useThemeContext } from '@/context/ThemeContext';
import { useTheme } from '@/hooks/use-theme';

export default function HomeScreen() {
  const colors = useTheme();
  const { mode, toggle } = useThemeContext();
  const router = useRouter();

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}>
      <Text style={[styles.title, { color: colors.text }]}>Message</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Find your classmates, message them, and keep the ones you talk to most in one place.
      </Text>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Getting started</Text>
        <Text style={[styles.cardBody, { color: colors.textSecondary }]}>
          Open the Contacts tab to browse the directory, then open a contact to see the details.
        </Text>
      </View>

      <Pressable
        onPress={() => router.push('/new-message')}
        style={({ pressed }) => [
          styles.primaryButton,
          { backgroundColor: colors.tint },
          pressed && styles.pressed,
        ]}>
        <Text style={[styles.primaryLabel, { color: colors.onTint }]}>New message</Text>
      </Pressable>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Appearance</Text>
        <Text style={[styles.cardBody, { color: colors.textSecondary }]}>
          Currently using the {mode} theme. The choice is held in a context, so every screen
          follows it.
        </Text>
        <Pressable
          onPress={toggle}
          style={({ pressed }) => [
            styles.themeButton,
            { borderColor: colors.tint },
            pressed && styles.pressed,
          ]}>
          <Text style={[styles.themeLabel, { color: colors.tint }]}>
            {mode === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    padding: 24,
    gap: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 6,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  cardBody: {
    fontSize: 14,
    lineHeight: 20,
  },
  primaryButton: {
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryLabel: {
    fontWeight: '600',
    fontSize: 16,
  },
  themeButton: {
    borderWidth: 1,
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  themeLabel: {
    fontWeight: '600',
    fontSize: 15,
  },
  pressed: {
    opacity: 0.7,
  },
});
