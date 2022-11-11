let setTimer = new Date()

function getVariation(variation) {
    console.log()
    return puzzleData.variations[puzzleData.variations.findIndex(val => Object.keys(val)[0] === variation)][variation]
};

function test() {
    let stopTimer = new Date(); console.log((stopTimer.getTime() - setTimer.getTime())/1000 + " SECONDS");
};

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max + 1 - min)) + min;
};

function deleteFirstArrItem(array, item) {
    if (!array.includes(item)) return array;
    let index = array.indexOf(item);
    return array.slice(0, index).concat(array.slice(index + 1));
};

function filterDuplicates(arr) {
    return [...new Set(arr)]
};

function randomSort(input) {
    let arr = [...input]
    for (let i = arr.length -1; i > 0; i--) {
      let j = Math.floor(Math.random() * i);
      let k = arr[i];
      arr[i] = arr[j];
      arr[j] = k;
    }
    return arr;
};

function calcScore(inputArr, type = 1) {
    let score = [0, 0, 0, 0, 0, false, false, false]
    if (type === 2) {
        for (let i = 0, l = inputArr.length; i < l; i += 2) {
            for (let j = 0, l = inputArr[i].length; j < l; j++) {
                switch (inputArr[i].charAt(j)) {
                    case "B": score[0]++; break;
                    case "R": score[1]++; break;
                    case "G": score[2]++; break;
                    case "Y": score[3]++; break;
                    case "V": score[4]++; break;
                    case "Ʌ": score[4]++; break;
                    case "U": score[5] = true; break;
                    case "∩": score[5] = true; break;
                    case "-": score[6] = true; break;
                    case "'": score[7] = true; break;
                };
            }
        };
        return score;
    }
    for (let x of inputArr) {
        switch (x) {
            case "B": score[0]++; break;
            case "R": score[1]++; break;
            case "G": score[2]++; break;
            case "Y": score[3]++; break;
            case "V": score[4]++; break;
            case "Ʌ": score[4]++; break;
            case "U": score[5] = true; break;
            case "∩": score[5] = true; break;
            case "-": score[6] = true; break;
            case "'": score[7] = true; break;
        };
    };
    return score;
};

function translateName(input) {
    switch (input) {
        case "B": return "blue";
        case "R": return "red";
        case "G": return "green";
        case "Y": return "yellow";
        case "U": return "union";
        case "∩": return "intersect";
        case "-": return "subtract";
        case "'": return "not";
        case "V": return "universe";
        case "Ʌ": return "empty-set";
        case "blue": return "B";
        case "red": return "R";
        case "green": return "G";
        case "yellow": return "Y";
        case "union": return "U";
        case "intersect": return "∩";
        case "subtract": return "-";
        case "not": return "'";
        case "universe": return "V";
        case "empty-set": return "Ʌ";
    }
}

let puzzleParamaters = 
{
    'randomize': 
        false,
    'setCubes': 
        [   
            ["R", "G", "G", "V", "Y", "B"],
            [1, 3, 5],
            ["'", "-", "-", "-"],
            ["<", "="]
        ],
    'setUniverse':
        ['RG', 'BRY', 'RGY', 'B', 'BRG', 'Y', 'BG', '', 'BRGY', 'G', 'R', 'BY', 'RY'],
    'setVariations':
        ['symmetricDifference', 'blankWild', 'wild', 'requiredCube'],
    'setVariationsLength': 
        4,
    'setGoal':
        {
            'goalArr': [5, "*", 1, "*", 2],
            'goalValues': [10],
            'goalShape': 5
        },
    'setForbidden':
        {
            'forbiddenArrLength': 0
        },
    'forceSymmetricDifference': true,
}

puzzleParamaters = {
    'randomize': undefined,
    'setCubes': undefined,
    'setUniverse': undefined,
    'setVariations': [],
    // 'setVariations':
    //     ['symmetricDifference', 'blankWild', 'wild', 'twoSolutions'],
    'setVariationsLength': 6,
    'setGoal': undefined,
    'setForbidden': undefined,
    'forceSymmetricDifference': undefined,
}

