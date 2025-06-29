import React from 'react'
import { StyleSheet, Text, useWindowDimensions, View, ViewStyle } from 'react-native';
import { DailyTotal } from '../../services/database/DatabaseService';
import { BarChart } from 'react-native-gifted-charts';
import { appColors } from '../../consts/colors';
import { Card } from 'react-native-paper';

interface ExpensesChartProps {
  containerStyle?: ViewStyle;
  monthData: DailyTotal[];
  year: number;
  month: number; // 1-indexed month
}

const ExpensesChart: React.FC<ExpensesChartProps> = (props: ExpensesChartProps) => {

  const { containerStyle, monthData, year, month } = props;

  const transformedData = React.useMemo(() => {

    let daysInMonth = new Date(year, month, 0).getDate();
    let dailyEntries: { date: number; income: number; expense: number }[] = [];
    for (let day = 1; day <= daysInMonth; day++) {
      dailyEntries.push({ date: day, income: 0, expense: 0 });
    }

    monthData.forEach(item => {
      let dayOfMonth = parseInt(item.date.split('-')[2], 10);

      if (dayOfMonth >= 1 && dayOfMonth <= daysInMonth) {
        let entry = dailyEntries[dayOfMonth - 1]; // Adjust for 0-indexed array
        if (entry) {
          entry.income = item.income;
          entry.expense = item.expense;
        }
      }
    });

    let barData = monthData.flatMap(entry => {

      let date = new Date(entry.date).getDate();
      let dateString = date< 10 ? `0${date}` : date.toString();

      return [{
        value: entry.income,
        label: dateString,
        spacing: 2,
        labelWidth: 30,
        labelTextStyle: { color: 'gray' },
        frontColor: appColors.incomeBar,
      },
      { value: entry.expense, frontColor: appColors.expenseBar }]
    })


    return barData;
  }, [monthData, year, month]);

  const axisYTop = React.useMemo(() => {

    let maxIncome = Math.max(...monthData.map(item => item.income));
    let maxExpense = Math.max(...monthData.map(item => item.expense));
    let maxValue = Math.max(maxIncome, maxExpense);

    //convert to integer
    maxValue = Math.ceil(maxValue + (maxValue * 0.20));
    return maxValue;
  }, [monthData, year, month]);

  const { width, height } = useWindowDimensions();

  const CustomTooltip = ({ item }: { item: { value: number; frontColor: string } }) => {
  if (!item) {
    return null;
  }

  let marginLeftBase = -14; 
  let valueIntegerPart = Math.floor(item.value);
  let valueIntegerDigits = valueIntegerPart.toString().length;
  let marginLeft = marginLeftBase + -1 * (valueIntegerDigits * 8); // 8 is the width of one digit in the tooltip bubble

  return (
    <View style={styles.tooltipContainer}>
      <View style={[styles.tooltipBubble, { backgroundColor: item.frontColor }]}>
        <Text style={styles.tooltipText}>€{item.value.toFixed(2)}</Text>
      </View>
      <View style={[styles.tooltipTriangle, { borderTopColor: item.frontColor, marginLeft: marginLeft }]} />
    </View>
  );
};

  return (

    <Card style={[styles.container, containerStyle]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Money flow</Text>
      </View>
      {/* Legend */}
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: appColors.incomeBar }]} />
          <Text style={styles.legendText}>Income</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: appColors.expenseBar }]} />
          <Text style={styles.legendText}>Expenses</Text>
        </View>
      </View>
      <Card.Content>
        <View style={{ height: 250 }}>
          <BarChart
            data={transformedData}
            barWidth={10}
            spacing={24}
            roundedTop
            roundedBottom
            rulesType = "dashed"
            rulesThickness = {1}
            rulesColor = 'gray'
            rulesLength={ width - 122} // minus padding and legend width
            xAxisThickness={0}
            yAxisThickness={0}
            yAxisTextStyle={{ color: 'gray' }}
            noOfSections={5}
            maxValue={axisYTop}
            renderTooltip={(item: any, index: number) => {
              if (item.value === 0) {
                return null;
              }
              return <CustomTooltip item={item} />;
            }}
          />
        </View>
      </Card.Content>
    </Card>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    backgroundColor: appColors.white,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  headerText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: appColors.widgetHeaderText,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 3,
    marginRight: 6
  },
  legendText: {
    fontSize: 12,
    color: appColors.secondaryText,
  },

  tooltipContainer: {
    alignItems: 'center',
    marginBottom: 5,
  },
  tooltipBubble: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginLeft: -20,
    // The background color is set dynamically inline
  },
  tooltipText: {
    color: appColors.white,
    fontWeight: 'bold',
    fontSize: 14,
  },
  tooltipTriangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  }
});

export default ExpensesChart;