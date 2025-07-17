import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
//@ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { appColors } from '../../consts/colors';
import LinearGradient from 'react-native-linear-gradient';

interface ToggleOption {
  value: string;
  iconName: string;
}

interface IconToggleSwitchProps {
  options: ToggleOption[];
  onValueChange: (value: string) => void;
  initialValue: string;
  style?: ViewStyle;
  iconSize?: number;
  activeColor?: string;
  inactiveColor?: string;
  activeBackgroundColorGradient1?: string;
  activeBackgroundColorGradient2?: string;
  inactiveBackgroundColor?: string;
}

const IconToggleSwitch: React.FC<IconToggleSwitchProps> = ({
  options,
  onValueChange,
  initialValue,
  style,
  iconSize = 20,
  activeColor = appColors.white,
  inactiveColor = appColors.mainWidgetButtonsText,
  activeBackgroundColorGradient1 = appColors.widgetGradien1,
  activeBackgroundColorGradient2 = appColors.widgetGradien2,
  inactiveBackgroundColor = 'transparent',
}) => {
  const [selectedValue, setSelectedValue] = useState(initialValue);

  const handlePress = (value: string) => {
    setSelectedValue(value);
    onValueChange(value);
  };

  return (
    <View style={[styles.container, { borderColor: activeBackgroundColorGradient2 }, style]}>
      {options.map((option) => {
        const isActive = selectedValue === option.value;
        return (
          <TouchableOpacity
            key={option.value}
            onPress={() => handlePress(option.value)}
            style={styles.buttonWrapper}
          >
            {isActive ? (
              <LinearGradient
                colors={[activeBackgroundColorGradient1, activeBackgroundColorGradient2]}
                style={styles.button}
              >
                <MaterialCommunityIcons
                  name={option.iconName}
                  size={iconSize}
                  color={activeColor}
                />
              </LinearGradient>
            ) : (
              <View style={[styles.button, { backgroundColor: inactiveBackgroundColor }]}>
                <MaterialCommunityIcons
                  name={option.iconName}
                  size={iconSize}
                  color={inactiveColor}
                />
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
    height: 32,
  },
  buttonWrapper: {
    flex: 1,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
  }
});


export default IconToggleSwitch;
