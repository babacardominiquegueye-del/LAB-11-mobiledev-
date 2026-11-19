import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useFavourites } from '@/context/FavouritesContext';
import { CONTACTS } from '@/data/contacts';
import { useTheme } from '@/hooks/use-theme';

export default function ContactDetail() {
  const colors = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isFavourite, toggle } = useFavourites();
  const contact = CONTACTS.find((c) => c.id === id);

  if (!contact) {
    return (
      <View style={[{ backgroundColor: colors.background }, styles.screen]}>
        <Text style={[{ color: colors.textSecondary }, styles.missing]}>
          This contact does not exist.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[{ width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center', marginTop: 16, backgroundColor: colors.backgroundSelected }]} />
      <Text style={styles.name}>{contact.name}</Text>
      <Text style={styles.program}>{contact.program}</Text>

      <Pressable
        onPress={() => toggle(contact.id)}
        style={({ pressed }) => [
          styles.favButton,
          { borderColor: colors.accent },
          pressed && styles.pressed,
        ]}>
        <Text style={styles.favLabel}>
          {isFavourite(contact.id) ? '★ Favourite' : '☆ Add to favourites'}
        </Text>
      </Pressable>

      <View style={[
        styles.details,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}>
        <Text style={styles.detailLine}>{contact.phone}</Text>
        <Text style={styles.detailLine}>{contact.email}</Text>
      </View>

      <Pressable
        onPress={() =>
          router.push({
            pathname: '/contacts/chat',
            params: { id: contact.id, name: contact.name },
          })
        }
        style={({ pressed }) => [
          styles.messageButton,
          { backgroundColor: colors.tint },
          pressed && styles.pressed,
        ]}>
        <Text style={styles.messageLabel}>Send a message</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    padding: 24,
    gap: 8,
  },
  missing: {
    marginTop: 48,
    fontSize: 16,
  },
  container: {
    backgroundColor: 'transparent',
  },
  favButton: {
    borderWidth: 1,
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 16,
  },
  favLabel: {
    fontWeight: '600',
    fontSize: 15,
  },
  details: {
    alignSelf: 'stretch',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 6,
    marginTop: 16,
  },
  detailLine: {
    fontSize: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 12,
  },
  program: {
    fontSize: 16,
  },
  messageButton: {
    marginTop: 20,
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  messageLabel: {
    fontWeight: '600',
    fontSize: 16,
  },
  pressed: {
    opacity: 0.7,
  },
});