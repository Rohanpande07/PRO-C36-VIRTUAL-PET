var dog, sadDog, happyDog, database;
var foodS, foodStock;
var addFood, feedFood;
var foodObj;
var canvas;
var feed, lastFed;

function preload(){
  sadDog=loadImage("Dog.png");
  happyDog=loadImage("happy dog.png");
}

function setup() {
  canvas = createCanvas(1000,400);
  database = firebase.database();

  foodObj = new Food();

  foodStock = database.ref('Food');
  foodStock.on("value",readStock);
  
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  feedFood=createButton("Feed the Dog");
  feedFood.position(700,95);
  feedFood.mousePressed(feedDog);
}

function draw() {
  background(46,139,87);
  foodObj.display();

  var fedTime = database.ref('lastFed');
  fedTime.on("value", function(data){ 
    lastFed = data.val();
  });

  database.ref('/').update({
    lastFed:hour()
  });

  fill(255,255,254);
  textSize(15);
  if(lastFed >= 12){
    text("Last Feed: " + lastFed%12 + " PM",350,30);
  }
  else if(lastFed === 0){
    text("Last Feed: 12 AM",350,30);
  }else{
    text("Last Feed: " + lastFed + " AM",350,30);
  }

  drawSprites();
}

function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

function feedDog(){
  dog.addImage(happyDog);
  var foodStockVal = foodObj.getFoodStock();
  if(foodStockVal <= 0){
    foodObj.updateFoodStock(foodStockVal *0);
  }else{
    foodObj.updateFoodStock(foodStockVal -1);
  }

  database.ref('/').update({
    Food:foodObj.getFoodStock(),
  });
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  });
}