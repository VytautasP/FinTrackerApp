// HomeScreen.js
import React, { useState, useEffect, useCallback } from 'react'; // Import useEffect and useCallback
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Appbar } from 'react-native-paper';
import { appColors } from '../consts/colors';
import MonthSelector from '../components/MonthSelector/MonthSelector';
import BalanceCard from '../components/Balance/BalanceCard';
import ExpensesChart from '../components/ExpensesChart/ExpensesChart';
import TransactionsList from '../components/Transactions/TransactionsList';
import TransactionInputModal, { TransactionItem } from '../components/Transactions/TransactionInputModal';
import BalanceSummary from '../components/Balance/BalanceSummary';
import { useDatabase } from '../services/database/DatabaseContext';
import { MonthlySummary, Transaction } from '../services/database/DatabaseService';

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
  const dbContext = useDatabase();
  const [selectedTransactionCategory, setSelectedCategory] = useState(BalanceType.Income);
  const [selectedCategoryInputText, setSelectedCategoryInputText] = useState("Add income");
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [modalVisible, setModalVisible] = useState(false);

  const [balanceSummaryData, setBalanceSummaryData] = useState<MonthlySummary>({ income: 0, expense: 0, balance: 0 });
  const [chartData, setChartData] = useState([]); // Adjust type based on expected chart data structure
  const [transactions, setTransactions] = useState<Transaction[]>([]); // Assuming TransactionItem is defined elsewhere

  const showModal = () => {
    console.log('Show modal');
    setModalVisible(true);
  };
  const hideModal = () => setModalVisible(false);

  const handleSaveTransaction = async (transaction: TransactionItem, transactionType: BalanceType) => {
    try {
      await dbContext.transactions.add(transaction.title, transaction.amount, transaction.category.id, transaction.date, transactionType);
      console.log('Saved transaction:', transaction);
      // Reload data after saving
      await loadUiData(selectedMonth);
    } catch (error) {
      console.error("Failed to save transaction:", error);
      // Handle error appropriately (e.g., show a message to the user)
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

  // Memoized function to load UI data
  const loadUiData = useCallback(async (month: Date) => {
    if (!dbContext) return; // Ensure dbContext is available

    console.log("Loading UI data for month:", month);
    try {
 
      const year = month.getFullYear();
      const monthNumber = month.getMonth() + 1; // Months are 0-indexed in JavaScript

      const summary = await dbContext.summaries.getMonthly(year, monthNumber);
      //const expensesByCategory = await dbContext.transactions.getExpensesByCategoryForMonth(month);
      const monthlyTransactions = await dbContext.transactions.getByMonth(year, monthNumber);

      setTransactions(monthlyTransactions || []);
      setBalanceSummaryData(summary || { income: 0, expense: 0, balance: 0 });
      //setChartData(expensesByCategory || []);
      //setTransactions(monthlyTransactions || []);

    } catch (error) {

      console.error("Failed to load UI data:", error);
      // Handle errors appropriately
      setBalanceSummaryData({ income: 0, expense: 0, balance: 0 });
      setChartData([]);
      setTransactions([]);

    }
  }, [dbContext]); 

  // useEffect to load data on mount and when selectedMonth or dbContext changes
  useEffect(() => {
    loadUiData(selectedMonth);
  }, [selectedMonth, loadUiData]); // Dependencies: selectedMonth and the memoized loadUiData function

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
            monthTotal={balanceSummaryData.balance} // Use state variable
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
            income={balanceSummaryData.income} // Pass fetched data
            expense={balanceSummaryData.expense} // Pass fetched data
          />
          
          {/* Expenses Breakdown Chart */}
          <ExpensesChart
            containerStyle={common_styles}
            //data={chartData} // Pass fetched data
          />

          {/* Recent Transactions */}
          <TransactionsList
            containerStyle={common_styles}
            transactions={transactions} // Pass fetched data
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
