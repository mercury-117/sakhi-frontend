import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getUserJourney, addJourneyStep } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function JourneyScreen() {
  const [journey, setJourney] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    loadJourney();
  }, []);

  const loadJourney = async () => {
    try {
      const id = await AsyncStorage.getItem('userId');
      setUserId(parseInt(id));
      if (id) {
        const data = await getUserJourney(parseInt(id));
        setJourney(data.journey || []);
      }
    } catch (error) {
      console.error('Error loading journey:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStep = async (stepType) => {
    try {
      await addJourneyStep(userId, stepType, `${stepType} recorded`);
      loadJourney();
    } catch (error) {
      console.error('Error adding step:', error);
    }
  };

  const getStepIcon = (stepType) => {
    const icons = {
      symptom: 'hospital-box',
      referral: 'file-document',
      hospital_visit: 'hospital-building',
      treatment: 'pill',
    };
    return icons[stepType] || 'information';
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
        <Text style={styles.title}>Your Healthcare Journey</Text>
        <Text style={styles.subtitle}>Track your health milestones</Text>
      </View>

      <View style={styles.quickActions}>
        {['symptom', 'referral', 'hospital_visit', 'treatment'].map((type) => (
          <TouchableOpacity
            key={type}
            style={styles.actionButton}
            onPress={() => handleAddStep(type)}
          >
            <Icon name={getStepIcon(type)} size={24} color="#FF6B6B" />
            <Text style={styles.actionLabel}>{type.replace('_', ' ')}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.journeyList}>
        <Text style={styles.sectionTitle}>Timeline</Text>
        {journey.length === 0 ? (
          <Text style={styles.emptyText}>No journey steps recorded yet</Text>
        ) : (
          journey.map((step, index) => (
            <View key={index} style={styles.journeyItem}>
              <View style={styles.timelineDot}>
                <Icon name={getStepIcon(step.step_type)} size={20} color="white" />
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepType}>{step.step_type.replace('_', ' ')}</Text>
                <Text style={styles.stepDescription}>{step.description}</Text>
                <Text style={styles.stepTime}>
                  {new Date(step.timestamp).toLocaleDateString()}
                </Text>
              </View>
            </View>
          ))
        )}
      </View>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: 'white',
    marginBottom: 20,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionLabel: {
    marginTop: 8,
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  journeyList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  journeyItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  timelineDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  stepContent: {
    flex: 1,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
  },
  stepType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textTransform: 'capitalize',
  },
  stepDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  stepTime: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
    fontSize: 14,
  },
});
