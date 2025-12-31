import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants';

type TabType = 'summary' | 'statistics';
type MatchResult = 'W' | 'D' | 'L';

interface Match {
  id: string;
  date: string;
  opponent: string;
  score: string;
  result: MatchResult;
}

const StatRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <View style={styles.statRow}>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statValue}>{value}</Text>
  </View>
);

const ClubScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('summary');

  // Mock data - replace with real data later
  const clubName = 'Thunder United FC';
  const coachName = 'Coach: John Smith';
  const seasonRecord = {
    wins: 14,
    draws: 4,
    losses: 4,
  };
  const teamForm: MatchResult[] = ['W', 'W', 'D', 'L', 'W'];
  const matches: Match[] = [
    { id: '1', date: 'Oct 8, 2025', opponent: 'City Strikers', score: '3 - 2', result: 'W' },
    { id: '2', date: 'Oct 5, 2025', opponent: 'Eagles FC', score: '1 - 1', result: 'D' },
    { id: '3', date: 'Oct 1, 2025', opponent: 'Valley Rangers', score: '2 - 0', result: 'W' },
  ];

  const getResultColor = (result: MatchResult) => {
    switch (result) {
      case 'W':
        return COLORS.success;
      case 'D':
        return COLORS.textSecondary;
      case 'L':
        return COLORS.error;
    }
  };

  const getResultText = (result: MatchResult) => {
    switch (result) {
      case 'W':
        return 'Win';
      case 'D':
        return 'Draw';
      case 'L':
        return 'Loss';
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.clubLogo}>
          <Text style={styles.clubLogoText}>T</Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.clubName}>{clubName}</Text>
          <Text style={styles.coachName}>{coachName}</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'summary' && styles.tabActive]}
          onPress={() => setActiveTab('summary')}
        >
          <Text style={[styles.tabText, activeTab === 'summary' && styles.tabTextActive]}>
            Summary
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'statistics' && styles.tabActive]}
          onPress={() => setActiveTab('statistics')}
        >
          <Text style={[styles.tabText, activeTab === 'statistics' && styles.tabTextActive]}>
            Statistics
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContent}>
        {activeTab === 'summary' && (
        <>
          {/* Season Record */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Season Record</Text>
            <View style={styles.recordContainer}>
              <View style={styles.recordItem}>
                <View style={[styles.recordBox, { backgroundColor: COLORS.success }]}>
                  <Text style={styles.recordNumber}>{seasonRecord.wins}</Text>
                </View>
                <View style={styles.recordLabel}>
                  <View style={[styles.recordDot, { backgroundColor: COLORS.success }]} />
                  <Text style={styles.recordText}>Wins</Text>
                </View>
              </View>

              <View style={styles.recordItem}>
                <View style={[styles.recordBox, { backgroundColor: COLORS.textSecondary }]}>
                  <Text style={styles.recordNumber}>{seasonRecord.draws}</Text>
                </View>
                <View style={styles.recordLabel}>
                  <View style={[styles.recordDot, { backgroundColor: COLORS.textSecondary }]} />
                  <Text style={styles.recordText}>Draws</Text>
                </View>
              </View>

              <View style={styles.recordItem}>
                <View style={[styles.recordBox, { backgroundColor: COLORS.error }]}>
                  <Text style={styles.recordNumber}>{seasonRecord.losses}</Text>
                </View>
                <View style={styles.recordLabel}>
                  <View style={[styles.recordDot, { backgroundColor: COLORS.error }]} />
                  <Text style={styles.recordText}>Losses</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Team Form */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Team Form</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.formContainer}>
              {teamForm.map((result, index) => (
                <View
                  key={index}
                  style={[styles.formCircle, { backgroundColor: getResultColor(result) }]}
                >
                  <Text style={styles.formText}>{result}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Matches */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Matches</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            {matches.map((match) => (
              <View key={match.id} style={styles.matchCard}>
                <View style={styles.matchContent}>
                  <Text style={styles.matchDate}>{match.date}</Text>
                  <View style={styles.matchInfo}>
                    <View style={[styles.resultDot, { backgroundColor: getResultColor(match.result) }]} />
                    <Text style={styles.matchTitle}>
                      {clubName} {match.score} {match.opponent}
                    </Text>
                  </View>
                  <Text style={[styles.matchResult, { color: getResultColor(match.result) }]}>
                    {getResultText(match.result)}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
              </View>
            ))}
          </View>
        </>
      )}

        {activeTab === 'statistics' && (
          <>
            {/* Season Summary */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Season Summary</Text>
              <View style={styles.statsContainer}>
                <StatRow label="Matches Played" value="22" />
                <StatRow label="Goals Scored" value="45" />
                <StatRow label="Goals Conceded" value="23" />
                <StatRow label="Total Assists" value="32" />
              </View>
            </View>

            {/* Attacking */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Attacking</Text>
              <View style={styles.statsContainer}>
                <StatRow label="Avg Goals per Match" value="2.0" />
                <StatRow label="Avg xG per Match" value="1.9" />
                <StatRow label="Avg Total Shots" value="14" />
                <StatRow label="Avg Shots on Target" value="2.8" />
                <StatRow label="Avg Dribbles" value="12.5" />
                <StatRow label="Avg Successful Dribbles" value="8.2" />
              </View>
            </View>

            {/* Passes */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Passes</Text>
              <View style={styles.statsContainer}>
                <StatRow label="Avg Possession %" value="58%" />
                <StatRow label="Avg Passes" value="487" />
                <StatRow label="Pass Completion %" value="87%" />
                <StatRow label="Avg Final Third Passes" value="145" />
                <StatRow label="Avg Crosses" value="18" />
              </View>
            </View>

            {/* Defending */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Defending</Text>
              <View style={styles.statsContainer}>
                <StatRow label="Total Clean Sheets" value="8" />
                <StatRow label="Avg Goals Conceded per Match" value="1.0" />
                <StatRow label="Avg Tackles" value="16.3" />
                <StatRow label="Tackle Success %" value="72%" />
                <StatRow label="Avg Interceptions" value="11.8" />
                <StatRow label="Interception Success %" value="85%" />
                <StatRow label="Avg Ball Recoveries" value="48.5" />
                <StatRow label="Avg Saves per Match" value="3.2" />
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 45,
    backgroundColor: COLORS.background,
  },
  clubLogo: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clubLogoText: {
    fontSize: 28,
    fontFamily: 'FranklinGothic-Heavy',
    color: COLORS.textOnPrimary,
  },
  headerInfo: {
    marginLeft: 16,
    flex: 1,
  },
  clubName: {
    fontSize: 20,
    fontFamily: 'FranklinGothic-Heavy',
    color: COLORS.text,
  },
  coachName: {
    fontSize: 14,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingHorizontal: 20,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginRight: 8,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.text,
  },
  tabText: {
    fontSize: 15,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.textSecondary,
  },
  tabTextActive: {
    fontFamily: 'FranklinGothic-Demi',
    color: COLORS.text,
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'FranklinGothic-Heavy',
    color: COLORS.text,
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.textSecondary,
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.primary,
  },
  recordContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.backgroundSecondary,
    padding: 16,
    borderRadius: 12,
  },
  recordItem: {
    alignItems: 'center',
  },
  recordBox: {
    width: 80,
    height: 60,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  recordNumber: {
    fontSize: 28,
    fontFamily: 'FranklinGothic-Heavy',
    color: COLORS.textOnPrimary,
  },
  recordLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recordDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  recordText: {
    fontSize: 13,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.text,
  },
  formContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  formCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formText: {
    fontSize: 16,
    fontFamily: 'FranklinGothic-Heavy',
    color: COLORS.textOnPrimary,
  },
  matchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.backgroundSecondary,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  matchContent: {
    flex: 1,
  },
  matchDate: {
    fontSize: 12,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  matchInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  resultDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  matchTitle: {
    fontSize: 15,
    fontFamily: 'FranklinGothic-Demi',
    color: COLORS.text,
    flex: 1,
  },
  matchResult: {
    fontSize: 13,
    fontFamily: 'FranklinGothic-Book',
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 20,
  },
  statsContainer: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.primary,
  },
  statValue: {
    fontSize: 15,
    fontFamily: 'FranklinGothic-Demi',
    color: COLORS.primary,
  },
});

export default ClubScreen;
