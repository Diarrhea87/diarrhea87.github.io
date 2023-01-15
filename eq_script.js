let setTimer = new Date();

function clone(arr) {
    return JSON.parse(JSON.stringify(arr))
}

function logTime(message = "") {
    let stopTimer = new Date();
    console.log(message + (stopTimer.getTime() - setTimer.getTime())/1000 + " SECONDS")
};

// [1, 2, 3, 4, 5, 6, 7, 8, 9, '+', '−', 'x', '÷', '^', '√', '(', ')']

(function eval() {
    return

    function operation(arr) {
        if (arr.length === 1) {
            return arr[0]
        } else if (arr.length === 3) {
            if (typeof arr[0] === 'object' || typeof arr[2] === 'object') {
                switch (arr[1]) {
                    case "+":
                        return math.add(arr[0], arr[2]);
                    case "−":
                        return math.subtract(arr[0], arr[2]);
                    case "x":
                        return math.multiply(arr[0], arr[2]);
                    case "÷":
                        return math.divide(arr[0], arr[2]);
                    case "^":
                        return math.pow(arr[0], arr[2]);
                }
            }
            switch (arr[1]) {
                case "+":
                    return (arr[0] + arr[2]);
                case "−":
                    return (arr[0] - arr[2]);
                case "x":
                    return (arr[0] * arr[2]);
                case "÷":
                    return (arr[0] / arr[2]);
                case "^":
                case "*":
                    return (arr[0] ** arr[2]);
            }
        } else if (arr.length > 3) {
            return operation([operation(arr.slice(0, 3)), arr[3], ...arr.slice(4, arr.length)])
        }
    };
    
    function evaluate(input) {

        // console.groupCollapsed("EVALUATE")
        
        let inputsArr = [input.slice()];
        let returnArr = []

        function addPermutation(index, char, replace) {
            if (inputsArr.length > 50) return;
            if (replace) {
                for (let arr of inputsArr) arr[index] = char;
            } else {
                for (let arr of inputsArr.slice('')) {
                    newArr = arr.slice('');
                    newArr[index] = char;
                    inputsArr.push(newArr);
                };
            };
        };

        function checkValidity(arr) {
            let string = arr.map(val => {
                if (number(val).includes('natural')) return 'n'
                if (number(val).includes('fraction')) return 'f'
                if (number(val).includes('negative')) return '-'
                if (number(val).includes('complex')) return 'i'
                return val
            }).join("")
            // .replace(/[!]/g, '')
            if (!/[f][fnjk]|[fnjk][f]|[fnjk]{3,}|([+−x÷l^]){2,}|√[+−x÷l^]|#[+−x÷l^]|[fnjk]#|^[x^]/.test(string)) return true;
            return false;
        }
        
        for (let i = 0; i < input.length; i++) {
            let replace = (i === input.length - 1)
            if (input[i] === '^' && puzzleData.variations.get('base') >= 11) {
                addPermutation(i, 'j', replace);
            } else if (input[i] === '√' && puzzleData.variations.get('base') >= 12) {
                addPermutation(i, 'k', replace);
            } else if (input[i] === 'x' && puzzleData.variations.get('numberOfFactors')) {
                addPermutation(i, '#');
            }
            for (let j = 0; j < inputsArr.length; j++) {
                if (!checkValidity(inputsArr[j].slice(0, i + 1))) {
                    inputsArr = inputsArr.slice(0, j).concat(inputsArr.slice(j + 1));
                    j--
                };
            };
        };

        console.log(input)
        console.log(inputsArr)

        function number(val) {
            let arr = []
            if (typeof val === 'number' || val === 'j' || val === 'k') {
                arr.push('number', 'complex')
                if (val % 1 === 0 || val === 'j' || val === 'k') return ['number','natural','complex']
                if (val < 0) arr.push('negative')
                if (val % 1 !== 0) arr.push('fraction')
            } else if (typeof val === "string") {
                arr.push('operation')
                if (val === "√") arr.push('root')
            } else if (typeof val === 'object') {
                arr.push('complex')
            }
            return arr
        }

        function base10(num) {
            switch (num) {
                case 'j': return 10;
                case 'k': return 11;
                default: return num;
            }
        }

        function numFactors(num) {
            let length = 0, arr = [];
        
            function generateDivisors(curIndex, curDivisor, arr) {
                if (curIndex == arr.length) {
                    length++;
                    return;
                }
                for (let i = 0; i <= arr[curIndex][0]; i++) {
                    generateDivisors(curIndex + 1, curDivisor, arr);
                    curDivisor *= arr[curIndex][1];
                }
            }
        
            for (let i = 2; i * i <= num; i++) {
                if (num % i == 0) {
                    let count = 0;
                    while (num % i == 0) {
                        num /= i;
                        count += 1;
                    }
                    arr.push([count, i]);
                }
            }
            if (num > 1) arr.push([ 1, num ]);
            let curIndex = 0, curDivisor = 1;
        
            generateDivisors(curIndex, curDivisor, arr);
            return length;
        };

        function factorial(num) {
            if (num < 0 || num % 1 !== 0) return 'Invalid Factorial'
            let factorial = 1;
            for (let i = num; i > 0; i--, num--) factorial *= num
            return factorial
        };

        if (!inputsArr.length) throw "No possible interpretations"
        for (let i = 0; i < inputsArr.length; i++) {
            let arr = []
            for (let j = 0; j < inputsArr[i].length; j++) {

                function pushNumber(input, index) {
                    if (inputsArr[i][index] === '√') {
                        j++
                        return Math.sqrt(pushNumber(input, j))
                    }
                    if (inputsArr[i][index] === 'i') {
                        j++
                        return math.multiply(math.complex(0, 1), pushNumber(input, j))
                    }
                    if (index === input.length - 1) return base10(input[index]);
                    if (!number(input[index + 1]).includes("natural")) return base10(input[index]);
                    j++
                    let base = puzzleData.variations.get('base') ?? 10
                    return base10(input[index]) * base + base10(input[index + 1])
                }

                if (inputsArr[i][j] === '√') {
                    let index = (number(inputsArr[i][j - 1]).includes('number')) ? arr.pop() : 2
                    console.log(index)
                    j++
                    let subsequentVal = pushNumber(inputsArr[i], j)
                    arr.push(Math.pow(subsequentVal, 1/index));
                } else if (inputsArr[i][j] === '#') {
                    j++
                    let subsequentVal = pushNumber(inputsArr[i], j)
                    arr.push(numFactors(subsequentVal));
                } else if (inputsArr[i][j] === '!') {
                    let previousVal = arr[arr.length - 1]
                    arr[arr.length - 1] = factorial(previousVal)
                } else if (inputsArr[i][j] === 'i') {
                    let previousVal = (number(arr[arr.length - 1]).includes('complex')) ? arr.pop() : 1
                    let subsequentVal = 1
                    if (number(inputsArr[i][j + 1]).includes('complex')) {
                        j++
                        subsequentVal = pushNumber(inputsArr[i], j)
                    }
                    arr.push(math.multiply(previousVal, math.complex(0, 1), subsequentVal))
                } else if (number(inputsArr[i][j]).includes("natural")) {
                    arr.push(pushNumber(inputsArr[i], j))
                } else {
                    arr.push(inputsArr[i][j])
                };
            };
            console.log(arr)
            console.log(operation(arr))
            returnArr.push([operation(arr), inputsArr[i]])
        };

        console.log(returnArr)
        console.groupEnd()
        return returnArr;
        
    };

    function parseInput(arr) {

        let index = [0];
        let permutationArr = [[[], [[]]]];

        function navigate(currPosition) {
            for (let i = 0; i < index.length - 1; i++) currPosition = currPosition[index[i]]
            return currPosition
        };

        for (let i = 0; i < arr.length; i++) {
            for (let permutation of permutationArr.slice()) {
                let currPosition = navigate(permutation[0])
                if (arr[i] === "(") {
                    currPosition[index[index.length - 1]] = [];
                    if (!permutation[1][index.length]) {
                        permutation[1].push(clone(permutation[1][index.length - 1]))
                    }
                    for (let arr of permutation[1]) {
                        let currPosition = navigate(arr)
                        currPosition.push([])
                    }
                    index.push(0)
                } else if (arr[i] === ")") {
                    index.pop()
                    currPosition = permutation[0];
                    currPosition = navigate(permutation[0])
                    let evaluation = evaluate(currPosition[index[index.length - 1]])
                    for (let j = 0; j < evaluation.length; j++) {
                        let newPermutation;
                        if (!j) {
                            currPosition[index[index.length - 1]] = evaluation[j][0]
                        } else {
                            newPermutation = clone(permutation);
                            currPosition = navigate(newPermutation[0])
                            currPosition[index[index.length - 1]] = evaluation[j][0];
                            permutationArr.push(newPermutation);
                        };
                        for (let k = 0; k < permutation[1].length; k++) {
                            let currPosition;
                            if (!j) {
                                currPosition = navigate(permutation[1][k])
                            } else {
                                currPosition = navigate(newPermutation[1][k])
                            }
                            if (k >= index.length) {
                                let newArr = currPosition[index[index.length - 1]]
                                for (let l = 0; l < newArr.length; l++) {
                                    if (newArr[l] === 'placeholder') newArr[l] = evaluation[j][1][l]
                                }
                            } else {
                                currPosition[index[index.length - 1]] = evaluation[j][0]
                            }
                        }
                    };
                    index[index.length - 1]++
                } else {
                    currPosition[index[index.length - 1]] = arr[i];
                    for (let arr of permutation[1]) {
                        let currPosition = navigate(arr)
                        currPosition.push('placeholder')
                    }
                    index[index.length - 1]++
                };
            };
        };
        let returnArr = []
        console.log(permutationArr)
        for (let arr of permutationArr) {
            let evaluation = evaluate(arr[0])
            for (let i = 0; i < evaluation.length; i++) {
                for (let flag of arr[1]) {
                    for (let j = 0; j < flag.length; j++) {
                        if (flag[j] === 'placeholder') flag[j] = evaluation[i][1][j];
                    }
                }
                returnArr.push([evaluation[i][0], arr[1]])
            }
        }
        console.log(returnArr)
        return returnArr;
    };

    let puzzleData = {variations: new Map([['base', 12], ['numberOfFactors', true]])}
    // −÷√
    let input = '2iii5+5'.split("")
    // let input = ['√', '9']
    for (let i = 0; i < input.length; i++) {
        if (!isNaN(parseFloat(input[i]))) input[i] = parseFloat(input[i])
    };
    // console.log(parseInput(input))
    let answer = parseInput(input)
    // console.log(math.equal(answer[0][0], math.complex(-119, 120)))
})();

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max + 1 - min)) + min;
};

