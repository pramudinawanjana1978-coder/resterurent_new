// ─── SHARED DATA & CONSTANTS ──────────────────────────────────────────────────

// ─── DISH VARIANTS (photo carousel per dish) ───────────────────────────────

export const dishVariants = {
  1:  { name:"Blueberry Pancakes", variants:[
    { label:"Classic Stack",     bg:"linear-gradient(135deg,#fff3e0,#ffe0a0)", image: "/images/pancake2.jpg",  note:"3 fluffy pancakes, fresh blueberries, maple syrup" },
    { label:"Whipped Cream",     bg:"linear-gradient(135deg,#fce4ec,#f8bbd0)",image: "/images/pancake2.jpg",  note:"Topped with vanilla whipped cream & berry compote" },
    { label:"Nutella Drizzle",   bg:"linear-gradient(135deg,#efebe9,#d7ccc8)", image: "/images/pancake2.jpg",  note:"Hazelnut spread swirled between each layer" },
    { label:"Vegan Stack",       bg:"linear-gradient(135deg,#e8f5e9,#c8e6c9)", image: "/images/pancake2.jpg",  note:"Oat milk batter, coconut cream, agave syrup" },
  ]},
  2:  { name:"Eggs Benedict", variants:[
    { label:"Classic",           bg:"linear-gradient(135deg,#fffde7,#fff9c4)", image: "/images/Eggs_Benedict.jpg", note:"Poached eggs, Canadian bacon, hollandaise" },
    { label:"Florentine",        bg:"linear-gradient(135deg,#e8f5e9,#dcedc8)", image: "/images/Eggs_Benedict.jpg", note:"Wilted spinach instead of bacon" },
    { label:"Salmon",            bg:"linear-gradient(135deg,#fce4ec,#ffccbc)", image: "/images/Eggs_Benedict.jpg", note:"Smoked salmon with dill hollandaise" },
    { label:"Avocado",           bg:"linear-gradient(135deg,#f1f8e9,#e8f5e9)", image: "/images/Eggs_Benedict.jpg", note:"Crushed avocado base, poached egg, sriracha" },
  ]},
  3:  { name:"Avocado Toast", variants:[
    { label:"Simple",            bg:"linear-gradient(135deg,#f1f8e9,#e8f5e9)",image: "/images/avacado_toast.jpg", note:"Smashed avo, sea salt, chilli flakes on sourdough" },
    { label:"Egg on Top",        bg:"linear-gradient(135deg,#fffde7,#fff9c4)", image: "/images/avacado_toast.jpg", note:"Poached egg nestled on smashed avocado" },
    { label:"Feta & Tomato",     bg:"linear-gradient(135deg,#fce4ec,#f8bbd0)", image: "/images/avacado_toast.jpg", note:"Crumbled feta, cherry tomatoes, balsamic glaze" },
    { label:"Prawn Toast",       bg:"linear-gradient(135deg,#e3f2fd,#bbdefb)", image: "/images/avacado_toast.jpg", note:"Sautéed garlic prawns atop avocado toast" },
  ]},
  4:  { name:"French Toast", variants:[
    { label:"Brioche Classic",   bg:"linear-gradient(135deg,#fff3e0,#ffe0a0)",  image: "/images/French_Toast.jpg", note:"Thick brioche, vanilla custard, powdered sugar" },
    { label:"Stuffed",           bg:"linear-gradient(135deg,#fce4ec,#f8bbd0)",  image: "/images/French_Toast.jpg", note:"Cream cheese & strawberry jam filled" },
    { label:"Banana Foster",     bg:"linear-gradient(135deg,#efebe9,#d7ccc8)",  image: "/images/French_Toast.jpg", note:"Caramelised banana, rum sauce, ice cream" },
    { label:"Savoury",           bg:"linear-gradient(135deg,#e8f5e9,#dcedc8)", image: "/images/French_Toast.jpg",note:"Gruyère, fresh herbs, prosciutto on toast" },
  ]},
  5:  { name:"Acai Bowl", variants:[
    { label:"Classic Acai",      bg:"linear-gradient(135deg,#ede7f6,#d1c4e9)", image: "/images/SmoothieBowl.jpg",  note:"Acai blend, banana, granola, fresh berries" },
    { label:"Tropical",          bg:"linear-gradient(135deg,#fff3e0,#ffe0a0)", image: "/images/SmoothieBowl.jpg",  note:"Mango base, coconut flakes, pineapple chunks" },
    { label:"Green Boost",       bg:"linear-gradient(135deg,#e8f5e9,#c8e6c9)", image: "/images/SmoothieBowl.jpg",  note:"Spirulina, kiwi, spinach, chia seeds" },
    { label:"Peanut Butter",     bg:"linear-gradient(135deg,#efebe9,#d7ccc8)", image: "/images/SmoothieBowl.jpg",  note:"Peanut butter swirl, cacao nibs, banana" },
  ]},
  6:  { name:"Breakfast Burrito", variants:[
    { label:"Classic",           bg:"linear-gradient(135deg,#fff3e0,#ffe0a0)", emoji:"🌯", note:"Scrambled eggs, cheddar, salsa, sour cream" },
    { label:"Spicy Chorizo",     bg:"linear-gradient(135deg,#fbe9e7,#ffccbc)", emoji:"🌶️", note:"Chorizo, jalapeños, pepper jack, chipotle" },
    { label:"Veggie",            bg:"linear-gradient(135deg,#e8f5e9,#c8e6c9)", emoji:"🫑", note:"Black beans, roasted peppers, avocado, feta" },
    { label:"Smoked Salmon",     bg:"linear-gradient(135deg,#e3f2fd,#bbdefb)", emoji:"🐟", note:"Cream cheese, smoked salmon, capers, dill" },
  ]},
  7:  { name:"Granola Parfait", variants:[
    { label:"Classic Berry",     bg:"linear-gradient(135deg,#fce4ec,#f8bbd0)", emoji:"🥣", note:"Greek yogurt, honey granola, mixed berries" },
    { label:"Mango Passion",     bg:"linear-gradient(135deg,#fff3e0,#ffe0a0)", emoji:"🥭", note:"Mango coulis, passion fruit, toasted coconut" },
    { label:"Chocolate",         bg:"linear-gradient(135deg,#efebe9,#d7ccc8)", emoji:"🍫", note:"Cocoa granola, chocolate yogurt, raspberries" },
    { label:"Matcha",            bg:"linear-gradient(135deg,#e8f5e9,#c8e6c9)", emoji:"🍵", note:"Matcha yogurt, white chocolate, kiwi slices" },
  ]},
  8:  { name:"Smoked Salmon Bagel", variants:[
    { label:"Classic",           bg:"linear-gradient(135deg,#e3f2fd,#bbdefb)", emoji:"🐟", note:"Cream cheese, capers, red onion, dill" },
    { label:"Avocado Smash",     bg:"linear-gradient(135deg,#e8f5e9,#c8e6c9)", emoji:"🥑", note:"Smashed avocado base instead of cream cheese" },
    { label:"Everything Bagel",  bg:"linear-gradient(135deg,#efebe9,#d7ccc8)", emoji:"🫙", note:"Everything seasoning bagel, whipped cream cheese" },
    { label:"Open Face",         bg:"linear-gradient(135deg,#fce4ec,#f8bbd0)", emoji:"🍋", note:"Open bagel, lemon crème fraîche, microgreens" },
  ]},
  9:  { name:"Omelette du Chef", variants:[
    { label:"Mushroom & Herb",   bg:"linear-gradient(135deg,#fffde7,#fff9c4)", emoji:"🧀", note:"Wild mushrooms, fresh thyme, gruyère" },
    { label:"Spanish",           bg:"linear-gradient(135deg,#fbe9e7,#ffccbc)", emoji:"🍅", note:"Chorizo, peppers, manchego, paprika" },
    { label:"Garden",            bg:"linear-gradient(135deg,#e8f5e9,#c8e6c9)", emoji:"🌿", note:"Spinach, cherry tomato, goat cheese, basil" },
    { label:"Truffle",           bg:"linear-gradient(135deg,#efebe9,#d7ccc8)", emoji:"🍄", note:"Black truffle, brie, chives, sea salt" },
  ]},
  10: { name:"Fresh Fruit Platter", variants:[
    { label:"Tropical",          bg:"linear-gradient(135deg,#fff3e0,#ffe0a0)", emoji:"🍍", note:"Mango, pineapple, papaya, passion fruit" },
    { label:"Berry Medley",      bg:"linear-gradient(135deg,#fce4ec,#f8bbd0)", emoji:"🍓", note:"Strawberries, raspberries, blueberries, blackberries" },
    { label:"Citrus",            bg:"linear-gradient(135deg,#fffde7,#fff9c4)", emoji:"🍊", note:"Orange, grapefruit, clementine, lemon zest" },
    { label:"Chef's Selection",  bg:"linear-gradient(135deg,#e8f5e9,#c8e6c9)", emoji:"🍉", note:"Seasonal picks with honey yogurt dip" },
  ]},
  11: { name:"Waffles & Cream", variants:[
    { label:"Classic Belgian",   bg:"linear-gradient(135deg,#fffde7,#fff9c4)", emoji:"🧇", note:"Crispy waffle, whipped cream, fresh strawberries" },
    { label:"Lotus Biscoff",     bg:"linear-gradient(135deg,#efebe9,#d7ccc8)", emoji:"🍪", note:"Biscoff spread, caramelised cookie crumble" },
    { label:"S'mores",           bg:"linear-gradient(135deg,#fbe9e7,#ffccbc)", emoji:"🍫", note:"Marshmallow fluff, chocolate sauce, graham cracker" },
    { label:"Matcha Cream",      bg:"linear-gradient(135deg,#e8f5e9,#c8e6c9)", emoji:"🍵", note:"Matcha whipped cream, red bean paste, mochi" },
  ]},
  12: { name:"Shakshuka", variants:[
    { label:"Classic",           bg:"linear-gradient(135deg,#fbe9e7,#ffccbc)", emoji:"🍅", note:"Spiced tomato sauce, poached eggs, feta" },
    { label:"Green",             bg:"linear-gradient(135deg,#e8f5e9,#c8e6c9)", emoji:"🌿", note:"Tomatillo, spinach, jalapeño, cotija cheese" },
    { label:"Harissa",           bg:"linear-gradient(135deg,#fff3e0,#ffe0a0)", emoji:"🌶️", note:"Extra harissa, merguez sausage, preserved lemon" },
    { label:"White",             bg:"linear-gradient(135deg,#e3f2fd,#bbdefb)", emoji:"🧄", note:"Cream, garlic, leek base with soft eggs" },
  ]},
};


