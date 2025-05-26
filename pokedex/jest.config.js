module.exports = {
    preset: "jest-expo",
    transform: {
        "^.+\\.tsx?$": "ts-jest",
    },
    testEnvironment: "node",
    // setupFilesAfterEnv: [],
    transformIgnorePatterns: [
        "node_modules/(?!(jest-)?react-native|@react-native|expo(nent)?|@expo(nent)?/.*|@react-navigation/.*)",
    ],
};
