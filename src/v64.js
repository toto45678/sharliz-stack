/* ===== v64: ALBUM v3 (Tzach, Oct 8: "246 regular stickers, at least 100 Sharliz story cards, and a super special gold
   section that is really really hard to get") =====
   Art comes from the graphics department in batches (art/stk_<id>.webp). A sticker is in the game only once its picture is
   there (STK3_ART, injected by build.py), so every batch shows up by itself and nothing a player has is ever taken away.
   - Sharliz chapter: the 24 classics + SHZ3 in 12 themed sections. A section starts on a new page (v57 sbPages), ☰ lists the
     sections, every full section opens its own chest; all of them full → the chapter chest (in ☰).
   - Story chapter: the 18 short stories (rare Sharliz on the rope, v58) + "The Sky Tower" (STORY3, 10 chapters): one card,
     in story order, for every 3 levels won (first wins), so the story unfolds as you play.
   - GOLD chapter: every gold sticker is a LEGENDARY FEAT (GFEAT: a long-term goal, shown on its slot with a progress bar);
     g30 = all the others. Earned only, and ONLY by finishing that card's feat (Tzach, Oct 8): never sold, not in the sticker shop,
     never in any pack (not even a golden pack). Gold stickers live in stkp.got like the Sharliz stickers (no doubles, never sold). */
// Album v3 sections: [secId,'English title','Hebrew title']
const SHZ_SEC=[
 ['sport','Sports','ספורט'],
 ['food','Food','אוכל'],
 ['music','Music and arts','מוזיקה ואמנות'],
 ['jobs','Jobs and dress-up','מקצועות והתחפשות'],
 ['animal','Animals and costumes','תחפושות חיות'],
 ['nature','Weather and nature','מזג אוויר וטבע'],
 ['play','Hobbies and play','תחביבים ומשחקים'],
 ['feel','Feelings','רגשות'],
 ['holiday','Holidays and seasons','חגים ועונות'],
 ['travel','Travel and places','טיולים ומקומות'],
 ['game','Game moments','רגעים במשחק'],
 ['fantasy','Fantasy and silly','פנטזיה ושטויות']];
