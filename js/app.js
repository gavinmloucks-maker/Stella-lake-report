// 🌊 Stella Lake Report V2.2
// Main Application Controller

alert("App.js loaded");

let lakeData = null;







async function startLakeReport(){



    document.getElementById("status").innerHTML =
    "⏳ Loading Stella Lake...";



    try {



        let data =
        await getAllLakeData();





        let hours =
        buildHourlyConditions(

            data.forecast,

            data.current.water

        );





        let best =
        findAllBestTimes(hours);





        let overall =
        getOverallBest(best);






        lakeData={



            current:data.current,

            hours:hours,

            best:best,

            bestHour:overall.data



        };







        updateDashboard(lakeData);





        document.getElementById("bestTime").innerHTML =

        formatLakeTime(
            overall.data.time
        );





        document.getElementById("bestReason").innerHTML =

        `
        ${overall.name}<br>
        Score: ${overall.data.score}/100<br>
        Wind: ${Math.round(overall.data.wind)} mph<br>
        Air: ${Math.round(overall.data.air)}°F
        `;





        document.getElementById("status").innerHTML =

        "✅ Updated";





    }

    catch(error){



        console.log(error);



        document.getElementById("status").innerHTML =
"❌ " + error.message;


    }



}








function formatLakeTime(time){



    return new Date(time)
    .toLocaleTimeString(
        [],
        {
            hour:"numeric",
            minute:"2-digit"
        }
    );


}







// Update button from HTML

function loadData(){


    startLakeReport();


}







// Automatically load when opened




};
