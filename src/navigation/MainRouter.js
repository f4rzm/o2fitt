import React from "react"
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
    SplashScreen,
    EditGoalScreen,
    EditGoalNutritionScreen,
    EditGoalBodyScreen,
    RegisterWeightScreen,
    EditBodyScreen,
    BodyHelpScreen,
    BodyShapeScreen,
    AddWaterScreen,
    PedometerScreen,
    AddSleepScreen,
    FoodFindScreen,
    FoodDetailScreen,
    EditFoodIngredients,
    IngredientsSearchScreen,
    IngredientAmountScreen,
    CreateFoodScreen,
    TestScreen,
    AddCaloryScreen,
    NotesScreen,
    AddNoteScreen,
    InviteScreen,
    ActivityScreen,
    ActivityDetailsScreen,
    PersonalActivityDetailsScreen,
    SleepDetailScreen,
    BarcodeScreen,
    PersonalActivityScreen,
    MessagesScreen,
    EditProfileScreen,
    SupportScreen,
    FoodAllergiesScreen,
    SecurityScreen,
    ReportScreen,
    MessageDetailScreen,
    RemindersListScreen,
    RemindersDetailScreen,
    PackagesScreen,
    PaymentScreen,
    NutritionDetailsScreen,
    PaymentResultScreen,
    PrivacyPolicyScreen,
    GuideScreen,
    OxygenFittScreen,
    DatabaseSyncScreen,
    ReferencesScreen,
    PedometerTabScreen,
    DietStartScreen,
    chooseActivityDietScreen,
    DietAlergies,
    DieteDifficulty,
    DietConfirmation,
    DietPlan,
    RecipeCatScreen,
    recipeDetails,
    BlogScreen,
    BlogCatScreen,
    SetRefferalCode
} from '../screens';
import AnalyzMeal from "../screens/analyzMeal/AnalyzMeal";
import InformationProductScreen from '../screens/InformationProduct/InformationProductScreen'
import LoginRoutes from "./loginRouter"
import WelcomeRouter from "./WelcomeRouter"
import { useSelector } from 'react-redux'
import Tabs from "./TabNavigator"
import ChatScreen from "../screens/ChatScreen/ChatScreen";
import { defaultTheme } from "../constants/theme";
import BillScreen from "../screens/BillScreen/BillScreen";
import ChooseDietTargetScreen from "../screens/DietScreens/ChooseDietTargetScreen";
import BodyAnalyzeScreen from '../screens/homeScreeen/BodyAnalyzeScreen'
import DrawerNavigator from "./DrawerNavigator";
import FastingDietplan from "../screens/FastingDiet/FastingDietplan";
import { CardStyleInterpolators, createStackNavigator } from "@react-navigation/stack";
import RecipeFilterScreen from "../screens/recipe/RecipeFilterScreen";


