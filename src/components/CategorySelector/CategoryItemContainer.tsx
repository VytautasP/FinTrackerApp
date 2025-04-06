import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { Avatar } from 'react-native-paper';

export interface CategoryItem {
    id: string;
    name: string;
    icon: string;
    color: string;
}

interface CategoryItemProps {
    item: CategoryItem;
    itemHeight: number;
    isSelected: boolean;
    onPress?: (item: CategoryItem) => void;
}

const CategoryItemContainer : React.FC<CategoryItemProps> = (props: CategoryItemProps) => {

    const { item, itemHeight, isSelected, onPress } = props;

    return (

        <View style={sytles.container}>
            <View style={[sytles.content, { height: itemHeight }]}>
                <TouchableOpacity style={isSelected ? sytles.selectedCategory : {}} onPress={() => onPress && onPress(item)}>
                  <Avatar.Icon size={50} icon={item.icon} style={[{ backgroundColor: item.color }]} color="#000" />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const sytles = StyleSheet.create({
    container: {
        alignSelf: 'center',
        height: "100%",
        width: 150
    },
    content: {
        backgroundColor: 'red',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: "100%"
    },
    text: {
        color: 'white',
    },
    selectedCategory: {
        transform: [{ scale: 1.6 }],
      },
})

export default CategoryItemContainer;