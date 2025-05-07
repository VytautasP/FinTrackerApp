import React from 'react';
import { View, StyleSheet, FlatList, ViewStyle } from 'react-native';
import { Divider, Surface, Text } from 'react-native-paper';
import TransactionItem from './TransactionItem';
import { appColors } from '../../consts/colors';
import { Transaction } from '../../services/database/DatabaseService';

interface TransactionListProps {
  containerStyle?: ViewStyle;
  transactions: Transaction[];
  onDeleteTransaction: (item: Transaction) => void;
}

const TransactionsList: React.FC<TransactionListProps> = (props: TransactionListProps) => {

  const { containerStyle, transactions, onDeleteTransaction } = props;

  return (
    <Surface style={[styles.container, containerStyle]}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Transactions</Text>
      </View>
      {transactions.length === 0 ? (
        <View style={styles.noTransactionsContainer}>
          <Text style={styles.noTransactionsText}>No transactions yet.</Text>
        </View>
      ) : (
        <FlatList
          data={transactions}
          renderItem={({ item }) => <TransactionItem transaction={item} onDeleteTransaction={onDeleteTransaction} />}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <Divider />}
        />
      )}
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    marginVertical: 8,
    elevation: 2,
    backgroundColor: appColors.white,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: appColors.widgetHeaderText,
  },
  noTransactionsContainer: {
    padding: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  noTransactionsText: {
    color: appColors.widgetHeaderText,
    fontSize: 14,
  },
});

export default TransactionsList;
