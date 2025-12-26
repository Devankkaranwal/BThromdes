import { useRef, useState } from 'react';
import { View, StyleSheet, Image, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const images = [
    require('../assets/images/pimage.webp'),
];

const ImageCarousel = () => {
    const { theme, wp, hp, RFValue } = useTheme();
    const screenWidth = Dimensions.get('window').width;
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollViewRef = useRef(null);

    const styles = StyleSheet.create({
        carouselContainer: {
            width: wp(90),
            height: hp(25),
            alignSelf: 'center',
            borderWidth: wp(0.2),
            borderColor: theme.primary,
            borderRadius: RFValue(5),
            backgroundColor: 'white',
        },
        imageContainer: {
            width: wp(100) * 0.9,
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
        },
        image: {
            width: '100%',
            height: '100%',
            borderRadius: RFValue(5),
        },
        dotsContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: hp(1)
        },
        dot: {
            width: RFValue(6),
            height: RFValue(6),
            borderRadius: RFValue(5),
            backgroundColor: theme.grayLight,
            marginHorizontal: RFValue(2),
        },
        activeDot: {
            backgroundColor: theme.transparent,
        },
    });

    const onScroll = (event) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const newIndex = Math.round(contentOffsetX / (screenWidth * 0.9));
        setCurrentIndex(newIndex);
    };

    const handleDotPress = (index) => {
        scrollViewRef.current.scrollTo({ x: index * (screenWidth * 0.9), animated: true });
        setCurrentIndex(index);
    };

    return (
        <View style={styles.carouselContainer}>
            <ScrollView
                ref={scrollViewRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={onScroll}
                scrollEventThrottle={16}
            >
                {images.map((image, index) => (
                    <View key={index} style={styles.imageContainer}>
                        <Image source={image} style={styles.image} resizeMode="cover" />
                    </View>
                ))}
            </ScrollView>
            <View style={styles.dotsContainer}>
                {images.map((_, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.dot,
                            index === currentIndex && styles.activeDot,
                        ]}
                        onPress={() => handleDotPress(index)}
                    />
                ))}
            </View>
        </View>
    );
};

export default ImageCarousel;