// Album v3 Sharliz stickers: [id,rarity,'English name','Hebrew name','English line','Hebrew line',secId]
const SHZ3=[
 ['s025','c','Hoop star','כוכבת כדורסל','Spin it, balance it... SWISH!','לסובב, לאזן... סוויש!','sport'],
 ['s026','c','Tennis ace','אלופת טניס','Eyes on the ball. Always.','עיניים על הכדור. תמיד.','sport'],
 ['s027','c','Tiny boxer','מתאגרפת קטנה','Float like a jelly, sting like a bee.','מרחפת כמו ג׳לי, עוקצת כמו דבורה.','sport'],
 ['s028','c','Deep breath','נשימה עמוקה','Holding my breath... still holding...','עוצרת נשימה... עדיין עוצרת...','sport'],
 ['s029','r','Downhill zoom','גלישת סקי','Brakes? What brakes? WHEEE!','בלמים? איזה בלמים? ויייי!','sport'],
 ['s030','h','Ice dancer','רקדנית על הקרח','Spins until the ice gets dizzy.','מסתובבת עד שגם הקרח מסתחרר.','sport'],
 ['s031','c','Hi-ya!','הי־יא!','White belt, black-belt attitude.','חגורה לבנה, גישה של חגורה שחורה.','sport'],
 ['s032','c','Golfer','גולפאית','Please go in, please go in...','רק שייכנס, רק שייכנס...','sport'],
 ['s033','c','Bowling night','ערב באולינג','Strike... or gutter? Don\'t look!','סטרייק... או לתעלה? אל תסתכלו!','sport'],
 ['s034','c','Wipeout','נפילה מהגל','The wave won this round.','הגל ניצח בסיבוב הזה.','sport'],
 ['s035','c','Weightlifter','מרימת משקולות','Just... one... more...','רק... עוד... אחת...','sport'],
 ['s036','c','Bullseye!','בול פגיעה!','Didn\'t even look. (Totally looked.)','אפילו לא הסתכלתי. (הסתכלתי.)','sport'],
 ['s037','c','Bike ride','רכיבת אופניים','Wind in my face, grin on my face!','רוח בפנים וחיוך על הפנים!','sport'],
 ['s038','h','Champion!','אלופה!','Happy tears and a very big cup.','דמעות של שמחה וגביע ענק.','sport'],
 ['s039','c','Cheerleader','מעודדת','Give me an S! Give me an H!','תנו לי ש! תנו לי א!','sport'],
 ['s040','c','Goalie dive','שוערת מעופפת','Eyes shut. Still saved it!','עיניים עצומות. ועדיין הצילה!','sport'],
 ['s041','r','Sumo champ','אלוף סומו','Very serious. Very round.','רציני מאוד. עגול מאוד.','sport'],
 ['s042','c','Wall climber','מטפסת קירות','Don\'t look down. Don\'t look down.','לא להסתכל למטה. לא להסתכל למטה.','sport'],
 ['s043','r','Trampoline','טרמפולינה','Up, up and... still up!','למעלה, למעלה... ועוד למעלה!','sport'],
 ['s044','r','Finish line','קו הסיום','Tired, wobbly, and FIRST!','עייפה, מתנדנדת וראשונה!','sport'],
 ['s045','r','Pizza slice','משולש פיצה','The cheese goes on forever...','הגבינה נמתחת ונמתחת...','food'],
 ['s046','r','Hot hot hot!','חריף חריף!','Just one tiny drop. Big mistake.','רק טיפה קטנה. טעות גדולה.','food'],
 ['s047','c','Sushi master','מאסטר סושי','One tiny roll. Very proud.','רול קטן אחד. גאווה גדולה.','food'],
 ['s048','c','Cake face','פרצוף עוגה','Some cake went in. Most went on.','קצת עוגה בפה. רוב העוגה על הפנים.','food'],
 ['s049','c','Super sour','חמוץ־חמוץ','Lemon: 1. Sharliz: 0.','לימון: 1. שארליז: 0.','food'],
 ['s050','c','Movie night','ערב סרט','Shh! The best part is coming!','ששש! עכשיו מגיע החלק הכי טוב!','food'],
 ['s051','c','Donut ring','טבעת דונאט','Fashion you can eat.','אופנה שאפשר לאכול.','food'],
 ['s052','c','Endless noodle','ספגטי אינסופי','Slurrrrp! It\'s still going...','סלורררפ! זה עדיין לא נגמר...','food'],
 ['s053','c','No broccoli!','לא ברוקולי!','Bleh! Trees are not food.','איכס! עצים זה לא אוכל.','food'],
 ['s054','h','Pancake tower','מגדל פנקייקים','The only tower you\'re allowed to eat.','המגדל היחיד שמותר לאכול.','food'],
 ['s055','r','Cotton candy','צמר גפן מתוק','Stuck. Sweetly stuck.','תקועה. אבל במתיקות.','food'],
 ['s056','c','Watermelon bite','ביס אבטיח','Seeds everywhere! Worth it.','גרעינים בכל מקום! שווה את זה.','food'],
 ['s057','c','Taco trouble','בלגן טאקו','Help! The taco is falling apart!','הצילו! הטאקו מתפרק!','food'],
 ['s058','c','Cozy cocoa','שוקו חם','Marshmallows make everything better.','מרשמלו משפר הכול.','food'],
 ['s059','r','Cookie thief','גנבת עוגיות','What cookies? There are no cookies.','איזה עוגיות? אין פה עוגיות.','food'],
 ['s060','h','Bubble gum','מסטיק בועות','Bigger... bigger... POP!','עוד... ועוד... פוף!','food'],
 ['s061','c','Lazy picnic','פיקניק עצלן','Sandwich, sunshine, no plans.','כריך, שמש ואפס תוכניות.','food'],
 ['s062','c','Mega burger','מגה־המבורגר','It\'s bigger than me. I can do this!','הוא גדול ממני. אני אצליח!','food'],
 ['s063','c','Melting pop','ארטיק נמס','Eat faster! It\'s melting!','מהר! הוא נמס!','food'],
 ['s064','c','Berry sweet','תותית מתוקה','A strawberry hat. Sweet, right?','כובע תות. מתוק, נכון?','food'],
 ['s065','r','Wild drummer','מתופפת פרועה','Ba-dum-TSSS!','בה־דום־טססס!','music'],
 ['s066','c','Violin solo','סולו בכינור','So beautiful... *sniff*','כל כך יפה... *סניף*','music'],
 ['s067','c','Mix master','מלך המיקסים','Nod to the beat. Nod. Nod.','מהנהן לקצב. הנהון. הנהון.','music'],
 ['s068','r','Opera star','זמרת אופרה','One high note. One cracked glass.','צליל גבוה אחד. כוס סדוקה אחת.','music'],
 ['s069','c','Painter','הציירת','A masterpiece! (Also on my face.)','יצירת מופת! (גם על הפנים.)','music'],
 ['s070','c','Ballerina','בלרינה','Twirl, twirl, bow... wobble!','סיבוב, סיבוב, קידה... נדנוד!','music'],
 ['s071','c','Piano genius','גאונת פסנתר','Tiny piano. Huge concert.','פסנתר קטן. קונצרט ענק.','music'],
 ['s072','c','Karaoke queen','מלכת הקריוקי','Wrong notes, full heart!','זיופים, אבל מכל הלב!','music'],
 ['s073','c','Trumpet puff','חצוצרנית','Toot! (Cheeks may pop.)','טה־טה־טה! (הלחיים עוד יתפוצצו)','music'],
 ['s074','r','Breakdancer','רקדנית ברייק','Head spin! The world spins too.','סיבוב על הראש! גם העולם מסתובב.','music'],
 ['s075','c','Mini me','מיני אני','Sculpting the cutest model ever.','מפסלת את הדוגמנית הכי חמודה.','music'],
 ['s076','c','Say cheese!','תגידו צ׳יז!','Click! You look great. *wink*','קליק! יצאתם מעולה. *קריצה*','music'],
 ['s077','h','Magic trick','טריק קסם','Even the magician is surprised!','אפילו הקוסם מופתע!','music'],
 ['s078','c','Juggler','להטוטנית','Don\'t drop one... don\'t drop one...','רק לא להפיל... רק לא להפיל...','music'],
 ['s079','c','Accordion','אקורדיון','Stretchy music for a stretchy friend.','מוזיקה גמישה לחברה גמישה.','music'],
 ['s080','c','Director','הבמאית','Lights! Camera! ACTION!','אורות! מצלמה! אקשן!','music'],
 ['s081','h','Rainbow notes','צלילי קשת','Every colour has its own sound.','לכל צבע יש צליל משלו.','music'],
 ['s082','c','Shake shake!','שקשוק שקשוק!','Shake it till you laugh!','לשקשק עד שצוחקים!','music'],
 ['s083','r','Dreamy harp','נבל חלומי','Plays like a soft cloud.','מנגנת כמו ענן רך.','music'],
 ['s084','c','Marching band','תזמורת צועדת','Tall hat, even taller pride.','כובע גבוה, גאווה עוד יותר גבוהה.','music'],
 ['s085','r','Firefighter','כבאית','Brave, wet, and ready!','אמיצה, רטובה ומוכנה!','jobs'],
 ['s086','c','Doctor','הרופאה','Kind words are the best medicine.','מילה טובה היא התרופה הכי טובה.','jobs'],
 ['s087','c','Officer','השוטרת','Tweet! No stacking in the hallway!','פררר! אסור לבנות מגדלים במסדרון!','jobs'],
 ['s088','c','Builder','הבנאי','Measure twice, stack once.','למדוד פעמיים, לערום פעם אחת.','jobs'],
 ['s089','c','Farmer','החקלאית','Grows the crunchiest carrots.','מגדלת את הגזרים הכי פריכים.','jobs'],
 ['s090','r','Mad scientist','מדענית משוגעת','It\'s bubbling! That\'s good. Probably.','זה מבעבע! זה טוב. כנראה.','jobs'],
 ['s091','c','Mail carrier','הדוורית','Special delivery! (A bit soggy.)','משלוח מיוחד! (קצת רטוב)','jobs'],
 ['s092','r','Ace pilot','הטייסת','Fasten your seatbelts!','הדקו חגורות!','jobs'],
 ['s093','c','Teacher','המורה','Who knows the answer? Anyone?','מי יודע את התשובה? מישהו?','jobs'],
 ['s094','c','Baker','האופה','Flour cloud... ah... ah...','ענן קמח... אה... אה...','jobs'],
 ['s095','c','Gardener','הגנן','Grow, little sprout, grow!','תגדל, נבט קטן, תגדל!','jobs'],
 ['s096','c','Lifeguard','המציל','No cannonballs! Okay, just one.','בלי פצצות בבריכה! טוב, רק אחת.','jobs'],
 ['s097','h','Jelly King','מלך הג׳לי','Bow down. Or at least wobble.','השתחוו. או לפחות תתנדנדו.','jobs'],
 ['s098','h','Brave knight','אביר אמיץ','For the tower! Charge!','למען המגדל! הסתערות!','jobs'],
 ['s099','c','Cowboy','קאובוי','Yee-haw! Let\'s lasso the moon!','יי־הא! בואו נתפוס את הירח בלאסו!','jobs'],
 ['s100','r','Viking','ויקינג','To the tower! HOOOO!','אל המגדל! הוווו!','jobs'],
 ['s101','c','Clown','ליצן','Funny nose, even funnier laugh.','אף מצחיק, צחוק עוד יותר מצחיק.','jobs'],
 ['s102','c','Mechanic','מכונאית','Fixed it! Wait... what was it?','תיקנתי! רגע... מה זה היה?','jobs'],
 ['s103','c','Reporter','הכתבת','Breaking news: tower still standing!','מבזק: המגדל עדיין עומד!','jobs'],
 ['s104','c','Hairdresser','הספרית','No hair? No problem. Fabulous!','אין שיער? אין בעיה. מהממת!','jobs'],
 ['s105','c','Kitty pounce','חתלתולה','Meow! Pounce! ...Missed.','מיאו! זינוק! ...פספוס.','animal'],
 ['s106','c','Bunny hop','אוזני ארנב','Hop, hop, wobble, hop!','הופ, הופ, נדנוד, הופ!','animal'],
 ['s107','r','Little lion','אריה קטן','King of the jungle (height: small).','מלך הג׳ונגל (גובה: קטן).','animal'],
 ['s108','c','Froggy','צפרדעון','Gulp! Wait, was that a fly?','גלופ! רגע, זה היה זבוב?','animal'],
 ['s109','c','Penguin waddle','פינגווין מתנדנד','Waddle, waddle, slide!','נדנוד, נדנוד, החלקה!','animal'],
 ['s110','c','Busy bee','דבורה עסוקה','Bzzz! So much to do!','בזזז! יש כל כך הרבה מה לעשות!','animal'],
 ['s111','h','Unicorn dream','חד־קרן קסום','Sparkles not included. Just kidding!','נצנצים לא כלולים. סתם!','animal'],
 ['s112','c','Shark fin','סנפיר כריש','Dun dun... dun dun... hi!','דה־דם... דה־דם... היי!','animal'],
 ['s113','c','Bear hug','חיבוק דובי','A big hug, then a big nap.','חיבוק גדול, ואז שנ״צ גדול.','animal'],
 ['s114','c','Chill panda','פנדה רגועה','Bamboo for breakfast. And lunch.','במבוק לארוחת בוקר. וגם לצהריים.','animal'],
 ['s115','r','Wise owl','ינשוף חכם','Who knows? The owl knows.','מי יודע? הינשוף יודע.','animal'],
 ['s116','c','Sly fox','שועלה ערמומית','Has a plan. A sneaky plan.','יש לה תוכנית. תוכנית ערמומית.','animal'],
 ['s117','r','Little dragon','דרקונית קטנה','Puff! Oops, was that me?','פוף! אופס, זאת הייתי אני?','animal'],
 ['s118','h','Butterfly','פרפרית','Flutter, flutter, float away...','מרפרפת לה, מרחפת לה...','animal'],
 ['s119','c','Octo hat','כובע תמנון','Eight wiggly friends on my head.','שמונה חברים מתפתלים על הראש.','animal'],
 ['s120','r','Just hatched','רק בקעתי','Hello, world! You\'re so bright!','שלום, עולם! אתה כל כך מסנוור!','animal'],
 ['s121','c','Puppy love','כלבלב','Woof! Best day ever!','הב! היום הכי טוב אי פעם!','animal'],
 ['s122','c','Slow snail','חילזון איטי','In no hurry. Ever.','לא ממהר. אף פעם.','animal'],
 ['s123','c','Shy ladybug','פרת משה רבנו','Seven dots, one blush.','שבע נקודות, סומק אחד.','animal'],
 ['s124','c','Peekaboo turtle','צב מציץ','Is it safe to come out yet?','כבר אפשר לצאת?','animal'],
 ['s125','c','Puddle jump','קפיצה לשלולית','Splash! Rain is the best!','שפריץ! גשם זה הכי כיף!','nature'],
 ['s126','r','Thunder shock','הלם רעם','KA-BOOM! Who turned the sky up?','קה־בום! מי הגביר את השמיים?','nature'],
 ['s127','c','Snowman','בובת שלג','Frozen smile, warm heart.','חיוך קפוא, לב חם.','nature'],
 ['s128','c','Sunshine','יום שמש','Too bright! Still smiling.','מסנוור! אבל מחייכת.','nature'],
 ['s129','c','Windy day','רוח חזקה','Whoosh! Today we go sideways.','וווש! היום זזים הצידה.','nature'],
 ['s130','h','Rainbow ride','גלישה על קשת','Wheee! Down all seven colours!','וייי! במורד כל שבעת הצבעים!','nature'],
 ['s131','c','Twister','טורנדו','Round and round and round...','סביב, סביב, סביב...','nature'],
 ['s132','c','Leaf pile','ערמת עלים','Crunch! Jumped right in.','קראנץ׳! קפצתי פנימה.','nature'],
 ['s133','c','Flower crown','זר פרחים','Spring looks good on me.','האביב מתאים לי.','nature'],
 ['s134','c','Ouch, cactus!','אאוץ׳, קקטוס!','Rule number one: don\'t hug a cactus.','כלל מספר אחת: לא מחבקים קקטוס.','nature'],
 ['s135','c','Mushroom shade','צל של פטרייה','The coziest umbrella in the forest.','המטרייה הכי נעימה ביער.','nature'],
 ['s136','h','Wish upon a star','משאלה לכוכב','Close your eyes and wish big.','לעצום עיניים ולבקש בגדול.','nature'],
 ['s137','r','Moon nap','שנ״צ על הירח','Shh... the moon makes a great pillow.','ששש... הירח הוא כרית מעולה.','nature'],
 ['s138','r','Lava panic','בהלת לבה','Hot floor! HOT FLOOR!','הרצפה לוהטת! לוהטת!','nature'],
 ['s139','c','Snowball hit','פגיעת שלג','Hey! Who threw that?!','היי! מי זרק את זה?!','nature'],
 ['s140','r','Sunflower','חמנייה','Wow, you\'re even taller than me!','וואו, את אפילו יותר גבוהה ממני!','nature'],
 ['s141','c','Foggy','ערפל','Hello? Anyone? Is this the tower?','הלו? מישהו? זה המגדל?','nature'],
 ['s142','c','Heatwave','גל חום','Too hot... melting... puddle.','חם מדי... נמסה... שלולית.','nature'],
 ['s143','c','Ice cube','קוביית קרח','Brrr... can\'t... even... blink...','ברררר... לא... מצליחה... למצמץ...','nature'],
 ['s144','c','Beach builder','בנאית בחוף','Sand towers count too, right?','גם מגדלי חול נחשבים, נכון?','nature'],
 ['s145','c','Gamer','גיימרית','One more level. Just one.','עוד שלב אחד. רק אחד.','play'],
 ['s146','c','Bookworm','תולעת ספרים','Shh. Chapter 12 is SO good.','ששש. פרק 12 פשוט מעולה.','play'],
 ['s147','r','Kite flyer','מעיפה עפיפון','Higher! Higher! Not the tree!','גבוה יותר! גבוה יותר! לא לעץ!','play'],
 ['s148','c','Gone fishing','דייגת','A fish! A tiny one, but a fish!','דג! קטנטן, אבל דג!','play'],
 ['s149','r','Camp night','לילה באוהל','Toasting the perfect marshmallow.','צולה את המרשמלו המושלם.','play'],
 ['s150','r','Last piece','החלק האחרון','999 pieces later... DONE!','999 חלקים אחר כך... סיימתי!','play'],
 ['s151','h','Bubble dream','בועות סבון','Make a wish on every bubble.','משאלה על כל בועה.','play'],
 ['s152','c','Yo-yo knot','סבך יו־יו','The yo-yo won.','היו־יו ניצח.','play'],
 ['s153','c','Up and away','למעלה למעלה','Um... how do I get down?','אממ... איך יורדים מפה?','play'],
 ['s154','c','Paper plane','מטוס נייר','Fly far, little plane!','עוף רחוק, מטוס קטן!','play'],
 ['s155','c','Yarn wrap','עטופה בצמר','Knitted a scarf. And myself.','סרגתי צעיף. וגם את עצמי.','play'],
 ['s156','c','Chess master','אלוף שחמט','Hmm... checkmate in 47 moves.','הממ... מט בעוד 47 מסעים.','play'],
 ['s157','h','Stargazer','צופה בכוכבים','Wow. Space is BIG.','וואו. החלל ענקי.','play'],
 ['s158','c','Roller wobble','גלגיליות','Wobble... wobble... I\'m fine!','נדנוד... נדנוד... אני בסדר!','play'],
 ['s159','c','Sandbox','ארגז חול','Buried up to the middle. Worth it!','קבורה עד האמצע. שווה!','play'],
 ['s160','c','On the swing','בנדנדה','Higher, higher... to the sky!','גבוה, גבוה... עד השמיים!','play'],
 ['s161','c','Hide and seek','מחבואים','You\'ll never find me! *giggle*','לעולם לא תמצאו אותי! *צחקוק*','play'],
 ['s162','c','Tea party','מסיבת תה','More tea, darling?','עוד תה, יקירתי?','play'],
 ['s163','r','Sky trick','טריק באוויר','Up, up... and a perfect landing!','למעלה... ונחיתה מושלמת!','play'],
 ['s164','c','Lucky six','שש בקובייה','Six! Six! SIX!','שש! שש! שש!','play'],
 ['s165','c','Grumpy','עצבנית','Don\'t talk to me. Okay, a little.','אל תדברו איתי. טוב, רק קצת.','feel'],
 ['s166','h','In love','מאוהבת','My heart goes boom-boom-boom!','הלב עושה בום־בום־בום!','feel'],
 ['s167','c','So embarrassed','נבוכה','Please stop looking at me...','בבקשה, תפסיקו להסתכל עליי...','feel'],
 ['s168','c','Scaredy jelly','פחדנית','Wh-wh-what was that noise?','מ־מ־מה זה היה?','feel'],
 ['s169','c','Bored','משועממת','Yaaawn... is it over yet?','פיהוווק... זה כבר נגמר?','feel'],
 ['s170','c','Big sneeze','עיטוש ענק','ACHOO! Sorry about that.','אפצ׳י! סליחה על זה.','feel'],
 ['s171','c','Hiccups','שיהוקים','Hic! Sorry. Hic! Not again!','היק! סליחה. היק! שוב?!','feel'],
 ['s172','r','Rolling laughs','מתגלגלת מצחוק','Too funny! Can\'t stop!','מצחיק מדי! לא מצליחה להפסיק!','feel'],
 ['s173','c','Waterfall tears','מפל דמעות','It\'s fine. Totally fine. WAAAH!','הכול בסדר. ממש בסדר. ווואאאה!','feel'],
 ['s174','c','Steaming mad','רותחת מכעס','Counting to ten... one... two... GRRR!','סופרת עד עשר... אחת... שתיים... גררר!','feel'],
 ['s175','c','Confused','מבולבלת','Wait, which way is up?','רגע, איפה זה למעלה?','feel'],
 ['s176','r','Jaw drop','בהלם','WHAT?! No way!','מה?! אין מצב!','feel'],
 ['s177','r','So proud','גאה בעצמה','Did it all by myself!','עשיתי את זה לבד!','feel'],
 ['s178','c','Dozing off','נרדמת','Zzz... *drool bubble*... zzz','זזז... *בועת ריר*... זזז','feel'],
 ['s179','r','So excited!','מתרגשת!','Can\'t sit still! Bzzzz!','לא מסוגלת לשבת בשקט! בזזז!','feel'],
 ['s180','c','Shy','ביישנית','Hi... um... nice flower, right?','היי... אמ... פרח יפה, נכון?','feel'],
 ['s181','c','Jealous','קנאית','Why does SHE get the top spot?','למה דווקא היא למעלה?','feel'],
 ['s182','c','Phew!','פיו!','That was close. Too close.','היה קרוב. קרוב מדי.','feel'],
 ['s183','c','Mischief','שובבה','Heh heh heh... I have an idea.','חה חה חה... יש לי רעיון.','feel'],
 ['s184','h','Best friends','חברות הכי טובות','Two Sharliz, one big squishy hug.','שתי שארליז, חיבוק אחד גדול ורך.','feel'],
 ['s185','c','Pumpkin head','ראש דלעת','Trick or treat? Both, please!','ממתק או תעלול? שניהם, בבקשה!','holiday'],
 ['s186','c','Little vampire','ערפדה קטנה','I vant to suck... your juice box!','אני רוצה למצוץ... את המיץ שלך!','holiday'],
 ['s187','c','Mummy oops','מומיה מתפרקת','Uh oh. I\'m coming undone!','אוי לא. אני מתפרקת!','holiday'],
 ['s188','r','Flying witch','מכשפה מעופפת','Cackle cackle! Mind the moon!','חי־חי־חי! זהירות, ירח!','holiday'],
 ['s189','r','Santa Sharliz','סנטה שארליז','Ho ho ho! A gift for you!','הו הו הו! מתנה בשבילכם!','holiday'],
 ['s190','c','Reindeer','אייל הצפון','My nose glows! Need a light?','האף שלי זוהר! צריכים אור?','holiday'],
 ['s191','c','New Year!','שנה חדשה!','Toot toot! Hello, new year!','טררר! שלום, שנה חדשה!','holiday'],
 ['s192','c','Valentine','ולנטיין','Made you a heart. Be my friend?','הכנתי לך לב. נהיה חברים?','holiday'],
 ['s193','c','Painted egg','ביצה צבועה','Am I an egg? Kind of, yes.','אני ביצה? בערך, כן.','holiday'],
 ['s194','c','Birthday wish','משאלת יום הולדת','Blow! Blow! Okay, one more blow...','לנשוף! לנשוף! טוב, עוד נשיפה...','holiday'],
 ['s195','h','Fireworks','זיקוקים','Ooooh! Aaaah! One more!','אוווו! אהההה! עוד אחד!','holiday'],
 ['s196','r','Snow globe','כדור זכוכית מושלג','Shake me gently, please.','לנער בעדינות, בבקשה.','holiday'],
 ['s197','h','Sky lantern','פנס מעופף','Float up and carry my wish.','עוף למעלה עם המשאלה שלי.','holiday'],
 ['s198','r','Hanukkah glow','אור חנוכה','Eight nights of warm light.','שמונה לילות של אור חמים.','holiday'],
 ['s199','c','Cherry blossom','פריחת הדובדבן','Pink petals, happy heart.','עלי כותרת ורודים, לב שמח.','holiday'],
 ['s200','c','School day','חזרה לבית הספר','New backpack, new friends... gulp.','תיק חדש, חברים חדשים... גלופ.','holiday'],
 ['s201','c','Pool party','מסיבת בריכה','Splash! Summer is here!','שפריץ! הקיץ הגיע!','holiday'],
 ['s202','c','Cozy scarf','צעיף חמים','Scarf, cocoa and falling leaves.','צעיף, שוקו ועלים נושרים.','holiday'],
 ['s203','c','Chilly day','יום קר','Brrr! Look, my breath is a cloud!','ברררר! יוצא לי ענן מהפה!','holiday'],
 ['s204','c','Surprise gift','מתנת הפתעה','It\'s exactly what I wished for!','בדיוק מה שרציתי!','holiday'],
 ['s205','r','Balloon trip','טיול בכדור פורח','Hello down there! Bye down there!','שלום למטה! ביי למטה!','travel'],
 ['s206','h','Rocket ride','טיסת טיל','I said a SLOW rocket! SLOW!','ביקשתי טיל איטי! איטי!','travel'],
 ['s207','c','Choo choo!','צ׳ו צ׳ו!','All aboard the jelly express!','כולם לעלות לרכבת הג׳לי!','travel'],
 ['s208','c','Submarine','צוללת','Up periscope! What\'s down here?','פריסקופ למעלה! מה יש פה למטה?','travel'],
 ['s209','c','Lost explorer','חוקרת אבודה','The map says... left? Or up?','המפה אומרת... שמאלה? או למעלה?','travel'],
 ['s210','c','Pyramid top','בראש הפירמידה','Top of the pyramid! Now what?','בראש הפירמידה! ומה עכשיו?','travel'],
 ['s211','c','Bonjour Paris','בונז׳ור פריז','Oui oui! A baguette for two?','וי וי! באגט לשניים?','travel'],
 ['s212','c','Vine swing','קפיצת ליאנה','Aah-ee-aah-ee-AAAH!','אה־אי־אה־אי־אההה!','travel'],
 ['s213','c','Igloo home','בית איגלו','Cold outside. Colder inside.','קר בחוץ. קר יותר בפנים.','travel'],
 ['s214','c','Pirate sailor','פיראטית בים','Steer left! No, the OTHER left!','שמאלה! לא, השמאל השני!','travel'],
 ['s215','c','Window seat','ליד החלון','The clouds look like marshmallows!','העננים נראים כמו מרשמלו!','travel'],
 ['s216','c','Overpacked','מזוודה מפוצצת','Just one more thing... ZIP!','רק עוד דבר אחד... זיפ!','travel'],
 ['s217','r','Treasure map','מפת אוצר','X marks the spot!','האיקס מסמן את המקום!','travel'],
 ['s218','c','Road trip','טיול בדרכים','Are we there yet? Are we there yet?','כבר הגענו? כבר הגענו?','travel'],
 ['s219','r','Lighthouse keeper','שומרת המגדלור','Shining the way home.','מאירה את הדרך הביתה.','travel'],
 ['s220','c','Taxi!','מונית!','TAXI! Hello? TAXI!','מונית! הלו? מונית!','travel'],
 ['s221','c','Island hammock','ערסל באי','No towers today. Just waves.','היום בלי מגדלים. רק גלים.','travel'],
 ['s222','r','Summit!','בפסגה!','Made it to the top! Flag time!','הגעתי לפסגה! זמן לדגל!','travel'],
 ['s223','c','Snorkel','שנורקל','So many colours down here!','כמה צבעים יש פה למטה!','travel'],
 ['s224','h','Floating free','ריחוף בחלל','No up, no down, just stars.','אין למעלה, אין למטה, רק כוכבים.','travel'],
 ['s225','h','Perfect stack','נחיתה מושלמת','Right in the middle. Shiny!','בדיוק באמצע. נוצץ!','game'],
 ['s226','c','Wobbly top','מגדל מתנדנד','Nobody breathe. NOBODY.','שאף אחד לא ינשום. אף אחד!','game'],
 ['s227','c','Falling!','נופלת!','AAAAAH! (See you at the bottom.)','אאאאאא! (נתראה למטה)','game'],
 ['s228','r','Boss battle','קרב בוס','Big boss, bigger courage.','בוס גדול, אומץ גדול יותר.','game'],
 ['s229','h','Solid gold','זהב טהור','Worth a million coins. At least.','שווה מיליון מטבעות. לפחות.','game'],
 ['s230','c','Magnet trap','נדבקה למגנט','CLANG! I\'m stuck. Help?','קלאנג! נתקעתי. עזרה?','game'],
 ['s231','c','Bomb!','פצצה!','Tap it! TAP IT! Tap it now!','תקישו! תקישו! עכשיו!','game'],
 ['s232','c','Sticky goo','דביק!','Ew. Gooey. Not fun.','איכס. גועל. לא כיף.','game'],
 ['s233','c','Checkpoint','נקודת שמירה','Saved! Now I can breathe.','נשמר! עכשיו אפשר לנשום.','game'],
 ['s234','r','Coin shower','מקלחת מטבעות','It\'s raining coins! Hooray!','יורד גשם של מטבעות! יש!','game'],
 ['s235','c','Heart lost','לב אבוד','Oh no... one heart less.','אוי לא... לב אחד פחות.','game'],
 ['s236','c','Extra life','חיים נוספים','A new heart! I feel better.','לב חדש! איזה כיף.','game'],
 ['s237','c','Level up!','עליתי רמה!','New level, new me!','רמה חדשה, אני חדשה!','game'],
 ['s238','c','Dizzy','סחרחורת','The room is spinning. Or is it me?','החדר מסתובב. או שזו אני?','game'],
 ['s239','r','Shield bubble','בועת מגן','Bring it on! I\'m protected.','קדימה, תנסו! אני מוגנת.','game'],
 ['s240','c','Hat thief','גנב הכובעים','HEY! Give that back, crow!','היי! תחזיר את זה, עורב!','game'],
 ['s241','c','Wind gust','משב רוח','Lean... lean... don\'t fall!','להישען... להישען... לא ליפול!','game'],
 ['s242','r','Combo x5','קומבו x5','Five in a row! On fire!','חמש ברצף! בוערת!','game'],
 ['s243','c','Tower selfie','סלפי מגדל','Everybody smile! Don\'t wobble!','כולם לחייך! לא לזוז!','game'],
 ['s244','c','Victory dance','ריקוד ניצחון','We did it! Hop, hop, hooray!','הצלחנו! הופ, הופ, הידד!','game'],
['s271','h','Pirouette power','כוח הפירואט','Twirl! Poof! Bye-bye, bats!','סיבוב! פוף! ביי ביי, עטלפים!','game'],
['s272','r','Home sweet home','בית חם','My house, my sofa, my rules!','הבית שלי, הספה שלי, החוקים שלי!','game'],
 ['s245','r','Little fairy','פיה קטנה','Sprinkle, sparkle, wish!','פיזור, נצנוץ, משאלה!','fantasy'],
 ['s246','h','Lamp genie','השד מהמנורה','Three wishes? Make them towers!','שלוש משאלות? שיהיו מגדלים!','fantasy'],
 ['s247','c','Alien','חייזרית','Take me to your tower.','קחו אותי אל המגדל שלכם.','fantasy'],
 ['s248','c','Silly zombie','זומבי מצחיק','Braaains... I mean, snaaacks...','מוחוווות... כלומר, חטיפייים...','fantasy'],
 ['s249','r','Time traveler','נוסעת בזמן','Wait... what year is it?!','רגע... איזו שנה עכשיו?!','fantasy'],
 ['s250','c','Invisible','בלתי נראית','Now you see me... now you half do.','עכשיו רואים אותי... עכשיו רק חצי.','fantasy'],
 ['s251','c','Gentle giant','ענקית עדינה','Careful, little trees!','זהירות, עצים קטנים!','fantasy'],
 ['s252','c','Teeny tiny','קטנטונת','Hello? Down here! *squeak*','הלו? פה למטה! *ציוץ*','fantasy'],
 ['s253','c','Mirror mirror','מראה מראה','Who\'s the cutest? Me. Obviously.','מי הכי חמודה? אני. ברור.','fantasy'],
 ['s254','c','Double trouble','צרה כפולה','Wait... which one of us is me?','רגע... מי מאיתנו זאת אני?','fantasy'],
 ['s255','c','Balloon poodle','פודל מבלונים','Wait... am I a poodle now?','רגע... אני פודל עכשיו?','fantasy'],
 ['s256','c','Jelly wobble','רעד ג׳לי','Wibble wobble, jelly on a plate!','רוטטת ורועדת כמו ג׳לי בצלחת!','fantasy'],
 ['s257','c','Bouncy ball','כדור קופץ','Boing! Boing! Boooing!','בוינג! בוינג! בוווינג!','fantasy'],
 ['s258','c','Sleepwalker','סהרורית','Zzz... wait, where\'s the ground?','זזז... רגע, איפה הרצפה?','fantasy'],
 ['s259','c','Robot dance','ריקוד רובוטי','Click. Whirr. Dance mode: ON.','קליק. ווררר. מצב ריקוד: פועל.','fantasy'],
 ['s260','r','Hero landing','נחיתת גיבורים','Nailed the landing. Cracked the floor.','נחיתה מושלמת. רצפה סדוקה.','fantasy'],
 ['s261','c','Smoke vanish','נעלמת בעשן','Poof! *wink* Gone.','פוף! *קריצה* נעלמתי.','fantasy'],
 ['s262','c','Lagoon splash','שפריץ בלגונה','Tail splash! Everyone\'s soaked.','שפריץ זנב! כולם רטובים.','fantasy'],
 ['s263','c','Pirate parrot','תוכי פיראטים','Squawk! Get off my head!','קרררא! תרד לי מהראש!','fantasy'],
 ['s264','r','Fortune teller','מגדת עתידות','I see... a VERY tall tower.','אני רואה... מגדל ממש ממש גבוה.','fantasy'],
 ['s265','h','Dragon rider','רוכבת דרקונים','Faster, tiny dragon! Faster!','מהר יותר, דרקון קטן! מהר!','fantasy'],
 ['s266','c','Cloud bed','מיטת ענן','Softest bed in the whole sky.','המיטה הכי רכה בכל השמיים.','fantasy'],
 ['s267','h','Treasure!','אוצר!','All mine! Mine mine mine!','הכול שלי! שלי שלי שלי!','fantasy'],
 ['s268','c','Snow angel','מלאכית שלג','Shh... just me and the snow.','ששש... רק אני והשלג.','fantasy'],
 ['s269','c','Sticker fan','אספנית מדבקות','Got it, got it, NEED it!','יש, יש, יש... חסר!','fantasy'],
 ['s270','r','Thank you!','תודה!','Thanks for collecting us all!','תודה שאספתם את כולנו!','fantasy']];
