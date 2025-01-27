import { View, StyleSheet } from "react-native";
import { Text, Chip, useTheme } from "react-native-paper";

export default function SingleChipSelection({
  options,
  selectedValue,
  setSelectedValue,
  label,
}: {
  options: { label: string; value: string }[];
  selectedValue: string | null;
  setSelectedValue: (value: string | null) => void;
  label: string;
}) {
  const theme = useTheme();

  return (
    <View style={{ padding: 16 }}>
      <Text style={styles.sectionLabel}>{label}</Text>
      <View style={styles.chipContainer}>
        {options.map((option) => (
          <Chip
            mode="outlined"
            key={option.value}
            selected={selectedValue === option.value}
            showSelectedCheck={false}
            onPress={() =>
              setSelectedValue(selectedValue === option.value ? null : option.value)
            }
            style={{
              backgroundColor: selectedValue === option.value
                ? theme.colors.onSecondary
                : theme.colors.secondary,
              margin: 4,
            }}
            textStyle={{
              color: selectedValue === option.value
                ? theme.colors.onSecondaryContainer
                : theme.colors.secondaryContainer,
            }}
          >
            {option.label}
          </Chip>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
});
