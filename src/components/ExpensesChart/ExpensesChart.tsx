import React from 'react'
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { CategoryTotal, DailyTotal } from '../../services/database/DatabaseService';
import { appColors } from '../../consts/colors';
import { Card } from 'react-native-paper';
import IconToggleSwitch from '../IconToggleSwitch/IconToggleSwitch';
import DailyBarChart from './DailyBarChart';
import SummaryPieChart from './SummaryPieChart';

interface ExpensesChartProps {
  containerStyle?: ViewStyle;
  monthDailyData: DailyTotal[];
  monthCategoryData: CategoryTotal[];
  year: number;
  month: number; // 1-indexed month
}

enum ChartType {
  Daily = 'daily',
  Summary = 'summary',
}

const chartTypeOptions = [
  { value: ChartType.Daily, iconName: 'chart-bar' },
  { value: ChartType.Summary, iconName: 'chart-donut' },
];

const ExpensesChart: React.FC<ExpensesChartProps> = (props: ExpensesChartProps) => {

  const { containerStyle, monthDailyData, monthCategoryData, year, month } = props;
  const [chartType, setChartType] = React.useState<ChartType>(ChartType.Daily);

  return (

    <Card style={[styles.container, containerStyle]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Money flow</Text>
        <View 
        style={styles.switchContainer}
        >
          <IconToggleSwitch
            initialValue={ChartType.Daily}
            onValueChange={(value) => setChartType(value as ChartType)}
            options={chartTypeOptions}
            iconSize={15}
            style={{height: 22}}
          />
        </View>
      </View>
      {chartType === ChartType.Daily ? (
        <DailyBarChart monthData={monthDailyData} year={year} month={month} />
      ) : (
        <SummaryPieChart monthData={monthCategoryData} />
      )}
    </Card>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    backgroundColor: appColors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  headerText: {
    flex: 1,
    fontSize: 13,
    fontWeight: 'bold',
    color: appColors.widgetHeaderText,
  },
  switchContainer: {
    width: 100,
  },
});

export default ExpensesChart;