function randomSort(input) {
    let arr = [...input];
    for (let i = arr.length -1; i > 0; i--) {
      let j = Math.floor(Math.random() * i);
      let k = arr[i];
      arr[i] = arr[j];
      arr[j] = k;
    }
    return arr;
};

function deleteFirstArrItem(array, item) {
    if (!array.includes(item)) return array;
    let index = array.indexOf(item);
    return array.slice(0, index).concat(array.slice(index + 1));
};

function randomArrayValue (arr) {
    return arr[getRandomNumber(0, arr.length - 1)]
};

function translateFunction(input, type) {
    if (type === "object") {
        return input.map(val => {
            let modify = val;
            switch (modify.cube) {
                case "-": modify.cube = "−"; break;
                case "/": modify.cube = "÷"; break;
                case "√": modify.cube = "√"; break;
            }
            return modify;
        })
    } else if (type === "array") {
        return input.map(val => {
            let newval = val;
            switch (val) {
                case "-": newval = "−"; break;
                case "/": newval = "÷"; break;
                case "√": newval = "√"; break;
            }
            return newval;
        })
    } else if (type === "prim") {
        let output = input
        switch (input) {
            case "-": output = "−"; break;
            case "/": output = "÷"; break;
            case "√": output = "√"; break;
        }
        return output
    }
}

function translateName(input, typeSymbols) {
    switch (input.toString()) {
        case "one": return "1";
        case "two": return "2";
        case "three": return "3";
        case "four": return "4";
        case "five": return "5";
        case "six": return "6";
        case "seven": return "7";
        case "eight": return "8";
        case "nine": return "9";
        case "zero": return "0";
        case "add": return "+";
        case "subtract": return (typeSymbols) ? "-" : "−";
        case "multiply": return "x";
        case "divide": return (typeSymbols) ? "/" : "÷";
        case "exponent": return "^";
        case "square-root": return "√"
        case "left-parenthesis": return "(";
        case "right-parenthesis": return ")";
        case "1": return "one";
        case "2": return "two";
        case "3": return "three";
        case "4": return "four";
        case "5": return "five";
        case "6": return "six";
        case "7": return "seven";
        case "8": return "eight";
        case "9": return "nine";
        case "0": return "zero";
        case "+": return "add";
        case "-": return "subtract";
        case "−": return "subtract";
        case "*": return "multiply";
        case "x": return "multiply";
        case "/": return "divide";
        case "÷": return "divide";
        case "^": return "exponent";
        case "s": return "square-root";
        case "√": return "square-root";
        case "(": return "left-parenthesis";
        case ")": return "right-parenthesis";
        case "Backspace": return "backspace"
     };
}

