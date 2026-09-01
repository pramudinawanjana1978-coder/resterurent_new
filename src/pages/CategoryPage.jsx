import { useState, useEffect, useRef } from "react";
import { useCart } from './CartContext';
import { getDishReviewStats, useAppStore } from '../store/AppStore.jsx';
// ─── DISH VARIANTS (photo carousel per dish) ───────────────────────────────

const dishVariants = {
  1:  { name:"Blueberry Pancakes", image: "/images/pancake2.jpg", variants:[
    { label:"Classic Stack",     bg:"linear-gradient(135deg,#fff3e0,#ffe0a0)", image: "/images/pancake2.jpg",  note:"3 fluffy pancakes, fresh blueberries, maple syrup" },
    { label:"Whipped Cream",     bg:"linear-gradient(135deg,#fce4ec,#f8bbd0)",  image: "/images/pancake2.jpg",  note:"Topped with vanilla whipped cream & berry compote" },
    { label:"Nutella Drizzle",   bg:"linear-gradient(135deg,#efebe9,#d7ccc8)", image: "/images/pancake2.jpg", note:"Hazelnut spread swirled between each layer" },
    { label:"Vegan Stack",       bg:"linear-gradient(135deg,#e8f5e9,#c8e6c9)",  image: "/images/pancake2.jpg",  note:"Oat milk batter, coconut cream, agave syrup" },
  ]},
  2:  { name:"Eggs Benedict", variants:[
    { label:"Classic",           bg:"linear-gradient(135deg,#fffde7,#fff9c4)", image: "/images/Eggs_Benedict.jpg", note:"Poached eggs, Canadian bacon, hollandaise" },
    { label:"Florentine",        bg:"linear-gradient(135deg,#e8f5e9,#dcedc8)",  image: "/images/Eggs_Benedict.jpg",  note:"Wilted spinach instead of bacon" },
    { label:"Salmon",            bg:"linear-gradient(135deg,#fce4ec,#ffccbc)",  image: "/images/Eggs_Benedict.jpg",  note:"Smoked salmon with dill hollandaise" },
    { label:"Avocado",           bg:"linear-gradient(135deg,#f1f8e9,#e8f5e9)",  image: "/images/Eggs_Benedict.jpg",  note:"Crushed avocado base, poached egg, sriracha" },
  ]},
  3:  { name:"Avocado Toast", variants:[
    { label:"Simple",            bg:"linear-gradient(135deg,#f1f8e9,#e8f5e9)",  image: "/images/avacado_toast.jpg",  note:"Smashed avo, sea salt, chilli flakes on sourdough" },
    { label:"Egg on Top",        bg:"linear-gradient(135deg,#fffde7,#fff9c4)",  image: "/images/avacado_toast.jpg",  note:"Poached egg nestled on smashed avocado" },
    { label:"Feta & Tomato",     bg:"linear-gradient(135deg,#fce4ec,#f8bbd0)",  image: "/images/avacado_toast.jpg",  note:"Crumbled feta, cherry tomatoes, balsamic glaze" },
    { label:"Prawn Toast",       bg:"linear-gradient(135deg,#e3f2fd,#bbdefb)", image: "/images/avacado_toast.jpg", note:"Sautéed garlic prawns atop avocado toast" },
  ]},
  4:  { name:"French Toast", variants:[
    { label:"Brioche Classic",   bg:"linear-gradient(135deg,#fff3e0,#ffe0a0)",  image: "/images/French_Toast.jpg",  note:"Thick brioche, vanilla custard, powdered sugar" },
    { label:"Stuffed",           bg:"linear-gradient(135deg,#fce4ec,#f8bbd0)",  image: "/images/French_Toast.jpg",  note:"Cream cheese & strawberry jam filled" },
    { label:"Banana Foster",     bg:"linear-gradient(135deg,#efebe9,#d7ccc8)",  image: "/images/French_Toast.jpg",  note:"Caramelised banana, rum sauce, ice cream" },
    { label:"Savoury",           bg:"linear-gradient(135deg,#e8f5e9,#dcedc8)",  image: "/images/French_Toast.jpg",  note:"Gruyère, fresh herbs, prosciutto on toast" },
  ]},
  5:  { name:"Acai Bowl", variants:[
    { label:"Classic Acai",      bg:"linear-gradient(135deg,#ede7f6,#d1c4e9)",  image: "/images/SmoothieBowl.jpg",  note:"Acai blend, banana, granola, fresh berries" },
    { label:"Tropical",          bg:"linear-gradient(135deg,#fff3e0,#ffe0a0)",  image: "/images/SmoothieBowl.jpg",  note:"Mango base, coconut flakes, pineapple chunks" },
    { label:"Green Boost",       bg:"linear-gradient(135deg,#e8f5e9,#c8e6c9)", image: "/images/SmoothieBowl.jpg", note:"Spirulina, kiwi, spinach, chia seeds" },
    { label:"Peanut Butter",     bg:"linear-gradient(135deg,#efebe9,#d7ccc8)",  image: "/images/SmoothieBowl.jpg",  note:"Peanut butter swirl, cacao nibs, banana" },
  ]},
  6:  { name:"Breakfast Burrito", variants:[
    { label:"Classic",           bg:"linear-gradient(135deg,#fff3e0,#ffe0a0)",  image: "/images/Tostwithegg.jpg",  note:"Scrambled eggs, cheddar, salsa, sour cream" },
    { label:"Spicy Chorizo",     bg:"linear-gradient(135deg,#fbe9e7,#ffccbc)", image: "/images/Tostwithegg.jpg", note:"Chorizo, jalapeños, pepper jack, chipotle" },
    { label:"Veggie",            bg:"linear-gradient(135deg,#e8f5e9,#c8e6c9)",  image: "/images/Tostwithegg.jpg",  note:"Black beans, roasted peppers, avocado, feta" },
    { label:"Smoked Salmon",     bg:"linear-gradient(135deg,#e3f2fd,#bbdefb)",  image: "/images/Tostwithegg.jpg",  note:"Cream cheese, smoked salmon, capers, dill" },
  ]},
  7:  { name:"Granola Parfait", variants:[
    { label:"Classic Berry",     bg:"linear-gradient(135deg,#fce4ec,#f8bbd0)",  image: "/images/GranolawithYogurt.jpg",  note:"Greek yogurt, honey granola, mixed berries" },
    { label:"Mango Passion",     bg:"linear-gradient(135deg,#fff3e0,#ffe0a0)",  image: "/images/GranolawithYogurt.jpg",  note:"Mango coulis, passion fruit, toasted coconut" },
    { label:"Chocolate",         bg:"linear-gradient(135deg,#efebe9,#d7ccc8)", image: "/images/GranolawithYogurt.jpg", note:"Cocoa granola, chocolate yogurt, raspberries" },
    { label:"Matcha",            bg:"linear-gradient(135deg,#e8f5e9,#c8e6c9)",  image: "/images/GranolawithYogurt.jpg",  note:"Matcha yogurt, white chocolate, kiwi slices" },
  ]},
  8:  { name:"Smoked Salmon Bagel", variants:[
    { label:"Classic",           bg:"linear-gradient(135deg,#e3f2fd,#bbdefb)",  image: "/images/Tostwithegg.jpg",  note:"Cream cheese, capers, red onion, dill" },
    { label:"Avocado Smash",     bg:"linear-gradient(135deg,#e8f5e9,#c8e6c9)",  image: "/images/Tostwithegg.jpg",  note:"Smashed avocado base instead of cream cheese" },
    { label:"Everything Bagel",  bg:"linear-gradient(135deg,#efebe9,#d7ccc8)",  image: "/images/Tostwithegg.jpg",  note:"Everything seasoning bagel, whipped cream cheese" },
    { label:"Open Face",         bg:"linear-gradient(135deg,#fce4ec,#f8bbd0)",  image: "/images/Tostwithegg.jpg",  note:"Open bagel, lemon crème fraîche, microgreens" },
  ]},
  9:  { name:"Omelette du Chef", variants:[
    { label:"Mushroom & Herb",   bg:"linear-gradient(135deg,#fffde7,#fff9c4)",  image: "/images/Omelette.jpg",  note:"Wild mushrooms, fresh thyme, gruyère" },
    { label:"Spanish",           bg:"linear-gradient(135deg,#fbe9e7,#ffccbc)",  image: "/images/Omelette.jpg",  note:"Chorizo, peppers, manchego, paprika" },
    { label:"Garden",            bg:"linear-gradient(135deg,#e8f5e9,#c8e6c9)",  image: "/images/Omelette.jpg",  note:"Spinach, cherry tomato, goat cheese, basil" },
    { label:"Truffle",           bg:"linear-gradient(135deg,#efebe9,#d7ccc8)",  image: "/images/Omelette.jpg",  note:"Black truffle, brie, chives, sea salt" },
  ]},
  10: { name:"Fresh Fruit Platter", variants:[
    { label:"Tropical",          bg:"linear-gradient(135deg,#fff3e0,#ffe0a0)",  image: "/images/fruitsalad.jpg",  note:"Mango, pineapple, papaya, passion fruit" },
    { label:"Berry Medley",      bg:"linear-gradient(135deg,#fce4ec,#f8bbd0)",  image: "/images/fruitsalad.jpg",  note:"Strawberries, raspberries, blueberries, blackberries" },
    { label:"Citrus",            bg:"linear-gradient(135deg,#fffde7,#fff9c4)",  image: "/images/fruitsalad.jpg",  note:"Orange, grapefruit, clementine, lemon zest" },
    { label:"Chef's Selection",  bg:"linear-gradient(135deg,#e8f5e9,#c8e6c9)",  image: "/images/fruitsalad.jpg",  note:"Seasonal picks with honey yogurt dip" },
  ]},
  11: { name:"Waffles & Cream", variants:[
    { label:"Classic Belgian",   bg:"linear-gradient(135deg,#fffde7,#fff9c4)",  image: "/images/Belgian_waffles.jpg",  note:"Crispy waffle, whipped cream, fresh strawberries" },
    { label:"Lotus Biscoff",     bg:"linear-gradient(135deg,#efebe9,#d7ccc8)", image: "/images/Belgian_waffles.jpg", note:"Biscoff spread, caramelised cookie crumble" },
    { label:"S'mores",           bg:"linear-gradient(135deg,#fbe9e7,#ffccbc)",  image: "/images/Belgian_waffles.jpg",  note:"Marshmallow fluff, chocolate sauce, graham cracker" },
    { label:"Matcha Cream",      bg:"linear-gradient(135deg,#e8f5e9,#c8e6c9)", image: "/images/Belgian_waffles.jpg", note:"Matcha whipped cream, red bean paste, mochi" },
  ]},
  12: { name:"Shakshuka", variants:[
    { label:"Classic",           bg:"linear-gradient(135deg,#fbe9e7,#ffccbc)",  image: "/images/Tostwithegg.jpg",  note:"Spiced tomato sauce, poached eggs, feta" },
    { label:"Green",             bg:"linear-gradient(135deg,#e8f5e9,#c8e6c9)",  image: "/images/Tostwithegg.jpg",  note:"Tomatillo, spinach, jalapeño, cotija cheese" },
    { label:"Harissa",           bg:"linear-gradient(135deg,#fff3e0,#ffe0a0)",  image: "/images/Tostwithegg.jpg",  note:"Extra harissa, merguez sausage, preserved lemon" },
    { label:"White",             bg:"linear-gradient(135deg,#e3f2fd,#bbdefb)",  image: "/images/Tostwithegg.jpg",  note:"Cream, garlic, leek base with soft eggs" },
  ]},
};

const circularDishes = [
  {id: 1, bg:"linear-gradient(135deg,#fbe9e7,#ffccbc)",  image: "/images/Tostwithegg.jpg",  note:"Spiced tomato sauce, poached eggs, feta" },
  { id: 2, image: "/images/Eggs_Benedict.jpg", alt: "Eggs Benedict" },
  { id: 3, image: "/images/avacado_toast.jpg", alt: "Egg Toast" },
  { id: 4, image: "/images/French_Toast.jpg", alt: "Avocado" },
  { id: 5, image: "/images/SmoothieBowl.jpg", alt: "Smoothie Bowl" },
  { id: 6, image: "/images/GranolawithYogurt.jpg", alt: "Blueberry" },
  { id: 7, image: "/images/Tostwithegg.jpg", alt: "Wrap" },
  { id: 8, image: "/images/fruitsalad.jpg", alt: "Soup" },
];

// Generic variants function updated to use images/placeholders instead of emojis
const makeVariants = (dish) => [
  { label: "Original",    bg: dish.color + "cc", image: dish.image || "/images/pancake2.jpg", note: dish.desc },
  { label: "Spicy",       bg: "#fbe9e7cc",        image: "/images/pancake2.jpg",      note: "Extra spicy version — sriracha & chilli oil" },
  { label: "Large",       bg: dish.color + "cc", image: dish.image || "/images/pancake2.jpg", note: "Extra large portion — feeds two" },
  { label: "Chef Special",bg: "#fffde7cc",        image: "/images/pancake2.jpg",       note: "House twist with seasonal ingredients" },
];

// ─── REVIEWS ──────────────────────────────────────────────────────────────────

const reviews = [
  { name:"Kasun Perera",    avatar:"👨",  stars:5, time:"2 days ago",  text:"Very delicious and fresh food. Highly recommended!", likes:12 },
  { name:"Nethmi Silva",    avatar:"👩",  stars:5, time:"1 week ago",  text:"Fast delivery and excellent taste. Will order again!", likes:8 },
  { name:"Tharindu Fernando",avatar:"🧑", stars:4, time:"2 weeks ago", text:"Portion size is perfect and food was so juicy.",      likes:7 },
];

// ─── CATEGORY DATA ────────────────────────────────────────────────────────────

const categoryConfig = {
  Breakfast: {
    tagline:"Good Food,\nGood ", moodWord:"Morning!",
    desc:"Start your day right with fresh ingredients and love.",
    accentColor:"#f5a623", bannerGrad:"linear-gradient(135deg,#fff3e0 0%,#ffe0a0 100%)",
    slides:[
      [
        {  image: "/images/muffin.jpg", name: "Muffin"},
        {  image: "/images/kiribath.png", name: "Eggs Benedict" },
        { image: "/images/avacado_toast.jpg", name: "Avocado Toast" },
        { image: "/images/French_Toast.jpg", name: "French Toast" },
        { image: "/images/SmoothieBowl.jpg", name: "Acai Bowl" },
        { image: "/images/Tostwithegg.jpg", name: "Burrito" }, 
        { image: "/images/GranolawithYogurt.jpg", name: "Granola" },
        { image: "/images/Tostwithegg.jpg", name: "Salmon Bagel" }
      ],
      [
        { image: "/images/Omelette.jpg", name: "Omelette" },
        { image: "/images/fruitsalad.jpg", name: "Fruit Platter" },
        { image: "/images/Belgian_waffles.jpg", name: "Waffles" },
        { image: "/images/Tostwithegg.jpg", name: "Shakshuka" },
        { image: "/images/boiledEggswith Toast.jpg", name: "Boiled Eggs" },
        { image: "/images/Tostwithegg.jpg", name: "Crepes" },
        { image: "/images/cappatunio.jpg", name: "Coffee" },
        { image: "/images/lucidrealistic_buttery.jpg", name: "Croissant" }
      ],
    ],
  },
  Lunch: {
    tagline:"Good Food,\nGood ", moodWord:"Noon!",
    desc:"Energise your afternoon with fresh wraps and hearty sandwiches.",
    accentColor:"#43a047", bannerGrad:"linear-gradient(135deg,#e8f5e9 0%,#c8e6c9 100%)",
    slides:[[
    { image: "/images/eggrice.png",name: "Salad" },
    { image: "/images/vegerice.png", name: "Wrap" },
    {   image: "/images/FriedFish.jpg",   name: "Sandwich" },
    {  image: "/images/PrawnCurry.jpg",   name: "Noodle Soup" },
    { image: "/images/porkrice.png", name: "Tacos" },
    {image: "/images/SeafoodKottu.jpg", name: "Burrito" },
    { image: "/images/Seafood Noodles.jpg",  name: "Paella" },
    { image: "/images/Vegetable Fried Rice.jpg", name: "Bento Box" }
  ],
  [
    {  image: "/images/crispychicken.png", name: "Pasta" },
    { image: "/images/eggrice.png",  name: "Grain Bowl" },
    { image: "/images/Pork Devilled.jpg",  name: "Stew" },
    { image: "/images/porkrice.png", name: "Stir Fry" },
    {  image: "/images/CuttlefishDevilled.jpg", name: "Curry" },
    { image: "/images/Vegetable Kottu.jpg",  name: "Falafel" },
    {  image: "/images/Chicken Noodles.jpg",  name: "Caesar" },
    { image: "/images/FriedFish.jpg",name: "Hummus" }
  ]],
  },
  Dinner: {
    tagline:"Good Food,\nGood ", moodWord:"Evening!",
    desc:"Wind down with rich, slow-cooked flavours crafted for the evening.",
    accentColor:"#c62828", bannerGrad:"linear-gradient(135deg,#fbe9e7 0%,#ffccbc 100%)",
    slides:[
      [{image:"/images/Beef Curry.jpg",name:"Grilled Steak"},
       {image:"/images/chickencurry.png",name:"Roast Chicken"},
       {image:"/images/Black Pork Curry.jpg",name:"Lamb Chops"},
       {image:"/images/PrawnCurry.jpg",name:"Lobster"},
       {image:"/images/Seafood Noodles.jpg",name:"Sushi"},
       {image:"/images/chickenbiriyani.png",name:"Tagine"},
       {image:"/images/Beef Curry.jpg",name:"Braised Beef"},
       {image:"/images/Mixed Kottu.jpg",name:"Hot Pot"}],
      [{image:"/images/DevilledPrawns.jpg",name:"Prawns"},
        {image:"/images/fishrice.png",name:"Sea Bass"},
        {image:"/images/Pork Devilled.jpg",name:"Pork Belly"},
        {image:"/images/chickenbiriyani.png",name:"Duck Confit"},
        {image:"/images/ChickenKottu.jpg",name:"Niçoise"},
        {image:"/images/Seafood Noodles.jpg",name:"Carbonara"},
        {image:"/images/French_Toast.jpg",name:"Savoury Crepe"},
        {image:"/images/Chicken Kottu.jpg",name:"French Onion Soup"}],
    ],
  },
  Desserts: {
    tagline:"Good Food,\nGood ", moodWord:"Sweet!",
    desc:"End on a high note with silky mousses and artisan gelato.",
    accentColor:"#ad1457", bannerGrad:"linear-gradient(135deg,#fce4ec 0%,#f8bbd0 100%)",
    slides:[
      [{image:"/images/Watalappan.jpg",name:"Mousse"},{image:"/images/Chocolate Fudge Cake.jpg",name:"Cheesecake"},{image:"/images/Black Forest Cake.jpg",name:"Cake"},{image:"/images/Caramel Pudding.jpg",name:"Crème Brûlée"},{image:"/images/Banana Split.jpg",name:"Doughnuts"},{image:"/images/Vanilla Sponge & Cream.jpg",name:"Cupcake"},{image:"/images/Vanilla Ice Cream Sundae.jpg",name:"Ice Cream"},{image:"/images/Chocolate Ice Cream Bowl.jpg",name:"Tart"}],
      [{image:"/images/Black Forest Cake.jpg",name:"Candy"},{image:"/images/Brownie & Ice Cream.jpg",name:"Lollipop"},{image:"/images/Fresh Fruit Platter.jpg",name:"Cookies"},{image:"/images/Strawberry Cheesecake.jpg",name:"Pain au Chocolat"},{image:"/images/Mango Pudding.jpg",name:"Sorbet"},{image:"/images/Ice Cream Waffle.jpg",name:"Dessert Waffle"},{image:"/images/Bread & Butter Pudding.jpg",name:"Pavlova"},{image:"/images/Tiramisu.jpg",name:"Trifle"}],
    ],
  },
  Drinks: {
    tagline:"Good Vibes,\nGood ", moodWord:"Sip!",
    desc:"Refresh with handcrafted beverages from cold-pressed juices to cocktails.",
    accentColor:"#0277bd", bannerGrad:"linear-gradient(135deg,#e3f2fd 0%,#b3e5fc 100%)",
    slides:[
      [{ image: "/images/Espresso.jpg", name:"Espresso"},{image: "/images/Faluda.jpg", name:"Bubble Tea"},{image: "/images/Coconut Mango Smoothie.jpg", name:"Smoothie"},{image: "/images/Tropical Sunset.jpg", name:"Cocktail"},{image: "/images/Orange Juice.jpg", name:"Fresh OJ"},{image: "/images/green_tea.jpg", name:"Matcha"},{image: "/images/Mango Juice.jpg", name:"Cold Press"},{image: "/images/ginger_tea.jpg", name:"Herbal Tea"}],
      [{image: "/images/Cold Brew Coffee.jpg", name:"Craft Beer"},{image: "/images/Red Velvet Cake.jpg", name:"Red Wine"},{image: "/images/Berry Blast Smoothie.jpg", name:"Champagne"},{image: "/images/Mocha Coffee.jpg", name:"Martini"},{image: "/images/Iced Latte.jpg", name:"Iced Latte"},{image: "/images/Strawberry Lemonade.jpg", name:"Lemonade"},{image: "/images/Sparkling Water.jpg", name:"Sparkling"},{image: "/images/Thambili.jpg", name:"Sake"}],
    ],
  },
};

