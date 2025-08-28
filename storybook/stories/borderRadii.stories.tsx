import {useTheme} from "@/lib/utils/theme";
import {View, Text, StyleSheet} from "react-native";

function BorderRadii() {
  const theme = useTheme();

  const radiusPresets = [
    {name: "none", value: "0px", className: "rounded-none"},
    {name: "sm", value: "0.125rem", className: "rounded-sm"},
    {name: "md", value: "0.375rem", className: "rounded-md"},
    {name: "lg", value: "0.5rem", className: "rounded-lg"},
    {name: "xl", value: "0.75rem", className: "rounded-xl"},
    {name: "full", value: "9999px", className: "rounded-full"},
  ];

  return (
    <View style={styles.container}>
      {radiusPresets.map(({name, value, className}) => (
        <View key={name} style={styles.radiusCard}>
          <View
            style={[styles.radiusSwatch, {backgroundColor: theme.primary}]}
            // @ts-expect-error - className is a valid prop for View with nativewind
            className={className}
          />
          <Text style={[styles.radiusName, {color: theme.foreground}]}>
            {name}
          </Text>
          <Text style={[styles.radiusValue, {color: theme.mutedForeground}]}>
            {value}
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
  radiusCard: {
    alignItems: "center",
    minWidth: 120,
    marginBottom: 16,
  },
  radiusSwatch: {
    width: 80,
    height: 80,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },
  radiusName: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 2,
    textAlign: "center",
  },
  radiusValue: {
    fontSize: 10,
    textAlign: "center",
  },
});

export default {
  title: "Design System/Border Radii",
  component: BorderRadii,
};

export const Default = {
  render: () => <BorderRadii />,
};
