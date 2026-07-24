// 🌊 Stella Lake Report V2.2
// Analytics System



function getJournalData(){


    return JSON.parse(

        localStorage.getItem("lakeJournal")

    ) || [];


}








function calculateStats(){



    let days =
    getJournalData();





    if(days.length===0){


        return {


            total:0,


            average:0,


            best:null


        };


    }







    let totalScore=0;


    let totalWater=0;


    let totalAir=0;


    let totalWind=0;



    let best =
    days[0];





    days.forEach(day=>{


        totalScore += day.score;


        totalWater += day.water;


        totalAir += day.air;


        totalWind += day.wind;




        if(day.score > best.score){


            best=day;


        }


    });








    return {


        total:days.length,



        average:

        Math.round(
            totalScore/days.length
        ),



        averageWater:

        Math.round(
            totalWater/days.length
        ),



        averageAir:

        Math.round(
            totalAir/days.length
        ),



        averageWind:

        Math.round(
            totalWind/days.length
        ),



        best:best


    };


}








function updateStatsDisplay(){



    let stats =
    calculateStats();




    if(stats.total===0){


        document.getElementById("stats").innerHTML =

        "No saved lake days yet.";


        return;


    }





    document.getElementById("stats").innerHTML =



    `
    📅 Lake Days: ${stats.total}<br><br>

    ⭐ Average Score:
    ${stats.average}/100
    <br><br>

    🌊 Average Water:
    ${stats.averageWater}°F
    <br><br>

    🌡️ Average Air:
    ${stats.averageAir}°F
    <br><br>

    💨 Average Wind:
    ${stats.averageWind} mph
    <br><br>

    🏆 Best Day:
    ${stats.best.date}
    (${stats.best.score}/100)
    `;



}







window.addEventListener(

"load",

()=>{


    if(
    document.getElementById("stats")
    ){

        updateStatsDisplay();

    }


}

);
