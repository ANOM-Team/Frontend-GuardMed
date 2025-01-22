import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import JWTService from '../services/JWTService';

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};



export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {



  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>
      <Button 
        title="Aller à la page détails" 
        onPress={() => navigation.navigate('Details')}
      />
      <Button
        title="Voir la carte"
        onPress={() => navigation.navigate('Map')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default HomeScreen;