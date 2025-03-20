import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar, Text } from 'react-native-paper';
import { appColors } from '../../consts/colors';

// Export the interface so it can be used in TransactionsList
export interface TransactionItemProps {
  id: string;
  merchantName: string;
  date: string;
  time: string;
  amount: number;
  logo: string;
  logoBackground?: string;
}

const TransactionItem: React.FC<{ item: TransactionItemProps }> = ({ item }) => {
  return (
    <View style={styles.transactionItem}>
      <View style={styles.leftContainer}>
        <Avatar.Image 
          size={40} 
          source={{ uri: item.logo }} 
          style={{ backgroundColor: item.logoBackground}}
        />
        <View style={styles.transactionDetails}>
          <Text style={styles.merchantName}>{item.merchantName}</Text>
          <Text style={styles.transactionInfo}>{item.date} • {item.time}</Text>
        </View>
      </View>
      <Text style={[styles.amount, { color: item.amount < 0 ? 'black' : 'green' }]}>
         {item.amount < 0 ? '-€' : '+€'}{Math.abs(item.amount).toLocaleString()}
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