// Story "The Sky Tower" chapters: [chapter,'English title','Hebrew title']
const STORY_CH=[
 [1,'The Dream','החלום'],
 [2,'The Big City','העיר הגדולה'],
 [3,'Sand and Sweets','חול וממתקים'],
 [4,'Ice and Ocean','קרח ואוקיינוס'],
 [5,'Fire and Stars','אש וכוכבים'],
 [6,'Jungle and Ghosts','ג׳ונגל ורוחות'],
 [7,'Clouds and Dinosaurs','עננים ודינוזאורים'],
 [8,'Robots and Crystals','רובוטים וקריסטלים'],
 [9,'The Sky Castle','טירת השמיים'],
 [10,'Home Again','שוב בבית']];
// Story cards: [id,'English title','Hebrew title','English caption','Hebrew caption',chapter]
const STORY3=[
 ['st19','Shooting star','כוכב נופל','A shooting star lands on the farm. A little teal Sharliz wakes up, amazed.','כוכב נופל נוחת בחווה. שארליז קטנה בצבע טורקיז מתעוררת בתדהמה.',1],
 ['st20','The secret','הסוד','The star whispers: “Build a tower tall enough to reach the Sky Castle.”','הכוכב לוחש: „בנו מגדל גבוה מספיק, ותגיעו לטירת השמיים.”',1],
 ['st21','Nobody believes','אף אחד לא מאמין','In the morning she tells her friends. They laugh: “A tower to the sky?”','בבוקר היא מספרת לחברים. הם צוחקים: „מגדל עד השמיים?”',1],
 ['st22','First try','ניסיון ראשון','Their first tower in the barnyard is three Sharliz high. It falls. Giggles!','המגדל הראשון בחצר: שלוש שארליז לגובה. הוא נופל. כולם מצחקקים!',1],
 ['st23','Practice time','זמן אימון','Among the sunflowers, they practise perfect landings again and again.','בין החמניות הם מתאמנים בנחיתות מושלמות, שוב ושוב.',1],
 ['st24','A new buddy','חבר חדש','A little chick hops over and chirps: “You can do it!”','אפרוח קטן מקפץ אליהם ומצייץ: „אתם יכולים!”',1],
 ['st25','Packing up','אורזים','They pack a tiny backpack full of snacks. Adventure time!','הם אורזים תיק קטן מלא חטיפים. יוצאים להרפתקה!',1],
 ['st26','Goodbye, farm','להתראות, חווה','Goodbye, farm! The old windmill waves in the wind.','להתראות, חווה! טחנת הרוח הישנה מנופפת להם ברוח.',1],
 ['st27','Map thief','גנב המפה','A crow snatches the map! The chase is on across the field.','עורב חוטף את המפה! מרדף פרוע לאורך השדה.',1],
 ['st28','The torn map','המפה הקרועה','They get the map back, a bit torn. A dotted path leads to the city.','המפה חוזרת, קצת קרועה. שביל מנוקד מוביל אל העיר.',1],
 ['st29','Skyscrapers!','גורדי שחקים!','The first skyscrapers! Everyone stares with mouths wide open.','גורדי השחקים הראשונים! כולם בוהים בפה פעור.',2],
 ['st30','Busy crossing','צומת סואן','Lost in a busy crossing. Honk! Honk! Which way now?','אבודים בצומת סואן. טוט! טוט! לאן עכשיו?',2],
 ['st31','The bridge boss','הבוס של הגשר','Pigeon Boomer blocks the bridge. The friends tremble.','יונה בומבה חוסמת את הגשר. החברים רועדים.',2],
 ['st32','Clever stack','מגדל חכם','One clever stack, and they hop right over the pigeons!','מגדל אחד חכם, והם מדלגים מעל היונים!',2],
 ['st33','Rooftop treat','פינוק על הגג','Ice cream on a rooftop as the sun goes down.','גלידה על הגג, בזמן שהשמש שוקעת.',2],
 ['st34','City lights','אורות העיר','At night the city sparkles, and the Ferris wheel glows.','בלילה העיר נוצצת, והגלגל הענק זוהר.',2],
 ['st35','Fountain slime','סליים מהמזרקה','Blub! A slime buddy oozes out of a fountain and joins the gang.','בלוב! סליים חמוד מבעבע מתוך מזרקה ומצטרף לחבורה.',2],
 ['st36','One umbrella','מטרייה אחת','A stormy night. Everyone squeezes under one umbrella.','לילה סוער. כולם נדחסים מתחת למטרייה אחת.',2],
 ['st37','Sewer eyes','עיניים בביוב','In Rat King\'s sewer, scary eyes glow in the dark...','בביוב של מלך העכברושים, עיניים מפחידות זוהרות בחושך...',2],
 ['st38','Downhill escape','בריחה במורד','They escape on a skateboard down the hill, cheering all the way!','הם בורחים על סקייטבורד במורד הגבעה ומריעים כל הדרך!',2],
 ['st39','Endless sand','חול בלי סוף','Sand, sand and more sand. Everyone is thirsty and droopy.','חול, חול ועוד חול. כולם צמאים ועייפים.',3],
 ['st40','Real oasis','נווה מדבר אמיתי','A mirage? No, a real oasis! Splash!','פטה מורגנה? לא, נווה מדבר אמיתי! שפריץ!',3],
 ['st41','Sandstorm','סופת חול','A sandstorm! They stack into a wall to protect the smallest one.','סופת חול! הם נערמים לחומה כדי להגן על הקטנה ביותר.',3],
 ['st42','Pyramid camp','מחנה בפירמידות','Night camp under the pyramids, with stories by the fire.','לילה במחנה ליד הפירמידות, עם סיפורים ליד המדורה.',3],
 ['st43','Candy land','ארץ הממתקים','Over the dunes, a pink and sparkly candy land appears!','מעבר לדיונות מופיעה ארץ ממתקים ורודה ונוצצת!',3],
 ['st44','Too much candy','יותר מדי ממתקים','Too much candy! Tummy aches... and lots of laughs.','יותר מדי ממתקים! כאבי בטן... והרבה צחוק.',3],
 ['st45','Gumdrop castle','טירת המסטיק','Queen Gumdrop\'s castle looms, guarded by gingerbread soldiers.','הטירה של מלכת המסטיק מתנשאת, ושומרי ג׳ינג׳ר שומרים עליה.',3],
 ['st46','Caramel trap','מלכודת קרמל','Stuck in a caramel trap! The bee buddy buzzes in and frees them.','תקועים במלכודת קרמל! הדבורה מזמזמת פנימה ומשחררת אותם.',3],
 ['st47','Victory parade','מצעד ניצחון','Victory parade! Gumdrops rain from the sky.','מצעד ניצחון! סוכריות גומי יורדות מהשמיים.',3],
 ['st48','Lollipop bridge','גשר הסוכריות','A lollipop bridge leads on to the snowy mountains.','גשר של סוכריות על מקל מוביל אל הרי השלג.',3],
 ['st49','First snow','שלג ראשון','First snow! The warm-coloured Sharliz shiver: brrr!','שלג ראשון! השארליז בצבעים החמים רועדות: ברררר!',4],
 ['st50','Snowball battle','קרב כדורי שלג','A snowball battle in the village. Splat!','קרב כדורי שלג בכפר. שפלאט!',4],
 ['st51','Avalanche ride','גלישה על מפולת','Yeti Freezy starts an avalanche, so they ride it on a sled!','יטי הקפוא מפיל מפולת שלגים, והם גולשים עליה במזחלת!',4],
 ['st52','Northern lights','הזוהר הצפוני','Northern lights dance over an igloo. Everyone goes quiet: wow.','הזוהר הצפוני רוקד מעל האיגלו. כולם שותקים: וואו.',4],
 ['st53','Penguin help','עזרה מפינגווין','A penguin buddy waddles over to help.','פינגווין חמוד מתנדנד אליהם כדי לעזור.',4],
 ['st54','Ice floe','גוש קרח צף','Crack! The frozen sea breaks, and they float away on an ice floe.','קראק! הים הקפוא נסדק, והם שטים הלאה על גוש קרח.',4],
 ['st55','Tropical sea','ים טרופי','A warm tropical sea at last: a lighthouse and a treasure map!','סוף סוף ים חם וטרופי: מגדלור ומפת אוצר!',4],
 ['st56','Kraken Inky','קרקן הדיו','Kraken Inky rises from the waves!','קרקן הדיו מתרומם מתוך הגלים!',4],
 ['st57','Bubble helmets','קסדות בועה','Under the sea in bubble helmets, with coral and fish all around.','מתחת לים בקסדות בועה, עם אלמוגים ודגים מסביב.',4],
 ['st58','Beach tower','מגדל על החוף','Washed up on a beach, they build a sandcastle tower.','הגלים זורקים אותם לחוף, והם בונים מגדל מחול.',4],
 ['st59','Volcano island','אי הר הגעש','A volcano island glows red in the night.','אי של הר געש זוהר באדום בלילה.',5],
 ['st60','Lava stones','אבני לבה','Hop, hop, careful! Stepping stones over the lava.','הופ, הופ, זהירות! אבנים לקפוץ עליהן מעל הלבה.',5],
 ['st61','Roar battle','קרב שאגות','Magma Rex roars. The dragon buddy roars right back!','מגמה רקס שואג. הדרקונצ׳יק שואג עליו בחזרה!',5],
 ['st62','Lava marshmallows','מרשמלו על לבה','Toasting marshmallows over a lava stream. So much laughing!','צולים מרשמלו מעל נחל לבה. כמה צחוק!',5],
 ['st63','Junk rocket','טיל מגרוטאות','On the volcano rim, they build a rocket out of junk.','על שפת הר הגעש הם בונים טיל מגרוטאות.',5],
 ['st64','Blast off!','שיגור!','Blast off! Their faces squish from the speed.','שיגור! הפרצופים נמעכים מהמהירות.',5],
 ['st65','Zero gravity','בלי כוח משיכה','Floating in space, upside down and giggling.','מרחפים בחלל, הפוכים ומצחקקים.',5],
 ['st66','Shrink ray','קרן הכיווץ','Zorg\'s UFO zaps one Sharliz... and shrinks her tiny!','העב״ם של זורג יורה על שארליז אחת... ומכווץ אותה!',5],
 ['st67','Tiny hero','גיבורה קטנטנה','The tiny one slips through a vent and saves the day!','הקטנטנה מתגנבת דרך פתח אוורור ומצילה את המצב!',5],
 ['st68','Moon landing','נחיתה על הירח','Landing on the moon: first bouncy hops in the dust.','נחיתה על הירח: קפיצות ראשונות באבק.',5],
 ['st69','Crash landing','נחיתת חירום','Crash! The rocket lands in the jungle treetops.','בום! הטיל נוחת בצמרות הג׳ונגל.',6],
 ['st70','Waterfall slide','מגלשת מפל','Vines, parrots and a waterfall slide. Wheee!','ליאנות, תוכים ומגלשת מפל. וייי!',6],
 ['st71','Secret path','השביל הסודי','The monkey buddy shows them a secret path.','הקוף הקטן מראה להם שביל סודי.',6],
 ['st72','Jungle drums','תופי הג׳ונגל','BOOM BOOM! Gorilla King\'s drums shake the trees.','בום בום! התופים של מלך הגורילות מרעידים את העצים.',6],
 ['st73','Temple door','שער המקדש','A perfect stack opens the old temple door.','מגדל מושלם פותח את שער המקדש העתיק.',6],
 ['st74','Haunted hill','גבעה רדופה','Fog rolls in. A haunted castle waits on the hill...','ערפל מתגלגל פנימה. טירה רדופה מחכה על הגבעה...',6],
 ['st75','Ghost games','משחקי רוחות','Friendly ghosts want to play hide and seek!','רוחות ידידותיות רוצות לשחק מחבואים!',6],
 ['st76','Big scare','בהלה גדולה','Ghost King shouts BOO! Everyone jumps out of their skin.','מלך הרוחות צועק בוו! כולם קופצים מבהלה.',6],
 ['st77','Pumpkin party','מסיבת דלעות','A pumpkin lantern party fills the castle hall.','מסיבת פנסי דלעת ממלאת את אולם הטירה.',6],
 ['st78','Bat flight','טיסת עטלפים','Friendly bats fly them over the castle wall.','עטלפים ידידותיים מטיסים אותם מעל חומת הטירה.',6],
 ['st79','Into the clouds','אל העננים','Their tallest tower yet grows like a beanstalk into the clouds.','המגדל הכי גבוה שלהם צומח כמו אפון הפלא, עד העננים.',7],
 ['st80','Cloud pillows','כריות ענן','Boing! Bouncing on fluffy cloud pillows.','בוינג! קופצים על כריות ענן רכות.',7],
 ['st81','Floating islands','איים מרחפים','Down a rainbow slide between floating islands.','גולשים על קשת בין איים מרחפים.',7],
 ['st82','Sky gallop','דהרה בשמיים','The unicorn buddy gallops across the sky!','החד־קרן דוהר על פני השמיים!',7],
 ['st83','Storm chase','מרדף סערה','Grumpy thunder clouds rumble. Storm chase!','ענני רעם רוטנים. מרדף סערה!',7],
 ['st84','Cloud hole','חור בענן','Oops! They fall through a cloud hole into a dino valley.','אופס! הם נופלים דרך חור בענן לעמק של דינוזאורים.',7],
 ['st85','Dino egg','ביצת דינו','Giant dino eggs! One cracks... hello, baby dino buddy!','ביצי דינו ענקיות! אחת נסדקת... שלום, דינו קטן!',7],
 ['st86','Fern hideout','מחבוא בשרכים','Triceratops stomps by. The friends hide in a fern.','טריצרטופס רוקע בדרך. החברים מתחבאים בין השרכים.',7],
 ['st87','Long-neck ride','טרמפ על דינוזאור','A gentle long-neck dinosaur gives them a ride.','דינוזאור עדין עם צוואר ארוך נותן להם טרמפ.',7],
 ['st88','Dino sunset','שקיעה בעמק','Sunset over a volcano, with pterodactyls soaring above.','שקיעה מעל הר געש, ופטרודקטילים דואים למעלה.',7],
 ['st89','Toy factory','מפעל הצעצועים','A toy factory full of conveyor belts and spinning gears.','מפעל צעצועים מלא מסועים וגלגלי שיניים.',8],
 ['st90','Assembly mix-up','בלבול בפס הייצור','Mixed up on the assembly line, they come out with robot parts!','בלבול בפס הייצור, והם יוצאים עם חלקי רובוט!',8],
 ['st91','Power up','טעינה','The cyborg buddy powers up: beep beep, ready!','שארליז הסייבורג נטען: ביפ ביפ, מוכן!',8],
 ['st92','Red eyes','עיניים אדומות','Mega Robot wakes up. Its eyes glow red...','מגה־רובוט מתעורר. העיניים שלו זוהרות באדום...',8],
 ['st93','The red button','הכפתור האדום','They bounce on the giant red button. Confetti, not explosions!','הם קופצים על הכפתור האדום הענק. קונפטי, לא פיצוץ!',8],
 ['st94','Mine cart','קרונית במכרה','A wild mine cart ride into a crystal cave!','נסיעה פרועה בקרונית אל מערת קריסטלים!',8],
 ['st95','Crystal glow','זוהר הקריסטלים','Glowing crystals reflect every happy face.','קריסטלים זוהרים משקפים כל פרצוף שמח.',8],
 ['st96','The last tunnel','המנהרה האחרונה','The Crystal Golem blocks the very last tunnel.','גולם הקריסטל חוסם את המנהרה האחרונה.',8],
 ['st97','Tallest tower ever','המגדל הכי גבוה','All the friends and buddies stack together: the tallest tower ever!','כל השארליזים והחברים נערמים יחד: המגדל הכי גבוה אי פעם!',8],
 ['st98','Golem smiles','הגולם מחייך','The Golem smiles and steps aside. The way is open!','הגולם מחייך וזז הצידה. הדרך פתוחה!',8],
 ['st99','Golden stairs','מדרגות הזהב','A golden staircase rises through the clouds.','גרם מדרגות מזהב עולה מבעד לעננים.',9],
 ['st100','Shimmering gates','השערים הנוצצים','The gates of the Sky Castle shimmer. They made it!','השערים של טירת השמיים מנצנצים. הם הגיעו!',9],
 ['st101','Hall of stickers','אולם המדבקות','Inside: a hall of stickers from every adventure so far.','בפנים: אולם מלא מדבקות מכל ההרפתקאות עד עכשיו.',9],
 ['st102','Star keeper','שומר הכוכבים','The shooting star from the start is here: the Star Keeper!','הכוכב הנופל מההתחלה נמצא כאן: שומר הכוכבים!',9],
 ['st103','Wish bubbles','בועות משאלה','A wish for every friend floats up in a bubble.','משאלה לכל חבר מרחפת למעלה בתוך בועה.',9],
 ['st104','Brave glow','זוהר של אומץ','The shy Sharliz wishes for courage... and starts to glow.','השארליז הביישנית מבקשת אומץ... ומתחילה לזהור.',9],
 ['st105','Cloud feast','סעודה בעננים','A grand feast up in the clouds. Yum!','סעודה חגיגית למעלה בעננים. יאמי!',9],
 ['st106','Castle fireworks','זיקוקים מעל הטירה','Fireworks burst over the Sky Castle.','זיקוקים מתפוצצים מעל טירת השמיים.',9],
 ['st107','Sleepy hug','חיבוק מנומנם','A big, sleepy group hug on a cloud bed.','חיבוק קבוצתי גדול ומנומנם על מיטת ענן.',9],
 ['st108','Dream of home','חלום על הבית','They dream of home: the little farm far below.','הם חולמים על הבית: החווה הקטנה, הרחק למטה.',9],
 ['st109','Rainbow homeward','קשת הביתה','Down a rainbow, all the way back to the farm!','גולשים על קשת, כל הדרך חזרה לחווה!',10],
 ['st110','Welcome home','ברוכים השבים','The farm animals cheer: they\'re back!','חיות החווה מריעות: הם חזרו!',10],
 ['st111','Story time','שעת סיפור','By the campfire, they tell the little ones the whole story.','ליד המדורה הם מספרים לקטנים את כל הסיפור.',10],
 ['st112','Tower monument','אנדרטת המגדל','They build a tower monument in the field for everyone to see.','הם בונים בשדה מגדל לזיכרון, שכולם יראו.',10],
 ['st113','Buddy houses','בית לכל חבר','Every buddy gets its own little house in the garden.','כל חבר מקבל בית קטן משלו בגינה.',10],
 ['st114','Another star','עוד כוכב','Look! A new shooting star crosses the sky...','תראו! כוכב נופל חדש חוצה את השמיים...',10],
 ['st115','Little builders','בנאים קטנים','The little ones start their own wobbly tower.','הקטנים מתחילים לבנות מגדל מתנדנד משלהם.',10],
 ['st116','Group photo','תמונה קבוצתית','One big photo: friends, buddies, even the bosses!','תמונה אחת גדולה: כולם, ואפילו הבוסים!',10],
 ['st117','The old map','המפה הישנה','The old torn map now hangs on the barn wall.','המפה הישנה והקרועה תלויה עכשיו על קיר האסם.',10],
 ['st118','The End?','הסוף?','The tower at sunrise. A new adventure is already waiting...','המגדל בזריחה. הרפתקה חדשה כבר מחכה...',10]];
