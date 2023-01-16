import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    Text,
    Image,
    TouchableOpacity,
    FlatList
} from 'react-native';
import { dimensions } from '../../constants/Dimensions';
import { defaultTheme } from '../../constants/theme';
import { useSelector, useDispatch } from 'react-redux'
import { moderateScale } from 'react-native-size-matters';
import { RowSpaceAround } from '../../components';
import { LineChart } from "react-native-chart-kit";
import moment from 'moment';
import { urls } from '../../utils/urls'
import { RestController } from '../../classess/RestController';
import SleepList from '../../components/SleepList/SleepList';
import Toast from 'react-native-toast-message'
import { BlurView } from '@react-native-community/blur';
import Alert from '../../components/Alert';
import PouchDB from '../../../pouchdb';
import pouchdbSearch from 'pouchdb-find';
import Info3 from '../../../res/img/info3.svg'

PouchDB.plugin(pouchdbSearch);
const sleepDB = new PouchDB('sleep', { adapter: 'react-native-sqlite' });

const SleepWeekTab = props => {
    const lang = useSelector(state => state.lang)
    const profile = useSelector(state => state.profile)
    const auth = useSelector(state => state.auth);

    const averageHour = (parseInt(parseInt(props.sleepData.avrageSleepDuration) / 60))
    const averageMin = (parseInt(props.sleepData.avrageSleepDuration) - (averageHour * 60))
    const [sleepList, setSleepList] = useState([])
    const [sleep, setSleep] = useState()
    const [showBlur, setShowBlur] = useState(false);


    const arrayButton = [
        {
            text: lang.yes,
            color: defaultTheme.error,
            onPress: () => deleteSleep(sleep),
        },
        {
            text: lang.no,
            color: defaultTheme.green,
            onPress: () => setShowBlur(false),
        },
    ];
    const alertText = lang.deleteMessage;
    const dataAlert = { arrayButton, alertText }

    const days = React.useRef([
        lang["1shanbe"],
        lang["2shanbe"],
        lang["3shanbe"],
        lang["4shanbe"],
        lang["5shanbe"],
        lang["jome"],
        lang["shanbe"]
    ]).current
    const [chartDays, setChartDays] = React.useState(days)

    React.useEffect(() => {

        const unsubscribe = props.navigation.addListener('focus', () => {
            const d = [];
            new Array(7).fill(1).map((item, index) => {
                d.push(
                    days[
                    moment()
                        .subtract(6 - index, 'days')
                        .day()
                    ],
                );
            });

            setChartDays(d);
            getListOfSleep();
        });
        return unsubscribe;
    }, [props.navigation]);

    const getListOfSleep = () => {
        const url = `${urls.workoutBaseUrl}UserTrackSleep?userId=${profile.userId}&days=32`;
        const header = {
            headers: {
                Authorization: 'Bearer ' + auth.access_token,
                'Content-Type': 'application/json',
                Language: lang.capitalName,
            },
        };

        const RC = new RestController();
        RC.get(url, header, onSuccessGetSleep, onFailureGetSleep);
    };
    const onSuccessGetSleep = (response) => {
        const sleepDetails = response.data.data.sleepDetails;
        console.log("sleep details",sleepDetails)
        const array = sleepDetails.filter(item => item.value !== 0)
        setSleepList(array)

    }
    const onFailureGetSleep = (err) => {
        Toast.show({
            type: "error",
            props: { text2: noInternet, style: { fontFamily: lang.font } }
        })
    }

    const renderHeader = () => {
        return (
            <>
                <ScrollView>

                    <View style={{ height: moderateScale(220) }}>

                        <LineChart
                            data={{
                                labels: chartDays,
                                datasets: [
                                    {
                                        data: props.sleepData.sleepDetails.map(item => item.value)
                                    }
                                ]
                            }}
                            width={dimensions.WINDOW_WIDTH}
                            height={moderateScale(220)}
                            withHorizontalLabels={true}
                            withVerticalLabels={true}
                            withShadow={false}
                            formatYLabel={label => {
                                const h = parseInt(parseInt(label) / 60) < 10 ? "0" + parseInt(parseInt(label) / 60) : parseInt(parseInt(label) / 60)
                                const m = parseInt(label) - (parseInt(h) * 60) < 10 ? "0" + (parseInt(label) - (parseInt(h) * 60)) : parseInt(label) - (parseInt(h) * 60)

                                return h + ":" + m

                            }}
                            chartConfig={{
                                horizontalOffset: 0,
                                width: dimensions.WINDOW_WIDTH,
                                backgroundColor: defaultTheme.lightBackground,
                                backgroundGradientFrom: defaultTheme.lightBackground,
                                backgroundGradientTo: defaultTheme.lightBackground,
                                decimalPlaces: 0, // optional, defaults to 2dp
                                color: (opacity = 1) => `rgba(249, 139, 6, ${opacity})`,
                                labelColor: (opacity = 1) => `rgba(110, 110, 110, ${opacity})`,
                                propsForDots: {
                                    r: "2.5",
                                    strokeWidth: "2",
                                    stroke: defaultTheme.primaryColor
                                },
                                propsForLabels: {
                                    fontFamily: lang.font,
                                    fontSize: moderateScale(14)
                                },
                                style: { margin: 0, padding: 0 },
                                propsForVerticalLabels: { fontSize: lang.langName === "persian" ? moderateScale(18) : moderateScale(14) },

                            }}
                            onDataPointClick={(e) => console.log(e)}
                            style={{
                                width: dimensions.WINDOW_WIDTH,
                                margin: 0,
                                marginTop: moderateScale(8),
                                marginBottom: moderateScale(25),
                            }}

                        />

                    </View>

                    <View style={styles.bottomContainer}>
                        <RowSpaceAround>
                            <View style={styles.item}>

                                <Image
                                    source={require("../../../res/img/clock.png")}
                                    style={styles.icon}
                                    resizeMode="contain"
                                />
                                <Text style={[styles.text1, { fontFamily: lang.font }]} allowFontScaling={false}>
                                    {
                                        lang.averageSleepTime
                                    }
                                </Text>
                                <Text style={[styles.text1, { fontFamily: lang.font }]} allowFontScaling={false}>
                                    <Text style={[styles.text2, { fontFamily: lang.font }]} allowFontScaling={false}>
                                        {averageHour}
                                    </Text>
                                    {
                                        " " + lang.hour + " "
                                    }
                                    <Text style={[styles.text2, { fontFamily: lang.font }]} allowFontScaling={false}>
                                        {averageMin}
                                    </Text>
                                    {
                                        " " + lang.min + " "
                                    }
                                </Text>
                            </View>
                            <View style={styles.item}>

                                <Image
                                    source={require("../../../res/img/star.png")}
                                    style={styles.icon}
                                    resizeMode="contain"
                                />
                                <Text style={[styles.text1, { fontFamily: lang.font }]} allowFontScaling={false}>
                                    {
                                        lang.averageSleepRate
                                    }
                                </Text>
                                <Text style={[styles.text2, { fontFamily: lang.font }]} allowFontScaling={false}>
                                    {
                                        props.sleepData.avrageRate
                                    }
                                </Text>
                            </View>
                        </RowSpaceAround>
                        <View style={styles.item}>
                            <Image
                                source={require("../../../res/img/burn.png")}
                                style={styles.icon}
                                resizeMode="contain"
                            />
                            <Text style={[styles.text1, { fontFamily: lang.font }]} allowFontScaling={false}>
                                {
                                    lang.averageUsedColory
                                }
                            </Text>
                            <Text style={[styles.text2, { fontFamily: lang.font }]} allowFontScaling={false}>
                                {
                                    props.sleepData.avrageBurnedCalories
                                }
                            </Text>
                        </View>
                    </View>
                    
                </ScrollView>
            </>
        );
    }
    //=================Deltete sleep=====================\\
    const askForDelete = (item) => {
        setShowBlur(true)
        setSleep(item)
    }
    const deleteSleep = (sleep) => {
        setShowBlur(false);
        const url = `${urls.workoutBaseUrl}UserTrackSleep?userTrackSleepId=${sleep.id}`;
        const header = {
            headers: {
                Authorization: 'Bearer ' + auth.access_token,
                'Content-Type': 'application/json',
                Language: lang.capitalName,
            },
        };
        const params = {};

        const RC = new RestController();
        RC.delete(url, params, header, onSuccessDeleteSleep, onFailureDeleteSleep);
    };
    const onSuccessDeleteSleep = response => {
        const data = sleepList.filter(item => item.id !== sleep.id);
        setSleepList(data);
        deleteFromDatabase();
    };
    const onFailureDeleteSleep = response => {
        Toast.show({
            type: 'error',
            props: { text2: response.data.message },
            visibilityTime: 1000,
        });
    };
    const deleteFromDatabase = () => {
        sleepDB
            .find({
                selector: { _id: sleep._Id },
            })
            .then(rec => {
                if (rec.docs.length > 0) {
                    sleepDB.put({ ...rec.docs[0], _deleted: true }).then(() => {
                        Toast.show({
                            type: 'success',
                            props: { text2: lang.successful, style: { fontFamily: lang.font } },
                            visibilityTime: 1000,
                        });
                    });
                }
            });
    };
    //==================Delete=====================\\

    //==================Edit=======================\\
    const askForEdit = item => {
        // setSleep(item);
        // console.log({item});
        props.navigation.navigate('AddSleepScreen', { item })
    };

    //=================Edit=====================\\

    const renderItems = (items) => {
        return <SleepList items={items} lang={lang} askForDelete={askForDelete} askForEdit={askForEdit} />
    }
    return (
        <>
            <FlatList
                data={sleepList}
                keyExtractor={(item, index) => `key-${index}`}
                ListHeaderComponent={renderHeader}
                renderItem={renderItems}
                ListFooterComponent={()=>{
                    return  <View style={{ width: "90%", marginHorizontal: "5%", borderWidth: 1, borderRadius: moderateScale(7), borderColor: defaultTheme.green,marginTop:moderateScale(15) }}>
                    <View style={{ flexDirection: "row", padding: moderateScale(5), alignItems: "center" }}>
                        <Info3  width={moderateScale(24)} height={moderateScale(24)} />
                        <Text style={{ paddingHorizontal: moderateScale(5), fontSize: moderateScale(17), color: defaultTheme.darkText, fontFamily: lang.font,textAlign:"left" }}>{lang.guide}</Text>
                    </View>
                    <Text style={{ padding: moderateScale(5), fontSize: moderateScale(16), color: defaultTheme.darkText, paddingBottom: moderateScale(16), fontFamily: lang.font,textAlign:"left" ,lineHeight:moderateScale(23) }}>
                        {lang.editOrDeleteSleep}
                    </Text>
                </View>
                }}
            />
           
            {showBlur && (
                <View style={styles.wrapper}>
                    <BlurView
                        style={styles.absolute}
                        blurType="light"
                        blurAmount={4}
                        reducedTransparencyFallbackColor="white"
                    />
                    <Alert {...{ dataAlert, lang }} />
                </View>
            )}
        </>
    )


};

const styles = StyleSheet.create({
    bottomContainer: {
        flex: 1,
        alignItems: "center"
    },
    title: {
        fontSize: moderateScale(14),
        color: defaultTheme.gray
    },
    chartIcon: {
        width: moderateScale(18),
        height: moderateScale(18),
        marginHorizontal: moderateScale(10)
    },
    indicator: {
        height: moderateScale(2),
        marginVertical: moderateScale(5)
    },
    item: {
        width: dimensions.WINDOW_WIDTH * 0.4,
        alignItems: "center"
    },
    icon: {
        width: moderateScale(38),
        height: moderateScale(38),
        margin: moderateScale(10)
    },
    text1: {
        fontSize: moderateScale(13),
        color: defaultTheme.gray,
        marginVertical: moderateScale(5),
    },
    text2: {
        fontSize: moderateScale(20),
        color: defaultTheme.gray
    },
    absolute: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    wrapper: {
        position: 'absolute',
        zIndex: 10,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
    },
});

export default SleepWeekTab;
