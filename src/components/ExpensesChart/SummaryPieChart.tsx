import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CategoryTotal, DailyTotal } from '../../services/database/DatabaseService';
import { Card } from 'react-native-paper';
import { PieChart } from 'react-native-gifted-charts';
import { getCategoryById } from '../../consts/categories';

interface SummaryPieChartProps {
  monthData: CategoryTotal[];
}

interface PieChartDataItem {
  value: number;
  color: string;
  text: string;
}

const SummaryPieChart: React.FC<SummaryPieChartProps> = ({ monthData }) => {
  
  const transformIncomeData = React.useMemo(() =>  {
    const incomeTotals = monthData.map(item => {
      const { category, income, expense } = item;
      var categoryItem = getCategoryById(category);
      return { value: income, color: categoryItem.color, text: categoryItem.name };
    });

    return incomeTotals;

  }, [monthData]);

  const transformExpenseData = React.useMemo(() => {
    const expenseTotals = monthData.map(item => {
      const { category, income, expense } = item;
      var categoryItem = getCategoryById(category);
      return { value: expense, color: categoryItem.color, text: categoryItem.name };
    });

    return expenseTotals;

  }, [monthData]);


  // TODO: Implement Pie Chart logic and rendering
  // 1. Import PieChart from react-native-gifted-charts - DONE
  // 2. Transform monthData to get totals per category - DONE
  // 3. Render the PieChart with the transformed data

  return (
    <Card.Content>
      <View style={styles.container}>
        <PieChart
            showText
            textColor="black"
            radius={110}
            textSize={20}
            showTextBackground
            textBackgroundRadius={26}
            data={transformExpenseData}
            />
      </View>
    </Card.Content>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SummaryPieChart;