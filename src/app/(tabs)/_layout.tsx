import { Tabs } from 'expo-router';

import { FavouritesProvider } from '@/context/FavouritesContext';
import { useTheme } from '@/hooks/use-theme';

export default function TabsLayout() {
  const colors = useTheme();

  return (
    <FavouritesProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.tint,
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarStyle: {
            backgroundColor: colors.card,
            borderTopColor: colors.border,
          },
        }}>
        <Tabs.Screen name="index" options={{ title: 'Home' }} />
        <Tabs.Screen name="contacts" options={{ title: 'Contacts' }} />
        <Tabs.Screen name="favourites" options={{ title: 'Favourites' }} />
      </Tabs>
    </FavouritesProvider>
  );
}
