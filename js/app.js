const modal = document.querySelector(".modal");
const startGame = document.querySelector("#start-game-btn");
const rulesGame = document.querySelector("#rules-game-btn");
const instruction = document.querySelector("#instructions");
const okButton = document.querySelector("#ok-game-btn");
const newGame = document.querySelector("#new-game");
const showSolution = document.querySelector("#show-solution");
const showHint = document.querySelector("#show-hint");
const questions = document.querySelector("#question");
const answer = document.querySelector("#answer");
const writeHint = document.querySelector("#text");
const points = document.querySelector("#points");
const level = document.querySelector("#levels");
const endModal = document.querySelector("#end-of-game");

let pointsCounter = 0;
let levelsCounter = 1;
let anagram;
let anagramData = [];
let storedTasks = [];
let check = false;
let isAnswered = false
let isAnsweredOnce = true;
let index = 0;
let removeIndex = 0;

function loadData() {
    fetch('./anagram.json')
        .then(response => {
            if (!response.ok) {
                throw new Error("photos.json not found");
            }
            return response.json();
        })
        .then(json => {
            let jsonData = json.anagrams;

            jsonData.forEach((data) => {
                let tempAnagramData = [];
                tempAnagramData.push(data.question);
                tempAnagramData.push(data.answer);
                tempAnagramData.push(data.hint);
                anagramData.push(tempAnagramData);
            })
        })
}

function checkEndOfGame(){
    if (levelsCounter === 11){
        endModal.style.display = "flex";
        endModal.style.top = "20%"
        endModal.innerHTML = `
        <h1>YOUR SCORE</h1>
        <p style="font-size: xx-large">Points: ${pointsCounter}</p>
        <button class="restart" id="restart-game-btn" type="button">Restart <br>Game</button>
        `
        const restartGame = document.querySelector("#restart-game-btn");
        restartGame.addEventListener("click", (event) => {
            event.preventDefault();
            endModal.style.display = "none";
            modal.style.display = "none";
            pointsCounter = 0;
            levelsCounter = 1;
            level.innerText = "";
            points.innerText = "Points: 0";
            localStorage.clear();
            writeHint.innerText = "To start solving game, click on LEVEL 1. Good luck!";
            questions.innerHTML = "";
            answer.innerHTML = "";
            startGame.innerText = "START \n" + "GAME";
            newGame.innerText = "LEVEL 1";
            document.getElementById("welcome-page").style.display = "flex";
        })
    }
}

function getLocalStorage() {

    if (localStorage.getItem('Points') != null) {
        pointsCounter = parseInt(localStorage.getItem('Points'))

    }
    else {
        pointsCounter = 0;
        localStorage.setItem('Points', 0)
    }

    if (localStorage.getItem('level') != null) {
        levelsCounter = parseInt(localStorage.getItem('level'))
        writeHint.innerText = `Continue click on LEVEL ${levelsCounter}`
        checkEndOfGame();
        if (levelsCounter === 11){
            let temp = levelsCounter;
            level.innerText = `${temp - 1}/10`
            newGame.innerText = "LEVEL 10"
            writeHint.innerText = `You have finished the game.`
        }
    }
    else {
        levelsCounters = 1;
        localStorage.setItem('level', 1)
    }

    if (localStorage.getItem('anagrams') != null) {

        let anagramItem = JSON.parse(localStorage.getItem("anagrams")) || [];

        for (let item of anagramItem){
            console.log(item)
            console.log(anagramData)
            removeIndex = anagramData.indexOf(item);
            console.log(removeIndex)

            if (removeIndex > -1) {
                console.log("deleted")
                anagramData.splice(removeIndex, 1);
                console.log(anagramData)
            }
        }

    }

}

function setLocalStorage() {
    localStorage.setItem('level', levelsCounter);
    localStorage.setItem('Points', pointsCounter);
    localStorage.setItem("anagrams", JSON.stringify(storedTasks));
}

