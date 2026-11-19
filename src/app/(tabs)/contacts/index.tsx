import { Link } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { ContactRow } from '@/components/ContactRow';
import { useFavourites } from '@/context/FavouritesContext';
import { CONTACTS, type Contact } from '@/data/contacts';
import { useTheme } from '@/hooks/use-theme';

function matches(contact: Contact, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    contact.name.toLowerCase().includes(q) || contact.program.toLowerCase().includes(q)
  );
}

export default function Contacts() {
  const colors = useTheme();
  const { isFavourite } = useFavourites();
  const [query, setQuery] = useState('');
  const filtered = CONTACTS.filter((contact) => matches(contact, query));

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <FlatList
        data={filtered}
        keyExtractor={(contact) => contact.id}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <TextInput
            style={[
              styles.search,
              {
                backgroundColor: colors.backgroundElement,
                borderColor: colors.border,
                color: colors.text,
              },
            ]}
            placeholder="Search by name or programme"
            placeholderTextColor={colors.textSecondary}
            value={query}
            onChangeText={setQuery}
          />
        }
        renderItem={({ item }) => (
          <Link
            href={{ pathname: '/contacts/[id]', params: { id: item.id } }}
            asChild>
            <Pressable style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}>
              <ContactRow contact={item} favourite={isFavourite(item.id)} />
            </Pressable>
          </Link>
        )}
        ItemSeparatorComponent={() => (
          <View style={[styles.separator, { backgroundColor: colors.border }]} />
        )}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: colors.textSecondary }]}>
            No contacts match your search.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  list: {
    paddingBottom: 24,
  },
  search: {
    margin: 16,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
  },
  pressable: {
    flex: 1,
  },
  pressed: {
    opacity: 0.6,
  },
  separator: {
    height: 1,
    marginLeft: 72,
  },
  empty: {
    textAlign: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
});
