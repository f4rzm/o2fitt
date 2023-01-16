
import React, { memo } from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    Image,
    I18nManager
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { moderateScale } from 'react-native-size-matters';
import { Rect } from 'react-native-svg';
import { dimensions } from '../constants/Dimensions';
import { defaultTheme } from '../constants/theme';
import RowSpaceBetween from './layout/RowSpaceBetween';
import RowWrapper from './layout/RowWrapper';
import bodyBuildingExcercises from "../utils/bodyBuildingExcercises"
import cardioExcercises from "../utils/cardios/cardioExcercises"
import { exercise } from "../utils/exercise"
import PouchDB from '../../pouchdb'
import pouchdbSearch from 'pouchdb-find'
import PhoneIcon from '../../res/img/phone-icon.svg'


PouchDB.plugin(pouchdbSearch)
const personalActivityDB = new PouchDB('personalActivity', { adapter: 'react-native-sqlite' })

const ActivityRow = props => {
    console.warn(props.item);
    // console.log("RRRRRRRRRR",props)
    const lang=props.lang

    const [name, setName] = React.useState("")
    React.useEffect(() => {
        let data = null
        if (!props.item.stepsCount) {
            if (props.item.workOutId) {
                if (props.item.classification == 1) {
                    data = exercise.find(ex => ex.id === props.item.workOutId)
                } else if (props.item.classification == 2) {
                    data = cardioExcercises.find(ex => ex.id === props.item.workOutId)
                }
                else {
                    data = bodyBuildingExcercises.find(ex => ex.id === props.item.workOutId)
                }
                if (data != undefined) {
                    setName(data.name[props.lang["langName"]])
                }
            }
            else {
                personalActivityDB.find({
                    selector: { id: props.item.personalWorkOutId }
                }).then(rec => {
                    setName(rec.docs[0].name)
                })
            }
        }
        else {
            setName(props.item.stepsCount + " " + props.lang.step)
        }

    })

    return (
        <TouchableOpacity style={[styles.mainContainer, { backgroundColor: props.item.stepsCount&&props.item.isManual==false? defaultTheme.grayBackground : defaultTheme.white, borderRadius: moderateScale(10), paddingHorizontal: props.item.stepsCount&&props.item.isManual==false?moderateScale(20)  : null }]} onPress={props.item.stepsCount&&props.item.isManual==false? () => { }  :() => props.onEdit(props.item)} activeOpacity={1}>
            <RowWrapper style={{ paddingHorizontal: 0 }}>
                {
                    props.item.stepsCount&&props.item.isManual==false?<PhoneIcon width={moderateScale(20)} height={moderateScale(20)}/>:
                    <>
                        <TouchableOpacity style={{ marginRight: moderateScale(16) }} onPress={props.item.stepsCount&&props.item.isManual==false?() => { }  :() => props.onDelete(props.item) }>
                            <Image
                                style={styles.image}
                                resizeMode="contain"
                                source={require("../../res/img/remove.png")}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ marginRight: moderateScale(16) }} onPress={() => props.onEdit(props.item)}>
                            <Image
                                style={styles.image2}
                                resizeMode="contain"
                                source={require("../../res/img/edit.png")}
                            />
                        </TouchableOpacity>
                    </>
                }

                <View style={{ justifyContent: "flex-start",marginHorizontal:props.item.stepsCount?moderateScale(20):0 }}>
                    <Text style={[styles.text, { fontFamily: props.lang.font, color: props.item.stepsCount&&props.item.isManual==false? defaultTheme.mainText : defaultTheme.mainText,textAlign:"left" }]} allowFontScaling={false}>
                        {
                            name
                        }
                    </Text>
                    {
                        props.item.stepsCount&&props.item.isManual==false?
                        <Text style={{textAlign:"left", color:defaultTheme.mainText,fontFamily: props.lang.font,}}>
                            {lang.stepsDes}
                        </Text>:null
                    }
                </View>
            </RowWrapper>
            <Text style={[styles.text, { fontFamily: props.lang.font, color: props.item.stepsCount&&props.item.isManual==false? defaultTheme.mainText : defaultTheme.mainText }]} allowFontScaling={false}>
                {
                    parseFloat(props.item.burnedCalories).toFixed(0)
                }
            </Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        width: dimensions.WINDOW_WIDTH * 0.94 - moderateScale(20),
        marginVertical: moderateScale(0),
        minHeight: 10,
        paddingHorizontal: moderateScale(8),
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderColor: defaultTheme.border
    },
    text: {
        fontSize: moderateScale(15),
        color: defaultTheme.mainText
    },
    text2: {
        fontSize: moderateScale(13),
        color: defaultTheme.lightGray
    },
    image: {
        width: moderateScale(21),
        height: moderateScale(21),
    },
    image2: {
        width: moderateScale(20),
        height: moderateScale(17),
        tintColor: defaultTheme.green
    }

})

export default memo(ActivityRow)