const MainRoute = props => {
    const options = {
        contentStyle: { backgroundColor: null },
        cardStyle: { opacity: 1, backgroundColor: defaultTheme.lightBackground },
    }
    const app = useSelector(state => state.app)
    const auth = useSelector(state => state.auth)
    const lang = useSelector(state => state.lang)
    const profile = useSelector(state => state.profile)
    const user = useSelector(state => state.user)
    const specification = useSelector(state => state.specification[0])
    const diet = useSelector(state => state.diet)

    const Stack = createStackNavigator();


    return (
        // <NavigationContainer theme={MyTheme}>
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                animationEnabled: true,
                // cardStyleInterpolator:CardStyleInterpolators.forFadeFromCenter
            }}
        // initialRouteName={"FastingDietplan"}
        >
            {
                app.appIsLoading ?
                    <Stack.Screen name="SplashScreen" component={SplashScreen} options={options} /> :
                    auth.access_token ?
                        profile.id && profile.id > 0 && parseInt(specification.weightSize) > 0 ?
                            <>
                                
                                 <Stack.Group screenOptions={{ presentation: "modal",headerShown:false,cardStyleInterpolator:CardStyleInterpolators.forRevealFromBottomAndroid }}>
                                    <Stack.Screen name="SetRefferalCode1" component={SetRefferalCode} options={options} />
                                    <Stack.Screen
                                    initialParams={{
                                        lang: lang,
                                        profile: profile,
                                        auth: auth,
                                        app: app,
                                        user: user
                                    }}
                                    name="Drawer"
                                    component={DrawerNavigator}
                                />
                                </Stack.Group>
                                {/* <Stack.Screen
                                    name="Tabs"
                                    component={Tabs}
                                    options={{ contentStyle: { backgroundColor: null }, cardStyle: { opacity: 1, backgroundColor: null }, cardOverlayEnabled: false }}
                                    initialParams={{
                                        lang: lang,
                                        profile: profile,
                                        auth: auth,
                                        app: app,
                                        user: user
                                    }}
                                /> */}
                                <Stack.Screen name="EditGoalScreen" component={EditGoalScreen} />
                                <Stack.Screen name="EditGoalNutritionScreen" component={EditGoalNutritionScreen} options={options} />
                                <Stack.Screen name="EditGoalBodyScreen" component={EditGoalBodyScreen} options={options} />
                                <Stack.Screen name="RegisterWeightScreen" component={RegisterWeightScreen} options={options} />
                                <Stack.Screen name="EditBodyScreen" component={EditBodyScreen} options={options} />
                                <Stack.Screen name="BodyHelpScreen" component={BodyHelpScreen} options={options} />
                                <Stack.Screen name="AddWaterScreen" component={AddWaterScreen} options={options} />
                                <Stack.Screen name="PedometerScreen" component={PedometerScreen} options={options} />
                                <Stack.Screen name="BodyShapeScreen" component={BodyShapeScreen} options={options} />
                                <Stack.Screen name="AddSleepScreen" component={AddSleepScreen} options={options} />
                                <Stack.Screen name="FoodFindScreen" component={FoodFindScreen} options={options} />
                                <Stack.Screen name="FoodDetailScreen" component={FoodDetailScreen} options={options} />
                                <Stack.Screen name="EditFoodIngredients" component={EditFoodIngredients} options={options} />
                                <Stack.Screen name="IngredientsSearchScreen" component={IngredientsSearchScreen} options={options} />
                                <Stack.Screen name="IngredientAmountScreen" component={IngredientAmountScreen} options={options} />
                                <Stack.Screen name="CreateFoodScreen" component={CreateFoodScreen} options={options} />
                                <Stack.Screen name="AddCaloryScreen" component={AddCaloryScreen} options={options} />
                                <Stack.Screen name="NotesScreen" component={NotesScreen} options={options} />
                                <Stack.Screen name="AddNoteScreen" component={AddNoteScreen} options={options} />
                                <Stack.Screen name="InviteScreen" component={InviteScreen} options={options} />
                                <Stack.Screen name="ActivityScreen" component={ActivityScreen} options={options} />
                                <Stack.Screen name="ActivityDetailsScreen" component={ActivityDetailsScreen} options={options} />
                                <Stack.Screen name="PersonalActivityDetailsScreen" component={PersonalActivityDetailsScreen} options={options} />
                                <Stack.Screen name="SleepDetailScreen" component={SleepDetailScreen} options={options} />
                                <Stack.Screen name="BarcodeScreen" component={BarcodeScreen} options={options} />
                                <Stack.Screen name="PersonalActivityScreen" component={PersonalActivityScreen} options={options} />
                                <Stack.Screen name="MessagesScreen" component={MessagesScreen} options={options} />
                                <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} options={options} />
                                <Stack.Screen name="SupportScreen" component={SupportScreen} options={options} />
                                <Stack.Screen name="FoodAllergiesScreen" component={FoodAllergiesScreen} options={options} />
                                <Stack.Screen name="SecurityScreen" component={SecurityScreen} options={options} />
                                <Stack.Screen name="ReportScreen" component={ReportScreen} options={options} />
                                <Stack.Screen name="MessageDetailScreen" component={MessageDetailScreen} options={options} />
                                <Stack.Screen name="RemindersListScreen" component={RemindersListScreen} options={options} />
                                <Stack.Screen name="RemindersDetailScreen" component={RemindersDetailScreen} options={options} />
                                <Stack.Screen name="PackagesScreen" component={PackagesScreen} options={options} />
                                <Stack.Screen name="PaymentScreen" component={PaymentScreen} options={options} />
                                <Stack.Screen name="NutritionDetailsScreen" component={NutritionDetailsScreen} options={options} />
                                <Stack.Screen name="PaymentResultScreen" component={PaymentResultScreen} options={options} />
                                <Stack.Screen name="PrivacyPolicyScreen" component={PrivacyPolicyScreen} options={options} />
                                <Stack.Screen name="GuideScreen" component={GuideScreen} options={options} />
                                <Stack.Screen name="OxygenFittScreen" component={OxygenFittScreen} options={options} />
                                <Stack.Screen name="DatabaseSyncScreen" component={DatabaseSyncScreen} options={options} />
                                <Stack.Screen name="ReferencesScreen" component={ReferencesScreen} options={options} />
                                <Stack.Screen name="AnalyzMealScreen" component={AnalyzMeal} options={options} />
                                <Stack.Screen name="InformationProductScreen" component={InformationProductScreen} options={options} />
                                <Stack.Screen name="ChatScreen" component={ChatScreen} options={options} />
                                <Stack.Screen name="PedometerTabScreen" component={PedometerTabScreen} options={options} />
                                <Stack.Screen name="BillScreen" component={BillScreen} options={options} />
                                <Stack.Screen name="DietStartScreen" component={DietStartScreen} options={options} />
                                <Stack.Screen name="ChooseDietTargetScreen" component={ChooseDietTargetScreen} options={options} />
                                <Stack.Screen name="chooseActivityDietScreen" component={chooseActivityDietScreen} options={options} />
                                <Stack.Screen name="DietAlergies" component={DietAlergies} options={options} />
                                <Stack.Screen name="DietDifficulty" component={DieteDifficulty} options={options} />
                                <Stack.Screen name="DietConfirmation" component={DietConfirmation} options={options} />
                                <Stack.Screen name="DietPlanScreen" component={DietPlan} options={options} />
                                <Stack.Screen name="RecipeCatScreen" component={RecipeCatScreen} options={options} />
                                <Stack.Screen name="RecipeDetailsScreen" component={recipeDetails} options={options} />
                                <Stack.Screen name="BlogScreen" component={BlogScreen} options={options} />
                                <Stack.Screen name="BodyAnalyzeScreen" component={BodyAnalyzeScreen} options={options} />
                                <Stack.Screen name="BlogCatScreen" component={BlogCatScreen} options={options} />
                                <Stack.Screen name="SetRefferalCode" component={SetRefferalCode} options={options} />
                                <Stack.Screen name="FastingDietplan" component={FastingDietplan} options={options} />
                                <Stack.Screen name="RecipeFilterScreen" component={RecipeFilterScreen} options={options} />
                               

                            </> :
                            <Stack.Screen name="WelcomeRouter" component={WelcomeRouter} options={options} /> :
                        <Stack.Screen name="LoginRoutes" component={LoginRoutes} options={options} />
            }

            <Stack.Screen name="TestScreen" component={TestScreen} options={options} />
        </Stack.Navigator>
        // </NavigationContainer>
    )
}


export default MainRoute