// Gold cards: [id,'English name','Hebrew name','English line','Hebrew line']
const GOLDS=[
 ['g01','Golden Throne','כס הזהב','A throne of coins, fit for a legend.','כס של מטבעות, ראוי לאגדה.'],
 ['g02','Gold Crown','כתר הזהב','Ruler of the tallest tower of all.','שליט המגדל הגבוה מכולם.'],
 ['g03','Golden Tower','מגדל הזהב','Ten Sharliz high, all the way to the sun.','עשר שארליז לגובה, עד השמש.'],
 ['g04','Gold Dragon Rider','רוכבת דרקון הזהב','Rides the sky on wings of gold.','רוכבת בשמיים על כנפי זהב.'],
 ['g05','Golden Phoenix','עוף החול המוזהב','Rises from the flames, brighter than ever.','קם מהלהבות, זוהר מתמיד.'],
 ['g06','Gold Astronaut','אסטרונאוט הזהב','One golden hop on a golden moon.','קפיצה מוזהבת על ירח מוזהב.'],
 ['g07','Gold Knight','אביר הזהב','No tower falls on this knight\'s watch.','אף מגדל לא נופל במשמרת שלו.'],
 ['g08','Golden Mermaid','בת הים המוזהבת','Guardian of the pearl of the deep.','שומרת פנינת המעמקים.'],
 ['g09','Gold Ninja','נינג׳ה הזהב','Silent as moonlight. Twice as shiny.','שקטה כמו אור ירח. נוצצת פי שניים.'],
 ['g10','Golden Pharaoh','פרעה הזהב','Built the first tower. And the pyramids.','בנה את המגדל הראשון. וגם את הפירמידות.'],
 ['g11','Gold Rockstar','כוכב הרוק המוזהב','The crowd sees gold. The crowd goes wild.','הקהל רואה זהב. הקהל משתולל.'],
 ['g12','Golden Wizard','קוסם הזהב','One spell, a thousand golden stars.','לחש אחד, אלף כוכבי זהב.'],
 ['g13','Gold Pirate','פיראט הזהב','Found the treasure. Is the treasure.','מצא את האוצר. הוא האוצר.'],
 ['g14','Golden Unicorn','חד־הקרן המוזהב','Two legends, one golden sky.','שתי אגדות, שמיים של זהב.'],
 ['g15','Gold Superhero','גיבור־על מוזהב','Lands so hard the ground turns gold.','נוחת כל כך חזק, שהאדמה הופכת לזהב.'],
 ['g16','Golden Champion','אלופת הזהב','The biggest cup. The biggest heart.','הגביע הכי גדול. הלב הכי גדול.'],
 ['g17','Gold Kraken Inky','קרקן הדיו בזהב','Eight golden tentacles. One golden grin.','שמונה זרועות זהב. חיוך זהב אחד.'],
 ['g18','Gold Queen Gumdrop','מלכת המסטיק בזהב','Sweet, sticky, and solid gold.','מתוקה, דביקה וזהב טהור.'],
 ['g19','Gold Ghost King','מלך הרוחות בזהב','BOO! ...in shining gold.','בוו! ...בזהב נוצץ.'],
 ['g20','Gold Crystal Golem','גולם הקריסטל בזהב','The final guardian, gleaming in gold.','השומר האחרון, בוהק בזהב.'],
 ['g21','Golden Parade','מצעד הזהב','Every buddy in gold, all in one parade.','כל החברים בזהב, במצעד אחד גדול.'],
 ['g22','Golden Snow Globe','כדור זכוכית מוזהב','Shake it, and the farm sparkles.','מנערים, והחווה מנצנצת.'],
 ['g23','Gold Sky Castle','טירת הזהב','The castle at the top of every tower.','הטירה בראש כל מגדל.'],
 ['g24','Golden Wish','משאלת הזהב','A shooting star that grants one wish.','כוכב נופל שמגשים משאלה אחת.'],
 ['g25','Golden Rainbow','קשת הזהב','Every colour, dipped in gold.','כל הצבעים, טבולים בזהב.'],
 ['g26','Golden Galaxy','גלקסיית הזהב','A whole galaxy of golden stars.','גלקסיה שלמה של כוכבי זהב.'],
 ['g27','Golden Friends','חברי הזהב','Four friends. One golden memory.','ארבעה חברים. זיכרון אחד של זהב.'],
 ['g28','Golden Landing','נחיתת הזהב','The perfect landing, forever in gold.','הנחיתה המושלמת, לנצח בזהב.'],
 ['g29','Golden Album','אלבום הזהב','For the greatest collector of all.','לאספן הגדול מכולם.'],
 ['g30','Golden Egg','ביצת הזהב','Something legendary is about to hatch...','משהו אגדי עומד לבקוע...']];