// NEW PUZZLE
function newPuzzle() {
    console.group("NEW PUZZLE")

    // RESETTING CONTAINERS
    inputValues.flatArray = {
        "setNameArr1": [],
        "setNameArr2": [],
        "restrictionArr1": [],
        "restrictionArr2": []
    };
    inputValues.wrapValue = {
        "setNameArr1": {'values':[0, 0], 'row':0},
        "setNameArr2": {'values':[0, 0], 'row':0},
        "restrictionArr1": {'values':[0, 0], 'row':0},
        "restrictionArr2": {'values':[0, 0], 'row':0}
    };
    inputValues.divNodes = {
        "setNameArr1": [],
        "setNameArr2": [],
        "restrictionArr1": [],
        "restrictionArr2": []
    };
    inputValues.blankWild = {
        "solution1": [false, false, false, false],
        "solution2": [false, false, false, false]
    };
    inputValues.wildCube = {
        "solution1": undefined,
        "solution2": undefined
    }
    restrictionContainer.innerHTML = ""
    solutionContainer.innerHTML = ""
    solutionFormToggleDiv.classList.remove('move')
    solution1Toggle.dataset.active = 'true'
    solution2Toggle.dataset.active = 'false'
    activeSolution = 'solution1'
    for (let i = 0; i < blankWildContainer.children.length; i++) {
        blankWildContainer.children[i].classList.add('wild')
    };
    forbiddenContainer.innerHTML = ""
    requiredContainer.innerHTML = ""
    resourcesContainer.innerHTML = ""
    cardsContainer.innerHTML = ""
    variationsContainer.querySelector('ul').innerHTML = ""
    for (let cell of map.querySelectorAll("td")) {
        cell.classList.remove('whitebg')
    }
    goalContainer.innerHTML = ""
    goalContainer.parentElement.classList.remove('three-rows')

    for (let x of mapArr) x.classList.remove('strike-through')
    for (let key of keyboardContainer.querySelectorAll('.wild-cube')) key.classList.remove('wild-cube')

    changeRows(restrictionContainer, inputValues.wrapValue.restrictionArr2)
    changeRows(solutionContainer, inputValues.wrapValue.setNameArr2, true)

    // GEN NEW PUZZLE

    params = Object.values(puzzleParamaters)
    console.log(params)

    const mainPuzzleWorker = new Worker('onsets_worker.js');

    if (queuedPuzzleData) {
        mainPuzzleWorker.postMessage([
            'return',
            queuedPuzzleData
        ])
    } else {
        mainPuzzleWorker.postMessage(params)
    };

    mainPuzzleWorker.onmessage = (e) => {
        puzzleData = e.data
        blankWild = puzzleData.variations.includes('blankWild')
        twoSolutions = puzzleData.variations.includes('twoSolutions')
        blankWildContainer.style.display = (blankWild) ? '' : 'none'
        solutionFormContainter.style.display = (twoSolutions) ? '' : 'none'
        console.log(puzzleData.variationsMap.get('wild'))
        if (puzzleData.variationsMap.get('wild')) {
            inputValues.wildCube.solution1 = translateName(puzzleData.variationsMap.get('wild'))
            inputValues.wildCube.solution2 = translateName(puzzleData.variationsMap.get('wild'))
            changeWildStyle(translateName(puzzleData.variationsMap.get('wild')))
            for (let key of keyboardContainer.querySelectorAll('.keyboard-cube')) {
                if (key.classList[1] === translateName(puzzleData.variationsMap.get('wild'))) key.classList.add('wild-cube')
            }
        }
        
        console.log(puzzleData);
        console.log(puzzleData.forbidden)
        for (let forbiddenCube of puzzleData.forbidden) {
            const newForbiddenCube = document.createElement("div")
            newForbiddenCube.classList.add("cube", "restraint-cube");
            switch (forbiddenCube) {
                case "B": newForbiddenCube.classList.add("blue"); break;
                case "R": newForbiddenCube.classList.add("red"); break;
                case "G": newForbiddenCube.classList.add("green"); break;
                case "Y": newForbiddenCube.classList.add("yellow"); break;
                case "V": newForbiddenCube.classList.add("universe"); break;
                case "Ʌ": newForbiddenCube.classList.add("empty-set"); break;
            };
            forbiddenContainer.append(newForbiddenCube);
        };
        let solutionScores = []

        // GOAL
        function goalAddCube(cube, row) {
            const newGoalCube = document.createElement("div")
            if (cube < 0) newGoalCube.classList.add('upsidedown')
            newGoalCube.innerText = Math.abs(cube);
            newGoalCube.classList.add("cube", "goal-cube")
            goalContainer.children[row].append(newGoalCube)
        }

        console.log(puzzleData.goalShape)
        let goalRow = document.createElement('div')
        goalRow.classList.add('goal-row')
        // puzzleData.goalShape = 5;
        switch (puzzleData.goalShape) {
            case 1:
                goalContainer.append(goalRow)
                goalAddCube(puzzleData.goal[0], 0)
                break;
            case 2:
                goalContainer.append(goalRow)
                goalAddCube(puzzleData.goal[0], 0)
                goalAddCube(puzzleData.goal[2], 0)
                break;
            case 3:
                goalContainer.append(goalRow)
                goalAddCube(puzzleData.goal[0], 0)
                goalAddCube(puzzleData.goal[2], 0)
                goalAddCube(puzzleData.goal[4], 0)
                break;
            case 4:
                goalContainer.append(goalRow)
                goalContainer.append(goalRow.cloneNode())
                goalAddCube(puzzleData.goal[0], 1)
                goalAddCube(puzzleData.goal[2], 0)
                break;
            case 5:
                goalContainer.parentElement.classList.add('three-rows')
                // goalContainer.classList.add('three-rows')
                goalContainer.append(goalRow)
                goalContainer.append(goalRow.cloneNode())
                goalContainer.append(goalRow.cloneNode())
                goalAddCube(puzzleData.goal[0], 0)
                goalAddCube(puzzleData.goal[2], 1)
                goalAddCube(puzzleData.goal[4], 2)
                break;
            case 6:
                goalContainer.append(goalRow)
                goalContainer.append(goalRow.cloneNode())
                goalAddCube(puzzleData.goal[0], 0)
                goalAddCube(puzzleData.goal[2], 1)
                goalAddCube(puzzleData.goal[4], 1)
                break;
            case 7:
                console.log("D")
                goalContainer.append(goalRow)
                goalContainer.append(goalRow.cloneNode())
                goalContainer.children[0].classList.add('align-left')
                goalAddCube(puzzleData.goal[0], 0)
                goalAddCube(puzzleData.goal[2], 1)
                goalAddCube(puzzleData.goal[4], 1)
                break;
        }

        // REQUIRED
        if (puzzleData.variations.includes("twoSolutions")) {
            console.log(puzzleData.solution)
            for (let currSolution of puzzleData.solution) {
                if (currSolution.restriction) solutionScores.push(calcScore(currSolution.restriction, 2))
                solutionScores.push(calcScore(currSolution.flag))
            }
        } else {
            if (puzzleData.solution.restriction) solutionScores.push(calcScore(puzzleData.solution.restriction, 2))
            solutionScores.push(calcScore(puzzleData.solution.flag));
        }
        let highStandard = solutionScores.shift()
        for (let score of solutionScores) {
            for (let i = 0; i < score.length; i++) {
                let standardScore = highStandard[i]
                let currentScore = score[i]
                if (typeof currentScore === "number") {
                    if (currentScore < standardScore) highStandard[i] = currentScore;
                } else {
                    if (!currentScore) highStandard[i] = false
                }
            }
        }
        console.log("HSTD", highStandard);
        let requiredArr = []
        let resourcesArr = puzzleData.modifiedCubes[0].concat(puzzleData.modifiedCubes[2]).concat(puzzleData.modifiedCubes[3])
        console.log(resourcesArr)

        requiredContainer.dataset.values = ""
        resourcesContainer.dataset.values = ""

        for (let i = 0; i < highStandard.length; i++) {
            const cube = {'name': undefined, 'symbol': undefined};
            switch(i) {
                case 0: cube.name = "blue"; cube.symbol = 'B'; break;
                case 1: cube.name = "red"; cube.symbol = 'R'; break;
                case 2: cube.name = "green"; cube.symbol = 'G'; break;
                case 3: cube.name = "yellow"; cube.symbol = 'Y'; break;
                case 4: cube.name = "universe"; cube.symbol = 'V'; break;
                case 5: cube.name = "union"; cube.symbol = 'U'; break;
                case 6: cube.name = "subtract"; cube.symbol = '-'; break;
                case 7: cube.name = "not"; cube.symbol = "'"; break;
            }
            if (typeof highStandard[i] === 'number') {
                for (let j = 0; j < highStandard[i]; j++) {
                    requiredContainer.dataset.values += cube.symbol
                    if (cube.symbol === 'V') {
                        cube.symbol = resourcesArr.includes("V") ? "V" : "Ʌ"
                        cube.name = resourcesArr.includes("V") ? "universe" : "empty-set"
                    }
                    requiredArr.push(cube.name);
                    resourcesArr = deleteFirstArrItem(resourcesArr, cube.symbol)
                };
            } else if (highStandard[i]) {
                requiredContainer.dataset.values += cube.symbol
                if (cube.symbol === 'U') {
                    cube.symbol = resourcesArr.includes("U") ? "U" : "∩"
                    cube.name = resourcesArr.includes("U") ? "union" : "intersect"
                }
                requiredArr.push(cube.name);
                resourcesArr = deleteFirstArrItem(resourcesArr, cube.symbol)
            };
        };
        console.log(requiredContainer.dataset.values)
        console.log(requiredArr)
        requiredArr = randomSort(requiredArr)

        for (let x of puzzleData.cubes[3].filter(val => val === '<' || val === '=')) {
            resourcesArr = deleteFirstArrItem(resourcesArr, x);
            (x === "<") ? requiredArr.push("must-contain") : requiredArr.push("equals");
        }
        let wildCubeName = undefined
        switch (puzzleData.variationsMap.get('wild')) {
            case "R": wildCubeName = 'red'; break;
            case "B": wildCubeName = 'blue'; break;
            case "G": wildCubeName = 'green'; break;
            case "Y": wildCubeName = 'yellow'; break;
            case "U": wildCubeName = 'union'; break;
            case "∩": wildCubeName = 'intersect'; break;
            case "-": wildCubeName = 'subtract'; break;
            case "'": wildCubeName = 'not'; break;
            case "V": wildCubeName = 'universe'; break;
            case "Ʌ": wildCubeName = 'empty-set'; break;
        }
        console.log(wildCubeName)
        console.log(puzzleData.variationsMap.get('wild'))
        for (let requiredCube of requiredArr) {
            const newRequiredCube = document.createElement("div")
            newRequiredCube.classList.add("cube", "restraint-cube", requiredCube);
            if (requiredCube === wildCubeName) {
                newRequiredCube.classList.add('wild-cube')
                newRequiredCube.addEventListener('click', toggleWildPicker)
            }
            requiredContainer.append(newRequiredCube);
        };
        console.log(resourcesArr)
        for (let resourceCube of resourcesArr) {
            const newResourcesCube = document.createElement("div")
            newResourcesCube.classList.add("cube", "restraint-cube");
            switch (resourceCube) {
                case "B": newResourcesCube.classList.add("blue"); break;
                case "R": newResourcesCube.classList.add("red"); break;
                case "G": newResourcesCube.classList.add("green"); break;
                case "Y": newResourcesCube.classList.add("yellow"); break;
                case "U": newResourcesCube.classList.add("union"); break;
                case "∩": newResourcesCube.classList.add("intersect"); break;
                case "-": newResourcesCube.classList.add("subtract"); break;
                case "'": newResourcesCube.classList.add("not"); break;
                case "V": newResourcesCube.classList.add("universe"); break;
                case "Ʌ": newResourcesCube.classList.add("empty-set"); break;
            };
            resourcesContainer.dataset.values += resourceCube
            if (resourceCube === puzzleData.variationsMap.get('wild')) {
                newResourcesCube.classList.add('wild-cube')
                newResourcesCube.addEventListener('click', toggleWildPicker)
            }
            resourcesContainer.append(newResourcesCube);
        }
        console.log(filterDuplicates(puzzleData.universe))

        for (let cell of mapArr) {
            if (!cell.dataset.hasStrikeThrough) {
                cell.dataset.hasStrikeThrough = true;
                cell.addEventListener('click', function() {
                    this.classList.toggle('strike-through')
                })
            }
        }

        for (let card of filterDuplicates(puzzleData.universe)) {
            switch (card) {
                case "BR": mapArr[0].classList.add('whitebg'); break;
                case "BRY": mapArr[1].classList.add('whitebg'); break;
                case "BY": mapArr[2].classList.add('whitebg'); break;
                case "B": mapArr[3].classList.add('whitebg'); break;
                case "BRG": mapArr[4].classList.add('whitebg'); break;
                case "BRGY": mapArr[5].classList.add('whitebg'); break;
                case "BGY": mapArr[6].classList.add('whitebg'); break;
                case "BG": mapArr[7].classList.add('whitebg'); break;
                case "RG": mapArr[8].classList.add('whitebg'); break;
                case "RGY": mapArr[9].classList.add('whitebg'); break;
                case "GY": mapArr[10].classList.add('whitebg'); break;
                case "G": mapArr[11].classList.add('whitebg'); break;
                case "R": mapArr[12].classList.add('whitebg'); break;
                case "RY": mapArr[13].classList.add('whitebg'); break;
                case "Y": mapArr[14].classList.add('whitebg'); break;
                case "": mapArr[15].classList.add('whitebg'); break;
            }
            const newCard = document.createElement('div');
            newCard.dataset.getCard = card
            // newCard.addEventListener("click", hideKeyboard);
            newCard.classList.add('card')
            const cardContent = document.createElement('div')
            const cardContentFront = document.createElement('div')
            const cardContentBack = document.createElement('div')
            cardContent.classList.add('card-content')
            cardContentFront.classList.add('card-content-front')
            cardContentBack.classList.add('card-content-back')
            if (/B/.test(card)) addColorChild(cardContentFront, "blue")
            if (/R/.test(card)) addColorChild(cardContentFront, "red")
            if (/G/.test(card)) addColorChild(cardContentFront, "green")
            if (/Y/.test(card)) addColorChild(cardContentFront, "yellow")
            cardContent.append(cardContentFront, cardContentBack)
            newCard.append(cardContent)
            newCard.addEventListener('click', function(){this.classList.toggle('flip')})
            cardsContainer.append(newCard)
        }

        console.log(variationsContainer)
        const variationsDisplay = variationsContainer.querySelector('ul')
        for (let x of puzzleData.variations) {variationsDisplay.append(document.createElement('li'))}
        for (let i = 0; i < variationsDisplay.children.length; i++) {
            let currVariation = puzzleData.variations[i]
            let variationToPush;
            if (typeof currVariation === "string") {
                switch (currVariation) {
                    case "twoOp": variationToPush = "Two Op."; break;
                    case "noNull": variationToPush = "No Null"; break;
                    case "absValue": variationToPush = "Absolute Value"; break;
                    case "blankWild": variationToPush = "Blank Wild"; break;
                    case "symmetricDifference": variationToPush = "Symmetric Difference"; break;
                    case "twoSolutions": variationToPush = "Two Solutions"; break;
                }
            } else {
                console.log(currVariation)
                switch (Object.keys(currVariation)[0]) {
                    case "requiredCube": variationToPush = "Required Cube " + currVariation.requiredCube; break;
                    case "wild": variationToPush = "Wild " + currVariation.wild; break;
                    case "double": variationToPush = "Double " + currVariation.double; break;
                    case "requiredCard": variationToPush = 'Required Card "' + currVariation.requiredCard + '"'; break;
                    case "forbiddenCard": variationToPush = 'Forbidden Card "' + currVariation.forbiddenCard + '"'; break;
                }
            }
            variationsDisplay.children[i].innerText = variationToPush;
        }
        console.log(puzzleData.variations)
        console.log(variationsDisplay)
        
        const queuePuzzleWorker = new Worker('onsets_worker.js');
        queuePuzzleWorker.postMessage(params)

        queuePuzzleWorker.onmessage = (e) => {
            queuedPuzzleData = e.data
            queuePuzzleWorker.terminate();
        }
        console.groupEnd()

        mainPuzzleWorker.terminate();
    };
};

