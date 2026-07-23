// =======================================
// 🌊 Stella Lake Report V2.0
// Part 1 - Data + Scoring Engine
// =======================================


// ThingSpeak
const CHANNEL_ID = "3432049";


// Stella Lake coordinates
const LAT = 45.7955;
const LON = -89.1615;



// Current values
let lakeData = {

air: 0,
water: 0,
wind: 0,
gust: 0,
clouds: 0,
rain: 0

};



// =======================================
// LOAD LIVE DATA
// =======================================


async function loadData(){


try{


document.getElementById("status").innerHTML =
"⏳ Loading Stella Lake...";



// ThingSpeak

let lakeResponse =
await fetch(
`https://api.thingspeak.com/channels/${CHANNEL_ID}/feeds/last.json`
);


let lake =
await lakeResponse.json();



lakeData.air =
Math.round(Number(lake.field2));


lakeData.water =
Math.round(Number(lake.field3));





// Weather

let weatherResponse =
await fetch(

`https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=wind_speed_10m,wind_gusts_10m,cloud_cover,precipitation_probability&temperature_unit=fahrenheit&wind_speed_unit=mph`

);


let weather =
await weatherResponse.json();




lakeData.wind =
Math.round(weather.current.wind_speed_10m);


lakeData.gust =
Math.round(weather.current.wind_gusts_10m);


lakeData.clouds =
weather.current.cloud_cover;


lakeData.rain =
weather.current.precipitation_probability;



displayConditions();


calculateScores();



document.getElementById("status").innerHTML =
"✅ Stella Lake Updated";


}

catch(error){


console.log(error);


document.getElementById("status").innerHTML =
"❌ Unable to load data";


}


}




// =======================================
// DISPLAY CONDITIONS
// =======================================


function displayConditions(){


document.getElementById("airDisplay").innerHTML =
lakeData.air+"°F";


document.getElementById("waterDisplay").innerHTML =
lakeData.water+"°F";


document.getElementById("windDisplay").innerHTML =
lakeData.wind+" mph";


document.getElementById("cloudDisplay").innerHTML =
lakeData.clouds+"%";


document.getElementById("rainDisplay").innerHTML =
lakeData.rain+"%";


}





// =======================================
// SCORING FUNCTIONS
// =======================================


// Temperature scoring
// Gets harsher the colder it gets

function temperatureScore(
temp,
perfectLow,
perfectHigh,
badLow
){


if(temp >= perfectLow && temp <= perfectHigh)
return 100;



if(temp < perfectLow){


let difference =
perfectLow-temp;


return Math.max(
0,
100-(difference*difference*2)
);


}



let difference =
temp-perfectHigh;


return Math.max(
0,
100-(difference*difference)
);


}





// Wind scoring for wake sports

function wakeWindScore(wind){


if(wind <=5)
return 100;


if(wind <=8)
return 90;


if(wind <=10)
return 75;


if(wind <=12)
return 55;


if(wind <=14)
return 35;



return 10;


}




// Wakesurf handles wind better

function surfWindScore(wind){


if(wind <=8)
return 100;


if(wind <=12)
return 85;


if(wind <=15)
return 65;


if(wind <=20)
return 35;


return 10;


}




// Tubing likes some wind

function tubeWindScore(wind){


if(wind >=5 && wind <=15)
return 100;


if(wind <5)
return 80;


if(wind <=20)
return 75;


if(wind <=30)
return 50;


return 20;


}




// Weather score

function weatherScore(){


return Math.max(
0,
100 -
(lakeData.clouds*.4) -
(lakeData.rain*.6)
);


}





// Hard limits
// Stops perfect wind from hiding bad conditions


function applyLimits(score, activity){



let air =
lakeData.air;


let water =
lakeData.water;


let wind =
lakeData.wind;



if(
(activity==="wakeboard" ||
activity==="ski")
&& wind>=15
){

score=Math.min(score,20);

}



if(
(activity==="wakeboard" ||
activity==="ski")
&& air<55
){

score=Math.min(score,20);

}



if(
air<50
){

score=Math.min(score,5);

}




if(
water<60
){

score=Math.min(score,20);

}



if(
water<55
){

score=Math.min(score,5);

}



return Math.round(score);


}
// =======================================
// Part 2 - Results + Recommendations
// =======================================



