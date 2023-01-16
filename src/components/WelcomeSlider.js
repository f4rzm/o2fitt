import React , {memo} from "react"
import {View , Text , TouchableOpacity , StyleSheet, ActivityIndicator , Animated, I18nManager, Platform} from "react-native"
import { moderateScale } from "react-native-size-matters"
import { defaultTheme } from "../constants/theme"
import { WelcomeRow , ConfirmButton } from "../components";
import { dimensions } from "../constants/Dimensions";

const WelcomeSlider = props =>{
    const viewPagerRef = React.createRef()
    let offset = React.useRef(new Animated.Value(0)).current
    const [activeIndex , setActiveIndex] = React.useState(0)
    const tr = I18nManager.isRTL ?
     Platform.OS === "android"?
    offset.interpolate({
        inputRange : [
            0,
            dimensions.WINDOW_WIDTH,
            dimensions.WINDOW_WIDTH * 2,
            dimensions.WINDOW_WIDTH * 3,
            dimensions.WINDOW_WIDTH * 4,
            dimensions.WINDOW_WIDTH * 5,
        ],
        outputRange : [
            -((styles.dot.marginHorizontal * 2) + (styles.dot.width)) * 4,
            -((styles.dot.marginHorizontal * 2) + (styles.dot.width)) * 3,
            -((styles.dot.marginHorizontal * 2) + (styles.dot.width)) * 2,
            -((styles.dot.marginHorizontal * 2) + (styles.dot.width)),
            0,
            ((styles.dot.marginHorizontal * 2) + (styles.dot.width)),
        ]
    }):
    offset.interpolate({
        inputRange : [
            0,
            dimensions.WINDOW_WIDTH,
            dimensions.WINDOW_WIDTH * 2,
            dimensions.WINDOW_WIDTH * 3,
            dimensions.WINDOW_WIDTH * 4,
            dimensions.WINDOW_WIDTH * 5,
        ],
        outputRange : [
            0,
            -((styles.dot.marginHorizontal * 2) + (styles.dot.width)),
            -((styles.dot.marginHorizontal * 2) + (styles.dot.width)) * 2,
            -((styles.dot.marginHorizontal * 2) + (styles.dot.width)) * 3,
            -((styles.dot.marginHorizontal * 2) + (styles.dot.width)) * 4,
            -((styles.dot.marginHorizontal * 2) + (styles.dot.width)) * 5
        ]
    }):
    offset.interpolate({
        inputRange : [
            0,
            dimensions.WINDOW_WIDTH,
            dimensions.WINDOW_WIDTH * 2,
            dimensions.WINDOW_WIDTH * 3,
            dimensions.WINDOW_WIDTH * 4,
            dimensions.WINDOW_WIDTH * 5,
        ],
        outputRange : [
            0,
            ((styles.dot.marginHorizontal * 2) + (styles.dot.width)),
            ((styles.dot.marginHorizontal * 2) + (styles.dot.width)) * 2,
            ((styles.dot.marginHorizontal * 2) + (styles.dot.width)) * 3,
            ((styles.dot.marginHorizontal * 2) + (styles.dot.width)) * 4,
            ((styles.dot.marginHorizontal * 2) + (styles.dot.width)) * 4,
        ]
    })
   
    const onViewableItemsChanged = (event) =>{
        console.log(event)
        if(event && event.viewableItems.length === 1 && event.viewableItems[0].index != this.state.viewableItem){
            
            setActiveIndex(event.viewableItems[0].index)
        }
    }

    return(
        <View style={styles.container}>
            <Animated.FlatList
                data={props.items}
                ref={viewPagerRef}
                style={styles.viewPager} 
                keyExtractor={(item , index)=>index.toString()}
                onScroll={Animated.event([{nativeEvent:{contentOffset :{x : offset}}}],{useNativeDriver:true})} 
                showsHorizontalScrollIndicator={false}
                disableIntervalMomentum={true}
                viewabilityConfig={{viewAreaCoveragePercentThreshold: 100}}
                // onViewableItemsChanged={onViewableItemsChanged}
                horizontal
                pagingEnabled
                renderItem={({item , index}) =>{
                        return(
                            <WelcomeRow
                                item={item}
                                key={index.toString()}
                                lang={props.lang}
                                activeIndex={activeIndex}
                                index={index}
                            />
                        )
                    }
                }
                
            />
            <View style={styles.indicatorContainer}>
                <Animated.View
                    style={[styles.indicator , {transform : [{translateX : tr}]}]}
                />
                {
                    props.items.map((item , index) =>{
                        return(
                            <View
                                style={styles.dot}
                                key={index.toString()}
                            />
                        )
                    })
                }
            </View>
            <ConfirmButton
                style={styles.button}
                lang={props.lang}
                title={props.lang.go}
                onPress={props.onNext}
                rightImage={require("../../res/img/next.png")}
                rotate
            />
        </View>
        
    )
}

const styles = StyleSheet.create({
    container : {
        flex:1,
        alignItems : "center"
    },
    viewPager : {
        flex : 1,
    },
    indicatorContainer : {
        flexDirection : "row",
        justifyContent : "center",
        alignItems : "center",
        height : 18,
        marginVertical : 20,
    },
    dot : {
        width : 10,
        height : 10,
        borderRadius : 5,
        backgroundColor : defaultTheme.lightGray,
        marginHorizontal : 10
    },
    indicator : {
        position : "absolute",
        top :0,
        left : 6,
        width : 18,
        height : 18,
        borderRadius :10,
        borderWidth : 1.2,
        borderColor : defaultTheme.error
    },
    button : {
        width : 150,
        borderRadius : 25,
        marginBottom : 30
    }
})

export default memo(WelcomeSlider)