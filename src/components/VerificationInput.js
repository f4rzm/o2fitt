import React , {PureComponent} from "react"
import {View , Text , TextInput , StyleSheet , TouchableWithoutFeedback , Animated, I18nManager, Platform} from "react-native"
import { dimensions } from "../constants/Dimensions"
import { defaultTheme } from "../constants/theme"
import { moderateScale} from "react-native-size-matters"

const CODE_LENGTH = 5;
const INPUTS_LENGTH = new Array(CODE_LENGTH).fill(0);

export class VerificationInput extends PureComponent{

    tx = new Animated.Value(0)
    handlePress = () =>{
       this._input.focus();
    }

    blur(){
        this._input.blur()
    }

    render(){
        const { value } = this.props;
        const values = value.split("");
        const selectedIndex = values.length < CODE_LENGTH ? values.length : CODE_LENGTH - 1;
        this.tx.setValue((selectedIndex * styles.inputContainer.width) + (styles.inputContainer.marginHorizontal * (2 *selectedIndex + 1)))

        return(
            <View style={[
                styles.mainContainer,
                {
                    flexDirection : I18nManager.isRTL?"row-reverse":"row"
                }
            ]}>
                
                {INPUTS_LENGTH.map((v, index) => {
                    return (
                    <TouchableWithoutFeedback onPress={this.handlePress} key={index.toString()}>
                        <View
                            style={[styles.inputContainer]}
                        >
                        <Text style={[styles.text , {fontFamily : this.props.lang.font}]} allowFontScaling={false}>{values[index] || ""}</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    );
                })}
                <Animated.View
                    style={[
                        styles.textInputContainer,
                        {
                            transform : [{
                                translateX : this.tx
                            }]
                        }
                    ]}
                >
                    <TextInput
                        value=""
                        ref={ref => this._input = ref}
                        onChangeText={this.props.onChangeText}
                        onFocus={this.handleFocus}
                        onBlur={this.handleBlur}
                        onKeyPress={this.props.handleKeyPress}
                        underlineColorAndroid='transparent'
                        keyboardType="decimal-pad"
                        style={[
                            styles.textInputStyle,
                        ]}
                    />
                </Animated.View>
            </View>
        )
    }
    
}

const styles = StyleSheet.create({
    mainContainer : {
        alignItems : "center",
        justifyContent : "center",
        alignSelf : "center",
        marginTop : moderateScale(25),
        marginBottom : 20
    },
    inputContainer : {
        width : moderateScale(45),
        height : moderateScale(45),
        alignItems : "center",
        justifyContent : "center",
        borderWidth : 1,
        borderRadius : 9,
        marginHorizontal : moderateScale(6),
        borderColor : defaultTheme.primaryColor
    },
    textInputContainer : {
        position: "absolute",
        top: 0,
        bottom: 0,
        left : 0,
        zIndex : 10,
        width : dimensions.WINDOW_WIDTH * 0.12,
    },
    textInputStyle :{
        width : dimensions.WINDOW_WIDTH * 0.12,
        textAlign : "center",
        fontSize : moderateScale(20),
        color : defaultTheme.gray,
        marginTop : Platform.OS === "android" ? 0 : moderateScale(9),
        borderBottomColor : 'transparent'
    },
    text : {
        textAlign : "center",
        fontSize : moderateScale(20),
        color : defaultTheme.gray,
        alignSelf : "center"
    }
})