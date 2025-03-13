import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { appColors } from '../../consts/colors';

const button_icon_size = 13;

const BalanceCard : React.FC = () => {
  return (
    <Card style={styles.balanceCard}>
      <Card.Content style={styles.balanceCardContent}>
        <LinearGradient
          colors={['#3c8ae1', '#1c59cd']}
          style={styles.gradientBackground}
        >
          <Text variant="headlineLarge" style={styles.balanceText}>
            $5,000
          </Text>
          <Text variant="bodySmall" style={styles.cardSubtitle}>
            total month balances
          </Text>
        </LinearGradient>
      </Card.Content>
      <Card.Actions style={styles.balanceCardActions}>
        <View style={styles.buttonContainer}>
          <Button mode="text"
            icon={({ size, color }) => (
              <Icon name="plus-circle" size={button_icon_size} color={appColors.addIcon} />
            )}
            style={styles.smallButton} contentStyle={styles.smallButtonContent} labelStyle={styles.smallButtonLabel} onPress={() => { }}
          >Add incomes</Button>
          <View style={styles.verticalDivider} />
          <Button
            icon={({ size, color }) => (
              <Icon name="minus-circle" size={button_icon_size} color={appColors.removeIcon} />
            )}
            mode="text" style={styles.smallButton} contentStyle={styles.smallButtonContent} labelStyle={styles.smallButtonLabel} onPress={() => { }}
          >Add expense</Button>
        </View>
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  smallButton: {
    borderRadius: 8,
    margin: 4,
    minWidth: 120
  },
  smallButtonContent: {
    height: 27
  },
  smallButtonLabel: {
    fontSize: 11,
    marginVertical: 0,
    color: appColors.mainWidgetButtonsText
  },
  verticalDivider: {
    height: 24,
    width: 1,
    backgroundColor: '#CCCCCC',
    marginHorizontal: 12,
  },
  balanceCard: {
    marginBottom: 16,
    borderRadius: 20,
    height: 140,
    backgroundColor: appColors.white,
  },
  balanceCardContent: {
    borderRadius: 20,
    padding: 0,
    margin: 0,
    height: '73%'
  },
  balanceCardActions: {
    borderRadius: 20,
    height: '27%',
    padding: 0
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    position: 'relative',
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
    justifyContent: 'center',
  },
  cardSubtitle: {
    textAlign: 'center',
    color: appColors.subTitleText,
    fontWeight: 'bold',
  },
  balanceText: {
    textAlign: 'center',
    color: appColors.white,
    fontWeight: 'bold',
  },
});

export default BalanceCard;
