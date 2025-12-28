import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  TextInput,
  Button,
  Card,
  Title,
  Paragraph,
  SegmentedButtons,
  Chip,
  ActivityIndicator,
  IconButton,
} from 'react-native-paper';
import * as DocumentPicker from 'expo-document-picker';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const HomeScreen = ({ navigation }) => {
  const [mode, setMode] = useState('address');
  const [address, setAddress] = useState('');
  const [chain, setChain] = useState('ethereum');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFilePick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['text/plain', 'text/x-solidity'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        setFile(result.assets[0]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick file');
    }
  };

  const handleScan = async () => {
    if (mode === 'address' && !address.trim()) {
      Alert.alert('Error', 'Please enter a contract address');
      return;
    }

    if (mode === 'upload' && !file) {
      Alert.alert('Error', 'Please select a Solidity file');
      return;
    }

    setLoading(true);

    try {
      let response;

      if (mode === 'address') {
        response = await axios.post(`${API_BASE_URL}/api/v1/scan`, {
          contract_address: address.trim(),
          chain: chain,
        });
      } else {
        const formData = new FormData();
        formData.append('file', {
          uri: file.uri,
          type: file.mimeType || 'text/plain',
          name: file.name,
        });
        formData.append('chain', chain);

        response = await axios.post(`${API_BASE_URL}/api/v1/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      navigation.navigate('Results', { results: response.data });
    } catch (error) {
      Alert.alert(
        'Scan Failed',
        error.response?.data?.detail || 'Failed to scan contract. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.title}>AI Contract Scanner</Title>
            <Paragraph style={styles.subtitle}>
              Scan smart contracts for vulnerabilities and rug-pull patterns
            </Paragraph>

            <SegmentedButtons
              value={mode}
              onValueChange={setMode}
              buttons={[
                { value: 'address', label: 'Address' },
                { value: 'upload', label: 'Upload' },
              ]}
              style={styles.segmentedButtons}
            />

            <View style={styles.chainContainer}>
              <Paragraph style={styles.label}>Blockchain:</Paragraph>
              <View style={styles.chipContainer}>
                {['ethereum', 'base', 'polygon', 'solana'].map((c) => (
                  <Chip
                    key={c}
                    selected={chain === c}
                    onPress={() => setChain(c)}
                    style={styles.chip}
                    textStyle={styles.chipText}
                  >
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </Chip>
                ))}
              </View>
            </View>

            {mode === 'address' ? (
              <TextInput
                label="Contract Address"
                value={address}
                onChangeText={setAddress}
                placeholder="0x..."
                mode="outlined"
                style={styles.input}
                autoCapitalize="none"
                autoCorrect={false}
              />
            ) : (
              <View style={styles.fileContainer}>
                <Button
                  mode="outlined"
                  onPress={handleFilePick}
                  icon="file-upload"
                  style={styles.fileButton}
                >
                  {file ? file.name : 'Select Solidity File'}
                </Button>
                {file && (
                  <IconButton
                    icon="close"
                    size={20}
                    onPress={() => setFile(null)}
                    style={styles.removeFile}
                  />
                )}
              </View>
            )}

            <Button
              mode="contained"
              onPress={handleScan}
              loading={loading}
              disabled={loading}
              style={styles.scanButton}
              contentStyle={styles.scanButtonContent}
            >
              {loading ? 'Scanning...' : 'Scan Contract'}
            </Button>
          </Card.Content>
        </Card>

        <Card style={styles.infoCard}>
          <Card.Content>
            <Title style={styles.infoTitle}>Features</Title>
            <Paragraph>• Vulnerability Detection</Paragraph>
            <Paragraph>• Rug-Pull Pattern Analysis</Paragraph>
            <Paragraph>• Safety Score (0-100)</Paragraph>
            <Paragraph>• AI-Powered Explanations</Paragraph>
            <Paragraph>• PDF Report Generation</Paragraph>
          </Card.Content>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1e293b',
  },
  subtitle: {
    marginBottom: 24,
    color: '#64748b',
  },
  segmentedButtons: {
    marginBottom: 24,
  },
  chainContainer: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontWeight: '600',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
  chipText: {
    fontSize: 12,
  },
  input: {
    marginBottom: 24,
  },
  fileContainer: {
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  fileButton: {
    flex: 1,
  },
  removeFile: {
    marginLeft: 8,
  },
  scanButton: {
    marginTop: 8,
    backgroundColor: '#2563eb',
  },
  scanButtonContent: {
    paddingVertical: 8,
  },
  infoCard: {
    elevation: 2,
  },
  infoTitle: {
    fontSize: 18,
    marginBottom: 12,
  },
});

export default HomeScreen;