const allDishes = {
  Breakfast:[
    {id:1,  name:"Blueberry Pancakes",   image: "/images/pancake2.jpg",   price:"Rs. 1,850", color:"#FFF3E0", section:"Sweet / Western", desc:"Fluffy stacks loaded with fresh blueberries & Vermont maple syrup",             ingredients:["Flour","Eggs","Blueberries","Maple Syrup","Butter"]},
    {id:13, name:"Chocolate Pancakes",   image: "/images/chocolate_pancakes.jpg", price:"Rs. 1,900",  color:"#EFEBE9", section:"Sweet / Western", desc:"Thick cocoa pancakes drizzled with Nutella and chocolate chips",                ingredients:["Flour","Cocoa Powder","Eggs","Chocolate Chips","Nutella"]},
    {id:4,  name:"French Toast",         image: "/images/French_Toast.jpg",   price:"Rs. 1,750",  color:"#FFF3E0", section:"Sweet / Western", desc:"Thick-cut brioche dipped in vanilla custard, dusted with powdered sugar",        ingredients:["Brioche","Eggs","Vanilla","Cinnamon","Powdered Sugar"]},
    {id:11, name:"Waffles with Syrup",   image: "/images/Belgian_waffles.jpg",   price:"Rs. 1,670",  color:"#FFF8E1", section:"Sweet / Western", desc:"Crispy Belgian waffles, warm maple syrup & fresh whipped cream",                 ingredients:["Waffle Mix","Whipped Cream","Maple Syrup","Butter","Strawberries"]},
    {id:14, name:"Banana Pancakes",      image: "/images/banana_pancakes.jpg",   price:"Rs. 1,780",  color:"#FFFDE7", section:"Sweet / Western", desc:"Light banana-battered pancakes with caramelised banana & honey",                ingredients:["Banana","Flour","Eggs","Honey","Cinnamon"]},
    {id:15, name:"Muffins",              image: "/images/muffin.jpg",   price:"Rs. 950",    color:"#FCE4EC", section:"Sweet / Western", desc:"Freshly baked daily — blueberry, chocolate chip or bran",                         ingredients:["Flour","Eggs","Butter","Sugar","Choice of Mix-in"]},
    {id:16, name:"Croissant with Butter",image: "/images/lucidrealistic_buttery.jpg",   price:"Rs. 850",    color:"#FFF8E1", section:"Sweet / Western", desc:"Flaky all-butter croissant, served warm with French butter & jam",              ingredients:["Butter","Flour","Yeast","Salt","Jam"]},
    {id:17, name:"Cinnamon Rolls",       image: "/images/Cinnamon_Rolls.jpg",   price:"Rs. 1,200",  color:"#FFF3E0", section:"Sweet / Western", desc:"Soft spiral rolls filled with cinnamon sugar, glazed with cream cheese icing",  rating:4.9, reviews:132, ingredients:["Dough","Cinnamon","Brown Sugar","Cream Cheese","Vanilla"]},
    {id:2,  name:"Eggs Benedict",         image: "/images/Eggs_Benedict.jpg",price:"Rs. 2,100", color:"#FFF8E1", section:"Savory",         desc:"Poached eggs & Canadian bacon on English muffin with hollandaise",              rating:4.7, reviews:98,  ingredients:["Eggs","Canadian Bacon","English Muffin","Hollandaise","Chives"]},
    {id:18, name:"Scrambled Eggs",         image: "/images/Scrambled_Eggs.jpg",  price:"Rs. 1,200", color:"#FFFDE7", section:"Savory",         desc:"Soft, creamy scrambled eggs with chives, served with toasted sourdough",         rating:4.6, reviews:79,  ingredients:["Eggs","Butter","Cream","Chives","Sourdough"]},
    {id:19, name:"Fried Eggs with Toast",   image: "/images/Fried_Eggs_Toast.jpg", price:"Rs. 1,100", color:"#FFF9C4", section:"Savory",         desc:"Two sunny-side-up or over-easy eggs with buttered toast",                         rating:4.4, reviews:55,  ingredients:["Eggs","Butter","Toast","Salt","Pepper"]},
    {id:9,  name:"Omelette",                 image: "/images/Omelette.jpg",price:"Rs. 1,950",  color:"#FFFDE7", section:"Savory",         desc:"Three-egg omelette — choose cheese, veg, or chicken filling",                    rating:4.7, reviews:77,  ingredients:["Eggs","Gruyère","Mushrooms","Thyme","Butter"]},
    {id:20, name:"Sausage & Eggs",           image: "/images/Sausage_Eggs.jpg",price:"Rs. 1,850",  color:"#FBE9E7", section:"Savory",         desc:"Grilled beef sausages with scrambled eggs and grilled tomato",                    rating:4.5, reviews:63,  ingredients:["Beef Sausage","Eggs","Tomato","Butter","Toast"]},
    {id:21, name:"Bacon & Eggs",            image: "/images/Bacon_Eggs.jpg", price:"Rs. 1,950",  color:"#FFEBEE", section:"Savory",         desc:"Crispy streaky bacon, fried eggs & grilled mushroom on sourdough",               rating:4.8, reviews:101, ingredients:["Bacon","Eggs","Mushroom","Sourdough","Butter"]},
    {id:22, name:"Toast with Butter & Jam",  image: "/images/Toaset_jam.jpg",price:"Rs. 650",   color:"#FFF8E1", section:"Savory",         desc:"Thick-cut bread, toasted golden with farm butter & house-made jam",              rating:4.3, reviews:38,  ingredients:["Bread","Butter","Jam","Salt"]},
    {id:3,  name:"Avocado Toast",            image: "/images/avacado_toast.jpg",price:"Rs. 1,600",  color:"#F1F8E9", section:"Savory",         desc:"Smashed avo on sourdough with chilli flakes, lemon & sea salt",                  rating:4.6, reviews:84,  ingredients:["Avocado","Sourdough","Egg","Chilli Flakes","Lemon"]},
    {id:23, name:"Avocado Toast with Egg", image: "/images/Tostwithegg.jpg",  price:"Rs. 1,800",  color:"#E8F5E9", section:"Light / Healthy",desc:"Smashed avocado on wholegrain, topped with a perfectly poached egg",             rating:4.8, reviews:117, ingredients:["Avocado","Wholegrain Bread","Poached Egg","Lemon","Seeds"]},
    {id:7,  name:"Granola with Yogurt",    image: "/images/GranolawithYogurt.jpg", price:"Rs. 1,450",  color:"#E8F5E9", section:"Light / Healthy",desc:"Layers of Greek yogurt, house-toasted granola & seasonal berries",               rating:4.6, reviews:53,  ingredients:["Greek Yogurt","Granola","Honey","Mixed Berries","Chia Seeds"]},
    {id:10, name:"Fruit Salad Bowl",       image: "/images/fruitsalad.jpg",price:"Rs. 1,300",  color:"#FCE4EC", section:"Light / Healthy",desc:"Seasonal fresh fruits, mint leaves & honey-lime dressing",                       rating:4.5, reviews:44,  ingredients:["Seasonal Fruits","Mint","Honey","Lime Zest","Greek Yogurt"]},
    {id:24, name:"Oatmeal Bowl",            image: "/images/OatmealBowl.jpg",price:"Rs. 1,150",  color:"#F5F5F5", section:"Light / Healthy",desc:"Slow-cooked oats with banana, cinnamon, nuts & a drizzle of honey",             rating:4.4, reviews:36,  ingredients:["Oats","Banana","Cinnamon","Mixed Nuts","Honey"]},
    {id:5,  name:"Smoothie Bowl",          image: "/images/SmoothieBowl.jpg", price:"Rs. 1,850",  color:"#EDE7F6", section:"Light / Healthy",desc:"Thick blended acai & banana base topped with granola, kiwi & coconut",           rating:4.7, reviews:72,  ingredients:["Acai","Banana","Granola","Kiwi","Coconut Flakes"]},
    {id:25, name:"Boiled Eggs with Toast", image: "/images/boiledEggswith Toast.jpg", price:"Rs. 950",    color:"#FFFDE7", section:"Light / Healthy",desc:"Two soft-boiled eggs in the shell with buttered wholegrain soldiers",            rating:4.3, reviews:31,  ingredients:["Eggs","Wholegrain Bread","Butter","Salt","Pepper"]},
    {id:26, name:"Whole Wheat Sandwich",   image: "/images/WholeWheatSandwich.jpg", price:"Rs. 1,200", color:"#F1F8E9", section:"Light / Healthy",desc:"Whole wheat bread with fresh veg, avocado, hummus & sprouts",                   rating:4.5, reviews:48,  ingredients:["Whole Wheat Bread","Avocado","Hummus","Sprouts","Cucumber"]},
    {id:27, name:"String Hoppers",          image: "/images/String_Hoppers.png", price:"Rs. 750",   color:"#FFF3E0", section:"Sri Lankan 🇱🇰",  desc:"Delicate rice flour noodle patties served with pol sambol & coconut milk",       rating:4.9, reviews:198, ingredients:["Rice Flour","Coconut Milk","Pol Sambol","Dhal Curry","Salt"]},
    {id:28, name:"Hoppers (Appa)",          image: "/images/StringHoppers.png",  price:"Rs. 700",   color:"#FFFDE7", section:"Sri Lankan 🇱🇰",  desc:"Crispy bowl-shaped fermented rice & coconut crepes — plain or egg hopper",     rating:4.9, reviews:224, ingredients:["Rice Flour","Coconut Milk","Yeast","Salt","Egg (optional)"]},
    {id:29, name:"Kottu Breakfast Set",     image: "/images/kottubreackfasr.png",  price:"Rs. 1,350", color:"#FBE9E7", section:"Sri Lankan 🇱🇰",  desc:"Shredded roti stir-fried with egg, veg & spicy curry — morning style",          rating:4.8, reviews:156, ingredients:["Godamba Roti","Egg","Vegetables","Curry Sauce","Spices"]},
    {id:30, name:"Kiribath (Milk Rice)",    image: "/images/kiribath.png",  price:"Rs. 800",   color:"#F3E5F5", section:"Sri Lankan 🇱🇰",  desc:"Creamy coconut milk rice, cut into diamond shapes, served with lunu miris",    rating:4.7, ingredients:["Rice","Thick Coconut Milk","Salt","Lunu Miris","Pol Sambol"]},
    {id:31, name:"Pol Sambol with Bread",    image: "/images/pan.png", price:"Rs. 600",   color:"#E8F5E9", section:"Sri Lankan 🇱🇰",  desc:"Freshly grated coconut sambol with green chilli & lime on crusty bread",       rating:4.7, reviews:87,  ingredients:["Coconut","Red Onion","Green Chilli","Lime","Maldive Fish"]},
    {id:32, name:"Roti with Curry",         image: "/images/roti.png",  price:"Rs. 900",    color:"#FFF8E1", section:"Sri Lankan 🇱🇰",  desc:"Soft Ceylon roti served with lentil dhal & coconut sambol",                    rating:4.8, reviews:134, ingredients:["Wheat Flour","Coconut","Dhal Curry","Pol Sambol","Onion"]},
  ],
  Lunch:[
    {id:101,name:"Chicken Rice & Curry",   image: "/images/udechicken.png",  price:"Rs. 1,200",color:"#FFF3E0",desc:"Steamed rice with aromatic chicken curry, dhal, and fresh pol sambol",ingredients:["Basmati Rice","Chicken","Coconut Milk","Curry Leaves","Onion","Tomato","Spices"],subcategory:"Traditional Rice & Curry"},
    {id:102,name:"Fish Rice & Curry",      image: "/images/fishrice.png",  price:"Rs. 1,150",color:"#E3F2FD",desc:"Steamed rice with tangy fish curry, papadam, and coconut sambol",   ingredients:["Basmati Rice","Fish","Goraka","Turmeric","Curry Leaves","Coconut Milk"],subcategory:"Traditional Rice & Curry"},
    {id:103,name:"Beef Rice & Curry",      image: "/images/beefrice.png",  price:"Rs. 1,350",color:"#FFEBEE",desc:"Slow-cooked beef curry with rice, dhal, and green leaf salad",       ingredients:["Basmati Rice","Beef","Pandan Leaves","Cloves","Cinnamon","Coconut Milk"],subcategory:"Traditional Rice & Curry"},
    {id:104,name:"Pork Rice & Curry",      image: "/images/porkrice.png",  price:"Rs. 1,300",color:"#FCE4EC",desc:"Tender pork curry with steamed rice, pol sambol, and papadam",      ingredients:["Basmati Rice","Pork","Vinegar","Curry Leaves","Onion","Spices"],subcategory:"Traditional Rice & Curry"},
    {id:105,name:"Vegetable Rice & Curry", image: "/images/vegerice.png",  price:"Rs. 950", color:"#E8F5E9",desc:"Assorted vegetable curries with rice, dhal, and coconut sambol",   ingredients:["Basmati Rice","Mixed Veg","Dhal","Coconut Milk","Mustard Seeds","Curry Leaves"],subcategory:"Traditional Rice & Curry"},
    {id:106,name:"Egg Rice & Curry",       image: "/images/eggrice.png",  price:"Rs. 1,000",color:"#FFFDE7",desc:"Spiced egg curry with steamed rice, papadam, and green sambol",     ingredients:["Basmati Rice","Eggs","Coconut Milk","Curry Leaves","Onion","Green Chilli"],subcategory:"Traditional Rice & Curry"},
    {id:107,name:"Mixed Rice & Curry",     image: "/images/mixrice.png",  price:"Rs. 1,500",color:"#F3E5F5",desc:"A feast plate — rice with chicken, fish, beef, dhal, and three sambols",rating:4.9,reviews:189,ingredients:["Rice","Chicken","Fish","Beef","Dhal","Pol Sambol","Papadam"],subcategory:"Traditional Rice & Curry"},
    {id:110,name:"Devilled Chicken",      image: "/images/devilledchicken.png",   price:"Rs. 1,400",color:"#FFEBEE",desc:"Crispy fried chicken wok-tossed with peppers, onions, and spicy sauce",rating:4.9,reviews:234,ingredients:["Chicken","Capsicum","Onion","Tomato","Chilli","Soy Sauce","Vinegar"],subcategory:"Chicken Dishes"},
    {id:111,name:"Chicken Curry",          image: "/images/chickencurry.png",  price:"Rs. 1,200",color:"#FFF3E0",desc:"Traditional Sri Lankan chicken curry simmered in rich coconut gravy", rating:4.8,reviews:178,ingredients:["Chicken","Coconut Milk","Curry Leaves","Pandan","Turmeric","Roasted Curry Powder"],subcategory:"Chicken Dishes"},
    {id:112,name:"Chicken Biryani",       image: "/images/chickenbiriyani.png",   price:"Rs. 1,650",color:"#FFFDE7",desc:"Fragrant basmati layered with spiced chicken, saffron, and crispy onions",rating:4.8,reviews:156,ingredients:["Basmati","Chicken","Saffron","Ghee","Fried Onions","Mint","Biryani Spices"],subcategory:"Chicken Dishes"},
    {id:113,name:"Crispy Fried Chicken",   image: "/images/crispychicken.png",  price:"Rs. 1,350",color:"#FFF8E1",desc:"Golden crispy fried chicken with spiced flour coating, served with chilli sauce",rating:4.7,reviews:121,ingredients:["Chicken","Flour","Egg","Pepper","Garlic","Chilli Sauce"],subcategory:"Chicken Dishes"},
    {id:114,name:"Grilled Chicken",        image: "/images/grilledchicken.png",  price:"Rs. 1,500",color:"#E8F5E9",desc:"Herb-marinated grilled chicken breast with garden salad and garlic bread",rating:4.6,reviews:89,ingredients:["Chicken Breast","Mixed Herbs","Lemon","Garlic","Olive Oil","Salad"],subcategory:"Chicken Dishes"},
    {id:120,name:"Devilled Beef",         image: "/images/Devilled Beef.jpg",   price:"Rs. 1,550",color:"#FFEBEE",desc:"Tender beef stir-fried with onions, capsicum, and fiery devil sauce",  rating:4.9,reviews:198,ingredients:["Beef","Capsicum","Onion","Tomato","Chilli","Soy Sauce","Vinegar"],subcategory:"Meat Dishes"},
    {id:121,name:"Beef Curry",             image: "/images/Beef Curry.jpg",  price:"Rs. 1,400",color:"#FFF3E0",desc:"Slow-cooked Sri Lankan beef curry in roasted spice and coconut milk",  rating:4.8,reviews:145,ingredients:["Beef","Coconut Milk","Roasted Curry Powder","Curry Leaves","Pandan","Cinnamon"],subcategory:"Meat Dishes"},
    {id:122,name:"Black Pork Curry",       image: "/images/Black Pork Curry.jpg",  price:"Rs. 1,500",color:"#F3E5F5",desc:"Authentic Sri Lankan black pork curry with goraka and aromatic spices",rating:4.9,reviews:167,ingredients:["Pork","Goraka","Black Pepper","Curry Leaves","Vinegar","Rampe","Onion"],subcategory:"Meat Dishes"},
    {id:123,name:"Pork Devilled",          image: "/images/Pork Devilled.jpg",  price:"Rs. 1,550",color:"#FCE4EC",desc:"Crispy pork cubes wok-fried with vegetables in spicy sweet devil sauce",rating:4.7,reviews:112,ingredients:["Pork","Capsicum","Onion","Tomato","Chilli","Soy Sauce","Vinegar"],subcategory:"Meat Dishes"},
    {id:130,name:"Devilled Prawns",       image: "/images/Devilled Prawns.jpg",   price:"Rs. 1,800",color:"#E3F2FD",desc:"Juicy prawns stir-fried in tangy-spicy devil sauce with capsicum",    rating:4.9,reviews:189,ingredients:["Prawns","Capsicum","Onion","Tomato","Chilli","Soy Sauce","Vinegar"],subcategory:"Seafood Dishes"},
    {id:131,name:"Fish Ambul Thiyal",     image: "/images/FishAmbulThiyal.jpg",   price:"Rs. 1,400",color:"#E8F5E9",desc:"Traditional dry fish curry with goraka — a Sri Lankan classic",        rating:4.8,reviews:134,ingredients:["Tuna","Goraka","Curry Leaves","Pandan","Black Pepper","Turmeric"],subcategory:"Seafood Dishes"},
    {id:132,name:"Fried Fish",            image: "/images/FriedFish.jpg",   price:"Rs. 1,250",color:"#FFF8E1",desc:"Crispy fried fish marinated with turmeric and lime, served with sambol",rating:4.6,reviews:78, ingredients:["Fish","Turmeric","Chilli Powder","Lime","Salt","Oil"],subcategory:"Seafood Dishes"},
    {id:133,name:"Cuttlefish Devilled",   image: "/images/CuttlefishDevilled.jpg",   price:"Rs. 1,700",color:"#F3E5F5",desc:"Tender cuttlefish wok-fried with onions and hot devil sauce",         rating:4.7,reviews:92, ingredients:["Cuttlefish","Capsicum","Onion","Chilli","Soy Sauce","Vinegar","Tomato"],subcategory:"Seafood Dishes"},
    {id:134,name:"Prawn Curry",           image: "/images/PrawnCurry.jpg",   price:"Rs. 1,750",color:"#FFF3E0",desc:"Coconut-based Sri Lankan prawn curry with curry leaves and pandan",   rating:4.8,reviews:118,ingredients:["Prawns","Coconut Milk","Curry Leaves","Pandan","Turmeric","Green Chilli"],subcategory:"Seafood Dishes"},
    {id:140,name:"Chicken Kottu",         image: "/images/ChickenKottu.jpg",   price:"Rs. 1,300",color:"#FFF8E1",desc:"Chopped roti stir-fried with chicken, egg, vegetables and spices",    rating:4.9,reviews:245,ingredients:["Godamba Roti","Chicken","Egg","Leeks","Carrot","Curry Sauce","Spices"],subcategory:"Kottu"},
    {id:141,name:"Cheese Kottu",           image: "/images/CheeseKottu.jpg",  price:"Rs. 1,400",color:"#FFFDE7",desc:"Roti chopped with egg, vegetables and melted cheese drizzle",          rating:4.7,reviews:134,ingredients:["Godamba Roti","Cheese","Egg","Leeks","Carrot","Curry Sauce"],subcategory:"Kottu"},
    {id:142,name:"Seafood Kottu",          image: "/images/SeafoodKottu.jpg",  price:"Rs. 1,600",color:"#E3F2FD",desc:"Chopped roti with mixed seafood, egg, and aromatic curry sauce",       rating:4.8,reviews:156,ingredients:["Godamba Roti","Prawns","Fish","Squid","Egg","Leeks","Curry Sauce"],subcategory:"Kottu"},
    {id:143,name:"Mixed Kottu",           image: "/images/Mixed Kottu.jpg",   price:"Rs. 1,500",color:"#FCE4EC",desc:"Roti chopped with chicken, beef, egg, and vegetables in curry sauce",  rating:4.8,reviews:178,ingredients:["Godamba Roti","Chicken","Beef","Egg","Leeks","Carrot","Curry Sauce"],subcategory:"Kottu"},
    {id:144,name:"Vegetable Kottu",       image: "/images/Vegetable Kottu.jpg",   price:"Rs. 1,100",color:"#E8F5E9",desc:"Classic kottu with roti, egg, and fresh vegetables in spiced gravy",  rating:4.5,reviews:67, ingredients:["Godamba Roti","Egg","Leeks","Carrot","Cabbage","Curry Sauce","Spices"],subcategory:"Kottu"},
    {id:150,name:"Chicken Noodles",        image: "/images/Chicken Noodles.jpg",  price:"Rs. 1,200",color:"#FFF3E0",desc:"Stir-fried egg noodles with tender chicken, vegetables, and soy sauce",rating:4.6,reviews:89, ingredients:["Egg Noodles","Chicken","Leeks","Carrot","Soy Sauce","Oyster Sauce","Egg"],subcategory:"Noodles"},
    {id:151,name:"Seafood Noodles",       image: "/images/Seafood Noodles.jpg",   price:"Rs. 1,450",color:"#E3F2FD",desc:"Wok-fried noodles with prawns, squid, and fresh vegetables",          rating:4.7,reviews:102,ingredients:["Egg Noodles","Prawns","Squid","Leeks","Carrot","Soy Sauce","Egg"],subcategory:"Noodles"},
    {id:152,name:"Mixed Noodles",         image: "/images/Mixed Noodles.jpg",   price:"Rs. 1,350",color:"#F3E5F5",desc:"Egg noodles stir-fried with chicken, seafood, egg and vegetables",    rating:4.7,reviews:78, ingredients:["Egg Noodles","Chicken","Prawns","Egg","Leeks","Soy Sauce","Oyster Sauce"],subcategory:"Noodles"},
    {id:153,name:"Vegetable Noodles",      image: "/images/Vegetable Noodles.jpg",  price:"Rs. 1,000",color:"#E8F5E9",desc:"Light stir-fried noodles with garden vegetables and sesame soy sauce",rating:4.4,reviews:55, ingredients:["Egg Noodles","Leeks","Carrot","Cabbage","Soy Sauce","Sesame Oil","Egg"],subcategory:"Noodles"},
    {id:160,name:"Chicken Fried Rice",    image: "/images/Chicken Fried Rice.jpg",   price:"Rs. 1,200",color:"#FFF8E1",desc:"Wok-fried rice with chicken, egg, vegetables, and soy sauce",         rating:4.7,reviews:167,ingredients:["Basmati Rice","Chicken","Egg","Leeks","Carrot","Soy Sauce","Garlic"],subcategory:"Fried Rice"},
    {id:161,name:"Seafood Fried Rice",    image: "/images/Seafood Fried Rice.jpg",   price:"Rs. 1,450",color:"#E3F2FD",desc:"Fragrant fried rice with prawns, squid, egg and fresh vegetables",    rating:4.8,reviews:145,ingredients:["Basmati Rice","Prawns","Squid","Egg","Leeks","Carrot","Soy Sauce"],subcategory:"Fried Rice"},
    {id:162,name:"Mixed Fried Rice",       image: "/images/Mixed Fried Rice.jpg",  price:"Rs. 1,350",color:"#F3E5F5",desc:"Fried rice with chicken, seafood, egg, and garden vegetables",        rating:4.7,reviews:123,ingredients:["Basmati Rice","Chicken","Prawns","Egg","Mixed Veg","Soy Sauce","Garlic"],subcategory:"Fried Rice"},
    {id:163,name:"Egg Fried Rice",        image: "/images/Egg Fried Rice.jpg",   price:"Rs. 1,000",color:"#FFFDE7",desc:"Classic fried rice tossed with scrambled egg, spring onions, soy sauce",rating:4.5,reviews:88,ingredients:["Basmati Rice","Egg","Spring Onion","Soy Sauce","Garlic","Sesame Oil"],subcategory:"Fried Rice"},
    {id:164,name:"Vegetable Fried Rice",  image: "/images/Vegetable Fried Rice.jpg",   price:"Rs. 950", color:"#E8F5E9",desc:"Wholesome fried rice with seasonal vegetables and light soy seasoning",rating:4.4,reviews:62, ingredients:["Basmati Rice","Mixed Veg","Egg","Soy Sauce","Garlic","Sesame Oil"],subcategory:"Fried Rice"},
  ],
  Dinner:[
    {id:201,name:"Chicken Rice & Curry",    image: "/images/chickenrice.jpg",   price:"Rs. 1,200",color:"#FFF3E0",desc:"Steamed rice with aromatic chicken curry, dhal, papadam & pol sambol",        ingredients:["Basmati Rice","Chicken","Coconut Milk","Curry Leaves","Dhal","Pol Sambol","Spices"],subcategory:"Traditional Rice & Curry"},
    {id:202,name:"Fish Rice & Curry",        image: "/images/fishrice.jpg",  price:"Rs. 1,150",color:"#E3F2FD",desc:"Steamed rice with tangy fish curry, papadam, and fresh coconut sambol",      ingredients:["Basmati Rice","Fish","Goraka","Turmeric","Curry Leaves","Coconut Milk"],subcategory:"Traditional Rice & Curry"},
    {id:203,name:"Beef Rice & Curry",        image: "/images/beefrice.jpg",  price:"Rs. 1,300",color:"#FFEBEE",desc:"Slow-cooked beef curry with aromatic spices served with steamed rice",        ingredients:["Basmati Rice","Beef","Roasted Curry Powder","Coconut Milk","Pandan Leaf","Spices"],subcategory:"Traditional Rice & Curry"},
    {id:204,name:"Pork Rice & Curry",        image: "/images/porkrice.jpg",  price:"Rs. 1,250",color:"#FBE9E7",desc:"Tender black pork curry with dark roasted spices and steamed rice",      ingredients:["Basmati Rice","Pork","Black Curry Powder","Goraka","Onion","Coconut Milk"],subcategory:"Traditional Rice & Curry"},
    {id:205,name:"Vegetable Rice & Curry",   image: "/images/vegerice.png",  price:"Rs. 950", color:"#E8F5E9",desc:"Rice with mixed vegetable curries — potato, jackfruit & dhal",                ingredients:["Basmati Rice","Potato","Jackfruit","Dhal","Coconut Milk","Tempered Spices"],subcategory:"Traditional Rice & Curry"},
    {id:206,name:"Egg Rice & Curry",         image: "/images/eggrice.png",  price:"Rs. 1,000",color:"#FFFDE7",desc:"Steamed rice with egg curry, dhal, and fresh sambol",                       ingredients:["Basmati Rice","Egg","Coconut Milk","Curry Leaves","Onion","Tomato"],subcategory:"Traditional Rice & Curry"},
    {id:207,name:"Mixed Rice & Curry",       image: "/images/mixrice.png",  price:"Rs. 1,400",color:"#F3E5F5",desc:"A generous spread — chicken, fish, dhal, 3 veggie curries, papadam & sambol", ingredients:["Basmati Rice","Chicken","Fish","Dhal","Pol Sambol","Coconut Milk","Mixed Curries"],subcategory:"Traditional Rice & Curry"},
    {id:211,name:"Devilled Chicken",         image: "/images/devilledchicken.png",  price:"Rs. 1,450",color:"#FFEBEE",desc:"Crispy fried chicken tossed in a bold devilled sauce with capsicum & onion",  ingredients:["Chicken","Capsicum","Onion","Chilli","Soy Sauce","Tomato Sauce","Vinegar"],subcategory:"Chicken Dishes"},
    {id:212,name:"Chicken Curry",            image: "/images/chickencurry.png",  price:"Rs. 1,200",color:"#FFF3E0",desc:"Sri Lankan-style chicken curry slow-cooked in coconut milk with spices",       ingredients:["Chicken","Coconut Milk","Curry Powder","Curry Leaves","Pandan Leaf","Tomato"],subcategory:"Chicken Dishes"},
    {id:213,name:"Chicken Biryani",          image: "/images/chickenbiriyani.png",  price:"Rs. 1,650",color:"#FFF8E1",desc:"Fragrant basmati rice cooked with tender chicken & whole spices, served with raita", ingredients:["Basmati Rice","Chicken","Saffron","Whole Spices","Fried Onion","Mint","Raita"],subcategory:"Chicken Dishes"},
    {id:214,name:"Crispy Fried Chicken",     image: "/images/crispychicken.png",  price:"Rs. 1,350",color:"#FFF3E0",desc:"Golden crunchy fried chicken seasoned with Lankan spices and herbs",            ingredients:["Chicken","Spice Marinade","Breadcrumbs","Egg","Flour","Chilli Flakes"],subcategory:"Chicken Dishes"},
    {id:215,name:"Grilled Chicken",         image: "/images/grilledchicken.png",   price:"Rs. 1,500",color:"#FBE9E7",desc:"Juicy marinated chicken fillet grilled over charcoal with herb butter",   ingredients:["Chicken Breast","Herb Marinade","Garlic","Butter","Lemon","Rosemary"],subcategory:"Chicken Dishes"},
    {id:221,name:"Devilled Beef",            image: "/images/Devilled Beef.jpg",  price:"Rs. 1,650",color:"#FFEBEE",desc:"Tender beef cubes tossed in a rich devilled sauce — fiery and full of flavour", ingredients:["Beef","Capsicum","Onion","Chilli","Soy Sauce","Tomato Sauce","Vinegar"],subcategory:"Meat Dishes"},
    {id:222,name:"Beef Curry",                image: "/images/Beef Curry.jpg", price:"Rs. 1,400",color:"#FBE9E7",desc:"Slow-cooked beef in dark roasted curry powder and thick coconut milk gravy",    ingredients:["Beef","Roasted Curry Powder","Coconut Milk","Pandan Leaf","Curry Leaves","Onion"],subcategory:"Meat Dishes"},
    {id:223,name:"Black Pork Curry",         image: "/images/Black Pork Curry.jpg",  price:"Rs. 1,550",color:"#EFEBE9",desc:"Authentic Sri Lankan black pork curry with goraka and dark roasted spices",     ingredients:["Pork","Black Curry Powder","Goraka","Onion","Curry Leaves","Coconut Milk"],subcategory:"Meat Dishes"},
    {id:224,name:"Pork Devilled",            image: "/images/Pork Devilled.jpg",  price:"Rs. 1,600",color:"#FBE9E7",desc:"Crispy pork belly tossed in tangy devilled sauce with vegetables",              ingredients:["Pork Belly","Capsicum","Onion","Chilli","Soy Sauce","Vinegar","Sugar"],subcategory:"Meat Dishes"},
    {id:231,name:"Devilled Prawns",          image: "/images/DevilledPrawns.jpg",  price:"Rs. 1,850",color:"#FFF3E0",desc:"Juicy tiger prawns tossed in a bold spicy devilled sauce with peppers",         ingredients:["Tiger Prawns","Capsicum","Onion","Chilli","Soy Sauce","Tomato Sauce","Vinegar"],subcategory:"Seafood Dishes"},
    {id:232,name:"Fish Ambul Thiyal",        image: "/images/FishAmbulThiyal.jpg",  price:"Rs. 1,400",color:"#E3F2FD",desc:"Traditional sour fish curry dry-cooked with goraka — a Sri Lankan signature",   ingredients:["Tuna","Goraka","Turmeric","Black Pepper","Curry Leaves","Pandan Leaf"],subcategory:"Seafood Dishes"},
    {id:233,name:"Fried Fish",               image: "/images/FriedFish.jpg",  price:"Rs. 1,300",color:"#E3F2FD",desc:"Crispy shallow-fried fish fillets marinated in Lankan spices and lime",          rating:4.6,reviews:108,ingredients:["Fish Fillet","Turmeric","Chilli Powder","Lime","Garlic","Oil"],subcategory:"Seafood Dishes"},
    {id:234,name:"Cuttlefish Devilled",      image: "/images/CuttlefishDevilled.jpg",  price:"Rs. 1,750",color:"#E8EAF6",desc:"Tender cuttlefish strips in fiery devilled sauce — a true Lankan favourite",    rating:4.8,reviews:121,ingredients:["Cuttlefish","Capsicum","Onion","Chilli","Soy Sauce","Tomato Sauce"],subcategory:"Seafood Dishes"},
    {id:235,name:"Prawn Curry",              image: "/images/PrawnCurry.jpg",  price:"Rs. 1,800",color:"#FFF8E1",desc:"Succulent prawns in creamy coconut milk curry with fragrant spices",             rating:4.8,reviews:134,ingredients:["Prawns","Coconut Milk","Turmeric","Curry Leaves","Tomato","Onion","Spices"],subcategory:"Seafood Dishes"},
    {id:241,name:"Chicken Kottu",            image: "/images/ChickenKottu.jpg",  price:"Rs. 1,200",color:"#FFF3E0",desc:"Shredded roti stir-fried with chicken, egg & vegetables on a hot griddle",      rating:4.9,reviews:234,ingredients:["Godamba Roti","Chicken","Egg","Leeks","Carrot","Curry Sauce","Spices"],subcategory:"Kottu"},
    {id:242,name:"Cheese Kottu",             image: "/images/CheeseKottu.jpg",  price:"Rs. 1,350",color:"#FFFDE7",desc:"Classic kottu smothered in melted cheese — the indulgent favourite",             rating:4.9,reviews:198,ingredients:["Godamba Roti","Egg","Cheese","Leeks","Carrot","Curry Sauce"],subcategory:"Kottu"},
    {id:243,name:"Seafood Kottu",            image: "/images/SeafoodKottu.jpg",  price:"Rs. 1,550",color:"#E3F2FD",desc:"Kottu loaded with prawns, squid & fish — a seafood lover's dream",               rating:4.8,reviews:145,ingredients:["Godamba Roti","Prawns","Squid","Fish","Egg","Leeks","Curry Sauce"],subcategory:"Kottu"},
    {id:244,name:"Mixed Kottu",              image: "/images/Mixed Kottu.jpg",  price:"Rs. 1,400",color:"#F3E5F5",desc:"Best of all — chicken, beef & egg kottu with fresh vegetables",                  rating:4.8,reviews:167,ingredients:["Godamba Roti","Chicken","Beef","Egg","Leeks","Carrot","Curry Sauce"],subcategory:"Kottu"},
    {id:245,name:"Vegetable Kottu",          image: "/images/Vegetable Kottu.jpg",  price:"Rs. 950", color:"#E8F5E9",desc:"Wholesome roti shredded with seasonal vegetables and spice",                    rating:4.6,reviews:88, ingredients:["Godamba Roti","Mixed Vegetables","Egg","Curry Sauce","Tempered Spices"],subcategory:"Kottu"},
    {id:251,name:"Chicken Noodles",          image: "/images/Chicken Noodles.jpg",  price:"Rs. 1,100",color:"#FFF8E1",desc:"Wok-tossed noodles with tender chicken strips and fresh vegetables",             rating:4.7,reviews:128,ingredients:["Noodles","Chicken","Egg","Leeks","Capsicum","Soy Sauce","Sesame Oil"],subcategory:"Noodles"},
    {id:252,name:"Seafood Noodles",          image: "/images/Seafood Noodles.jpg",  price:"Rs. 1,450",color:"#E3F2FD",desc:"Wok-fried noodles with prawns, squid & fish in light soy sauce",                rating:4.8,reviews:112,ingredients:["Noodles","Prawns","Squid","Fish","Leeks","Soy Sauce","Sesame Oil"],subcategory:"Noodles"},
    {id:253,name:"Mixed Noodles",            image: "/images/Mixed Noodles.jpg",  price:"Rs. 1,300",color:"#F3E5F5",desc:"A full mix — chicken, beef & seafood tossed noodles with fresh veg",             rating:4.8,reviews:98, ingredients:["Noodles","Chicken","Beef","Prawns","Leeks","Soy Sauce","Sesame Oil"],subcategory:"Noodles"},
    {id:254,name:"Vegetable Noodles",        image: "/images/Vegetable Noodles.jpg",  price:"Rs. 950", color:"#E8F5E9",desc:"Light and healthy veggie stir-fry noodles with tofu and sesame",                 rating:4.5,reviews:72, ingredients:["Noodles","Mixed Vegetables","Tofu","Soy Sauce","Garlic","Sesame Oil"],subcategory:"Noodles"},
    {id:261,name:"Chicken Fried Rice",       image: "/images/Chicken Fried Rice.jpg",  price:"Rs. 1,100",color:"#FFF3E0",desc:"Golden fried rice with chicken, egg & vegetables in fragrant soy sauce",        rating:4.8,reviews:167,ingredients:["Basmati Rice","Chicken","Egg","Spring Onion","Soy Sauce","Garlic","Sesame Oil"],subcategory:"Fried Rice"},
    {id:262,name:"Seafood Fried Rice",      image: "/images/Seafood Fried Rice.jpg",   price:"Rs. 1,400",color:"#E3F2FD",desc:"Aromatic fried rice packed with prawns, squid and fish",                        rating:4.8,reviews:134,ingredients:["Basmati Rice","Prawns","Squid","Fish","Egg","Soy Sauce","Sesame Oil"],subcategory:"Fried Rice"},
    {id:263,name:"Mixed Fried Rice",         image: "/images/Mixed Fried Rice.jpg",  price:"Rs. 1,300",color:"#F3E5F5",desc:"The ultimate fried rice — chicken, beef, seafood & egg all in one",              rating:4.9,reviews:189,ingredients:["Basmati Rice","Chicken","Beef","Prawns","Egg","Soy Sauce","Sesame Oil"],subcategory:"Fried Rice"},
    {id:264,name:"Egg Fried Rice",           image: "/images/Egg Fried Rice.jpg",  price:"Rs. 1,000",color:"#FFFDE7",desc:"Classic fried rice tossed with scrambled egg, spring onions & soy sauce",       rating:4.5,reviews:88, ingredients:["Basmati Rice","Egg","Spring Onion","Soy Sauce","Garlic","Sesame Oil"],subcategory:"Fried Rice"},
    {id:265,name:"Vegetable Fried Rice",     image: "/images/Vegetable Fried Rice.jpg",  price:"Rs. 950", color:"#E8F5E9",desc:"Wholesome fried rice with seasonal vegetables and light soy seasoning",          rating:4.4,reviews:62, ingredients:["Basmati Rice","Mixed Veg","Egg","Soy Sauce","Garlic","Sesame Oil"],subcategory:"Fried Rice"},
  ],
  Desserts:[
    {id:301,name:"Watalappan",              image: "/images/Watalappan.jpg",  price:"Rs. 550", color:"#FFF3E0",desc:"Rich jaggery & coconut milk steamed pudding with cashews & cardamom",                 ingredients:["Coconut Milk","Jaggery","Eggs","Cardamom","Cashews","Rosewater"],subcategory:"Traditional Sri Lankan Desserts"},
    {id:302,name:"Kiri Pani",               image: "/images/Kiri Pani.jpg",  price:"Rs. 450", color:"#FFFDE7",desc:"Creamy buffalo curd drizzled with golden kithul treacle — simple and heavenly",        ingredients:["Buffalo Curd","Kithul Treacle"],subcategory:"Traditional Sri Lankan Desserts"},
    {id:303,name:"Konda Kavum",             image: "/images/KondaKaum.jpg",  price:"Rs. 400", color:"#FFF8E1",desc:"Crispy deep-fried rice flour oil cakes sweetened with jaggery — a festive favourite",  ingredients:["Rice Flour","Jaggery","Coconut Milk","Turmeric","Oil"],subcategory:"Traditional Sri Lankan Desserts"},
    {id:304,name:"Aluwa",                   image: "/images/aluwa.jpg",  price:"Rs. 350", color:"#FFFDE7",desc:"Soft rice flour sweet fudge squares flavoured with cardamom, cashews and rose water",    ingredients:["Rice Flour","Sugar","Cashews","Cardamom","Ghee","Rosewater"],subcategory:"Traditional Sri Lankan Desserts"},
    {id:305,name:"Bibikkan",                image: "/images/Bibikkan.png",  price:"Rs. 450", color:"#FFF3E0",desc:"Moist coconut and jaggery cake baked with semolina, cashews and spices",              ingredients:["Scraped Coconut","Jaggery","Semolina","Cashews","Spices","Eggs"],subcategory:"Traditional Sri Lankan Desserts"},
    {id:306,name:"Dodol",                   image: "/images/Dodol.jpg",  price:"Rs. 400", color:"#FBE9E7",desc:"Chewy sticky coconut toffee made with jaggery and rice flour — intensely sweet",       ingredients:["Coconut Milk","Jaggery","Rice Flour","Cardamom"],subcategory:"Traditional Sri Lankan Desserts"},
    {id:307,name:"Pani Walalu",             image: "/images/Pani walalu.jpg",  price:"Rs. 350", color:"#FCE4EC",desc:"Delicate urad dhal rings soaked in golden kithul honey — crunchy outside, sweet inside",  ingredients:["Urad Dhal","Rice Flour","Kithul Treacle","Oil"],subcategory:"Traditional Sri Lankan Desserts"},
    {id:308,name:"Mung Kavum",              image: "/images/MungKawum.webp",  price:"Rs. 380", color:"#E8F5E9",desc:"Green gram sweet cakes fried golden and garnished with sesame — light and nutty",      ingredients:["Green Gram","Rice Flour","Jaggery","Sesame","Coconut Milk","Oil"],subcategory:"Traditional Sri Lankan Desserts"},
    {id:311,name:"Chocolate Fudge Cake",    image: "/images/Chocolate Fudge Cake.jpg",  price:"Rs. 850", color:"#EFEBE9",desc:"Dense moist chocolate fudge cake layered with ganache and creamy buttercream frosting",  rating:4.9,reviews:245,ingredients:["Dark Chocolate","Butter","Eggs","Flour","Sugar","Cocoa","Cream","Ganache"],subcategory:"Cakes & Bakery Desserts"},
    {id:312,name:"Black Forest Cake",       image: "/images/Black Forest Cake.jpg",  price:"Rs. 900", color:"#FCE4EC",desc:"Chocolate sponge layered with cream, cherries and dark chocolate shavings",              rating:4.8,reviews:198,ingredients:["Chocolate Sponge","Whipped Cream","Cherries","Kirsch","Dark Chocolate Shavings"],subcategory:"Cakes & Bakery Desserts"},
    {id:313,name:"Vanilla Sponge & Cream",  image: "/images/Vanilla Sponge & Cream.jpg",  price:"Rs. 750", color:"#FFF8E1",desc:"Light fluffy vanilla sponge filled with fresh whipped cream and seasonal fruits",        rating:4.7,reviews:145,ingredients:["Vanilla Sponge","Whipped Cream","Seasonal Fruits","Icing Sugar","Vanilla Extract"],subcategory:"Cakes & Bakery Desserts"},
    {id:314,name:"Strawberry Cheesecake",   image: "/images/steweberry cake.jpg",  price:"Rs. 950", color:"#FCE4EC",desc:"Smooth creamy cheesecake with fresh strawberry compote on a buttery biscuit base",       rating:4.9,reviews:220,ingredients:["Cream Cheese","Strawberries","Graham Crackers","Butter","Eggs","Sugar","Cream"],subcategory:"Cakes & Bakery Desserts"},
    {id:315,name:"Red Velvet Cake",         image: "/images/Red Velvet Cake.jpg",  price:"Rs. 850", color:"#FFEBEE",desc:"Vibrant red velvet layers with tangy cream cheese frosting — stunning and delicious",    rating:4.8,reviews:187,ingredients:["Red Velvet Sponge","Cream Cheese Frosting","Cocoa","Buttermilk","Vanilla"],subcategory:"Cakes & Bakery Desserts"},
    {id:316,name:"Marble Cake Slice",       image: "/images/Marble Cake Slice.jpg",  price:"Rs. 650", color:"#EFEBE9",desc:"Swirled vanilla and chocolate marble sponge cake with a moist crumb and golden crust",   rating:4.6,reviews:108,ingredients:["Vanilla Batter","Chocolate Batter","Butter","Eggs","Sugar","Flour"],subcategory:"Cakes & Bakery Desserts"},
    {id:321,name:"Vanilla Ice Cream Sundae", image: "/images/Vanilla Ice Cream Sundae.jpg", price:"Rs. 750", color:"#E3F2FD",desc:"Vanilla scoops topped with hot chocolate sauce, whipped cream, nuts and a cherry",      rating:4.8,reviews:189,ingredients:["Vanilla Ice Cream","Chocolate Sauce","Whipped Cream","Nuts","Cherry","Sprinkles"],subcategory:"Ice Cream & Cold Desserts"},
    {id:322,name:"Chocolate Ice Cream Bowl", image: "/images/Chocolate Ice Cream Bowl.jpg", price:"Rs. 800", color:"#EFEBE9",desc:"Triple chocolate ice cream with brownie bits, fudge sauce and crushed Oreos",             rating:4.9,reviews:214,ingredients:["Chocolate Ice Cream","Brownie Pieces","Fudge Sauce","Oreo Crumble","Whipped Cream"],subcategory:"Ice Cream & Cold Desserts"},
    {id:323,name:"Fruit Salad & Ice Cream",  image: "/images/Fruit Salad & Ice Cream.jpg", price:"Rs. 700", color:"#F1F8E9",desc:"Fresh seasonal fruits tossed in honey with two scoops of vanilla ice cream",             rating:4.6,reviews:134,ingredients:["Seasonal Fruits","Honey","Vanilla Ice Cream","Mint"],subcategory:"Ice Cream & Cold Desserts"},
    {id:324,name:"Banana Split",            image: "/images/Banana Split.jpg",  price:"Rs. 850", color:"#FFFDE7",desc:"Whole banana split with three ice cream scoops, toppings and whipped cream",              rating:4.8,reviews:156,ingredients:["Banana","Vanilla Ice Cream","Chocolate Ice Cream","Strawberry Ice Cream","Cream","Cherry"],subcategory:"Ice Cream & Cold Desserts"},
    {id:325,name:"Ice Cream Waffle",         image: "/images/Ice Cream Waffle.jpg", price:"Rs. 950", color:"#FFF8E1",desc:"Crispy Belgian waffle topped with ice cream, strawberries and chocolate sauce",           rating:4.9,reviews:201,ingredients:["Belgian Waffle","Ice Cream","Strawberries","Chocolate Sauce","Whipped Cream"],subcategory:"Ice Cream & Cold Desserts"},
    {id:331,name:"Brownie & Ice Cream",     image: "/images/Brownie & Ice Cream.jpg",  price:"Rs. 900", color:"#EFEBE9",desc:"Warm fudgy dark chocolate brownie served with a scoop of vanilla ice cream",              rating:4.9,reviews:232,ingredients:["Dark Chocolate","Butter","Eggs","Sugar","Flour","Vanilla Ice Cream"],subcategory:"Puddings & Modern Desserts"},
    {id:332,name:"Caramel Pudding",         image: "/images/Caramel Pudding.jpg",  price:"Rs. 600", color:"#FFF3E0",desc:"Silky smooth baked caramel custard with a glossy toffee top — a timeless classic",        rating:4.8,reviews:176,ingredients:["Eggs","Milk","Sugar","Vanilla","Caramel Sauce"],subcategory:"Puddings & Modern Desserts"},
    {id:333,name:"Mango Pudding",           image: "/images/Mango Pudding.jpg",  price:"Rs. 650", color:"#FFF3E0",desc:"Chilled tropical mango pudding with Alphonso mangoes and cream — light and refreshing",  rating:4.7,reviews:143,ingredients:["Alphonso Mango","Cream","Gelatin","Sugar","Lime"],subcategory:"Puddings & Modern Desserts"},
    {id:334,name:"Bread & Butter Pudding",  image: "/images/Bread & Butter Pudding.jpg",  price:"Rs. 700", color:"#FFF8E1",desc:"Buttery bread baked in vanilla custard with raisins — warm, cosy and deeply satisfying", rating:4.6,reviews:112,ingredients:["White Bread","Butter","Eggs","Milk","Sugar","Raisins","Vanilla","Cinnamon"],subcategory:"Puddings & Modern Desserts"},
    {id:335,name:"Tiramisu",                image: "/images/Tiramisu.jpg",  price:"Rs. 950", color:"#EFEBE9",desc:"Espresso-soaked savoiardi with mascarpone cream and cocoa — Italy's finest dessert",      rating:4.9,reviews:267,ingredients:["Savoiardi","Espresso","Mascarpone","Eggs","Sugar","Cocoa Powder","Cream"],subcategory:"Puddings & Modern Desserts"},
    {id:341,name:"Fresh Fruit Platter",     image: "/images/Fresh Fruit Platter.jpg",  price:"Rs. 750", color:"#F1F8E9",desc:"Seasonal tropical fruits artfully arranged — mango, pineapple, papaya, watermelon",      rating:4.7,reviews:128,ingredients:["Seasonal Tropical Fruits","Honey Dip","Mint"],subcategory:"Light & Fresh Options"},
    {id:342,name:"Fruit Jelly Cups",        image: "/images/Tostwithegg.jpg",  price:"Rs. 500", color:"#EDE7F6",desc:"Colourful layered jelly cups with fresh fruit pieces — light, fun and refreshing",        rating:4.5,reviews:84, ingredients:["Fruit Jelly","Fresh Fruit Pieces","Whipped Cream"],subcategory:"Light & Fresh Options"},
    {id:343,name:"Yogurt Parfait & Granola", image: "/images/Tostwithegg.jpg", price:"Rs. 700", color:"#E8F5E9",desc:"Greek yogurt layered with crunchy granola, fresh berries and a drizzle of honey",        rating:4.7,reviews:112,ingredients:["Greek Yogurt","Granola","Mixed Berries","Honey","Chia Seeds"],subcategory:"Light & Fresh Options"},
    {id:344,name:"Mango Slices with Honey",  image: "/images/Tostwithegg.jpg", price:"Rs. 600", color:"#FFF3E0",desc:"Chilled ripe mango slices drizzled with wildflower honey and a touch of fresh lime",     rating:4.6,reviews:94, ingredients:["Ripe Mango","Wildflower Honey","Lime","Mint"],subcategory:"Light & Fresh Options"},
  ],
  Drinks:[
    {id:401,name:"Ceylon Black Tea",    image: "/images/black_tea.jpg",    price:"Rs. 250", color:"#FFF8E1",desc:"Aromatic Sri Lankan single-estate black tea brewed to golden perfection",                 ingredients:["Ceylon Tea Leaves","Hot Water","Optional Milk","Optional Sugar"],subcategory:"Hot Beverages"},
    {id:402,name:"Green Tea",           image: "/images/green_tea.jpg",    price:"Rs. 280", color:"#E8F5E9",desc:"Light and antioxidant-rich green tea with a delicate grassy flavour",                    ingredients:["Green Tea Leaves","Hot Water","Optional Honey"],subcategory:"Hot Beverages"},
    {id:403,name:"Ginger Tea",          image: "/images/ginger_tea.jpg",    price:"Rs. 300",color:"#FFF3E0",desc:"Warming fresh ginger tea with a spicy kick — great for digestion and immunity",          ingredients:["Fresh Ginger","Hot Water","Honey","Lime","Optional Cinnamon"],subcategory:"Hot Beverages"},
    {id:404,name:"Milk Tea",             image: "/images/milkTea.jpg",   price:"Rs. 280", color:"#FFFDE7",desc:"Creamy Sri Lankan style milk tea brewed strong and sweetened to taste",                 ingredients:["Ceylon Tea","Whole Milk","Sugar","Optional Cardamom"],subcategory:"Hot Beverages"},
    {id:405,name:"Cappuccino",           image: "/images/cappatunio.jpg",   price:"Rs. 650",color:"#EFEBE9",desc:"Espresso topped with velvety steamed milk and a thick layer of milk foam",              ingredients:["Espresso Shot","Steamed Milk","Milk Foam","Optional Cinnamon Dust"],subcategory:"Hot Beverages"},
    {id:406,name:"Latte",                image: "/images/latte.jpg",   price:"Rs. 680", color:"#FFF8E1",desc:"Double espresso with silky steamed milk — smooth, creamy and comforting",               ingredients:["Double Espresso","Steamed Milk","Milk Foam"],subcategory:"Hot Beverages"},
    {id:407,name:"Espresso",             image: "/images/Espresso.jpg",   price:"Rs. 450",color:"#EFEBE9",desc:"Rich single-origin espresso shot — bold, intense and aromatic",                        ingredients:["Espresso Roast Coffee Beans","Hot Water"],subcategory:"Hot Beverages"},
    {id:408,name:"Hot Chocolate",        image: "/images/Hot Chocolate.jpg",   price:"Rs. 700", color:"#EFEBE9",desc:"Velvety Belgian dark chocolate melted into steamed milk with a whipped cream crown",    rating:4.9,reviews:234,ingredients:["Belgian Dark Chocolate","Whole Milk","Whipped Cream","Cocoa Powder","Sugar"],subcategory:"Hot Beverages"},
    {id:409,name:"Mocha Coffee",          image: "/images/Mocha Coffee.jpg",  price:"Rs. 720", color:"#FBE9E7",desc:"Espresso combined with chocolate syrup and steamed milk — the best of both worlds",      rating:4.8,reviews:167,ingredients:["Espresso","Chocolate Syrup","Steamed Milk","Whipped Cream"],subcategory:"Hot Beverages"},
    {id:411,name:"Iced Coffee",          image: "/images/Iced Coffee.jpg",   price:"Rs. 700", color:"#E3F2FD",desc:"Chilled brewed coffee over ice with optional milk — your perfect afternoon pick-me-up",  rating:4.8,reviews:198,ingredients:["Brewed Coffee","Ice","Milk","Optional Sugar Syrup"],subcategory:"Iced Beverages"},
    {id:412,name:"Iced Latte",           image: "/images/Iced Latte.jpg",   price:"Rs. 750", color:"#E3F2FD",desc:"Double espresso poured over ice with cold milk — cool, smooth and energising",           rating:4.8,reviews:212,ingredients:["Double Espresso","Cold Milk","Ice","Optional Syrup"],subcategory:"Iced Beverages"},
    {id:413,name:"Iced Mocha",            image: "/images/Mocha Coffee.jpg",  price:"Rs. 800", color:"#EFEBE9",desc:"Espresso, chocolate syrup and cold milk shaken over ice — rich and refreshing",          rating:4.9,reviews:188,ingredients:["Espresso","Chocolate Syrup","Cold Milk","Ice","Whipped Cream"],subcategory:"Iced Beverages"},
    {id:414,name:"Iced Lemon Tea",        image: "/images/Iced Lemon Tea.jpg",  price:"Rs. 450", color:"#FFFDE7",desc:"Chilled Ceylon tea with a bright squeeze of fresh lemon and a touch of sweetness",       rating:4.6,reviews:145,ingredients:["Ceylon Tea","Lemon Juice","Ice","Sugar Syrup","Mint"],subcategory:"Iced Beverages"},
    {id:415,name:"Cold Brew Coffee",      image: "/images/Cold Brew Coffee.jpg",  price:"Rs. 870", color:"#FFF8E1",desc:"18-hour cold-steeped single-origin coffee — ultra-smooth with zero bitterness",          rating:4.9,reviews:178,ingredients:["Single Origin Coffee Beans","Filtered Water","Ice","Optional Oat Milk"],subcategory:"Iced Beverages"},
    {id:416,name:"Chocolate Milkshake",   image: "/images/Chocolate Milkshake.jpg",  price:"Rs. 950", color:"#EFEBE9",desc:"Thick creamy chocolate milkshake blended with premium ice cream and real cocoa",         rating:4.9,reviews:267,ingredients:["Chocolate Ice Cream","Whole Milk","Chocolate Syrup","Whipped Cream","Chocolate Shavings"],subcategory:"Iced Beverages"},
    {id:417,name:"Vanilla Milkshake",     image: "/images/Vanilla Milkshake.jpg",  price:"Rs. 900", color:"#FFF8E1",desc:"Classic thick vanilla milkshake made with real vanilla bean ice cream",                  rating:4.8,reviews:198,ingredients:["Vanilla Ice Cream","Whole Milk","Vanilla Extract","Whipped Cream"],subcategory:"Iced Beverages"},
    {id:418,name:"Strawberry Milkshake",  image: "/images/Strawberry Milkshake.jpg",  price:"Rs. 950", color:"#FCE4EC",desc:"Vibrant fresh strawberry milkshake blended with real berries and ice cream",             rating:4.9,reviews:223,ingredients:["Fresh Strawberries","Strawberry Ice Cream","Whole Milk","Whipped Cream","Strawberry Syrup"],subcategory:"Iced Beverages"},
    {id:421,name:"Orange Juice",         image: "/images/Orange Juice.jpg",   price:"Rs. 550", color:"#FFF3E0",desc:"Freshly squeezed Valencia oranges — pure, vibrant and vitamin-packed",                   rating:4.8,reviews:234,ingredients:["Fresh Oranges"],subcategory:"Fresh Fruit Juices"},
    {id:422,name:"Mango Juice",          image: "/images/Mango Juice.jpg",   price:"Rs. 600", color:"#FFF3E0",desc:"Blended ripe Alphonso mangoes — sweet, tropical and intensely flavourful",               rating:4.9,reviews:312,ingredients:["Ripe Alphonso Mangoes","Optional Honey","Optional Lime"],subcategory:"Fresh Fruit Juices"},
    {id:423,name:"Pineapple Juice",      image: "/images/Pineapple Juice.jpg",   price:"Rs. 550", color:"#FFFDE7",desc:"Cold-pressed fresh pineapple with a natural sweet-tangy tropical burst",                 rating:4.7,reviews:167,ingredients:["Fresh Pineapple","Optional Ginger","Optional Honey"],subcategory:"Fresh Fruit Juices"},
    {id:424,name:"Papaya Juice",         image: "/images/papaya.jpg",   price:"Rs. 500", color:"#FFF3E0",desc:"Smooth blended papaya juice with a touch of lime — light and digestive",                 rating:4.5,reviews:112,ingredients:["Fresh Papaya","Lime Juice","Optional Honey","Optional Ginger"],subcategory:"Fresh Fruit Juices"},
    {id:425,name:"Watermelon Juice",      image: "/images/Watermelon Juice.jpg",  price:"Rs. 500", color:"#FCE4EC",desc:"Chilled fresh watermelon juice — hydrating, sweet and perfect for Sri Lanka's heat",     rating:4.8,reviews:198,ingredients:["Fresh Watermelon","Optional Lime","Optional Mint"],subcategory:"Fresh Fruit Juices"},
    {id:426,name:"Passion Fruit Juice",   image: "/images/Passion Fruit Juice.jpg",  price:"Rs. 650", color:"#FFF9C4",desc:"Tangy tropical passion fruit juice bursting with exotic sun-kissed flavour",              rating:4.8,reviews:178,ingredients:["Fresh Passion Fruit","Sugar Syrup","Water","Optional Lime"],subcategory:"Fresh Fruit Juices"},
    {id:427,name:"Lime Juice",            image: "/images/Lime Juice.jpg",  price:"Rs. 400", color:"#F1F8E9",desc:"Refreshing fresh lime juice — sweet, salty or plain as you like it",                     rating:4.7,reviews:245,ingredients:["Fresh Limes","Water","Sugar","Optional Salt"],subcategory:"Fresh Fruit Juices"},
    {id:428,name:"Mixed Fruit Juice",     image: "/images/Mixed Fruit Juice.jpg",  price:"Rs. 700", color:"#EDE7F6",desc:"A seasonal blend of tropical fruits — mango, pineapple, orange and passion fruit",       rating:4.8,reviews:156,ingredients:["Mango","Pineapple","Orange","Passion Fruit","Optional Honey"],subcategory:"Fresh Fruit Juices"},
    {id:431,name:"King Coconut (Thambili)", image: "/images/Thambili.jpg", price:"Rs. 350",color:"#FFF3E0",desc:"Fresh Sri Lankan king coconut water served chilled — nature's own electrolyte drink",   rating:4.9,reviews:456,ingredients:["King Coconut Water"],subcategory:"Sri Lankan Special Drinks"},
    {id:432,name:"Wood Apple Juice",      image: "/images/Wood Apple Juice.jpg",  price:"Rs. 450", color:"#FFF8E1",desc:"Unique tangy-sweet Sri Lankan wood apple blended with coconut milk and jaggery",         rating:4.7,reviews:134,ingredients:["Wood Apple","Coconut Milk","Jaggery","Water"],subcategory:"Sri Lankan Special Drinks"},
    {id:434,name:"Ranawara Drink",        image: "/images/Ranawara Drink.jpg",  price:"Rs. 380", color:"#FFFDE7",desc:"Golden herbal ranawara flower infusion with honey — a traditional wellness drink",        rating:4.6,reviews:78, ingredients:["Ranawara Flowers","Honey","Hot Water"],subcategory:"Sri Lankan Special Drinks"},
    {id:435,name:"Ginger Beer",           image: "/images/Ginger Beer.jpg",  price:"Rs. 500", color:"#FFF3E0",desc:"Spicy homemade ginger beer with a fiery kick and natural fizz",                          rating:4.8,reviews:167,ingredients:["Fresh Ginger","Sugar","Yeast","Lime","Water"],subcategory:"Sri Lankan Special Drinks"},
    {id:436,name:"Faluda",                image: "/images/Faluda.jpg",  price:"Rs. 650", color:"#FCE4EC",desc:"The iconic Sri Lankan Faluda — rose milk, basil seeds, noodles and ice cream",           rating:4.9,reviews:312,ingredients:["Rose Syrup","Basil Seeds","Faluda Noodles","Milk","Vanilla Ice Cream","Agar Jelly"],subcategory:"Sri Lankan Special Drinks"},
    {id:437,name:"Avocado Juice",         image: "/images/Avocado Juice.jpg",  price:"Rs. 700", color:"#E8F5E9",desc:"Creamy blended avocado with milk and a touch of honey — rich, smooth and nutritious",    rating:4.8,reviews:189,ingredients:["Ripe Avocado","Milk","Honey","Ice"],subcategory:"Sri Lankan Special Drinks"},
    {id:438,name:"Soursop Juice",         image: "/images/Soursop.jpg",  price:"Rs. 750", color:"#E8F5E9",desc:"Velvety soursop blended with coconut milk — tropical, creamy and uniquely delicious",    rating:4.8,reviews:143,ingredients:["Fresh Soursop","Coconut Milk","Sugar","Ice"],subcategory:"Sri Lankan Special Drinks"},
    {id:441,name:"Virgin Mojito",         image: "/images/Virgin Mojito.jpg",  price:"Rs. 750", color:"#E8F5E9",desc:"Muddled mint, lime, sugar and soda — the classic refresher without the alcohol",         rating:4.8,reviews:289,ingredients:["Fresh Mint","Lime","Sugar Syrup","Soda Water","Ice","Lime Slice"],subcategory:"Mocktails"},
    {id:442,name:"Blue Lagoon Mocktail",  image: "/images/Blue Lagoon Mocktail.jpg",  price:"Rs. 800", color:"#E3F2FD",desc:"Dazzling blue curacao syrup, lemon juice and soda — visually stunning and refreshing",   rating:4.8,reviews:198,ingredients:["Blue Curacao Syrup","Lemon Juice","Soda Water","Ice","Lemon Slice"],subcategory:"Mocktails"},
    {id:443,name:"Tropical Sunset",       image: "/images/Tropical Sunset.jpg",  price:"Rs. 850", color:"#FFF3E0",desc:"Mango, passion fruit and orange layered for a stunning tropical sunset effect",           rating:4.9,reviews:212,ingredients:["Mango Juice","Passion Fruit Juice","Orange Juice","Grenadine","Ice"],subcategory:"Mocktails"},
    {id:444,name:"Mango Mint Cooler",     image: "/images/Mango Mint Cooler.jpg",  price:"Rs. 750", color:"#FFF3E0",desc:"Fresh mango blended with mint and lime over crushed ice — cooling and tropical",          rating:4.7,reviews:167,ingredients:["Fresh Mango","Mint","Lime","Sugar Syrup","Crushed Ice"],subcategory:"Mocktails"},
    {id:445,name:"Citrus Splash",         image: "/images/Citrus Splash.jpg",  price:"Rs. 700", color:"#FFF3E0",desc:"Orange, lemon and lime juices combined with soda for a zesty citrus explosion",           rating:4.6,reviews:134,ingredients:["Orange Juice","Lemon Juice","Lime Juice","Soda Water","Honey","Ice"],subcategory:"Mocktails"},
    {id:446,name:"Pineapple Cooler",      image: "/images/Pineapple Cooler.jpg",  price:"Rs. 700", color:"#FFFDE7",desc:"Fresh pineapple juice with coconut water, lime and crushed ice — tropical bliss",         rating:4.7,reviews:145,ingredients:["Pineapple Juice","Coconut Water","Lime","Mint","Crushed Ice"],subcategory:"Mocktails"},
    {id:447,name:"Strawberry Lemonade",  image: "/images/Strawberry Lemonade.jpg",   price:"Rs. 750", color:"#FCE4EC",desc:"House-made lemonade blended with fresh strawberries — sweet, tart and irresistible",     rating:4.9,reviews:245,ingredients:["Fresh Strawberries","Lemon Juice","Sugar Syrup","Soda Water","Ice"],subcategory:"Mocktails"},
    {id:448,name:"Passion Fruit Fizz",    image: "/images/Passion Fruit Fizz.jpg",  price:"Rs. 800", color:"#FFF9C4",desc:"Tropical passion fruit syrup topped with sparkling water and fresh lime zest",            rating:4.8,reviews:178,ingredients:["Passion Fruit Syrup","Sparkling Water","Lime Juice","Ice","Lime Zest"],subcategory:"Mocktails"},
    {id:451,name:"Coca-Cola",            image: "/images/Coca-Cola.jpg",   price:"Rs. 300",color:"#FFEBEE",desc:"The world's favourite cola served chilled over ice with a slice of lime",                rating:4.5,reviews:312,ingredients:["Coca-Cola","Ice","Optional Lime"],subcategory:"Soft Drinks"},
    {id:452,name:"Diet Coke",            image: "/images/Diet Coke.jpg",   price:"Rs. 300", color:"#F3E5F5",desc:"Classic Coca-Cola flavour with zero sugar — light, crisp and refreshing",                rating:4.3,reviews:145,ingredients:["Diet Coke","Ice","Optional Lime"],subcategory:"Soft Drinks"},
    {id:453,name:"Sprite",                image: "/images/Sprite.jpg",  price:"Rs. 300", color:"#E8F5E9",desc:"Crisp lemon-lime sparkling drink — clean, fresh and perfectly carbonated",                rating:4.5,reviews:198,ingredients:["Sprite","Ice","Optional Lemon"],subcategory:"Soft Drinks"},
    {id:454,name:"Fanta Orange",          image: "/images/Fanta Orange.jpg",  price:"Rs. 300", color:"#FFF3E0",desc:"Vibrant orange-flavoured fizzy drink — fruity, fun and full of bubbles",                  rating:4.4,reviews:167,ingredients:["Fanta Orange","Ice"],subcategory:"Soft Drinks"},
    {id:455,name:"Ginger Ale",            image: "/images/Ginger Ale.jpg",  price:"Rs. 350",color:"#E8F5E9",desc:"Light ginger-flavoured sparkling drink — perfect for settling the stomach",               rating:4.4,reviews:112,ingredients:["Ginger Ale","Ice","Optional Lime"],subcategory:"Soft Drinks"},
    {id:456,name:"Soda Water",            image: "/images/Soda Water.jpg",  price:"Rs. 200", color:"#E3F2FD",desc:"Plain sparkling water — clean bubbles, crisp and purely refreshing",                      rating:4.3,reviews:89, ingredients:["Carbonated Water","Ice"],subcategory:"Soft Drinks"},
    {id:457,name:"Tonic Water",           image: "/images/Tonic Water.jpg",  price:"Rs. 250", color:"#E3F2FD",desc:"Quinine-infused sparkling water with a pleasantly bitter finish",                        rating:4.2,reviews:67, ingredients:["Tonic Water","Ice","Optional Lime"],subcategory:"Soft Drinks"},
    {id:461,name:"Mineral Water (500ml)", image: "/images/Mineral Water (500ml).jpg",  price:"Rs. 150",color:"#E3F2FD",desc:"Premium still mineral water — pure, natural and perfectly hydrating",                    rating:4.5,reviews:445,ingredients:["Natural Mineral Water"],subcategory:"Water & Refreshments"},
    {id:463,name:"Sparkling Water",       image: "/images/Sparkling Water.jpg",  price:"Rs. 350", color:"#E3F2FD",desc:"Naturally carbonated sparkling mineral water with fine, persistent bubbles",              rating:4.4,reviews:134,ingredients:["Sparkling Mineral Water","Ice","Optional Lime"],subcategory:"Water & Refreshments"},
    {id:472,name:"Coconut Mango Smoothie", image: "/images/Coconut Mango Smoothie.jpg", price:"Rs. 1,050",color:"#FFF3E0",desc:"Velvety mango and coconut cream smoothie — thick, tropical and utterly indulgent",        rating:4.9,reviews:267,ingredients:["Ripe Mango","Coconut Cream","Banana","Honey","Ice"],subcategory:"Signature Drinks"},
    {id:473,name:"Berry Blast Smoothie",   image: "/images/Berry Blast Smoothie.jpg", price:"Rs. 1,100",color:"#EDE7F6",desc:"Mixed berries, banana and Greek yogurt blended into a vibrant antioxidant powerhouse",  rating:4.8,reviews:198,ingredients:["Mixed Berries","Banana","Greek Yogurt","Honey","Ice","Milk"],subcategory:"Signature Drinks"},
    {id:474,name:"Pineapple Mint Cooler", image: "/images/Pineapple Mint Cooler.jpg",  price:"Rs. 950", color:"#FFFDE7",desc:"Fresh pineapple blended with mint, lime and coconut water — pure tropical refreshment",   rating:4.8,reviews:178,ingredients:["Fresh Pineapple","Mint","Lime","Coconut Water","Ice","Honey"],subcategory:"Signature Drinks"},
    {id:475,name:"Mango Passion Delight", image: "/images/Mango Passion Delight.jpg",  price:"Rs. 1,050",color:"#FFF3E0",desc:"Layered mango and passion fruit juice with basil seeds and lime foam — stunning",        rating:4.9,reviews:234,ingredients:["Mango Juice","Passion Fruit Juice","Basil Seeds","Lime Foam","Ice"],subcategory:"Signature Drinks"},
    {id:476,name:"Chocolate Banana Shake", image: "/images/Chocolate Banana Shake.jpg", price:"Rs. 1,000",color:"#EFEBE9",desc:"Thick chocolate shake blended with ripe banana and Nutella — indulgent and filling",     rating:4.8,reviews:189,ingredients:["Banana","Chocolate Ice Cream","Nutella","Milk","Whipped Cream","Chocolate Sauce"],subcategory:"Signature Drinks"},
    {id:477,name:"Green Detox Smoothie",   image: "/images/Green Detox Smoothie.jpg", price:"Rs. 950", color:"#E8F5E9",desc:"Spinach, cucumber, green apple, ginger and lime — a rejuvenating green power drink",      rating:4.7,reviews:145,ingredients:["Spinach","Cucumber","Green Apple","Ginger","Lime","Coconut Water","Ice"],subcategory:"Signature Drinks"},
    {id:478,name:"Sunset Breeze Mocktail", image: "/images/Sunset Breeze Mocktail.jpg", price:"Rs. 1,100",color:"#FFF3E0",desc:"Guava, orange and lime with grenadine sunset swirl — beautiful and boldly tropical",      rating:4.9,reviews:223,ingredients:["Guava Juice","Orange Juice","Lime","Grenadine","Soda Water","Ice","Orange Slice"],subcategory:"Signature Drinks"},
  ],
};