function newPuzzle() {

    // RESETTING CONTAINERS
    inputValues.flatArray = []
    inputValues.wrapValue = {'values': [0, 0], 'row': 0}
    inputValues.resourceColors = {
        "available": [[], [], [], []],
        "used": [[], [], [], []]
    }
    inputValues.requiredColors = {
        "available": [[], [], [], []],
        "used": [[], [], [], []]
    }
    solutionContainer.innerHTML = ""
    forbiddenContainer.innerHTML = ""
    requiredContainer.innerHTML = ""
    resourcesContainer.innerHTML = ""
    variationsContainer.querySelector('ul').innerHTML = ""
    goalContainer.innerHTML = ""
    changeRows()

    // GEN NEW PUZZLE

    puzzleParamaters = {"data":"data"}
    let params = Object.values(puzzleParamaters)
    // console.log(params)

    const mainPuzzleWorker = new Worker('equations_worker.js');

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
        console.log(puzzleData)

        // FORBIDDEN
        let modifiedForbiddenArr = translateFunction(puzzleData.forbidden, 'object')
        for (let forbiddenCube of modifiedForbiddenArr) {
            const newForbiddenCube = document.createElement("div")
            newForbiddenCube.innerHTML = forbiddenCube.cube
            if (forbiddenCube.cube === "√") newForbiddenCube.innerHTML = ""
            newForbiddenCube.classList.add("cube", "restraint-cube", forbiddenCube.color, translateName(forbiddenCube.cube.toString()));
            
            forbiddenContainer.append(newForbiddenCube);
        };

        // GOAL
        let modifiedGoalArr = translateFunction(puzzleData.goal, 'object')
        for (let goalCube of modifiedGoalArr) {
            const newGoalCube = document.createElement("div")
            newGoalCube.innerHTML = goalCube.cube
            newGoalCube.classList.add("cube", "goal-cube", goalCube.color, translateName(goalCube.toString()))
            goalContainer.append(newGoalCube)
        };

        function findColorIndex(cube, ...index) {
            let tryIndex = getRandomNumber(0, 3)
            if (index.includes(tryIndex)) {
                if (index.length === 4) return "NOT FOUND";
                return findColorIndex(cube, ...index);
            } else {
                if (puzzleData.modifiedCubes[tryIndex].includes(cube)) return tryIndex;
                index.push(tryIndex);
                return findColorIndex(cube, ...index);
            };
        };

        // REQUIRED
        let resourcesArr = JSON.parse(JSON.stringify(puzzleData.modifiedCubes))
        let requiredArr = puzzleData.solution.cubes
        console.log(requiredArr)
        if (getRandomNumber(0, 2)) requiredArr = deleteFirstArrItem(requiredArr, randomArrayValue(requiredArr.toString()))
        console.log(requiredArr)

        for (let requiredCube of randomSort(requiredArr)) {
            let colorIndex = findColorIndex(requiredCube), color;
            switch (colorIndex) {
                case 0: color = "red"; break;
                case 1: color = "blue"; break;
                case 2: color = "green"; break;
                case 3: color = "black"; break;
            };
            const newRequiredCube = document.createElement('div')
            newRequiredCube.classList.add('cube', 'restraint-cube', color, translateName(requiredCube))
            newRequiredCube.innerHTML = translateFunction(requiredCube, "prim")
            if (requiredCube === "√") newRequiredCube.innerHTML = ""
            requiredContainer.append(newRequiredCube)
            inputValues.requiredColors.available[colorIndex].push(requiredCube.toString())
            resourcesArr[colorIndex] = deleteFirstArrItem (resourcesArr[colorIndex], requiredCube)
        }
        
        // RESOURCES
        for (let i = 0; i < resourcesArr.length; i++) {
            for (let resourcesCube of resourcesArr[i]) {
                let color;
                switch (i) {
                    case 0: color = "red"; break;
                    case 1: color = "blue"; break;
                    case 2: color = "green"; break;
                    case 3: color = "black"; break;
                };
                const newResourcesCube = document.createElement('div')
                newResourcesCube.classList.add('cube', 'resource-cube', color, translateName(resourcesCube.toString()))
                newResourcesCube.innerHTML = translateFunction(resourcesCube, "prim")
                console.log(resourcesCube)
                if (resourcesCube === "√") newResourcesCube.innerHTML = ""
                resourcesContainer.append(newResourcesCube)

                inputValues.resourceColors.available[i].push(resourcesCube.toString())
            };
        };
        console.log(inputValues.requiredColors)
        console.log(inputValues.resourceColors)

        // VARIATIONS
        const variationsDisplay = variationsContainer.querySelector('ul')
        for (let x of puzzleData.variations) {variationsDisplay.append(document.createElement('li'))}
        for (let i = 0; i < variationsDisplay.children.length; i++) {
            let currVariation = Array.from(puzzleData.variations)[i]
            let variationToPush;
            if (typeof currVariation[1] === "boolean") {
                switch (currVariation[0]) {
                    case "powersOfBase": variationToPush = "Powers of Base"; break;
                    case "multipleOperations": variationToPush = "Multiple Ops."; break;
                    case "factorial": variationToPush = "Factorial"; break;
                    case "numberOfFactors": variationToPush = "# Factors"; break;
                    case "imaginary": variationToPush = "Imaginary"; break;
                    case "decimal": variationToPush = "Dec. in Goal"; break;
                    case "log": variationToPush = "Log"; break;
                }
            } else {
                console.log(currVariation[0])
                switch ((currVariation)[0]) {
                    case "wild": variationToPush = currVariation[1] + " Wild"; break;
                    case "base": variationToPush = "Base " + currVariation[1]; break;
                    case "multipleOf": variationToPush = "Multiple of " + currVariation[1]; break;
                    case "exponent": variationToPush = currVariation[1] + " Exponent"; break;
                }
            }
            variationsDisplay.children[i].innerText = variationToPush;
        }
        console.log(puzzleData.variations)
        console.log(variationsDisplay)
        console.groupCollapsed("QUEUE PUZZLE")
        const queuePuzzleWorker = new Worker('equations_worker.js');
        queuePuzzleWorker.postMessage(params)

        queuePuzzleWorker.onmessage = (e) => {
            queuedPuzzleData = e.data
            queuePuzzleWorker.terminate();
        }

        // mainPuzzleWorker.terminate();
    };
};

