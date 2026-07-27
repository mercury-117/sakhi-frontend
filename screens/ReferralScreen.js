import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as DocumentPicker from 'expo-document-picker';
import { scanReferral, parseReferral } from '../services/api';

export default function ReferralScreen() {
  const [referralText, setReferralText] = useState('');
  const [parsedData, setParsedData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleScanImage = async () => {
    try {
      setLoading(true);
      const result = await DocumentPicker.getDocumentAsync({
        type: 'image/*',
      });
      
      if (result.type === 'success') {
        const data = await scanReferral(result.uri);
        setReferralText(data.extracted_text);
        Alert.alert('Image Scanned', 'OCR complete. Review and parse the text.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to scan image');
    } finally {
      setLoading(false);
    }
  };

  const handleParseReferral = async () => {
    if (!referralText.trim()) {
      Alert.alert('Empty Text', 'Please enter or scan referral text');
      return;
    }
    
    setLoading(true);
    try {
      const data = await parseReferral(referralText);
      setParsedData(data.parsed_data);
    } catch (error) {
      Alert.alert('Error', 'Failed to parse referral');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Referral Management</Text>
        <Text style={styles.subtitle}>Scan and organize medical referrals</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Step 1: Scan Referral Image</Text>
        <TouchableOpacity
          style={[styles.button, styles.scanButton, loading && styles.buttonDisabled]}
          onPress={handleScanImage}
          disabled={loading}
        >
          <Icon name="camera" size={24} color="white" />
          <Text style={styles.buttonText}>{loading ? 'Scanning...' : 'Scan Image'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Step 2: Review & Parse</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Referral text will appear here or paste manually"
          value={referralText}
          onChangeText={setReferralText}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
        />
        <TouchableOpacity
          style={[styles.button, styles.parseButton, loading && styles.buttonDisabled]}
          onPress={handleParseReferral}
          disabled={loading}
        >
          <Icon name="text-recognition" size={24} color="white" />
          <Text style={styles.buttonText}>{loading ? 'Parsing...' : 'Parse Referral'}</Text>
        </TouchableOpacity>
      </View>

      {parsedData && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Parsed Referral Information</Text>
          
          <View style={styles.infoRow}>
            <Icon name="stethoscope" size={20} color="#FF6B6B" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Specialist Type</Text>
              <Text style={styles.infoValue}>{parsedData.specialist_type}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Icon name="alert-circle" size={20} color="#FF6B6B" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Urgency</Text>
              <Text style={styles.infoValue}>{parsedData.urgency}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Icon name="pulse" size={20} color="#FF6B6B" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Key Symptoms</Text>
              <Text style={styles.infoValue}>
                {parsedData.key_symptoms?.join(', ') || 'None identified'}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Icon name="file-document" size={20} color="#FF6B6B" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Doctor's Notes</Text>
              <Text style={styles.infoValue}>{parsedData.doctor_notes}</Text>
            </View>
          </View>
        </View>
      )}

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
  card: {
    backgroundColor: 'white',
    margin: 15,
    padding: 20,
    borderRadius: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  scanButton: {
    backgroundColor: '#FF6B6B',
  },
  parseButton: {
    backgroundColor: '#4CAF50',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    minHeight: 120,
    fontSize: 14,
    color: '#333',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  infoContent: {
    marginLeft: 15,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#999',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    marginTop: 5,
    fontWeight: '500',
  },
  spacer: {
    height: 40,
  },
});