const navItems = [
  {icon:"🏠",label:"Home"},{icon:"🍽️",label:"Special Menu"},{icon:"💡",label:"Recommendation"},
  {icon:"📍",label:"Track Order"},{icon:"💬",label:"Feedback"},{icon:"🏷️",label:"Offers"},
  {icon:"🛒",label:"Cart"},{icon:"👤",label:"Offers"},{icon:"👥",label:"Staff"},
];
const categories = ["Breakfast","Lunch","Dinner","Desserts","Drinks"];

// ─── ORBIT ────────────────────────────────────────────────────────────────────
function OrbitDisplay({ slide, centerImage, accentColor }) {
  const ORBIT_R=100, SMALL_R=32, CENTER=140, SIZE=CENTER*2, N=slide.length;
  const positions = slide.map((_,i) => {
    const a = (2*Math.PI*i)/N - Math.PI/2;
    return { x: CENTER+ORBIT_R*Math.cos(a), y: CENTER+ORBIT_R*Math.sin(a) };
  });

  return (
    <div style={{ position:"relative", width:SIZE, height:SIZE, flexShrink:0 }}>
      <svg width={SIZE} height={SIZE} style={{ position:"absolute",top:0,left:0,pointerEvents:"none" }}>
        <circle cx={CENTER} cy={CENTER} r={ORBIT_R} fill="none" stroke={accentColor+"44"} strokeWidth={1.5} strokeDasharray="6 5"/>
      </svg>
      
      {positions.map((pos,i) => (
        <div key={i} title={slide[i].name} style={{
          position:"absolute", left:pos.x-SMALL_R, top:pos.y-SMALL_R,
          width:SMALL_R*2, height:SMALL_R*2, borderRadius:"50%",
          background:"rgba(255,255,255,0.93)", border:"2px solid rgba(255,255,255,0.98)",
          boxShadow:"0 4px 14px rgba(0,0,0,0.1)", display:"flex", alignItems:"center",
          justifyContent:"center", overflow: "hidden", 
          animation:`floatOrbit ${3.5+(i%3)*0.5}s ease-in-out ${i*0.18}s infinite`,
        }}>
          <img 
            src={slide[i].image || "/images/pancake2.jpg"} 
            alt={slide[i].name} 
            style={{ width: "100%", height: "100%", objectFit: "cover" }} 
          />
        </div>
      ))}

      <div style={{
        position:"absolute", left:CENTER-56, top:CENTER-56, width:112, height:112,
        borderRadius:"50%", background:"rgba(255,255,255,0.97)",
        border:"4px solid #fff", boxShadow:"0 8px 32px rgba(0,0,0,0.13)",
        display:"flex", alignItems:"center", justifyContent:"center", overflow: "hidden",
        transition:"all 0.45s cubic-bezier(0.34,1.56,0.64,1)", zIndex:2,
      }}>
        <img 
          src={centerImage || "/images/pancake2.jpg"} 
          alt="Featured Dish" 
          style={{ width: "100%", height: "100%", objectFit: "cover" }} 
        />
      </div>
    </div>
  );
}