function addColorChild(card, color) {
    const newColor = document.createElement('div')
    newColor.classList.add(color)
    card.append(newColor)
};
// HEADING 
const settingsIcon = document.querySelector('#settings-ico')
// CUBE CONTAINERS
const boardContainer = document.querySelector('#board-container')
const forbiddenContainer = document.querySelector('#forbidden-container');
const requiredContainer = document.querySelector('#required-container');
const resourcesContainer = document.querySelector('#resources-container');
const solutionContainer = document.querySelector('#solution-container');
const restrictionContainer = document.querySelector('#restriction-container');
const goalContainer = document.querySelector('#goal-container');
// MISC PUZZLE CONTAINERS
const cardsContainer = document.querySelector('#cards-container');
const variationsContainer = document.querySelector('#variations-container')
const map = document.querySelector('#map')
const blankWildContainer = document.querySelector('#blank-wild-container')
const submitButton = document.querySelector('#submit-button');
const mapArr = map.querySelectorAll("td")
// TWO SOLUTIONS TOGGLE
const solutionFormContainter = document.querySelector('#solution-form-container')
const solution1Toggle = document.querySelector('#solution1-toggle')
const solution2Toggle = document.querySelector('#solution2-toggle')
const solutionFormToggleDiv = document.querySelector('#solution-form-toggle-div')
// KEYBOARD
const keyboardContainer = document.querySelector('#keyboard-container');
const keyboardButtons = document.querySelectorAll(".keyboard-row > div")

const inputValues = {
    "flatArray": {
        "setNameArr1": [],
        "setNameArr2": [],
        "restrictionArr1": [],
        "restrictionArr2": []
    },
    "wrapValue": {
        "setNameArr1": {'values':[0, 0], 'row':0},
        "setNameArr2": {'values':[0, 0], 'row':0},
        "restrictionArr1": {'values':[0, 0], 'row':0},
        "restrictionArr2": {'values':[0, 0], 'row':0}
    },
    "divNodes": {
        "setNameArr1": [],
        "setNameArr2": [],
        "restrictionArr1": [],
        "restrictionArr2": []
    },
    "blankWild": {
        "solution1": [false, false, false, false],
        "solution2": [false, false, false, false]
    },
    "wildCube": {
        "solution1": undefined,
        "solution2": undefined
    }
};
let activeSolution = 'solution1';
let keyboardActive = false;
let currInput;

let blankWild
let twoSolutions

let puzzleData;
let queuedPuzzleData
newPuzzle();
let stopTimer = new Date(); console.log((stopTimer.getTime() - setTimer.getTime())/1000 + " SECONDS");
console.log(' > DONE')

keyboardContainer.addEventListener('click', function(e) {e.stopPropagation()})
blankWildContainer.addEventListener('click', (e) => {
    if (e.target.classList.value.includes('card')) return;
    e.target.classList.toggle('wild')
    let index;
    switch (e.target.classList[0]) {
        case "blue": index = 0; break;
        case "red": index = 1; break;
        case "green": index = 2; break;
        case "yellow": index = 3; break;
    }
    if (activeSolution === 'solution1') {
        inputValues.blankWild.solution1[index] = !inputValues.blankWild.solution1[index]
    } else {
        inputValues.blankWild.solution2[index] = !inputValues.blankWild.solution2[index]
    };
})

solutionFormContainter.addEventListener('click', toggleSolution)

// TOGGLE SOLUTION
function toggleSolution(e) {
    if (e.target.dataset.active === 'true') return;
    solutionFormToggleDiv.classList.toggle('move')
    if (solutionFormToggleDiv.classList.contains('move')) {    // CLICKED ON SECOND TOGGLE
        solution1Toggle.dataset.active = 'false'
        solution2Toggle.dataset.active = 'true'
        activeSolution = 'solution2'
        inputValues.divNodes.restrictionArr1 = []
        inputValues.divNodes.setNameArr1 = []
        for (let node of restrictionContainer.children) inputValues.divNodes.restrictionArr1.push(node.cloneNode())
        for (let node of solutionContainer.children) inputValues.divNodes.setNameArr1.push(node.cloneNode())
        restrictionContainer.innerHTML = ""
        solutionContainer.innerHTML = ""
        for (let node of inputValues.divNodes.restrictionArr2) restrictionContainer.append(node)
        for (let node of inputValues.divNodes.setNameArr2) solutionContainer.append(node)
        for (let node of restrictionContainer.children) if (node.classList.contains('wild-cube')) node.addEventListener('click', toggleWildPicker)
        for (let node of solutionContainer.children) if (node.classList.contains('wild-cube')) node.addEventListener('click', toggleWildPicker)
        changeWildStyle(inputValues.wildCube.solution2)
        if (blankWild) {
            for (let i = 0; i < blankWildContainer.children.length; i++) {
                if (inputValues.blankWild.solution2[i]) {
                    blankWildContainer.children[i].classList.remove('wild')
                } else {
                    blankWildContainer.children[i].classList.add('wild')
                }
            }
        }
        if (inputValues.wrapValue.restrictionArr2.row !== inputValues.wrapValue.restrictionArr1.row
        && inputValues.wrapValue.setNameArr2.row !== inputValues.wrapValue.setNameArr1.row) {
            changeRows(restrictionContainer, inputValues.wrapValue.restrictionArr2)
            changeRows(solutionContainer, inputValues.wrapValue.setNameArr2, true)
        } else if (inputValues.wrapValue.restrictionArr2.row !== inputValues.wrapValue.restrictionArr1.row) {
            changeRows(restrictionContainer, inputValues.wrapValue.restrictionArr2)
        } else if (inputValues.wrapValue.setNameArr2.row !== inputValues.wrapValue.setNameArr1.row) {
            changeRows(solutionContainer, inputValues.wrapValue.setNameArr2)
        }
    } else {    // CLICKED ON FIRST TOGGLE
        solution1Toggle.dataset.active = 'true'
        solution2Toggle.dataset.active = 'false'
        activeSolution = 'solution1'
        inputValues.divNodes.restrictionArr2 = []
        inputValues.divNodes.setNameArr2 = []
        for (let node of restrictionContainer.children) inputValues.divNodes.restrictionArr2.push(node.cloneNode())
        for (let node of solutionContainer.children) inputValues.divNodes.setNameArr2.push(node.cloneNode())
        restrictionContainer.innerHTML = ""
        solutionContainer.innerHTML = ""
        for (let node of inputValues.divNodes.restrictionArr1) restrictionContainer.append(node)
        for (let node of inputValues.divNodes.setNameArr1) solutionContainer.append(node)
        for (let node of restrictionContainer.children) if (node.classList.contains('wild-cube')) node.addEventListener('click', toggleWildPicker)
        for (let node of solutionContainer.children) if (node.classList.contains('wild-cube')) node.addEventListener('click', toggleWildPicker)
        changeWildStyle(inputValues.wildCube.solution1)
        if (blankWild) {
            for (let i = 0; i < blankWildContainer.children.length; i++) {
                if (inputValues.blankWild.solution1[i]) {
                    blankWildContainer.children[i].classList.remove('wild')
                } else {
                    blankWildContainer.children[i].classList.add('wild')
                };
            };
        };
        if (inputValues.wrapValue.restrictionArr1.row !== inputValues.wrapValue.restrictionArr2.row &&
        inputValues.wrapValue.setNameArr1.row !== inputValues.wrapValue.setNameArr2.row) {
            changeRows(restrictionContainer, inputValues.wrapValue.restrictionArr1)
            changeRows(solutionContainer, inputValues.wrapValue.setNameArr1, true)
        } else if (inputValues.wrapValue.restrictionArr1.row !== inputValues.wrapValue.restrictionArr2.row) {
            changeRows(restrictionContainer, inputValues.wrapValue.restrictionArr1)
        } else if (inputValues.wrapValue.setNameArr1.row !== inputValues.wrapValue.setNameArr2.row) {
            changeRows(solutionContainer, inputValues.wrapValue.setNameArr1)
        }
    };
}

submitButton.addEventListener('click', submitInput);
restrictionContainer.addEventListener('click', showKeyboard);
solutionContainer.addEventListener('click', showKeyboard);
const newAnswer = document.createElement('div')
const answerBackground = document.createElement('div')
newAnswer.id = 'new-answer'
answerBackground.id = 'answer-background'
document.body.append(answerBackground)
document.body.append(newAnswer)
answerBackground.addEventListener('click', function(){
    newAnswer.classList.remove('shown')
    answerBackground.classList.remove('shown')
})

document.addEventListener('keydown', function(keypress){
    // console.log(keypress.key);
    if (!currInput) return;
    switch (keypress.key) {
        case 'b': inputCube('blue'); break;
        case 'r': inputCube('red'); break;
        case 'g': inputCube('green'); break;
        case 'y': inputCube('yellow'); break;
        case 'u': inputCube('union'); break;
        case 'n': inputCube('intersect'); break;
        case '-': inputCube('subtract'); break;
        case "'": inputCube('not'); break;
        case 'v': inputCube('universe'); break;
        case 'm': inputCube('empty-set'); break;
        case '<': inputCube('must-contain'); break;
        case '=': inputCube('equals'); break;
        case '(': inputCube('left-parenthesis'); break;
        case ')': inputCube('right-parenthesis'); break;
        case 'Backspace': inputCube('backspace'); break;
    };
});

