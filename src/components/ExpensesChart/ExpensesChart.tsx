import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { BarGroup, CartesianChart, PointsArray, useChartTransformState, useLinePath } from "victory-native";
import { appColors } from '../../consts/colors';
import { DashPathEffect, LinearGradient, Path, useFont, vec } from '@shopify/react-native-skia';

const DATA = Array.from({ length: 31 }, (_, i) => {
  let lowTmp = 2 + 10 * Math.random();
  let highTmp = 4 + 30 * Math.random();

  let dtItem = {
    day: i + 1,
    lowTmp: lowTmp,
    highTmp: highTmp,
    avgTmp: (lowTmp + highTmp) / 2,
  }

  return dtItem;
});

function MyCustomLine({ points }: { points: PointsArray }) {
  const { path } = useLinePath(points, { curveType: "natural" });
  return <Path path={path} style="stroke" strokeWidth={2} color="#3078e8" />;
}

const ExpensesChart: React.FC = () => {

  const transformState = useChartTransformState();
  const skFont = useFont("FontAwesome.ttf", 12);

  console.log("skFont ", skFont);

  return (
    <Card style={styles.chartCard}>
      <Card.Title title="Monthly money flows" />
      <Card.Content>
        <View style={{ height: 200 }}>
          <CartesianChart
            padding={{ bottom: 20 }}
            domain={{x: [0, 31]}}
            viewport={{ x: [0, 7] }}
            data={DATA}
            xKey="day"
            yKeys={["lowTmp", "highTmp", "avgTmp"]}
            xAxis={{
              font: skFont,
              labelColor: "black",
              labelOffset: 8,
              tickCount: 31,
              formatXLabel: (x) => `${x}d`,
              enableRescaling: true,
              //lineColor: 'red',
              linePathEffect: <DashPathEffect intervals={[4, 4]} />,
            }}
            yAxis={[{
              font: skFont,
              labelColor: "black",
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
                  <BarGroup.Bar points={points.lowTmp} animate={{ type: "spring" }}>
                    <LinearGradient
                      start={vec(0, 0)} // 👈 The start and end are vectors that represent the direction of the gradient.
                      end={vec(0, 250)}
                      colors={[ // 👈 The colors are an array of strings that represent the colors of the gradient.
                        "#a78bfa",
                        "#a78bfa50" // 👈 The second color is the same as the first but with an alpha value of 50%.
                      ]}
                    />
                  </BarGroup.Bar>
                  <BarGroup.Bar points={points.highTmp} animate={{ type: "spring" }}>
                    <LinearGradient
                      start={vec(0, 0)} // 👈 The start and end are vectors that represent the direction of the gradient.
                      end={vec(0, 250)}
                      colors={[ // 👈 The colors are an array of strings that represent the colors of the gradient.
                        "#80ccff",
                        "#80ccff50" // 👈 The second color is the same as the first but with an alpha value of 50%.
                      ]}
                    />
                  </BarGroup.Bar>
                </BarGroup>
                <MyCustomLine points={points.avgTmp} />
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
