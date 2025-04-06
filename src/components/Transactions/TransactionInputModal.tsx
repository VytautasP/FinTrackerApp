import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, Dimensions, FlatList } from 'react-native';
import { Text, Button, TextInput, Avatar, IconButton, Surface, TouchableRipple } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { v4 as uuidv4 } from 'uuid';
import { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from '@gorhom/bottom-sheet';

const categories : CategoryItem[] = [
    { id: '1', name: 'Shopping', icon: 'basket', color: '#FFCDD2' },
    { id: '2', name: 'Entertainment', icon: 'movie', color: '#E1BEE7' },
    { id: '3', name: 'Location', icon: 'map-marker', color: '#BBDEFB' },
    { id: '4', name: 'Food', icon: 'food', color: '#FFE0B2' },
    { id: '5', name: 'Transport', icon: 'car', color: '#C8E6C9' },
    { id: '6', name: 'Transport', icon: 'car', color: '#C8E6C9' },
    { id: '7', name: 'Transport', icon: 'car', color: '#C8E6C9' },
    { id: '8', name: 'Transport', icon: 'car', color: '#C8E6C9' },
];

// Define the type for the category item
interface CategoryItem {
    id: string;
    name: string;
    icon: string;
    color: string;
}

export interface TransactionItem {
    id: string;
    category: typeof categories[number];
    title: string;
    amount: number;
    date: Date;
}

export interface TransactionInputModalProps {
    visible: boolean;
    onDismiss: () => void;
    onSave: (transaction:
        {
            id: string;
            category: typeof categories[number];
            title: string;
            amount: number;
            date: Date;
        }
    ) => void;
}

const TransactionInputModal: React.FC<TransactionInputModalProps> = ({ visible, onDismiss, onSave }) => {

    const [selectedCategory, setSelectedCategory] = useState(categories[0]);
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const resetForm = useCallback(() => {
        setTitle('');
        setAmount('');
        setDate(new Date());
        setSelectedCategory(categories[0]);
        setShowDatePicker(false);
      }, []);

    const formatDate = (date: Date) => {
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();
        const today = new Date();
        const isToday =
            day === today.getDate() &&
            month === today.toLocaleString('default', { month: 'short' }) &&
            year === today.getFullYear();

        return `${day} ${month}, ${year}${isToday ? ' (Today)' : ''}`;
    };

    const handleDateChange = (event: any, selectedDate: any) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setDate(selectedDate);
        }
    };

    const handleSave = () => {
        if (title.trim() === '' || amount.trim() === '') {
            return;
        }

        onSave({
            id: uuidv4(),
            category: selectedCategory,
            title,
            amount: parseFloat(amount),
            date,
        });

        resetForm();
        onDismiss();
    };

    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    // callbacks
    const handleSheetChanges = useCallback((index: number) => {
        console.log('handleSheetChanges', index);
    }, []);

    const handleModalDismiss = useCallback(() => {
      resetForm();
      onDismiss();
    }, [onDismiss, resetForm]);

    useEffect(() => {

        if (visible) {
            bottomSheetModalRef.current?.present();
        } else {
            bottomSheetModalRef.current?.dismiss();
            resetForm();
        }
    }, [visible, resetForm]);


    const InstantBackdrop = useCallback(
        (props: BottomSheetBackdropProps) => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
                opacity={0.8} 
                pressBehavior="close"
                enableTouchThrough={false}
                style={[
                    props.style,
                    {
                        backgroundColor: 'rgba(78, 72, 72, 0.83)',
                        opacity: 0.8
                    }
                ]}
            />
        ),
        []
    ); 
    
  const windowWidth = Dimensions.get('window').width;
  const categoryItemWidth = 300;

  const renderCategoryItem = ({ item, index }: { item: CategoryItem; index: number }) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.categoryItem, selectedCategory.id === item.id && styles.selectedCategory]} onPress={() => setSelectedCategory(item)}>
      <Avatar.Icon size={50} icon={item.icon} style={{ backgroundColor: item.color }} color="#000" />
    </TouchableOpacity>
  );

  const flatListRef = useRef<FlatList>(null);

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
          viewOffset: (windowWidth - categoryItemWidth) / 2,
      });
  });
};

    return (

        <BottomSheetModalProvider>
            <BottomSheetModal
                ref={bottomSheetModalRef}
                onChange={handleSheetChanges}
                onDismiss={handleModalDismiss}
                backdropComponent={InstantBackdrop}
            >
                <BottomSheetView style={{height: Dimensions.get('window').height * 0.71}}>

                    <View style={styles.container}>
                        <View style={styles.topSection} >
                        
                          {/* <View style={styles.scrollContainer}>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryContainer}>
                              {
                                categories.map((category) => (
                                    <TouchableOpacity
                                        key={category.id}
                                        style={[styles.categoryItem, selectedCategory.id === category.id && styles.selectedCategory]} onPress={() => setSelectedCategory(category)}>
                                        <Avatar.Icon size={50} icon={category.icon} style={{ backgroundColor: category.color }} color="#000" />
                                    </TouchableOpacity>
                                ))
                              }
                            </ScrollView>
                          </View> */}
                          <Surface style={styles.container} elevation={0}>
      <FlatList
        ref={flatListRef}
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        initialNumToRender={3}
        maxToRenderPerBatch={3}
        windowSize={3}
        getItemLayout={(data, index) => ({
          length: categoryItemWidth,
          offset: categoryItemWidth * index,
          index,
        })}
        onScrollToIndexFailed={onScrollToIndexFailed}
        contentContainerStyle={styles.scrollViewContent}
      />
    </Surface>
                          <Text style={styles.categoryTitle}>{selectedCategory.name}</Text>
                          <View style={styles.flexSpacer} />
                        </View>

                        <View style={styles.bottomSection}>
                          <View style={styles.inputContainer}>
                            <TextInput
                                mode="outlined"
                                label="Title"
                                value={title}
                                onChangeText={setTitle}
                                style={styles.input}
                            />

                            <TextInput
                                mode="outlined"
                                label="Amount"
                                value={amount}
                                onChangeText={setAmount}
                                keyboardType="numeric"
                                style={styles.input}
                                left={<TextInput.Affix text="€" />}
                            />

                            <TextInput
                              mode="outlined"
                              label="Date"
                              value={formatDate(date)}
                              style={styles.input}
                              right={<TextInput.Icon icon="calendar" />}
                              onFocus={() => setShowDatePicker(true)}
                              />

                            {showDatePicker && (<DateTimePicker value={date} mode="date" display="default" onChange={handleDateChange} />)}
                          </View>

                        <Button mode="contained" onPress={handleSave} style={styles.saveButton} labelStyle={styles.saveButtonLabel}>Add income</Button>
                      </View>
                    </View>
                </BottomSheetView>
            </BottomSheetModal>
        </BottomSheetModalProvider>
    );
};