function pickTask() {
    questions.innerHTML = "";
    answer.innerHTML = "";
    if (check === true) {
        if (index > -1) {
            anagramData.splice(index, 1);
        }
    }
    check = false;
    isAnswered = false;
    isAnsweredOnce = true;
    level.innerText = `${levelsCounter}/10`
    writeHint.innerText = "By drag and drop reorder letters (move left or right) to create a word. \n" +
        "Use HINT when you need a little help."
    anagram = anagramData[Math.floor(Math.random() * anagramData.length)];
    var randomAnagram = anagram[0].split('');
    console.log(anagram)
    index = anagramData.indexOf(anagram);
    console.log(anagramData)
    var correctAnagram = ""
    correctAnagram = anagram[1];
    var hintAnagram = anagram[2];
    randomAnagram.forEach(letter => {
        const word = document.createElement("li");
        word.innerText = letter;
        if (letter === " ") {
            word.style.backgroundColor = "#c54245";
            word.style.boxShadow = "none";
        }
        questions.appendChild(word);

        new Sortable.create(question, {
            animation: 150,
            group: 'letters',
            dataIdAttr: 'id',
            onEnd: function () {
                var guessedWord = "";
                var correctWord = "";
                var childrenQuestion = question.children;
                for (child of childrenQuestion){
                    guessedWord += child.innerText;
                }
                var childrenAnswer = answer.children;
                for (child of childrenAnswer){
                    correctWord += child.innerText;
                }
                console.log(guessedWord)
                console.log(correctWord)

                if ((guessedWord === correctWord) && !isAnswered) {
                    solution(correctWord);
                    check = true;
                    isAnswered = true;
                    levelsCounter++;
                    pointsCounter += 10;
                    let tempLevels = levelsCounter;

                    if (levelsCounter === 11) {
                        newGame.innerText = `LEVEL ${tempLevels - 1}`
                        writeHint.innerText = "Awesome you are natural talent! :D (+10 points)";
                    }
                    else {
                        newGame.innerText = `LEVEL ${levelsCounter}`
                        writeHint.innerText = `Awesome you are natural talent! :D (+10 points) \n\nContinue click on LEVEL ${levelsCounter}`;
                    }

                    points.innerText = `Points: ${pointsCounter}`;
                    storedTasks.push(anagram);
                    setLocalStorage();
                    checkEndOfGame();
                }
            }
        })
    })

    correctAnswer(correctAnagram);
    hintAnswer(hintAnagram);
}

function changeButton() {
    if ((localStorage.getItem('anagrams') != null) || (localStorage.getItem('level') != null) || (localStorage.getItem('Points') != null)){
        startGame.innerText = "BACK TO \n" + "GAME";
        newGame.innerText = `LEVEL ${localStorage.getItem('level')}`
        level.innerText = `${localStorage.getItem('level')}/10`
        points.innerText = `Points: ${localStorage.getItem('Points')}`;
    }

}

changeButton();

startGame.addEventListener("click", (event) => {
    event.preventDefault();
    modal.style.display = "flex";
    document.getElementById("welcome-page").style.display = "none";
    storedTasks = [];
    anagramData = [];
    loadData();
    getLocalStorage();
    console.log("data loaded")
})

rulesGame.addEventListener("click", () => {
    instruction.style.display = "flex";
})

okButton.addEventListener("click", () => {
    instruction.style.display = "none";
})

showSolution.addEventListener("click", () => {
    if (!isAnswered && isAnsweredOnce){
        pointsCounter -=5;
        if (pointsCounter < 0)
            pointsCounter = 0;
        levelsCounter ++;
        isAnsweredOnce = false;

        console.log(pointsCounter)
        let tempLevels = levelsCounter;

        if (levelsCounter === 11) {
            newGame.innerText = `LEVEL ${tempLevels - 1}`
            writeHint.innerText = "Never mind, next time is a charm! :( (-5 points)";
        }
        else {
            newGame.innerText = `LEVEL ${levelsCounter}`
            writeHint.innerText = `Never mind, next time is a charm! :( (-5 points) \n\nContinue click on LEVEL ${levelsCounter}`;
        }
        points.innerText = `Points: ${pointsCounter}`;

        if (index > -1) {
            anagramData.splice(index, 1);
        }

        const children = answer.children;
        for (child of children){
            child.style.display = "block"
        }

        storedTasks.push(anagram);
        setLocalStorage();
        checkEndOfGame()
    }
})

function correctAnswer(correctWord){
    solution(correctWord);

    const children = answer.children;
        for (child of children){
            child.style.display = "none"
        }
}

function hintAnswer(hintWord){
    showHint.addEventListener("click", () => {
        writeHint.innerText = hintWord;
    })
}

function solution (solvedAnagram) {
    answer.innerHTML = "";

    const correctAnagram = solvedAnagram.split('');
    correctAnagram.forEach(letter => {
        const word = document.createElement("li");
        word.innerText = letter;
        if (letter === " ") {
            word.style.backgroundColor = "#c54245";
            word.style.boxShadow = "none";
        }
        answer.appendChild(word);
    })
}

newGame.addEventListener("click", pickTask);





