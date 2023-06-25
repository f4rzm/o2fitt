import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { MainToolbar } from '../../components'
import { useSelector } from 'react-redux'
import { moderateScale } from 'react-native-size-matters'
import { defaultTheme } from '../../constants/theme'
import MainToolbarWithTopCurve from '../../components/ScreentTemplate/MainToolbarWithTopCurve'
import { lang } from '../../redux/reducers/lang/lang';
import { urls } from '../../utils/urls'
import { RestController } from '../../classess/RestController'
import DietCategoryItems from '../../components/dietComponents/DietCategoryItems'
import { dimensions } from '../../constants/Dimensions'

const DietMainScreen = () => {
    const diet = useSelector(state => state.diet)
    const lang = useSelector(state => state.lang)
    const auth = useSelector(state => state.auth)
    const arr = new Array(100).fill({ name: "aa" })
    const [dietCategory, setDietCategory] = useState([])
    const [parents, setParents] = useState([])
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        const url = urls.foodBaseUrl + urls.dietCategory + "GetAllAsync?page=1&pageSize=20"
        const RC = new RestController()
        const header = {
            headers:
            {
                Authorization: "Bearer " + auth.access_token,
                Language: lang.capitalName
            }
        }

        RC.get(url, header, onSuccessDietCat, onFailureDietCat)
    }, [])
    const onSuccessDietCat = (res) => {


        // setDietCategory(res.data.data.items);
        let blogParents = []
        res.data.data.items.filter((item) => item.parentId !== null)
            .map((item) => {
                let index = blogParents.indexOf(item.id)
                if (index == -1) {
                    blogParents.push(item.id)
                }
            })

        // let blogCats = blogParents.filter((value, index, self) =>
        //     index === self.findIndex((t) => (
        //         t.place === value.place && t.name === value.name
        //     ))
        // )
        setDietCategory(res.data.data.items);
        setParents(blogParents);
        setLoading(false)

    }
    const onFailureDietCat = (err) => {
        console.error(err);
    }
    return (
        <MainToolbarWithTopCurve
            lang={lang}
            contentScrollViewStyle={styles.containerContent}
        >
            {
                loading && <ActivityIndicator />
            }
            {
                parents.map((item) => {
               
                        return (
                            <View style={{ alignItems: "baseline" }}>
                                <Text style={[styles.subCatText, { fontFamily: lang.font }]}>{dietCategory.find(el=>el.id==item).name[lang.langName]}</Text>
                                <View style={styles.itemContainer}>
                                    {
                                        dietCategory.filter(element => element.parentId == item)
                                            .map((res) => {
                                                return <DietCategoryItems
                                                    lang={lang}
                                                    item={res}
                                                />
                                            })
                                    }
                                </View>
                            </View>
                        )
                
                    // dietCategory.map((dietItem) => {
                    //     if (item == dietItem.id) {

                    //     }
                    // })

                })
            }

        </MainToolbarWithTopCurve>
    )
}

export default DietMainScreen

const styles = StyleSheet.create({
    containerContent: {
        alignItems: "center",

    },
    itemContainer: {
        width: dimensions.WINDOW_WIDTH,
        alignItems: "center",
        justifyContent: "space-evenly",
        flexWrap: "wrap",
        flexDirection: "row"
    },
    subCatText: {
        fontSize: moderateScale(16),
        padding: moderateScale(10)
    }
})