import {useTheme} from "@/lib/utils/theme";
import {View, Text, StyleSheet} from "react-native";

function Colors() {
  const theme = useTheme();

  // Get all theme color entries
  const themeEntries = Object.entries(theme).filter(
    ([key]) => key !== "radius", // Exclude non-color properties
  );

  return (
    <View style={styles.container}>
      {themeEntries.map(([colorName, colorValue]) => (
        <View key={colorName} style={styles.colorCard}>
          <View
            style={[
              styles.colorSwatch,
              {backgroundColor: colorValue as string},
            ]}
          />
          <Text style={[styles.colorName, {color: theme.foreground}]}>
            {colorName}
          </Text>
          <Text style={[styles.colorValue, {color: theme.mutedForeground}]}>
            {colorValue}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 16,
    gap: 12,
  },
  colorCard: {
    alignItems: "center",
    minWidth: 120,
    marginBottom: 16,
  },
  colorSwatch: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },
  colorName: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 2,
    textAlign: "center",
  },
  colorValue: {
    fontSize: 10,
    textAlign: "center",
  },
});

export default {
  title: "Design System/Colors",
  component: Colors,
};

export const Default = {
  render: () => <Colors />,
};