const styles = StyleSheet.create({

container:
{
  flex: 1,
  width: '100%',
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  paddingHorizontal: 16,
  flexDirection: 'column', // Ensure vertical layout
},
scrollViewContent: {
  paddingHorizontal: 16,
},
topSection:
{
   flex: 1,
   width: '100%',
   alignItems: 'center',
},
scrollContainer: {
    borderWidth: 1,
    width: '100%', // Make sure container takes full width
    height: 200,
    padding: 8
  },
bottomSection:
{
  width: '100%',
  marginBottom: 24, 
},
flexSpacer: 
{
  flex: 1,
},
categoryContainer:
{
  paddingTop: 60,
  paddingHorizontal: 8,
},
categoryItem:
{
  alignItems: 'center',
  marginHorizontal: 12,
  width: 60,
},
selectedCategory:
{
  transform: [{ scale: 2 }],
},
categoryName:
{
  fontSize: 12,
  marginTop: 4,
  textAlign: 'center',
},
categoryTitle:
{
  fontSize: 18,
  fontWeight: 'bold',
  marginBottom: 16,
},
inputContainer:
{
  width: '100%',
  marginBottom: 16,
},
input:
{
  marginBottom: 12,
},
dateContainer: 
{
  width: '100%',
},
dateLabel: 
{
  fontSize: 12,
  color: '#666',
  marginLeft: 8,
  marginBottom: 4,
},
dateSelector: 
{
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderWidth: 1,
  borderColor: '#E0E0E0',
  borderRadius: 4,
  paddingHorizontal: 12,
  paddingVertical: 8,
},
saveButton: 
{
  width: '100%',
  padding: 4,
  borderRadius: 8,
  marginTop: 16,
},
saveButtonLabel: 
{
  fontSize: 16,
  padding: 4,
},
});

export default TransactionInputModal;