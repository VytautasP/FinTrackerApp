import React from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { DailyTotal } from '../../services/database/DatabaseService';
import { appColors } from '../../consts/colors';
import { Card } from 'react-native-paper';

interface DailyBarChartProps {
  monthData: DailyTotal[];
  year: number;
  month: number;
}

const CustomTooltip = ({ item }: { item: { value: number; frontColor: string } }) => {
    if (!item) {
      return null;
    }
  
    let marginLeftBase = -14; 
    let valueIntegerPart = Math.floor(item.value);
    let valueIntegerDigits = valueIntegerPart.toString().length;
    let marginLeft = marginLeftBase + -1 * (valueIntegerDigits * 8);
  
    return (
      <View style={styles.tooltipContainer}>
        <View style={[styles.tooltipBubble, { backgroundColor: item.frontColor }]}>
          <Text style={styles.tooltipText}>€{item.value.toFixed(2)}</Text>
        </View>
        <View style={[styles.tooltipTriangle, { borderTopColor: item.frontColor, marginLeft: marginLeft }]} />
      </View>
    );
};

const DailyBarChart: React.FC<DailyBarChartProps> = ({ monthData, year, month }) => {
  const { width } = useWindowDimensions();

  const transformedData = React.useMemo(() => {
    let barData = monthData.flatMap(entry => {
      let date = new Date(entry.date).getDate();
      let dateString = date < 10 ? `0${date}` : date.toString();

      return [{
        value: entry.income,
        label: dateString,
        spacing: 2,
        labelWidth: 30,
        labelTextStyle: { color: 'gray' },
        frontColor: appColors.incomeBar,
      },
      { value: entry.expense, frontColor: appColors.expenseBar }]
    });
    return barData;
  }, [monthData]);

  const axisYTop = React.useMemo(() => {
    let maxIncome = Math.max(...monthData.map(item => item.income));
    let maxExpense = Math.max(...monthData.map(item => item.expense));
    let maxValue = Math.max(maxIncome, maxExpense, 1); // Ensure not 0
    maxValue = Math.ceil(maxValue + (maxValue * 0.20));
    return maxValue;
  }, [monthData]);

  return (
    <>
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
            rulesType="dashed"
            rulesThickness={1}
            rulesColor='gray'
            rulesLength={width - 122}
            xAxisThickness={0}
            yAxisThickness={0}
            yAxisTextStyle={{ color: 'gray' }}
            noOfSections={5}
            maxValue={axisYTop}
            renderTooltip={(item: any) => {
              if (item.value === 0) return null;
              return <CustomTooltip item={item} />;
            }}
          />
        </View>
      </Card.Content>
    </>
  );
};

const styles = StyleSheet.create({
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

export default DailyBarChart;