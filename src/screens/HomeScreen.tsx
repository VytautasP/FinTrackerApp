// HomeScreen.js
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Appbar } from 'react-native-paper';
import { appColors } from '../consts/colors';
import MonthSelector from '../components/MonthSelector/MonthSelector';
import BalanceCard from '../components/Balance/BalanceCard';
import ExpensesChart from '../components/ExpensesChart/ExpensesChart';
import TransactionsList from '../components/Transactions/TransactionsList';
import TransactionInputModal, { TransactionItem } from '../components/Transactions/TransactionInputModal';
import BalanceSummary from '../components/Balance/BalanceSummary';

const container_padding = 16;

export enum BalanceType {
  Income = 'income',
  Expense = 'expense'
}

const common_styles = {
  marginBottom: 12,
  borderRadius: 14,
}

const HomeScreen: React.FC = () => {
 
  const [selectedTransactionCategory, setSelectedCategory] = useState(BalanceType.Income);
  const [selectedCategoryInputText, setSelectedCategoryInputText] = useState("Add income");
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [modalVisible, setModalVisible] = useState(false);
  
  const showModal = () => {
    console.log('Show modal');
    setModalVisible(true);
  };
  const hideModal = () => setModalVisible(false);
  
  const handleSaveTransaction = (transaction: TransactionItem, transactionType: BalanceType) => {
    //TODO: Save the transaction to the database or state management
    console.log('Saved transaction:', transaction);
  };

  const handAddIncomePress = () => {
    setSelectedCategoryInputText("Add income");
    setSelectedCategory(BalanceType.Income);
    showModal();
  }

  const handAddExpensePress = () => {
    setSelectedCategoryInputText("Add expense");
    setSelectedCategory(BalanceType.Expense);
    showModal();
  }

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
            addIncome={handAddIncomePress}
            addExpense={handAddExpensePress}
          />

          {/* Month selector */}
          <MonthSelector
            initialMonth={selectedMonth}
            onMonthChange={(month) => setSelectedMonth(month)}
          /> 
          
          {/* Balance Summary */}
          <BalanceSummary containerStyle={common_styles} />
          
          {/* Expenses Breakdown Chart */}
          <ExpensesChart containerStyle={common_styles} />

          {/* Recent Transactions */}
          <TransactionsList containerStyle={common_styles} />
        </ScrollView>
      </View>

      <TransactionInputModal
        visible={modalVisible}
        transactionType={selectedTransactionCategory}
        inputTransactionText={selectedCategoryInputText}
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
    backgroundColor: appColors.viewBackground
  },
  container: {
    flex: 1,
  },
  content: {
    padding: container_padding,
  },
});
