import React, {  useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CategoryTotal } from '../../services/database/DatabaseService';
import { Card } from 'react-native-paper';
import { PieChart } from 'react-native-gifted-charts';
import { getCategoryById } from '../../consts/categories';
import { formatNumber } from '../../helpers/numberUtils';

interface SummaryPieChartProps {
  monthData: CategoryTotal[];
}

interface PieChartDataItem {
  value: number;
  color: string;
  text: string;
}

const SummaryPieChart: React.FC<SummaryPieChartProps> = ({ monthData }) => {

  const [focusedItem, setFocusedItem] = useState<PieChartDataItem | null>(null);

  const transformIncomeData = React.useMemo(() => {
    const incomeTotals = monthData
      .filter(item => item.income > 0)
      .map(item => {
        const { category, income } = item;
        var categoryItem = getCategoryById(category);
        return { value: income, color: categoryItem.color, text: categoryItem.name };
      });

    if (incomeTotals.length > 0) {
      const maxIncome = Math.max(...incomeTotals.map(item => item.value));
      const maxIndex = incomeTotals.findIndex(item => item.value === maxIncome);
      if (maxIndex !== -1) {
        //@ts-ignore
        incomeTotals[maxIndex] = { ...incomeTotals[maxIndex], focused: true };
      }
    }

    return incomeTotals;

  }, [monthData]);

  const transformExpenseData = React.useMemo(() => {
    const expenseTotals = monthData
      .filter(item => item.expense > 0)
      .map(item => {
        const { category, expense } = item;
        var categoryItem = getCategoryById(category);
        return { value: expense, color: categoryItem.color, text: categoryItem.name };
      });

    if (expenseTotals.length > 0) {
      const maxExpense = Math.max(...expenseTotals.map(item => item.value));
      const maxIndex = expenseTotals.findIndex(item => item.value === maxExpense);
      if (maxIndex !== -1) {
        //@ts-ignore
        expenseTotals[maxIndex] = { ...expenseTotals[maxIndex], focused: true };
      }
    }

    return expenseTotals;

  }, [monthData]);

  const renderLegend = (data: PieChartDataItem[]) => {
    return (
      <View style={styles.legendContainer}>
        {data.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.legendColorBox, { backgroundColor: item.color }]} />
            <Text>{item.text}</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderCenterComponent = () => {
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Text
          style={{ fontSize: 16, color: 'black', fontWeight: 'bold' }}>
          € {formatNumber(focusedItem ? focusedItem.value : 0)}
        </Text>
        <Text style={{ fontSize: 11, color: 'black' }}>{focusedItem ? focusedItem.text : ''}</Text>
      </View>
    );
  }

  return (
    <Card.Content>
      {transformExpenseData.length > 0 ? (
        <View style={styles.container}>
          <View style={styles.chartContainer}>
            <PieChart
              donut
              shadow
              focusOnPress
              radius={80}
              onPress={(item, index) => { setFocusedItem(item); }}
              innerRadius={60}
              data={transformExpenseData}
              centerLabelComponent={renderCenterComponent}

            />
          </View>
          {renderLegend(transformExpenseData)}
        </View>
      ) : (
        <View style={styles.noDataContainer}>
          <Text>No data to display</Text>
        </View>
      )}
    </Card.Content>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    flexDirection: 'row',
  },
  noDataContainer: {
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  legendContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  legendColorBox: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
});

export default SummaryPieChart;