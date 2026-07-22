// ================================
// Stella Lake Report Gen 2
// ================================


// Weather API setup
// We will add your API key here later
const API_KEY = "d9b4edff8277d8748c979ece77088259";

const LAT = 45.7955;
const LON = -89.1615;



// ================================
// LIVE WEATHER
// ================================

async function getWeather(){

if(API_KEY === "YOUR_API_KEY"){

document.getElementById("weatherStatus").innerHTML =
"⚠️ Add weather API key first";

return;

}


try {

let url =
`https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&units=imperial&appid=${API_KEY}`;


let response = await fetch(url);

let data = await response.json();



document.getElementById("airTemp").value =
Math.round(data.main.temp);


document.getElementById("windSpeed").value =
Math.round(data.wind.speed);


document.getElementById("gusts").value =
Math.round(data.wind.gust || data.wind.speed);


document.getElementById("clouds").value =
data.clouds.all;


document.getElementById("rain").value =
data.rain ? 100 : 0;



document.getElementById("weatherStatus").innerHTML =
"✅ Weather Updated";


}

catch(error){

document.getElementById("weatherStatus").innerHTML =
"❌ Weather failed";

}

}



// ================================
// SCORE FUNCTIONS
// ================================


function rangeScore(value, perfectMin, perfectMax, badMin, badMax){

if(value >= perfectMin && value <= perfectMax)
return 100;


if(value < perfectMin){

return Math.max(
0,
100 - ((perfectMin-value)/(perfectMin-badMin))*100
);

}


return Math.max(
0,
100 - ((value-perfectMax)/(badMax-perfectMax))*100
);

}



// Wind score for riding
function windScore(wind){

if(wind <= 5)
return 100;

if(wind <= 10)
return 90;

if(wind <= 15)
return 60;

return 25;

}



// ================================
// CALCULATE
// ================================


function calculate(){


let water =
Number(document.getElementById("waterTemp").value);


let air =
Number(document.getElementById("airTemp").value);


let wind =
Number(document.getElementById("windSpeed").value);


let clouds =
Number(document.getElementById("clouds").value);


let rain =
Number(document.getElementById("rain").value);



// Weather score

let weather =
100 - (clouds*.4) - (rain*.8);

weather=Math.max(0,weather);



// Temperature scores

let waterScore =
rangeScore(water,75,82,50,90);


let airScore =
rangeScore(air,75,85,40,100);



let windRide =
windScore(wind);



// ================================
// ACTIVITIES
// ================================


// Wakeboard
let wake =
(
windRide*.40+
waterScore*.25+
airScore*.25+
weather*.10
);


// Wakesurf
let surf =
(
windRide*.30+
waterScore*.30+
airScore*.30+
weather*.10
);


// Ski
let ski =
(
windRide*.40+
waterScore*.25+
airScore*.25+
weather*.10
);



// Tube
let tubeWind;

if(wind >= 5 && wind <= 15)
tubeWind=100;
else
tubeWind=70;


let tube =
(
tubeWind*.10+
waterScore*.30+
airScore*.40+
weather*.20
);



wake=Math.round(wake);
surf=Math.round(surf);
ski=Math.round(ski);
tube=Math.round(tube);



let overall =
Math.round(
(wake+surf+ski+tube)/4
);



// ================================
// DISPLAY
// ================================


document.getElementById("wakeboard").innerHTML =
wake+"/100";

document.getElementById("surf").innerHTML =
surf+"/100";

document.getElementById("ski").innerHTML =
ski+"/100";

document.getElementById("tube").innerHTML =
tube+"/100";


document.getElementById("overall").innerHTML =
overall+"/100";



// Description

let description;


if(overall>=95)
description="🔥 Legendary Lake Day";

else if(overall>=85)
description="🚤 Excellent Conditions";

else if(overall>=70)
description="😎 Good Lake Day";

else if(overall>=50)
description="🙂 Average Conditions";

else
description="🌧️ Stay Home";


document.getElementById("description").innerHTML =
description;



// Winner

let activities = {

"🏄 Wakeboard":wake,

"🌊 Wakesurf":surf,

"🎿 Ski":ski,

"🛟 Tube":tube

};


let winner =
Object.keys(activities)
.reduce((a,b)=>
activities[a]>activities[b]?a:b);



document.getElementById("winner").innerHTML =
winner;



// Boat recommendation

if(overall>=85){

document.getElementById("boat").innerHTML =
"YES 🚤🔥 Take the boat out!";

}

else {

document.getElementById("boat").innerHTML =
"Maybe wait — conditions could be better.";

}


}



// ================================
// SAVE LAKE DAY
// ================================


function saveDay(){

let score =
document.getElementById("overall").innerHTML;


localStorage.setItem(
"lastLakeDay",
score
);


document.getElementById("saved").innerHTML =
"✅ Saved Lake Day: "+score;

}
