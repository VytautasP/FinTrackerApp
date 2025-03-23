// HomeScreen.js
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Appbar } from 'react-native-paper';
import { appColors } from '../consts/colors';
import MonthSelector from '../components/MonthSelector/MonthSelector';
import BalanceCard from '../components/BalanceCard/BalanceCard';
import ExpensesChart from '../components/ExpensesChart/ExpensesChart';
import TransactionsList from '../components/Transactions/TransactionsList';
import TransactionInputModal, { TransactionItem } from '../components/Transactions/TransactionInputModal';


const HomeScreen: React.FC = () => {

  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [modalVisible, setModalVisible] = useState(false);
  
  const showModal = () => {
    console.log('Show modal');
    setModalVisible(true);
  };
  const hideModal = () => setModalVisible(false);
  
  const handleSaveTransaction = (transaction: TransactionItem) => {
    console.log('Saved transaction:', transaction);
    // Here you would typically save the transaction to your state or database
  };

  return (
    <SafeAreaView style={styles.safeView}>
      <View style={styles.container}>
        {/* Appbar / Top Navigation */}
        <Appbar.Header>
          <Appbar.Content title="My Finances" />
        </Appbar.Header>

        {/* Main Content */}
        <ScrollView contentContainerStyle={styles.content}>

          {/* Balance Card */}
          <BalanceCard
            addIncome={showModal}
            addExpense={() => {}}
          />

          {/* Month selector */}
          <MonthSelector
            initialMonth={selectedMonth}
            onMonthChange={(month) => setSelectedMonth(month)}
          /> 

          {/* Expenses Breakdown Chart */}
          <ExpensesChart />

          {/* Recent Transactions */}
          <TransactionsList />
        </ScrollView>
      </View>

      <TransactionInputModal
        visible={modalVisible}
        onDismiss={hideModal}
        onSave={handleSaveTransaction}
      />

    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  safeView: {
    flex: 1,
    backgroundColor: appColors.viewBackground.light,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
});
