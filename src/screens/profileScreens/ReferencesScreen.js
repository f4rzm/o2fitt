import React from 'react';
import {
  StyleSheet,
  Text,
  ScrollView,
  Linking
} from 'react-native';
import { Toolbar } from "../../components"
import { dimensions } from '../../constants/Dimensions';
import { defaultTheme } from '../../constants/theme';
import { useSelector, useDispatch } from 'react-redux'
import { moderateScale } from 'react-native-size-matters';
import ParsedText from 'react-native-parsed-text';

const ReferencesScreen = props => {

  const lang = useSelector(state => state.lang)

  return (
    <>
      <Toolbar
        lang={lang}
        title={lang.references}
        onBack={() => props.navigation.goBack()}
      />
      <ScrollView contentContainerStyle={{ alignItems: "center" }} showsVerticalScrollIndicator={false}>
        <ParsedText
          style={styles.context}
          parse={
            [
              { type: 'url', style: styles.url, onPress: url => Linking.openURL(url) }
            ]
          }
          childrenProps={{ allowFontScaling: false }}
        >
          {
            `
Introduction
We have used reputable references to control the calories and nutritional values of foods and calculate body Indexes such as BMI, BMR, IW, etc. along with formulas, which are as follows:
A. Food and Nutrition Information
The nutritional values provided in the application are based on the latest information obtained from the U.S. DEPARTMENT OF AGRICULTURE, which is available at the following link:
USDA
B. Calculations of daily calorie requirement, ideal weight, body mass index, etc. are based on information obtained from a website, which also extracted the relevant information from the United States Department of Health & Human Services (HHS). The following links refer to them.
https://www.calculator.net/fitness-and-health-calculator.html
www.hhs.gov
We have also mentioned some formulas for example:
BMI Calculator
BMI is a measurement of a person's leanness or corpulence based on their height and weight, and is intended to quantify tissue mass. It is widely used as a general indicator of whether a person has a healthy body weight for their height. Specifically, the value obtained from the calculation of BMI is used to categorize whether a person is underweight, normal weight, overweight, or obese depending on what range the value falls between. These ranges of BMI vary based on factors such as region and age, and are sometimes further divided into subcategories such as severely underweight or very severely obese. Being overweight or underweight can have significant health effects, so while BMI is an imperfect measure of healthy body weight, it is a useful indicator of whether any additional testing or action is required. Refer to the table below to see the different categories based on BMI that is used by the calculator.
BMI table for adults
This is the World Health Organization's (WHO) recommended body weight based on BMI values for adults. It is used for both men and women, age 18 or older.

Category          BMI range - kg/m2

Severe Thinness            < 16
Moderate Thinness       16 - 17
Mild Thinness                17 - 18.5
Normal                           18.5 - 25
Overweight                     25 - 30
Obese Class I                  30 - 35
Obese Class II                 35 - 40
Obese Class III                > 40
      
      
Calorie Calculator
The Calorie Calculator can be used to estimate the number of calories a person needs to consume each day.
This Calorie Calculator is based on several equations, and the results of the calculator are based on an estimated average. Of these equations, the Mifflin-St Jeor Equation is considered the most accurate equation for calculating BMR. 
The equation used by the calculator is listed below:

Mifflin-St Jeor Equation:

For men:
BMR = 10W + 6.25H - 5A + 5
For women:
BMR = 10W + 6.25H - 5A – 161

The value obtained from these equations is the estimated number of calories a person can consume in a day to maintain their body-weight, assuming they remain at rest. This value is multiplied by an activity factor (generally 1.2-1.95), dependent on a person's typical levels of exercise, in order to obtain a more realistic value for maintaining body-weight (since people are less likely to be at rest throughout the course of an entire day). 1 pound, or approximately 0.45 kg, equates to about 3,500 calories. As such, in order to lose 1 pound per week, it is recommended that 500 calories be shaved off the estimate of calories necessary for weight maintenance per day. For example, if a person has an estimated allotment of 2,500 calories per day to maintain body-weight, consuming 2,000 calories per day for one week would theoretically result in 3,500 calories (or 1 pound) lost during the period.
It is important to remember that proper diet and exercise is largely accepted as the best way to lose weight. It is inadvisable to lower calorie intake by more than 1,000 calories per day, as losing more than 2 pounds per week can be unhealthy, and can result in the opposite effect in the near future by reducing metabolism. Losing more than 2 pounds a week will likely involve muscle loss, which in turn lowers BMR, since more muscle mass results in higher BMR. Excessive weight loss can also be due to dehydration, which is unhealthy. Furthermore, particularly when exercising in conjunction with dieting, maintaining a good diet is important, since the body needs to be able to support its metabolic processes and replenish itself. Depriving the body of the nutrients it requires as part of heavily unhealthy diets can have serious detrimental effects, and weight lost in this manner has been shown in some studies to be unsustainable, since the weight is often regained in the form of fat (putting the participant in a worse state than when beginning the diet). As such, in addition to monitoring calorie intake, it is important to maintain levels of fiber intake as well as other nutritional necessities to balance the needs of the body.
C. Calorie burned
We use the MET index to calculate the calories burned by exercise. A MET is a ratio of your working metabolic rate relative to your resting metabolic rate. Metabolic rate is the rate of energy expended per unit of time. It's one way to describe the intensity of an exercise or activity. One MET is the energy you spend sitting at rest — your resting or basal metabolic rate.
Click on the link below for more information:
https://en.wikipedia.org/wiki/Metabolic_equivalent_of_task
      
      `
          }
        </ParsedText>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    width: dimensions.WINDOW_WIDTH * 0.9,
    fontSize: moderateScale(18),
    lineHeight: moderateScale(27),
    textAlign: "left",
    color: defaultTheme.darkText,
    marginVertical: moderateScale(16)
  },
  context: {
    width: dimensions.WINDOW_WIDTH * 0.88,
    fontSize: moderateScale(16),
    lineHeight: moderateScale(27),
    textAlign: "left",
    color: defaultTheme.gray,
    marginBottom: moderateScale(25)
  },
  url: {
    color: defaultTheme.blue
  }

});

export default ReferencesScreen;
