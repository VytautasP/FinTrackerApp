import React, {  useState, useEffect, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, PanResponder } from 'react-native';
import { CategoryTotal } from '../../services/database/DatabaseService';
import { Card } from 'react-native-paper';
import { PieChart } from 'react-native-gifted-charts';
import { getCategoryById } from '../../consts/categories';
import { formatNumber } from '../../helpers/numberUtils';
import {  Text } from 'react-native-paper';
import { appColors } from '../../consts/colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface SummaryPieChartProps {
  monthData: CategoryTotal[];
}

interface PieChartDataItem {
  value: number;
  color: string;
  text: string;
}

enum ChartType {
  Expenses = 'expenses',
  Income = 'income',
}

const SummaryPieChart: React.FC<SummaryPieChartProps> = ({ monthData }) => {

  const [focusedItem, setFocusedItem] = useState<PieChartDataItem | null>(null);
  const [chartType, setChartType] = useState<ChartType>(ChartType.Expenses);

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

  useEffect(() => {
    const data = chartType === ChartType.Expenses ? transformExpenseData : transformIncomeData;
    const focused = data.find((item: any) => item.focused);
    setFocusedItem(focused || (data.length > 0 ? data[0] : null));
  }, [chartType, transformExpenseData, transformIncomeData]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Set responder only for horizontal swipes
        return Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && Math.abs(gestureState.dx) > 10;
      },
      onPanResponderRelease: (evt, gestureState) => {
        const canSwitchToIncome = transformIncomeData.length > 0;
        const canSwitchToExpense = transformExpenseData.length > 0;

        setChartType(currentChartType => {
          // swipe left to see expense
          if (gestureState.dx < -50 && currentChartType === ChartType.Expenses && canSwitchToIncome) {
            return ChartType.Income;
          }
          // swipe right to see income
          if (gestureState.dx > 50 && currentChartType === ChartType.Income && canSwitchToExpense) {
            return ChartType.Expenses;
          }
          return currentChartType;
        });
      },
    })
  ).current;

  const renderLegend = (data: PieChartDataItem[]) => {
    return (
      <View style={styles.legendContainer}>
        {data.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.legendColorBox, { backgroundColor: item.color }]} />
            <Text style={{fontSize : 12, color: 'black'}}>{item.text}</Text>
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

  const renderSwitcher = () => {
    const canSwitchToIncome = transformIncomeData.length > 0;
    const canSwitchToExpense = transformExpenseData.length > 0;
    const isExpensesDisabled = chartType === ChartType.Expenses || !canSwitchToExpense;
    const isIncomeDisabled = chartType === ChartType.Income || !canSwitchToIncome;

    return (
      <View style={styles.switcherContainer}>
        <View style={styles.switcherNav}>
          <TouchableOpacity
            onPress={() => setChartType(ChartType.Expenses)}
            disabled={isExpensesDisabled}
          >
            <MaterialCommunityIcons name="arrow-left" size={16} color={isExpensesDisabled ? '#d3d3d3' : appColors.widgetGradien2} />
          </TouchableOpacity>
          <View style={styles.dotsContainer}>
            {canSwitchToExpense && <View style={[styles.dot, chartType === ChartType.Expenses && styles.activeDot]} />}
            {canSwitchToIncome && <View style={[styles.dot, chartType === ChartType.Income && styles.activeDot]} />}
          </View>
          <TouchableOpacity
            onPress={() => setChartType(ChartType.Income)}
            disabled={isIncomeDisabled}
          >
            <MaterialCommunityIcons name="arrow-right" size={16} color={isIncomeDisabled ? '#d3d3d3' : appColors.widgetGradien2} />
          </TouchableOpacity>
        </View>
        <Text variant="bodyMedium" style={styles.chartTypeName}>{chartType.charAt(0).toUpperCase() + chartType.slice(1)}</Text>
      </View>
    );
  };

  const chartData = chartType === ChartType.Expenses ? transformExpenseData : transformIncomeData;

  return (
    <Card.Content>
      {chartData.length > 0 ? (
        <View>
          <View style={styles.chartViewContainer} {...panResponder.panHandlers}>
            <View style={styles.chartContainer}>
              <PieChart
                donut
                shadow
                focusOnPress
                radius={80}
                onPress={(item: any, index: number) => { setFocusedItem(item); }}
                innerRadius={60}
                data={chartData}
                centerLabelComponent={renderCenterComponent}
              />
            </View>
            {renderLegend(chartData)}
          </View>
          {renderSwitcher()}
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
    position: 'relative',
  },
  chartViewContainer: {
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
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
  switcherContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  switcherNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 100,
  },
  dotsContainer: {
    flexDirection: 'row',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#d3d3d3',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: appColors.widgetGradien2,
  },
  chartTypeName: {
    marginTop: 5,
    color: '#757575',
    fontSize: 12,
  },
});

export default SummaryPieChart;