import React, { useEffect, useRef, useState } from 'react'
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
    defaultSelectedIndex: number;
    onCategorySelected?: (category: CategoryItem) => void;
}

const  CategorySelector : React.FC<CategorySelectorProps> = (props: CategorySelectorProps) =>
{
    const { padding, height, categories, defaultSelectedIndex, onCategorySelected } = props;

    const [selectedCategory, setSelectedCategory] = useState(categories && categories[defaultSelectedIndex]);
    const carouselRef = useRef<ICarouselInstance>(null);

    const baseOptions = {
        parallaxScrollingOffset: 225,
        parallaxScrollingScale: 1,
        parallaxAdjacentItemScale: 1,
    }

    const handleCategoryItemPress = (category: CategoryItem) => {
        setSelectedCategory(category);

        const index = categories.findIndex((item) => item.id === category.id);
        if (carouselRef.current) {
            carouselRef.current.scrollTo({ index, animated: true });
        }

        onCategorySelected && onCategorySelected(category);
    }

    const handleSnapToItem = (index: number) => {
        const category = categories[index];
        setSelectedCategory(categories[index]);
        onCategorySelected && onCategorySelected(category);
    }

    const bandHeight = height ?? defaultHeight;

    useEffect(() => {
      console.log('CategorySelector mounted')
      console.log('Band Height: ', bandHeight)
    })

    return (
        <SafeAreaView style={styles.safeArea}>

            <View style={styles.container}>
                
                <Carousel
                    ref={carouselRef}
                    loop={false}
                    autoPlay={false}
                    width={window.width - 2 * padding}
                    defaultIndex={defaultSelectedIndex}
                    height={bandHeight}
                    data={categories} 
                    //style={{backgroundColor: 'green'}}
                    mode="parallax"
                    modeConfig={baseOptions}
                    onSnapToItem={handleSnapToItem}
                    renderItem={({ item, index, animationValue }) => 
                      <CategoryItemContainer 
                        item={item} 
                        itemHeight={bandHeight} 
                        isSelected={item.id === selectedCategory.id}
                        onPress={handleCategoryItemPress}
                        />
                    }
                    >
                </Carousel>
               
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

export default CategorySelector;