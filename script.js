// ===================================
// 🌊 Stella Lake Report - Gen 2
// ===================================


// ThingSpeak Setup
const CHANNEL_ID = "3432049";


// Stella Lake Coordinates
const LAT = 45.7955;
const LON = -89.1615;



// ===================================
// LOAD LIVE DATA
// ===================================

async function getWeather(){

try{


// -------- ThingSpeak Data --------

let lakeResponse = await fetch(
`https://api.thingspeak.com/channels/${CHANNEL_ID}/feeds/last.json`
);

let lakeData = await lakeResponse.json();


let airTemp = Math.round(Number(lakeData.field2));
let waterTemp = Math.round(Number(lakeData.field3));


document.getElementById("airTemp").value = airTemp;
document.getElementById("waterTemp").value = waterTemp;



// -------- Weather Data --------

let weatherResponse = await fetch(
`https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=wind_speed_10m,wind_gusts_10m,cloud_cover,precipitation_probability&temperature_unit=fahrenheit&wind_speed_unit=mph`
);


let weather = await weatherResponse.json();



document.getElementById("windSpeed").value =
Math.round(weather.current.wind_speed_10m);


document.getElementById("gusts").value =
Math.round(weather.current.wind_gusts_10m);


document.getElementById("clouds").value =
weather.current.cloud_cover;


document.getElementById("rain").value =
weather.current.precipitation_probability;



document.getElementById("weatherStatus").innerHTML =
"✅ Live Stella Lake Data Loaded";


}


catch(error){

console.log(error);

document.getElementById("weatherStatus").innerHTML =
"❌ Data Loading Failed";

}


}




// ===================================
// SCORING FUNCTIONS
// ===================================


function tempScore(value,minGood,maxGood,minBad,maxBad){

if(value >= minGood && value <= maxGood){
return 100;
}


if(value < minGood){

return Math.max(
0,
100 - ((minGood-value)/(minGood-minBad))*100
);

}


return Math.max(
0,
100 - ((value-maxGood)/(maxBad-maxGood))*100
);

}



function ridingWindScore(wind){


if(wind <= 5)
return 100;


if(wind <= 10)
return 85;


if(wind <= 15)
return 60;


return 25;

}



// ===================================
// CALCULATE LAKE SCORE
// ===================================


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



let windScore =
ridingWindScore(wind);



let waterScore =
tempScore(water,75,82,50,95);



let airScore =
tempScore(air,75,85,40,105);



// Weather score

let weatherScore =
100 - (clouds*.4) - (rain*.6);

weatherScore =
Math.max(0,weatherScore);




// -------- Activities --------


// Wakeboard
let wakeboard =
(
windScore*.40 +
waterScore*.25 +
airScore*.25 +
weatherScore*.10
);


// Wakesurf
let wakesurf =
(
windScore*.30 +
waterScore*.30 +
airScore*.30 +
weatherScore*.10
);


// Ski
let ski =
(
windScore*.40 +
waterScore*.25 +
airScore*.25 +
weatherScore*.10
);


// Tube

let tubeWind = 70;

if(wind >=5 && wind <=15){
tubeWind = 100;
}


let tube =
(
tubeWind*.10 +
waterScore*.30 +
airScore*.40 +
weatherScore*.20
);



wakeboard=Math.round(wakeboard);
wakesurf=Math.round(wakesurf);
ski=Math.round(ski);
tube=Math.round(tube);



let overall =
Math.round(
(wakeboard+wakesurf+ski+tube)/4
);




// ===================================
// DISPLAY RESULTS
// ===================================


document.getElementById("wakeboard").innerHTML =
wakeboard+"/100";


document.getElementById("surf").innerHTML =
wakesurf+"/100";


document.getElementById("ski").innerHTML =
ski+"/100";


document.getElementById("tube").innerHTML =
tube+"/100";


document.getElementById("overall").innerHTML =
overall+"/100";




// Rating

let text;


if(overall >=95)
text="🔥 Legendary Lake Day";

else if(overall>=85)
text="🚤 Excellent Conditions";

else if(overall>=70)
text="😎 Good Lake Day";

else if(overall>=50)
text="🙂 Average Day";

else
text="🌧️ Poor Conditions";


document.getElementById("description").innerHTML =
text;




// Winner

let activities = {

"🏄 Wakeboard":wakeboard,

"🌊 Wakesurf":wakesurf,

"🎿 Ski":ski,

"🛟 Tube":tube

};


let winner =
Object.keys(activities).reduce(
(a,b)=>
activities[a]>activities[b]?a:b
);


document.getElementById("winner").innerHTML =
winner;




// Boat recommendation

if(overall>=85){

document.getElementById("boat").innerHTML =
"YES 🚤🔥 Take the boat out!";

}

else{

document.getElementById("boat").innerHTML =
"Wait for better conditions.";

}


}



// ===================================
// SAVE LAKE DAY
// ===================================


function saveDay(){


let today =
new Date().toLocaleDateString();


let score =
document.getElementById("overall").innerHTML;


localStorage.setItem(
"lastLakeDay",
today+" - "+score
);


document.getElementById("saved").innerHTML =
"✅ Saved: "+today+" "+score;


}
