const config = {
    screens: {
        HomeScreen: {
            path: 'home',
            parse: {
                status: (status) => `${status}`,
            },
        },
        CountStepScreen: {
            path: 'CountStepScreen',
            parse: {
                status: (status) => `${status}`,
            },
        },
        AddWaterScreen: {
            path: 'AddWaterScreen',
            parse: {
                status: (status) => `${status}`,
            },
        },
        LoginScreen: {
            path: "loginscreen",
            parse: {
                status: (status) => `${status}`,
            },
        },
        EditGoalScreen: {
            path: "editgoalscreen",
            parse: {
                status: (status) => `${status}`,
            },
        },
        PaymentResultScreen: {
            path: "paymentResultScreen/:status",
            parse: {
                status: (status) => `${status}`,
            },
        }
    }
}

const linking = {
    prefixes: ["o2fitt://CountStepScreen", "https://bank.o2fitt.com", "https://test.o2fitt.com"],
    // prefixes: ["o2fitt://app"],
    config
}

export default linking;