// ─── STAR RATING ──────────────────────────────────────────────────────────────

function Stars({ rating, color="#f5a623", size=14 }) {
  return (
    <span style={{ display:"inline-flex", gap:1 }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ fontSize:size, color: i <= Math.floor(rating) ? color : i-0.5 <= rating ? color : "#ddd" }}>
          {i <= Math.floor(rating) ? "★" : i-0.5 <= rating ? "★" : "☆"}
        </span>
      ))}
    </span>
  );
}

// ─── DISH DETAIL PAGE ─────────────────────────────────────────────────────────

function DishDetailPage({ dish, category, onBack, accentColor, }) {
  const variants = dishVariants[dish.id]?.variants || makeVariants(dish);
  
  const [variantIdx, setVariantIdx]   = useState(0);
  const [animDir, setAnimDir]         = useState(null);
  const [quantity, setQuantity]       = useState(1);
  const [spice, setSpice]             = useState("Medium");
  const [toppings, setToppings]       = useState([]);
  const [remove, setRemove]           = useState([]);
  const [notes, setNotes]             = useState("");
  const [liked, setLiked]             = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [imgVisible, setImgVisible]   = useState(true);
  const [showPayment, setShowPayment] = useState(false);

  const basePrice = parseInt(dish.price.replace(/[^0-9]/g,""));
  const toppingPrices = { "Extra Cheese":200, "Extra Sauce":100, "Extra Vegetables":150 };
  const toppingTotal = toppings.reduce((s,t) => s+(toppingPrices[t]||0), 0);
  const totalPrice = (basePrice + toppingTotal) * quantity;

  const cv = variants[variantIdx];

  const goVariant = (dir) => {
    setAnimDir(dir);
    setImgVisible(false);
    setTimeout(() => {
      setVariantIdx(i => (i+dir+variants.length)%variants.length);
      setImgVisible(true);
      setAnimDir(null);
    }, 220);
  };

  const similarDishes = Object.values(allDishes).flat()
    .filter(d => d.id !== dish.id && d.id !== dish.id+1)
    .slice(0,4);

  const handleCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const bannerGrad = categoryConfig[category]?.bannerGrad || "linear-gradient(135deg,#fff3e0,#ffe0a0)";

  if (showPayment) {
    const singleItem = [{ ...dish, qty: quantity, price: totalPrice / quantity, color: "#FFF3E0" }];
    return (
      <PaymentPage
        total={totalPrice}
        items={singleItem}
        accentColor={accentColor}
        onBack={() => setShowPayment(false)}
        onHome={onBack}
      />
    );
  }

  return (
    <div style={{
      minHeight:"100vh", background:"#faf8f5",
      fontFamily:"'Trebuchet MS', sans-serif", color:"#1a1a1a",
    }}>
      {/* Top bar */}
      <div style={{
        position:"sticky", top:0, zIndex:100,
        background:"rgba(255,255,255,0.97)", backdropFilter:"blur(12px)",
        borderBottom:"1px solid rgba(0,0,0,0.07)",
        padding:"0 40px", height:64,
        display:"flex", alignItems:"center", gap:20,
        boxShadow:"0 2px 12px rgba(0,0,0,0.06)",
      }}>
        <button onClick={onBack} style={{
          display:"flex", alignItems:"center", gap:8,
          background:"#f5f5f5", border:"1px solid rgba(0,0,0,0.08)",
          borderRadius:10, padding:"8px 16px", color:"#555",
          cursor:"pointer", fontSize:13, fontWeight:600, fontFamily:"inherit",
          transition:"all 0.2s",
        }}
          onMouseEnter={e => e.currentTarget.style.background="#ebebeb"}
          onMouseLeave={e => e.currentTarget.style.background="#f5f5f5"}
        >← Back to Menu</button>
        <div style={{ flex:1 }}>
          <input placeholder="Search for food, drinks..." style={{
            background:"#f5f5f5", border:"1px solid rgba(0,0,0,0.08)",
            borderRadius:10, padding:"8px 18px", color:"#333", fontSize:13,
            outline:"none", width:280, fontFamily:"inherit",
          }}/>
        </div>
        <div style={{ display:"flex", gap:12, marginLeft:"auto" }}>
          <div style={{ position:"relative" }}>
            <span style={{ fontSize:22 }}>🔔</span>
          </div>
          <div style={{ position:"relative" }}>
            <span style={{ fontSize:22 }}>🛒</span>
            <span style={{
              position:"absolute", top:-6, right:-6, background:accentColor,
              color:"#fff", borderRadius:"50%", width:16, height:16,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:10, fontWeight:700,
            }}>3</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:1280, margin:"0 auto", padding:"32px 40px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 340px", gap:32 }}>

          {/* LEFT COLUMN */}
          <div>
            <div style={{ display:"flex", gap:20, marginBottom:32 }}>

              {/* Photo area */}
              <div style={{ flex:1 }}>
                <div style={{
                  position:"relative", borderRadius:20, overflow:"hidden",
                  background: cv.bg, height:340,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  border:`1px solid ${accentColor}22`,
                  boxShadow:`0 12px 40px ${accentColor}22`,
                }}>
                  <button onClick={() => setLiked(l => !l)} style={{
                    position:"absolute", top:16, right:16, zIndex:3,
                    width:40, height:40, borderRadius:"50%",
                    background:"rgba(255,255,255,0.85)", border:"none",
                    cursor:"pointer", fontSize:18, transition:"transform 0.2s",
                    display:"flex", alignItems:"center", justifyContent:"center",
                  }}
                    onMouseEnter={e => e.currentTarget.style.transform="scale(1.15)"}
                    onMouseLeave={e => e.currentTarget.style.transform="scale(1)"}
                  >{liked ? "❤️" : "🤍"}</button>

                  <div style={{
                    position:"absolute", top:16, left:16, zIndex:3,
                    background:`linear-gradient(135deg,${accentColor},${accentColor}cc)`,
                    color:"#fff", borderRadius:8, padding:"4px 12px",
                    fontSize:11, fontWeight:700, letterSpacing:"0.5px",
                  }}>{cv.label}</div>

                  <img 
                    src={cv.image || dish.image || "/images/pancake2.jpg"} 
                    alt={dish.name}
                    style={{
                      width:"100%",
                      height:"100%",
                      objectFit:"cover",
                      opacity: imgVisible ? 1 : 0,
                      transform: imgVisible ? "scale(1) translateX(0)" : animDir === 1 ? "scale(0.7) translateX(-60px)" : "scale(0.7) translateX(60px)",
                      transition:"all 0.22s cubic-bezier(0.4,0,0.2,1)",
                      filter:"drop-shadow(0 20px 30px rgba(0,0,0,0.3))",
                      userSelect:"none",
                    }}
                  />

                  {[-1,1].map(dir => (
                    <button key={dir} onClick={() => goVariant(dir)} style={{
                      position:"absolute", top:"50%", transform:"translateY(-50%)",
                      [dir===-1?"left":"right"]: 14, zIndex:3,
                      width:38, height:38, borderRadius:"50%",
                      background:"rgba(255,255,255,0.88)", border:"none",
                      cursor:"pointer", fontSize:18, fontWeight:700,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      boxShadow:"0 4px 14px rgba(0,0,0,0.25)", transition:"transform 0.15s",
                    }}
                      onMouseEnter={e => e.currentTarget.style.transform="translateY(-50%) scale(1.12)"}
                      onMouseLeave={e => e.currentTarget.style.transform="translateY(-50%) scale(1)"}
                    >{dir===-1?"‹":"›"}</button>
                  ))}
                </div>

                <p style={{ margin:"8px 0 0", fontSize:12, color:"#8b9ab8", textAlign:"center" }}>
                  {cv.note}
                </p>
              </div>

              {/* Dish info */}
              <div style={{ flex:1 }}>
                <div style={{
                  display:"inline-block", padding:"3px 12px", borderRadius:20,
                  background:`${accentColor}22`, color:accentColor,
                  fontSize:11, fontWeight:700, letterSpacing:"0.8px",
                  textTransform:"uppercase", marginBottom:10,
                }}>{category}</div>
                <h1 style={{ margin:"0 0 8px", fontSize:30, fontWeight:800, color:"#1a1a1a", lineHeight:1.2 }}>
                  {dish.name}
                </h1>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
                  <Stars rating={selectedLiveStats.rating} color={accentColor} size={16}/>
                  <span style={{ color:accentColor, fontWeight:700, fontSize:15 }}>{selectedLiveStats.rating}</span>
                  <span style={{ color:"#888", fontSize:13 }}>({selectedLiveStats.reviews}+ reviews)</span>
                </div>
                <div style={{ fontSize:28, fontWeight:800, color:accentColor, marginBottom:16 }}>
                  {dish.price}
                </div>

                <div style={{ marginBottom:16 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:"#333", marginBottom:8 }}>Description</div>
                  <p style={{ fontSize:13, color:"#666", lineHeight:1.7, margin:0 }}>{dish.desc}</p>
                </div>

                <div>
                  <div style={{ fontSize:13, fontWeight:700, color:"#333", marginBottom:10 }}>Ingredients</div>
                  <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                    {dish.ingredients.map((ing,i) => (
                      <div key={i} style={{ display:"flex", alignItems:"center", gap:8, fontSize:13, color:"#666" }}>
                        <span style={{ color:accentColor, fontSize:15 }}>✓</span> {ing}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* You May Also Like */}
            <div style={{ marginBottom:36 }}>
              <h2 style={{ fontSize:20, fontWeight:800, color:"#1a1a1a", margin:"0 0 16px", letterSpacing:"-0.3px" }}>
                You May Also Like
              </h2>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
                {similarDishes.map(sd => (
                  <div key={sd.id} style={{
                    background:"#fff", borderRadius:16,
                    border:"1px solid rgba(0,0,0,0.06)",
                    padding:"16px 14px", cursor:"pointer",
                    transition:"transform 0.2s, box-shadow 0.2s",
                    boxShadow:"0 2px 8px rgba(0,0,0,0.05)",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.boxShadow=`0 12px 28px ${accentColor}22`; }}
                    onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 2px 8px rgba(0,0,0,0.05)"; }}
                  >
                    <div style={{ 
                      width: '100%', 
                      height: '100px', 
                      display: 'flex', 
                      justifyContent: 'center', 
                      alignItems: 'center', 
                      marginBottom: '10px',
                      overflow: 'hidden',
                      borderRadius: '12px',
                    }}>
                      <img 
                        src={sd.image || "/images/pancake2.jpg"} 
                        alt={sd.name} 
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover', 
                          borderRadius: '12px'
                        }}
                      />
                    </div>
                    <div style={{ fontSize:13, fontWeight:700, color:"#1a1a1a", marginBottom:4 }}>{sd.name}</div>
                    <div style={{ display:"flex", alignItems:"center", gap:4, marginBottom:8 }}>
                      <span style={{ color:"#f5a623", fontSize:12 }}>★</span>
                      <span style={{ fontSize:12, color:"#888" }}>{sd.rating}</span>
                    </div>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <span style={{ fontSize:13, fontWeight:700, color:accentColor }}>{sd.price}</span>
                      <button
  onClick={(e) => {
    e.stopPropagation();

    if (!setCartItems) {
      console.error("setCartItems is not available");
      return;
    }

    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === sd.id);

      if (existingItem) {
        return prev.map(item =>
          item.id === sd.id
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }

      return [
        ...prev,
        {
          ...sd,
          price: typeof sd.price === "string"
            ? parseInt(sd.price.replace(/[^0-9]/g, ""), 10) || 0
            : sd.price,
          qty: 1,
          note: sd.note || "",
          spice: sd.spice || "None",
          color: sd.color || "#FFF8E1",
        }
      ];
    });
  }}
  aria-label={`Add ${sd.name} to cart`}
  style={{
    width:28,
    height:28,
    borderRadius:"50%",
    background:`linear-gradient(135deg,${accentColor},${accentColor}99)`,
    border:"none",
    display:"flex",
    alignItems:"center",
    justifyContent:"center",
    fontSize:16,
    color:"#fff",
    cursor:"pointer",
  }}
>
  🛒
</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Reviews */}
            <div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                <h2 style={{ fontSize:20, fontWeight:800, color:"#1a1a1a", margin:0, letterSpacing:"-0.3px" }}>
                  Customer Reviews <span style={{ color:"#888", fontWeight:400, fontSize:14 }}>({dish.reviews}+)</span>
                </h2>
                <button style={{
                  background:"transparent", border:`1px solid ${accentColor}`,
                  color:accentColor, borderRadius:8, padding:"6px 14px",
                  fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit",
                }}>View All Reviews</button>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
                {reviews.map((r,i) => (
                  <div key={i} style={{
                    background:"#fff", borderRadius:16,
                    border:"1px solid rgba(0,0,0,0.06)", padding:"18px 16px",
                    boxShadow:"0 2px 8px rgba(0,0,0,0.05)",
                  }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                      <div style={{
                        width:38, height:38, borderRadius:"50%",
                        background:`linear-gradient(135deg,${accentColor}33,${accentColor}15)`,
                        display:"flex", alignItems:"center", justifyContent:"center", fontSize:20,
                      }}>{r.avatar}</div>
                      <div>
                        <div style={{ fontSize:13, fontWeight:700, color:"#1a1a1a" }}>{r.name}</div>
                        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                          <Stars rating={r.stars} color="#f5a623" size={11}/>
                          <span style={{ fontSize:11, color:"#aaa" }}>{r.time}</span>
                        </div>
                      </div>
                    </div>
                    <p style={{ fontSize:13, color:"#666", lineHeight:1.6, margin:"0 0 10px" }}>{r.text}</p>
                    <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:"#aaa" }}>
                      <span>👍</span> <span>{r.likes}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN — Customize */}
          <div style={{ position:"sticky", top:80, alignSelf:"start" }}>
            <div style={{
              background:"#fff",
              border:`1px solid ${accentColor}22`,
              borderRadius:20, padding:"24px 22px",
              boxShadow:`0 8px 32px ${accentColor}18`,
            }}>
              <h3 style={{ margin:"0 0 20px", fontSize:16, fontWeight:800, color:accentColor, letterSpacing:"0.3px" }}>
                Customize Your Dish
              </h3>

              {/* Extra Toppings */}
              <div style={{ marginBottom:18 }}>
                <div style={{ fontSize:12, fontWeight:700, color:"#333", marginBottom:10, textTransform:"uppercase", letterSpacing:"0.5px" }}>
                  Extra Toppings
                </div>
                {Object.entries(toppingPrices).map(([t,p]) => (
                  <label key={t} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8, cursor:"pointer" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <input type="checkbox" checked={toppings.includes(t)}
                        onChange={() => setToppings(prev => prev.includes(t) ? prev.filter(x=>x!==t) : [...prev,t])}
                        style={{ accentColor }} />
                      <span style={{ fontSize:13, color:"#555" }}>{t}</span>
                    </div>
                    <span style={{ fontSize:12, color:accentColor, fontWeight:600 }}>+ Rs.{p}</span>
                  </label>
                ))}
              </div>

              {/* Remove Ingredients */}
              <div style={{ marginBottom:18 }}>
                <div style={{ fontSize:12, fontWeight:700, color:"#333", marginBottom:10, textTransform:"uppercase", letterSpacing:"0.5px" }}>
                  Remove Ingredients
                </div>
                {(dish.ingredients || ["Onion","Tomato","Lettuce"]).slice(0,5).map(ing => (
                  <label key={ing} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8, cursor:"pointer" }}>
                    <input type="checkbox" checked={remove.includes(ing)}
                      onChange={() => setRemove(prev => prev.includes(ing) ? prev.filter(x=>x!==ing) : [...prev,ing])}
                      style={{ accentColor }} />
                    <span style={{ fontSize:13, color:"#555" }}>{ing}</span>
                  </label>
                ))}
              </div>

              {/* Spice Level */}
              <div style={{ marginBottom:18 }}>
                <div style={{ fontSize:12, fontWeight:700, color:"#333", marginBottom:10, textTransform:"uppercase", letterSpacing:"0.5px" }}>
                  Spice Level
                </div>
                {[["Mild","🌿"],["Medium","🌶️"],["Hot","🌶️🌶️"],["Extra Hot","🌶️🌶️🌶️"]].map(([lv,icon]) => (
                  <label key={lv} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8, cursor:"pointer" }}>
                    <input type="radio" name="spice" checked={spice===lv}
                      onChange={() => setSpice(lv)} style={{ accentColor }} />
                    <span style={{ fontSize:13, color:"#555" }}>{lv}</span>
                    <span style={{ fontSize:12, marginLeft:"auto" }}>{icon}</span>
                  </label>
                ))}
              </div>

              {/* Quantity */}
              <div style={{ marginBottom:18 }}>
                <div style={{ fontSize:12, fontWeight:700, color:"#333", marginBottom:10, textTransform:"uppercase", letterSpacing:"0.5px" }}>
                  Quantity
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:16 }}>
                  <button onClick={() => setQuantity(q => Math.max(1,q-1))} style={{
                    width:34, height:34, borderRadius:"50%",
                    background:"#f5f5f5", border:"1px solid rgba(0,0,0,0.1)",
                    color:"#333", cursor:"pointer", fontSize:18, fontWeight:700,
                    display:"flex", alignItems:"center", justifyContent:"center",
                  }}>−</button>
                  <span style={{ fontSize:18, fontWeight:700, color:"#1a1a1a", minWidth:20, textAlign:"center" }}>{quantity}</span>
                  <button onClick={() => setQuantity(q => q+1)} style={{
                    width:34, height:34, borderRadius:"50%",
                    background:accentColor, border:"none",
                    color:"#fff", cursor:"pointer", fontSize:18, fontWeight:700,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    boxShadow:`0 4px 12px ${accentColor}55`,
                  }}>+</button>
                </div>
              </div>

              {/* Special Notes */}
              <div style={{ marginBottom:20 }}>
                <div style={{ fontSize:12, fontWeight:700, color:"#333", marginBottom:8, textTransform:"uppercase", letterSpacing:"0.5px" }}>
                  Special Notes
                </div>
                <textarea
                  value={notes} onChange={e => setNotes(e.target.value)}
                  placeholder="Add your instructions here..."
                  rows={3}
                  style={{
                    width:"100%", boxSizing:"border-box",
                    background:"#f9f9f9", border:"1px solid rgba(0,0,0,0.08)",
                    borderRadius:10, padding:"10px 12px", color:"#333",
                    fontSize:12, resize:"none", outline:"none", fontFamily:"inherit",
                  }}
                />
                <div style={{ fontSize:11, color:"#aaa", marginTop:2 }}>(Optional)</div>
              </div>

              {/* Total */}
              <div style={{
                display:"flex", justifyContent:"space-between", alignItems:"center",
                marginBottom:16, padding:"12px 14px",
                background: `${accentColor}0f`, borderRadius:12,
                border:`1px solid ${accentColor}33`,
              }}>
                <span style={{ fontSize:14, fontWeight:600, color:"#333" }}>Total Price</span>
                <span style={{ fontSize:20, fontWeight:800, color:accentColor }}>
                  Rs. {totalPrice.toLocaleString()}
                </span>
              </div>

              {/* Action buttons */}
              <button onClick={handleCart} style={{
                width:"100%", padding:"13px",
                background: addedToCart ? "linear-gradient(135deg,#4caf50,#388e3c)" : `linear-gradient(135deg,${accentColor},${accentColor}aa)`,
                border:"none", borderRadius:12, color:"#fff",
                fontWeight:700, fontSize:14, cursor:"pointer", fontFamily:"inherit",
                boxShadow:`0 6px 20px ${accentColor}44`,
                marginBottom:10, transition:"all 0.3s",
                display:"flex", alignItems:"center", justifyContent:"center", gap:8,
              }}>
                {addedToCart ? "✓ Added to Cart!" : "🛒 Add to Cart"}
              </button>
              <button onClick={() => setShowPayment(true)} style={{
                width:"100%", padding:"13px",
                background:"#f5f5f5",
                border:"1px solid rgba(0,0,0,0.08)", borderRadius:12, color:"#333",
                fontWeight:700, fontSize:14, cursor:"pointer", fontFamily:"inherit",
                marginBottom:10, display:"flex", alignItems:"center", justifyContent:"center", gap:8,
              }}>⚡ Buy Now</button>
              
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        background:"rgba(255,255,255,0.03)", borderTop:"1px solid rgba(255,255,255,0.06)",
        padding:"28px 40px", marginTop:40,
        display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:32,
      }}>
        {[
          { icon:"🕐", title:"Operating Hours", lines:["Mon - Sun","10:00 AM - 11:00 PM"] },
          { icon:"📞", title:"Contact Us", lines:["+94 77 599 5735","info@smartrestaurant.lk"] },
          { icon:"📍", title:"Our Location", lines:["123, Galle Road,","Colombo 03, Sri Lanka"] },
          
        ].map((col,i) => (
          <div key={i}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
              <span style={{ fontSize:20, color:accentColor }}>{col.icon}</span>
              <span style={{ fontSize:13, fontWeight:700, color:"#ccd6f6" }}>{col.title}</span>
            </div>
            {col.lines?.map((l,j) => <div key={j} style={{ fontSize:12, color:"#8b9ab8", marginBottom:4 }}>{l}</div>)}
            {col.social && (
              <div style={{ display:"flex", gap:10, marginTop:4 }}>
                {["🔵","📸","🐦","▶️"].map((s,j) => (
                  <div key={j} style={{
                    width:32, height:32, borderRadius:"50%",
                    background:"rgba(255,255,255,0.08)",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:16, cursor:"pointer",
                    transition:"background 0.2s",
                  }}>{s}</div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── CATEGORY MENU PAGE ───────────────────────────────────────────────────────

/* Subcategory icon map */
const subIcons = {
  // Breakfast sections
  "Sweet / Western":"🥞",
  "Savory":"🍳",
  "Light / Healthy":"🥗",
  "Sri Lankan 🇱🇰":"🇱🇰",
  // Lunch / Dinner subcategories
  "Traditional Rice & Curry":"🍛",
  "Chicken Dishes":"🍗",
  "Meat Dishes":"🥩",
  "Seafood Dishes":"🦐",
  "Kottu":"🍳",
  "Noodles":"🍜",
  "Fried Rice":"🍚",
  // Dessert subcategories
  "Traditional Sri Lankan Desserts":"🇱🇰",
  "Cakes & Bakery Desserts":"🎂",
  "Ice Cream & Cold Desserts":"🍨",
  "Puddings & Modern Desserts":"🍮",
  "Light & Fresh Options":"🍓",
  // Drinks subcategories
  "Hot Beverages":"☕",
  "Iced Beverages":"🧊",
  "Fresh Fruit Juices":"🍹",
  "Sri Lankan Special Drinks":"🥥",
  "Mocktails":"🍸",
  "Soft Drinks":"🥤",
  "Water & Refreshments":"💧",
  "Signature Drinks":"⭐",
};

/* Per-subcategory extra toppings & removable ingredients */
const subToppings = {
  // Breakfast
  "Sweet / Western":   [["Extra Maple Syrup",80],["Extra Whipped Cream",100],["Extra Berries",120]],
  "Savory":            [["Extra Egg",120],       ["Extra Cheese",150],       ["Extra Bacon",200]],
  "Light / Healthy":   [["Extra Granola",80],    ["Extra Honey",60],         ["Extra Seeds",80]],
  "Sri Lankan 🇱🇰":    [["Extra Pol Sambol",60], ["Extra Dhal",80],          ["Extra Egg",120]],
  // Lunch / Dinner
  "Traditional Rice & Curry": [["Extra Curry",200],["Extra Rice",100],["Extra Sambol",80]],
  "Chicken Dishes":           [["Extra Sauce",150],["Extra Cheese",200],["Extra Chilli",100]],
  "Meat Dishes":              [["Extra Sauce",150],["Extra Chilli",100],["Extra Onion",80]],
  "Seafood Dishes":           [["Extra Sauce",200],["Extra Lime",50], ["Extra Chilli",100]],
  "Kottu":                    [["Extra Egg",120],  ["Extra Cheese",180],["Extra Sauce",100]],
  "Noodles":                  [["Extra Egg",120],  ["Extra Sauce",100],["Extra Vegetables",80]],
  "Fried Rice":               [["Extra Egg",120],  ["Extra Sauce",100],["Extra Prawn",250]],
  // Desserts
  "Traditional Sri Lankan Desserts":[["Extra Treacle",80],["Extra Cashews",100],["Extra Coconut",60]],
  "Cakes & Bakery Desserts":        [["Extra Cream",100], ["Extra Frosting",120],["Extra Berries",150]],
  "Ice Cream & Cold Desserts":      [["Extra Scoop",200], ["Extra Sauce",80],   ["Extra Nuts",100]],
  "Puddings & Modern Desserts":     [["Extra Cream",100], ["Extra Sauce",80],   ["Extra Berries",120]],
  "Light & Fresh Options":          [["Extra Honey",60],  ["Extra Fruits",100], ["Extra Granola",80]],
  // Drinks
  "Hot Beverages":            [["Extra Shot",150], ["Extra Milk",60],  ["Flavour Syrup",80]],
  "Iced Beverages":           [["Extra Shot",150], ["Extra Ice Cream",200],["Flavour Syrup",80]],
  "Fresh Fruit Juices":       [["Extra Honey",60], ["Extra Lime",40],  ["Extra Ginger",60]],
  "Sri Lankan Special Drinks":[["Extra Jaggery",60],["Extra Coconut Milk",80],["Extra Ice",30]],
  "Mocktails":                [["Extra Mint",40],  ["Extra Lime",40],  ["Flavour Upgrade",100]],
  "Soft Drinks":              [["Extra Ice",30],   ["Lime Wedge",40],  ["Mint Sprig",40]],
  "Water & Refreshments":     [["Lemon Slice",30], ["Mint Sprig",30],  ["Cucumber Slice",40]],
  "Signature Drinks":         [["Extra Scoop",200],["Extra Coconut Cream",100],["Booster Shot",150]],
  // Default
  default:                    [["Extra Cheese",200],["Extra Sauce",100],["Extra Vegetables",150]],
};
const subRemove = {
  // Breakfast
  "Sweet / Western":   ["Maple Syrup","Whipped Cream","Powdered Sugar"],
  "Savory":            ["Onion","Chilli","Butter"],
  "Light / Healthy":   ["Honey","Nuts","Chia Seeds"],
  "Sri Lankan 🇱🇰":    ["Maldive Fish","Chilli","Coconut Milk"],
  // Lunch / Dinner
  "Traditional Rice & Curry": ["Curry Leaves","Coconut Milk","Onion"],
  "Chicken Dishes":           ["Onion","Capsicum","Chilli"],
  "Meat Dishes":              ["Onion","Chilli","Tomato"],
  "Seafood Dishes":           ["Onion","Chilli","Tomato"],
  "Kottu":                    ["Egg","Leeks","Carrot"],
  "Noodles":                  ["Egg","Leeks","Soy Sauce"],
  "Fried Rice":               ["Egg","Soy Sauce","Garlic"],
  // Desserts
  "Traditional Sri Lankan Desserts":["Cardamom","Cashews","Rosewater"],
  "Cakes & Bakery Desserts":        ["Cream","Frosting","Berries"],
  "Ice Cream & Cold Desserts":      ["Chocolate Sauce","Whipped Cream","Nuts"],
  "Puddings & Modern Desserts":     ["Cream","Vanilla","Cinnamon"],
  "Light & Fresh Options":          ["Honey","Mint","Lime"],
  // Drinks
  "Hot Beverages":            ["Sugar","Milk","Cinnamon Dust"],
  "Iced Beverages":           ["Whipped Cream","Sugar Syrup","Ice"],
  "Fresh Fruit Juices":       ["Honey","Ice","Lime"],
  "Sri Lankan Special Drinks":["Jaggery","Ice","Coconut Milk"],
  "Mocktails":                ["Mint","Ice","Sugar Syrup"],
  "Soft Drinks":              ["Ice","Lime","Mint"],
  "Water & Refreshments":     ["Mint","Lemon","Ice"],
  "Signature Drinks":         ["Honey","Coconut Cream","Ice"],
  // Default
  default:                    ["Onion","Tomato","Lettuce"],
};

const spicyDishPattern = /\b(spicy|chilli|chili|devilled|harissa|jalape(?:n|ñ)o|sriracha|fiery|hot|curry|kottu|biryani|shakshuka)\b/i;

const hasSpiceLevel = (dish) => {
  if (!dish) return false;
  if (typeof dish.spicy === "boolean") return dish.spicy;
  return spicyDishPattern.test(`${dish.name} ${dish.desc} ${(dish.ingredients || []).join(" ")}`);
};

function CategoryPage({ category, onBack, onDishSelect, onViewCart, cartItems = [], setCartItems }) {
  const { store } = useAppStore();
  const cfg   = categoryConfig[category];
  const items = allDishes[category] || [];
  const popularItems = items.filter(d => d.popular === true);
  const regularItems = items.filter(d => d.popular !== true);

  const getLiveDishStats = (dish) => getDishReviewStats(store.feedbackList, dish.id, {
    rating: dish.rating ?? 0,
    reviews: dish.reviews ?? 0,
  });

  const accent = cfg.accentColor;

  const [search, setSearch]         = useState("");
  const [activeSub, setActiveSub]   = useState("All");
  const [selectedDish, setSelectedDish] = useState(null);
  const [addedFlash, setAddedFlash] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  // Dish detail state
  const [variantIdx, setVariantIdx] = useState(0);
  const [imgAnim, setImgAnim]       = useState(true);
  const [spice, setSpice]           = useState("Medium");
  const [toppings, setToppings]     = useState([]);
  const [removeIngs, setRemoveIngs] = useState([]);
  const [qty, setQty]               = useState(1);
  const [notes, setNotes]           = useState("");
  const [liked, setLiked]           = useState(false);
  const [addedCart, setAddedCart]   = useState(false);

  const pageIcons = {Breakfast:"🌅",Lunch:"☀️",Dinner:"🌙",Desserts:"🍰",Drinks:"🥤"};
  const served    = {Breakfast:"7 AM – 11:30 AM",Lunch:"11:30 AM – 3 PM",Dinner:"5 PM – 10 PM",Desserts:"All day",Drinks:"All day"};

  // Subcategories — support both 'subcategory' and 'section' fields
  const groupField = items[0]?.subcategory ? "subcategory" : items[0]?.section ? "section" : null;
  const subcats = groupField
    ? ["All", ...[...new Set(items.map(d=>d[groupField]).filter(Boolean))]]
    : ["All"];

  const filtered = items.filter(d => {
    const ms = !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.desc.toLowerCase().includes(search.toLowerCase());
    const mc = activeSub === "All" || (d[groupField||""] === activeSub);
    return ms && mc;
  });

  const grouped = subcats.filter(s=>s!=="All").reduce((acc,s)=>{
    const sItems = filtered.filter(d=>(groupField ? d[groupField] : null)===s);
    if(sItems.length) acc[s]=sItems;
    return acc;
  },{});

  const openDish = (dish) => {
    setSelectedDish(dish);
    setVariantIdx(0); setImgAnim(true);
    setSpice(hasSpiceLevel(dish) ? "Medium" : "None"); setToppings([]); setRemoveIngs([]);
    setQty(1); setNotes(""); setAddedCart(false);
  };

  const closeDish = () => setSelectedDish(null);

  const handleVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support voice recognition. Please use Chrome or Edge.");
      return;
    }

    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSearch(transcript);
    };
    recognition.onerror = (event) => {
      console.error('Voice recognition error:', event.error);
      setIsListening(false);
      recognitionRef.current = null;
    };
    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const handleAddCart = (dish, customization) => {
    if (!setCartItems) {
      setAddedFlash(dish.id);
      setTimeout(()=>setAddedFlash(null),700);
      return;
    }

    const numericPrice = parseInt(String(dish.price).replace(/[^0-9]/g, "")) || 0;
    const quantity = customization?.qty || 1;

    setCartItems(prev => {
      const existing = prev.find(i => i.id === dish.id);
      if (existing) {
        return prev.map(i =>
          i.id === dish.id
            ? {
                ...i,
                qty: i.qty + quantity,
                spice: customization?.spice ?? i.spice ?? "Medium",
                toppings: customization?.toppings ?? i.toppings ?? [],
                removedIngredients: customization?.removedIngredients ?? i.removedIngredients ?? [],
                note: customization?.notes ?? i.note ?? "",
              }
            : i
        );
      }

      return [
        ...prev,
        {
          ...dish,
          category,
          qty: quantity,
          price: numericPrice,
          spice: customization?.spice || "Medium",
          toppings: customization?.toppings || [],
          removedIngredients: customization?.removedIngredients || [],
          note: customization?.notes || "",
        },
      ];
    });

    setAddedFlash(dish.id);
    setTimeout(()=>setAddedFlash(null),700);
  };

    const selectedLiveStats = selectedDish ? getLiveDishStats(selectedDish) : { rating: 0, reviews: 0 };
    const basePrice = selectedDish ? parseInt(selectedDish.price.replace(/[^0-9]/g,"")) : 0;
    const dishGroup = selectedDish?.subcategory || selectedDish?.section || "";
    const toppingMap = Object.fromEntries((subToppings[dishGroup] || subToppings.default).map(([n,p])=>[n,p]));
    const toppingTotal = toppings.reduce((s,t)=>s+(toppingMap[t]||0),0);
    const totalPrice   = (basePrice + toppingTotal) * qty;

    // Variants for the dish carousel
    const dishVariantImages = selectedDish
      ? (dishVariants[selectedDish.id]?.variants || makeVariants(selectedDish)).map(v => v.image || selectedDish.image || "/images/pancake2.jpg")
      : [];

    const similarDishes = selectedDish
      ? items.filter(d=>(d.subcategory||d.section)===dishGroup && d.id!==selectedDish.id).slice(0,4)
      : [];

    const currentToppings = subToppings[dishGroup] || subToppings.default;
    const currentRemove   = selectedDish?.ingredients?.filter(Boolean).length
      ? selectedDish.ingredients.filter(Boolean)
      : subRemove[dishGroup] || subRemove.default;
    const showSpiceLevel = hasSpiceLevel(selectedDish);

  const renderStars = (rating, col, size=13) => (
    <span>
      {[1,2,3,4,5].map(i=>(
        <span key={i} style={{color: i<=Math.floor(rating)?col:"#e0e0e0",fontSize:size}}>★</span>
      ))}
    </span>
  );

  return (
    <div style={{ minHeight:"100vh", background:"#f6f3ef", fontFamily:"'Trebuchet MS',sans-serif", position:"relative" }}>

      {/* ── Top Bar ── */}
      <div style={{
        position:"sticky", top:0, zIndex:200,
        background:"rgba(255,255,255,0.97)", backdropFilter:"blur(14px)",
        borderBottom:"1px solid rgba(0,0,0,0.06)",
        padding:"0 32px", height:64,
        display:"flex", alignItems:"center", gap:14,
        boxShadow:"0 2px 12px rgba(0,0,0,0.05)",
      }}>
        <button onClick={onBack} style={{
          display:"flex", alignItems:"center", gap:6, background:"#f3f4f6",
          border:"none", borderRadius:10, padding:"7px 14px", color:"#555",
          cursor:"pointer", fontSize:13, fontWeight:600, fontFamily:"inherit",
        }}
          onMouseEnter={e=>e.currentTarget.style.background="#e5e7eb"}
          onMouseLeave={e=>e.currentTarget.style.background="#f3f4f6"}
        >← Home</button>

        <div style={{ flex:1, maxWidth:360, display:"flex", alignItems:"center", background:"#f3f4f6", borderRadius:10, padding:"0 13px", gap:7 }}>
          <span style={{ color:"#9ca3af", fontSize:13 }}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={`Search ${category} items…`}
            style={{ flex:1, border:"none", background:"none", fontSize:13, color:"#374151", outline:"none", padding:"8px 0", fontFamily:"inherit" }}/>
          {search && <button onClick={()=>setSearch("")} style={{ background:"none",border:"none",cursor:"pointer",color:"#9ca3af",fontSize:13 }}>✕</button>}
        </div>

        <div style={{ marginLeft:"auto", display:"flex", gap:12, alignItems:"center" }}>
          <button onClick={handleVoiceSearch} style={{ display:"inline-flex", alignItems:"center", gap:6, border:"none", background:isListening?accent:"#f3f4f6", color:isListening?"#fff":"#374151", borderRadius:12, padding:"8px 12px", cursor:"pointer", fontSize:13, fontWeight:700, fontFamily:"inherit" }}>
            {isListening ? '🛑 Listening...' : '🎙️ Voice'}
          </button>
          <span style={{ fontSize:20, opacity:0.5 }}></span>
          <div onClick={onViewCart} style={{ position:"relative", cursor: onViewCart ? "pointer" : "default" }}>
            <span style={{ fontSize:20 }}>🛒</span>
            {cartItems.reduce((s,i)=>s+(i.qty||0),0) > 0 && (
              <span style={{ position:"absolute",top:-4,right:-4,background:accent,color:"#fff",borderRadius:"50%",width:15,height:15,display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,fontWeight:800 }}>
                {cartItems.reduce((s,i)=>s+(i.qty||0),0)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Hero banner ── */}
      <div style={{
        background: cfg.bannerGrad, padding:"28px 40px 32px",
        position:"relative", overflow:"hidden",
      }}>
        <div style={{ maxWidth:1140, margin:"0 auto", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:16 }}>
          <div style={{ display:"flex", alignItems:"center", gap:16 }}>
            <div style={{ width:56, height:56, borderRadius:16, background:`linear-gradient(135deg,${accent},${accent}cc)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, boxShadow:`0 6px 18px ${accent}44` }}>
              {pageIcons[category]}
            </div>
            <div>
              <h1 style={{ margin:0, fontSize:26, fontWeight:900, color:"#1a1a1a", letterSpacing:"-0.5px" }}>{category} Menu</h1>
              <p style={{ margin:"4px 0 0", color:"#888", fontSize:13 }}>{items.length} items · Served {served[category]}</p>
            </div>
          </div>
          <div style={{ display:"flex", gap:12 }}>
            {[
              [items.length+" Dishes","on menu"],
              [items.filter(i=>i.subcategory).length>0 ? [...new Set(items.map(i=>i.subcategory).filter(Boolean))].length+" Sections":"","categories"],
              [`Rs.${Math.min(...items.map(i=>parseInt(i.price.replace(/[^0-9]/g,"")))).toLocaleString()}+`,"from"],
            ].filter(([v])=>v).map(([val,sub])=>(
              <div key={sub} style={{ background:"rgba(255,255,255,0.6)", backdropFilter:"blur(8px)", borderRadius:12, padding:"10px 16px", textAlign:"center", border:"1px solid rgba(255,255,255,0.8)" }}>
                <div style={{ fontSize:15, fontWeight:900, color:accent }}>{val}</div>
                <div style={{ fontSize:10, color:"#999", marginTop:1 }}>{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cart summary bar */}
      {cartItems.reduce((sum,item)=>sum+(item.qty||0),0) > 0 && (
        <div style={{
          position:"fixed", bottom:28, left:"50%", transform:"translateX(-50%)",
          background:`linear-gradient(135deg,${accent},${accent}cc)`,
          borderRadius:20, padding:"14px 28px",
          display:"flex", alignItems:"center", gap:20,
          boxShadow:`0 12px 40px ${accent}66`,
          zIndex:200, minWidth:320,
          animation:"slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1)",
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ fontSize:22 }}>🛒</span>
            <div>
              <div style={{ fontSize:13, fontWeight:800, color:"#fff" }}>{cartItems.reduce((sum,item)=>sum+(item.qty||0),0)} item{cartItems.reduce((sum,item)=>sum+(item.qty||0),0)>1?"s":""} in cart</div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.7)" }}>Ready to order?</div>
            </div>
          </div>
          <button onClick={onViewCart || onBack} style={{
            padding:"9px 20px", background:"rgba(255,255,255,0.2)",
            border:"1px solid rgba(255,255,255,0.3)", borderRadius:12,
            color:"#fff", fontWeight:700, fontSize:12, cursor:"pointer",
            fontFamily:"inherit", marginLeft:"auto",
          }}>View Cart →</button>
        </div>
      )}

      {/* ── Subcategory tabs ── */}
      {subcats.length > 1 && (
        <div style={{ background:"#fff", borderBottom:"1px solid #f0f0f0", position:"sticky", top:64, zIndex:150 }}>
          <div style={{ maxWidth:1140, margin:"0 auto", padding:"0 32px", display:"flex", gap:0, overflowX:"auto" }}>
            {subcats.map(s=>(
              <button key={s} onClick={()=>setActiveSub(s)} style={{
                padding:"14px 18px", border:"none", background:"transparent",
                color: activeSub===s ? accent : "#9ca3af",
                fontWeight: activeSub===s ? 800 : 500, fontSize:13,
                cursor:"pointer", fontFamily:"inherit",
                borderBottom: activeSub===s ? `3px solid ${accent}` : "3px solid transparent",
                whiteSpace:"nowrap", transition:"all 0.2s",
                display:"flex", alignItems:"center", gap:6,
              }}>
                {s!=="All" && <span style={{ fontSize:16 }}>{subIcons[s]||"🍽️"}</span>}
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Main content ── */}
      <div style={{ maxWidth:1140, margin:"0 auto", padding:"28px 32px 80px" }}>

        {/* Show all subcategories grouped */}
        {activeSub === "All" && !search ? (
          Object.entries(grouped).map(([subcat, dishList])=>(
            <div key={subcat} style={{ marginBottom:40 }}>
              {/* Section header */}
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:18 }}>
                <div style={{
                  width:40, height:40, borderRadius:12,
                  background:`linear-gradient(135deg,${accent},${accent}cc)`,
                  display:"flex", alignItems:"center", justifyContent:"center", fontSize:20,
                  boxShadow:`0 4px 12px ${accent}33`,
                }}>{subIcons[subcat]||"🍽️"}</div>
                <div>
                  <h2 style={{ margin:0, fontSize:18, fontWeight:900, color:"#111827" }}>{subcat}</h2>
                  <p style={{ margin:0, fontSize:12, color:"#9ca3af" }}>{dishList.length} dishes</p>
                </div>
                <div style={{ marginLeft:"auto", height:1, flex:1, background:`linear-gradient(90deg,${accent}22,transparent)` }}/>
              </div>

              {/* Dish cards grid */}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:16 }}>
                {dishList.map(dish=>(
                  <DishCard key={dish.id} dish={dish} accent={accent} onOpen={openDish} onAddCart={handleAddCart} addedFlash={addedFlash} liveStats={getLiveDishStats(dish)}/>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div>
            {search && <div style={{ fontSize:13, color:"#9ca3af", marginBottom:16 }}>{filtered.length} result{filtered.length!==1?"s":""} for "{search}"</div>}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:16 }}>
              {filtered.map(dish=>(
                <DishCard key={dish.id} dish={dish} accent={accent} onOpen={openDish} onAddCart={handleAddCart} addedFlash={addedFlash} liveStats={getLiveDishStats(dish)}/>
              ))}
            </div>
            {filtered.length===0 && (
              <div style={{ textAlign:"center", padding:"60px" }}>
                <div style={{ fontSize:52, marginBottom:12 }}>🔍</div>
                <div style={{ fontWeight:700, color:"#374151" }}>No items found</div>
                <div style={{ fontSize:13, color:"#9ca3af", marginTop:4 }}>Try a different search or tab.</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── DISH DETAIL DRAWER (right slide-in) ── */}
      {selectedDish && (
        <>
          {/* Backdrop */}
          <div onClick={closeDish} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.38)", zIndex:300, animation:"fadeIn 0.2s ease" }}/>

          {/* Drawer */}
          <div style={{
            position:"fixed", top:0, right:0, bottom:0,
            width:"min(860px,95vw)",
            background:"#fff", zIndex:400,
            display:"flex", flexDirection:"column",
            boxShadow:"-20px 0 60px rgba(0,0,0,0.18)",
            animation:"slideInDrawer 0.3s cubic-bezier(0.4,0,0.2,1)",
            overflowY:"auto",
          }}>
            {/* Drawer top bar */}
            <div style={{
              position:"sticky", top:0, zIndex:10,
              background:"rgba(255,255,255,0.97)", backdropFilter:"blur(10px)",
              borderBottom:"1px solid rgba(0,0,0,0.07)",
              padding:"14px 24px", display:"flex", alignItems:"center", gap:12,
            }}>
              <button onClick={closeDish} style={{
                width:36, height:36, borderRadius:"50%", border:"none",
                background:"#f3f4f6", cursor:"pointer", fontSize:18,
                display:"flex", alignItems:"center", justifyContent:"center",
              }}>←</button>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:11, color:`${accent}`, fontWeight:700, letterSpacing:"0.8px", textTransform:"uppercase" }}>{selectedDish.subcategory||selectedDish.section||category}</div>
                <div style={{ fontSize:16, fontWeight:800, color:"#111827" }}>{selectedDish.name}</div>
              </div>
              <button onClick={()=>setLiked(l=>!l)} style={{ background:"none", border:"none", cursor:"pointer", fontSize:24 }}>
                {liked?"❤️":"🤍"}
              </button>
            </div>

            {/* Content */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 320px", flex:1 }}>

              {/* LEFT: images + info */}
              <div style={{ padding:"24px 24px 24px 28px", borderRight:"1px solid #f0f0f0" }}>

                {/* Carousel */}
                <div style={{ position:"relative", borderRadius:20, overflow:"hidden", background:selectedDish.color||"#f9fafb", height:280, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:12 }}>
                  <img
                    src={dishVariantImages[variantIdx] || selectedDish.image || "/images/pancake2.jpg"}
                    alt={selectedDish.name}
                    style={{
                      width:"100%",
                      height:"100%",
                      objectFit:"cover",
                      opacity: imgAnim ? 1 : 0,
                      transform: imgAnim ? "scale(1) translateX(0)" : "scale(0.82) translateX(0)",
                      transition:"all 0.22s cubic-bezier(0.4,0,0.2,1)",
                      filter:"drop-shadow(0 8px 20px rgba(0,0,0,0.12))",
                      userSelect:"none",
                    }}
                  />
                  
                </div>

                
                {/* Variant note */}
                <p style={{ fontSize:12, color:"#9ca3af", textAlign:"center", margin:"0 0 20px", fontStyle:"italic" }}>{selectedDish.desc}</p>

                {/* Price + Rating */}
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                  <div style={{ fontSize:28, fontWeight:900, color:accent }}>{selectedDish.price}</div>
                  <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                    {renderStars(selectedLiveStats.rating, accent, 15)}
                    <span style={{ fontWeight:700, color:accent, fontSize:14 }}>{selectedLiveStats.rating}</span>
                    <span style={{ color:"#aaa", fontSize:12 }}>({selectedLiveStats.reviews}+ reviews)</span>
                  </div>
                </div>

                {/* Description */}
                <div style={{ marginBottom:16 }}>
                  <div style={{ fontSize:13, fontWeight:800, color:"#374151", marginBottom:6 }}>Description</div>
                  <p style={{ margin:0, fontSize:13, color:"#6b7280", lineHeight:1.65 }}>{selectedDish.desc}</p>
                </div>

                {/* Ingredients */}
                <div style={{ marginBottom:20 }}>
                  <div style={{ fontSize:13, fontWeight:800, color:"#374151", marginBottom:8 }}>Ingredients</div>
                  <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
                    {selectedDish.ingredients.map(ing=>(
                      <div key={ing} style={{ display:"flex", alignItems:"center", gap:8, fontSize:13, color:"#555" }}>
                        <span style={{ color:accent, fontSize:14, fontWeight:700 }}>✓</span>
                        {ing}
                      </div>
                    ))}
                  </div>
                </div>

                {/* You May Also Like */}
                {similarDishes.length > 0 && (
                  <div>
                    <div style={{ fontSize:14, fontWeight:800, color:"#111827", marginBottom:12 }}>You May Also Like</div>
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10 }}>
                      {similarDishes.map(sd=>(
                        <div key={sd.id} onClick={()=>openDish(sd)} style={{
                          background:sd.color||"#f9fafb", borderRadius:14, padding:"12px 10px",
                          textAlign:"center", cursor:"pointer", border:"1px solid rgba(0,0,0,0.05)",
                          transition:"transform 0.2s, box-shadow 0.2s",
                        }}
                          onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow=`0 8px 20px ${accent}18`;}}
                          onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";}}
                        >
                         
                          <div style={{ fontSize:11, fontWeight:700, color:"#111827", lineHeight:1.3, marginBottom:4 }}>{sd.name}</div>
                          <div style={{ fontSize:12, fontWeight:800, color:accent }}>{sd.price}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* RIGHT: Customise panel */}
              <div style={{ padding:"24px 22px", display:"flex", flexDirection:"column", gap:18, background:"#fafafa" }}>

                {/* Extra Toppings */}
                <div>
                  <div style={{ fontSize:11, fontWeight:800, color:"#374151", letterSpacing:"1px", textTransform:"uppercase", marginBottom:10 }}>Extra Toppings</div>
                  {currentToppings.map(([name,price])=>(
                    <label key={name} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:9, cursor:"pointer" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <div style={{
                          width:18, height:18, borderRadius:4, border:`2px solid ${toppings.includes(name)?accent:"#d1d5db"}`,
                          background: toppings.includes(name)?accent:"#fff",
                          display:"flex", alignItems:"center", justifyContent:"center",
                          cursor:"pointer", flexShrink:0, transition:"all 0.15s",
                        }} onClick={()=>setToppings(p=>p.includes(name)?p.filter(x=>x!==name):[...p,name])}>
                          {toppings.includes(name) && <span style={{ color:"#fff", fontSize:11, fontWeight:900 }}>✓</span>}
                        </div>
                        <span style={{ fontSize:13, color:"#555" }}>{name}</span>
                      </div>
                      <span style={{ fontSize:12, fontWeight:700, color:accent }}>+ Rs.{price}</span>
                    </label>
                  ))}
                </div>

                {/* Remove Ingredients */}
                <div>
                  <div style={{ fontSize:11, fontWeight:800, color:"#374151", letterSpacing:"1px", textTransform:"uppercase", marginBottom:10 }}>Remove Ingredients</div>
                  {currentRemove.map(ing=>(
                    <label key={ing} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:9, cursor:"pointer" }}>
                      <div style={{
                        width:18, height:18, borderRadius:4, border:`2px solid ${removeIngs.includes(ing)?accent:"#d1d5db"}`,
                        background: removeIngs.includes(ing)?accent:"#fff",
                        display:"flex", alignItems:"center", justifyContent:"center",
                        cursor:"pointer", flexShrink:0, transition:"all 0.15s",
                      }} onClick={()=>setRemoveIngs(p=>p.includes(ing)?p.filter(x=>x!==ing):[...p,ing])}>
                        {removeIngs.includes(ing) && <span style={{ color:"#fff", fontSize:11, fontWeight:900 }}>✓</span>}
                      </div>
                      <span style={{ fontSize:13, color:"#555" }}>{ing}</span>
                    </label>
                  ))}
                </div>

                {/* Spice Level */}
                {showSpiceLevel && <div>
                  <div style={{ fontSize:11, fontWeight:800, color:"#374151", letterSpacing:"1px", textTransform:"uppercase", marginBottom:10 }}>Spice Level</div>
                  {[["Mild","🌿"],["Medium","🌶️"],["Hot","🌶️🌶️"],["Extra Hot","🌶️🌶️🌶️"]].map(([lv,icon])=>(
                    <label key={lv} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:9, cursor:"pointer" }}>
                      <div style={{
                        width:18, height:18, borderRadius:"50%", border:`2px solid ${spice===lv?accent:"#d1d5db"}`,
                        background: spice===lv?accent:"#fff",
                        display:"flex", alignItems:"center", justifyContent:"center",
                        cursor:"pointer", flexShrink:0, transition:"all 0.15s",
                      }} onClick={()=>setSpice(lv)}>
                        {spice===lv && <span style={{ width:6,height:6,borderRadius:"50%",background:"#fff",display:"inline-block" }}/>}
                      </div>
                      <span style={{ fontSize:13, color:"#555", flex:1 }}>{lv}</span>
                      <span style={{ fontSize:13 }}>{icon}</span>
                    </label>
                  ))}
                </div>}

                {/* Quantity */}
                <div>
                  <div style={{ fontSize:11, fontWeight:800, color:"#374151", letterSpacing:"1px", textTransform:"uppercase", marginBottom:10 }}>Quantity</div>
                  <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                    <button onClick={()=>setQty(q=>Math.max(1,q-1))} style={{
                      width:36, height:36, borderRadius:"50%", background:"#f3f4f6",
                      border:"1px solid #e5e7eb", color:"#374151", cursor:"pointer",
                      fontSize:18, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center",
                    }}>−</button>
                    <span style={{ fontSize:18, fontWeight:800, color:"#111827", minWidth:20, textAlign:"center" }}>{qty}</span>
                    <button onClick={()=>setQty(q=>q+1)} style={{
                      width:36, height:36, borderRadius:"50%",
                      background:`linear-gradient(135deg,${accent},${accent}cc)`,
                      border:"none", color:"#fff", cursor:"pointer",
                      fontSize:18, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center",
                      boxShadow:`0 4px 12px ${accent}44`,
                    }}>+</button>
                  </div>
                </div>

                {/* Special Notes */}
                <div>
                  <div style={{ fontSize:11, fontWeight:800, color:"#374151", letterSpacing:"1px", textTransform:"uppercase", marginBottom:8 }}>Special Notes</div>
                  <textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Add your instructions here…" rows={3} style={{
                    width:"100%", boxSizing:"border-box",
                    background:"#fff", border:"1.5px solid #e5e7eb",
                    borderRadius:10, padding:"10px 12px", color:"#374151",
                    fontSize:12, resize:"none", outline:"none", fontFamily:"inherit", lineHeight:1.6,
                  }}/>
                  <div style={{ fontSize:10, color:"#aaa", marginTop:2 }}>(Optional)</div>
                </div>

                {/* Total Price */}
                <div style={{
                  display:"flex", justifyContent:"space-between", alignItems:"center",
                  padding:"12px 14px", background:`${accent}0c`,
                  border:`1px solid ${accent}22`, borderRadius:12,
                }}>
                  <span style={{ fontSize:14, fontWeight:700, color:"#374151" }}>Total Price</span>
                  <span style={{ fontSize:20, fontWeight:900, color:accent }}>Rs. {totalPrice.toLocaleString()}</span>
                </div>

                {/* Action buttons */}
                <button onClick={()=>{
                  setAddedCart(true);
                  handleAddCart(selectedDish, { qty, spice: showSpiceLevel ? spice : "None", toppings, removedIngredients: removeIngs, notes });
                  setTimeout(()=>setAddedCart(false),2000);
                }} style={{
                  width:"100%", padding:"13px",
                  background: addedCart ? "linear-gradient(135deg,#22c55e,#16a34a)" : `linear-gradient(135deg,${accent},${accent}cc)`,
                  border:"none", borderRadius:12, color:"#fff",
                  fontWeight:700, fontSize:14, cursor:"pointer", fontFamily:"inherit",
                  boxShadow: addedCart ? "0 6px 20px #22c55e44" : `0 6px 20px ${accent}44`,
                  display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                  transition:"all 0.3s",
                }}>
                  {addedCart ? "✓ Added to Cart!" : "🛒 Add to Cart"}
                </button>
                <button onClick={()=>onDishSelect(selectedDish, category)} style={{
                  width:"100%", padding:"12px",
                  background:"#f3f4f6", border:"1px solid #e5e7eb",
                  borderRadius:12, color:"#374151",
                  fontWeight:600, fontSize:13, cursor:"pointer", fontFamily:"inherit",
                  display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                }}>⚡ Buy Now</button>
              </div>
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes fadeIn        { from{opacity:0} to{opacity:1} }
        @keyframes slideInDrawer { from{transform:translateX(100%);opacity:0} to{transform:translateX(0);opacity:1} }
      `}</style>
    </div>
  );
}function DishCard({ dish, accent, onOpen, onAddCart, addedFlash, liveStats }) {
  const [hovered, setHovered] = useState(false);
  const [liked, setLiked] = useState(false);
  const [imageError, setImageError] = useState(false);
  const isFlash = addedFlash === dish.id;
  const ratingValue = liveStats?.rating ?? dish.rating ?? 0;
  const reviewValue = liveStats?.reviews ?? dish.reviews ?? 0;

  const badge = dish.subcategory || dish.section || "Chef's Choice";

  const photoBg = dish.color
    ? `radial-gradient(ellipse at 55% 40%, ${dish.color}ee 0%, ${dish.color}88 60%, ${dish.color}44 100%)`
    : "radial-gradient(ellipse at 55% 40%, #fdf6ed 0%, #f5e6cc 60%, #edddb6 100%)";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#fff",
        borderRadius: 24,
        overflow: "hidden",
        boxShadow: hovered
          ? "0 24px 56px rgba(0,0,0,0.15), 0 4px 16px rgba(0,0,0,0.06)"
          : "0 4px 20px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)",
        transform: hovered ? "translateY(-8px) scale(1.01)" : "translateY(0) scale(1)",
        transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {/* ── Photo area with image support ── */}
      <div
        onClick={() => onOpen(dish)}
        style={{
          position: "relative",
          height: 200,
          background: photoBg,
          flexShrink: 0,
          overflow: "hidden",
        }}
      >
        {/* Image or Emoji (fallback) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: hovered ? "scale(1.05)" : "scale(1)",
            transition: "transform 0.3s ease",
            userSelect: "none",
            zIndex: 2,
          }}
        >
          {/* Image එක තිබේ නම් සහ error නැතිනම් */}
          {dish.image && !imageError ? (
            <img
              src={dish.image}
              alt={dish.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              onError={() => setImageError(true)}
            />
          ) : (
            /* Fallback Emoji */
            <span style={{
              fontSize: 90,
              filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.12))",
            }}>
              {dish.emoji || "🍽️"}
            </span>
          )}
        </div>

        {/* Depth vignette */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.06) 100%)",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />

        {/* ── Wave SVG ── */}
        <div
          style={{
            position: "absolute",
            bottom: -1,
            left: 0,
            right: 0,
            zIndex: 3,
            lineHeight: 0,
            pointerEvents: "none",
          }}
        >
          <svg
            viewBox="0 0 400 50"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            style={{ display: "block", width: "100%", height: 50 }}
          >
            <path
              d="M0,30 C60,50 120,10 200,28 C280,46 340,14 400,30 L400,50 L0,50 Z"
              fill="#ffffff"
            />
          </svg>
        </div>

        {/* Badge */}
        <div
          style={{
            position: "absolute",
            top: 13,
            left: 13,
            zIndex: 4,
            background: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(8px)",
            borderRadius: 22,
            padding: "4px 12px",
            fontSize: 10,
            fontWeight: 800,
            color: "#374151",
            letterSpacing: "0.3px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          {badge}
        </div>

        {/* Heart button */}
        <button
          onClick={e => { e.stopPropagation(); setLiked(l => !l); }}
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            zIndex: 4,
            width: 34,
            height: 34,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(8px)",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            transition: "transform 0.2s cubic-bezier(0.34,1.56,0.64,1)",
          }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.18)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
        >
          {liked ? "❤️" : "🤍"}
        </button>
      </div>

      {/* ── Info area ── */}
      <div
        onClick={() => onOpen(dish)}
        style={{ padding: "10px 18px 18px", flex: 1, display: "flex", flexDirection: "column" }}
      >
        <h3 style={{
          margin: "0 0 5px",
          fontSize: 17,
          fontWeight: 800,
          color: "#111827",
          lineHeight: 1.22,
          letterSpacing: "-0.3px",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}>{dish.name}</h3>

        <p style={{
          margin: "0 0 10px",
          fontSize: 11.5,
          color: "#9ca3af",
          lineHeight: 1.6,
          flex: 1,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}>{dish.desc}</p>

        <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 12 }}>
          <span style={{ color: "#f59e0b", fontSize: 13 }}>★</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}>{ratingValue}</span>
          <span style={{ fontSize: 11, color: "#d1d5db" }}>
            ({reviewValue}+)
          </span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{
            fontSize: 18, fontWeight: 900, color: "#111827", letterSpacing: "-0.4px",
          }}>{dish.price}</div>

          <button
            onClick={e => { e.stopPropagation(); onAddCart(dish); }}
            style={{
              width: 38, height: 38, borderRadius: "50%", border: "none",
              background: isFlash
                ? "linear-gradient(135deg,#22c55e,#16a34a)"
                : `linear-gradient(135deg,${accent},${accent}dd)`,
              color: "#fff", fontSize: 22,
              cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: isFlash
                ? "0 6px 18px rgba(34,197,94,0.45)"
                : `0 6px 18px ${accent}55`,
              transform: isFlash ? "scale(1.18)" : "scale(1)",
              transition: "all 0.22s cubic-bezier(0.34,1.56,0.64,1)",
              lineHeight: 1,
            }}
            onMouseEnter={e => { if (!isFlash) e.currentTarget.style.transform = "scale(1.12)"; }}
            onMouseLeave={e => { if (!isFlash) e.currentTarget.style.transform = "scale(1)"; }}
          >
            {isFlash ? "✓" : "+"}
          </button>
        </div>
      </div>
    </div>
  );
}
export { CategoryPage };