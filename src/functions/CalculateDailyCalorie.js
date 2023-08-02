import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment'
import { Alert } from 'react-native';

export const calculateCalorie = ({ profile, specification, user,diet }) => {
    const birthdayMoment = moment(profile.birthDate.split('/').join('-'));
    const nowMoment = moment();
    const age = nowMoment.diff(birthdayMoment, 'years');
    const height = profile.heightSize;
    let targetWeight = profile.targetWeight;
    const weight = specification[0].weightSize;
    const wrist = specification[0].wristSize;
    let activityRate = profile.dailyActivityRate;
    let bmr = 1;
    let factor = !isNaN(parseFloat(wrist)) ? height / wrist : null;
    let bodyType = null;
    let targetCalorie = 0;
    let carbo = 0;
    let pro = 0;
    let fat = 0;
    let weightChangeRate = profile.weightChangeRate;

    if (profile.gender == 1) {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
        if (factor > 10.4) bodyType = 1;
        else if (factor < 9.6) bodyType = 3;
        else bodyType = 2;
    } else {
        bmr = 10 * weight + 6.25 * height - 5 * age - 161;
        if (factor > 11) bodyType = 1;
        else if (factor < 10.1) bodyType = 3;
        else bodyType = 2;
    }

    switch (activityRate) {
        case 10:
            targetCalorie = bmr * 1;
            break;
        case 20:
            targetCalorie = bmr * 1.2;
            break;
        case 30:
            targetCalorie = bmr * 1.375;
            break;
        case 40:
            targetCalorie = bmr * 1.465;
            break;
        case 50:
            targetCalorie = bmr * 1.55;
            break;
        case 60:
            targetCalorie = bmr * 1.725;
            break;
        case 70:
            targetCalorie = bmr * 1.9;
            break;
    }

    const targetCaloriPerDay = (7700 * weightChangeRate * 0.001) / 7;
    // checkForZigZagi
    if (weight > targetWeight) {
        if (!diet.isActive || diet.isBuy == false) {
          if (user.countryId === 128) {
            if (moment().day() == 4) {
              targetCalorie *= 1.117;
            } else if (moment().day() == 5) {
              targetCalorie *= 1.116;
            } else {
              targetCalorie *= 0.97;
            }
          } else {
            if (moment().day() == 6) {
              targetCalorie *= 1.117;
            } else if (moment().day() == 0) {
              targetCalorie *= 1.116;
            } else {
              targetCalorie *= 0.97;
            }
          }
        }
        targetCalorie -= targetCaloriPerDay;
      } else if (weight < targetWeight) {
        targetCalorie += targetCaloriPerDay;
      }

    targetCalorie = parseInt(targetCalorie);

    if (factor) {
        switch (bodyType) {
            case 1:
                fat = targetCalorie * 0.32;
                carbo = targetCalorie * 0.33;
                pro = targetCalorie * 0.35;
                break;
            case 2:
                fat = targetCalorie * 0.3;
                carbo = targetCalorie * 0.49;
                pro = targetCalorie * 0.21;
                break;
            case 3:
                fat = targetCalorie * 0.4;
                carbo = targetCalorie * 0.35;
                pro = targetCalorie * 0.25;
                break;
        }
    } else {
        fat = targetCalorie * 0.33;
        carbo = targetCalorie * 0.33;
        pro = targetCalorie * 0.34;
    }
    console.error(targetCalorie, carbo, fat / 9, pro);
    return { targetCalorie:  parseInt(
        !diet.isActive || diet.isBuy == false
          ? targetCalorie
          : targetCalorie * 1.03,
      ), targetCarbo: parseInt(carbo / 4), targetFat: parseInt(fat / 9), targetPro: parseInt(pro / 4) }
};

export const calculateCalorieForDietPackage = ({ profile, specification, user,diet,targetWeight,weight,weightChangeRate,activityRate }) => {
    const birthdayMoment = moment(profile.birthDate.split('/').join('-'));
    const nowMoment = moment();
    const age = nowMoment.diff(birthdayMoment, 'years');
    const height = profile.heightSize;
    // let targetWeight = profile.targetWeight;
    const wrist = specification[0].wristSize;
    let bmr = 1;
    let factor = !isNaN(parseFloat(wrist)) ? height / wrist : null;
    let bodyType = null;
    let targetCalorie = 0;
    let carbo = 0;
    let pro = 0;
    let fat = 0;

    if (profile.gender == 1) {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
        if (factor > 10.4) bodyType = 1;
        else if (factor < 9.6) bodyType = 3;
        else bodyType = 2;
    } else {
        bmr = 10 * weight + 6.25 * height - 5 * age - 161;
        if (factor > 11) bodyType = 1;
        else if (factor < 10.1) bodyType = 3;
        else bodyType = 2;
    }

    switch (activityRate) {
        case 10:
            targetCalorie = bmr * 1;
            break;
        case 20:
            targetCalorie = bmr * 1.2;
            break;
        case 30:
            targetCalorie = bmr * 1.375;
            break;
        case 40:
            targetCalorie = bmr * 1.465;
            break;
        case 50:
            targetCalorie = bmr * 1.55;
            break;
        case 60:
            targetCalorie = bmr * 1.725;
            break;
        case 70:
            targetCalorie = bmr * 1.9;
            break;
    }

    const targetCaloriPerDay = (7700 * weightChangeRate * 0.001) / 7;
    // checkForZigZagi
    if (weight > targetWeight) {
        // if (!diet.isActive || diet.isBuy == false) {
        //   if (user.countryId === 128) {
        //     if (moment().day() == 4) {
        //       targetCalorie *= 1.117;
        //     } else if (moment().day() == 5) {
        //       targetCalorie *= 1.116;
        //     } else {
        //       targetCalorie *= 0.97;
        //     }
        //   } else {
        //     if (moment().day() == 6) {
        //       targetCalorie *= 1.117;
        //     } else if (moment().day() == 0) {
        //       targetCalorie *= 1.116;
        //     } else {
        //       targetCalorie *= 0.97;
        //     }
        //   }
        // }
        targetCalorie -= targetCaloriPerDay;
      } else if (weight < targetWeight) {
        targetCalorie += targetCaloriPerDay;
      }

    targetCalorie = parseInt(targetCalorie);
    console.error(targetCalorie, carbo, fat / 9, pro);
    return { targetCalorie:  targetCalorie}
};

