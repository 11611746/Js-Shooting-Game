let LEFT_ARROW_KEY = 37;
let UP_ARROW_KEY = 38;
let RIGHT_ARROW_KEY = 39;
let DOWN_ARROW_KEY = 40;
let SPACE_KEY = 32;
let hero_movement = 3;

let score = 0;
let lastLoopRun = 0;

let controller = {};
let covidViruses = [];

const createSprite = function(element, x, y, w, h){
    let result = {
        element : element,
        x : x,
        y : y,
        w : w,
        h : h
    };
    return result;
};

//toggle key
const keys = (keyCode, isPressed) =>{
    //console.log(keyCode);
    if(keyCode === LEFT_ARROW_KEY){
        controller.left = isPressed;
    }
    if(keyCode === UP_ARROW_KEY){
        controller.up = isPressed;
    }
    if(keyCode === RIGHT_ARROW_KEY){
        controller.right = isPressed;
    }
    if(keyCode === DOWN_ARROW_KEY){
        controller.down = isPressed;
    }
    if(keyCode === SPACE_KEY){
        controller.space = isPressed;
    }
};

function intersects(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h >b.y;
}

const ensureBounds = function (sprite, ignoreY){
    if(sprite.x < 30){
        sprite.x = 30;
    }
    if(!ignoreY && sprite.y < 30){
        sprite.y = 30;
    }
    if(sprite.x + sprite.w > 480){
        sprite.x = 480 - sprite.w;
    }
    if(!ignoreY && sprite.y + sprite.h > 480){
        sprite.y = 480 - sprite.h;
    }
};

//main Character
const setPosition = (mainChar) => {
    var e = document.getElementById(mainChar.element);
    e.style.left = mainChar.x + 'px';
    e.style.top = mainChar.y + 'px';
};

const handleControls = function(){
    if(controller.up){
        hero.y -= hero_movement;
    }
    if(controller.down){
        hero.y += hero_movement;
    }
    if(controller.left){
        hero.x -= hero_movement;
    }
    if(controller.right){
        hero.x += hero_movement;
    }
    if(controller.space && bullet.y <= -120){
        bullet.x = hero.x + 14;
        bullet.y = hero.y - bullet.h;
    }

    ensureBounds(hero);
};

const gameOver = () =>{
    var element = document.getElementById(hero.element);
    element.style.visibility = 'hidden';
    element = document.getElementById('gameOver');
    element.style.visibility = 'visible';
};

function checkCollisions(){
    for(var i=0;i<covidViruses.length;i++){
        if(intersects(bullet, covidViruses[i])){
            let element = document.getElementById(covidViruses[i].element);
            element.style.visibility = 'hidden';
            element.parentNode.removeChild(element);
            covidViruses.splice(i, 1);
            i--;
            bullet.y = -bullet.h;
            score += 50; 
        }
        else if(intersects(hero, covidViruses[i])){
            gameOver();
        }
        else if(covidViruses[i].y + covidViruses[i].h >= 500){
            let element = document.getElementById(covidViruses[i].element);
            element.style.visibility = 'hidden';
            element.parentNode.removeChild(element);
            covidViruses.splice(i, 1);
            i--;
        }
    }
}

const showSprites = function(){
    setPosition(hero);
    setPosition(bullet);
    for(let i=0;i<covidViruses.length;i++){
        setPosition(covidViruses[i]);
    }
    var scoreElement = document.getElementById('score');
    scoreElement.innerHTML = 'SCORE : ' + score;
};

const updatePositions = function(){
    for(let i=0; i<covidViruses.length;i++){
        covidViruses[i].y += 4;
        covidViruses[i].x += getRandom(7) - 3; 
        ensureBounds(covidViruses[i], true);
    }
    bullet.y -= 12;
};

const getRandom = function(size){
    return parseInt(Math.random() * size);
};

const addCovidVirus = function(){
    if(getRandom(50) == 0){
        let elementName = 'covidVirus' + getRandom(10000000);
        let virus = createSprite(elementName, getRandom(450), -40, 20, 20);

        let element = document.createElement('div');
        element.id = virus.element;
        element.className = 'covidVirus';
        document.children[0].appendChild(element);

        covidViruses[covidViruses.length] = virus;
    }
};

const gameLoop = () =>{
    if(new Date().getTime() - lastLoopRun > 40){
        updatePositions();
        handleControls();
        checkCollisions();

        addCovidVirus();
        showSprites();

        lastLoopRun = new Date().getTime();
    }
    setTimeout('gameLoop();',2);
};

//move the main character
document.onkeydown = (key) =>{
    keys(key.keyCode, true);
};

document.onkeyup = (key) =>{
    keys(key.keyCode, false);
};

let hero = createSprite('mainCharacter', 250, 460, 30, 30);
let bullet = createSprite('bullet', 0, -120, 2, 40);

gameLoop();