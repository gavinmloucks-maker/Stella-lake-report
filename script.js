// =====================================
// 🌊 Stella Lake Report V2.1
// Main Engine - Part 1
// =====================================


// SETTINGS

const CONFIG = {

    thingSpeakChannel: "3432049",

    airField: 2,

    waterField: 3,

    latitude: 45.7955,

    longitude: -89.1615

};



// Current conditions

let lake = {

    air:0,

    water:0,

    wind:0,

    gust:0,

    clouds:0,

    rain:0

};



// Forecast storage

let forecastHours = [];




// =====================================
// LOAD EVERYTHING
// =====================================


async function loadData(){


try{


document.getElementById("status").innerHTML =
"⏳ Loading Stella Lake...";



await getThingSpeak();


await getWeather();



displayCurrent();



calculateDay();



document.getElementById("status").innerHTML =
"✅ Updated";


}


catch(error){

console.log(error);

document.getElementById("status").innerHTML =
"❌ " + error.message;

}

}


}





// =====================================
// THINGSPEAK
// =====================================


async function getThingSpeak(){


let response =
await fetch(

`https://api.thingspeak.com/channels/${CONFIG.thingSpeakChannel}/feeds/last.json`

);


let data =
await response.json();



lake.air =
Math.round(
Number(data[`field${CONFIG.airField}`])
);



lake.water =
Math.round(
Number(data[`field${CONFIG.waterField}`])
);



}






// =====================================
// WEATHER API
// =====================================


async function getWeather(){


let url =

`https://api.open-meteo.com/v1/forecast?latitude=${CONFIG.latitude}&longitude=${CONFIG.longitude}&hourly=temperature_2m,wind_speed_10m,wind_gusts_10m,cloud_cover,precipitation_probability&temperature_unit=fahrenheit&wind_speed_unit=mph&forecast_days=1`;




let response =
await fetch(url);



let data =
await response.json();



let times =
data.hourly.time;


forecastHours=[];



for(let i=0;i<times.length;i++){


let hour =
new Date(times[i]);



if(
hour.getHours() >=6 &&
hour.getHours() <=21
){


forecastHours.push({

time:hour,

air:data.hourly.temperature_2m[i],

wind:data.hourly.wind_speed_10m[i],

gust:data.hourly.wind_gusts_10m[i],

clouds:data.hourly.cloud_cover[i],

rain:data.hourly.precipitation_probability[i],

water:lake.water


});


}



}



lake.wind =
forecastHours[0]?.wind || 0;


lake.gust =
forecastHours[0]?.gust || 0;


lake.clouds =
forecastHours[0]?.clouds || 0;


lake.rain =
forecastHours[0]?.rain || 0;



}
// =====================================
// SCORING ENGINE
// =====================================



function tempScore(temp, ideal){


let difference =
Math.abs(temp - ideal);



if(difference <= 3)
return 100;


if(difference <= 7)
return 90;


if(difference <= 12)
return 70;


if(difference <= 18)
return 45;


return 20;


}





function waterScore(temp){


if(temp >= 80)
return 100;


if(temp >= 77)
return 95;


if(temp >= 74)
return 90;


if(temp >= 70)
return 80;


if(temp >= 67)
return 65;


if(temp >= 63)
return 45;


if(temp >=60)
return 25;


return 10;


}





function airScore(temp){


if(temp >=85 && temp <=90)
return 100;


if(temp >=80)
return 95;


if(temp >=75)
return 85;


if(temp >=70)
return 75;


if(temp >=65)
return 55;


if(temp >=60)
return 35;


if(temp >=55)
return 15;


return 5;


}





function wakeWindScore(wind){


if(wind <=5)
return 100;


if(wind <=7)
return 95;


if(wind <=9)
return 85;


if(wind <=10)
return 75;


if(wind <=12)
return 60;


if(wind <=14)
return 45;


if(wind <=16)
return 25;


return 10;


}





function surfWindScore(wind){


if(wind <=8)
return 100;


if(wind <=12)
return 80;


if(wind <=15)
return 55;


if(wind <=20)
return 30;


return 10;


}





function tubeWindScore(wind){


if(wind >=5 && wind <=15)
return 100;


if(wind <5)
return 85;


if(wind <=25)
return 70;


return 50;


}





function weatherScore(data){


let score=100;


score -= data.clouds*.25;

score -= data.rain*.5;


return Math.max(
0,
score
);


}







// =====================================
// ACTIVITY SCORE
// =====================================


function activityScore(data,type){


let air =
airScore(data.air);


let water =
waterScore(data.water);


let weather =
weatherScore(data);



let wind;



if(type==="wakeboard" || type==="ski"){


wind =
wakeWindScore(data.wind);


return Math.round(

wind*.45+
water*.25+
air*.20+
weather*.10

);


}



if(type==="surf"){


wind =
surfWindScore(data.wind);


return Math.round(

wind*.35+
water*.30+
air*.25+
weather*.10

);


}




if(type==="tube"){


wind =
tubeWindScore(data.wind);


return Math.round(

wind*.15+
water*.30+
air*.35+
weather*.20

);


}


}






// =====================================
// FIND BEST TIME
// =====================================


function findBest(type){


let best=null;


let bestScore=0;



forecastHours.forEach(hour=>{


let score =
activityScore(hour,type);



if(score>bestScore){


bestScore=score;


best={

...hour,

score:score

};


}


});



return best;


}







function calculateDay(){


let wake =
findBest("wakeboard");


let surf =
findBest("surf");


let ski =
findBest("ski");


let tube =
findBest("tube");



let overall =
Math.round(

(
wake.score+
surf.score+
ski.score+
tube.score
)/4

);



displayResults(
wake,
surf,
ski,
tube,
overall
);


}
// =====================================
// DISPLAY RESULTS
// =====================================