function inputCube(cube) {
    if (wildPickerContainer.classList.contains('shown')) return;
    let input, flatArray, wrap;
    let isRestriction = false;
    switch (currInput) {
        case "restriction1":
            input = restrictionContainer;
            flatArray = inputValues.flatArray.restrictionArr1;
            wrap = inputValues.wrapValue.restrictionArr1;
            isRestriction = true;
            break;
        case "setName1":
            input = solutionContainer;
            flatArray = inputValues.flatArray.setNameArr1;
            wrap = inputValues.wrapValue.setNameArr1
            break;
        case "restriction2":
            input = restrictionContainer;
            flatArray = inputValues.flatArray.restrictionArr2;
            wrap = inputValues.wrapValue.restrictionArr2;
            isRestriction = true;
            break;
        case "setName2":
            input = solutionContainer;
            flatArray = inputValues.flatArray.setNameArr2;
            wrap = inputValues.wrapValue.setNameArr2;
            break;
    };
    let currCube;
    switch (cube) {
        case "blue": currCube = "B"; break;
        case "red": currCube = "R"; break;
        case "green": currCube = "G"; break;
        case "yellow": currCube = "Y"; break;
        case "union": currCube = "U"; break;
        case "intersect": currCube = "∩"; break;
        case "subtract": currCube = "-"; break;
        case "not": currCube = "'"; break;
        case "universe": currCube = "V"; break;
        case "empty-set": currCube = "Ʌ"; break;
        case "must-contain": 
            if (!isRestriction) return;
            currCube = "<"; break;
        case "equals":
            if (!isRestriction) return;
            currCube = "="; break;
        case "left-parenthesis": currCube = "("; break;
        case "right-parenthesis": currCube = ")"; break;
        case "backspace":
            let cubeWidth = 48;
                if (!flatArray.length) return;
                if (/[()]/.test(flatArray.pop())) cubeWidth = 16;
            wrap.values[wrap.row] -= cubeWidth;
            checkInputWidth(input, wrap, 0)
            input.lastElementChild.remove()
            return;
    };
    const solutionCube = document.createElement("div");
    solutionCube.classList.add(cube);
    let cubeWidth = 16;
    if (!/[()]/.test(currCube)) {
        cubeWidth = 48
        solutionCube.classList.add("cube", "solution-cube");
    }
    if (currCube === puzzleData.variationsMap.get('wild')) {
        solutionCube.classList.add('wild-cube')
        solutionCube.addEventListener('click', toggleWildPicker)
    }
    if (checkInputWidth(input, wrap, cubeWidth)) {
        flatArray.push(currCube)
        input.append(solutionCube);
    }
};
// const testDiv = document.createElement('div')
// testDiv.style.cssText = 'height: 50px; width: 50px; background-color: red; position: absolute; left: 40px; top: 50px'
// const testDiv2 = document.createElement('div')
// testDiv2.style.cssText = 'height: 50px; width: 50px; background-color: red; position: absolute; left: 100px; top: 50px'
// testDiv.addEventListener('click', () => {notify('Incorrect!', 'green', 'bounce', undefined, undefined, undefined, 1)})
// testDiv2.addEventListener('click', () => {notify('Incorrect!', 'green', 'bounce', undefined, undefined, undefined, 2)})
// document.body.append(testDiv, testDiv2)
const notification = document.createElement('div')
notification.classList.add('notification')
// const notificationText = document.createElement('p')
// notification.append(notificationText)

function notify(message, color, animation, duration = 1500, height, width, extraContent) {
    notification.getAnimations().forEach(val => val.cancel())
    notification.innerText = message
    switch (color) {
        case 'red': notification.style.backgroundColor = 'rgb(204, 65, 60)'; break;
        case 'green': notification.style.backgroundColor = 'rgb(51, 186, 65)'; break;
    }
    notification.style.height = height
    notification.style.width = width
    document.body.append(notification)
    if (animation === 'bounce') {
        notification.animate(
            [
            {top: 0, opacity: 0, easing: 'ease',},
            {top: 72 + 'px', opacity: 1, offset: 0.4, easing: 'ease',},
            {top: 68 + 'px', opacity: 1, offset: 0.8, easing: 'ease',},
            {top: 70 + 'px', opacity: 1, easing: 'ease',}
            ], {
            fill: "forwards",
            duration: 350,
        });
    }
    // if (extraContent) {
    //     console.log(extraContent)
    //     const newContent = document.createElement(extraContent.type)
    //     newContent.style.marginLeft = '5px'
    //     // newContent.style.width = '0px'
    //     newContent.classList.add('extra-content')
    //     newContent.innerText = extraContent.content
    //     notification.append(newContent)
    // } else {

    // };
    if (duration === 'persistent') return;
    notification.animate(
        [
        {top: 0, opacity: 1, easing: 'ease',},
        {top: 72 + 'px', opacity: 1, offset: 0.4, easing: 'ease',}
        ], {
        fill: "forwards",
        duration: 300,
        direction: 'reverse',
        delay: duration,
    });
}
// notify('Incorrect!', 'red', 'bounce', 'persistent', undefined, '170px', {
//     'type': 'div',
//     'content': 'See Why',
//     'event' : {
//     }
// })

function changeRows(element, wrap, dontAnimateBoard) {
    let elementHeight, parentHeight, boardHeight;
    let totalRows
    if (activeSolution === 'solution1') {
        totalRows = inputValues.wrapValue.setNameArr1.row + inputValues.wrapValue.restrictionArr1.row
    } else {
        totalRows = inputValues.wrapValue.setNameArr2.row + inputValues.wrapValue.restrictionArr2.row
    }
    elementHeight = 52 + 48 * wrap.row + "px"
    parentHeight = 90 + 48 * wrap.row + "px"
    boardHeight = 540 + 48 * totalRows + "px"
    element.animate(
        [{height: elementHeight}], {
            fill: 'forwards',
            duration: 100,
            easing: 'ease',
    });
    element.parentNode.animate(
        [{height: parentHeight}], {
            fill: 'forwards',
            duration: 100,
            easing: 'ease',
    });
    if (dontAnimateBoard) return;
    boardContainer.animate(
        [{height: boardHeight}], {
            fill: 'forwards',
            duration: 100,
            easing: 'ease',
    });
}

function checkInputWidth(input, wrap, cubeWidth) {
    if (wrap.row === 1 && wrap.values[1] === 0 && boardContainer.offsetHeight > 540) {
        wrap.row--
        changeRows(input, wrap)
    } else if (wrap.values[wrap.row] + cubeWidth >= input.offsetWidth) {
        if (wrap.row === 0) {
            wrap.row++
            changeRows(input, wrap)
        } else {
            if (input === restrictionContainer) {
                notify(`Restriction is too big!`, 'red', 'bounce', 1000, '40px', '190px')
            } else {
                notify(`Solution is too big!`, 'red', 'bounce', 1000, '40px', '170px')
            };
            return false;
        }
    }
    wrap.values[wrap.row] += cubeWidth
    return true;
}

document.addEventListener('click', hideKeyboard);

function hideKeyboard() {
    currInput = undefined;
    keyboardContainer.classList.add("hidden")
}

function showKeyboard(e) {
    e.stopPropagation();
    (e.target.id) ? currInput = e.target.id : currInput = e.target.parentNode.id;
    console.log()
    if (((e.target.id) ? e.target.id : e.target.parentNode.id) === 'restriction-container') {
        if (activeSolution === 'solution1') {
            currInput = 'restriction1'
        } else {
            currInput = 'restriction2'
        }
    } else {
        if (activeSolution === 'solution1') {
            currInput = 'setName1'
        } else {
            currInput = 'setName2'
        }
    };
    keyboardContainer.classList.remove("hidden")
};

