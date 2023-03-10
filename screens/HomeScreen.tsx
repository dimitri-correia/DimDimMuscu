import React, { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { NavigationProp, ParamListBase } from "@react-navigation/native";

import CommonStyles from "../styles/CommonStyles";
import ScreenList, { ScreenItem } from "./ScreenList";
import HomeScreenStyles from "../styles/HomeScreenStyles";
import { createWeightTable } from "../database/WeightTrackerDB";
import { createExercisesTableS } from "../database/ExercisesListDB";
import { createPRTable } from "../database/PersonalRecordDB";
import { createInfosTable } from "../database/InfosDB";
import { createImageTable } from "../database/PictureEvolutionDB";

interface homeScreenProps {
  navigation: NavigationProp<ParamListBase>;
}

export const HomeScreen: React.FC<homeScreenProps> = ({ navigation }) => {
  useEffect(() => {
    createAllTables(); // call only once when app start
  }, []);
  return <View style={CommonStyles.container}>{ItemsGrid(navigation)}</View>;
};

const ItemsGrid = (navigation: any) => {
  const rows = [];
  for (let i = 0; i < ScreenList.length; i += 2) {
    const item1: ScreenItem = ScreenList[i];
    const item2: ScreenItem = ScreenList[i + 1];

    const row = (
      <View key={i} style={HomeScreenStyles.row}>
        <ListItem navigation={navigation} screenItem={item1} />
        {item2 && <ListItem navigation={navigation} screenItem={item2} />}
      </View>
    );

    rows.push(row);
  }
  return rows;
};

interface ListItemProps {
  navigation: NavigationProp<ParamListBase>;
  screenItem: ScreenItem;
}

const ListItem = ({ navigation, screenItem }: ListItemProps) => {
  const { name, screenName, icon } = screenItem;
  const onPress = () => navigation.navigate(screenName);

  return (
    <TouchableOpacity style={HomeScreenStyles.item} onPress={onPress}>
      {icon}
      <Text style={HomeScreenStyles.itemText}>{name}</Text>
    </TouchableOpacity>
  );
};

function createAllTables() {
  createWeightTable();
  createExercisesTableS();
  createPRTable();
  createInfosTable();
  createImageTable();
}
