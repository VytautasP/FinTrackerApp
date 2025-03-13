// HomeScreen.js
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Appbar, Card, Text } from 'react-native-paper';
import { Bar, CartesianChart } from "victory-native";
import { appColors } from '../consts/colors';
import MonthSelector from '../components/MonthSelector/MonthSelector';
import BalanceCard from '../components/BalanceCard/BalanceCard';


const HomeScreen: React.FC = () => {

  const [selectedMonth, setSelectedMonth] = useState(new Date());

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
          <BalanceCard />

          {/* Month selector */}
          <MonthSelector
            initialMonth={selectedMonth}
            onMonthChange={(month) => setSelectedMonth(month)}
          />

          {/* Expenses Breakdown (Pie Chart)  */}
          <Card style={styles.chartCard}>
            <Card.Title title="Monthly Spending" />
            <Card.Content>
              <View style={{ height: 300 }}>
                <CartesianChart
                  data={[
                    { month: 'Jan', amount: 450 },
                    { month: 'Feb', amount: 380 },
                    { month: 'Mar', amount: 520 },
                    { month: 'Apr', amount: 290 },
                    { month: 'May', amount: 410 },
                  ]}
                  xKey="month"
                  yKeys={["amount"]}
                  axisOptions={{
                    labelPosition: { x: 'outset', y: 'outset' },
                    lineColor: appColors.text.light,
                    tickCount: { x: 5, y: 5 },
                  }}
                >
                  {({ points, chartBounds }) => (
                    <Bar
                      points={points.amount}
                      roundedCorners={{ topLeft: 5, topRight: 5 }}
                      chartBounds={chartBounds}
                      color={appColors.tint}
                      barWidth={30}
                      barCount={5}
                      labels={{ position: "bottom", font: null }}
                    />
                  )}
                </CartesianChart>
              </View>
            </Card.Content>
          </Card>

          {/* Recent Transactions */}
          <Card style={styles.transactionsCard}>
            <Card.Title title="Recent Transactionss" />
            <Card.Content>
              <View style={styles.transactionItem}>
                <Text>Date: Feb 21</Text>
                <Text>Amount: $50</Text>
                <Text>Category: Food</Text>
              </View>
              <View style={styles.transactionItem}>
                <Text>Date: Feb 20</Text>
                <Text>Amount: $200</Text>
                <Text>Category: Rent</Text>
              </View>
              <View style={styles.transactionItem}>
                <Text>Date: Feb 18</Text>
                <Text>Amount: $120</Text>
                <Text>Category: Utilities</Text>
              </View>
            </Card.Content>
          </Card>
        </ScrollView>
      </View>
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
  chartCard: {
    marginBottom: 16,
  },
  transactionsCard: {
    marginBottom: 16,
  },
  transactionItem: {
    marginBottom: 12,
  },
});