function submitInput() {
    try {
        console.log(puzzleData)
        let universe = puzzleData.universe
        let setNameArr1 = [...inputValues.flatArray.setNameArr1].join("");
        let setNameArr2 = [...inputValues.flatArray.setNameArr2].join("");
        let restrictionArr1 = [...inputValues.flatArray.restrictionArr1].join("");
        let restrictionArr2 = [...inputValues.flatArray.restrictionArr2].join("");
        let calcSymmetricDifference = true;

        if (!setNameArr1.length) {
            notify('Input a Solution!', 'red', 'bounce', 1000, '', '160px'); 
            console.log('NO SOLUTION 1'); return;
        } else if (!restrictionArr1.length) {
            notify('Input a Restriction!', 'red', 'bounce', 1000, '', '170px');
            console.log('NO RESTRICTION 1'); return;
        } else if (twoSolutions && !setNameArr2.length) {
            notify('Input a Solution!', 'red', 'bounce', 1000, '', '160px');
            console.log('NO SOLUTION 2'); return;
        } else if (twoSolutions && !restrictionArr2.length) {
            notify('Input a Restriction!', 'red', 'bounce', 1000, '', '170px');
            console.log('NO RESTRICTION 2'); return;
        }
        
        if (!/[<=]/.test(restrictionArr1) || (!/[<=]/.test(restrictionArr2) && twoSolutions)) {
            notify('Invalid Restriction!', 'red', 'bounce', 1000, '', '160px');
            console.log('Restriction has no restriction'); return;
        }

        for (let i = 1; i <= 4; i++) {
            let input
            switch (i) {
                case 1: input = restrictionArr1; break;
                case 2: input = setNameArr1; break;
                case 3: input = restrictionArr2; break;
                case 4: input = setNameArr2; break;
            };
            let leftParenthesis = (input.match(/\(/g) || []).length
            let rightParenthesis = (input.match(/\)/g) || []).length
            if (leftParenthesis !== rightParenthesis) {
                console.log(i)
                notify('Invalid Input, Check Parenthesis!', 'red', 'bounce', 1600, '', '270px')
                console.log('Mistmatched Parenthesis'); return;
            };
        };
        
        console.group("SUBMITTING INPUT:")
        function translateBRGY(val) {
            switch (val) {
                case "B": return universe.filter(val => /B/.test(val));
                case "R": return universe.filter(val => /R/.test(val));
                case "G": return universe.filter(val => /G/.test(val));
                case "Y": return universe.filter(val => /Y/.test(val));
                case "V": return universe;
                case "Ʌ": return [];
                default: return val;
            };
        };
        
        function setOperation(arr) {
            let val1 = translateBRGY(arr[0]);
            let val2 = translateBRGY(arr[2]);
            switch (arr[1]) {
                case "U":
                return val1.concat(val2.filter(val => !val1.includes(val)));
                case "∩":
                return val1.filter(val => val2.includes(val));
                case "-":
                if (puzzleData.variations.includes('symmetricDifference') && calcSymmetricDifference) {
                    return val1.filter(val => !val2.includes(val)).concat(val2.filter(val => !val1.includes(val)))
                } else {
                    return val1.filter(val => !val2.includes(val));
                };
            };
        };
                    
        function calcSet(arr) {
            if (arr.length === 1) {
                return translateBRGY(...arr)   
            } else if (arr.length == 3) {
                return setOperation([arr[0], arr[1], arr[2]]);
            } else if (arr.length > 3) {
                return calcSet([setOperation(arr.slice(0, 3)), arr[3], ...arr.slice(4, arr.length)])
            };
        };
        
        function parseInput(arr) {
            let index = [0];
            let returnArr = [];
            for (let i = 0; i < arr.length; i++) {
                let currPosition = returnArr
                for (let i = 0; i < index.length - 1; i++) currPosition = currPosition[index[i]]
                if (arr[i] === "(") {
                    currPosition[index[index.length - 1]] = [];
                    index.push(0)
                } else if (arr[i] === ")") {
                    index.pop()
                    currPosition = returnArr;
                    for (let i = 0; i < index.length - 1; i++) currPosition = currPosition[index[i]]
                    currPosition[index[index.length - 1]] = calcSet(currPosition[index[index.length - 1]])
                    index[index.length - 1]++
                } else if (arr[i] === "'") {
                    let previousSetNot = universe.filter(val => !translateBRGY(currPosition[index[index.length - 1] - 1]).includes(val))
                    currPosition[index[index.length - 1] - 1] = previousSetNot;
                } else {
                    currPosition[index[index.length - 1]] = arr[i];
                    index[index.length - 1]++
                };
            };
            return calcSet(returnArr);
        };
        
        // PARSING INPUTS
        let solutionSet1 = [];
        let solutionSet2 = [];

        let doubleIndex = puzzleData.variations.findIndex(val => Object.keys(val)[0] === 'double');
        let doubleSet = []
        if (doubleIndex !== -1) {
            universe = ["BRGY","BRG","BRY","BR","BGY","BG","BY","B","RGY","RG","RY","R","GY","G","Y",""];
            let doubleIndex = puzzleData.variations.findIndex(val => Object.keys(val)[0] === 'double')
            let symmetricDifferenceIndex = puzzleData.variations.indexOf('symmetricDifference')
            console.log(doubleIndex)
            console.log(symmetricDifferenceIndex)
            if (doubleIndex < symmetricDifferenceIndex) calcSymmetricDifference = false;
            doubleSet = parseInput(puzzleData.variations[doubleIndex].double.split(""))
            universe = puzzleData.universe
            if (doubleIndex < symmetricDifferenceIndex) calcSymmetricDifference = true;
        }

        console.log(universe)
        console.log(doubleSet)

        let nullRestriction = false;
        for (let i = 0; i <= (twoSolutions); i++) {
            if (blankWild) {
                while (universe.includes("")) universe = deleteFirstArrItem(universe, "")
                let newCard = ''
                let currBlankCard = i ? inputValues.blankWild.solution2 : inputValues.blankWild.solution1;
                for (let j = 0; j < currBlankCard.length; j++) {
                    if (currBlankCard[j]) {
                        switch (j) {
                            case 0: newCard += "B"; break;
                            case 1: newCard += "R"; break;
                            case 2: newCard += "G"; break;
                            case 3: newCard += "Y"; break;
                        }
                    }
                }
                universe.push(newCard)
                if (doubleSet.includes(newCard)) universe.push(newCard)
            }
            console.log(universe)
            let inputRestriction;
            let inputSetName;
            switch (i) {
                case 0:
                    inputRestriction = inputValues.flatArray.restrictionArr1;
                    inputSetName = inputValues.flatArray.setNameArr1;
                    break;
                case 1: 
                    inputRestriction = inputValues.flatArray.restrictionArr2;
                    inputSetName = inputValues.flatArray.setNameArr2;
                    break;
            }
            if (puzzleData.variationsMap.get('wild')) {
                let currWild = puzzleData.variationsMap.get('wild')
                let replacement = i ? inputValues.wildCube.solution2 : inputValues.wildCube.solution1
                inputRestriction = inputRestriction.join("").replaceAll(currWild, translateName(replacement)).split("")
                inputSetName = inputSetName.join("").replaceAll(currWild, translateName(replacement)).split("")
            }
            console.log(inputRestriction)
            console.log(inputSetName)

            let formattedRestrictionArr = [[]]
            for (let i = 0; i < inputRestriction.length; i++) {
                if (inputRestriction[i] === "<" || inputRestriction[i] === "=") {
                    formattedRestrictionArr.push(inputRestriction[i]);
                    formattedRestrictionArr.push([])
                } else {
                    formattedRestrictionArr[formattedRestrictionArr.length - 1].push(inputRestriction[i])
                }
            }
            console.log(formattedRestrictionArr)

            let parsedRestrictionArr = []
            for (let i = 0; i < formattedRestrictionArr.length; i++) {
                if (i % 2 === 1) {
                    parsedRestrictionArr.push(formattedRestrictionArr[i]);
                } else {
                    parsedRestrictionArr.push(parseInput(formattedRestrictionArr[i]));
                };
            };
            let parsedSetName = parseInput(inputSetName)
            
            console.log(parsedRestrictionArr)
            console.log(parsedSetName)
            let restrictedCards = [];
            for (let i = 0; i < (formattedRestrictionArr.length - 1) / 2; i++) {
                let operation = parsedRestrictionArr[i * 2 + 1];
                let leftVal = parsedRestrictionArr[i * 2];
                let rightVal = parsedRestrictionArr[i * 2 + 2];
                restrictedCards = restrictedCards.concat(leftVal.filter(val => !rightVal.includes(val)))
                if (operation === "=") restrictedCards = restrictedCards.concat(rightVal.filter(val => !leftVal.includes(val)))
            }
            console.log(restrictedCards)
            if (!restrictedCards.length) nullRestriction = true;
            
            if (i) {
                solutionSet2 = parsedSetName.filter(val => !restrictedCards.includes(val))
            } else {
                solutionSet1 = parsedSetName.filter(val => !restrictedCards.includes(val))
            }
        }
        console.log(solutionSet1)
        console.log(solutionSet2)
        
        // DISPLAYING ANSWER
        newAnswer.innerHTML = ''

        // HEADER
        const answerHeader = document.createElement('div')
        answerHeader.id = 'answer-header'
        const backButton = document.createElement('div')
        backButton.addEventListener('click', () => {answerBackground.click()})
        const newPuzzleButton = document.createElement('div')
        newPuzzleButton.addEventListener('click', () => {
            newPuzzle(queuedPuzzleData)
            answerBackground.click()
        })
        backButton.classList.add('answer-button')
        newPuzzleButton.classList.add('answer-button')
        backButton.innerText = 'Back'
        newPuzzleButton.innerText = 'Next'
        newPuzzleButton.style.marginLeft = 'auto'
        backButton.style.cssText = ''
        answerHeader.append(backButton)
        answerHeader.append(newPuzzleButton)
        newAnswer.append(answerHeader)
        
        // CONTENT
        const answerContent = document.createElement('div')
        answerContent.id = 'answer-content'

        // RESULT
        const inputResult = document.createElement('div')
        inputResult.id = 'input-result'

        const resultTitle = document.createElement('h2')
        const resultParagraph = document.createElement('p');

        (function checkInput() {

            resultTitle.innerText = 'Incorrect:'

            if (!puzzleData.goalValues.includes(solutionSet1.length)) {
                resultParagraph.innerText = `Solution does not evaluate to goal.`
                return;
            } else if (!puzzleData.goalValues.includes(solutionSet2.length) && twoSolutions) {
                resultParagraph.innerText = `Solution does not evaluate to goal.`
                return;
            };

            if (nullRestriction && puzzleData.variations.includes('noNull')) { // NO NULL
                resultParagraph.innerText = `NUll Restriction.`
                return;
            }

            function altCalcScore(inputArr) {
                let score = [0, 0, 0, 0, 0, 0, 0, 0]
                for (let x of inputArr) {
                    switch (x) {
                        case "B": score[0]++; break;
                        case "R": score[1]++; break;
                        case "G": score[2]++; break;
                        case "Y": score[3]++; break;
                        case "V": score[4]++; break;
                        case "Ʌ": score[4]++; break;
                        case "U": score[5]++; break;
                        case "∩": score[5]++; break;
                        case "-": score[6]++; break;
                        case "'": score[7]++; break;
                    };
                };
                return score;
            };

            if (puzzleData.variationsMap.get('requiredCube')) { // REQUIRED CUBE
                if (restrictionArr1.concat(setNameArr1).indexOf(puzzleData.variationsMap.get('requiredCube')) === -1) {
                    resultParagraph.innerText = `Solution does not contain required cube`
                    return;
                };
                if (twoSolutions) {
                    if (restrictionArr2.concat(setNameArr2).indexOf(puzzleData.variationsMap.get('requiredCube')) === -1) {
                        resultParagraph.innerText = `Solution does not contain required cube`
                        return;
                    };
                };
            };

            console.log(requiredContainer.dataset.values)
            console.log(resourcesContainer.dataset.values)
            for (let i = 1; i <= (twoSolutions ? 4 : 2); i++) {
                let currWild = (i <= 2) ? inputValues.wildCube.solution1 : inputValues.wildCube.solution2
                console.log(currWild)
                let requiredValues = requiredContainer.dataset.values
                let resourcesValues = requiredContainer.dataset.values.concat(resourcesContainer.dataset.values)
                if (puzzleData.variationsMap.get('wild')) {
                    requiredValues = requiredValues.replaceAll(puzzleData.variationsMap.get('wild'), translateName(currWild))
                    resourcesValues = resourcesValues.replaceAll(puzzleData.variationsMap.get('wild'), translateName(currWild))
                }
                let requiredScore = altCalcScore(requiredValues)
                let resourcesScore = altCalcScore(resourcesValues)
                let input
                switch (i) {
                    case 1: input = restrictionArr1; break;
                    case 2: input = setNameArr1; break;
                    case 3: input = restrictionArr2; break;
                    case 4: input = setNameArr2; break;
                };
        
                if (puzzleData.variationsMap.get('wild')) {
                    input = input.replaceAll(puzzleData.variationsMap.get('wild'), translateName(currWild))
                }
                console.log(input)
                let inputScore = altCalcScore(input)
                console.log(inputScore)
                console.log(requiredScore)
                
                for (let j = 0; j < requiredScore.length; j++) {
                    let min = requiredScore[j]
                    let max = resourcesScore[j]
                    let curr = inputScore[j]
                    if (curr < min) {
                        console.log(i)
                        resultParagraph.innerText = `Required cubes missing from Solution.`
                        return;
                    };
    
                    if (curr > max) {
                        if (j >= 5 && max !== 0) continue;
                        let extraCube;
                        switch (j) {
                            case 0: extraCube = 'Blue'; break
                            case 1: extraCube = 'Red'; break
                            case 2: extraCube = 'Green'; break
                            case 3: extraCube = 'Yellow'; break
                            case 4: 
                                let arr = []
                                if (input.includes("V")) arr.push('"Universe"')
                                if (input.includes("Ʌ")) arr.push('"Empty-Set"')
                                extraCube = arr[getRandomNumber(0, arr.length - 1)];
                                break;
                            case 5:
                                let arr2 = []
                                if (input.includes("U")) arr2.push('"Or"')
                                if (input.includes("∩")) arr2.push('"And"')
                                extraCube = arr2[getRandomNumber(0, arr2.length - 1)];
                                break;
                            case 6: extraCube = '"Minus"'
                            case 7: extraCube = '"Not"'
                        }
                        if (max === 0) {
                            resultParagraph.innerText = `Resources does not contain a ${extraCube} cube.`
                            return;
                        } else {
                            resultParagraph.innerText = `${i % 2 == 0 ? 'Set Name' : 'Restriction'} has too many ${extraCube} cubes.`
                            return;
                        };
                    };
                };
            };

        if (solutionSet1 === solutionSet2) {
            resultParagraph.innerText = `Both solutions cannot contain the same cards.`
            return;
        }

        if (puzzleData.variations.includes('requiredCard')) {
            if (!solutionSet1.includes(getVariation('requiredCard'))) {
                resultParagraph.innerText = `Solution does not contain required card.`
                return;
            };
            if (twoSolutions && !solutionSet2.includes(getVariation('requiredCard'))) {
                resultParagraph.innerText = `Solution does not contain required card.`
                return;
            };
        };
        if (puzzleData.variations.includes('forbiddenCard')) {
            if (solutionSet1.includes(getVariation('forbiddenCard')) || solutionSet2.includes(getVariation('forbiddenCard'))) {
                resultParagraph.innerText = `Solution contains forbidden card.`
                return;
            };
        };
            resultTitle.innerText = 'Correct'
            inputResult.style.backgroundColor = 'rgba(92, 255, 80, 0.518)';
        })();

        inputResult.append(resultTitle)
        inputResult.append(resultParagraph)
        answerContent.append(inputResult)

        // TITLE
        const titleNode = document.createElement('h2')
        titleNode.innerText = 'Your Solution'
        answerContent.append(titleNode)

        // TOGGLE (2 SOLUTIONS)
        
        if (twoSolutions) {
            const answerToggleContainer = document.createElement('div')
            answerToggleContainer.id = 'answer-toggle-container-1'
            answerToggleContainer.classList.add('answer-toggle-container')
            const answerLeftToggle = document.createElement('div')
            const answerRightToggle = document.createElement('div')
            answerLeftToggle.classList.add('answer-left-toggle')
            answerRightToggle.classList.add('answer-right-toggle')
            answerLeftToggle.innerText = 'Solution 1'
            answerRightToggle.innerText = 'Solution 2'
            answerLeftToggle.dataset.active = 'true';
            answerRightToggle.dataset.active = 'false';
            const answerToggleDiv = document.createElement('div')
            answerToggleDiv.classList.add('answer-toggle-div')
            console.log(inputValues)
            if (solutionFormToggleDiv.classList.contains('move')) {
                inputValues.divNodes.restrictionArr2 = []
                inputValues.divNodes.setNameArr2 = []
                for (let node of restrictionContainer.children) {inputValues.divNodes.restrictionArr2.push(node.cloneNode())}
                for (let node of solutionContainer.children) {inputValues.divNodes.setNameArr2.push(node.cloneNode())}
            } else {
                inputValues.divNodes.restrictionArr1 = []
                inputValues.divNodes.setNameArr1 = []
                for (let node of restrictionContainer.children) {inputValues.divNodes.restrictionArr1.push(node.cloneNode())}
                for (let node of solutionContainer.children) {inputValues.divNodes.setNameArr1.push(node.cloneNode())}
            }
            answerToggleContainer.addEventListener('click', (e) => {
                if (e.target.dataset.active === 'true') {return}
                answerToggleDiv.classList.toggle('move')
                if (answerToggleDiv.classList.contains('move')) {    // CLICKED ON SECOND TOGGLE
                    answerLeftToggle.dataset.active = 'false'
                    answerRightToggle.dataset.active = 'true'
                    inputRestriction.innerHTML = ""
                    inputSetName.innerHTML = ""
                    for (let node of inputValues.divNodes.restrictionArr2) inputAnswerCube(inputRestriction, node, inputValues.wildCube.solution2)
                    for (let node of inputValues.divNodes.setNameArr2) inputAnswerCube(inputSetName, node, inputValues.wildCube.solution2)
                    evaluationParagraph.innerText = `Your solution evaluates to ${solutionSet2.length} cards:`
                    inputCardSet.innerHTML = ''
                    for (let node of inputCardsArr[1]) inputCardSet.append(node)
                } else {    // CLICKED ON FIRST TOGGLE
                    answerLeftToggle.dataset.active = 'true'
                    answerRightToggle.dataset.active = 'false'
                    inputRestriction.innerHTML = ""
                    inputSetName.innerHTML = ""
                    for (let node of inputValues.divNodes.restrictionArr1) inputAnswerCube(inputRestriction, node, inputValues.wildCube.solution1)
                    for (let node of inputValues.divNodes.setNameArr1) inputAnswerCube(inputSetName, node, inputValues.wildCube.solution1)
                    evaluationParagraph.innerText = `Your solution evaluates to ${solutionSet1.length} cards:`
                    inputCardSet.innerHTML = ''
                    for (let node of inputCardsArr[0]) inputCardSet.append(node)
                }
            })
            answerToggleContainer.append(answerLeftToggle, answerRightToggle, answerToggleDiv)
            answerContent.append(answerToggleContainer)
        } else {
            inputValues.divNodes.restrictionArr1 = []
            inputValues.divNodes.setNameArr1 = []
            for (let node of restrictionContainer.children) {inputValues.divNodes.restrictionArr1.push(node.cloneNode())}
            for (let node of solutionContainer.children) {inputValues.divNodes.setNameArr1.push(node.cloneNode())}
        }

        // INPUT SOLUTION
        function inputAnswerCube(input, cube, currWild, cloneNode = false) {
            cloneNode ? input.append(cube.cloneNode()) : input.append(cube)
            if (!puzzleData.variationsMap.get('wild')) return;
            const recentCube = input.lastElementChild
            if (recentCube.classList[0] === translateName(puzzleData.variationsMap.get('wild'))) {
                recentCube.classList.replace(recentCube.classList[0], currWild)
            };
        };

        const inputSolutionContainer = document.createElement('div')
        const inputRestriction = document.createElement('div')
        const inputSetName = document.createElement('div')
        const bar = document.createElement('div')
        inputSolutionContainer.classList = 'answer-solution-container'
        bar.style.cssText = 'width: 100%; height: 2px; background-color: gray; margin: 5px'
        for (let node of inputValues.divNodes.restrictionArr1) inputAnswerCube(inputRestriction, node, inputValues.wildCube.solution1, true)
        for (let node of inputValues.divNodes.setNameArr1) inputAnswerCube(inputSetName, node, inputValues.wildCube.solution1, true)
        inputSolutionContainer.append(inputRestriction)
        inputSolutionContainer.append(bar)
        inputSolutionContainer.append(inputSetName)
        answerContent.append(inputSolutionContainer)

        const evaluationParagraph = document.createElement('p')
        evaluationParagraph.innerText = `Your solution evaluates to ${solutionSet1.length} cards:`
        answerContent.append(evaluationParagraph)
        
        // INPUT CARDS
        let inputCardsArr = [[], []]
        const inputCardSet = document.createElement('div')
        inputCardSet.classList.add('card-set')
        for (let i = 0; i <= (twoSolutions); i++) {
            let solutionSet = i ? solutionSet2 : solutionSet1;
            for (let card of cardsContainer.children) {
                const newCard = card.cloneNode(true);
                newCard.classList.remove('flip')
                if (blankWild && newCard.dataset.getCard === "") {
                    let blankWildCard = i ? inputValues.blankWild.solution2 : inputValues.blankWild.solution1
                    for (let j = 0; j < blankWildCard.length; j++) {
                        if (blankWildCard[j]) {
                            switch (j) {
                                case 0:
                                    newCard.dataset.getCard += "B";
                                    addColorChild(newCard.firstChild.firstChild, 'blue');
                                    break;
                                case 1:
                                    newCard.dataset.getCard += "R";
                                    addColorChild(newCard.firstChild.firstChild, 'red');
                                    break;
                                case 2:
                                    newCard.dataset.getCard += "G";
                                    addColorChild(newCard.firstChild.firstChild, 'green');
                                    break;
                                case 3:
                                    newCard.dataset.getCard += "Y";
                                    addColorChild(newCard.firstChild.firstChild, 'yellow');
                                    break;
                            }
                        }
                    }
                    if (newCard.dataset.getCard) newCard.classList.add('blank-wild')
                }
                if (!solutionSet.includes(newCard.dataset.getCard)) newCard.classList.add('flip')
                if (doubleSet.includes(newCard.dataset.getCard)) {
                    const cardBorder = document.createElement('div')
                    cardBorder.classList.add('card-border')
                    newCard.firstChild.append(cardBorder)
                    newCard.classList.add('double')
                }
                newCard.classList.add('card');
                inputCardsArr[i].push(newCard)
            };
        };
        for (let node of inputCardsArr[0]) inputCardSet.append(node)
        answerContent.append(inputCardSet)

        // SEPARATE ANSWER
        const horizontalRule = document.createElement('hr')
        horizontalRule.style.cssText = 'width: 80%;'
        answerContent.append(horizontalRule)
        
        // DEFINED TITLE
        const titleNode2 = document.createElement('h2')
        titleNode2.innerText = 'Solution'
        answerContent.append(titleNode2)

        console.log(puzzleData)

        // DEFINED TOGGLE
        if (twoSolutions) {
            const answerToggleContainer = document.createElement('div');
            answerToggleContainer.id = 'answer-toggle-container-1'
            answerToggleContainer.classList.add('answer-toggle-container');
            const answerLeftToggle = document.createElement('div');
            const answerRightToggle = document.createElement('div');
            answerLeftToggle.classList.add('answer-left-toggle');
            answerRightToggle.classList.add('answer-right-toggle');
            answerLeftToggle.innerText = 'Solution 1'
            answerRightToggle.innerText = 'Solution 2'
            answerLeftToggle.dataset.active = 'true'
            answerRightToggle.dataset.active = 'false'
            const answerToggleDiv = document.createElement('div');
            answerToggleDiv.classList.add('answer-toggle-div');
            console.log(inputValues)
            answerToggleContainer.addEventListener('click', (e) => {
                if (e.target.dataset.active === 'true') {return}
                answerToggleDiv.classList.toggle('move')
                if (answerToggleDiv.classList.contains('move')) {    // CLICKED ON SECOND TOGGLE
                    answerLeftToggle.dataset.active = 'false'
                    answerRightToggle.dataset.active = 'true'
                    definedRestriction.innerHTML = ''
                    definedSetName.innerHTML = ''
                    for (let node of definedValueNodes[1][0]) definedRestriction.append(node);
                    for (let node of definedValueNodes[1][1]) definedSetName.append(node);
                    definedCardSet.innerHTML = ''
                    for (let node of definedCardsArr[1]) definedCardSet.append(node);
                } else {    // CLICKED ON FIRST TOGGLE
                    answerLeftToggle.dataset.active = 'true'
                    answerRightToggle.dataset.active = 'false'
                    definedRestriction.innerHTML = ''
                    definedSetName.innerHTML = ''
                    for (let node of definedValueNodes[0][0]) definedRestriction.append(node);
                    for (let node of definedValueNodes[0][1]) definedSetName.append(node);
                    definedCardSet.innerHTML = ''
                    for (let node of definedCardsArr[0]) definedCardSet.append(node);
                };
            });
            answerToggleContainer.append(answerLeftToggle, answerRightToggle, answerToggleDiv);
            answerContent.append(answerToggleContainer);
        };

        // DEFINED SOLUTION
        const defindSolutionContainer = document.createElement('div')
        const definedRestriction = document.createElement('div')
        const definedSetName = document.createElement('div')
        defindSolutionContainer.classList.add('answer-solution-container')

        const definedValueNodes = [[[], []], [[], []]]

        for (let i = 0; i <= twoSolutions; i++) {
            for (let j = 0; j < 2; j++) {
                let currIterable;
                if (twoSolutions) {
                    if (j) {
                        currIterable = puzzleData.solution[i].flag;
                    } else {
                        currIterable = puzzleData.solution[i].restriction.join("");
                    };
                } else {
                    if (j) {
                        currIterable = puzzleData.solution.flag;
                    } else {
                        currIterable = puzzleData.solution.restriction.join("");
                    };
                }

                for (let k = 0; k < currIterable.length; k++) {
                    const solutionCube = document.createElement("div");
                    if (!(currIterable[k] === "(" || currIterable[k] === ")")) {
                        solutionCube.classList.add("cube", "solution-cube");
                    };
                    switch (currIterable[k]) {
                        case 'B': solutionCube.classList.add('blue'); break;
                        case 'R': solutionCube.classList.add('red'); break;
                        case 'G': solutionCube.classList.add('green'); break;
                        case 'Y': solutionCube.classList.add('yellow'); break;
                        case 'U': solutionCube.classList.add('union'); break;
                        case '∩': solutionCube.classList.add('intersect'); break;
                        case '-': solutionCube.classList.add('subtract'); break;
                        case "'": solutionCube.classList.add('not'); break;
                        case 'V': solutionCube.classList.add('universe'); break;
                        case 'Ʌ': solutionCube.classList.add('empty-set'); break;
                        case '<': solutionCube.classList.add('must-contain'); break;
                        case '=': solutionCube.classList.add('equals'); break;
                        case '(': solutionCube.classList.add('left-parenthesis', 'black'); break;
                        case ')': solutionCube.classList.add('right-parenthesis', 'black'); break;
                    };
                    definedValueNodes[i][j].push(solutionCube);
                }
            }
        }
        for (let node of definedValueNodes[0][0]) definedRestriction.append(node);
        for (let node of definedValueNodes[0][1]) definedSetName.append(node);
        defindSolutionContainer.append(definedRestriction, bar.cloneNode(), definedSetName)
        answerContent.append(defindSolutionContainer)
        
        // DEFINED CARDS
        const definedCardSet = document.createElement('div')
        definedCardSet.classList.add('card-set')
        let definedCardsArr = [[], []]
        console.log(twoSolutions)
        for (let i = 0; i <= (twoSolutions); i++) {
            let solutionSet = twoSolutions ? puzzleData.solution[i].cards : puzzleData.solution.cards
            i ? puzzleData.solution[1] : puzzleData.solution[0]
            for (let card of cardsContainer.children) {
                const newCard = card.cloneNode(true);
                newCard.classList.remove('flip')
                let blankWildCard = twoSolutions ? puzzleData.solution[i].blankCard : puzzleData.solution.blankCard;
                if (blankWild && newCard.dataset.getCard === "" && blankWildCard) {
                    newCard.dataset.getCard = blankWildCard;
                    for (let i = 0; i < blankWildCard.length; i++) {
                        switch (blankWildCard.charAt(i)) {
                            case "B": addColorChild(newCard.firstChild.firstChild, 'blue'); break;
                            case "R": addColorChild(newCard.firstChild.firstChild, 'red'); break;
                            case "G": addColorChild(newCard.firstChild.firstChild, 'green'); break;
                            case "Y": addColorChild(newCard.firstChild.firstChild, 'yellow'); break;
                        };
                    };
                    newCard.classList.add('blank-wild')
                };
                if (!solutionSet.includes(newCard.dataset.getCard)) newCard.classList.add('flip')
                if (doubleSet.includes(newCard.dataset.getCard)) {
                    const cardBorder = document.createElement('div')
                    cardBorder.classList.add('card-border')
                    newCard.firstChild.append(cardBorder)
                    newCard.classList.add('double')
                }
                newCard.classList.add('card');
                definedCardsArr[i].push(newCard)
            };
        };
        for (let node of definedCardsArr[0]) definedCardSet.append(node)
        answerContent.append(definedCardSet)

        newAnswer.append(answerContent)
    
        answerBackground.classList.toggle('shown')
        newAnswer.classList.toggle('shown')
    } catch (error) {
        console.log(error)
        notify('Invalid input!', 'red', 'bounce', 1500, '', '')
    }
    console.groupEnd()
}
for (let button of keyboardButtons) button.addEventListener('click', function() {inputCube(this.classList[1])});

