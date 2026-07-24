const FORTUNES = [

"🌅 Stay until sunset if the lake stays calm.",

"🚤 Good lake days make great memories.",

"🏄 Try one new trick today.",

"🌊 The best runs are the ones you remember.",

"🤙 One more set might become your favorite.",

"☀️ The lake is calling. Answer it.",

"🌊 Smooth water, smooth riding.",

"🔥 Today could be a story you tell all winter.",

"🚤 Full tank. Good conditions. Great choice.",

"🏄 Progress happens one run at a time.",

"🌅 Some sunsets are better from the boat.",

"💦 Don't forget to enjoy the view between sets.",

"🌊 The lake rewards those who show up.",

"⭐ A good day on the water beats a perfect day anywhere else.",

"🚤 The boat belongs in the water today.",

"🏆 Future you will remember this session.",

"🌞 Sunscreen on. Music up. Let's ride.",

"🌊 Glass water creates glass memories.",

"🔥 Today has championship lake energy.",

"🤙 Take the victory lap.",

"🏄 Your future favorite trick might happen today.",

"🌅 Chase the calm water.",

"🚤 The best weather report is the one that gets you outside.",

"💙 Another summer memory unlocked.",

"🌊 The lake doesn't care about your plans. It rewards good timing.",

"☀️ Warm air, cool water, perfect combination.",

"🏄 Send it (responsibly).",

"🚤 Adventure starts when the boat leaves the dock.",

"🌊 Keep your eyes up and enjoy the ride.",

"🔥 This is why we wait all winter.",

"🌅 Golden hour might be waiting.",

"💦 Cold water, warm memories.",

"🏆 Today deserves a spot in the highlight reel.",

"🌊 Calm water is nature's playground.",

"🤙 Every great rider started with one more attempt.",

"🚤 Don't waste a beautiful lake day.",

"☀️ The forecast looks like fun.",

"🏄 Time to make some spray.",

"🌊 Let the lake reset you.",

"🔥 Perfect conditions don't happen every day.",

"🌅 Save some energy for sunset.",

"🚤 The dock can wait. The lake can't.",

"🏄 Make today a progression day.",

"🌊 Ride hard. Laugh harder.",

"⭐ Memories > perfect scores.",

"☀️ The lake is at its best when you're on it."

];



function getRandomFortune(){

    return FORTUNES[
        Math.floor(
            Math.random()*FORTUNES.length
        )
    ];

}
