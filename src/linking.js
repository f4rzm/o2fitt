const config = {
    screens: {
        HomeScreen: {
            path: 'home'
        },
        CountStepScreen: {
            path: 'countStep'
        },
        LoginScreen: {
            path: "loginscreen"
        },
        EditGoalScreen: {
            path: "editgoalscreen"
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