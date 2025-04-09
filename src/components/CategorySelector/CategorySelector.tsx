import React, { useRef } from 'react'
import { View, SafeAreaView, StyleSheet, Dimensions } from 'react-native'
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
import CategoryItemContainer from './CategoryItemContainer';
import { CategoryItem } from '../../consts/categories';

const window = Dimensions.get("window");
const defaultHeight = 100;

interface CategorySelectorProps {
    padding: number;
    height?: number;
    categories: CategoryItem[];
    selectedCategory: CategoryItem;
    onCategorySelected: (category: CategoryItem) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = (props) => {
    const { padding, height, categories, selectedCategory, onCategorySelected } = props;
    const carouselRef = useRef<ICarouselInstance>(null);

    const baseOptions = {
        parallaxScrollingOffset: 225,
        parallaxScrollingScale: 1,
        parallaxAdjacentItemScale: 1,
    }

    const handleCategoryItemPress = (category: CategoryItem) => {
        const index = categories.findIndex((item) => item.id === category.id);
        if (carouselRef.current) {
            carouselRef.current.scrollTo({ index, animated: true });
        }
        onCategorySelected(category);
    }

    const handleSnapToItem = (index: number) => {
        const category = categories[index];
        if (category.id !== selectedCategory.id) {
            onCategorySelected(category);
        }
    }

    const bandHeight = height ?? defaultHeight;
    const selectedIndex = categories.findIndex((item) => item.id === selectedCategory.id);

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Carousel
                    ref={carouselRef}
                    loop={false}
                    autoPlay={false}
                    width={window.width - 2 * padding}
                    defaultIndex={selectedIndex}
                    height={bandHeight}
                    data={categories}
                    mode="parallax"
                    modeConfig={baseOptions}
                    onSnapToItem={handleSnapToItem}
                    renderItem={({ item }) => 
                      <CategoryItemContainer 
                        item={item} 
                        itemHeight={bandHeight} 
                        isSelected={item.id === selectedCategory.id}
                        onPress={handleCategoryItemPress}
                      />
                    }
                />
            </View>
        </SafeAreaView> 
    )
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
})

export default React.memo(CategorySelector);