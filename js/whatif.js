function recalcWhatIf() {
    let wind = Number(document.getElementById("wifWind").value);
    let air = Number(document.getElementById("wifAir").value);
    let water = Number(document.getElementById("wifWater").value);
    let clouds = Number(document.getElementById("wifClouds").value);

    document.getElementById("wifWindVal").innerHTML = wind;
    document.getElementById("wifAirVal").innerHTML = air;
    document.getElementById("wifWaterVal").innerHTML = water;
    document.getElementById("wifCloudsVal").innerHTML = clouds;

    let hour = { air: air, water: water, wind: wind, clouds: clouds, rain: 0 };
    let activity = SETTINGS.preferences.mainActivity;
    let score = calculateActivityScore(hour, activity);

    document.getElementById("wifScore").innerHTML = score;

    let breakdown = getScoreBreakdown(hour, activity);
    document.getElementById("wifNote").innerHTML =
        `Wind: ${breakdown.wind}/100 · Air: ${breakdown.air}/100 · Water: ${breakdown.water}/100`;
}

window.addEventListener("load", () => {
    if (document.getElementById("wifScore")) recalcWhatIf();
});