const mapArrowBox = document.querySelector('#map-arrow-box')
const variationsArrowBox = document.querySelector('#variations-arrow-box')
mapArrowBox.addEventListener('click', function() {
    this.parentElement.classList.toggle('shown')
})
variationsArrowBox.addEventListener('click', function() {
    this.parentElement.classList.toggle('shown')
})
let genNewPuzzle = false;
const settingsContainer = document.querySelector('#settings-container')
const menuBackground = document.createElement('div')
const header = document.querySelector('header')
menuBackground.id = 'menu-background'
menuBackground.addEventListener('click', (e) => {
    if (wildPickerContainer.classList.contains('shown')) {
        hideWildPicker(e)
        return;
    }
    settingsContainer.classList.remove('shown')
    menuBackground.classList.remove('shown')
    header.classList.remove('dark')
    if (settingsNodesContainer.classList.contains('page-2')) {
        setTimeout(() => {
            settingsNodesContainer.classList.remove('page-2')
            settingsHeaderText.innerText = 'Settings'
        }, 150)
    }
    variationsArrowBox.parentElement.classList.remove('dark') // REMOVE
    mapArrowBox.parentElement.classList.remove('dark') // REMOVE

    if (genNewPuzzle) {
        queuedPuzzleData = undefined;
        newPuzzle()
        genNewPuzzle = false
    }
})
header.addEventListener('click', () => menuBackground.click())
document.body.append(menuBackground)