// HEADING 
const settingsIcon = document.querySelector('#settings-ico')
// CUBE CONTAINERS
const boardContainer = document.querySelector('#board-container')
const forbiddenContainer = document.querySelector('#forbidden-container');
const requiredContainer = document.querySelector('#required-container');
const resourcesContainer = document.querySelector('#resources-container');
const solutionContainer = document.querySelector('#solution-container');
const solutionHoverContainer = document.querySelector('#solution-hover-container')
const goalContainer = document.querySelector('#goal-container');
// MISC PUZZLE CONTAINERS
const variationsContainer = document.querySelector('#variations-container')
const submitButton = document.querySelector('#submit-button');
const header = document.querySelector('header')
// KEYBOARD
const keyboardContainer = document.querySelector('#keyboard-container');
const keyboardButtons = document.querySelectorAll(".keyboard-row > div")

console.log(keyboardButtons)

const inputValues = {
    "flatArray": [],
    "wrapValue": {'values': [0, 0], 'row': 0},
    "divNodes": [],
    "resourceColors": {
        "available": [[], [], [], []],
        "used": [[], [], [], []]
    },
    "requiredColors": {
        "available": [[], [], [], []],
        "used": [[], [], [], []]
    },
    "wildCube": undefined
}

let puzzleData;
let queuedPuzzleData;
newPuzzle()

submitButton.addEventListener('click', submitInput);
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
let keyboardActive = true;
solutionContainer.addEventListener('click', toggleKeyboard);
keyboardContainer.addEventListener('click', function(e) {e.stopPropagation()})
document.addEventListener('click', hideKeyboard);


function toggleKeyboard(e) {
    e.stopPropagation();
    keyboardActive = !keyboardActive;
    keyboardContainer.classList.toggle("hidden")
};
function showKeyboard(e) {
    e.stopPropagation();
    keyboardActive = true;
    keyboardContainer.classList.remove("hidden")
}
function hideKeyboard() {
    keyboardActive = false;
    keyboardContainer.classList.add("hidden")
};

document.addEventListener('keydown', function(keypress){
    // console.log(keypress.key);
    if (!keyboardActive) return;
    inputCube(translateName(keypress.key));
});
for (let button of keyboardButtons) button.addEventListener('click', function() {inputCube(this.classList[1])});

function inputCube(cube) {
    if (document.querySelector('.selector-container')) return;
    if (cube === undefined) return;
    let input, flatArray, wrap;
    input = solutionContainer;
    flatArray = inputValues.flatArray;
    wrap = inputValues.wrapValue;

    let reqCol = inputValues.requiredColors
    let resCol = inputValues.resourceColors

    // console.log(reqCol)

    let currCube;
    if (cube === "backspace") {
        let cubeWidth = 46;
        if (!flatArray.length) return;
        let symbol = flatArray.pop();
        if (/[()]/.test(symbol)) cubeWidth = 16;
        wrap.values[wrap.row] -= cubeWidth;
        checkInputWidth(0);
        let currColor = input.lastElementChild.classList[3], colorIndex
        input.lastElementChild.remove()

        switch (currColor) {
            case "red": colorIndex = 0; break;
            case "blue": colorIndex = 1; break;
            case "green": colorIndex = 2; break;
            case "black": colorIndex = 3; break;
            default: return;
        }
        console.log(colorIndex)
        if (symbol === "÷") symbol = "/"
        if (reqCol.used[colorIndex].includes(symbol)) {
            reqCol.used[colorIndex] = deleteFirstArrItem(reqCol.used[colorIndex], symbol)
            reqCol.available[colorIndex].push(symbol)
            return;
        }
        if (resCol.used[colorIndex].includes(symbol)) {
            resCol.used[colorIndex] = deleteFirstArrItem(resCol.used[colorIndex], symbol)
            resCol.available[colorIndex].push(symbol)
        }
        return;
    } else {
        currCube = translateName(cube)
    };
    if (parseFloat(currCube) >= puzzleData.variations.get('base')) return;

    const solutionCube = document.createElement("div");
    solutionCube.innerHTML = currCube
    if (currCube === "√") solutionCube.innerHTML = ""
    solutionCube.classList.add(cube);
    let cubeWidth = 16;
    if (!/[()]/.test(currCube)) {
        cubeWidth = 46
        solutionCube.classList.add("cube", "solution-cube");
        let symbol = translateName(cube, true)
        let colorIndex;
        for (let i = 0; i < 4; i++) {
            if (reqCol.available[i].includes(symbol)) {
                colorIndex = i
                reqCol.available[i] = deleteFirstArrItem(reqCol.available[i], symbol)
                reqCol.used[i].push(symbol)
                break;
            }
        }
        if (colorIndex === undefined) {
            for (let i = 0; i < 4; i++) {
                if (resCol.available[i].includes(symbol)) {
                    colorIndex = i
                    resCol.available[i] = deleteFirstArrItem(resCol.available[i], symbol)
                    resCol.used[i].push(symbol)
                    break;
                }
            }
        }
        switch (colorIndex) {
            case 0: solutionCube.classList.add("red"); break;
            case 1: solutionCube.classList.add("blue"); break;
            case 2: solutionCube.classList.add("green"); break;
            case 3: solutionCube.classList.add("black"); break;
            default:
                let color;
                if (/[0123]/.test(currCube)) color = randomArrayValue(["red", "blue"])
                if (/[456\^]/.test(currCube)) color = "green"
                if (/[789√]/.test(currCube)) color = "black"
                if (currCube === "+") color = randomArrayValue(["red", "black"])
                if (currCube === "−") color = randomArrayValue(["red", "green"])
                if (currCube === "x") color = randomArrayValue(["blue", "green"])
                if (currCube === "÷") color = randomArrayValue(["blue", "black"])
                solutionCube.classList.add(color)
        }
    }
    // if (currCube === puzzleData.variationsMap.get('wild')) {
    //     solutionCube.classList.add('wild-cube')
    //     solutionCube.addEventListener('click', toggleWildPicker)
    // }
    if (/\d/.test(currCube)) {solutionCube.addEventListener('click', toggleSelector); solutionCube.classList.add('pointer')}
    if (puzzleData.variations.get('base') > 10 && currCube === "^") {solutionCube.addEventListener('click', toggleSelector); solutionCube.classList.add('pointer')}
    if (puzzleData.variations.get('base') > 11 && currCube === "√") {solutionCube.addEventListener('click', toggleSelector); solutionCube.classList.add('pointer')}
    solutionCube.addEventListener('click', showKeyboard)
    if (checkInputWidth(cubeWidth)) {
        flatArray.push(currCube)
        input.append(solutionCube);
    }
};

