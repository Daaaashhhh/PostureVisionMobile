import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconIonicons from 'react-native-vector-icons/Ionicons';
import IconMaterial from 'react-native-vector-icons/MaterialIcons';
import IconMaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';

const IconTest = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Icon Test Screen</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>FontAwesome Icons</Text>
        <View style={styles.iconRow}>
          <Icon name="home" size={30} color="#fff" />
          <Icon name="user" size={30} color="#fff" />
          <Icon name="cog" size={30} color="#fff" />
          <Icon name="star" size={30} color="#fff" />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ionicons</Text>
        <View style={styles.iconRow}>
          <IconIonicons name="home" size={30} color="#fff" />
          <IconIonicons name="person" size={30} color="#fff" />
          <IconIonicons name="settings" size={30} color="#fff" />
          <IconIonicons name="star" size={30} color="#fff" />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Material Icons</Text>
        <View style={styles.iconRow}>
          <IconMaterial name="home" size={30} color="#fff" />
          <IconMaterial name="person" size={30} color="#fff" />
          <IconMaterial name="settings" size={30} color="#fff" />
          <IconMaterial name="star" size={30} color="#fff" />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Material Community Icons</Text>
        <View style={styles.iconRow}>
          <IconMaterialCommunity name="home" size={30} color="#fff" />
          <IconMaterialCommunity name="account" size={30} color="#fff" />
          <IconMaterialCommunity name="cog" size={30} color="#fff" />
          <IconMaterialCommunity name="star" size={30} color="#fff" />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 10,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    borderRadius: 10,
  },
});

export default IconTest; 