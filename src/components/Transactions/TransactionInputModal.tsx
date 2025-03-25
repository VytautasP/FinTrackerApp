import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { Text, Button, TextInput, Avatar, IconButton } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { v4 as uuidv4 } from 'uuid';
import { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from '@gorhom/bottom-sheet';

const categories = [
    { id: '1', name: 'Shopping', icon: 'basket', color: '#FFCDD2' },
    { id: '2', name: 'Entertainment', icon: 'movie', color: '#E1BEE7' },
    { id: '3', name: 'Location', icon: 'map-marker', color: '#BBDEFB' },
    { id: '4', name: 'Food', icon: 'food', color: '#FFE0B2' },
    { id: '5', name: 'Transport', icon: 'car', color: '#C8E6C9' },
];

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

        // Reset form
        setTitle('');
        setAmount('');
        setDate(new Date());
        onDismiss();
    };

    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    // callbacks
    const handleSheetChanges = useCallback((index: number) => {
        console.log('handleSheetChanges', index);
    }, []);


    useEffect(() => {

        if (visible) {
            bottomSheetModalRef.current?.present();
        } else {
            bottomSheetModalRef.current?.dismiss();
        }
    }, [visible]);


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

    return (


        <BottomSheetModalProvider>

            <BottomSheetModal
                ref={bottomSheetModalRef}
                onChange={handleSheetChanges}
                onDismiss={onDismiss}
                backdropComponent={InstantBackdrop}
            >
                <BottomSheetView style={{height: Dimensions.get('window').height * 0.71}}>
                    <View style={styles.surface}>

                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryContainer}>
                            {
                                categories.map((category) => (
                                    <TouchableOpacity
                                        key={category.id}
                                        style={[styles.categoryItem, selectedCategory.id === category.id && styles.selectedCategory]} onPress={() => setSelectedCategory(category)}>
                                        <Avatar.Icon size={50} icon={category.icon} style={{ backgroundColor: category.color }} color="#000" />
                                        <Text style={styles.categoryName}>
                                            {category.name}
                                        </Text>
                                    </TouchableOpacity>
                                ))
                            }
                        </ScrollView>

                        <Text style={styles.categoryTitle}>{selectedCategory.name}</Text>

                        <View style={styles.inputContainer}>
                            <TextInput
                                mode="outlined"
                                label="Title"
                                value={title}
                                onChangeText={setTitle}
                                style={styles.input}
                                placeholder="Sarojini dress shopping"
                            />

                            <TextInput
                                mode="outlined"
                                label="Amount"
                                value={amount}
                                onChangeText={setAmount}
                                keyboardType="numeric"
                                style={styles.input}
                                left={<TextInput.Affix text="₹" />}
                                placeholder="1,200"
                            />

                            <View style={styles.dateContainer}>
                                <Text style={styles.dateLabel}>Date</Text>
                                <TouchableOpacity style={styles.dateSelector} onPress={() => setShowDatePicker(true)}>
                                    <Text>{formatDate(date)}</Text>
                                    <IconButton icon="calendar" size={20} />
                                </TouchableOpacity>
                            </View>

                            {showDatePicker && (<DateTimePicker value={date} mode="date" display="default" onChange={handleDateChange} />)}
                        </View>


                        <Button mode="contained" onPress={handleSave} style={styles.saveButton} labelStyle={styles.saveButtonLabel}>Add income</Button>
                    </View>
                </BottomSheetView>
            </BottomSheetModal>
        </BottomSheetModalProvider>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        margin: 0,
    },
    surface: {
        width: '100%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: 30,
        paddingHorizontal: 16,
        alignItems: 'center',
    },
    dragIndicator: {
        width: 36,
        height: 4,
        backgroundColor: '#E0E0E0',
        borderRadius: 2,
        marginVertical: 8,
    },
    categoryContainer: {
        paddingVertical: 16,
        paddingHorizontal: 8,
    },
    categoryItem: {
        alignItems: 'center',
        marginHorizontal: 12,
        width: 60,
    },
    selectedCategory: {
        transform: [{ scale: 1.5 }],
    },
    categoryName: {
        fontSize: 12,
        marginTop: 4,
        textAlign: 'center',
    },
    categoryTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    inputContainer: {
        width: '100%',
        marginBottom: 16,
    },
    input: {
        marginBottom: 12,
    },
    dateContainer: {
        width: '100%',
    },
    dateLabel: {
        fontSize: 12,
        color: '#666',
        marginLeft: 8,
        marginBottom: 4,
    },
    dateSelector: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 4,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    saveButton: {
        width: '100%',
        padding: 4,
        borderRadius: 8,
        marginTop: 16,
    },
    saveButtonLabel: {
        fontSize: 16,
        padding: 4,
    },
});

export default TransactionInputModal;