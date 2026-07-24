// 🌊 Stella Lake Report V2.2
// Scoring Engine



function clamp(value){

    return Math.max(
        0,
        Math.min(100,value)
    );

}






function airTemperatureScore(temp){



    if(temp >= 82 && temp <=88)
        return 100;



    if(temp >=75)
        return 90;



    if(temp >=68)
        return 75;



    if(temp >=60)
        return 50;



    if(temp >=55)
        return 30;



    return 10;


}







function waterTemperatureScore(temp){



    if(temp >=80)
        return 100;



    if(temp >=77)
        return 90;



    if(temp >=74)
        return 80;



    if(temp >=70)
        return 60;



    if(temp >=65)
        return 35;



    return 15;


}







// Wakeboard / Ski wind

function wakeWindScore(wind){



    if(wind <=5)
        return 100;



    if(wind <=8)
        return 90;



    if(wind <=10)
        return 75;



    if(wind <=12)
        return 55;



    if(wind <=15)
        return 30;



    return 10;


}








// Wakesurf prefers slightly calmer conditions

function surfWindScore(wind){



    if(wind <=3)
        return 100;



    if(wind <=6)
        return 95;



    if(wind <=10)
        return 75;



    if(wind <=15)
        return 40;



    return 10;


}








// Tube likes some wind

function tubeWindScore(wind){



    if(wind >=8 && wind <=18)
        return 100;



    if(wind >=5)
        return 85;



    if(wind <=25)
        return 70;



    return 50;


}








function weatherScore(data){


    let score=100;



    score -= data.clouds * .2;



    score -= data.rain * .5;



    return clamp(score);


}








function calculateActivityScore(data,activity){



    let air =
    airTemperatureScore(data.air);



    let water =
    waterTemperatureScore(data.water);



    let weather =
    weatherScore(data);



    let wind;





    if(activity==="wakeboard"){


        wind =
        wakeWindScore(data.wind);



        return Math.round(

            wind*.50 +
            air*.25 +
            water*.20 +
            weather*.05

        );


    }





    if(activity==="surf"){


        wind =
        surfWindScore(data.wind);



        return Math.round(

            wind*.45 +
            air*.25 +
            water*.25 +
            weather*.05

        );


    }







    if(activity==="ski"){


        wind =
        wakeWindScore(data.wind);



        return Math.round(

            wind*.50 +
            air*.25 +
            water*.20 +
            weather*.05

        );


    }








    if(activity==="tube"){


        wind =
        tubeWindScore(data.wind);



        return Math.round(

            wind*.30 +
            air*.35 +
            water*.25 +
            weather*.10

        );


    }



}








function calculateAllActivities(data){



    return {


        wakeboard:
        calculateActivityScore(
            data,
            "wakeboard"
        ),



        surf:
        calculateActivityScore(
            data,
            "surf"
        ),



        ski:
        calculateActivityScore(
            data,
            "ski"
        ),



        tube:
        calculateActivityScore(
            data,
            "tube"
        )

    };


}