settingsIcon.addEventListener('click', (e) => {
    if (wildPickerContainer.classList.contains('shown')) {
        hideWildPicker(e)
        return;
    }
    e.stopPropagation()
    hideKeyboard()
    settingsContainer.classList.toggle('shown')
    menuBackground.classList.toggle('shown')
    header.classList.toggle('dark')
    if (!settingsContainer.classList.contains('shown') && settingsNodesContainer.classList.contains('page-2')) {
        setTimeout(() => {
            settingsNodesContainer.classList.remove('page-2')
            settingsHeaderText.innerText = 'Settings'
        }, 150)
    }
    variationsArrowBox.parentElement.classList.toggle('dark') // REMOVE
    mapArrowBox.parentElement.classList.toggle('dark') // REMOVE

    if (genNewPuzzle && !settingsContainer.classList.contains('shown')) {
        queuedPuzzleData = undefined;
        newPuzzle()
        genNewPuzzle = false
    }
});
settingsContainer.addEventListener('click', (e) => e.stopPropagation())
let headerText = 'Settings'
const settingsNodesContainer = document.querySelector('#settings-nodes-container')
const settingsHeader = document.querySelector('#settings-header')
const settingsHeaderText = document.querySelector('#settings-header h4')
const settingsNavButton = document.querySelector('#settings-nav-button')

settingsNavButton.addEventListener('click', () => {
    if (headerText === 'Settings') {
        menuBackground.click()
        return;
    }
    settingsNodesContainer.classList.remove('page-2')
    settingsHeaderText.classList.add('fade')
    settingsNavButton.classList.add('fade')
    headerText = 'Settings'
})
settingsNavButton.addEventListener('transitionend', () => {
    settingsNavButton.classList.remove('fade')
})
settingsHeaderText.addEventListener('transitionend', () => {
    settingsHeaderText.innerText = headerText;
    settingsHeaderText.classList.remove('fade')
})

function switchPage(activePage, title) {
    settingsNodesContainer.classList.add('page-2')
    settingsHeaderText.classList.add('fade')
    settingsNavButton.classList.add('fade')
    for (let node of document.querySelectorAll('.settings-page-2.active')) node.classList.remove('active')
    activePage.classList.add('active')
    headerText = title
}

const settingsCardViewButton = document.querySelector('#card-view-button')
const settingsCardViewPage = document.querySelector('#settings-card-view')
settingsCardViewButton.addEventListener('click', () => {switchPage(settingsCardViewPage, 'Card View (Testing)')})

const settingsVariationsViewButton = document.querySelector('#variations-button')
const settingsVariationsPage = document.querySelector('#settings-variations')
settingsVariationsViewButton.addEventListener('click', () => {switchPage(settingsVariationsPage, 'Variations')})



const settingsToggles = document.querySelectorAll('.settings-toggle .toggle, .settings-checkbox')
for (let toggle of settingsToggles) toggle.addEventListener('click', toggleSetting)

function toggleSetting(e) {
    // console.log(this)
    // console.log(e)
    genNewPuzzle = true;
    switch (this.dataset.type) {
        case 'force-symmetric-difference':
            this.classList.toggle('active')
            puzzleParamaters.forceSymmetricDifference = !puzzleParamaters.forceSymmetricDifference
            if (symmetricDifferenceCheck.classList.contains('active')) {
                if (!this.classList.contains('active')) {
                    symmetricDifferenceCheck.classList.remove('active')
                    puzzleParamaters.setVariations = deleteFirstArrItem(puzzleParamaters.setVariations, 'symmetricDifference')
                };
                console.log(puzzleParamaters)
                return;
            }
            if (this.classList.contains('active')) {
                if (puzzleParamaters.setVariations.length === 6) variationCount.value = parseFloat(variationCount.value) + 1
                symmetricDifferenceCheck.classList.add('active')
                puzzleParamaters.setVariations.push('symmetricDifference')
            }
            console.log(puzzleParamaters)
        break;
        case 'required-cube': forceVariation(this, 'requiredCube'); break;
        case 'wild-cube': forceVariation(this, 'wild'); break;
        case 'two-operations': forceVariation(this, 'twoOp'); break;
        // case 'shift-permitted': forceVariation(this, 'shiftPermitted'); break;
        case 'no-null': forceVariation(this, 'noNull'); break;
        case 'absolute-value': forceVariation(this, 'absValue'); break;
        case 'double-set': forceVariation(this, 'double'); break;
        case 'required-card': forceVariation(this, 'requiredCard'); break;
        case 'forbidden-card': forceVariation(this, 'forbiddenCard'); break;
        case 'blank-wild': forceVariation(this, 'blankWild'); break;
        case 'symmetric-difference': forceVariation(this, 'symmetricDifference'); break;
        case 'two-solutions': forceVariation(this, 'twoSolutions'); break;
    }
}