const STK3_ART=new Set(__STK3_ART__),has3=id=>STK3_ART.has(id);
SHZ.forEach(s=>{if(!s[6])s[6]='classic'});SHZ.push(...SHZ3.filter(s=>has3(s[0])));
Object.assign(I18N.en,{pg_gold:'Gold',hint_gold:'A legendary feat',sbRar_g:'Gold',sec_classic:'Classics',sec_short:'Short stories',stCh:'Chapter {n}',
  sbToc:'Contents',sbWhole:'The whole chapter',stNext:'Next part: win {n} more levels',stLater:'Keep playing to see what happens next',stNew:'A new story card!',
  gdTitle:'GOLD STICKER!',gdFeat:'Legendary feat',gdOk:'Wow!',gdAlbum:'To the album',
  gf_coins:'Have {n} coins at once',gf_s1:'3 stars on all {n} levels of the first 8 worlds',gf_combo:'{n} perfect landings in a row',
  gf_evo:'Evolve {n} buddies to 3 stars',gf_nh:'Beat {b} without losing a heart',gf_endless:'Reach floor {n} in {m}',
  gf_nhN:'Beat {n} different bosses without losing a heart',gf_w3:'3 stars on all {n} {w} levels (day, night and storm)',
  gf_night:'Beat all {n} night bosses',gf_perf:'{n} perfect landings',gf_storm:'Beat all {n} storm bosses',
  gf_bn3:'Open all 3 bonus-stage chests {n} times',gf_w1:'3 stars on all {n} {w} levels',gf_row:'Win {n} levels in a row without losing',
  gf_tgold:'Win {n} gold medals in the weekly tournament',gf_last:'Beat {b}, the very last boss',gf_eggs:'Hatch {n} eggs',
  gf_lv:'Reach player level {n}',gf_gift:'Finish the 7-day daily gift {n} times',gf_stk:'Collect {n} different Sharliz stickers',
  gf_cups:'Win all {n} gold cups in the trophy room',gf_3s:'3 stars on {n} levels',gf_sec:'Fill {n} album sections',gf_all:'Collect all the other gold stickers'});
