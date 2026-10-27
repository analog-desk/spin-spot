export interface RestaurantTrivia {
  id: string;
  name: string;
  funFacts: string[];
}

export const RESTAURANT_FUN_FACTS: Record<string, string[]> = {
  mcdonalds: [
    "Did you know that the first McDonald's was opened in 1940 by brothers Richard and Maurice McDonald in San Bernardino, California?",
    "Queen Elizabeth II technically owned a McDonald's branch near Windsor Castle in England through the British Crown Estate!",
    "McDonald's sells an estimated 75 hamburgers every single second worldwide across more than 100 countries.",
    "The golden arches are one of the most recognized commercial symbols in the world, with studies showing higher recognition than religious symbols.",
    "The Filet-O-Fish was invented in 1962 by a Cincinnati franchise owner for Catholic customers who avoided meat on Fridays during Lent.",
    "McDonald's once owned a 90% controlling stake in Chipotle Mexican Grill before spinning it off in 2006 to focus on its core burger business.",
    "The McRib has been 'retired' with farewell tours over a dozen times, becoming a legendary cult marketing phenomenon.",
    "McDonald's original mascot in 1948 was a little hamburger-headed chef named 'Speedee' who embodied their Speedee Service System."
  ],

  'wingstop-fries': [
    "Did you know that Wingstop's seasoned fries are hand-cut in each restaurant every single morning from whole Idaho potatoes?",
    "Wingstop was founded in 1994 in Garland, Texas, with a 1930s-1940s pre-jet aviation theme that still decorates their stores today.",
    "The signature fry seasoning combines white sugar, salt, and proprietary spices, giving Wingstop fries their addictive sweet-savory kick.",
    "Rapper Rick Ross fell in love with Wingstop so much that he bought his first franchise in 2011 and now owns dozens of locations!",
    "Wingstop has cooked and tossed well over 1 billion chicken wings and millions of pounds of hand-cut fries.",
    "In 2021 during a nationwide bone-in wing shortage, Wingstop launched a virtual restaurant brand called 'Thighstop' to promote bone-in and boneless thighs.",
    "Wingstop's housemade ranch dressing is prepared from scratch daily in giant batches using real buttermilk and heavy mayo."
  ],

  wendys: [
    "Did you know that Wendy's founder Dave Thomas named the restaurant after his 8-year-old daughter Melinda Lou, whose childhood nickname was 'Wendy'?",
    "The square hamburger patties were Dave Thomas's idea so that the fresh beef corners would 'hang over the bun', showing customers the quality of the meat.",
    "The Frosty was one of the original five items on the menu when Wendy's opened in Columbus, Ohio in 1969.",
    "Dave Thomas originally dropped out of high school at age 15 to work at restaurants, but went back to earn his GED in 1993 so he wouldn't encourage kids to drop out.",
    "In 1979, Wendy's introduced the first modern fast-food salad bar, revolutionizing fast-food dining choices.",
    "The iconic 1984 'Where's the beef?' Wendy's television commercial featuring Clara Peller became an American pop culture catchphrase.",
    "The chocolate Frosty is actually a 50/50 blend of chocolate and vanilla flavoring so that the chocolate flavor doesn't overpower your taste buds."
  ],

  blaze: [
    "Did you know that NBA superstar LeBron James was one of the earliest founding investors in Blaze Pizza and even walked away from an $15M endorsement deal with McDonald's to back Blaze?",
    "Blaze's custom gas-fired hearth ovens burn at an intense 800°F to 900°F, cooking a thin-crust artisan pizza in just 180 seconds!",
    "Blaze Pizza was named the fastest-growing restaurant chain in American history by industry tracker Technomic.",
    "The company was founded in Pasadena, California in 2011 by Rick and Elise Wetzel, who also co-founded Wetzel's Pretzels.",
    "Blaze makes its pizza dough completely from scratch in every kitchen every morning and lets it ferment for 24 hours for maximum flavor.",
    "Unlike traditional pizzerias that charge per item, Blaze pioneered unlimited gourmet toppings for one single flat price.",
    "LeBron James once worked incognito as a Blaze Pizza counter employee named 'Ron' in a viral marketing prank in Pasadena."
  ],

  costco: [
    "Did you know that Costco's $1.50 quarter-pound hot dog and 20oz soda combo has stayed the exact same price without inflation since 1985?",
    "When a Costco CEO suggested raising the hot dog price to $1.75, co-founder Jim Sinegal famously replied: 'If you raise the effing hot dog, I will kill you. Figure it out.'",
    "Costco sells more than 130 million hot dogs every year—that's more than all Major League Baseball stadiums combined across an entire season!",
    "Costco built its own hot dog manufacturing facility in Tracy, California specifically to keep production costs low enough to preserve the $1.50 price.",
    "The pizza sauce at Costco is applied by an automated robotic saucing machine that spins dough and spirals sauce in under 10 seconds.",
    "Every Costco 18-inch whole pepperoni pizza contains exactly 60 to 70 slices of pepperoni and nearly two pounds of melted cheese.",
    "Costco's Chicken Bake was invented by a food court manager who wrapped leftover rotisserie chicken, bacon, and Caesar dressing inside pizza dough."
  ],

  'tacos-los-cholos': [
    "Did you know that Tacos Los Cholos began with just a single charcoal grill in a family backyard in Anaheim before becoming a viral Southern California taco sensation?",
    "Unlike standard taquerias, Tacos Los Cholos lets you order your tacos tiered by USDA meat grade: Regular, Prime, and Australian/American Wagyu!",
    "Every cut of meat—including thick ribeye, costilla (rib meat), and filet mignon—is grilled directly over natural mesquite wood coals for deep smokiness.",
    "Their legendary 'Papa Loca' is a massive smoked baked potato hollowed out and overflowing with melted jack cheese, ribeye steak, and grilled onions.",
    "Tacos Los Cholos was crowned Champion at the prestigious LA Taco Madness competition, beating out hundreds of top Southern California taquerias.",
    "They press and char tortillas directly on the hot grill grate so the tortilla absorbs the aromatic wood smoke and dripping meat juices.",
    "Customers regularly line up around the block at their flagship location in Anaheim, with food lovers traveling from across the state for their bone-in rib tacos."
  ],

  'carls-jr': [
    "Did you know that founder Carl Karcher started Carl's Jr. in Los Angeles in 1941 as a lone hot dog cart purchased with $311 borrowed against his Plymouth car?",
    "The famous 'Happy Star' mascot was introduced in 1962 and was hand-drawn to welcome families into the dining room.",
    "Carl's Jr. was one of the very first fast-food chains to offer self-service soda fountains and automated all-you-can-drink refills.",
    "The 'Famous Star' with special sauce was introduced in 1969 and became one of the best-selling burgers on the West Coast.",
    "Carl's Jr. popularized crisscut seasoned potato fries in fast food, which have been on their menu continuously since the 1980s.",
    "In 1997, Carl's Jr.'s parent company CKE Restaurants acquired the Midwestern chain Hardee's and unified their menus with charbroiled Thickburgers.",
    "Carl Karcher operated the company based on old-fashioned California hospitality, often walking dining rooms shaking hands with guests."
  ],

  'vons-nuggets': [
    "Did you know that Vons was founded in Los Angeles in 1906 by Charles Von der Ahe with just $1,200 in life savings?",
    "The Vons hot deli counter fries their chicken nuggets and tenders in small fresh batches throughout the day to ensure golden crunchiness.",
    "Vons was a pioneer in Southern California supermarket history, being one of the first grocery stores to offer ready-to-eat hot family meals.",
    "Their 'Jojo potatoes'—thick potato wedges seasoned and fried in the chicken fryers—have developed an iconic local following.",
    "In 1997, Safeway acquired Vons, preserving the beloved regional name and deli recipes that generations of Californians grew up eating.",
    "Vons deli tenders and nuggets are hand-breaded using a traditional seasoned wheat flour dredge with garlic, onion, and black pepper."
  ],

  'bww-nuggets': [
    "Did you know that Buffalo Wild Wings was founded in 1982 by two friends from Buffalo, New York who moved to Ohio and couldn't find authentic Buffalo wings anywhere?",
    "The chain was originally called 'Buffalo Wild Wings & Weck' (BW-3)—the 'Weck' stood for beef on weck, a traditional Buffalo roast beef sandwich on a salted caraway roll.",
    "Buffalo Wild Wings serves over 2 billion wings and boneless nuggets every year across its sports bar locations.",
    "They offer 26 signature sauces and dry seasonings, ranging from Sweet BBQ all the way up to the tongue-torching Carolina Reaper 'Blazin' sauce.",
    "Buffalo Wild Wings employs dedicated 'Guest Experience Captains' equipped with remotes whose only job is to change TV channels to whatever sports game you want to watch.",
    "Boneless nuggets at BWW are made from 100% whole white-meat chicken breast hand-breaded and spun in sauces right at the kitchen line.",
    "Every year during the March Madness college basketball tournament, BWW sells tens of millions of wings in just three weeks."
  ],

  'papa-johns': [
    "Did you know that in 1984, 'Papa' John Schnatter knocked out the broom closet in his father's Jeffersonville, Indiana tavern to install a used pizza oven?",
    "Schnatter sold his prized 1971 Chevrolet Camaro Z28 to buy $1,600 worth of used pizza equipment; decades later, the company spent $250,000 to track down and buy back the exact car!",
    "Papa Johns was the very first national pizza chain in America to offer online ordering to the public, launching in 2001.",
    "The pickled pepperoncini pepper found tucked in every single pizza box was inspired by traditional Italian-American pizzerias in Chicago and New York.",
    "Papa Johns' Special Garlic Dipping Sauce has such an intense cult following that fans have petitioned to buy it by the gallon jug.",
    "Their dough is made with just six simple ingredients: unbleached flour, purified water, sugar, soybean oil, salt, and yeast, fermented for three days.",
    "Papa Johns delivers thousands of free pizzas every year to local schools and community youth sports leagues."
  ],

  chilis: [
    "Did you know that the very first Chili's opened in Dallas, Texas in 1975 in a converted old postal station on Greenville Avenue?",
    "The famous 'I want my baby back, baby back, baby back ribs' jingle was named by Advertising Age as one of the 10 most influential advertising jingles of the 20th century!",
    "The Chili's ribs jingle became even more iconic when it was famously sung by Mike Myers (as Fat Bastard) in the movie 'Austin Powers: The Spy Who Shagged Me'.",
    "Chili's serves more than 60 million pounds of sizzling fajitas every single year worldwide.",
    "Founder Larry Lavine attended the first Terlingua Chili Cookoff in Texas in 1967 and was inspired to create an informal hamburger and chili shack.",
    "Chili's signature Skillet Queso is still made according to a closely guarded Texas recipe blending melted cheeses with ground beef and spices.",
    "Chili's introduced tabletop touchscreen tablets in 2013, letting guests order endless bottomless chips and salsa with a single tap."
  ],

  applebees: [
    "Did you know that Applebee's was founded in Atlanta, Georgia in 1980 under the whimsical name 'T.J. Applebee's Rx for Edibles & Elixirs'?",
    "Country music star Walker Hayes wrote the smash Billboard #1 country hit 'Fancy Like', celebrating date nights eating Bourbon Street Steak and Oreo Shakes at Applebee's!",
    "Applebee's broke restaurant traffic records with their famous 'Dollarita' promotion—serving full-sized margaritas for just $1.00.",
    "Their Spinach and Artichoke Dip is the single most frequently ordered appetizer on the entire Applebee's menu.",
    "Every Applebee's restaurant features framed memorabilia and photography celebrating the local high schools and sports teams in that specific neighborhood.",
    "The famous Applebee's sizzling skillets are designed to produce an appetizing sizzling sound that carries across the entire dining room when served.",
    "Applebee's operates over 1,700 neighborhood grill locations across the United States and 14 countries."
  ],

  ihop: [
    "Did you know that the very first IHOP opened on July 7, 1958 in Toluca Lake, Los Angeles, California by brothers Al and Jerry Lapin?",
    "The iconic blue A-frame roof with steep chalet gables was designed by architect Paul Mirabito to make IHOP instantly recognizable from highway cars.",
    "IHOP serves more than 700 million buttermilk pancakes every single year—enough to circle the Earth multiple times!",
    "The secret trick to making IHOP's world-famous omelettes extra fluffy is whisking a splash of fresh pancake batter into the eggs!",
    "In 2018, IHOP launched a viral worldwide marketing campaign temporarily changing their name to 'IHOb' to announce their new Black Angus steakburger menu.",
    "Every spring on National Pancake Day, IHOP serves millions of free pancakes to guests while raising funds for Children's Miracle Network hospitals.",
    "The original 1958 menu featured exotic pancakes like Tahitian Orange Pineapple pancakes and Persian nut pancakes alongside classic buttermilk."
  ],

  'round-table-pizza': [
    "Did you know that Round Table Pizza was founded in 1959 in Menlo Park, California by Navy veteran William R. Larson?",
    "Larson was inspired by the Arthurian legend of King Arthur and King Arthur's knights, calling his food 'The Last Honest Pizza' to honor chivalric integrity.",
    "Every Round Table pizza crust is rolled by hand from fresh dough made in-store daily, never frozen or pre-sheeted.",
    "Round Table's cheese is a unique three-cheese proprietary blend of whole milk mozzarella, aged sharp cheddar, and aged provolone.",
    "Their pepperoni is specially formulated with extra spices so that when it bakes at high heat, the edges curl and cup with crispy char.",
    "The King Arthur's Supreme pizza is packed with seven distinct toppings: pepperoni, Italian sausage, Italian dry salami, linguica, mushrooms, green peppers, and onions.",
    "Round Table Pizza was one of the first pizzerias in California to offer a salad bar alongside fresh-baked pizza."
  ],

  'mountain-mikes': [
    "Did you know that Mountain Mike's Pizza was founded in Palo Alto, California in 1978 and is famous for its 'Legendary Crispy, Curly Pepperoni'?",
    "A single large Mountain Mike's pepperoni pizza can have up to 200 individual slices of pepperoni piled edge-to-edge across the dough!",
    "When baked in their deck ovens, the pepperoni slices cup up into tiny bowls that trap savory flavors and crisp to perfection.",
    "Mountain Mike's is the official pizza partner of the San Francisco 49ers NFL franchise and the Sacramento Kings NBA team.",
    "Their pizza dough is rolled fresh every single day using premium California wheat flour without artificial additives.",
    "The restaurant interiors feature a rustic mountain ski-lodge aesthetic with natural timber beams, stone accents, and classic family arcade games.",
    "Their signature dessert, the 'Cinnamon Not-Knots', are freshly baked dough knots tossed in butter, brown sugar, cinnamon, and sweet vanilla icing."
  ],

  'ten-ren': [
    "Did you know that Ten Ren was founded in 1953 in Kangshan, Taiwan by tea master Ray Ho Lee and has grown to become one of the premier tea merchants in the world?",
    "Ten Ren was instrumental in bringing authentic Taiwanese boba milk tea and traditional Kung Fu tea ceremonies to Southern California.",
    "Their Taiwanese crispy salt & pepper popcorn chicken is marinated with five-spice powder, soy sauce, and white pepper, then flash-fried with fresh Thai basil leaves.",
    "Ten Ren operates its own traditional tea college and tea culture foundation to preserve centuries-old Asian tea arts.",
    "Ten Ren's specialty 'King's Oolong Tea' is blended with premium ginseng root, giving it a sweet, smooth, naturally energizing herbal finish.",
    "The boba (tapioca pearls) at Ten Ren are slow-simmered in small batches every few hours in natural dark brown sugar syrup for optimal chewiness ('QQ' texture).",
    "In Chinese, the characters 'Ten Ren' (天仁) translate to 'Heavenly Benevolence' or 'Nature's Goodness'."
  ],

  'panera-bread-soup': [
    "Did you know that Panera Bread began in 1987 in Missouri as the 'St. Louis Bread Company', and local St. Louis stores still keep that original name today?",
    "Panera Bread serves over 200 million servings of soup every year, with Broccoli Cheddar Soup accounting for more than 30% of all soup orders!",
    "Panera's sourdough bread bowls are baked fresh before sunrise by overnight artisan bakers using a mother sourdough starter that has been nurtured since 1988.",
    "Panera was the very first national restaurant chain in the United States to voluntarily post calorie counts and nutritional data directly on menu boards.",
    "Their Creamy Tomato Soup is finished with vegetarian heavy cream and garnished with housemade black pepper focaccia croutons.",
    "All unsold artisan breads and baked goods at Panera are packed up at closing time and donated to local food pantries and homeless shelters through their Day-End Dough-Nation program.",
    "In cold winter months, Panera restaurants prepare giant simmering kettles of soup to refill guest bowls every 15 minutes during peak lunch rush."
  ],

  pho: [
    "Did you know that Pho originated in northern Vietnam in the early 20th century in Nam Dinh province, combining Vietnamese rice noodles with French-influenced beef cooking?",
    "A traditional authentic pho beef broth is simmered for anywhere from 10 to 24 hours with charred ginger, roasted onions, star anise, cinnamon quills, cloves, and black cardamom.",
    "In Vietnam, pho is traditionally eaten first thing in the morning for breakfast by locals sitting on low plastic stools at bustling street-corner stalls.",
    "The linguistic origin of the word 'Phở' is widely believed to come from the French dish 'pot-au-feu' (pot on the fire).",
    "Southern Vietnamese pho (Pho Nam) is distinguished by its sweeter broth and generous platters of fresh Thai basil, culantro, lime wedges, jalapeños, and bean sprouts.",
    "When you order 'Phở Tái', the thinly sliced raw beef is placed raw into the bowl and cooked instantly at your table by the piping hot boiling broth!",
    "In 2011, CNN Travel ranked Vietnamese Pho as one of the 50 most delicious foods ever created in human culinary history."
  ],

  cpk: [
    "Did you know that California Pizza Kitchen was founded in Beverly Hills in 1985 by two former federal prosecutors, Rick Rosenfield and Larry Flax?",
    "CPK changed pizza history forever in 1985 by inventing the 'Original BBQ Chicken Pizza'—combining smoky sweet barbecue sauce, smoked gouda, and fresh cilantro on pizza!",
    "Legendary chef Ed LaDou, who had previously worked with Wolfgang Puck at Spago, developed CPK's opening pizza menu.",
    "CPK was the first restaurant chain to popularize cooking unconventional, hearth-baked ingredients like Jamaican jerk chicken, Thai peanut sauce, and Peking duck on pizza dough.",
    "Their crispy Avocado Club Egg Rolls—stuffed with fresh avocado, chicken, bacon, and Monterey Jack—were one of the very first viral casual dining appetizers.",
    "Every CPK hearth oven cooks at temperatures over 550°F to produce their signature blistered, airy, cracker-thin California crust.",
    "CPK has expanded worldwide, introducing California culinary fusion to over 200 locations in 10 countries."
  ],

  'texas-roadhouse': [
    "Did you know that the very first Texas Roadhouse opened on February 17, 1993 in Clarksville, Indiana—not Texas—founded by Kent Taylor?",
    "Every single Texas Roadhouse restaurant employs a full-time, in-house master butcher who works in a 34°F cold room hand-cutting every USDA steak on the menu!",
    "Texas Roadhouse bakes their famous yeast rolls from scratch every five minutes, serving over 500 million warm rolls every single year!",
    "The legendary Honey Cinnamon Butter was originally created by founder Kent Taylor in his personal home kitchen before the first restaurant opened.",
    "At Texas Roadhouse, you can walk up to the glass meat display case in the lobby and personally select the exact cut of ribeye or sirloin you want cooked.",
    "The service staff regularly drop what they're doing to perform fun, choreographed country line dances in the dining room aisles to lively country music.",
    "During the 2020 pandemic, founder Kent Taylor donated his entire year's salary and bonus (over $1.4 million) to support frontline hourly restaurant workers."
  ],

  'chicken-ranch': [
    "Did you know that spit-roasting chicken on a rotisserie dates back to medieval Europe, where rotating spits ensured chicken bastes in its own natural juices?",
    "Chicken Ranch's whole chickens are marinated for over 24 hours in a Mediterranean herb blend before slow-roasting over open heat.",
    "Rotisserie chicken cooking allows excess fat to melt away while crisping the golden skin, resulting in an exceptionally tender, juicy, and healthy meal.",
    "Their housemade ranch dressing and roasted garlic potatoes are made fresh daily from real buttermilk, fresh dill, and crushed cloves.",
    "Chicken Ranch plates are traditionally served with warm toasted pita bread, tangy pickled peppers, and thick garlic toum sauce.",
    "Rotisserie spits rotate continuously at low RPMs, ensuring every side of the chicken receives equal heat and basting."
  ],

  'waba-grill': [
    "Did you know that WaBa Grill was founded in Southern California in 2006 with a mission to make fresh, healthy charbroiled food as accessible as fast food?",
    "WaBa Grill stores feature zero deep fryers in their kitchens—every single piece of chicken, ribeye steak, and salmon is charbroiled over an open flame grill!",
    "Their famous signature 'WaBa Sauce' is basted directly onto meats while grilling and has a sweet teriyaki flavor with toasted sesame and ginger.",
    "The most popular order at WaBa Grill is the 'Half & Half Bowl', giving you both charbroiled chicken and tender ribeye steak over steamed rice.",
    "WaBa Grill uses only wild-caught salmon and all-natural white meat chicken with no artificial additives or trans fats.",
    "Their 'Boom Boom Tacos' fuse Asian teriyaki flavors with Mexican street tacos, serving grilled meat with sesame slaw in soft corn tortillas.",
    "WaBa Grill offers both steamed white calrose rice and nutrient-rich organic brown rice cooked in large commercial rice cookers throughout the day."
  ],

  'flame-broiler': [
    "Did you know that Flame Broiler was founded in 1995 in Orange County, California by Young Lee, an insurance agent who suffered health issues from eating greasy fast food on the road?",
    "Lee designed the Flame Broiler menu with a simple health philosophy: no fryers, no trans fats, no added MSG, and zero dairy!",
    "Their famous 'Magic Sauce' has an obsessive following—it is a light, savory Korean-style soy and fruit reduction that coats the hot rice.",
    "For spice lovers, Flame Broiler's 'Triple Hot Sauce' (marked with three hot peppers on the bottle) is notorious for its fierce, addictive kick.",
    "Their top-selling bowl, 'The Works', pairs marinated flame-broiled chicken and USDA choice beef over a bed of steamed white or brown rice with fresh blanched broccoli and carrots.",
    "From its humble first store in Fullerton, California, Flame Broiler has grown to more than 140 locations across the Western United States.",
    "Flame Broiler's beef and chicken are charbroiled on heavy grooved cast-iron flame grills, giving each tender slice authentic grill marks and smoky flavor."
  ]
};

/**
 * Returns a random fun fact for the given choiceId, falling back to a general culinary trivia fact.
 */
export function getFunFactForRestaurant(choiceId: string, currentFactIndex?: number): { fact: string; nextIndex: number; totalFacts: number } {
  const facts = RESTAURANT_FUN_FACTS[choiceId] || [
    "Did you know that eating with friends and loved ones releases endorphins that make meals taste noticeably more satisfying?",
    "Did you know that taking time to try different cuisines exercises brain plasticity and keeps your taste buds sharp?",
    "Did you know that charcoal-grilled and wood-smoked foods trigger comforting evolutionary flavor memories dating back thousands of years?"
  ];

  const totalFacts = facts.length;
  let index: number;

  if (typeof currentFactIndex === 'number') {
    index = (currentFactIndex + 1) % totalFacts;
  } else {
    index = Math.floor(Math.random() * totalFacts);
  }

  return {
    fact: facts[index],
    nextIndex: index,
    totalFacts
  };
}
