import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar, Text, IconButton } from 'react-native-paper';
import { appColors } from '../../consts/colors';
import { Transaction } from '../../services/database/DatabaseService';
import { BalanceType } from '../../screens/HomeScreen';
import { getCategoryById } from '../../consts/categories';
import { formatDate } from 'date-fns';

// Export the interface so it can be used in TransactionsList
export interface TransactionItemProps {
  transaction: Transaction
  onDeleteTransaction: (item: Transaction) => void;
}

const TransactionItem: React.FC<TransactionItemProps> = (props: TransactionItemProps) => {

  const { transaction, onDeleteTransaction } = props;
  const category = getCategoryById(transaction.category);
  const [isDeletePressed, setIsDeletePressed] = useState(false);

  const onDeleteTransactionHandler = () => {
    onDeleteTransaction(transaction);
  };

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
          <Text style={styles.transactionDescription}>{transaction.name}</Text>
          <Text style={styles.transactionDate}>{formatDate(transaction.date, "yyyy-MM-dd")}</Text>
        </View>
      </View>
      <View style={styles.rightContainer}>
        <Text style={[styles.amount, { color: transaction.type === BalanceType.Expense ? 'red' : 'green' }]}>
           {transaction.type === BalanceType.Expense? '-€' : '+€'}{transaction.amount.toLocaleString()}
        </Text>
        <IconButton
          icon="delete"
          iconColor={isDeletePressed ? 'red' : appColors.secondaryText}
          size={20}
          onPressIn={() => setIsDeletePressed(true)}
          onPressOut={() => {
            setIsDeletePressed(false);
            onDeleteTransactionHandler();
          }}
          style={isDeletePressed ? { transform: [{ scale: 1.2 }] } : {}}
        />
      </View>
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
  rightContainer: {
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
  transactionDescription: {
    fontSize: 13,
    color: appColors.secondaryText,
  },
  transactionDate: {
    fontSize: 12,
    color: appColors.secondaryText,
  },
  amount: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 8, // Add some space between amount and delete button
  },
});

export default TransactionItem;