Object.assign(I18N.he,{pg_gold:'זהב',hint_gold:'משימה אגדית',sbRar_g:'זהב',sec_classic:'הקלאסיות',sec_short:'סיפורים קצרים',stCh:'פרק {n}',
  sbToc:'תוכן העניינים',sbWhole:'כל הפרק',stNext:'להמשך הסיפור: עוד {n} ניצחונות בשלבים',stLater:'תמשיכו לשחק כדי לגלות מה קורה',stNew:'קלף סיפור חדש!',
  gdTitle:'מדבקת זהב!',gdFeat:'משימה אגדית',gdOk:'וואו!',gdAlbum:'לאלבום',
  gf_coins:'להחזיק {n} מטבעות בבת אחת',gf_s1:'3 כוכבים בכל {n} השלבים של 8 העולמות הראשונים',gf_combo:'{n} נחיתות מושלמות ברצף',
  gf_evo:'לפתח {n} חברים ל-3 כוכבים',gf_nh:'לנצח את {b} בלי לאבד לב',gf_endless:'להגיע לקומה {n} ב{m}',
  gf_nhN:'לנצח {n} בוסים שונים בלי לאבד לב',gf_w3:'3 כוכבים בכל {n} השלבים של {w} (יום, לילה וסערה)',
  gf_night:'לנצח את כל {n} בוסי הלילה',gf_perf:'{n} נחיתות מושלמות',gf_storm:'לנצח את כל {n} בוסי הסערה',
  gf_bn3:'לפתוח את 3 התיבות בשלב הבונוס {n} פעמים',gf_w1:'3 כוכבים בכל {n} השלבים של {w}',gf_row:'לנצח {n} שלבים ברצף בלי להפסיד',
  gf_tgold:'לזכות ב-{n} מדליות זהב בטורניר השבועי',gf_last:'לנצח את {b}, הבוס האחרון',gf_eggs:'לבקע {n} ביצים',
  gf_lv:'להגיע לרמת שחקן {n}',gf_gift:'לסיים את המתנה היומית של 7 ימים {n} פעמים',gf_stk:'לאסוף {n} מדבקות שארליז שונות',
  gf_cups:'לזכות בכל {n} גביעי הזהב בחדר הגביעים',gf_3s:'3 כוכבים ב-{n} שלבים',gf_sec:'למלא {n} פרקים באלבום',gf_all:'לאסוף את כל שאר מדבקות הזהב'});
