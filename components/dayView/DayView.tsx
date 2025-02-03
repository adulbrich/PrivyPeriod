import { useEffect, useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { insertDay, getDay } from "@/db/database";
import { List, Button, Text, useTheme, Divider } from "react-native-paper";
import {
  useAccordion,
  useMoods,
  useSelectedDate,
  useSymptoms,
  useMedications,
  useBirthControl,
  useBirthControlNotes,
  useTimeTaken,
} from "@/assets/src/calendar-storage";
import FlowAccordion from "@/components/dayView/FlowAccordion";
import MedicationsAccordion from "./MedicationsAccordion";
import BirthControlAccordion from "./BirthControlAccordion";
import SymptomsAccordion from "./SymptomsAccordion";
import MoodsAccordion from "./MoodsAccordion";
import NotesAccordion from "./NotesAccordion";
import { useSyncEntries } from "@/hooks/useSyncEntries";
import { useFetchEntries } from "@/hooks/useFetchEntries";
import { useFetchMedicationEntries } from "@/hooks/useFetchMedicationEntries";
import { useSyncMedicationEntries } from "@/hooks/useSyncMedicationEntries";

export default function DayView() {
  const theme = useTheme();
  const { state, setExpandedAccordion } = useAccordion();
  const { selectedMoods, setSelectedMoods } = useMoods();
  const { date, flow_intensity, notes, is_cycle_end, is_cycle_start, setCycleEnd, setCycleStart, setFlow, setNotes } = useSelectedDate();
  const { selectedSymptoms, setSelectedSymptoms } = useSymptoms();
  const { selectedMedications, setSelectedMedications } = useMedications();
  const { selectedBirthControl, setSelectedBirthControl } = useBirthControl();
  const { birthControlNotes, setBirthControlNotes } = useBirthControlNotes();
  const { timeTaken, setTimeTaken } = useTimeTaken();

  const { syncEntries } = useSyncEntries(date);
  const { fetchEntries } = useFetchEntries(
    date,
    setSelectedSymptoms,
    setSelectedMoods,
  );
  const { syncMedicationEntries } = useSyncMedicationEntries(date);
  const { fetchMedicationEntries } = useFetchMedicationEntries(
    date,
    setSelectedBirthControl,
    setSelectedMedications,
    setBirthControlNotes,
    setTimeTaken,
  );

  const fetchNotes = useCallback(async () => {
    const day = await getDay(date);
    if (day && day.notes) {
      setNotes(day.notes);
    } else {
      setNotes("");
    }
  }, [date, setNotes]);

  function onSave() {
    insertDay(date, flow_intensity, is_cycle_start, is_cycle_end, notes).then(async () => {
      console.log("date", date)
      setFlow(flow_intensity);
      console.log("flow", flow_intensity)
      setCycleStart(is_cycle_start)
      console.log("cyclestart", is_cycle_start)
      setCycleEnd(is_cycle_end)
      console.log("cycleend", is_cycle_end)
      setExpandedAccordion(null);

      await syncEntries(selectedSymptoms, "symptom");
      await syncEntries(selectedMoods, "mood");
      if (selectedBirthControl != null) {
        selectedMedications.push(selectedBirthControl);
      }
      await syncMedicationEntries(
        selectedMedications,
        timeTaken,
        birthControlNotes,
      );

      await fetchEntries("symptom");
      await fetchEntries("mood");
      await fetchMedicationEntries();
      await fetchNotes();
      console.log("cyclestart2", is_cycle_start)
      console.log("cycleend2", is_cycle_end)
    });
  }

  useEffect(() => {
    if (flow_intensity !== null) {
      setFlow(flow_intensity);
    }
  }, [date, flow_intensity, setFlow]);

  useEffect(() => {
    if (is_cycle_start !== null) {
      setCycleStart(is_cycle_start);
      console.log("cyclestart3", is_cycle_start)

    }
  }, [date, setCycleStart]);

  useEffect(() => {
    if (is_cycle_end !== null) {
      setCycleEnd(is_cycle_end);
      console.log("cycleend3", is_cycle_end)
    }
  }, [date, is_cycle_end, setCycleEnd]);

  useEffect(() => {
    fetchEntries("symptom");
    fetchEntries("mood");
    fetchMedicationEntries();
    fetchNotes();
    setExpandedAccordion(null);
  }, [fetchEntries, fetchNotes, fetchMedicationEntries, setExpandedAccordion]);

  return (
    <View style={{ backgroundColor: theme.colors.background }}>
      <View style={styles.titleContainer}>
        <Text variant="titleLarge">
          {new Intl.DateTimeFormat("en-US", {
            weekday: "short",
            month: "short",
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
          <FlowAccordion
            state={state}
            setExpandedAccordion={setExpandedAccordion}
            flow_intensity={flow_intensity}
            setFlow={setFlow}
            is_cycle_start={is_cycle_start}
            is_cycle_end={is_cycle_end}
            setCycleStart={setCycleStart}
            setCycleEnd={setCycleEnd}
          />
          <Divider />
          <SymptomsAccordion
            state={state}
            setExpandedAccordion={setExpandedAccordion}
            selectedSymptoms={selectedSymptoms}
            setSelectedSymptoms={setSelectedSymptoms}
          />
          <Divider />
          <MoodsAccordion
            state={state}
            setExpandedAccordion={setExpandedAccordion}
            selectedMoods={selectedMoods}
            setSelectedMoods={setSelectedMoods}
          />
          <Divider />
          <MedicationsAccordion
            state={state}
            setExpandedAccordion={setExpandedAccordion}
            selectedMedications={selectedMedications}
            setSelectedMedications={setSelectedMedications}
          />
          <Divider />
          <BirthControlAccordion
            state={state}
            setExpandedAccordion={setExpandedAccordion}
            selectedBirthControl={selectedBirthControl}
            setSelectedBirthControl={setSelectedBirthControl}
          />
          <Divider />
          <NotesAccordion
            state={state}
            setExpandedAccordion={setExpandedAccordion}
            notes={notes}
            setNotes={setNotes}
          />
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
});
