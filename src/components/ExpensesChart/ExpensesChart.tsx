import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { BarGroup, CartesianChart, PointsArray, useChartTransformState, useLinePath } from "victory-native";
import { appColors } from '../../consts/colors';
import { DashPathEffect, Path, useFont } from '@shopify/react-native-skia';

const DATA = Array.from({ length: 31 }, (_, i) => ({
  day: `${i}d`,
  lowTmp: 2 + 10 * Math.random(),
  highTmp: 4 + 30 * Math.random(),
}));

function MyCustomLine({ points }: { points: PointsArray }) {
  // 👇 use the hook to generate a path object.
  const { path } = useLinePath(points, { curveType: "natural" });
  return <Path path={path} style="stroke" strokeWidth={2} color="#3078e8" />;
}

const ExpensesChart: React.FC = () => {

  const transformState = useChartTransformState();
  const font = { family: 'Roboto_Condensed-Thin', size: 12 };
  const skFont = useFont(require("../../assets/fonts/Roboto_Condensed-Thin.ttf"), 12);

  console.log("skFont ", skFont);

  return (
    <Card style={styles.chartCard}>
      <Card.Title title="Monthly money flow" />
      <Card.Content>
        <View style={{ height: 200 }}>
          <CartesianChart
            padding={{ bottom: 20 }}
            data={DATA} // 👈 specify your data
            xKey="day" // 👈 specify data key for x-axis
            yKeys={["lowTmp", "highTmp"]} // 👈 specify data keys used for y-axis
            viewport={{ x: [1, 7] }} // 👈 specify the viewport of the chart
            xAxis={{
              font: skFont,
              labelColor: "black",
              labelOffset: 2,
              tickCount: 31,
              //formatXLabel: (x) => `${x}d`,
              enableRescaling: true,
              linePathEffect: <DashPathEffect intervals={[4, 4]} />,
            }}
            transformState={transformState.state} // 👈 pass the transform state to the chart
            transformConfig={{
              pan: { dimensions: "x" },
              pinch: { dimensions: "x" }
            }}
          >

            {({ points, chartBounds }) => (

              <>
                <BarGroup
                  chartBounds={chartBounds}
                  betweenGroupPadding={0.3}
                  withinGroupPadding={0.1}
                >
                  <BarGroup.Bar points={points.lowTmp} color="green" />
                  <BarGroup.Bar points={points.highTmp} color="yellow" />
                </BarGroup>
                <MyCustomLine points={points.lowTmp} />
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
    marginBottom: 16,
    backgroundColor: appColors.white,
  },
});

export default ExpensesChart;