Object.assign(SB_ICON,{gold:'cup_g'});Object.assign(SB_COL,{gold:'#ffc531'});
Object.assign(SB_REW,{gold:[3000,250]});
/* ---------- sections ---------- */
function sbSecName(pid,sec){const L=lang==='he';if(sec==='classic')return t('sec_classic');if(sec==='short')return t('sec_short');
  if(/^c\d+$/.test(sec)){const c=STORY_CH.find(x=>'c'+x[0]===sec);return c?(L?c[2]:c[1]):''}const r=SHZ_SEC.find(x=>x[0]===sec);return r?(L?r[2]:r[1]):''}
function sbSecSub(sec,PG){const pg=PG.n>1?t('sbPage',{a:PG.k+1,b:PG.n}):'';if(/^c\d+$/.test(sec))return t('stCh',{n:sec.slice(1)})+(PG.n>1?' · '+(PG.k+1)+'/'+PG.n:'');return pg}
// chest per section; the old single-chapter chests became the first section's (migration in sbData)
function sbRew(ck){if(ck==='shz:classic')return SB_REW.shz;if(ck==='rare:short')return SB_REW.rare;if(ck==='shz:all')return [3000,200];if(ck==='rare:all')return [2000,150];
  if(ck.includes(':'))return ck.startsWith('rare:')?[300,30]:[400,40];return SB_REW[ck]||[500,60]}
function sbClaim(ck,after){const D=sbData();if(D.done[ck])return;const [c,x]=sbRew(ck);D.done[ck]=1;wallet().coins+=c;saveProgress();addXP(x);XPQ=null;lvUpLater();sfx.flourish(4);vib([30,40,30]);popupToast('+'+c+' 🪙  +'+x+' XP');after&&after()}
/* ☰ contents: every section with its progress and chest, tap → its first page; the whole-chapter chest at the bottom */
function sbToc(P){const all=P.items().filter(x=>!x.soon),pages=sbPages(P,all),D=sbData(),m=document.createElement('div');m.className='sb-tocm';
  const draw=()=>{const secs=sbSecs(P),fullAll=all.every(x=>x.n),ak=P.id+':all';
    m.innerHTML=`<div class="tc-card" style="--c:${SB_COL[P.id]||'#b48cff'}"><div class="tc-hd"><b></b><button class="x-btn tc-x" aria-label="close"></button></div><div class="tc-list"></div>
      <div class="tc-all"><span><b></b><small>${all.filter(x=>x.n).length}/${all.length}</small></span><button class="sb-chest${fullAll&&!D.done[ak]?' can':''}${D.done[ak]?' got':''}"><img src="art/ic_chest${D.done[ak]?'_open':''}.webp" alt=""></button></div></div>`;
    m.querySelector('.tc-hd b').textContent=t('sbToc');m.querySelector('.tc-x').innerHTML=XSVG;m.querySelector('.tc-x').onclick=()=>{sfx.click();m.remove()};
    m.querySelector('.tc-all b').textContent=t('sbWhole');m.querySelector('.tc-all .sb-chest').onclick=()=>{if(fullAll&&!D.done[ak])sbClaim(ak,()=>{sbPageView();draw();if(!m.isConnected)SB.el.appendChild(m)});else if(!D.done[ak]){sfx.locked();popupToast(t('sbDone').replace('!','')+' → '+sbRew(ak)[0]+' 🪙')}};
    const L=m.querySelector('.tc-list');secs.forEach(sec=>{const a=all.filter(x=>x.sec===sec),g=a.filter(x=>x.n).length,ck=P.id+':'+sec,fst=a.find(x=>x.n)||a[0],row=document.createElement('button'),pi=pages.findIndex(p=>p.sec===sec);
      row.className='tc-row'+(pi===SB.pg||pages[SB.pg].sec===sec?' on':'')+(g===a.length?' full':'');
      row.innerHTML=`<span class="tc-th${fst.n?'':' no'}"><img alt="" loading="lazy"></span><span class="tc-t"><b></b><i><u style="width:${g/a.length*100}%"></u></i></span>${g===a.length&&!D.done[ck]?'<img class="tc-can" src="art/ic_chest.webp" alt="">':`<em>${D.done[ck]?'✓':g+'/'+a.length}</em>`}`;
      row.querySelector('img').src=fst.src||'';row.querySelector('b').textContent=sbSecName(P.id,sec);row.onclick=()=>{sfx.click();m.remove();SB.pg=pi;sbPageView(1)};L.appendChild(row)});
    const on=L.querySelector('.on');if(on)requestAnimationFrame(()=>on.scrollIntoView({block:'center'}))};
  draw();SB.el.appendChild(m)}
/* ---------- the Sky Tower story: a card for every 3 levels won ---------- */
const ST_PER=3;
function stWins(){return (progress.stars||[]).filter(s=>s>0).length}
function stOwn(){return Math.floor(stWins()/ST_PER)}
function stOwnArt(){const n=stOwn();return STORY3.filter((s,i)=>i<n&&has3(s[0])).length}
{const P=STK_PAGES.find(p=>p.id==='rare');if(P){const _it=P.items;P.items=()=>{const a=_it().map(x=>Object.assign(x,{sec:'short'})),own=stOwn(),L=lang==='he'?1:0;
  STORY3.forEach((s,i)=>{if(!has3(s[0]))return;a.push({id:'story:'+s[0],n:i<own?1:0,src:'art/stk_'+s[0]+'.webp',name:L?s[2]:s[1],line:L?s[4]:s[3],rar:'h',card:1,sec:'c'+s[5],
    hint:i===own?t('stNext',{n:ST_PER-stWins()%ST_PER}):t('stLater')})});return a}}}
/* ---------- GOLD: legendary feats ---------- */
const S1W=['farm','city','desert','candy','snow','ocean','volcano','space'];
const ST=()=>progress.stat=progress.stat||{};
const zIx=sid=>ZONES.findIndex(z=>(z.sid||z.id)===sid);
function st3(sids){let n=0;for(const s of sids){const zi=zIx(s);if(zi<0)continue;for(let i=0;i<LPZ;i++)if((progress.stars[zi*LPZ+i]||0)>=3)n++}return n}
const beatN=sids=>sids.filter(s=>(progress.beat||{})[s]).length,nh=s=>(ST().nh||{})[s]?1:0,bossNm=sid=>t(BOSS_NAMES[sid]||sid);
function secsDone(){let n=0;try{for(const P of sbChapters()){if(P.id==='gold')continue;const all=P.items().filter(x=>!x.soon);for(const s of new Set(all.map(x=>x.sec))){const a=all.filter(x=>x.sec===s);if(a.length&&a.every(x=>x.n))n++}}}catch(e){}return n}
// coins that came from purchases never count toward a gold card (gold cards are never sold)
const boughtCoins=()=>(progress.purchases||[]).reduce((a,p)=>a+((p&&IAP.products[p.sku]||{}).coins||0),0);
const GFEAT={
  g01:{k:'coins',T:15000,v:()=>Math.max(0,(progress.coins||0)-boughtCoins())},          g02:{k:'s1',T:80,v:()=>st3(S1W)},
  g03:{k:'combo',T:15,v:()=>ST().combo||0},                  g04:{k:'evo',T:3,v:()=>Object.values(progress.bud||{}).filter(x=>x>=3).length},
  g05:{k:'nh',b:'volcanoS',T:1,v:()=>nh('volcanoS')},        g06:{k:'endless',T:100,v:()=>progress.bestEndless||0},
  g07:{k:'nhN',T:10,v:()=>Object.keys(ST().nh||{}).length},  g08:{k:'w3',w:'ocean',T:30,v:()=>st3(['ocean','oceanN','oceanS'])},
  g09:{k:'night',T:8,v:()=>beatN(S1W.map(s=>s+'N'))},       g10:{k:'w3',w:'desert',T:30,v:()=>st3(['desert','desertN','desertS'])},
  g11:{k:'perf',T:2000,v:()=>ST().perf||0},                  g12:{k:'storm',T:8,v:()=>beatN(S1W.map(s=>s+'S'))},
  g13:{k:'bn3',T:10,v:()=>ST().bn3||0},                      g14:{k:'w1',w:'clouds',T:10,v:()=>st3(['clouds'])},
  g15:{k:'row',T:20,v:()=>ST().rowB||0},                     g16:{k:'tgold',T:4,v:()=>ST().tgold||0},
  g17:{k:'nh',b:'ocean',T:1,v:()=>nh('ocean')},              g18:{k:'nh',b:'candy',T:1,v:()=>nh('candy')},
  g19:{k:'nh',b:'castle',T:1,v:()=>nh('castle')},            g20:{k:'last',b:'crystal',T:1,v:()=>beatN(['crystal'])},
  g21:{k:'eggs',T:40,v:()=>{try{return nest().hatched||0}catch(e){return 0}}}, g22:{k:'w3',w:'farm',T:30,v:()=>st3(['farm','farmN','farmS'])},
  g23:{k:'lv',T:40,v:()=>xpLevel(progress.xp||0).lv},       g24:{k:'gift',T:4,v:()=>ST().gift7||0},
  g25:{k:'stk',T:150,v:()=>{const D=sbData();return SHZ.filter(s=>D.got[s[0]]).length}}, g26:{k:'w3',w:'space',T:30,v:()=>st3(['space','spaceN','spaceS'])},
  g27:{k:'cups',T:10,v:()=>{try{return ACH.filter(A=>achGot(A.id)>=3).length}catch(e){return 0}}}, g28:{k:'3s',T:200,v:()=>(progress.stars||[]).filter(s=>s>=3).length},
  g29:{k:'sec',T:10,v:secsDone},                             g30:{k:'all',T:29,v:()=>{const D=sbData();return GOLDS.filter(g=>g[0]!=='g30'&&D.got[g[0]]).length}}};