// ─── REVIEWS ──────────────────────────────────────────────────────────────────

export const reviews = [
  { name:"Kasun Perera",    avatar:"👨",  stars:5, time:"2 days ago",  text:"Very delicious and fresh food. Highly recommended!", likes:12 },
  { name:"Nethmi Silva",    avatar:"👩",  stars:5, time:"1 week ago",  text:"Fast delivery and excellent taste. Will order again!", likes:8 },
  { name:"Tharindu Fernando",avatar:"🧑", stars:4, time:"2 weeks ago", text:"Portion size is perfect and food was so juicy.",      likes:7 },
];

// ─── CATEGORY DATA ────────────────────────────────────────────────────────────

export const categoryConfig = {
  Breakfast: {
    tagline:"Good Food,\nGood ", moodWord:"Morning!",
    desc:"Start your day right with fresh ingredients and love.",
    accentColor:"#f5a623", bannerGrad:"linear-gradient(135deg,#fff3e0 0%,#ffe0a0 100%)",
    slides:[
      [{emoji:"🥞",image:"/images/pancake2.jpg",name:"Pancakes"},
        {emoji:"🍳",image:"/images/Eggs_Benedict.jpg",name:"Eggs Benedict"},
        {emoji:"🥑",image:"/images/avacado_toast.jpg",name:"Avocado Toast"},
        {emoji:"🍞",image:"/images/French_Toast.jpg",name:"French Toast"},
        {emoji:"🫐",image:"/images/SmoothieBowl.jpg",name:"Acai Bowl"},
        {emoji:"🌯",image:"/images/Tostwithegg.jpg",name:"Burrito"},
        {emoji:"🥣",image:"/images/GranolawithYogurt.jpg",name:"Granola"},
        {emoji:"🐟",image:"/images/Bacon_Eggs.jpg",name:"Salmon Bagel"}],

      [{emoji:"🧀",image:"/images/Omelette.jpg",name:"Omelette"},
        {emoji:"🍓",image:"/images/fruitsalad.jpg",name:"Fruit Platter"},
        {emoji:"🧇",image:"/images/Belgian_waffles.jpg",name:"Waffles"},
        {emoji:"🍅",image:"/images/Tostwithegg.jpg",name:"Shakshuka"},
        {emoji:"🥚",image:"/images/boiledEggswith Toast.jpg",name:"Boiled Eggs"},
        {emoji:"🧈",image:"/images/French_Toast.jpg",name:"Crepes"},
        {emoji:"☕",image:"/images/cappatunio.jpg",name:"Coffee"},
        {emoji:"🥐",image:"/images/lucidrealistic_buttery.jpg",name:"Croissant"}],
    ],
  },
  Lunch: {
    tagline:"Good Food,\nGood ", moodWord:"Noon!",
    desc:"Energise your afternoon with fresh wraps and hearty sandwiches.",
    accentColor:"#43a047", bannerGrad:"linear-gradient(135deg,#e8f5e9 0%,#c8e6c9 100%)",
    slides:[
      [{emoji:"🥗",image:"/images/PrawnCurry.jpg",name:"eggrice"},
        {emoji:"🥙",image:"/images/chickenbiriyani.png",name:"Wrap"},
        {emoji:"🥪",image:"/images/WholeWheatSandwich.jpg",name:"Sandwich"},
        {emoji:"🍜",image:"/images/Black Pork Curry.jpg",name:"Noodle Soup"},
        {emoji:"🌮",image:"/images/porkrice.png",name:"Tacos"},
        {emoji:"🫔",image:"/images/ChickenKottu.jpg",name:"Burrito"},
        {emoji:"🥘",image:"/images/SeafoodKottu.jpg",name:"Paella"},
        {emoji:"🍱",image: "/images/FriedFish.jpg",name:"Bento Box"}],
      [{emoji:"🍝",image:"/images/pancake2.jpg",name:"Pasta"},
        {emoji:"🥣",image:"/images/mixrice.png",name:"Grain Bowl"},
        {emoji:"🫕",image:"/images/porkrice.png",name:"Stew"},
        {emoji:"🥦",image:"/images/vegerice.png",name:"Stir Fry"},
        {emoji:"🍛",image:"/images/udechicken.png",name:"Curry"},
        {emoji:"🧆",image:"/images/vegerice.png",name:"Falafel"},
        {emoji:"🥬",image:"/images/fruitsalad.jpg",name:"Caesar"},
        {emoji:"🫙",image:"/images/vegerice.png",name:"Hummus"}],
    ],
  },
  Dinner: {
    tagline:"Good Food,\nGood ", moodWord:"Evening!",
    desc:"Wind down with rich, slow-cooked flavours crafted for the evening.",
    accentColor:"#c62828", bannerGrad:"linear-gradient(135deg,#fbe9e7 0%,#ffccbc 100%)",
    slides:[
      [{emoji:"🥩",image:"/images/beefrice.jpg",name:"Grilled Steak"},{emoji:"🍗",image:"/images/chickenrice.jpg",name:"Roast Chicken"},{emoji:"🍖",image:"/images/porkrice.jpg",name:"Lamb Chops"},{emoji:"🦞",image:"/images/fishrice.jpg",name:"Lobster"},{emoji:"🍣",image:"/images/fishrice.jpg",name:"Sushi"},{emoji:"🥘",image:"/images/beefrice.jpg",name:"Tagine"},{emoji:"🍲",image:"/images/beefrice.jpg",name:"Braised Beef"},{emoji:"🫕",image:"/images/porkrice.jpg",name:"Hot Pot"}],
      [{emoji:"🦐",image:"/images/fishrice.jpg",name:"Prawns"},{emoji:"🐟",image:"/images/fishrice.jpg",name:"Sea Bass"},{emoji:"🥓",image:"/images/porkrice.jpg",name:"Pork Belly"},{emoji:"🫙",image:"/images/chickenrice.jpg",name:"Duck Confit"},{emoji:"🥗",image:"/images/fruitsalad.jpg",name:"Niçoise"},{emoji:"🍝",image:"/images/pancake2.jpg",name:"Carbonara"},{emoji:"🥞",image:"/images/French_Toast.jpg",name:"Savoury Crepe"},{emoji:"🧅",image:"/images/porkrice.jpg",name:"French Onion Soup"}],
    ],
  },
  Desserts: {
    tagline:"Good Food,\nGood ", moodWord:"Sweet!",
    desc:"End on a high note with silky mousses and artisan gelato.",
    accentColor:"#ad1457", bannerGrad:"linear-gradient(135deg,#fce4ec 0%,#f8bbd0 100%)",
    slides:[
      [{emoji:"🍫",image:"/images/chocolate_pancakes.jpg",name:"Mousse"},{emoji:"🍰",image:"/images/Tostwithegg.jpg",name:"Cheesecake"},{emoji:"🎂",image:"/images/Tostwithegg.jpg",name:"Cake"},{emoji:"🍮",image:"/images/Tostwithegg.jpg",name:"Crème Brûlée"},{emoji:"🍩",image:"/images/muffin.jpg",name:"Doughnuts"},{emoji:"🧁",image:"/images/muffin.jpg",name:"Cupcake"},{emoji:"🍦",image:"/images/SmoothieBowl.jpg",name:"Ice Cream"},{emoji:"🥧",image:"/images/French_Toast.jpg",name:"Tart"}],
      [{emoji:"🍬",image:"/images/muffin.jpg",name:"Candy"},{emoji:"🍭",image:"/images/muffin.jpg",name:"Lollipop"},{emoji:"🍪",image:"/images/muffin.jpg",name:"Cookies"},{emoji:"🥐",image:"/images/lucidrealistic_buttery.jpg",name:"Pain au Chocolat"},{emoji:"🍨",image:"/images/SmoothieBowl.jpg",name:"Sorbet"},{emoji:"🧇",image:"/images/Belgian_waffles.jpg",name:"Dessert Waffle"},{emoji:"🫐",image:"/images/SmoothieBowl.jpg",name:"Pavlova"},{emoji:"🍓",image:"/images/fruitsalad.jpg",name:"Trifle"}],
    ],
  },
  Drinks: {
    tagline:"Good Vibes,\nGood ", moodWord:"Sip!",
    desc:"Refresh with handcrafted beverages from cold-pressed juices to cocktails.",
    accentColor:"#0277bd", bannerGrad:"linear-gradient(135deg,#e3f2fd 0%,#b3e5fc 100%)",
    slides:[
      [{emoji:"☕",image:"/images/cappatunio.jpg",name:"Espresso"},{emoji:"🧋",image:"/images/milkTea.jpg",name:"Bubble Tea"},{emoji:"🥤",image:"/images/latte.jpg",name:"Smoothie"},{emoji:"🍹",image:"/images/lucid-origin_Professional_studio_food_photography_of_DRINK_NAME_served_in_a_premium_stylish_c-0.jpg",name:"Cocktail"},{emoji:"🍊",image:"/images/Tostwithegg.jpg",name:"Fresh OJ"},{emoji:"🍵",image:"/images/green_tea.jpg",name:"Matcha"},{emoji:"🧃",image:"/images/Tostwithegg.jpg",name:"Cold Press"},{emoji:"🫖",image:"/images/black_tea.jpg",name:"Herbal Tea"}],
      [{emoji:"🍺",image:"/images/Tostwithegg.jpg",name:"Craft Beer"},{emoji:"🍷",image:"/images/Tostwithegg.jpg",name:"Red Wine"},{emoji:"🥂",image:"/images/Tostwithegg.jpg",name:"Champagne"},{emoji:"🍸",image:"/images/lucid-origin_Professional_studio_food_photography_of_DRINK_NAME_served_in_a_premium_stylish_c-0.jpg",name:"Martini"},{emoji:"🧊",image:"/images/latte.jpg",name:"Iced Latte"},{emoji:"🍋",image:"/images/ginger_tea.jpg",name:"Lemonade"},{emoji:"🫧",image:"/images/Tostwithegg.jpg",name:"Sparkling"},{emoji:"🍶",image:"/images/black_tea.jpg",name:"Sake"}],
    ],
  },
};

