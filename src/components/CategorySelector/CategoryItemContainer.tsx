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
    
    const scale = itemHeight / 60;
    const transformStyle = { transform: [{ scale }] };

    return (
        <View style={sytles.container}>
            <View style={[sytles.content, { height: itemHeight }]}>
                <TouchableOpacity 
                    style={[
                        isSelected ? transformStyle : {}
                    ]} 
                    onPress={() => onPress && onPress(item)}
                >
                  <Avatar.Icon 
                    size={50} 
                    icon={item.icon} 
                    style={[
                        { backgroundColor: item.color },
                        isSelected ? sytles.selectedAvatar : {}
                    ]} 
                    color="#000" 
                  />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const sytles = StyleSheet.create({
    container: {
        alignSelf: 'center',
        height: "100%",
        width: 180
    },
    content: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: "100%"
    },
    selectedAvatar: {
        elevation: 5,     // Add shadow on Android
        shadowColor: '#000', // Shadow for iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    }
})

export default React.memo(CategoryItemContainer, (prevProps, nextProps) => {
    // Only re-render if these props change
    return prevProps.isSelected === nextProps.isSelected && 
           prevProps.itemHeight === nextProps.itemHeight &&
           prevProps.item.id === nextProps.item.id;
});