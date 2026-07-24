// 🌊 Stella Lake Report
// Settings File V2.2


const SETTINGS = {


    // ThingSpeak sensor

    thingSpeak: {

        channel: "3432049",

        airField: 2,

        waterField: 3

    },



    // Stella Lake location

    location: {

        name: "Stella Lake",

        latitude: 45.7955,

        longitude: -89.1615

    },



    // Ideal conditions
    // Based on your calibration

    ideal: {

        airTemperature: 85,

        waterTemperature: 80,

        perfectWindMin: 0,

        perfectWindMax: 5

    },



    // How much each factor matters

    weights: {

        wind: .50,

        water: .25,

        air: .20,

        weather: .05

    },



    // Favorite activity

    preferences: {

        mainActivity: "wakeboard",

        favoriteWindowStart: 8,

        favoriteWindowEnd: 18

    }


};