function displayCurrent(){


document.getElementById("airDisplay").innerHTML =
lake.air+"°F";


document.getElementById("waterDisplay").innerHTML =
lake.water+"°F";


document.getElementById("windDisplay").innerHTML =
Math.round(lake.wind)+" mph";


document.getElementById("cloudDisplay").innerHTML =
Math.round(lake.clouds)+"%";


}





function displayResults(
wake,
surf,
ski,
tube,
overall
){



document.getElementById("lakeScore").innerHTML =
overall;



document.getElementById("lakeMood").innerHTML =
getMood(overall);



document.getElementById("lakeSummary").innerHTML =
getSummary(overall);



document.getElementById("wakeScore").innerHTML =
wake.score+"/100";


document.getElementById("surfScore").innerHTML =
surf.score+"/100";


document.getElementById("skiScore").innerHTML =
ski.score+"/100";


document.getElementById("tubeScore").innerHTML =
tube.score+"/100";





let winner =
[
{
name:"🏄 Wakeboard",
score:wake.score
},

{
name:"🌊 Wakesurf",
score:surf.score
},

{
name:"🎿 Ski",
score:ski.score
},

{
name:"🛟 Tube",
score:tube.score
}

].sort(
(a,b)=>b.score-a.score
)[0];





document.getElementById("winner").innerHTML =
winner.name;



document.getElementById("winnerReason").innerHTML =
"Best conditions today with a score of "+
winner.score+"/100";





let best =
wake;



document.getElementById("bestTime").innerHTML =
formatTime(best.time);



document.getElementById("bestReason").innerHTML =
`
Score: ${best.score}/100<br>
🌡️ Air: ${Math.round(best.air)}°F<br>
💨 Wind: ${Math.round(best.wind)} mph<br>
🌊 Water: ${Math.round(best.water)}°F
`;




displayTimeline();


displayFactors(best);


displayAdvice(best);


}





// =====================================
// TIMELINE
// =====================================


function displayTimeline(){


let box =
document.getElementById("timeline");

box.innerHTML="";



forecastHours.forEach(hour=>{


let score =
activityScore(hour,"wakeboard");



let div =
document.createElement("div");


div.className="time";


if(score>=90)
div.className="time best";



div.innerHTML=

`
${formatTime(hour.time)}
<br>
${score}/100
<br>
💨 ${Math.round(hour.wind)} mph
🌡️ ${Math.round(hour.air)}°F
`;



box.appendChild(div);



});


}






function formatTime(time){


return time.toLocaleTimeString(
[],
{
hour:"numeric"
}
);


}





// =====================================
// PERSONALITY
// =====================================


function getMood(score){


if(score>=95)
return "🔥 Glass Factory";


if(score>=85)
return "😎 Classic Lake Day";


if(score>=70)
return "🌊 Solid Session";


if(score>=50)
return "🧊 Rideable";


return "⛈️ Stay Shore Side";


}






function getSummary(score){


if(score>=95)
return "One of those rare Stella Lake days. Get out there.";


if(score>=85)
return "Great conditions. The lake is calling.";


if(score>=70)
return "Definitely worth getting on the water.";


return "Conditions are limiting today.";

}







// =====================================
// EXPLANATIONS
// =====================================


function displayFactors(data){


let message="";



if(data.wind>10)

message += "💨 Wind is the biggest limitation.<br>";


else

message += "💨 Wind conditions are excellent.<br>";




if(data.air<65)

message += "🥶 Cold air will make falls feel colder.<br>";


else

message += "🌡️ Air temperature is comfortable.<br>";




if(data.water>=80)

message += "🌊 Water temperature is perfect.<br>";

else

message += "🌊 Water could be warmer.<br>";



document.getElementById("factorBreakdown").innerHTML =
message;


}








function displayAdvice(data){



document.getElementById("lakeIQ").innerHTML =

`
Best window is around ${formatTime(data.time)}.
<br><br>
${getIQMessage(data)}
`;



let decision =
data.score>=80
?
"YES 🚤"
:
"WAIT ⏳";



document.getElementById("boatDecision").innerHTML =
decision;



document.getElementById("boatReason").innerHTML =
data.score>=80
?
"Conditions are worth taking the boat out."
:
"Better conditions are likely coming.";





document.getElementById("fortune").innerHTML =
getFortune();



}





function getIQMessage(data){


if(data.wind<=5)

return "Calm water should make for smooth riding.";


if(data.wind>12)

return "Wind is the main thing hurting today's conditions.";


if(data.air<60)

return "Bring a sweatshirt. It will feel colder after getting wet.";


return "Conditions are balanced today.";

}






function getFortune(){


let list=[

"🌅 Stay for sunset if conditions hold.",

"🤙 One more set never hurts.",

"🚤 Good days on the lake make good memories.",

"🏄 Try something new today.",

"🌊 Enjoy every minute on the water."

];


return list[
Math.floor(Math.random()*list.length)
];


}





// =====================================
// JOURNAL
// =====================================


function saveLakeDay(){


let days =
JSON.parse(
localStorage.getItem("lakeDays")
)
|| [];



days.push({

date:
new Date().toLocaleDateString(),

water:
lake.water,

air:
lake.air,

wind:
lake.wind

});



localStorage.setItem(
"lakeDays",
JSON.stringify(days)
);



document.getElementById("saved").innerHTML =
"✅ Lake day saved!";



updateStats();

}





function updateStats(){


let days =
JSON.parse(
localStorage.getItem("lakeDays")
)
|| [];



if(days.length===0)
return;



document.getElementById("stats").innerHTML =

`
Lake Days: ${days.length}<br>
Average Water:
${Math.round(
days.reduce((a,b)=>a+b.water,0)/days.length
)}°F
`;

}
