import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ConfirmButton } from '../../components'
import { urls } from '../../utils/urls'
import { RestController } from '../../classess/RestController'
import { useSelector } from 'react-redux'
import DietCategoryItems from '../../components/dietComponents/DietCategoryItems'
import DietBanner from '../../components/dietComponents/DietBanner'
import { dimensions } from '../../constants/Dimensions'
import { moderateScale } from 'react-native-size-matters'
import { defaultTheme } from '../../constants/theme'
import { useIsFocused, useNavigation } from '@react-navigation/native'

const DietCategoryScreen = (props) => {
    const diet = useSelector(state => state.diet)
    const lang = useSelector(state => state.lang)
    const auth = useSelector(state => state.auth)
    const [dietCategory, setDietCategory] = useState([])
    const [parents, setParents] = useState([])
    const [loading, setLoading] = useState(true)
    const [serverError, setServerError] = useState(false)

    const getDietCategory = () => {

        setLoading(true)
        const url = urls.baseDiet + urls.dietCategory + "getallactive?page=1&pageSize=20"
        const RC = new RestController()
        const header = {
            headers:
            {
                Authorization: "Bearer " + auth.access_token,
                Language: lang.capitalName
            }
        }

        RC.get(url, header, onSuccessDietCat, onFailureDietCat)

    }

    useEffect(() => {
        getDietCategory()
    }, [])
    
    const navigation = useNavigation()
    const isFocused = useIsFocused();
    useEffect(() => {
        console.warn('sssssssss',props);
        if (props.route && props.route.params && props.route.params.activationDiet) {
            // Alert.alert("ok")
            console.warn(props.route.params.activationDiet);
            navigation.navigate("MyDietTab")
        }
    }, [isFocused])


    const onSuccessDietCat = (res) => {
        setLoading(false)
        setServerError(false)
        let dietParent = []
        res.data.data.filter((item) => item.parentId == 0)
            .map((item) => {
                let index = dietParent.indexOf(item.id)
                if (index == -1) {
                    dietParent.push(item.id)
                }
            })
        setDietCategory(res.data.data);
        setParents(dietParent);

    }

    const onFailureDietCat = (err) => {
        // Alert.alert("get category")
        setLoading(false)
        setServerError(true)
    }

    return (
        <ScrollView
            contentContainerStyle={{ flexGrow: 1, alignItems: "center", paddingBottom: moderateScale(150), justifyContent: "center" }}
            style={{ width: dimensions.WINDOW_WIDTH }}
            showsVerticalScrollIndicator={false}
        >
            {
                loading ?
                    <ActivityIndicator size={'large'} color={defaultTheme.primaryColor} />
                    :
                    serverError ? (
                        <>
                            <Text style={[{ fontFamily: lang.font }, styles.errorText]}>{lang.serverError}</Text>
                            <ConfirmButton
                                title={"تلاش مجدد"}
                                lang={lang}
                                onPress={getDietCategory}
                                style={styles.tryAgain}
                                textStyle={styles.Ebtn}
                            />
                        </>
                    ) :
                        dietCategory.find(el => el.isPromote == true) &&
                        <View style={{ alignItems: "baseline" }}>
                            <Text style={[styles.subCatText, { fontFamily: lang.font }]}>رژیم پیشنهادی</Text>
                            <DietBanner
                                lang={lang}
                                item={dietCategory.find(el => el.isPromote == true)}
                            />
                        </View>
            }
            {
                parents.map((item) => {
                    return (
                        <View style={{ alignItems: "baseline" }}>
                            <Text style={[styles.subCatText, { fontFamily: lang.font }]}>{dietCategory.find(el => el.id == item).name[lang.langName]}</Text>
                            <View style={styles.itemContainer}>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
                                    {
                                        dietCategory.filter(element => element.parentId == item)
                                            .map((res) => {
                                                return (
                                                    <DietCategoryItems
                                                        lang={lang}
                                                        item={res}
                                                    />
                                                )
                                            })
                                    }
                                </ScrollView>
                            </View>
                        </View>
                    )
                })
            }
        </ScrollView>
    )
}

export default DietCategoryScreen

const styles = StyleSheet.create({
    containerContent: {
        alignItems: "center",
        flex: 1
    },
    itemContainer: {
        width: dimensions.WINDOW_WIDTH,
        alignItems: "center",
        // justifyContent: "space-evenly",
        // flexWrap: "wrap",
        flexDirection: "row"
    },
    subCatText: {
        fontSize: moderateScale(16),
        padding: moderateScale(10),
        color:defaultTheme.darkText
    },
    tryAgain: {
        backgroundColor: defaultTheme.transparent,
        borderColor: defaultTheme.primaryColor,
        borderWidth: 1,
        marginTop: moderateScale(10)
    },
    errorText: {
        fontSize: moderateScale(16),
        textAlign: "center",
        color: defaultTheme.darkText
    },
    Ebtn: {
        color: defaultTheme.darkText
    }
})