export const allDishes = {
  Breakfast:[
    {id:1, name:"Blueberry Pancakes",  image:"/images/pancake2.jpg", price:"Rs. 1,850", emoji:"🥞", color:"#FFF3E0", desc:"Fluffy stacks with fresh blueberries & maple syrup", rating:4.8, reviews:120, ingredients:["Flour","Eggs","Blueberries","Maple Syrup","Butter"], subcategory:"Western Breakfast Favorites"},
    {id:2, name:"Eggs Benedict",       image:"/images/Eggs_Benedict.jpg", price:"Rs. 2,100", emoji:"🍳", color:"#FFF8E1", desc:"Poached eggs on English muffin with hollandaise",    rating:4.7, reviews:98,  ingredients:["Eggs","Canadian Bacon","English Muffin","Hollandaise","Chives"], subcategory:"Western Breakfast Favorites"},
    {id:3, name:"Avocado Toast",       image:"/images/avacado_toast.jpg", price:"Rs. 1,600", emoji:"🥑", color:"#F1F8E9", desc:"Smashed avo on sourdough with poached egg",           rating:4.6, reviews:84,  ingredients:["Avocado","Sourdough","Egg","Chilli Flakes","Lemon"], subcategory:"Light Bites & Sandwiches"},
    {id:4, name:"French Toast",        image:"/images/French_Toast.jpg", price:"Rs. 1,750", emoji:"🍞", color:"#FFF3E0", desc:"Brioche dipped in custard, dusted with powdered sugar",rating:4.9, reviews:145, ingredients:["Brioche","Eggs","Vanilla","Cinnamon","Powdered Sugar"], subcategory:"Western Breakfast Favorites"},
    {id:5, name:"Acai Bowl",           price:"Rs. 2,000", emoji:"🫐", color:"#EDE7F6", desc:"Blended acai base topped with granola & fresh fruits", rating:4.7, reviews:72,  ingredients:["Acai","Banana","Granola","Honey","Mixed Berries"], subcategory:"Light Bites & Sandwiches"},
    {id:6, name:"Breakfast Burrito",   price:"Rs. 1,800", emoji:"🌯", color:"#FBE9E7", desc:"Scrambled eggs, cheese, salsa in a warm tortilla",    rating:4.5, reviews:61,  ingredients:["Eggs","Cheddar","Salsa","Flour Tortilla","Sour Cream"], subcategory:"Western Breakfast Favorites"},
    {id:7, name:"Granola Parfait",     price:"Rs. 1,450", emoji:"🥣", color:"#E8F5E9", desc:"Layers of Greek yogurt, granola & seasonal berries",  rating:4.6, reviews:53,  ingredients:["Greek Yogurt","Granola","Honey","Mixed Berries","Chia Seeds"], subcategory:"Light Bites & Sandwiches"},
    {id:8, name:"Smoked Salmon Bagel", price:"Rs. 2,300", emoji:"🐟", color:"#E3F2FD", desc:"Cream cheese, capers & dill on a toasted bagel",      rating:4.8, reviews:88,  ingredients:["Bagel","Smoked Salmon","Cream Cheese","Capers","Dill"], subcategory:"Light Bites & Sandwiches"},
    {id:9, name:"Omelette du Chef",    price:"Rs. 1,950", emoji:"🧀", color:"#FFFDE7", desc:"Three-egg omelette with mushrooms, herbs & gruyère",  rating:4.7, reviews:77,  ingredients:["Eggs","Gruyère","Mushrooms","Thyme","Butter"], subcategory:"Western Breakfast Favorites"},
    {id:10,name:"Fresh Fruit Platter", price:"Rs. 1,300", emoji:"🍓", color:"#FCE4EC", desc:"Seasonal fruits with honey yogurt dip",               rating:4.5, reviews:44,  ingredients:["Seasonal Fruits","Greek Yogurt","Honey","Mint","Lime Zest"], subcategory:"Light Bites & Sandwiches"},
    {id:11,name:"Waffles & Cream",     price:"Rs. 1,670", emoji:"🧇", color:"#FFF8E1", desc:"Crispy Belgian waffles with whipped cream",           rating:4.8, reviews:109, ingredients:["Waffle Mix","Whipped Cream","Strawberries","Maple Syrup","Butter"], subcategory:"Western Breakfast Favorites"},
    {id:12,name:"Shakshuka",           price:"Rs. 2,050", emoji:"🍅", color:"#FFEBEE", desc:"Eggs poached in spiced tomato & pepper sauce",        rating:4.6, reviews:66,  ingredients:["Eggs","Tomatoes","Peppers","Feta","Cumin"], subcategory:"Western Breakfast Favorites"},
  ],
  Lunch:[
    {id:101,name:"Garden Fresh Salad",image:"/images/fruitsalad.jpg",price:"Rs. 1,450",emoji:"🥗",color:"#F1F8E9",desc:"Crisp greens, cherry tomatoes, house vinaigrette",rating:4.6,reviews:58,ingredients:["Mixed Greens","Cherry Tomatoes","Cucumber","Feta","Vinaigrette"]},
    {id:102,name:"Chicken Wrap",      image:"/images/WholeWheatSandwich.jpg",price:"Rs. 1,750",emoji:"🥙",color:"#E8F5E9",desc:"Grilled chicken, lettuce, tzatziki in flatbread", rating:4.7,reviews:72,ingredients:["Chicken Breast","Flatbread","Lettuce","Tzatziki","Tomato"]},
    {id:103,name:"Club Sandwich",     image:"/images/WholeWheatSandwich.jpg",price:"Rs. 1,820",emoji:"🥪",color:"#FFF8E1",desc:"Triple-decker with turkey, bacon & avocado",     rating:4.5,reviews:49,ingredients:["Turkey","Bacon","Avocado","Toasted Bread","Mayo"]},
    {id:104,name:"Tom Kha Soup",      image:"/images/porkrice.png",price:"Rs. 1,600",emoji:"🍜",color:"#F3E5F5",desc:"Coconut broth with galangal & mushrooms",        rating:4.8,reviews:91,ingredients:["Coconut Milk","Galangal","Mushrooms","Lemongrass","Lime"]},
    {id:105,name:"Street Tacos",      price:"Rs. 1,520",emoji:"🌮",color:"#FFF3E0",desc:"Corn tortillas with slow-braised beef",          rating:4.6,reviews:63,ingredients:["Beef","Corn Tortillas","Salsa","Guacamole","Coriander"]},
    {id:106,name:"Grain Buddha Bowl", price:"Rs. 1,960",emoji:"🥘",color:"#E3F2FD",desc:"Quinoa, roasted veg, tahini & pickled cabbage", rating:4.7,reviews:55,ingredients:["Quinoa","Roasted Veg","Tahini","Pickled Cabbage","Chickpeas"]},
    {id:107,name:"Prawn Bento",       price:"Rs. 2,180",emoji:"🍱",color:"#FCE4EC",desc:"Tempura prawns, steamed rice, edamame, miso",   rating:4.9,reviews:107,ingredients:["Prawns","Jasmine Rice","Edamame","Miso Soup","Tempura Batter"]},
    {id:108,name:"Pasta Primavera",   price:"Rs. 1,880",emoji:"🍝",color:"#F1F8E9",desc:"Seasonal vegetables tossed with linguine",       rating:4.5,reviews:41,ingredients:["Linguine","Zucchini","Cherry Tomatoes","Basil","Parmesan"]},
  ],
  Dinner:[
    {id:201,name:"Grilled Ribeye",    image:"/images/beefrice.jpg",price:"Rs. 4,800",emoji:"🥩",color:"#FBE9E7",desc:"300g prime ribeye, chimichurri & truffle fries",  rating:4.9,reviews:188,ingredients:["Ribeye Steak","Chimichurri","Truffle","Fries","Rosemary"]},
    {id:202,name:"Roast Chicken",     image:"/images/chickenrice.jpg",price:"Rs. 3,340",emoji:"🍗",color:"#FFF8E1",desc:"Herb-rubbed half chicken with roasted vegetables",rating:4.7,reviews:134,ingredients:["Chicken","Mixed Herbs","Root Vegetables","Garlic","Butter"]},
    {id:203,name:"Lamb Cutlets",      image:"/images/porkrice.jpg",price:"Rs. 4,200",emoji:"🍖",color:"#FFEBEE",desc:"French-trimmed lamb with rosemary jus & gratin",  rating:4.8,reviews:97, ingredients:["Lamb Cutlets","Rosemary","Potato Gratin","Red Wine Jus","Mint"]},
    {id:204,name:"Lobster Thermidor", image:"/images/fishrice.jpg",price:"Rs. 7,100",emoji:"🦞",color:"#FFF3E0",desc:"Whole lobster in creamy cognac & mustard sauce",  rating:4.9,reviews:61, ingredients:["Lobster","Cognac","Mustard","Gruyère","Cream"]},
    {id:205,name:"Salmon Teriyaki",   price:"Rs. 3,620",emoji:"🐟",color:"#E3F2FD",desc:"Glazed salmon fillet with sesame bok choy",       rating:4.7,reviews:112,ingredients:["Salmon","Teriyaki Glaze","Bok Choy","Sesame","Ginger"]},
    {id:206,name:"Beef Tagine",       price:"Rs. 3,910",emoji:"🥘",color:"#F3E5F5",desc:"Slow-cooked beef with prunes & saffron couscous", rating:4.8,reviews:78, ingredients:["Beef","Prunes","Saffron","Couscous","Almonds"]},
    {id:207,name:"Prawn Pasta",       price:"Rs. 3,400",emoji:"🦐",color:"#F1F8E9",desc:"King prawns, chilli, garlic, cherry tomato",      rating:4.6,reviews:93, ingredients:["King Prawns","Linguine","Chilli","Garlic","Cherry Tomatoes"]},
    {id:208,name:"Duck Confit",       price:"Rs. 4,350",emoji:"🍗",color:"#FCE4EC",desc:"Slow-cooked duck leg, lentils du Puy & orange jus",rating:4.9,reviews:52,ingredients:["Duck Leg","Lentils","Orange","Thyme","Star Anise"]},
  ],
  Desserts:[
    {id:301,name:"Chocolate Fondant", image:"/images/chocolate_pancakes.jpg",price:"Rs. 1,450",emoji:"🍫",color:"#F3E5F5",desc:"Warm chocolate lava cake with vanilla ice cream",   rating:4.9,reviews:201,ingredients:["Dark Chocolate","Eggs","Flour","Vanilla Ice Cream","Cocoa"]},
    {id:302,name:"NY Cheesecake",     image:"/images/Tostwithegg.jpg",price:"Rs. 1,300",emoji:"🍰",color:"#FFF8E1",desc:"Velvety cream cheese on graham cracker base",       rating:4.7,reviews:156,ingredients:["Cream Cheese","Graham Cracker","Eggs","Vanilla","Sour Cream"]},
    {id:303,name:"Crème Brûlée",      image:"/images/Tostwithegg.jpg",price:"Rs. 1,230",emoji:"🍮",color:"#FFF3E0",desc:"Classic vanilla custard with caramelised top",      rating:4.8,reviews:133,ingredients:["Heavy Cream","Eggs","Vanilla","Sugar","Caramel"]},
    {id:304,name:"Glazed Doughnuts",  image:"/images/muffin.jpg",price:"Rs. 1,015",emoji:"🍩",color:"#FCE4EC",desc:"Fresh-fried ring doughnuts with seasonal glazes",   rating:4.5,reviews:88, ingredients:["Flour","Yeast","Sugar","Glaze","Sprinkles"]},
    {id:305,name:"Salted Caramel Tart",price:"Rs. 1,160",emoji:"🥧",color:"#FFEBEE",desc:"Buttery pastry with silky salted caramel filling", rating:4.7,reviews:74, ingredients:["Pastry","Caramel","Sea Salt","Cream","Butter"]},
    {id:306,name:"Artisan Ice Cream",  price:"Rs. 1,090",emoji:"🍦",color:"#E3F2FD",desc:"Three scoops of house-churned gelato",              rating:4.6,reviews:119,ingredients:["Milk","Cream","Sugar","Eggs","Seasonal Flavour"]},
    {id:307,name:"Berry Pavlova",      price:"Rs. 1,380",emoji:"🫐",color:"#EDE7F6",desc:"Crisp meringue, whipped cream & fresh berries",    rating:4.8,reviews:97, ingredients:["Meringue","Whipped Cream","Mixed Berries","Icing Sugar","Mint"]},
    {id:308,name:"Tiramisu",           price:"Rs. 1,305",emoji:"☕",color:"#FFF8E1",desc:"Espresso-soaked ladyfingers with mascarpone",      rating:4.9,reviews:162,ingredients:["Ladyfingers","Espresso","Mascarpone","Cocoa","Cream"]},
  ],
  Drinks:[
    {id:401,name:"Cold Brew Coffee",  image:"/images/cappatunio.jpg",price:"Rs.  870",emoji:"☕",color:"#FFF8E1",desc:"18-hour steeped single-origin cold brew over ice", rating:4.7,reviews:88, ingredients:["Single Origin Coffee","Filtered Water","Ice","Optional Oat Milk"]},
    {id:402,name:"Mango Bubble Tea",  image:"/images/milkTea.jpg",price:"Rs.  940",emoji:"🧋",color:"#FFF3E0",desc:"Fresh mango milk tea with tapioca pearls",         rating:4.8,reviews:114,ingredients:["Mango Puree","Milk Tea","Tapioca Pearls","Sugar","Ice"]},
    {id:403,name:"Green Smoothie",    image:"/images/latte.jpg",price:"Rs. 1,160",emoji:"🥤",color:"#E8F5E9",desc:"Spinach, banana, mango, coconut water blend",     rating:4.5,reviews:61, ingredients:["Spinach","Banana","Mango","Coconut Water","Chia Seeds"]},
    {id:404,name:"Classic Mojito",    image:"/images/lucid-origin_Professional_studio_food_photography_of_DRINK_NAME_served_in_a_premium_stylish_c-0.jpg",price:"Rs. 1,450",emoji:"🍹",color:"#F1F8E9",desc:"Muddled mint, lime, rum & sparkling soda",        rating:4.7,reviews:79, ingredients:["White Rum","Lime","Mint","Sugar","Soda Water"]},
    {id:405,name:"Fresh Orange Juice",price:"Rs.  800",emoji:"🍊",color:"#FFF3E0",desc:"Cold-pressed from hand-picked Valencia oranges",   rating:4.6,reviews:52, ingredients:["Valencia Oranges"]},
    {id:406,name:"Matcha Latte",      price:"Rs. 1,015",emoji:"🍵",color:"#E8F5E9",desc:"Ceremonial-grade matcha whisked with oat milk",   rating:4.8,reviews:97, ingredients:["Matcha Powder","Oat Milk","Honey","Ice"]},
    {id:407,name:"Passion Lemonade",  price:"Rs.  870",emoji:"🍋",color:"#FFFDE7",desc:"House-squeezed lemonade with passion fruit syrup", rating:4.5,reviews:43, ingredients:["Lemon","Passion Fruit","Sugar","Soda Water","Mint"]},
    {id:408,name:"Espresso Martini",  price:"Rs. 1,885",emoji:"🍸",color:"#EDE7F6",desc:"Vodka, Kahlúa & fresh espresso, shaken",          rating:4.9,reviews:121,ingredients:["Vodka","Kahlúa","Espresso","Ice","Coffee Beans"]},
  ],
};

export const navItems = [
  {icon:"🏠",label:"Home"},{icon:"🍽️",label:"Special Menu"},{icon:"💡",label:"Recommendation"},
  {icon:"📍",label:"Track Order"},{icon:"💬",label:"Feedback"},{icon:"🏷️",label:"Offers"},
  {icon:"🛒",label:"Cart",badge:3},{icon:"👥",label:"Staff"},
];


export const categories = ["Breakfast","Lunch","Dinner","Desserts","Drinks"];



