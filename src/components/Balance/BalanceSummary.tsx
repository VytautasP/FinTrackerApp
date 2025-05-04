import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Surface, Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { appColors } from '../../consts/colors';
import { formatNumber } from '../../helpers/numberUtils';

interface BalanceSummaryProps {
    containerStyle?: ViewStyle;
    income?: number;
    expense?: number;
}

const BalanceSummary : React.FC<BalanceSummaryProps> = (props: BalanceSummaryProps) => {

    const { containerStyle, income, expense } = props;

  return (
    <Surface style={[styles.container, containerStyle]}>
      <View style={styles.row}>
        {/* Income Section */}
        <View style={styles.item}>
          <View style={[styles.iconContainer, { backgroundColor: '#E6F7F0' }]}>
            <Icon 
              name="plus" 
              size={20} 
              color={appColors.incomeBar}
            />
          </View>
          <View style={styles.textContainer}>
            <Text variant="titleLarge" style={styles.amount}>€ {formatNumber(income ?? 0)}</Text>
            <Text variant="bodyMedium" style={styles.label}>Income</Text>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Expenses Section */}
        <View style={styles.item}>
          <View style={[styles.iconContainer, { backgroundColor: '#FEECEF' }]}>
            <Icon 
              name="minus" 
              size={20} 
              color={appColors.expenseBar}
            />
          </View>
          <View style={styles.textContainer}>
            <Text variant="titleLarge" style={styles.amount}>€{formatNumber(expense ?? 0)}</Text>
            <Text variant="bodyMedium" style={styles.label}>Expenses</Text>
          </View>
        </View>
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    marginVertical: 8,
    elevation: 0,
    backgroundColor: 'white',
    borderWidth: 0.5,
    borderColor: '#EFEFEF',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flexDirection: 'column',
  },
  amount: {
    fontWeight: '700',
    fontSize: 16,
  },
  label: {
    color: '#757575',
    fontSize: 14,
  },
  divider: {
    width: 1,
    height: '70%',
    backgroundColor: '#E0E0E0', 
    marginHorizontal: 20,
  },
});

export default BalanceSummary;