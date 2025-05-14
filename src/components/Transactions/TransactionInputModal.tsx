import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text, Button, IconButton } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import 'react-native-get-random-values';
import { v7 as uuidv7 } from 'uuid';
import { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from '@gorhom/bottom-sheet';
import CategorySelector from '../CategorySelector/CategorySelector';
import { categories } from '../../consts/categories';
import { appColors } from '../../consts/colors';
import { BalanceType } from '../../screens/HomeScreen';
import { InputOutline } from 'react-native-input-outline';


export interface TransactionItem {
  id: string;
  category: typeof categories[number];
  title: string;
  amount: number;
  date: Date;
}

export interface TransactionInputModalProps {
  visible: boolean;
  transactionType: BalanceType,
  inputTransactionText?: string;
  onDismiss: () => void;
  onSave: (transaction: TransactionItem, transactionType: BalanceType) => void;
}

const container_padding = 16;
const defaultCategoryIndex = 1;

const TransactionInputModal: React.FC<TransactionInputModalProps> = ({ 
  visible,
  transactionType, 
  inputTransactionText = "Add income", 
  onDismiss, 
  onSave }) => {

  const [selectedCategory, setSelectedCategory] = useState(categories && categories[defaultCategoryIndex]);
  const [title, setTitle] = useState('');
  const [titleError, setTitleError] = useState<string | undefined>(undefined);
  const [amount, setAmount] = useState('');
  const [amountError, setAmountError] = useState<string | undefined>(undefined);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // Memoize input handlers to prevent unnecessary re-renders
  const handleTitleChange = useCallback((text: string) => {
    if (titleError) {
      setTitleError(undefined);
    }
    setTitle(text);
  }, [titleError]);

  const handleAmountChange = useCallback((text: string) => {
    if (amountError) {
      setAmountError(undefined);
    }
    setAmount(text);
  }, [amountError]);

  const handleDateFocus = useCallback(() => {
    setShowDatePicker(true);
  }, []);

  const resetForm = useCallback(() => {
    setTitle('');
    setAmount('');
    setDate(new Date());
    setSelectedCategory(categories[defaultCategoryIndex]);
    setShowDatePicker(false);
    setTitleError(undefined);
    setAmountError(undefined);
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
    
    let isValid = true

    const validationHandlers = [() => isTitleValid(title), () => isAmountValid(amount)];

    validationHandlers.forEach((handler) => {
      if (!handler()) {
        isValid = false;
      }
    });

    if (!isValid) {
      return;
    }

    let transactionItem = {
      id: uuidv7(),
      category: selectedCategory,
      title,
      amount: parseFloat(amount),
      date,
    }

    onSave(transactionItem, transactionType);

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

  const isTitleValid = (value: string): boolean => {

    if (value.trim() === '') {  
      setTitleError('Transaction name cannot be empty');
      return false;
    }
    setTitleError(undefined); 
    return true;

  }

  const isAmountValid = (value: string): boolean => {

    const numericRegex = /^[0-9]*\.?[0-9]*$/;
    if (value === '') {
      setAmountError('Amount cannot be empty');
      return false;
    } else if (!numericRegex.test(value)) {
      setAmountError('Invalid amount format');
      return false;
    } else {
      setAmountError(undefined);
      return true;
    }

  }

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
              <View style={{ height: categoriesItemHeight }}>
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

                <InputOutline
                  value={title}
                  error={titleError}
                  onChangeText={handleTitleChange}
                  placeholder="Transaction name"
                  activeColor={appColors.black}
                  paddingVertical={5}
                  inactiveColor={appColors.lighGery}
                  style={styles.textInput}
                  multiline={false}
                />

                <InputOutline
                  value={amount}
                  error={amountError}
                  onChangeText={handleAmountChange} // Ensure this uses the updated handler
                  placeholder="Amount"
                  activeColor={appColors.black}
                  paddingVertical={5}
                  inactiveColor={appColors.lighGery}
                  style={styles.textInput}
                  keyboardType='numeric'
                />

                <InputOutline
                  value={formatDate(date)}
                  onChangeText={handleAmountChange}
                  placeholder="Date"
                  activeColor={appColors.black}
                  paddingVertical={5}
                  inactiveColor={appColors.lighGery}
                  style={styles.textInput}
                  onPressIn={handleDateFocus}
                  trailingIcon={() => <IconButton icon="calendar" onPress={handleDateFocus} />}
                />

                {showDatePicker && (<DateTimePicker value={date} mode="date" display="default" onChange={handleDateChange} />)}
              </View>

              <Button mode="contained" onPress={handleSave} contentStyle={styles.saveButtonContent} style={styles.saveButton} labelStyle={styles.saveButtonLabel}>{inputTransactionText}</Button>
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
    marginTop: 30,
    marginBottom: 22,
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
    marginTop: 16,
    color: appColors.black,
  },
  inputContainer:
  {
    width: '100%',
    marginBottom: 16,
  },
  textInput:
  {
    marginBottom: 22,
    //height: 45,
    color: appColors.lighGery
  },
  currencySymbol: {
    fontSize: 16,
    marginRight: 8,
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
    backgroundColor: appColors.white,
  },
  saveButtonContent:
  {
    backgroundColor: appColors.widgetGradien2,
    height: 50
  },
  saveButtonLabel:
  {
    fontSize: 16,
    padding: 4,
    color: appColors.white
  },
});

export default TransactionInputModal;