function gfText(id){const F=GFEAT[id];if(!F)return t('hint_gold');const zi=F.w?zIx(F.w):-1;
  return t('gf_'+F.k,{n:F.T.toLocaleString(),b:F.b?bossNm(F.b):'',w:zi>=0?t(ZONES[zi].key):'',m:t('mode_endless')})}
function gfProg(id){const F=GFEAT[id];if(!F||F.T<=1)return null;let v=0;try{v=Math.min(F.T,F.v())}catch(e){}return [v,F.T]}
if(GOLDS.some(g=>has3(g[0])))STK_PAGES.splice(1,0,{id:'gold',items:()=>{const D=sbData(),L=lang==='he'?1:0;
  return GOLDS.filter(g=>has3(g[0])).map(g=>{const p=gfProg(g[0]);return {id:'gold:'+g[0],n:D.got[g[0]]?1:0,src:'art/stk_'+g[0]+'.webp',name:L?g[2]:g[1],line:L?g[4]:g[3],rar:'g',card:1,gold:1,feat:t('gdFeat')+': '+gfText(g[0]),
    hint:gfText(g[0])+(p?' ('+p[0].toLocaleString()+'/'+p[1].toLocaleString()+')':''),prog:p}})}});
let GDQ=[];
function goldCheck(){const D=sbData(),nw=[];for(const g of GOLDS){const id=g[0],F=GFEAT[id];if(!has3(id)||D.got[id]||!F)continue;let v=0;try{v=F.v()}catch(e){}if(v>=F.T){D.got[id]=1;nw.push(id)}}
  if(nw.length){saveProgress();GDQ.push(...nw);try{stkBadge()}catch(e){}}return nw.length}
function gdBusy(){return state!=='title'||W3.on||lobbyLayerOpen()||!document.getElementById('overlay').hidden||document.getElementById('title').hidden||(SB.el&&!SB.el.hidden)||(typeof SSEL!=='undefined'&&SSEL&&!SSEL.hidden)||
  !!document.querySelector('.egg-pop,.sb-pk,.sb-zoom,.lvup,.gd-rev,.pay-modal,#payModal')||(typeof dlState==='function'&&progress.unlocked>=2&&!dlState().claimed)}
// the starter offer, daily gift and house popup wait while a gold card is being revealed
{const _lo=lobbyLayerOpen;lobbyLayerOpen=function(){return !!document.querySelector('.gd-rev')||_lo()}}
function goldMaybe(){goldCheck();if(!GDQ.length)return;setTimeout(()=>{if(!GDQ.length||gdBusy())return;goldReveal(GDQ.shift())},900)}
/* the big moment: a gold card flips in over rays + sparkles */
function goldReveal(id){const g=GOLDS.find(x=>x[0]===id);if(!g)return;const L=lang==='he'?1:0,m=document.createElement('div');m.className='gd-rev';
  m.innerHTML=`<div class="gd-rays"></div><div class="gd-sp">${Array.from({length:14},(_,i)=>`<i style="--i:${i}"></i>`).join('')}</div><h2></h2>
    <div class="gd-card"><img src="art/stk_${id}.webp" alt=""><div class="gd-shine"></div></div><b class="gd-nm"></b><p class="gd-ln"></p>
    <div class="gd-feat"><img src="art/cup_g.webp" alt=""><span><small></small><em></em></span></div><div class="gd-btns"><button class="btn primary gd-ok"><span></span></button><button class="btn gd-al"><span></span></button></div>`;
  m.querySelector('h2').textContent=t('gdTitle');m.querySelector('.gd-nm').textContent=L?g[2]:g[1];m.querySelector('.gd-ln').textContent=L?g[4]:g[3];
  m.querySelector('.gd-feat small').textContent=t('gdFeat');m.querySelector('.gd-feat em').textContent=gfText(id);
  m.querySelector('.gd-ok span').textContent=t('gdOk');m.querySelector('.gd-al span').textContent=t('gdAlbum');
  const close=()=>{m.remove();if(GDQ.length)goldMaybe()};
  m.querySelector('.gd-ok').onclick=()=>{sfx.click();close()};
  m.querySelector('.gd-al').onclick=()=>{sfx.click();m.remove();openAlbum();const ci=sbChapters().findIndex(P=>P.id==='gold');if(ci>=0){SB.ch=ci;SB.pg=sbNewPg(ci);sbPageView()}};
  document.body.appendChild(m);sfx.flourish(4);vib([30,50,30,50,60]);if(sfx.ok()){tone({f:520,f2:1560,d:.6,type:'triangle',v:.06});setTimeout(()=>tone({f:1040,f2:2080,d:.5,type:'sine',v:.05}),350)}}
{const _ul=updateLobby;updateLobby=function(){const r=_ul.apply(this,arguments);try{goldMaybe()}catch(e){}return r}}
{const _o=openAlbum;openAlbum=function(){try{goldCheck();GDQ=[]}catch(e){}return _o.apply(this,arguments)}} // seen in the album right away
/* gold chapter page: gold rarity on owned cards, a progress bar on the ones still to earn */
{const _pv=sbPageView;sbPageView=function(){const r=_pv.apply(this,arguments);try{const P=sbChapters()[SB.ch];if(P.id==='gold'){const all=P.items(),pg=sbPages(P,all)[SB.pg];
  SB.el.querySelectorAll('.sb-grid .sb-slot').forEach((s,k)=>{const it=all[pg.ix[k]];if(!it)return;s.classList.add('gold');if(!it.n&&it.prog){const b=document.createElement('i');b.className='gd-pb';b.innerHTML=`<u style="width:${it.prog[0]/it.prog[1]*100}%"></u>`;s.appendChild(b)}})}}catch(e){}return r}}
/* ---------- trackers the feats need (progress.stat) ---------- */
// continuing from the checkpoint restarts the level (startLevel → resetStats → lv.lost=0): keep the hearts already lost, so
// 'beat the boss without losing a heart' (gold cards) and the 'no hit' star mission are not given after losing every heart
{const _cc=continueCheckpoint;continueCheckpoint=function(){const L=lv&&lv.lost||0;const r=_cc.apply(this,arguments);if(lv&&L)lv.lost=(lv.lost||0)+L;return r}}
{const _w=win;win=function(){const was=state,b=stOwnArt();const r=_w.apply(this,arguments);if(was!=='win'&&state==='win'){try{const S=ST();if(lv&&lv.best)S.combo=Math.max(S.combo||0,lv.best);
    if(mode==='levels'){S.row=(S.row||0)+1;S.rowB=Math.max(S.rowB||0,S.row);if(lvInZone()===LPZ-1&&!lv.lost){S.nh=S.nh||{};S.nh[zone().sid||zone().id]=1}}saveProgress();
    if(stOwnArt()>b){toast(t('stNew'));try{stkBadge()}catch(e){}}}catch(e){}}return r}}
{const _so=showOverlay;showOverlay=function(){try{if(state==='over'&&lv&&!lv._g64){lv._g64=1;const S=ST();if(lv.best)S.combo=Math.max(S.combo||0,lv.best);if(mode==='levels')S.row=0;saveProgress()}}catch(e){}return _so.apply(this,arguments)}}
if(typeof trEnd==='function'){const _t=trEnd;trEnd=function(){const had=!!(trData().got||{}).g;const r=_t.apply(this,arguments);try{if(!had&&(trData().got||{}).g){ST().tgold=(ST().tgold||0)+1;saveProgress()}}catch(e){}return r}}
if(typeof bnCollect==='function'){const _b=bnCollect;bnCollect=function(){const ok=BN&&!BN.paid&&BN.open.length>=BN_CH.length;const r=_b.apply(this,arguments);try{if(ok){ST().bn3=(ST().bn3||0)+1;saveProgress()}}catch(e){}return r}}
if(typeof dlClaim==='function'){const _d=dlClaim;dlClaim=function(){const s=dlState();const r=_d.apply(this,arguments);try{if(!s.claimed&&s.day===7){ST().gift7=(ST().gift7||0)+1;saveProgress()}}catch(e){}return r}}
// nightly Oct 9: a long page title shrinks to fit its column (down to 60%), then wraps
{const _pv=sbPageView;sbPageView=function(){const r=_pv.apply(this,arguments);try{const b=SB.el&&SB.el.querySelector('.sb-head b');if(b&&b.clientWidth){b.classList.remove('wrap');b.style.fontSize='';
  let fs=parseFloat(getComputedStyle(b).fontSize);const min=fs*.6;while(b.scrollWidth>b.clientWidth+1&&fs>min){fs-=1;b.style.fontSize=fs+'px'}if(b.scrollWidth>b.clientWidth+1)b.classList.add('wrap')}}catch(e){}return r}}
