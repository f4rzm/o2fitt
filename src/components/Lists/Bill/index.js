import React from 'react';
import { View, Text } from 'react-native';
import CommonText from '../../CommonText';
import styles from './styles'
import momentJalaali from "moment-jalaali"
import { defaultTheme } from '../../../constants/theme';
import { dimensions } from '../../../constants/Dimensions'
import { moderateScale } from 'react-native-size-matters';
const BillList = ({ items, lang }) => {
    //==================VARIABLES============
    const { item, index } = items;
    const date = momentJalaali((item.createDate.split('T')[0]), 'YYYY-MM-DD').format('jYYYY/jMM/jDD');

    return (
        <View style={styles.container}>
            <CommonText styleText={{ color: defaultTheme.darkText, alignSelf: "baseline" }} text={date} />
                <CommonText styleText={{ color: defaultTheme.darkText, width: dimensions.WINDOW_WIDTH * 0.8,textAlign:"left",paddingVertical:moderateScale(5) }} text={`${lang.buyAccountTitle} ${item.package}`} />
            <CommonText styleText={{ color: defaultTheme.darkText,textAlign:"left" }} text={`${item.amount} ${lang.toman}`} />
        </View>
    );
}

export default BillList;