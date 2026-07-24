// 🌊 Stella Lake Report V2.2
// Lake Journal


function getLakeJournal(){


    return JSON.parse(
        localStorage.getItem("lakeJournal")
    ) || [];


}







function saveLakeSession(session){



    let journal =
    getLakeJournal();



    journal.push(session);



    localStorage.setItem(

        "lakeJournal",

        JSON.stringify(journal)

    );



}








function saveToday(){



    if(!lakeData)
    return;



    let session={



        date:
        new Date()
        .toLocaleDateString(),



        score:
        Number(
            document.getElementById("lakeScore").innerHTML
        ),



        air:
        lakeData.current.air,



        water:
        lakeData.current.water,



        wind:
        lakeData.bestHour.wind,



        activity:
        "wakeboard",



        rating:null,



        notes:""

    };





    saveLakeSession(session);




    document.getElementById("saved").innerHTML =

    "✅ Lake day saved!";


}








function rateLakeDay(rating){



    let journal =
    getLakeJournal();



    if(journal.length===0)
    return;



    journal[
        journal.length-1
    ].rating = rating;




    localStorage.setItem(

        "lakeJournal",

        JSON.stringify(journal)

    );


}
