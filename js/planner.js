// 🌊 Stella Lake Report V2.2
// Smart Ride Planner



function buildHourlyConditions(forecast,water){


    return forecast.map(hour=>{


        return {


            time:hour.time,


            air:hour.air,


            water:water,


            wind:hour.wind,


            gust:hour.gust,


            clouds:hour.clouds,


            rain:hour.rain


        };


    });


}







function findBestTime(hours,activity){



    let best = null;


    let highest = -1;



    hours.forEach(hour=>{


        let score =
        calculateActivityScore(
            hour,
            activity
        );



        if(score > highest){


            highest = score;



            best = {


                ...hour,


                score:score


            };


        }



    });



    return best;



}








function findAllBestTimes(hours){



    return {



        wakeboard:

        findBestTime(
            hours,
            "wakeboard"
        ),



        surf:

        findBestTime(
            hours,
            "surf"
        ),



        ski:

        findBestTime(
            hours,
            "ski"
        ),



        tube:

        findBestTime(
            hours,
            "tube"
        )

    };



}








function getOverallBest(best){



    let list=[


        {
            name:"🏄 Wakeboard",
            data:best.wakeboard
        },


        {
            name:"🌊 Wakesurf",
            data:best.surf
        },


        {
            name:"🎿 Ski",
            data:best.ski
        },


        {
            name:"🛟 Tube",
            data:best.tube
        }


    ];




    list.sort(
        (a,b)=>
        b.data.score-a.data.score
    );



    return list[0];



}








function compareCurrentToBest(current,best){



    let difference =
    best.score-current.score;



    if(difference <=5){


        return {

            message:
            "🚤 Go now! Conditions are already excellent.",

            improvement:0

        };


    }





    return {


        message:
        `⏳ Waiting could improve your day by about ${difference} points.`,


        improvement:difference


    };



}








function createTimeline(hours,activity){



    return hours.map(hour=>{


        return {


            time:
            hour.time,


            score:
            calculateActivityScore(
                hour,
                activity
            )


        };


    });


}








function getRideWindow(hours,activity){



    let timeline =
    createTimeline(
        hours,
        activity
    );



    let great =
    timeline.filter(
        x=>x.score>=90
    );



    if(great.length===0){


        return null;


    }





    return {


        start:
        great[0].time,


        end:
        great[great.length-1].time


    };


}
