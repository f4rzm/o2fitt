import React, { useState } from 'react'
import { View, Text, ScrollView, ActivityIndicator, Image } from 'react-native'
import { BlogRow, Toolbar, ConfirmButton } from '../../components'
import { useSelector } from 'react-redux';
import { RestController } from '../../classess/RestController';
import { urls } from '../../utils/urls';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { defaultTheme } from '../../constants/theme';
import { dimensions } from '../../constants/Dimensions';
import { moderateScale } from 'react-native-size-matters';

export default function BlogCatScreen(props) {
    const lang = useSelector((state) => state.lang);
    const auth = useSelector((state) => state.auth);
    const user = useSelector((state) => state.user);
    const app = useSelector((state) => state.app);
    const profile = useSelector((state) => state.profile);
    const pedometer = useSelector((state) => state.pedometer);
    const diet = useSelector((state) => state.diet)

    const [blogs, setBlogs] = useState([])
    const [blogIsLiked, setBlogIsLiked] = useState([0])
    const [network, setNetwork] = useState(true)

    React.useEffect(() => {
        getBlogs()
    }, [app.networkConnectivity])

    const getBlogs = () => {
        const url = urls.blogBaseUrl + urls.blog+"GetLatestBlogs?page=1&&pageSize=20";
        const header = {
            headers: {
                Authorization: 'Bearer ' + auth.access_token,
                Language: lang.capitalName,
            },
        };
        const params = {};

        const RC = new RestController();
        RC.checkPrerequisites(
            'get',
            url,
            params,
            header,
            getBlogSuccess,
            getBlogsFailure,
            auth,
            onRefreshTokenSuccess,
            onRefreshTokenFailure,
        );
    };
    const onRefreshTokenSuccess = () => { };

    const onRefreshTokenFailure = () => { };

    const getBlogSuccess = async (response) => {
        console.error(response.data.data.items);
        setNetwork(true)
        setBlogs(response.data.data.items);
        const blog = response.data.data[0];
        let liked = await JSON.parse(await AsyncStorage.getItem('likedPost'));

        const likeIndex = liked ? liked.findIndex((id) => id == blog.id) : -1;
        if (likeIndex > -1) {
            setBlogIsLiked(liked);
        } else {
            setBlogIsLiked(liked);
        }
    };

    const getBlogsFailure = (err) => {
        setNetwork(false)
        // console.error(err);
    };
    const onLike = async (blog) => {

        // AsyncStorage.removeItem("likedPost")
        let liked = await JSON.parse(await AsyncStorage.getItem('likedPost'));
        // console.log('liked', liked);
        const likeIndex = liked ? liked.findIndex((id) => id == blog.id) : -1;
        // console.log('likeIndex', likeIndex);
        // likeIndex > -1 ? setBlogIsLiked(false) : setBlogIsLiked(true);
        likeIndex > -1 && liked.splice(likeIndex, 1);
        if (likeIndex > -1) {
            AsyncStorage.setItem('likedPost', JSON.stringify([...liked]))
            setBlogIsLiked([...liked])
        } else {
            AsyncStorage.setItem(
                'likedPost',
                liked
                    ? JSON.stringify([...liked, blog.id])
                    : JSON.stringify(new Array(1).fill(blog.id)),
            );
            setBlogIsLiked([...liked, blog.id])
        }

        const url =
            urls.blogBaseUrl +
            urls.blog +
            urls.likeBlog +
            `?id=${blog.id}&state=${likeIndex === -1}`;
        const header = {
            headers: {
                Authorization: 'Bearer ' + auth.access_token,
                Language: lang.capitalName,
            },
        };
        const params = {
            id: blog.id,
        };

        const RC = new RestController();
        RC.checkPrerequisites(
            'post',
            url,
            params,
            header,
            onLikeSuccess,
            () => false,
            auth,
            onRefreshTokenSuccess,
            onRefreshTokenFailure,
        );
    };

    const onLikeSuccess = (res) => {

    };

    const onPressBlog = (item) => {
        props.navigation.navigate("BlogScreen", {
            data: item,
            lang: lang
        })
    }
    return (
        <>
            <Toolbar
                lang={lang}
                title={lang.blog}
                onBack={() => props.navigation.goBack()}
            />
            <ScrollView contentContainerStyle={{ alignItems: "center" }}>
                {
                    network ? <>
                        {
                            blogs.length > 0 ? <>
                                {
                                    blogs.map((item) => (
                                        <BlogRow
                                            lang={lang}
                                            item={item}
                                            key={item.id.toString()}
                                            onLike={onLike}
                                            blogIsLiked={blogIsLiked}
                                            onPress={() => onPressBlog(item)}
                                        />

                                    ))
                                }
                            </>
                                :
                                <View style={{ flex: 1, alignItems: "center", justifyContent: 'center', height: dimensions.WINDOW_HEIGTH }}>
                                    <ActivityIndicator color={defaultTheme.primaryColor} size={"large"} />
                                </View>
                        }
                    </>
                        :
                        <View style={{ width: dimensions.WINDOW_WIDTH * 0.9, alignSelf: "center", borderWidth: 1, borderColor: defaultTheme.border, borderRadius: 10, paddingHorizontal: moderateScale(15), paddingVertical: moderateScale(10), marginTop: moderateScale(30) }}>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Image
                                    source={require("../../../res/img/cross.png")}
                                    style={{ width: moderateScale(20), height: moderateScale(20), resizeMode: "contain", tintColor: defaultTheme.error }}
                                />
                                <Text style={{ color: defaultTheme.darkText, fontFamily: lang.font, fontSize: moderateScale(15), paddingHorizontal: moderateScale(10) }}>{lang.noInternet}</Text>
                            </View>
                            <ConfirmButton
                                lang={lang}
                                title={lang.tryAgin}
                                style={{ alignSelf: 'center', marginVertical: moderateScale(20), paddingVertical: moderateScale(25), width: moderateScale(150), backgroundColor: defaultTheme.green }}
                                onPress={() => {
                                    setNetwork(true)
                                    setTimeout(() => {
                                        getBlogs()
                                    }, 100);

                                }}
                                isLoading={network}
                            />
                        </View>
                }

            </ScrollView>
        </>
    )
}
