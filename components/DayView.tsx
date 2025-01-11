import { useState, useEffect } from "react"
import { StyleSheet, View } from "react-native"
import { insertDay } from "@/db/database"
import {
  List,
  Button,
  Text,
  useTheme,
  RadioButton,
  Divider,
  TextInput,
} from "react-native-paper"

const options = ["None", "Spotting", "Light", "Medium", "Heavy"]

// radio buttons adapted from code generated by ChatGPT-4o
function FlowRadioButtons({
  selectedOption,
  setSelectedOption,
}: {
  selectedOption: number
  setSelectedOption: (option: number) => void
}) {
  return (
    <View style={{ width: "100%" }}>
      <RadioButton.Group
        value={options[selectedOption]}
        onValueChange={(value) => setSelectedOption(options.indexOf(value))}
      >
        {options.map((button) => (
          <RadioButton.Item
            key={button}
            label={button}
            value={button}
          ></RadioButton.Item>
        ))}
      </RadioButton.Group>
    </View>
  )
}

export default function DayView({
  date,
  dateFlow,
}: {
  date: string
  dateFlow: number
}) {
  const theme = useTheme()
  const [flow, setFlow] = useState<number>(dateFlow)
  // Track expanded dropdown menus
  const [expandedAccordion, setExpandedAccordion] = useState<string | null>(null) 

  function onSave() {
    console.log("save: " + date + " " + flow)
    insertDay(date, flow)
    setExpandedAccordion(null) // Close all dropdowns when data is saved
  }

  useEffect(() => {
    console.log("dateFlow: " + dateFlow)
    setFlow(dateFlow)
    setExpandedAccordion(null) // Close all dropdowns when selected date changes
  }, [dateFlow])

  const [notes, setNotes] = useState<string>("")

  return (
    <View style={{ backgroundColor: theme.colors.background }}>
      <View style={styles.titleContainer}>
        <Text variant="titleLarge">{date}</Text>
        <Button mode="elevated" onPress={() => onSave()}>
          Save
        </Button>
      </View>
      <View>
        <List.Section>
          <List.Accordion
            title={"Flow Intensity   |   " + options[flow]}
            expanded={expandedAccordion === "flow"}
            onPress={() =>
              setExpandedAccordion(
                expandedAccordion === "flow" ? null : "flow"
              )
            }
            left={(props) => <List.Icon {...props} icon="water" />}
          >
            <FlowRadioButtons
              selectedOption={flow}
              setSelectedOption={setFlow}
            />
          </List.Accordion>
          <Divider />

          <List.Accordion
            title="Pain"
            expanded={expandedAccordion === "pain"}
            onPress={() =>
              setExpandedAccordion(
                expandedAccordion === "pain" ? null : "pain"
              )
            }
            left={(props) => <List.Icon {...props} icon="alert-decagram" />}
          >
            <View style={{ padding: 16 }}>
              <Text>Nothing here yet!</Text>
            </View>
          </List.Accordion>
          <Divider />

          <List.Accordion
            title="Notes"
            expanded={expandedAccordion === "notes"}
            onPress={() =>
              setExpandedAccordion(
                expandedAccordion === "notes" ? null : "notes"
              )
            }
            left={(props) => <List.Icon {...props} icon="note" />}
          >
            <View style={{ padding: 16 }}>
              <TextInput
                label="Notes"
                value={notes}
                onChangeText={(notes) => setNotes(notes)}
                placeholder="Add Notes..."
              />
            </View>
          </List.Accordion>
        </List.Section>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
})
