import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, Dimensions, FlatList } from 'react-native';
import { Text, Button, TextInput, Avatar, IconButton, Surface, TouchableRipple } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { v4 as uuidv4 } from 'uuid';
import { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from '@gorhom/bottom-sheet';
import CategorySelector from '../CategorySelector/CategorySelector';
import { categories } from '../../consts/categories';

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

const container_padding = 16;
const defaultCategoryIndex = 1;

const TransactionInputModal: React.FC<TransactionInputModalProps> = ({ visible, onDismiss, onSave }) => {

  const [selectedCategory, setSelectedCategory] = useState(categories && categories[defaultCategoryIndex]);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const resetForm = useCallback(() => {
    setTitle('');
    setAmount('');
    setDate(new Date());
    setSelectedCategory(categories[defaultCategoryIndex]);
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

  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  const handleModalDismiss = useCallback(() => {
    resetForm();
    onDismiss();
  }, [onDismiss, resetForm]);

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

  useEffect(() => {

    if (visible) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.dismiss();
      resetForm();
    }
  }, [visible, resetForm]);
  
  const categoriesItemHeight = 130;

  return (

    <BottomSheetModalProvider>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        onChange={handleSheetChanges}
        onDismiss={handleModalDismiss}
        backdropComponent={InstantBackdrop}
      >
        <BottomSheetView style={{ height: Dimensions.get('window').height * 0.71 }}>

          <View style={styles.container}>
            <View style={styles.topSection} >
              <View style= {{height: categoriesItemHeight}}>
                <CategorySelector 
                   padding={container_padding} 
                   height={categoriesItemHeight}
                   selectedCategory={selectedCategory} 
                   categories={categories} 
                   onCategorySelected={setSelectedCategory} />
              </View>
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
    paddingHorizontal: container_padding,
    flexDirection: 'column',
  },
  topSection:
  {
    marginTop: 50,
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
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
  categoryTitle:
  {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 16
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