import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, FlatList, Dimensions } from 'react-native';
import { Surface, Text, TouchableRipple } from 'react-native-paper';
import { appColors } from '../../consts/colors';


interface MonthSelectorProps {
    initialMonth?: Date;
    onMonthChange?: (month: Date) => void;
}

interface MonthItem {
    key: string;
    title: string;
    value: Date;
    index: number;
}


 const generateMonths = (middleDate: Date) : MonthItem[] => {
    const monthsArray = [];
    const middleYear = middleDate.getFullYear();
    const middleMonth = middleDate.getMonth();
    
    for (let i = -300; i < 300; i++) {
      const date = new Date(middleYear, middleMonth + i, 1);
      const year = date.getFullYear();
      const month = date.toLocaleString('default', { month: 'short' });
      
      monthsArray.push({
        key: `${month.toLowerCase()}${year}`,
        title: `${month} ${year}`,
        value: date,
        index: i + 300
      });
    }
    
    return monthsArray;
  };

const MonthSelector : React.FC<MonthSelectorProps>  = ( props: MonthSelectorProps) => {

  const { initialMonth = new Date(), onMonthChange } = props;

  const [months, setMonths] = useState(() => generateMonths(initialMonth));
  const [activeMonthIndex, setActiveMonthIndex] = useState(300); // Start in the middle
  const flatListRef = useRef<FlatList>(null);
  const windowWidth = Dimensions.get('window').width;
  const monthItemWidth = 100;

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index: activeMonthIndex,
        animated: false,
        viewOffset: (windowWidth - monthItemWidth) / 2,
      });
    }
  }, []);

  const handleMonthChange = (index: number) => {
    setActiveMonthIndex(index);
    if (onMonthChange) {
      onMonthChange(months[index].value);
    }
  };

  const renderMonthItem = ({ item, index }: { item: MonthItem; index: number }) => (
    <TouchableRipple
      onPress={() => handleMonthChange(index)}
      style={[
        styles.tabItem,
        activeMonthIndex === index ? styles.activeTab : styles.inactiveTab
      ]}
      rippleColor="rgba(0, 0, 0, 0.1)"
    >
      <Text 
        style={[
          styles.tabText,
          activeMonthIndex === index ? styles.activeLabel : styles.inactiveLabel
        ]}
      >
        {item.title}
      </Text>
    </TouchableRipple>
  );

  // Handle errors when scrolling to index fails
interface ScrollToIndexFailInfo {
    index: number;
    highestMeasuredFrameIndex: number;
    averageItemLength: number;
}

const onScrollToIndexFailed = (info: ScrollToIndexFailInfo) => {
    const wait = new Promise<void>(resolve => setTimeout(resolve, 500));
    wait.then(() => {
        flatListRef.current?.scrollToIndex({ 
            index: info.index, 
            animated: true,
            viewOffset: (windowWidth - monthItemWidth) / 2,
        });
    });
};

  return (
    <Surface style={styles.container} elevation={0}>
      <FlatList
        ref={flatListRef}
        data={months}
        renderItem={renderMonthItem}
        keyExtractor={(item) => item.key}
        horizontal
        showsHorizontalScrollIndicator={false}
        initialNumToRender={7}
        maxToRenderPerBatch={7}
        windowSize={7}
        getItemLayout={(data, index) => ({
          length: monthItemWidth,
          offset: monthItemWidth * index,
          index,
        })}
        onScrollToIndexFailed={onScrollToIndexFailed}
        contentContainerStyle={styles.scrollViewContent}
      />
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  scrollViewContent: {
    paddingHorizontal: 16,
  },
  tabItem: {
    width: 100,
    paddingHorizontal: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#1a73e8',
  },
  inactiveTab: {
    borderBottomWidth: 0,
  },
  tabText: {
    fontSize: 14,
  },
  activeLabel: {
    color: '#1a73e8',
    fontWeight: '600',
  },
  inactiveLabel: {
    color: appColors.secondaryText,
  },
});

export default MonthSelector;