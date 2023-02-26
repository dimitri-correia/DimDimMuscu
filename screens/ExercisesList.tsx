import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ExercisesListStyles from "../styles/ExercisesListStyles";
import { ExercisesEntry } from "../logic/ExercisesListLogic";
import {
  addExerciseEntry,
  addMuscleGroupEntry,
  getExerciseEntries,
  getMuscleGroupEntries,
} from "../database/ExercisesListDB";
import * as TextEL from "../assets/texts/ExercisesListTexts";
import CommonStyles, { editWeightStyles } from "../styles/CommonStyles";
import { confirmationChanges } from "../components/commons/ValidateChanges";
import { Picker } from "@react-native-picker/picker";
import * as TextCommon from "../assets/texts/Common";

export const ExercisesList: React.FC = () => {
  const [exerciseEntries, setExerciseEntries] = useState<ExercisesEntry[]>([]);
  const [muscleGroupEntries, setMuscleGroupEntries] = useState<
    Map<number, string>
  >(new Map());

  const [modalEx, setModalEx] = useState<boolean>(false);
  const [modalExName, setModalExName] = useState<string>("");
  const [modalExPrimary, setModalExPrimary] = useState<number>(1);
  const [modalExSecondary, setModalExSecondary] = useState<number>(0);

  const [modalGM, setModalGM] = useState<boolean>(false);
  const [modalGMName, setModalGMName] = useState<string>("");

  const handleAddExercise = addExercise(
    setModalEx,
    modalExName,
    modalExPrimary,
    modalExSecondary,
    exerciseEntries
  );
  const handleAddMuscleGroup = addMuscleGroup(
    setModalGM,
    modalGMName,
    muscleGroupEntries
  );

  useEffect(() => {
    refreshExercisesAndMuscleEntries(setExerciseEntries, setMuscleGroupEntries);
  }, [modalEx, modalGM]);

  return (
    <View style={CommonStyles.container}>
      <ModalAddMuscleGroup
        modalGM={modalGM}
        setModalGM={setModalGM}
        setModalGMName={setModalGMName}
        handleAddMuscleGroup={handleAddMuscleGroup}
      />
      <ModalAddExercise
        modalEx={modalEx}
        setModalEx={setModalEx}
        setModalExName={setModalExName}
        modalExPrimary={modalExPrimary}
        setModalExPrimary={setModalExPrimary}
        modalExSecondary={modalExSecondary}
        setModalExSecondary={setModalExSecondary}
        muscleGroupEntries={muscleGroupEntries}
        handleAddExercise={handleAddExercise}
      />
      <Button title={TextEL.addExercise} onPress={() => setModalEx(true)} />
      <ScrollView>
        <View style={ExercisesListStyles.row}>
          <Text style={ExercisesListStyles.header}>{TextEL.exerciseName}</Text>
          <Text style={ExercisesListStyles.header}>
            {TextEL.primaryMuscleGroup}
          </Text>
          <Text style={ExercisesListStyles.header}>
            {TextEL.secondaryMuscleGroup}
          </Text>
        </View>
        {exerciseEntries
          .sort((entry) => entry.primaryMuscleGroupId)
          .map((entry: ExercisesEntry) => (
            <View style={ExercisesListStyles.row} key={entry.id}>
              <Text style={[ExercisesListStyles.item, { flex: 2 }]}>
                {entry.name}
              </Text>
              <Text style={ExercisesListStyles.item}>
                {muscleGroupEntries.get(entry.primaryMuscleGroupId)}
              </Text>
              <Text style={ExercisesListStyles.item}>
                {muscleGroupEntries.get(entry.secondaryMuscleGroupId)}
              </Text>
            </View>
          ))}
      </ScrollView>

      <Button title={TextEL.addMuscleGroup} onPress={() => setModalGM(true)} />
      <ScrollView>
        <View style={ExercisesListStyles.row}>
          <Text style={ExercisesListStyles.header}>Name</Text>
        </View>
        {Array.from(muscleGroupEntries.values())
          .filter((a, id) => id != 0) // filter the empty value (id=0)
          .reduce((rows: string[][], entry: string, index: number) => {
            if (index % 3 === 0) {
              rows.push([entry]);
            } else {
              rows[rows.length - 1].push(entry);
            }
            return rows;
          }, [])
          .map((row: string[], rowIndex: number) => (
            <View style={ExercisesListStyles.row} key={rowIndex}>
              {row.map((entry: string, entryIndex: number) => (
                <Text style={ExercisesListStyles.item} key={entryIndex}>
                  {entry}
                </Text>
              ))}
            </View>
          ))}
      </ScrollView>
    </View>
  );
};

interface ModalAddMuscleGroupProps {
  modalGM: boolean;
  setModalGM: any;
  setModalGMName: any;
  handleAddMuscleGroup: any;
}

