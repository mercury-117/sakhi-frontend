import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Speech from 'expo-speech';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUser, addJourneyStep } from '../services/api';

export default function HomeScreen() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (userId) {
        const userData = await getUser(parseInt(userId));
        setUser(userData);
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceInput = async (action) => {
    try {
      setSpeaking(true);
      const message = getVoiceMessage(action);
      await Speech.speak(message, {
        language: user?.language === 'hi' ? 'hi-IN' : 'en-US',
      });
    } catch (error) {
      Alert.alert('Error', 'Voice output failed');
    } finally {
      setSpeaking(false);
    }
  };

  const getVoiceMessage = (action) => {
    const messages = {
      symptoms: 'Please describe your symptoms',
      referral: 'Upload or scan your medical referral',
      journey: 'View your complete health journey',
      appointment: 'Schedule or find nearby hospitals',
    };
    return messages[action] || 'How can we help?';
  };

  const handleQuickAction = async (action) => {
    if (!user) return;
    try {
      await addJourneyStep(user.user_id, action, `User initiated ${action}`);
      Alert.alert('Recorded', `${action} has been recorded`);
    } catch (error) {
      Alert.alert('Error', 'Failed to record action');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome back, {user?.name || 'User'}!</Text>
        <Text style={styles.subGreeting}>Let's track your health today</Text>
      </View>

      <View style={styles.voiceSection}>
        <View style={styles.voiceCard}>
          <Icon name="microphone" size={40} color="#FF6B6B" />
          <Text style={styles.voiceTitle}>Voice Commands</Text>
          <Text style={styles.voiceSubtitle}>
            {speaking ? 'Listening...' : 'Tap to use voice input'}
          </Text>
        </View>
      </View>

      <View style={styles.quickActionsSection}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        <View style={styles.actionsGrid}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => handleVoiceInput('symptoms')}
          >
            <Icon name="hospital-box" size={32} color="#FF6B6B" />
            <Text style={styles.actionTitle}>Report Symptoms</Text>
            <Text style={styles.actionDesc}>Describe how you feel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => handleVoiceInput('referral')}
          >
            <Icon name="file-document" size={32} color="#FF6B6B" />
            <Text style={styles.actionTitle}>Scan Referral</Text>
            <Text style={styles.actionDesc}>Upload medical docs</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => handleVoiceInput('journey')}
          >
            <Icon name="map" size={32} color="#FF6B6B" />
            <Text style={styles.actionTitle}>View Journey</Text>
            <Text style={styles.actionDesc}>Track progress</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => handleVoiceInput('appointment')}
          >
            <Icon name="hospital-building" size={32} color="#FF6B6B" />
            <Text style={styles.actionTitle}>Find Hospital</Text>
            <Text style={styles.actionDesc}>Nearby facilities</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Your Profile</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Icon name="phone" size={20} color="#FF6B6B" />
            <Text style={styles.infoText}>{user?.phone_number}</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="cake" size={20} color="#FF6B6B" />
            <Text style={styles.infoText}>{user?.age} years old</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="globe" size={20} color="#FF6B6B" />
            <Text style={styles.infoText}>
              Language: {user?.language === 'hi' ? 'Hindi' : 'English'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.spacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#FF6B6B',
    padding: 20,
    paddingTop: 40,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  subGreeting: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  voiceSection: {
    padding: 20,
  },
  voiceCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
    elevation: 2,
  },
  voiceTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 10,
    color: '#333',
  },
  voiceSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  quickActionsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    elevation: 2,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 10,
    color: '#333',
    textAlign: 'center',
  },
  actionDesc: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
    textAlign: 'center',
  },
  infoSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  infoText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#333',
  },
  spacer: {
    height: 40,
  },
});
