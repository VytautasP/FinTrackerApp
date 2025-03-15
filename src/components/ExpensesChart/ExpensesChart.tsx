import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
import { Bar, CartesianChart } from "victory-native";
import { appColors } from '../../consts/colors';

const ExpensesChart: React.FC = () => {
  return (
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
  );
};

const styles = StyleSheet.create({
  chartCard: {
    marginBottom: 16,
  },
});

export default ExpensesChart;
