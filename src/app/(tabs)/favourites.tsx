import { Link } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { ContactRow } from '@/components/ContactRow';
import { useFavourites } from '@/context/FavouritesContext';
import { CONTACTS } from '@/data/contacts';
import { useTheme } from '@/hooks/use-theme';

export default function Favourites() {
  const { ids, clear } = useFavourites();
  const colors = useTheme();
  const favourites = CONTACTS.filter((c) => ids.includes(c.id));

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <FlatList
        data={favourites}
        keyExtractor={(c) => c.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          favourites.length > 0 ? (
            <View style={styles.headerRow}>
              <Text style={[styles.count, { color: colors.textSecondary }]}>
                {favourites.length} favourite(s)
              </Text>
              <Pressable onPress={clear} hitSlop={8}>
                <Text style={[styles.action, { color: colors.tint }]}>Clear all</Text>
              </Pressable>
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <Link
            href={{ pathname: '/contacts/[id]', params: { id: item.id } }}
            asChild>
            <Pressable style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}>
              <ContactRow contact={item} favourite />
            </Pressable>
          </Link>
        )}
        ItemSeparatorComponent={() => (
          <View style={[styles.separator, { backgroundColor: colors.border }]} />
        )}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: colors.textSecondary }]}>
            No favourites yet. Open a contact and tap ☆.
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
    padding: 16,
    paddingBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 8,
  },
  count: {
    fontSize: 14,
  },
  action: {
    fontWeight: '600',
    fontSize: 14,
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
  },
});
