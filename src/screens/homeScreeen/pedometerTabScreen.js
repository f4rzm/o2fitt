import React from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { MainToolbar, Toolbar } from '../../components';
import { GoalTabs } from '../../navigation/tabs/GoalTabs';
import { PedometerTabs } from '../../navigation/tabs/pedometerTab'
import moment from 'moment'


const PedoMeterTabScreen = props => {
    const lang = useSelector(state => state.lang)
    const app = useSelector(state => state.app)
    const profile =useSelector(state=>state.profile)
   
    
    const pkExpireDate = moment(profile.pkExpireDate, 'YYYY-MM-DDTHH:mm:ss');
    const today = moment();
    const hasCredit = pkExpireDate.diff(today, 'seconds') > 0 ? true : false;
    return (
        <>
            {/* <Toolbar
                lang={lang}
                title={lang.setStepTitle}
                onBack={() => props.navigation.goBack()}
            /> */}
            <PedometerTabs
                lang={lang}
                hascredit={hasCredit}
                date={props.route.params.date}
            />
        </>
    );
};


export default PedoMeterTabScreen;