const ModalAddMuscleGroup = ({
  modalGM,
  setModalGM,
  setModalGMName,
  handleAddMuscleGroup,
}: ModalAddMuscleGroupProps) => {
  return (
    <Modal animationType="slide" transparent={true} visible={modalGM}>
      <View style={editWeightStyles.modal}>
        <View style={editWeightStyles.background}>
          <View style={editWeightStyles.line}>
            <Text style={editWeightStyles.title}>New Muscle Group Name</Text>
          </View>
          <View style={editWeightStyles.line}>
            <Text style={editWeightStyles.label}>{TextEL.addMuscleGroup}</Text>
            <TextInput
              style={editWeightStyles.input}
              onChangeText={(text) => setModalGMName(text)}
            />
          </View>
          <View style={editWeightStyles.line}>
            <TouchableOpacity
              style={[editWeightStyles.button, editWeightStyles.buttonOK]}
              onPress={handleAddMuscleGroup}
            >
              <Text style={editWeightStyles.buttonText}>{TextCommon.save}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[editWeightStyles.button, editWeightStyles.buttonKO]}
              onPress={() => setModalGM(false)}
            >
              <Text style={editWeightStyles.buttonText}>
                {TextCommon.cancel}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

interface ModalAddExerciseProps {
  handleAddExercise: any;
  modalEx: any;
  modalExPrimary: number;
  modalExSecondary: any;
  muscleGroupEntries: Map<number, string>;
  setModalEx: any;
  setModalExName: any;
  setModalExPrimary: any;
  setModalExSecondary: any;
}

const ModalAddExercise = ({
  modalEx,
  setModalEx,
  setModalExName,
  modalExPrimary,
  setModalExPrimary,
  modalExSecondary,
  setModalExSecondary,
  muscleGroupEntries,
  handleAddExercise,
}: ModalAddExerciseProps) => {
  return (
    <Modal animationType="slide" transparent={true} visible={modalEx}>
      <View style={editWeightStyles.modal}>
        <View style={editWeightStyles.background}>
          <View style={editWeightStyles.line}>
            <Text style={editWeightStyles.title}>Edit Weight Entry</Text>
          </View>
          <View style={editWeightStyles.line}>
            <Text style={editWeightStyles.label}>{TextEL.addExercise}</Text>
            <TextInput
              style={editWeightStyles.input}
              onChangeText={(text) => setModalExName(text)}
            />
          </View>

          <Text>{TextEL.primaryMuscleGroup}</Text>
          <Picker
            selectedValue={modalExPrimary}
            onValueChange={(value: number) => setModalExPrimary(value)}
          >
            {Array.from(muscleGroupEntries.entries())
              .filter(([id]) => id != 0) // id = 0 is empty muscle group
              .map(([id, name]) => (
                <Picker.Item key={id} label={name} value={id} />
              ))}
          </Picker>

          <Text>{TextEL.secondaryMuscleGroup}</Text>
          <Picker
            selectedValue={modalExSecondary}
            onValueChange={(value: number) => setModalExSecondary(value)}
          >
            {Array.from(muscleGroupEntries.entries()).map(([id, name]) => (
              <Picker.Item key={id} label={name} value={id} />
            ))}
          </Picker>

          <View style={editWeightStyles.line}>
            <TouchableOpacity
              style={[editWeightStyles.button, editWeightStyles.buttonOK]}
              onPress={handleAddExercise}
            >
              <Text style={editWeightStyles.buttonText}>{TextCommon.save}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[editWeightStyles.button, editWeightStyles.buttonKO]}
              onPress={() => setModalEx(false)}
            >
              <Text style={editWeightStyles.buttonText}>
                {TextCommon.cancel}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

function refreshExercisesAndMuscleEntries(
  setExerciseEntries: (
    value:
      | ((prevState: ExercisesEntry[]) => ExercisesEntry[])
      | ExercisesEntry[]
  ) => void,
  setMuscleGroupEntries: (
    value:
      | ((prevState: Map<number, string>) => Map<number, string>)
      | Map<number, string>
  ) => void
) {
  getExerciseEntries().then((ex: ExercisesEntry[]) => {
    setExerciseEntries(ex);
  });
  getMuscleGroupEntries().then((mg: Map<number, string>) => {
    setMuscleGroupEntries(mg);
  });
}

function addExercise(
  setModalEx: (value: ((prevState: boolean) => boolean) | boolean) => void,
  modalExName: string,
  modalExPrimary: number,
  modalExSecondary: number,
  exerciseEntry: ExercisesEntry[]
) {
  return () => {
    if (
      !modalExName ||
      exerciseEntry.map((ex) => ex.name).includes(modalExName)
    ) {
      alert(TextEL.incorrectName);
      return;
    }
    if (modalExPrimary == modalExSecondary) {
      alert(TextEL.primarySecondaryCannotBeTheSame);
      return;
    }
    confirmationChanges(() => {
      addExerciseEntry(modalExName, modalExPrimary, modalExSecondary);
      setModalEx(false);
    });
  };
}

function addMuscleGroup(
  setModalGM: (value: ((prevState: boolean) => boolean) | boolean) => void,
  modalGMName: string,
  muscleGroupEntries: Map<number, string>
) {
  return () => {
    if (
      !modalGMName ||
      Array.from(muscleGroupEntries.values()).includes(modalGMName)
    ) {
      alert(TextEL.incorrectName);
      return;
    }
    confirmationChanges(() => {
      addMuscleGroupEntry(modalGMName);
      setModalGM(false);
    });
  };
}
