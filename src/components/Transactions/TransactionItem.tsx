import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar, Text, IconButton } from 'react-native-paper';
import { appColors } from '../../consts/colors';
import { Transaction } from '../../services/database/DatabaseService';
import { BalanceType } from '../../screens/HomeScreen';
import { getCategoryById } from '../../consts/categories';
import { formatDate } from 'date-fns';
import { Swipeable } from 'react-native-gesture-handler';

// Export the interface so it can be used in TransactionsList
export interface TransactionItemProps {
  transaction: Transaction
  onDeleteTransaction: (item: Transaction) => void;
}

const TransactionItem: React.FC<TransactionItemProps> = (props: TransactionItemProps) => {

  const { transaction, onDeleteTransaction } = props;
  const category = getCategoryById(transaction.category);

  const onDeleteTransactionHandler = () => {
    onDeleteTransaction(transaction);
  };

  const renderDeleteAction = () => {
    return (
      <View style={{ backgroundColor: appColors.white, width: 80, justifyContent: 'center', alignItems: 'center' }}>
        <IconButton
          icon="delete-forever"
          iconColor={appColors.secondaryText}
          size={25}
          onPress={onDeleteTransactionHandler}
        />
      </View>
    );
  };

  return (
    <Swipeable renderLeftActions={renderDeleteAction} renderRightActions={renderDeleteAction}>
      <View style={styles.transactionItem}>
        <View style={styles.leftContainer}>
          <Avatar.Icon
            size={40}
            icon={category.icon}
            style={{ backgroundColor: category.color }}
            color={appColors.icons}
          />
          <View style={styles.transactionDetails}>
            <Text style={styles.merchantName}>{category.name}</Text>
            <Text style={styles.transactionDescription}>{transaction.name}</Text>
            <Text style={styles.transactionDate}>{formatDate(transaction.date, "yyyy-MM-dd")}</Text>
          </View>
        </View>
        <View style={styles.rightContainer}>
          <Text style={[styles.amount, { color: transaction.type === BalanceType.Expense ? 'red' : 'green' }]}>
            {transaction.type === BalanceType.Expense ? '-€' : '+€'}{transaction.amount.toLocaleString()}
          </Text>
        </View>
      </View>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: appColors.white,
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
    color: appColors.black,
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
