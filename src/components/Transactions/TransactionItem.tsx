import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar, Text } from 'react-native-paper';
import { appColors } from '../../consts/colors';
import { Transaction } from '../../services/database/DatabaseService';
import { BalanceType } from '../../screens/HomeScreen';
import { getCategoryById } from '../../consts/categories';
import { formatDate } from 'date-fns';

// Export the interface so it can be used in TransactionsList
export interface TransactionItemProps {
  transaction: Transaction
}

const TransactionItem: React.FC<TransactionItemProps> = (props: TransactionItemProps) => {

  const { transaction } = props;
  const category = getCategoryById(transaction.category);

  return (
    <View style={styles.transactionItem}>
      <View style={styles.leftContainer}>
        <Avatar.Icon 
          size={40} 
          icon={category.icon}
          style={{ backgroundColor: category.color}}
          //color="#000" 
        />
        <View style={styles.transactionDetails}>
          <Text style={styles.merchantName}>{category.name}</Text>
          <Text style={styles.transactionInfo}>{formatDate(transaction.date, "yyyy-MM-dd")}</Text>
        </View>
      </View>
      <Text style={[styles.amount, { color: transaction.type === BalanceType.Expense ? 'red' : 'green' }]}>
         {transaction.type === BalanceType.Expense? '-€' : '+€'}{transaction.amount.toLocaleString()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionDetails: {
    marginLeft: 12,
  },
  merchantName: {
    fontSize: 14,
    fontWeight: '500',
  },
  transactionInfo: {
    fontSize: 12,
    color: appColors.secondaryText,
  },
  amount: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default TransactionItem;