function forceVariation(element, variation) {
    if (element.parentElement.dataset.type === 'force-variations') {
        if (!element.classList.contains('active') && puzzleParamaters.setVariations.length >= variationCount.value) return;
        if (!element.classList.contains('active')) {
            if (variation === 'requiredCard' && forbiddenCheck.classList.contains('active')) forceVariation(forbiddenCheck, 'forbiddenCard')
            if (variation === 'forbiddenCard' && requiredCheck.classList.contains('active')) forceVariation(requiredCheck, 'requiredCard')
            puzzleParamaters.setVariations.push(variation)
        } else {
            if (element === symmetricDifferenceCheck && puzzleParamaters.forceSymmetricDifference) {
                forceSymmetricDifference.classList.remove('active')
                puzzleParamaters.forceSymmetricDifference = !puzzleParamaters.forceSymmetricDifference
            }
            puzzleParamaters.setVariations = deleteFirstArrItem(puzzleParamaters.setVariations, variation)
        }
    }
    console.log(puzzleParamaters)
    element.classList.toggle('active')
}

const variationCount = document.querySelector('#variation-count')
const settingsUpArrow = document.querySelector('#settings-nodes-container .arrow-container-up')
const settingsDownArrow = document.querySelector('#settings-nodes-container .arrow-container-down')

const forceSymmetricDifference = document.querySelector('#force-symmetric-difference')
const requiredCheck = document.querySelectorAll(".settings-checkbox")[6]
const forbiddenCheck = document.querySelectorAll(".settings-checkbox")[7]
const symmetricDifferenceCheck = document.querySelectorAll(".settings-checkbox")[9]

settingsUpArrow.addEventListener('click', () => {incrementVariationCount(1)})
settingsDownArrow.addEventListener('click', () => {incrementVariationCount(-1)})

function incrementVariationCount(increment) {
    genNewPuzzle = true;
    let newVal = parseFloat(variationCount.value) + increment
    let activeCount = document.querySelectorAll('.settings-checkbox.active').length
    if (newVal > 6 || newVal < activeCount) return;
    variationCount.value = newVal
    puzzleParamaters.setVariationsLength = newVal
}

// const testDiv = document.createElement('div')
// testDiv.classList.add('test-div')
// testDiv.style.cssText = "width: 100px; height: 100px; border: 1px solid black;"
// document.body.append(testDiv.cloneNode())
// document.body.append(testDiv.cloneNode())
// let testDivs = document.querySelectorAll('.test-div')
// for (let node of testDivs) {
//     console.log(node)
//     node.addEventListener('mouseover', function(){
//         this.style.backgroundColor = 'green'
//     })
//     node.addEventListener('mouseout', function(){
//         this.style.backgroundColor = 'white'
//     })
// }

const wildPickerContainer = document.querySelector('#wild-picker-container')
wildPickerContainer.addEventListener('click', setWildCube)
const wildPickerContainerBox = wildPickerContainer.getBoundingClientRect()
const wildBackground = document.createElement('div')
wildBackground.id = 'wild-background'
wildBackground.addEventListener('click', hideWildPicker)
document.body.append(wildBackground)

function toggleWildPicker(e) {
    e.stopPropagation()
    if (this.parentElement !== restrictionContainer && this.parentElement !== solutionContainer) hideKeyboard();
    let element = this, elementX = 0, elementY = 0
    while (true) {
        elementX += element.offsetLeft;
        elementY += element.offsetTop;
        if (element.offsetParent === null) break;
        element = element.offsetParent;
    }
    wildPickerContainer.style.left = elementX - 109 + 'px'
    wildPickerContainer.style.top = elementY - 120 + 'px'
    this.classList.toggle('active')
    wildPickerContainer.classList.toggle('shown')
    wildBackground.classList.toggle('shown')
    header.classList.toggle('dark')
    keyboardContainer.classList.toggle('dark')
    variationsArrowBox.parentElement.classList.toggle('dark') // REMOVE
    mapArrowBox.parentElement.classList.toggle('dark') // REMOVE
}

function hideWildPicker(e) {
    e.stopPropagation()
    let activeCube = document.querySelector('.wild-cube.active')
    if (activeCube) activeCube.classList.remove('active')
    wildPickerContainer.classList.remove('shown')
    wildBackground.classList.remove('shown')
    header.classList.remove('dark')
    keyboardContainer.classList.remove('dark')
    variationsArrowBox.parentElement.classList.remove('dark') // REMOVE
    mapArrowBox.parentElement.classList.remove('dark') // REMOVE
}

const wildStylesElement = document.createElement('style')
document.head.append(wildStylesElement)
const wildStylesSheet = wildStylesElement.sheet

function setWildCube(e) {
    e.stopPropagation();
    if (changeWildStyle(e.target.classList[1])) hideWildPicker(e);
    if (activeSolution === 'solution1') {
        inputValues.wildCube.solution1 = e.target.classList[1]
    } else {
        inputValues.wildCube.solution2 = e.target.classList[1]
    }
};
function changeWildStyle(style) {
    if (/blue|red|green|yellow/.test(style)) {
        let newColor
        switch (style) {
            case "blue": newColor = 'rgb(28, 116, 227)'; break;
            case "red": newColor = 'rgb(196, 41, 38)'; break;
            case "green": newColor = 'rgb(34, 136, 87)'; break;
            case "yellow": newColor = 'rgb(230, 206, 53)'; break;
        }
        wildStylesElement.innerHTML = 
        `#puzzle-container .wild-cube::after {
            display: block;
            content: "";
            border-radius: 100%;
            height: 26px;
            width: 26px;
            background-color: ${newColor};
        }`; return true;
    }
    switch (style) {
        case 'union': wildStylesElement.innerHTML = 
            `#puzzle-container .wild-cube::after {
                font-size: 40px;
                font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', Verdana, sans-serif;
                content: url(/icons/union.svg);
            }`; return true;
        case 'intersect': wildStylesElement.innerHTML = 
            `#puzzle-container .wild-cube::after {
                font-size: 40px;
                font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', Verdana, sans-serif;
                content: url(/icons/intersect.svg);
            }`; return true;
        case 'not': wildStylesElement.innerHTML = 
            `#puzzle-container .wild-cube::after {
                content: "'";
                color: rgb(227, 39, 36);
                font-size: 45px;
                font-weight: 500;
                position: relative;
                top: 5px;
            }`; return true;
        case 'subtract': wildStylesElement.innerHTML = 
            `#puzzle-container .wild-cube::after {
                content: "–";
                color: rgb(227, 39, 36);
                font-size: 45px;
                font-weight: 500;
                position: relative;
                bottom: 2px;
            }`; return true;
        case 'universe': wildStylesElement.innerHTML = 
            `#puzzle-container .wild-cube::after {
                font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', Verdana, sans-serif;
                content: "V";
                color: rgb(28, 116, 227);
                font-size: 38px;
                font-weight: 100;
            }`; return true;
        case 'empty-set': wildStylesElement.innerHTML = 
            `#puzzle-container .wild-cube::after {
                font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', Verdana, sans-serif;
                content: "Ʌ";
                color: rgb(28, 116, 227);
                font-size: 38px;
                font-weight: 100;
            }`; return true;
    }
}
// wildStylesElement.innerHTML = '#puzzle-container .wild-cube { background-color: white; }'
// wildStylesSheet.insertRule('.wild-cube { background-color: white; }', wildStylesSheet.cssRules.length)
// wildStylesSheet.insertRule('.wild-cube { background-color: white }', 0);

// setTimeout(() => {
//     currInput = 'restriction1'
//     inputCube('green')
//     inputCube('must-contain')
//     inputCube('blue')
//     inputCube('intersect')
//     inputCube('red')
//     currInput = "setName1"
//     inputCube('blue')
//     inputCube('union')
//     inputCube('left-parenthesis')
//     inputCube('red')
//     inputCube('intersect')
//     inputCube('green')
//     inputCube('right-parenthesis')
// }, 400);


// currInput = 'restriction1'
// inputCube('red')

// currInput = "setName1"
// inputCube('red')
// inputCube('union')
// inputCube('left-parenthesis')
// inputCube('blue')
// inputCube('union')
// inputCube('blue')
// inputCube('right-parenthesis')
// solutionFormToggleDiv.click()
// currInput = 'restriction2'
// inputCube('green')
// inputCube('must-contain')
// inputCube('yellow')
// currInput = "setName2"
// inputCube('blue')
// inputCube('intersect')
// inputCube('left-parenthesis')
// inputCube('green')
// inputCube('union')
// inputCube('red')
// inputCube('right-parenthesis')
// submitInput()

// const terminateWorkers = new Worker('terminate_workers.js');
// terminateWorkers.postMessage(new Date())
// setInterval(() => {
//     terminateWorkers.terminate()
// }, 100)

// DATABASES ARE PROBABLY FASTER
// let newArr;
// let map1 = new Map([["A", 2], ["B", 3], ["C", 4]])
// let map2 = new Map([["A", 2], ["B", 3], ["C", 4]])
// map1.set("D", map2)
// console.log()
// let b = 0;
// for (let i = 0; i < 10000000; i++) {
//     let arr = [2, 4]
//     // newArr = [1, 2, 3, 4].filter(val => !arr.includes(val))
//     // newArr = [1, 2, 3, 4].filter (val => arr.indexOf(val) < 0)
//     if (map1.get("D").has("A")) {
//         newArr = map1.get("D").get("A")
//     } else {
//         newArr = [1, 2, 3, 4].filter (val => arr.indexOf(val) < 0)
//     }
        
//     // newArr = map1.get("D").get("A")
//     // newArr = arr.join(",")
// }
// console.log(newArr)
// console.log(b)