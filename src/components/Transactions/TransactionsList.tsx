import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Divider, Surface, Text } from 'react-native-paper';
import TransactionItem, { TransactionItemProps } from './TransactionItem';
import { appColors } from '../../consts/colors';

const transactionsData: TransactionItemProps[] = [
  {
    id: '1',
    merchantName: 'Zomato',
    date: 'Today',
    time: '6:32 PM',
    amount: -420,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/7/75/Zomato_logo.png',
    logoBackground: '#E23744',
  },
  {
    id: '3',
    merchantName: 'Salary',
    date: 'Mar 01',
    time: '10:00 AM',
    amount: 45000,
    logo: 'https://w7.pngwing.com/pngs/503/6/png-transparent-us-dollar-icon-payment-payroll-human-resources-compensation-and-benefits-business-paycheck-icon-miscellaneous-service-logo.png',
    logoBackground: '#4CAF50',
  },
  {
    id: '2',
    merchantName: 'Amazon',
    date: 'Yesterday',
    time: '3:15 PM',
    amount: -1250,
    logo: 'https://i.pinimg.com/originals/01/ca/da/01cada77a0a7d326d85b7969fe26a728.jpg',
    logoBackground: '#FF9900',
  },
  {
    id: '3',
    merchantName: 'Salary',
    date: 'Mar 01',
    time: '10:00 AM',
    amount: 45000,
    logo: 'https://w7.pngwing.com/pngs/503/6/png-transparent-us-dollar-icon-payment-payroll-human-resources-compensation-and-benefits-business-paycheck-icon-miscellaneous-service-logo.png',
    logoBackground: '#4CAF50',
  },
  {
    id: '4',
    merchantName: 'Shopping',
    date: 'Mar 01',
    time: '10:00 AM',
    amount: -250,
    logo: 'https://cdn.dribbble.com/userupload/17039932/file/original-983633d1f6de58f5d871f174ff34f057.jpg?resize=400x0',
    logoBackground: 'white',
  },
  {
    id: '5',
    merchantName: 'Salary',
    date: 'Mar 01',
    time: '10:00 AM',
    amount: 45000,
    logo: 'https://w7.pngwing.com/pngs/503/6/png-transparent-us-dollar-icon-payment-payroll-human-resources-compensation-and-benefits-business-paycheck-icon-miscellaneous-service-logo.png',
    logoBackground: '#4CAF50',
  },
  {
    id: '6',
    merchantName: 'Salary',
    date: 'Mar 01',
    time: '10:00 AM',
    amount: 45000,
    logo: 'https://w7.pngwing.com/pngs/503/6/png-transparent-us-dollar-icon-payment-payroll-human-resources-compensation-and-benefits-business-paycheck-icon-miscellaneous-service-logo.png',
    logoBackground: '#4CAF50',
  },
];

const TransactionsList: React.FC = () => {
  return (
    <Surface style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Transactions</Text>
      </View>
      <FlatList
        data={transactionsData}
        renderItem={({ item }) => <TransactionItem item={item} />}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        ItemSeparatorComponent={() => <Divider />}
      />
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    //marginHorizontal: 16,
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
  },
});

export default TransactionsList;
