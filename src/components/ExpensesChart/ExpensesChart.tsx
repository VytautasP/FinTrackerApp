import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { BarGroup, CartesianChart, PointsArray, useChartTransformState, useLinePath } from "victory-native";
import { appColors } from '../../consts/colors';
import { DashPathEffect, LinearGradient, Path, useFont, vec } from '@shopify/react-native-skia';

const DATA = Array.from({ length: 31 }, (_, i) => {
  let lowTmp = 4 + 30 * Math.random();
  let highTmp = 2 + 10 * Math.random();

  let dtItem = {
    day: i + 1,
    income: lowTmp,
    expense: highTmp,
    balance: Math.abs(highTmp - lowTmp),
  }

  return dtItem;
});

function MyCustomLine({ points }: { points: PointsArray }) {
  const { path } = useLinePath(points, { curveType: "natural" });
  return <Path path={path} style="stroke" strokeWidth={2} color="#3078e8" />;
}

const ExpensesChart: React.FC = () => {

  const transformState = useChartTransformState();
  const skFont = useFont(require("../../assets/fonts/Roboto-Regular.ttf"), 12);

  console.log("skFont ", skFont);

  return (
    <Card style={styles.chartCard}>
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
            data={DATA}
            xKey="day"
            yKeys={["income", "expense", "balance"]}
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
  chartCard: {
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
