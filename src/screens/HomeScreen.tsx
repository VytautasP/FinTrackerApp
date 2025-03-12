// HomeScreen.js
import { DashPathEffect } from '@shopify/react-native-skia';
import React from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Appbar, Button, Card, Text } from 'react-native-paper';
import { Bar, CartesianChart, Pie, PolarChart, StackedArea } from "victory-native";
import { appColors } from '../consts/colors';
import { ca } from 'date-fns/locale';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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

const button_icon_size = 13;

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
            <Card.Content style={styles.balanceCardContent}>
              <LinearGradient
                colors={['#3c8ae1', '#1c59cd']}
                style={styles.gradientBackground}
              >
                <Text variant="headlineLarge" style={styles.balanceText}>
                  $5,000
                </Text>
                <Text variant="bodySmall" style={styles.cardSubtitle}>
                  total month balances
                </Text>
              </LinearGradient>

            </Card.Content>
            <Card.Actions style={styles.balanceCardActions}>
              <View style={styles.buttonContainer}>
                <Button mode="text" 
                icon={({size, color}) => (
                  <Icon name="plus-circle" size={button_icon_size} color={appColors.addIcon}/>
                )}
                style={styles.smallButton} contentStyle={styles.smallButtonContent} labelStyle={styles.smallButtonLabel} onPress={() => {}}
                //rippleColor="rgba(26, 182, 187, 0.2)" // Add explicit ripple effect
                >Add incomes</Button>
                <View style={styles.verticalDivider} />
                <Button 
                icon={({size, color}) => (
                  <Icon name="minus-circle" size={button_icon_size} color={appColors.removeIcon}/>
                )}
                mode="text" style={styles.smallButton} contentStyle={styles.smallButtonContent} labelStyle={styles.smallButtonLabel} onPress={() => {}}
                >Add expense</Button>
              </View>
            </Card.Actions>
          </Card>
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

  smallButton: {
    borderRadius: 8,
    margin: 4,
    minWidth: 120
  },

  smallButtonContent: {
    height: 27
  },

  smallButtonLabel: {
    fontSize: 11,
    marginVertical: 0,
    color: appColors.mainWidgetButtonsText
  },
 
  verticalDivider: {
    height: 24,
    width: 1, 
    backgroundColor: '#CCCCCC', 
    marginHorizontal: 12,
  },

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
    borderRadius: 20,
    height: 140,
    backgroundColor: appColors.white,
  },
  balanceCardContent: {
    borderRadius: 20,
    padding: 0,
    margin: 0,
    height: '73%'
  },
  balanceCardActions: {
    borderRadius: 20,
    height: '27%',
    padding: 0
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    position: 'relative',
  },
  gradientBackground: {
    position: 'absolute', // Position absolute to fill entire space
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
    justifyContent: 'center',
  },
  cardSubtitle: {
    textAlign: 'center',
    color: appColors.subTitleText,
    fontWeight: 'bold',
  },
  balanceText: {
    textAlign: 'center',
    color: appColors.white,
    fontWeight: 'bold',
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
