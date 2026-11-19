import { StyleSheet, Text, View } from "react-native";

import type { Contact } from "@/data/contacts";
import { useTheme } from "@/hooks/use-theme";

function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

type ContactRowProps = {
  contact: Contact;
  favourite?: boolean;
};

export function ContactRow({ contact, favourite = false }: ContactRowProps) {
  const colors = useTheme();

  return (
    <View style={[styles.row, { backgroundColor: colors.card }]}>
      <View style={[styles.avatar, { backgroundColor: colors.backgroundSelected }]}>
        <Text style={[styles.initials, { color: colors.text }]}>{initialsOf(contact.name)}</Text>
      </View>
      <View style={styles.info}>
        <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
          {contact.name}
        </Text>
        <Text style={[styles.program, { color: colors.textSecondary }]} numberOfLines={1}>
          {contact.program}
        </Text>
      </View>
      {favourite && <Text style={[styles.star, { color: colors.accent }]}>★</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  initials: {
    fontSize: 16,
    fontWeight: "600",
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
  },
  program: {
    fontSize: 13,
    marginTop: 2,
  },
  star: {
    fontSize: 18,
  },
});
