import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { BarGroup, CartesianChart, useChartTransformState } from "victory-native";
import { appColors } from '../../consts/colors';
import { DashPathEffect, useFont} from '@shopify/react-native-skia';
import { DailyTotal } from '../../services/database/DatabaseService';

interface ExpensesChartProps {
    containerStyle?: ViewStyle;
    monthData: DailyTotal[];
    year: number;
    month: number; // 1-indexed month
}

const ExpensesChart: React.FC<ExpensesChartProps> = (props: ExpensesChartProps) => {

  const { containerStyle, monthData, year, month } = props;

  const transformState = useChartTransformState();
  const skFont = useFont(require("../../assets/fonts/Roboto-Regular.ttf"), 12);

  const transformedData = React.useMemo(() => {
    const daysInMonth = new Date(year, month, 0).getDate();
    const dailyEntries: { date: number; income: number; expense: number }[] = [];

    for (let day = 1; day <= daysInMonth; day++) {
      dailyEntries.push({ date: day, income: 0, expense: 0 });
    }


    monthData.forEach(item => {
      const dayOfMonth = parseInt(item.date.split('-')[2], 10);
   
      if (dayOfMonth >= 1 && dayOfMonth <= daysInMonth) {
        const entry = dailyEntries[dayOfMonth - 1]; // Adjust for 0-indexed array
        if (entry) {
          entry.income = item.income;
          entry.expense = item.expense;
        }
      }
    });
    return dailyEntries;
  }, [monthData, year, month]);

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
        <View style={{ height: 200 }}>
          <CartesianChart
            padding={{ bottom: -8 }}
            domain={{ x: [0, 31] }}
            viewport={{ x: [0, 7] }}
            data={transformedData}
            xKey="date"
            yKeys={["income", "expense"]}
            xAxis={{
              font: skFont,
              labelColor: appColors.secondaryText,
              labelOffset: 8,
              tickCount: 31,
              formatXLabel: (x) => `${x}d`,
              enableRescaling: true,
              //lineColor: 'red',
              linePathEffect: <DashPathEffect intervals={[4, 4]} />,
            }}
            yAxis={[{
              font: skFont,
              labelColor: appColors.secondaryText,
              labelOffset: 8,
              enableRescaling: true,
              linePathEffect: <DashPathEffect intervals={[2, 2]} />,
            }]}
            transformState={transformState.state}
            transformConfig={{
              pan: { dimensions: "x" },
              pinch: { dimensions: "x" }
            }}
          >

            {({ points, chartBounds }) => (
              <>
                <BarGroup
                  chartBounds={chartBounds}
                  barWidth={18}
                  betweenGroupPadding={0.5}
                  withinGroupPadding={0.7}
                  roundedCorners={{
                    topLeft: 5,
                    topRight: 5
                  }}
                >

                  <BarGroup.Bar points={points.expense} animate={{ type: "spring" }} color={appColors.expenseBar}>
                    {/* <LinearGradient
                      start={vec(0, 0)} // 👈 The start and end are vectors that represent the direction of the gradient.
                      end={vec(0, 250)}
                      colors={[ // 👈 The colors are an array of strings that represent the colors of the gradient.
                        "#80ccff",
                        "#80ccff50" // 👈 The second color is the same as the first but with an alpha value of 50%.
                      ]}
                    /> */}
                  </BarGroup.Bar>
                  <BarGroup.Bar points={points.income} animate={{ type: "spring" }} color={appColors.incomeBar}>
                    {/* <LinearGradient
                      start={vec(0, 0)} // 👈 The start and end are vectors that represent the direction of the gradient.
                      end={vec(0, 250)}
                      colors={[ // 👈 The colors are an array of strings that represent the colors of the gradient.
                        "#a78bfa",
                        "#a78bfa50" // 👈 The second color is the same as the first but with an alpha value of 50%.
                      ]}
                    /> */}
                  </BarGroup.Bar>
                </BarGroup>
                {/* <MyCustomLine points={points.avgTmp} /> */}
              </>
            )}
          </CartesianChart>
        </View>
      </Card.Content>
    </Card>
  );
};

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
});

export default ExpensesChart;
