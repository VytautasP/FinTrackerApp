import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';

const RecentTransactions: React.FC = () => {
  return (
    <Card style={styles.transactionsCard}>
      <Card.Title title="Recent Transactionss" />
      <Card.Content>
        <View style={styles.transactionItem}>
          <Text>Date: Feb 21</Text>
          <Text>Amount: $50</Text>
          <Text>Category: Food</Text>
        </View>
        <View style={styles.transactionItem}>
          <Text>Date: Feb 20</Text>
          <Text>Amount: $200</Text>
          <Text>Category: Rent</Text>
        </View>
        <View style={styles.transactionItem}>
          <Text>Date: Feb 18</Text>
          <Text>Amount: $120</Text>
          <Text>Category: Utilities</Text>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  transactionsCard: {
    marginBottom: 16,
  },
  transactionItem: {
    marginBottom: 12,
  },
});

export default RecentTransactions;
