import React, { useRef, useState } from 'react'
import { View, SafeAreaView, StyleSheet, Dimensions } from 'react-native'
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
import CategoryItemContainer, { CategoryItem } from './CategoryItemContainer';



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

const window = Dimensions.get("window");
const bandHeight = 100;
const defaultSelectedIndex = 1;

interface CarouselTestCompProps {
    padding: number;
}

const  CategorySelector : React.FC<CarouselTestCompProps> = (props: CarouselTestCompProps) =>
{
   const [selectedCategory, setSelectedCategory] = useState(categories[defaultSelectedIndex]);

    const { padding } = props;
    const carouselRef = useRef<ICarouselInstance>(null);

    const baseOptions = {
        parallaxScrollingOffset: 225,
        parallaxScrollingScale: 1,
        parallaxAdjacentItemScale: 1,
    }

    const handleCategorySelection = (category: CategoryItem) => {
        setSelectedCategory(category);

        const index = categories.findIndex((item) => item.id === category.id);
        if (carouselRef.current) {
            carouselRef.current.scrollTo({ index, animated: true });
        }
    }

    return (
        <SafeAreaView style={styles.safeArea}>

            <View style={styles.container}>
                
                <Carousel
                    ref={carouselRef}
                    loop={false}
                    autoPlay={false}
                    width={window.width - 2 * padding}
                    defaultIndex={defaultSelectedIndex}
                    height={100}
                    data={categories} 
                    style={{backgroundColor: 'green'}}
                    mode="parallax"
                    modeConfig={baseOptions}
                    onSnapToItem={(index) => {setSelectedCategory(categories[index]);}}
                    renderItem={({ item, index, animationValue }) => 
                      <CategoryItemContainer 
                        item={item} 
                        itemHeight={bandHeight} 
                        isSelected={item.id === selectedCategory.id}
                        onPress={handleCategorySelection}
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
        height: bandHeight,
        borderWidth: 2
    },
})

export default CategorySelector;