function checkInputWidth(cubeWidth) {
    let input = solutionContainer, wrap = inputValues.wrapValue
    if (wrap.row > 0 && wrap.values[wrap.row] === 0 && boardContainer.offsetHeight > 450) {
        wrap.row--
        changeRows()
    } else if (wrap.values[wrap.row] + cubeWidth >= input.offsetWidth) {
        if (wrap.row < 3) {
            wrap.row++
            if (!wrap.values[wrap.row]) wrap.values[wrap.row] = 0
            changeRows()
        } else {
            notify(`Solution is too big!`, 'red', 'bounce', 1000, '40px', '170px')
            return false;
        }
    }
    wrap.values[wrap.row] += cubeWidth
    return true;
}

function changeRows() {
    let element = solutionContainer; wrap = inputValues.wrapValue
    let elementHeight, parentHeight, boardHeight;
    elementHeight = 50 + 50 * wrap.row + "px"
    parentHeight = 100 + 50 * wrap.row + "px"
    boardHeight = 450 + 50 * wrap.row + "px"
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
    boardContainer.animate(
        [{height: boardHeight}], {
            fill: 'forwards',
            duration: 100,
            easing: 'ease',
    });
}

const notification = document.createElement('div')
notification.classList.add('notification')

function notify(message, color, animation, duration = 1500, height, width) {
    notification.getAnimations().forEach(val => val.cancel())
    notification.innerText = message
    switch (color) {
        case 'red': notification.style.backgroundColor = 'rgb(219, 58, 52)'; break;
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

const variationsArrowBox = document.querySelector('#variations-arrow-box')
variationsArrowBox.addEventListener('click', function() {
    this.parentElement.classList.toggle('shown')
})

const selectorBackground = document.createElement('div')
selectorBackground.id = 'selector-background'
selectorBackground.addEventListener('click', hideSelector)
document.body.append(selectorBackground)
function toggleSelector(e) {
    e.stopPropagation()
    if (document.querySelector('.selector-container')) {
        hideSelector(e)
        return;
    }
    const selectorContainer = document.createElement('div')
    selectorContainer.classList.add('selector-container')
    this.append(selectorContainer)
    const upsidedownSetting = document.createElement('div')
    upsidedownSetting.classList.add('selector-toggle')
    upsidedownSetting.innerText = "Upsidedown"
    const sidewaysSetting = document.createElement('div')
    sidewaysSetting.classList.add('selector-toggle')
    sidewaysSetting.innerText = "Sideways"

    const toggle = document.createElement('div')
    const toggleSwitch = document.createElement('div')
    toggle.classList.add('toggle')
    toggleSwitch.classList.add('toggle-switch')
    toggle.append(toggleSwitch)
    toggle.dataset.type = 'upsidedown'
    const sidewaysToggle = toggle.cloneNode('deep')
    sidewaysToggle.dataset.type = 'sideways'

    toggle.addEventListener('click', toggleOrientation)
    sidewaysToggle.addEventListener('click', toggleOrientation)

    if (this.classList.contains('upsidedown')) toggle.classList.add('active')
    if (this.classList.contains('sideways')) sidewaysToggle.classList.add('active')

    upsidedownSetting.append(toggle)
    sidewaysSetting.append(sidewaysToggle)

    selectorContainer.append(upsidedownSetting)
    selectorContainer.append(sidewaysSetting)
    selectorContainer.addEventListener('click', select)
    
    this.classList.toggle('active')
    solutionContainer.classList.toggle('active')
    selectorContainer.classList.toggle('shown')
    selectorBackground.classList.toggle('shown')
    header.classList.toggle('dark')
    keyboardContainer.classList.toggle('dark')
    variationsArrowBox.parentElement.classList.toggle('dark') // REMOVE
}

function hideSelector(e) {
    e.stopPropagation()
    const selectorContainer = document.querySelector('.selector-container')
    if (!selectorContainer.classList.contains('shown')) return;
    // console.log("D")
    let element = solutionContainer, minX = 0, minY = 0;
    while (true) {
        minX += element.offsetLeft;
        minY += element.offsetTop;
        if (element.offsetParent === null) break;
        element = element.offsetParent;
    }
    maxX = minX + solutionContainer.offsetWidth
    maxY = minY + solutionContainer.offsetHeight

    if (e.clientX > minX && e.clientY > minY && e.clientX < maxX && e.clientY < maxY) {
        solutionContainer.classList.add('hover')
    }
    selectorContainer.addEventListener('transitionend', function() {
        this.remove()
        solutionContainer.classList.remove('hover')
        let activeCube = document.querySelector('.cube.active')
        activeCube.classList.remove('active')
    })
    solutionContainer.classList.remove('active')
    selectorContainer.classList.remove('shown')
    selectorBackground.classList.remove('shown')
    header.classList.remove('dark')
    keyboardContainer.classList.remove('dark')
    variationsArrowBox.parentElement.classList.remove('dark') // REMOVE
};

function select(e) {e.stopPropagation()}

function toggleOrientation(e) {
    let cube = this.parentElement.parentElement.parentElement
    if (cube.classList.contains('square-root') && this.dataset.type === "sideways") {
        notify(`Input Error!`, 'red', 'bounce', 1000, '40px', '120px')
        return;
    }
    this.classList.toggle('active')
    cube.classList.toggle(this.dataset.type)
}

function submitInput() {
    try {
        console.log(inputValues)
        let nodes = solutionContainer.children
        let arr = inputValues.flatArray
        let arrString = arr.join("")
        console.log(nodes)
        if (!nodes.length) {
            notify('Input a Solution!', 'red', 'bounce', 1000, '', '160px'); 
            console.log('NO SOLUTION 1'); return;
        }

        let leftParenthesis = (arrString.match(/\(/g) || []).length
        let rightParenthesis = (arrString.match(/\)/g) || []).length
        if (leftParenthesis !== rightParenthesis) {
            notify('Invalid Input, Check Parenthesis!', 'red', 'bounce', 1600, '', '270px')
            console.log('Mismatched Parenthesis'); return;
        };

        // CALCULATION

        function operation(arr) {
            if (arr.length === 1) {
                return arr[0]
            } else if (arr.length === 3) {
                if (typeof arr[0] === 'object' || typeof arr[2] === 'object') {
                    switch (arr[1]) {
                        case "+":
                            return math.add(arr[0], arr[2]);
                        case "−":
                            return math.subtract(arr[0], arr[2]);
                        case "x":
                            return math.multiply(arr[0], arr[2]);
                        case "÷":
                            return math.divide(arr[0], arr[2]);
                        case "^":
                            return math.pow(arr[0], arr[2]);
                    }
                }
                switch (arr[1]) {
                    case "+":
                        return (arr[0] + arr[2]);
                    case "−":
                        return (arr[0] - arr[2]);
                    case "x":
                        return (arr[0] * arr[2]);
                    case "÷":
                        return (arr[0] / arr[2]);
                    case "^":
                    case "*":
                        return (arr[0] ** arr[2]);
                }
            } else if (arr.length > 3) {
                return operation([operation(arr.slice(0, 3)), arr[3], ...arr.slice(4, arr.length)])
            }
        };
        
        function evaluate(input) {
    
            // console.groupCollapsed("EVALUATE")
            
            let inputsArr = [input.slice()];
            let returnArr = []
    
            function addPermutation(index, char, replace) {
                if (inputsArr.length > 50) return;
                if (replace) {
                    for (let arr of inputsArr) arr[index] = char;
                } else {
                    for (let arr of inputsArr.slice('')) {
                        newArr = arr.slice('');
                        newArr[index] = char;
                        inputsArr.push(newArr);
                    };
                };
            };
    
            function checkValidity(arr) {
                let string = arr.map(val => {
                    if (number(val).includes('natural')) return 'n'
                    if (number(val).includes('fraction')) return 'f'
                    if (number(val).includes('negative')) return '-'
                    if (number(val).includes('complex')) return 'i'
                    return val
                }).join("")
                // .replace(/[!]/g, '')
                if (!/[f][fnjk]|[fnjk][f]|[fnjk]{3,}|([+−x÷l^]){2,}|√[+−x÷l^]|#[+−x÷l^]|[fnjk]#|^[x^]/.test(string)) return true;
                return false;
            }
            
            for (let i = 0; i < input.length; i++) {
                let replace = (i === input.length - 1)
                if (input[i] === '^' && puzzleData.variations.get('base') >= 11) {
                    addPermutation(i, 'j', replace);
                } else if (input[i] === '√' && puzzleData.variations.get('base') >= 12) {
                    addPermutation(i, 'k', replace);
                } else if (input[i] === 'x' && puzzleData.variations.get('numberOfFactors')) {
                    addPermutation(i, '#');
                }
                for (let j = 0; j < inputsArr.length; j++) {
                    if (!checkValidity(inputsArr[j].slice(0, i + 1))) {
                        inputsArr = inputsArr.slice(0, j).concat(inputsArr.slice(j + 1));
                        j--
                    };
                };
            };
    
            console.log(input)
            console.log(inputsArr)
    
            function number(val) {
                let arr = []
                if (typeof val === 'number' || val === 'j' || val === 'k') {
                    arr.push('number', 'complex')
                    if (val % 1 === 0 || val === 'j' || val === 'k') return ['number','natural','complex']
                    if (val < 0) arr.push('negative')
                    if (val % 1 !== 0) arr.push('fraction')
                } else if (typeof val === "string") {
                    arr.push('operation')
                    if (val === "√") arr.push('root')
                } else if (typeof val === 'object') {
                    arr.push('complex')
                }
                return arr
            }
    
            function base10(num) {
                switch (num) {
                    case 'j': return 10;
                    case 'k': return 11;
                    default: return num;
                }
            }
    
            function numFactors(num) {
                let length = 0, arr = [];
            
                function generateDivisors(curIndex, curDivisor, arr) {
                    if (curIndex == arr.length) {
                        length++;
                        return;
                    }
                    for (let i = 0; i <= arr[curIndex][0]; i++) {
                        generateDivisors(curIndex + 1, curDivisor, arr);
                        curDivisor *= arr[curIndex][1];
                    }
                }
            
                for (let i = 2; i * i <= num; i++) {
                    if (num % i == 0) {
                        let count = 0;
                        while (num % i == 0) {
                            num /= i;
                            count += 1;
                        }
                        arr.push([count, i]);
                    }
                }
                if (num > 1) arr.push([ 1, num ]);
                let curIndex = 0, curDivisor = 1;
            
                generateDivisors(curIndex, curDivisor, arr);
                return length;
            };
    
            function factorial(num) {
                if (num < 0 || num % 1 !== 0) return 'Invalid Factorial'
                let factorial = 1;
                for (let i = num; i > 0; i--, num--) factorial *= num
                return factorial
            };
    
            if (!inputsArr.length) throw "No possible interpretations"
            for (let i = 0; i < inputsArr.length; i++) {
                let arr = []
                for (let j = 0; j < inputsArr[i].length; j++) {
    
                    function pushNumber(input, index) {
                        if (inputsArr[i][index] === '√') {
                            j++
                            return Math.sqrt(pushNumber(input, j))
                        }
                        if (inputsArr[i][index] === 'i') {
                            j++
                            return math.multiply(math.complex(0, 1), pushNumber(input, j))
                        }
                        if (index === input.length - 1) return base10(input[index]);
                        if (!number(input[index + 1]).includes("natural")) return base10(input[index]);
                        j++
                        let base = puzzleData.variations.get('base') ?? 10
                        return base10(input[index]) * base + base10(input[index + 1])
                    }
    
                    if (inputsArr[i][j] === '√') {
                        let index = (number(inputsArr[i][j - 1]).includes('number')) ? arr.pop() : 2
                        console.log(index)
                        j++
                        let subsequentVal = pushNumber(inputsArr[i], j)
                        arr.push(Math.pow(subsequentVal, 1/index));
                    } else if (inputsArr[i][j] === '#') {
                        j++
                        let subsequentVal = pushNumber(inputsArr[i], j)
                        arr.push(numFactors(subsequentVal));
                    } else if (inputsArr[i][j] === '!') {
                        let previousVal = arr[arr.length - 1]
                        arr[arr.length - 1] = factorial(previousVal)
                    } else if (inputsArr[i][j] === 'i') {
                        let previousVal = (number(arr[arr.length - 1]).includes('complex')) ? arr.pop() : 1
                        let subsequentVal = 1
                        if (number(inputsArr[i][j + 1]).includes('complex')) {
                            j++
                            subsequentVal = pushNumber(inputsArr[i], j)
                        }
                        arr.push(math.multiply(previousVal, math.complex(0, 1), subsequentVal))
                    } else if (number(inputsArr[i][j]).includes("natural")) {
                        arr.push(pushNumber(inputsArr[i], j))
                    } else {
                        arr.push(inputsArr[i][j])
                    };
                };
                console.log(arr)
                console.log(operation(arr))
                let answer = operation(arr)
                if (answer === undefined || answer === NaN) {
                    console.log("INVALID INTERPRETATION")
                    console.log(answer);
                    continue;
                }
                returnArr.push([operation(arr), inputsArr[i]])
            };
    
            console.log(returnArr)
            console.groupEnd()
            return returnArr;
            
        };
    
        function parseInput(arr) {
    
            let index = [0];
            let permutationArr = [[[], [[]]]];
    
            function navigate(currPosition) {
                for (let i = 0; i < index.length - 1; i++) currPosition = currPosition[index[i]]
                return currPosition
            };
    
            for (let i = 0; i < arr.length; i++) {
                for (let permutation of permutationArr.slice()) {
                    let currPosition = navigate(permutation[0])
                    if (arr[i] === "(") {
                        currPosition[index[index.length - 1]] = [];
                        if (!permutation[1][index.length]) {
                            permutation[1].push(clone(permutation[1][index.length - 1]))
                        }
                        for (let arr of permutation[1]) {
                            let currPosition = navigate(arr)
                            currPosition.push([])
                        }
                        index.push(0)
                    } else if (arr[i] === ")") {
                        index.pop()
                        currPosition = permutation[0];
                        currPosition = navigate(permutation[0])
                        let evaluation = evaluate(currPosition[index[index.length - 1]])
                        for (let j = 0; j < evaluation.length; j++) {
                            let newPermutation;
                            if (!j) {
                                currPosition[index[index.length - 1]] = evaluation[j][0]
                            } else {
                                newPermutation = clone(permutation);
                                currPosition = navigate(newPermutation[0])
                                currPosition[index[index.length - 1]] = evaluation[j][0];
                                permutationArr.push(newPermutation);
                            };
                            for (let k = 0; k < permutation[1].length; k++) {
                                let currPosition;
                                if (!j) {
                                    currPosition = navigate(permutation[1][k])
                                } else {
                                    currPosition = navigate(newPermutation[1][k])
                                }
                                if (k >= index.length) {
                                    let newArr = currPosition[index[index.length - 1]]
                                    for (let l = 0; l < newArr.length; l++) {
                                        if (newArr[l] === 'placeholder') newArr[l] = evaluation[j][1][l]
                                    }
                                } else {
                                    currPosition[index[index.length - 1]] = evaluation[j][0]
                                }
                            }
                        };
                        index[index.length - 1]++
                    } else {
                        currPosition[index[index.length - 1]] = arr[i];
                        for (let arr of permutation[1]) {
                            let currPosition = navigate(arr)
                            currPosition.push('placeholder')
                        }
                        index[index.length - 1]++
                    };
                };
            };
            let returnArr = []
            console.log(permutationArr)
            for (let arr of permutationArr) {
                let evaluation = evaluate(arr[0])
                for (let i = 0; i < evaluation.length; i++) {
                    for (let flag of arr[1]) {
                        for (let j = 0; j < flag.length; j++) {
                            if (flag[j] === 'placeholder') flag[j] = evaluation[i][1][j];
                        }
                    }
                    returnArr.push([evaluation[i][0], arr[1]])
                }
            }
            console.log(returnArr)
            return returnArr;
        };
    
        // let puzzleData = {variations: new Map([['base', 12], ['numberOfFactors', true]])}
        // // −÷√
        // let input = '2iii5+5'.split("")
        // // let input = ['√', '9']
        // for (let i = 0; i < input.length; i++) {
        //     if (!isNaN(parseFloat(input[i]))) input[i] = parseFloat(input[i])
        // };
        // // console.log(parseInput(input))
        // let answer = parseInput(input)
        // // console.log(math.equal(answer[0][0], math.complex(-119, 120)))

        let toParseArr = []
        for (let cube of nodes) {
            let newVal = translateName(cube.classList[0])
            if (!isNaN(parseFloat(newVal))) newVal = parseFloat(newVal)
            if (typeof newVal === "number") {
                if (cube.classList.contains('upsidedown')) newVal *= -1
                if (cube.classList.contains('sideways')) {
                    newVal = 1 / newVal
                }
            }
            toParseArr.push(newVal)
        }
        console.log(toParseArr)
        let answerArr = parseInput(toParseArr)

        let title, paragraph, answer;
        (function checkInput() {

            title = 'Incorrect:'

            console.log(answerArr)
            let goalArr = puzzleData.variations.get('multipleOf') ? puzzleData.goalModValues : puzzleData.goalValues
            let deltaMap = new Map();
            for (let val of answerArr) {
                if (answer) break;
                let value = (puzzleData.variations.get('multipleOf')) ? val[0] % puzzleData.variations.get('multipleOf') : val[0]
                let delta;
                for (let goal of goalArr) {
                    if (typeof goal === 'BigInt') continue;
                    if (math.equal(goal, value)) {
                        answer = val
                        break;
                    } else {
                        let difference = math.abs(math.subtract(goal, value))
                        if (difference < delta || !delta) delta = difference
                    }
                }
                deltaMap.set(delta, val)
            }
            console.log(deltaMap)

            if (!answer) {
                paragraph = `Solution does not evaluate to goal.`
                let minDelta = Array.from(deltaMap.keys()).sort((a, b) => a - b)[0]
                console.log(deltaMap.keys())
                answer = deltaMap.get(minDelta)
                return;
            }

            // throw "STOP"

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

            // console.log(requiredContainer.dataset.values)
            // console.log(resourcesContainer.dataset.values)
            // for (let i = 1; i <= (twoSolutions ? 4 : 2); i++) {
            //     let currWild = (i <= 2) ? inputValues.wildCube.solution1 : inputValues.wildCube.solution2
            //     console.log(currWild)
            //     let requiredValues = requiredContainer.dataset.values
            //     let resourcesValues = requiredContainer.dataset.values.concat(resourcesContainer.dataset.values)
            //     if (puzzleData.variationsMap.get('wild')) {
            //         requiredValues = requiredValues.replaceAll(puzzleData.variationsMap.get('wild'), translateName(currWild))
            //         resourcesValues = resourcesValues.replaceAll(puzzleData.variationsMap.get('wild'), translateName(currWild))
            //     }
            //     let requiredScore = altCalcScore(requiredValues)
            //     let resourcesScore = altCalcScore(resourcesValues)
            //     let input
            //     switch (i) {
            //         case 1: input = restrictionArr1; break;
            //         case 2: input = setNameArr1; break;
            //         case 3: input = restrictionArr2; break;
            //         case 4: input = setNameArr2; break;
            //     };
        
            //     if (puzzleData.variationsMap.get('wild')) {
            //         input = input.replaceAll(puzzleData.variationsMap.get('wild'), translateName(currWild))
            //     }
            //     console.log(input)
            //     let inputScore = altCalcScore(input)
            //     console.log(inputScore)
            //     console.log(requiredScore)
                
            //     for (let j = 0; j < requiredScore.length; j++) {
            //         let min = requiredScore[j]
            //         let max = resourcesScore[j]
            //         let curr = inputScore[j]
            //         if (curr < min) {
            //             console.log(i)
            //             paragraph = `Required cubes missing from Solution.`
            //             return;
            //         };
    
            //         if (curr > max) {
            //             if (j >= 5 && max !== 0) continue;
            //             let extraCube;
            //             switch (j) {
            //                 case 0: extraCube = 'Blue'; break
            //                 case 1: extraCube = 'Red'; break
            //                 case 2: extraCube = 'Green'; break
            //                 case 3: extraCube = 'Yellow'; break
            //                 case 4: 
            //                     let arr = []
            //                     if (input.includes("V")) arr.push('"Universe"')
            //                     if (input.includes("Ʌ")) arr.push('"Empty-Set"')
            //                     extraCube = arr[getRandomNumber(0, arr.length - 1)];
            //                     break;
            //                 case 5:
            //                     let arr2 = []
            //                     if (input.includes("U")) arr2.push('"Or"')
            //                     if (input.includes("∩")) arr2.push('"And"')
            //                     extraCube = arr2[getRandomNumber(0, arr2.length - 1)];
            //                     break;
            //                 case 6: extraCube = '"Minus"'
            //                 case 7: extraCube = '"Not"'
            //             }
            //             if (max === 0) {
            //                 paragraph = `Resources does not contain a ${extraCube} cube.`
            //                 return;
            //             } else {
            //                 paragraph = `${i % 2 == 0 ? 'Set Name' : 'Restriction'} has too many ${extraCube} cubes.`
            //                 return;
            //             };
            //         };
            //     };
            // };
            title = 'Correct'
            // inputResult.style.backgroundColor = 'rgba(92, 255, 80, 0.518)';

        })();

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
        resultTitle.innerText = title
        resultParagraph.innerText = paragraph

        // throw 'STOP'    

        inputResult.append(resultTitle)
        inputResult.append(resultParagraph)
        answerContent.append(inputResult)

        // TITLE
        const titleNode = document.createElement('h2')
        titleNode.innerText = 'Your Solution'
        answerContent.append(titleNode)

        const inputSolutionContainer = document.createElement('div')
        const inputAnswer = document.createElement('div')
        inputSolutionContainer.classList = 'answer-solution-container'
        for (let node of solutionContainer.children) inputAnswer.append(node.cloneNode('deep'))
        inputSolutionContainer.append(inputAnswer)
        answerContent.append(inputSolutionContainer)

        const evaluationParagraph = document.createElement('p')
        evaluationParagraph.innerText = `Your solution evaluates to ${answer[0]}`
        answerContent.append(evaluationParagraph)

        // SEPARATE ANSWER
        const horizontalRule = document.createElement('hr')
        horizontalRule.style.cssText = 'width: 80%;'
        answerContent.append(horizontalRule)

        // DEFINED TITLE
        const titleNode2 = document.createElement('h2')
        titleNode2.innerText = 'Solution'
        answerContent.append(titleNode2)

        console.log(puzzleData)

        // DEFINED SOLUTION
        const defindSolutionContainer = document.createElement('div')
        const definedAnswer = document.createElement('div')
        defindSolutionContainer.classList.add('answer-solution-container')

        let currIterable = puzzleData.solution.flag
        let upsidedown, sideways;
        for (let i = 0; i < currIterable.length; i++) {
            let currSymbol = currIterable.charAt(i)
            const solutionCube = document.createElement("div");
            if (!(currSymbol === "(" || currSymbol === ")")) {
                solutionCube.classList.add("cube", "restraint-cube");
            }
            if (currSymbol === "u") {
                upsidedown = true;
                continue;
            }
            if (currSymbol === "s") {
                sideways = true;
                continue;
            }
            if (currSymbol === "n") {
                upsidedown = true;
                sideways = true;
                continue;
            }
            if (currSymbol === "-")  currSymbol = "−"
            if (upsidedown) {
                solutionCube.classList.add('upsidedown')
                upsidedown = false;
            }
            if (sideways) {
                solutionCube.classList.add('sideways')
                sideways = false;
            }
            let color;
            if (/[0123]/.test(currSymbol)) color = randomArrayValue(["red", "blue"])
            if (/[456\^]/.test(currSymbol)) color = "green"
            if (/[789√]/.test(currSymbol)) color = "black"
            if (currSymbol === "+") color = i ? "red" : "black"
            if (currSymbol === "−") color = i ? "red" : "green"
            if (currSymbol === "x") color = i ? "blue" : "green"
            if (currSymbol === "÷") color = i ? "blue" : "black"
            if (currSymbol === "!") color = "red"
            solutionCube.classList.add(color)
            
            solutionCube.classList.add(translateName(currSymbol))
            solutionCube.innerText = currSymbol

            definedAnswer.append(solutionCube);
        }
        defindSolutionContainer.append(definedAnswer)
        answerContent.append(defindSolutionContainer)


        newAnswer.append(answerContent)

        answerBackground.classList.toggle('shown')
        console.log("A")
        newAnswer.classList.toggle('shown')

    } catch (error) {
        console.log(error)
        notify('Invalid input!', 'red', 'bounce', 1500, '', '')
    }
};