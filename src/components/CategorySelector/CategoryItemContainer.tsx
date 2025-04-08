import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { Avatar } from 'react-native-paper';
import { CategoryItem } from '../../consts/categories';

interface CategoryItemProps {
    item: CategoryItem;
    itemHeight: number;
    isSelected: boolean;
    onPress?: (item: CategoryItem) => void;
}

const CategoryItemContainer : React.FC<CategoryItemProps> = (props: CategoryItemProps) => {

    const { item, itemHeight, isSelected, onPress } = props;
    
    //calculate transform scale based on the itemHeight
    const scale = itemHeight / 55; // Assuming the original height is 100
    const transformStyle = { transform: [{ scale }] };

    return (

        <View style={sytles.container}>
            <View style={[sytles.content, { height: itemHeight }]}>
                <TouchableOpacity style={isSelected ? transformStyle : {}} onPress={() => onPress && onPress(item)}>
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
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: "100%"
    },
})

export default CategoryItemContainer;