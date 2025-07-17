// HomeScreen.js
import React, { useState, useEffect, useCallback } from 'react'; // Import useEffect and useCallback
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Appbar } from 'react-native-paper';
import { appColors } from '../consts/colors';
import MonthSelector from '../components/MonthSelector/MonthSelector';
import BalanceCard from '../components/Balance/BalanceCard';
import TransactionsList from '../components/Transactions/TransactionsList';
import TransactionInputModal, { TransactionItem } from '../components/Transactions/TransactionInputModal';
import BalanceSummary from '../components/Balance/BalanceSummary';
import { useDatabase } from '../services/database/DatabaseContext';
import { CategoryTotal, DailyTotal, MonthlySummary, Transaction } from '../services/database/DatabaseService';
import Toast from 'react-native-toast-message';
import Orientation from 'react-native-orientation-locker';
import ExpensesChart from '../components/ExpensesChart/ExpensesChart';

export const container_padding = 16;

export enum BalanceType {
  Income = 'income',
  Expense = 'expense'
}

const common_styles = {
  marginBottom: 12,
  borderRadius: 14,
}

const HomeScreen: React.FC = () => {
  const dbContext = useDatabase();
  const [selectedTransactionCategory, setSelectedCategory] = useState(BalanceType.Income);
  const [selectedCategoryInputText, setSelectedCategoryInputText] = useState("Add income");
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [modalVisible, setModalVisible] = useState(false);

  const [balanceSummaryData, setBalanceSummaryData] = useState<MonthlySummary>({ income: 0, expense: 0, balance: 0 });
  const [chartDailyData, refreshDailyData] = useState<DailyTotal[]>([]);
  const [chartCategoryData, setChartCategoryData] = useState<CategoryTotal[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const showModal = () => {
    setModalVisible(true);
  };
  const hideModal = () => setModalVisible(false);

  const handleSaveTransaction = async (transaction: TransactionItem, transactionType: BalanceType) => {
    try {
      await dbContext.transactions.add(transaction.title, transaction.amount, transaction.category.id, transaction.date, transactionType);
      await loadUiData(selectedMonth);
      showToast('success', 'Success', 'Transaction saved successfully!');
    } catch (error) {
      console.error("Failed to save transaction:", error);
      showToast('error', 'Error', 'Failed to save transaction. Please try again.');
    }
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

  const handleDeleteTransaction = async (item: Transaction) => {
    try {
      await dbContext.transactions.delete(item.id);
      await loadUiData(selectedMonth);
      showToast('success', 'Success', 'Transaction deleted successfully!');
    }
    catch (error) {
      console.error("Failed to delete transaction:", error);
      showToast('error', 'Error', 'Failed to delete transaction. Please try again.');
    }
  }

  const showToast = (type: string, message1: string, message2: string) => {
    Toast.show({
      type: type,
      text1: message1,
      text2: message2,
      position: 'top',
      visibilityTime: 3000,
    });
  }

  // Memoized function to load UI data
  const loadUiData = useCallback(async (monthDate: Date) => {
    if (!dbContext) return; // Ensure dbContext is available
    try {
 
      const currentYear = monthDate.getFullYear();
      const currentMonthNumber = monthDate.getMonth() + 1; // Months are 0-indexed in JavaScript

      const summary = await dbContext.summaries.getMonthly(currentYear, currentMonthNumber);
      const dailyExpenses = await dbContext.summaries.getDailyTotals(currentYear, currentMonthNumber);
      const monthlyTransactions = await dbContext.transactions.getByMonth(currentYear, currentMonthNumber);
      const monthlyCategoryData = await dbContext.summaries.getCategoryTotals(currentYear, currentMonthNumber);

      setTransactions(monthlyTransactions || []);
      setBalanceSummaryData(summary || { income: 0, expense: 0, balance: 0 });
      refreshDailyData(dailyExpenses || []);
      setChartCategoryData(monthlyCategoryData || []);

    } catch (error) {

      showToast('error', 'Error', 'Failed to load data. Please try again later.');
      console.error("Failed to load UI data:", error);
      setBalanceSummaryData({ income: 0, expense: 0, balance: 0 });
      refreshDailyData([]);
      setTransactions([]);

    }
  }, [dbContext]); 

  useEffect(() => {
    loadUiData(selectedMonth);
  }, [selectedMonth, loadUiData]);

  useEffect(() => {
    Orientation.lockToPortrait();
    return () => {
      Orientation.unlockAllOrientations();
    }
  }, []);

  const currentYear = selectedMonth.getFullYear();
  const currentMonthNumber = selectedMonth.getMonth() + 1;

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
            monthTotal={balanceSummaryData.balance}
            addIncome={handAddIncomePress}
            addExpense={handAddExpensePress}
          />

          {/* Month selector */}
          <MonthSelector
            initialMonth={selectedMonth}
            onMonthChange={(month) => setSelectedMonth(month)}
          /> 
          
          {/* Balance Summary */}
          <BalanceSummary
            containerStyle={common_styles}
            income={balanceSummaryData.income}
            expense={balanceSummaryData.expense}
            addIncome={handAddIncomePress}
            addExpense={handAddExpensePress}
          />
          
          {/* Expenses Breakdown Chart */}
          <ExpensesChart
            containerStyle={common_styles}
            monthDailyData={chartDailyData}
            monthCategoryData={chartCategoryData}
            year={currentYear}  
            month={currentMonthNumber}
          />
        
          {/* Recent Transactions */}
          <TransactionsList
            containerStyle={common_styles}
            transactions={transactions}
            onDeleteTransaction={handleDeleteTransaction}
          />
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