function calculateScores(){


let weather =
weatherScore();


// Temperature scores

let air =
temperatureScore(
lakeData.air,
75,
85,
40
);


let water =
temperatureScore(
lakeData.water,
75,
82,
50
);



// Activity scores


let wakeboard =
(
wakeWindScore(lakeData.wind)*0.40 +
water*0.25 +
air*0.25 +
weather*0.10
);



let wakesurf =
(
surfWindScore(lakeData.wind)*0.30 +
water*0.30 +
air*0.30 +
weather*0.10
);



let ski =
(
wakeWindScore(lakeData.wind)*0.40 +
water*0.25 +
air*0.25 +
weather*0.10
);



let tube =
(
tubeWindScore(lakeData.wind)*0.10 +
water*0.30 +
air*0.40 +
weather*0.20
);




// Apply limits

wakeboard =
applyLimits(
wakeboard,
"wakeboard"
);


ski =
applyLimits(
ski,
"ski"
);


wakesurf =
applyLimits(
wakesurf,
"wakesurf"
);


tube =
applyLimits(
tube,
"tube"
);




// Overall score

let overall =
Math.round(
(wakeboard+wakesurf+ski+tube)/4
);



// Display


document.getElementById("wakeboardScore").innerHTML =
wakeboard+"/100";


document.getElementById("surfScore").innerHTML =
wakesurf+"/100";


document.getElementById("skiScore").innerHTML =
ski+"/100";


document.getElementById("tubeScore").innerHTML =
tube+"/100";


document.getElementById("overallScore").innerHTML =
overall+"%";



// Rating

let rating;


if(overall>=95)
rating="🔥 Legendary Lake Day";

else if(overall>=85)
rating="🚤 Excellent Conditions";

else if(overall>=70)
rating="😎 Great Lake Day";

else if(overall>=50)
rating="🙂 Decent Conditions";

else
rating="🌧️ Poor Lake Day";


document.getElementById("lakeRating").innerHTML =
rating;




// Personality

document.getElementById("lakePersonality").innerHTML =
getPersonality(
overall
);




// Winner

let activities = {

"🏄 Wakeboard":wakeboard,

"🌊 Wakesurf":wakesurf,

"🎿 Ski":ski,

"🛟 Tube":tube

};


let winner =
Object.keys(activities)
.reduce(
(a,b)=>
activities[a]>activities[b]?a:b
);



document.getElementById("winner").innerHTML =
winner;


document.getElementById("winnerReason").innerHTML =
getWinnerReason(winner);




// Individual reasons

document.getElementById("wakeboardReason").innerHTML =
activityReason("wakeboard");


document.getElementById("surfReason").innerHTML =
activityReason("wakesurf");


document.getElementById("skiReason").innerHTML =
activityReason("ski");


document.getElementById("tubeReason").innerHTML =
activityReason("tube");




// Boat

if(overall>=85){

document.getElementById("boatDecision").innerHTML =
"YES 🚤🔥";

document.getElementById("boatReason").innerHTML =
"Great conditions. Get on the water!";

}

else{

document.getElementById("boatDecision").innerHTML =
"WAIT ⏳";

document.getElementById("boatReason").innerHTML =
"Conditions could be better.";

}




// Extra sections

document.getElementById("lakeIQ").innerHTML =
getLakeIQ();


document.getElementById("fortune").innerHTML =
getFortune();



}







// =======================================
// Messages
// =======================================



function getPersonality(score){


let list;


if(score>=95){

list=[
"Glass water, warm temps, and perfect timing.",
"One of those summer days you remember."
];

}

else if(score>=85){

list=[
"Prime lake conditions.",
"Grab the boat and enjoy the day."
];

}

else if(score>=70){

list=[
"Solid lake day.",
"Not perfect, but definitely worth riding."
];

}

else{

list=[
"The lake is asking for another day."
];

}


return list[
Math.floor(Math.random()*list.length)
];


}




function activityReason(activity){


if(lakeData.air<55)
return "🥶 Cold air temperature is limiting this activity.";


if(lakeData.water<60)
return "🌊 Cold water is making this less comfortable.";


if(lakeData.wind>15)
return "💨 Wind is creating rough conditions.";


if(lakeData.wind<=5)
return "🪞 Calm water conditions are excellent.";


return "✅ Conditions look good for this activity.";

}





function getWinnerReason(winner){


return winner+
" has the best combination of today's wind and temperatures.";


}




function getLakeIQ(){


if(lakeData.wind<=5)

return "🪞 Very calm water. Great time for tricks and smooth riding.";


if(lakeData.wind>=15)

return "💨 Wind is building. Earlier is probably better.";


if(lakeData.air<60)

return "🥶 Bring a sweatshirt. It will feel colder after getting wet.";


if(lakeData.water>75)

return "🔥 Warm water day. Perfect for long sessions.";


return "😎 Conditions look balanced today.";

}




function getFortune(){


let fortunes=[

"🎯 Land the trick you've been chasing.",

"🌅 Stay out for sunset if you can.",

"🚤 The best lake days are shared with friends.",

"😎 Enjoy every minute on the water.",

"🎶 Turn up the music and enjoy the ride.",

"🌊 One more set never hurts.",

"📸 Take a picture today. You'll want the memory.",

"🤙 Ride safe and have fun."

];


return fortunes[
Math.floor(Math.random()*fortunes.length)
];


}





// =======================================
// Save Lake Day
// =======================================


function saveLakeDay(){


let saved =
{

date:
new Date().toLocaleDateString(),

air:
lakeData.air,

water:
lakeData.water,

wind:
lakeData.wind

};


localStorage.setItem(
"stellaLakeDay",
JSON.stringify(saved)
);


document.getElementById("saved").innerHTML =
"✅ Lake day saved!";

}
