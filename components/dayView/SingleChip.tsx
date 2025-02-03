import { View, StyleSheet } from "react-native";
import { Text, Chip, useTheme } from "react-native-paper";

export default function SingleChip({
  label,
  selectedValue,
  setSelectedValue,
}: {
  label: string;
  selectedValue: boolean;
  setSelectedValue: (value: boolean) => void;
}) {
  const theme = useTheme();

  return (
    <View style={{ padding: 16 }}>
      <Text style={styles.sectionLabel}>{label}</Text>
      <View style={styles.chipContainer}>
          <Chip
            mode="flat"
            selected={selectedValue}
            showSelectedCheck={true}
            elevated={true}
            onPress={() =>
              setSelectedValue(selectedValue === selectedValue ? !selectedValue : selectedValue)
            }
            style={{
              backgroundColor:
                selectedValue === true
                  ? theme.colors.onSecondary
                  : theme.colors.secondary,
              margin: 4,
              borderRadius: 20,
              height: 36,
              justifyContent: "center",
            }}
            textStyle={{
              color:
                selectedValue === true
                  ? theme.colors.onSecondaryContainer
                  : theme.colors.secondaryContainer,
            }}
          >
            {label}
          </Chip>
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
