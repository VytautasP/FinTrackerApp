// HomeScreen.js
import { DashPathEffect } from '@shopify/react-native-skia';
import React from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Appbar, Card, Text } from 'react-native-paper';
import { Bar, CartesianChart, Pie, PolarChart, StackedArea } from "victory-native";
import { appColors } from '../consts/colors';

// helper functions for example purposes:
function randomNumber() {
  return Math.floor(Math.random() * 26) + 125;
}
function generateRandomColor(): string {
  // Generating a random number between 0 and 0xFFFFFF
  const randomColor = Math.floor(Math.random() * 0xffffff);
  // Converting the number to a hexadecimal string and padding with zeros
  return `#${randomColor.toString(16).padStart(6, "0")}`;
}
const DATA = (numberPoints = 5) =>
  Array.from({ length: numberPoints }, (_, index) => ({
    value: randomNumber(),
    color: generateRandomColor(),
    label: `Label ${index + 1}`,
  }));

const HomeScreen = () => {

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
          <Card style={styles.balanceCard}>
            <Card.Title title="Total Balance" />
            <Card.Content>
              <Text variant="headlineLarge" style={styles.balanceText}>
                $5,000
              </Text>
            </Card.Content>
          </Card>

          {/* Expenses Breakdown (Pie Chart)  */}
         
          <Card style={styles.chartCard}>
            <Card.Title title="Expenses Breakdown" />
            <Card.Content>
            <View style={{ height: 300 }}>
      <PolarChart
        data={DATA} // 👈 specify your data
        labelKey={"label"} // 👈 specify data key for labels
        valueKey={"value"} // 👈 specify data key for values
        colorKey={"color"} // 👈 specify data key for color
      >
        <Pie.Chart />
      </PolarChart>
    </View>
            </Card.Content>
          </Card>

          {/* Recent Transactions */}
          <Card style={styles.transactionsCard}>
            <Card.Title title="Recent Transactions" />
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
  balanceCard: {
    marginBottom: 16,
  },
  balanceText: {
    marginTop: 8,
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
