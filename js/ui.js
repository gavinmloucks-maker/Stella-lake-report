// 🌊 Stella Lake Report V2.2
// User Interface Controller



function updateDashboard(data){



    let activities =
    calculateAllActivities(
        data.bestHour
    );



    let winner =
    Object.entries(activities)
    .sort(
        (a,b)=>b[1]-a[1]
    )[0];





    document.getElementById("lakeScore").innerHTML =
    Math.round(
        (
        activities.wakeboard+
        activities.surf+
        activities.ski+
        activities.tube
        )/4
    );



    document.getElementById("winner").innerHTML =
    winner[0];



    document.getElementById("wakeScore").innerHTML =
    activities.wakeboard+"/100";



    document.getElementById("surfScore").innerHTML =
    activities.surf+"/100";



    document.getElementById("skiScore").innerHTML =
    activities.ski+"/100";



    document.getElementById("tubeScore").innerHTML =
    activities.tube+"/100";





    updateConditions(data);



    updateMessages(data,winner);



}








function updateConditions(data){



    document.getElementById("airDisplay").innerHTML =
    Math.round(data.current.air)+"°F";



    document.getElementById("waterDisplay").innerHTML =
    Math.round(data.current.water)+"°F";



    document.getElementById("windDisplay").innerHTML =
    Math.round(data.bestHour.wind)+" mph";



    document.getElementById("cloudDisplay").innerHTML =
    Math.round(data.bestHour.clouds)+"%";



}








function updateMessages(data,winner){



    let score =
    document.getElementById("lakeScore").innerHTML;



    document.getElementById("lakeMood").innerHTML =
    getLakeMood(score);




    document.getElementById("lakeSummary").innerHTML =
    getLakeSummary(score);




    document.getElementById("winnerReason").innerHTML =

    `Best choice today based on wind, temperature, and water conditions.`;





    document.getElementById("factorBreakdown").innerHTML =

    explainFactors(data.bestHour);





    document.getElementById("lakeIQ").innerHTML =

    generateLakeIQ(data.bestHour);





    document.getElementById("boatDecision").innerHTML =

    score >= 80 ?
    "🚤 TAKE THE BOAT" :
    "⏳ MAYBE WAIT";





    document.getElementById("boatReason").innerHTML =

    score >=80 ?

    "Conditions are worth getting out there." :

    "The lake may improve later.";





    document.getElementById("fortune").innerHTML =
    getRandomFortune();





}








function getLakeMood(score){


    score = Number(score);



    if(score>=95)
        return "🔥 Glass Factory";


    if(score>=85)
        return "😎 Perfect Lake Day";


    if(score>=70)
        return "🌊 Solid Session";


    if(score>=50)
        return "🧊 Rideable";


    return "🌧️ Better Day Coming";


}








function getLakeSummary(score){



    if(score>=95)
        return "One of those days you remember all winter.";



    if(score>=85)
        return "Great conditions. Time to make some memories.";



    if(score>=70)
        return "Definitely worth a lake session.";



    return "Conditions are holding the day back.";



}








function explainFactors(hour){



    let text="";



    if(hour.wind<=5)

        text+="💨 Wind is excellent.<br>";

    else

        text+="💨 Wind is limiting the score.<br>";





    if(hour.air>=80)

        text+="🌡️ Air temperature feels great.<br>";

    else

        text+="🥶 Cooler air will make falls feel colder.<br>";





    if(hour.water>=80)

        text+="🌊 Perfect water temperature.<br>";

    else

        text+="🌊 Water is still warming up.<br>";



    return text;



}








function generateLakeIQ(hour){



    if(hour.wind<=5)

        return "Glass conditions expected. Great for tricks and smooth riding.";



    if(hour.wind>=12)

        return "Wind is the main thing hurting today's conditions.";



    return "Balanced conditions. Keep an eye on the wind.";

}








function getRandomFortune(){



    let fortunes=[


        "🌅 Stay until sunset if the lake stays calm.",


        "🤙 One more run might become your favorite one.",


        "🚤 Good lake days create great memories.",


        "🏄 Try something new today.",


        "🌊 Enjoy every minute on the water."


    ];



    return fortunes[
        Math.floor(
            Math.random()*fortunes.length
        )
    ];



}
