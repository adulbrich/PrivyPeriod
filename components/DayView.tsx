import { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { insertDay } from "@/db/database";
import {
  List,
  Button,
  Text,
  useTheme,
  RadioButton,
  Divider,
  TextInput,
  Chip
} from "react-native-paper";

const options = ["None", "Spotting", "Light", "Medium", "Heavy"];
const symptomOptions = [
  { label: "Pain Free", value: "pain_free" },
  { label: "Cramps", value: "cramps" },
  { label: "Headache", value: "headache" },
  { label: "Migraine", value: "migraine" },
  { label: "Nausea", value: "nausea" },
  { label: "Fatigue", value: "fatigue" },
  { label: "Back Pain", value: "back_pain" },
  { label: "Bloating", value: "bloating" },
  { label: "Sleep Issues", value: "sleep_issues" },
  { label: "Muscle Aches", value: "muscle_aches" },
  { label: "Joint Pain", value: "joint_pain" },
  { label: "Acne", value: "acne" }, 
  { label: "Mood Swings", value: "mood_swings" },
  { label: "Diarrhea", value: "diarrhea" },
  { label: "Constipation", value: "constipation" },
  { label: "Increased Appetite", value: "increased_appetite" },
  { label: "Decreased Appetite", value: "decreased_appetite" },
  { label: "Breast Tenderness", value: "breat_tenderness" },
];
const moodOptions = [
  { label: "Energetic", value: "energetic" },
  { label: "Drowsy", value: "drowsy" },
  { label: "Anxious", value: "anxious" },
  { label: "Depressed", value: "depressed" },
  { label: "Happy", value: "happy" },
  { label: "Sad", value: "sad" },
  { label: "Irritable", value: "irritable" },
  { label: "Calm", value: "calm" },
  { label: "Motivated", value: "motivated" }, 
  { label: "Frustrated", value: "frustrated" },
  { label: "Content", value: "content" },
  { label: "Focused", value: "focused" },
  { label: "Overwhelmed", value: "overwhelmed" },
  { label: "Sensitive", value: "sensitive" },
  { label: "Confident", value: "confident" },
  { label: "Excited", value: "excited" },
  { label: "Insecure", value: "insecure" },
  { label: "Grateful", value: "grateful" },
];

// radio buttons adapted from code generated by ChatGPT-4o
function FlowRadioButtons({
  selectedOption,
  setSelectedOption,
}: {
  selectedOption: number;
  setSelectedOption: (option: number) => void;
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
  );
}

export default function DayView({
  date,
  dateFlow,
}: {
  date: string;
  dateFlow: number;
}) {
  const theme = useTheme();
  const [flow, setFlow] = useState<number>(dateFlow);
  // Track expanded dropdown menus
  const [expandedAccordion, setExpandedAccordion] = useState<string | null>(
    null,
  );

  function onSave() {
    insertDay(date, flow).then(() => {
      setFlow(flow);
      setExpandedAccordion(null); // Close all dropdowns when data is saved
    });
  }

  useEffect(() => {
    setFlow(dateFlow);
    setExpandedAccordion(null); // Close all dropdowns when selected date changes
  }, [dateFlow]);

  const [notes, setNotes] = useState<string>("");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);

  return (
    <View style={{ backgroundColor: theme.colors.background }}>
      <View style={styles.titleContainer}>
        <Text variant="titleLarge">
          {new Intl.DateTimeFormat("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          }).format(new Date(date + "T00:00:00"))}
        </Text>
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
              setExpandedAccordion(expandedAccordion === "flow" ? null : "flow")
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
            title={"Symptoms   |   " + selectedSymptoms.length + " Selected"}
            expanded={expandedAccordion === "symptoms"}
            onPress={() =>
              setExpandedAccordion(expandedAccordion === "symptoms" ? null : "symptoms")
            }
            left={(props) => <List.Icon {...props} icon="alert-decagram" />}
          >
            <View style={{ padding: 16 }}>
              <Text style={{ color: theme.colors.onBackground, fontSize: 16, fontWeight: 'normal' }}>
                Select Symptoms:
              </Text>
              <View style={styles.chipContainer}>
                {symptomOptions.map((symptom) => (
                  <Chip
                    mode={"outlined"}
                    key={symptom.value}
                    selected={selectedSymptoms.includes(symptom.value)}
                    showSelectedCheck={false}
                    onPress={() => {
                      setSelectedSymptoms((prev) =>
                        prev.includes(symptom.value)
                          ? prev.filter((val) => val !== symptom.value)
                          : [...prev, symptom.value]
                      );
                    }}
                    style={{
                      backgroundColor: selectedSymptoms.includes(symptom.value)
                        ? theme.colors.onSecondary // Color for selected chip
                        : theme.colors.secondary, // Color for unselected chip
                      margin: 4,
                    }}
                    textStyle={{
                      color: selectedSymptoms.includes(symptom.value)
                        ? theme.colors.onSecondaryContainer // Text color for selected chip
                        : theme.colors.secondaryContainer, // Text color for unselected chip
                    }}
                  >
                    {symptom.label}
                  </Chip>
                ))}
              </View>
            </View>
          </List.Accordion>
          <Divider />
          <List.Accordion
            title="Medications"
            expanded={expandedAccordion === "medications"}
            onPress={() =>
              setExpandedAccordion(
                expandedAccordion === "medications" ? null : "medications"
              )
            }
            left={(props) => <List.Icon {...props} icon="pill" />}
          >
            <View style={{ padding: 16 }}>
            <Text>Nothing here yet!</Text>
            </View>
          </List.Accordion>
          <Divider />
          <List.Accordion
            title={"Moods   |   " + selectedMoods.length + " Selected"}
            expanded={expandedAccordion === "mood"}
            onPress={() =>
              setExpandedAccordion(
                expandedAccordion === "mood" ? null : "mood"
              )
            }
            left={(props) => <List.Icon {...props} icon="emoticon" />}
          >
            <View style={{ padding: 16 }}>
              <Text style={{ color: theme.colors.onBackground, fontSize: 16, fontWeight: 'normal' }}>
                Select Moods:
              </Text>
              <View style={styles.chipContainer}>
                {moodOptions.map((mood) => (
                  <Chip
                    mode={"outlined"}
                    key={mood.value}
                    selected={selectedMoods.includes(mood.value)}
                    showSelectedCheck={false}
                    onPress={() => {
                      setSelectedMoods((prev) =>
                        prev.includes(mood.value)
                          ? prev.filter((val) => val !== mood.value)
                          : [...prev, mood.value]
                      );
                    }}
                    style={{
                      backgroundColor: selectedMoods.includes(mood.value)
                        ? theme.colors.onSecondary // Color for selected chip
                        : theme.colors.secondary, // Color for unselected chip
                      margin: 4,
                    }}
                    textStyle={{
                      color: selectedMoods.includes(mood.value)
                        ? theme.colors.onSecondaryContainer // Text color for selected chip
                        : theme.colors.secondaryContainer, // Text color for unselected chip
                    }}
                  >
                    {mood.label}
                  </Chip>
                ))}
              </View>
            </View>
          </List.Accordion>
          <Divider />
          <List.Accordion
            title="Notes"
            expanded={expandedAccordion === "notes"}
            onPress={() =>
              setExpandedAccordion(
                expandedAccordion === "notes" ? null : "notes",
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
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
