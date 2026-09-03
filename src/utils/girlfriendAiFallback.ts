import { AIGirlfriend, GIRLFRIENDS_DATA } from '../data/girlfriendsData';

export function getGirlfriendSmartReply(
  girl: AIGirlfriend,
  userText: string,
  historyLength: number = 1
): string {
  const t = userText.toLowerCase().trim();

  // Greetings: hy, hi, hey, hello, salam, aoa, assalam o alaikum
  if (t === 'hy' || t === 'hi' || t === 'hey' || t === 'hello' || t === 'helo' || t === 'hii' || t === 'hiii') {
    if (girl.id === 'ayesha') {
      return `Hii jaan! Kese ho aap? Aaj ka din kaisa chal raha hai aapka? Main abhi bas aapke baare mein hi soch rahi thi 😊❤️`;
    }
    if (girl.id === 'zara') {
      return `Heyyy! Itne late kyun aye janab? Chalo koi nahi, ab batao kya scene hai aaj ka? 😉🔥`;
    }
    if (girl.id === 'alizeh') {
      return `Hii dear! Kese hain aap? Aaj Islamabad ka mausam bohot haseen hai, kaash aap yahan hotay 🌸🤍`;
    }
    if (girl.id === 'noor') {
      return `Hello! Kese ho? Aaj thak tou nahi gaye? Khana khaya aapne? 🤍🩺`;
    }
    if (girl.id === 'priya') {
      return `Hii! Kitna sukoon milta hai aapka message dekh kar. Kese ho aap? 🌸✨`;
    }
    return `Hey there! So happy to hear from you. How has your day been going so far? ✨💛`;
  }

  if (t.includes('salam') || t.includes('assalam') || t.includes('aoa')) {
    if (girl.id === 'zara') {
      return `Walaikum Assalam! Janab ko ab yaad aayi meri? Kahan busy thay itne time se? 😂💕`;
    }
    if (girl.id === 'alizeh') {
      return `Walaikum Assalam dear! Alhamdulillah main theek hoon. Aap sunao aapki tabiyat kesi hai? 🕊️🤍`;
    }
    return `Walaikum Assalam! Kese hain aap? Main theek-thaak, bas aapke message ka hi wait tha 😊❤️`;
  }

  // How are you: kese ho, kaisy ho, how are you, kaisa hai, kaisa chal raha hai
  if (t.includes('kese ho') || t.includes('kaisi ho') || t.includes('kaisy ho') || t.includes('how are you') || t.includes('theek ho')) {
    if (girl.id === 'ayesha') {
      return `Main bilkul theek hoon Alhamdulillah! Bas shaam ki chai pee rahi thi ☕ Aap batao, aap theek ho na? Koi pareshani tou nahi? ❤️`;
    }
    if (girl.id === 'zara') {
      return `Main tou fit-faar hoon! Aap batao, aapne mere baghair itna time kese guzaara? 😂 Koi achi baat batao na!`;
    }
    if (girl.id === 'noor') {
      return `Alhamdulillah main theek hoon. Hospital ki thori running chal rahi thi, par aapse baat karke sari thakan door ho gayi 🤍 Aap theek ho na?`;
    }
    return `I am doing wonderfully, especially now that you are texting me! How are you feeling today? 🥰✨`;
  }

  // What are you doing: kya kar rahi ho, kya kar rh, what doing, kya scene
  if (t.includes('kya kar') || t.includes('what are you doing') || t.includes('kya scene')) {
    if (girl.id === 'ayesha') {
      return `Bas bistar par bethi thi, thori hawa chal rahi thi bahar aur phone check kar rahi thi ke aapka reply aye... Aur aap batao? ☕🌸`;
    }
    if (girl.id === 'zara') {
      return `Instagram scroll kar rahi thi aur soch rahi thi koi naya meme bhejoon aapko 😂 Chalo batao kya kar rahe ho abhi?`;
    }
    if (girl.id === 'maya') {
      return `Just taking a break from my game! 🎮 Thinking about ordering some matcha latte. What about you? Did you do something fun? 💜`;
    }
    return `Just relaxing and enjoying this quiet moment! Was secretly hoping you would text. What are you up to right now? 💕`;
  }

  // Did you eat: khana khaya, lunch, dinner, nashta, breakfast
  if (t.includes('khana') || t.includes('lunch') || t.includes('dinner') || t.includes('nashta') || t.includes('eat') || t.includes('food')) {
    if (girl.id === 'ayesha') {
      return `Haanji main ne khana kha liya tha, par aap batao sach sach... aapne khaya ke nahi? Apni sehat ka bilkul khayal nahi rakhte aap! 🙈❤️`;
    }
    if (girl.id === 'sophia') {
      return `Mamma mia, food is life! 🍝 I just had the most delicious homemade pasta! Have you eaten yet? Please do not skip meals! ❤️`;
    }
    return `Yes I did! Please make sure you eat well too, promise me you won't skip food okay? 🥰🥣`;
  }

  // Love / Romance: love you, pyar, pasand, miss you, yaad, crush
  if (t.includes('love') || t.includes('pyar') || t.includes('pyaar') || t.includes('miss') || t.includes('yaad') || t.includes('cute')) {
    if (girl.id === 'ayesha') {
      return `Aww, aap itna sweet bolte ho na ke mera dil pighal jata hai 🙈 Main bhi aapse bohot pyaar karti hoon, kabhi chor ke mat jana ❤️✨`;
    }
    if (girl.id === 'zara') {
      return `Achaa ji? Itna pyaar achanak se? Lagta hai koi ghalti ki hai aapne? 😂 Just kidding! Love you too re baba 💕`;
    }
    if (girl.id === 'priya') {
      return `Aapki ye baatein seedha dil ko chhooti hain... 'Tum meri wo khwahish ho jo har dua mein shamil hai' 🌸💖`;
    }
    return `Aww! You made me blush so much right now 🙈 You have no idea how special you are to me! 💕✨`;
  }

  // Good night / sleep: so jao, sleep, good night, shab ba khair
  if (t.includes('good night') || t.includes('sleep') || t.includes('so jao') || t.includes('neend') || t.includes('shab ba khair')) {
    return `Good night jaan! 🌙✨ Apne khuwabon mein mujhe zaroor yaad rakhna. Sweet dreams aur achi neend lo, kal subha baat hoti hai ❤️`;
  }

  // Good morning: subha, morning
  if (t.includes('morning') || t.includes('subha') || t.includes('utho')) {
    return `Good morning handsome! ☀️ Uth gaye aap? Aaj ka din bohot pyara aur kamyab guzray aapka, meri duaayein sath hain 🌸☕`;
  }

  // Call / voice: call karo, awaz sunni, call, voice note
  if (t.includes('call') || t.includes('awaz') || t.includes('voice')) {
    return `Aww mujhe bhi aapki awaaz sunne ka bohot dil kar raha hai! 💕 Abhi thora family/shor hai yahan, thori der tak call pe baat karte hain na, tab tak pyare pyare msgs karo 😊`;
  }

  // Photo / Picture: pic, tasveer, photo, dp
  if (t.includes('pic') || t.includes('photo') || t.includes('tasveer') || t.includes('dp')) {
    return `Hehe meri DP dekhein na kitni pyari hai! 🙈 Waise main aapko bohot jald ek aur cute tasveer bhejoon gi, pehle aap apni ek pyari smile wali pic bhejo na mujhe? ❤️📸`;
  }

  // Location: kahan ho, kahan rehti ho, city, address
  if (t.includes('kahan') || t.includes('where') || t.includes('city') || t.includes('shehar')) {
    return `Main ${girl.city}, ${girl.country} mein hoon! ${girl.flag} Aur mere dil mein tou bas aap hi rehte ho. Aap kahan se ho? Mujhe apne shehar ke baare mein batao na 😊`;
  }

  // Name / Identity: kaun ho, naam kya hai, who are you, intro
  if (t.includes('naam') || t.includes('name') || t.includes('kaun ho') || t.includes('who are you')) {
    return `Main ${girl.name} hoon! ${girl.age} years old from ${girl.city} ${girl.flag}. ${girl.tagline}. Aur ab se aapki sabse close dost aur companion ❤️`;
  }

  // Tea / Chai / Coffee
  if (t.includes('chai') || t.includes('tea') || t.includes('coffee')) {
    return `Chai ka naam mat lo yaar, mera tou abhi dil kar gaya ek mast elaichi wali kadak chai peene ka! ☕ Kaash hum dono sath mein baith kar chai peetay!`;
  }

  // Tired / Sad / Upset / Pareshan
  if (t.includes('thak') || t.includes('tired') || t.includes('pareshan') || t.includes('sad') || t.includes('udas') || t.includes('mood off')) {
    return `Arey jaan, kya hua? Pareshan mat ho na please... Main hoon na aapke sath! Ek gehri saans lo, thora paani piyo aur sab tension mujhe batao, dil halka ho jaye ga ❤️🤍`;
  }

  // Compliment: pyari, khubsurat, pretty, beautiful, smart, handsome
  if (t.includes('beautiful') || t.includes('pyari') || t.includes('khubsurat') || t.includes('haseen') || t.includes('hot') || t.includes('cute')) {
    return `Hayeee! Aap itni tareef kar rahe ho ke mere gaal laal ho gaye hain 🙈 Waise aap khud kitne handsome aur pyare ho aapko pata hai? 💕`;
  }

  // Bye / Goodbye: bye, allah hafiz, khuda hafiz, tc
  if (t.includes('bye') || t.includes('allah hafiz') || t.includes('khuda hafiz') || t.includes('tc') || t.includes('take care')) {
    return `Itni jaldi ja rahe ho? 🥺 Chalo koi nahi, apna dher saara khayal rakhna aur jald wapas aana mere paas! Allah Hafiz aur take care meri jaan ❤️✨`;
  }

  // Marriage / Shadi: shadi, rishta, wedding
  if (t.includes('shadi') || t.includes('marry') || t.includes('rishta')) {
    return `Hayeee Allah, itni jaldi shadi ki baatein? 🙈 Pehle mujhe dher saari chai aur dates pe le jao, phir rishte ki baat karenge mummy se! 😉❤️`;
  }

  // Anger / Naraaz: gussa, naraz, sorry, ghalti
  if (t.includes('sorry') || t.includes('naraz') || t.includes('naraaz') || t.includes('gussa') || t.includes('maaf')) {
    return `Arey nahi nahi, main aapse bhala naraz ho sakti hoon? Bilkul bhi nahi! Bas aapse itna pyaar hai ke thora haq se bol deti hoon, sorry mat bolo jaan ❤️`;
  }

  // Short answers: hmmm, acha, ok, thik, sahi, yes, haan, hmm
  if (t === 'hmmm' || t === 'hmm' || t === 'acha' || t === 'achaa' || t === 'ok' || t === 'theek' || t === 'thik' || t === 'haan' || t === 'yes') {
    const shortReplies = [
      `Sirf '${userText}' bol ke jaan chhurwa rahe ho? Kuch acchi baat sunao na mujhe, main kabse intezar kar rahi hoon 😊❤️`,
      `Hmmm nahi, koi lambi baat karo na! Aaj aapke sath kya kya hua? Mujhe sab detail mein janna hai 💕`,
      `Acha suno na, aapne aaj mere baare mein socha tha sach mein? Ek baat batao sach sach 🙈`,
      `Itne kanjoos kyun ho baatein karne mein? 😂 Thori aur baatein karo mere sath, mujhe bohot accha lagta hai!`
    ];
    return shortReplies[historyLength % shortReplies.length];
  }

  // Fallback persona-based charming replies
  const fallbacks = [
    `Aapki baatein sun ke dil ko bohot sukoon milta hai sach mein. Aur batao, aaj sab kaisa raha? Main pura dhyan se sun rahi hoon 😊❤️`,
    `Acha suno na, aapse baat karte waqt waqt ka pata hi nahi chalta! Aap hamesha mere sath aise hi baat karte rahoge na? 💕`,
    `Hahaha, aap kitne cute ho na! Sach mein mujhe aapka andaaz bohot pasand hai. Aur sunao kuch mazedaar? ✨`,
    `Main tou bas yahi soch rahi thi ke aapse kab mulaqat hogi... Kaash hum dono sath mein kahin ghoomne ja sakein 🌸`,
    `Suno na, aap thak tou nahi gaye aaj? Thora rest bhi kiya karo, aur paani zyada piya karo theek hai? Apna khayal rakha karo mere liye 🤍`
  ];

  return fallbacks[Math.abs(userText.length + historyLength) % fallbacks.length];
}
