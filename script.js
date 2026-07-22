function calculate(){

let air =
Number(document.getElementById("airTemp").value);

let feels =
Number(document.getElementById("feelsLike").value);

let water =
Number(document.getElementById("waterTemp").value);

let wind =
Number(document.getElementById("windSpeed").value);

let gusts =
Number(document.getElementById("gusts").value);

let clouds =
Number(document.getElementById("clouds").value);

let rain =
Number(document.getElementById("rain").value);

let wake = 100;

wake -= wind*3;
wake -= gusts;
wake -= rain*.5;
wake -= clouds*.15;

if(air<70) wake-=15;
if(water<70) wake-=20;

wake=Math.max(0,Math.min(100,wake));

let surf = wake-3;
let ski = wake+2;
let tube = wake+10;

surf=Math.min(100,surf);
ski=Math.min(100,ski);
tube=Math.min(100,tube);

let overall=Math.round((wake+surf+ski+tube)/4);

document.getElementById("overall").innerHTML=
overall+"/100";

document.getElementById("wakeboard").innerHTML=wake;
document.getElementById("surf").innerHTML=surf;
document.getElementById("ski").innerHTML=ski;
document.getElementById("tube").innerHTML=tube;

}
