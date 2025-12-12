import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Linking,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Chip,
  Button,
  Divider,
  List,
  IconButton,
  ActivityIndicator,
} from 'react-native-paper';
import axios from 'axios';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { API_BASE_URL } from '../config';

const ResultsScreen = ({ route, navigation }) => {
  const { results } = route.params;
  const [downloading, setDownloading] = useState(false);

  const getScoreColor = (score) => {
    if (score >= 80) return '#16a34a';
    if (score >= 50) return '#f59e0b';
    return '#dc2626';
  };

  const getScoreIcon = (score) => {
    if (score >= 80) return 'check-circle';
    if (score >= 50) return 'alert';
    return 'close-circle';
  };

  const getSeverityColor = (severity) => {
    const colors = {
      high: '#dc2626',
      medium: '#f59e0b',
      low: '#3b82f6',
    };
    return colors[severity] || '#6b7280';
  };

  const getRiskColor = (risk) => {
    const colors = {
      severe: '#dc2626',
      high: '#f97316',
      medium: '#f59e0b',
      low: '#3b82f6',
    };
    return colors[risk] || '#6b7280';
  };

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/report`,
        results,
        {
          responseType: 'blob',
        }
      );

      // Convert blob to base64 for React Native
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const base64Data = reader.result.split(',')[1];
          const fileUri = `${FileSystem.cacheDirectory}security_report_${results.contract_address.slice(0, 10)}.pdf`;
          
          await FileSystem.writeAsStringAsync(fileUri, base64Data, {
            encoding: FileSystem.EncodingType.Base64,
          });

          if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(fileUri);
          } else {
            Alert.alert('Error', 'Sharing is not available on this device');
          }
        } catch (err) {
          Alert.alert('Error', 'Failed to save PDF file');
        }
      };
      reader.readAsDataURL(response.data);
    } catch (error) {
      console.error('Download error:', error);
      Alert.alert('Error', 'Failed to download PDF. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Safety Score Card */}
      <Card style={styles.scoreCard}>
        <Card.Content style={styles.scoreContent}>
          <View style={styles.scoreHeader}>
            <View style={styles.scoreInfo}>
              <Title style={styles.contractTitle}>Contract Address</Title>
              <Paragraph style={styles.contractAddress}>
                {results.contract_address}
              </Paragraph>
              <Paragraph style={styles.chainText}>
                Chain: {results.chain.toUpperCase()}
              </Paragraph>
            </View>
            <View
              style={[
                styles.scoreCircle,
                { backgroundColor: getScoreColor(results.safety_score) + '20' },
              ]}
            >
              <Paragraph
                style={[
                  styles.scoreText,
                  { color: getScoreColor(results.safety_score) },
                ]}
              >
                {results.safety_score}
              </Paragraph>
            </View>
          </View>
          <Chip
            icon={getScoreIcon(results.safety_score)}
            style={[
              styles.riskChip,
              { backgroundColor: getScoreColor(results.safety_score) + '20' },
            ]}
            textStyle={{ color: getScoreColor(results.safety_score) }}
          >
            {results.risk_level}
          </Chip>
        </Card.Content>
      </Card>

      {/* Download PDF Button */}
      <Button
        mode="contained"
        onPress={handleDownloadPDF}
        loading={downloading}
        disabled={downloading}
        icon="download"
        style={styles.downloadButton}
      >
        {downloading ? 'Generating PDF...' : 'Download PDF Report'}
      </Button>

      {/* AI Explanation */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>AI Risk Explanation</Title>
          <Paragraph style={styles.explanation}>
            {results.ai_explanation}
          </Paragraph>
        </Card.Content>
      </Card>

      {/* Vulnerabilities */}
      {results.vulnerabilities && results.vulnerabilities.length > 0 && (
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>
              Vulnerabilities ({results.vulnerabilities.length})
            </Title>
            {results.vulnerabilities.map((vuln, index) => (
              <View key={index} style={styles.vulnItem}>
                <View style={styles.vulnHeader}>
                  <Paragraph style={styles.vulnTitle}>{vuln.type}</Paragraph>
                  <Chip
                    style={[
                      styles.severityChip,
                      { backgroundColor: getSeverityColor(vuln.severity) + '20' },
                    ]}
                    textStyle={{ color: getSeverityColor(vuln.severity) }}
                  >
                    {vuln.severity.toUpperCase()}
                  </Chip>
                </View>
                <Paragraph style={styles.vulnDescription}>
                  {vuln.description}
                </Paragraph>
                {vuln.recommendation && (
                  <Paragraph style={styles.recommendation}>
                    💡 {vuln.recommendation}
                  </Paragraph>
                )}
                {index < results.vulnerabilities.length - 1 && (
                  <Divider style={styles.divider} />
                )}
              </View>
            ))}
          </Card.Content>
        </Card>
      )}

      {/* Rug-Pull Indicators */}
      {results.rug_pull_indicators && results.rug_pull_indicators.length > 0 && (
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>
              Rug-Pull Indicators ({results.rug_pull_indicators.length})
            </Title>
            {results.rug_pull_indicators.map((indicator, index) => (
              <View key={index} style={styles.vulnItem}>
                <View style={styles.vulnHeader}>
                  <Paragraph style={styles.vulnTitle}>{indicator.type}</Paragraph>
                  <Chip
                    style={[
                      styles.severityChip,
                      { backgroundColor: getRiskColor(indicator.risk) + '20' },
                    ]}
                    textStyle={{ color: getRiskColor(indicator.risk) }}
                  >
                    {indicator.risk.toUpperCase()}
                  </Chip>
                </View>
                <Paragraph style={styles.vulnDescription}>
                  {indicator.description}
                </Paragraph>
                {indicator.recommendation && (
                  <Paragraph style={styles.recommendation}>
                    ⚠️ {indicator.recommendation}
                  </Paragraph>
                )}
                {index < results.rug_pull_indicators.length - 1 && (
                  <Divider style={styles.divider} />
                )}
              </View>
            ))}
          </Card.Content>
        </Card>
      )}

      {/* Recommendations */}
      {results.recommendations && results.recommendations.length > 0 && (
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Recommendations</Title>
            {results.recommendations.map((rec, index) => (
              <Paragraph key={index} style={styles.recommendationItem}>
                {index + 1}. {rec}
              </Paragraph>
            ))}
          </Card.Content>
        </Card>
      )}

      {/* No Issues */}
      {(!results.vulnerabilities || results.vulnerabilities.length === 0) &&
        (!results.rug_pull_indicators || results.rug_pull_indicators.length === 0) && (
          <Card style={styles.card}>
            <Card.Content style={styles.noIssuesContent}>
              <IconButton
                icon="check-circle"
                size={64}
                iconColor="#16a34a"
                style={styles.successIcon}
              />
              <Title style={styles.noIssuesTitle}>No Critical Issues Detected</Title>
              <Paragraph style={styles.noIssuesText}>
                However, always conduct your own research (DYOR) before investing.
              </Paragraph>
            </Card.Content>
          </Card>
        )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 16,
  },
  scoreCard: {
    marginBottom: 16,
    elevation: 4,
  },
  scoreContent: {
    padding: 20,
  },
  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  scoreInfo: {
    flex: 1,
  },
  contractTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  contractAddress: {
    fontFamily: 'monospace',
    fontSize: 12,
    marginBottom: 4,
  },
  chainText: {
    fontSize: 12,
    color: '#64748b',
  },
  scoreCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  riskChip: {
    alignSelf: 'flex-start',
  },
  downloadButton: {
    marginBottom: 16,
    backgroundColor: '#2563eb',
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  explanation: {
    lineHeight: 22,
    color: '#475569',
  },
  vulnItem: {
    marginBottom: 16,
  },
  vulnHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  vulnTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  severityChip: {
    marginLeft: 8,
  },
  vulnDescription: {
    marginBottom: 8,
    color: '#64748b',
    lineHeight: 20,
  },
  recommendation: {
    color: '#2563eb',
    fontStyle: 'italic',
    marginTop: 4,
  },
  divider: {
    marginTop: 16,
  },
  recommendationItem: {
    marginBottom: 8,
    lineHeight: 22,
  },
  noIssuesContent: {
    alignItems: 'center',
    padding: 24,
  },
  successIcon: {
    marginBottom: 16,
  },
  noIssuesTitle: {
    fontSize: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  noIssuesText: {
    textAlign: 'center',
    color: '#64748b',
  },
});

export default ResultsScreen;

