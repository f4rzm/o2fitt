import React, { useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, View,Dimensions,Text,TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/EvilIcons';
import momentJalaali from 'moment-jalaali';
import { defaultTheme } from '../../constants/theme';
import { moderateScale } from 'react-native-size-matters';

const {width} = Dimensions.get('screen');

const SleepList = (props) => {
    //==================VARIABLEs==================
    const { item, index } = props.items;
    const date = momentJalaali(item.date.split('T')[0], 'YYYY/MM/DD').format(
        'jYYYY/jMM/jDD',
    );
    const duration = `${item.duration.split(':')[0]} ${props.lang.hour}  ${item.duration.split(':')[1]
        } ${props.lang.min}`;
    const translateXDelete = useRef(new Animated.Value(props.lang.langName==="persian"?140:-140)).current;
    const [activeDelete, setActiveDelete] = useState(false);

    const transform = { transform: [{ translateX: translateXDelete }] };

    //==================FUNCTION==================

    const onLongPress = () => {
        setActiveDelete(true);
        Animated.spring(translateXDelete, {
            toValue: 0,
            useNativeDriver: true,
        }).start();
    };


    const pressDelete = item => {
        props.askForDelete(item)
        hideDelete();
    };

    const onPress = () => {
        if (activeDelete) {
            hideDelete();
            setActiveDelete(false);
        }

    };

    const pressEdit = item => {
        props.askForEdit(item)
        hideDelete();
    };

    const hideDelete = () => {
        Animated.spring(translateXDelete, {
            toValue: props.lang.langName==="persian"?140:-140,
            useNativeDriver: true,
        }).start();
    };

    return (
        <TouchableOpacity style={styles.container} onPress={onPress} onLongPress={onLongPress}>
            <Animated.View style={[styles.container, transform]}>
                <Pressable
                    style={styles.buttonRemove}
                    onPress={pressDelete.bind('null', item)}>
                    <Icon name="trash" color={'white'} size={45} />
                </Pressable>
                <Pressable
                    style={styles.buttonEdit}
                    onPress={pressEdit.bind('null', item)}>
                    <Icon name="pencil" color={'white'} size={45} />
                </Pressable>

                <View style={[styles.row, styles.padding]}>
                    <Text style={[styles.date, { fontFamily: props.lang.titleFont }]}>{date}</Text>
                    <Text style={[styles.duration, { fontFamily: props.lang.titleFont }]}>{duration}</Text>
                </View>
            </Animated.View>
        </TouchableOpacity>
    );
};
const styles=StyleSheet.create({
    container: {
        borderBottomWidth: 0.4,
        borderBottomColor: defaultTheme.gray,
        width: width + 140,
        flexDirection: 'row',
    },
    buttonRemove: {
        justifyContent: 'center',
        alignItems: 'center',
        width: moderateScale(60),
        height: 50,
        backgroundColor: defaultTheme.error,
    },
    buttonEdit: {
        justifyContent: 'center',
        alignItems: 'center',
        width: moderateScale(60),
        height: 50,
        backgroundColor: defaultTheme.green2,
    },
    date: {
        marginHorizontal: 10,
        fontSize: moderateScale(14)
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    delete: {
        width: 100,
        height: '100%',
    },
    padding: {
        paddingStart: 20,
    },
    duration: {
        flex: 1,
        marginHorizontal: 20,
        textAlign: 'right',
        fontSize: moderateScale(14)

    },
})
export default SleepList;
