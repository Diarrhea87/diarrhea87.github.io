let setTimer = new Date();

// Start of functions
function clone(arr) {
    return JSON.parse(JSON.stringify(arr))
}

function logTime(message = "") {
    let stopTimer = new Date();
    console.log(message + (stopTimer.getTime() - setTimer.getTime()) / 1000 + " SECONDS")
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
                if (val % 1 === 0 || val === 'j' || val === 'k') return ['number', 'natural', 'complex']
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
            if (num > 1) arr.push([1, num]);
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
                    arr.push(Math.pow(subsequentVal, 1 / index));
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

    let puzzleData = { variations: new Map([['base', 12], ['numberOfFactors', true]]) }
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
    for (let i = arr.length - 1; i > 0; i--) {
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
function randomArrayValue(arr) {
    return arr[getRandomNumber(0, arr.length - 1)]
};

function translateName(input) {
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
        case "subtract": return "−";
        case "multiply": return "x";
        case "divide": return "÷";
        case "exponent": return "^";
        case "square-root": return "√"
        case "factorial": return "!"
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
        case "!": return "factorial"
        case "(": return "left-parenthesis";
        case ")": return "right-parenthesis";
        case "Backspace": return "backspace"
    };
}

function base10(num) {
    switch (num) {
        case 'j': return 10;
        case 'k': return 11;
        default: return num;
    }
}

function createSvg(type) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    switch (type) {
        case 'arrow':
            svg.setAttribute('viewBox', "0 0 24 24")
            svg.setAttribute('fill', "currentColor")

            path.setAttribute('fill-rule', 'evenodd');
            path.setAttribute('d', 'M4.929 7.913l7.078 7.057 7.064-7.057a1 1 0 111.414 1.414l-7.77 7.764a1 1 0 01-1.415 0L3.515 9.328a1 1 0 011.414-1.414z');
            path.setAttribute('clip-rule', 'evenodd');
            svg.append(path)
            return svg
        case 'square-root':
            // svg.setAttribute('viewBox', "0 0 11.112498 11.112498")
            svg.setAttribute('viewBox', "0 0 11 11")
            // svg.setAttribute('fill', "currentColor")
            path.setAttribute('style', 'fill:#002724;fill-opacity:0;stroke:#ffffff;stroke-width:0.61764;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none;stroke-opacity:1')
            path.setAttribute('d', 'M 3.2579811,5.611843 H 3.7564006 L 4.5501808,7.7347416 5.6947001,3.3781839 7.8545189,3.3778064');
            svg.append(path)
            return svg
    }
}
// End of functions

// Create elements
const cursor = document.createElement('div')
cursor.id = 'cursor'
cursor.classList.add('blink-animation')

let puzzleParamaters =
{
    randomize:
        false,
    setCubes:
        [
            [1, '+', 2, 1,],
            [0, 'x', 'x', 1],
            [5, '−'],
            [1, 8]
        ],
    setVariations:
        ['multipleOperations', 'base', 'log'],
    setVariationsLength:
        3,
    setGoal:
        [
            { cube: 1, color: 'red', orientation: 'up' },
            { cube: '+', color: 'red', orientation: 'up' },
            { cube: 1, color: 'red', orientation: 'up' }
        ],
    setForbidden:
    {
        forbiddenArrLength: 0
    },
}

// puzzleParamaters = {
//     randomize: undefined,
//     setCubes: undefined,
//     setVariations: undefined,
//     setVariationsLength: undefined,
//     setGoal: undefined,
//     setForbidden: undefined,
// }

// New Puzzle
function newPuzzle() {

    // Reset Containers
    inputValues.wrap = { 'values': [0, 0], 'row': 0 }
    inputValues.resources = {
        values: [[], [], [], []],
        available: [[], [], [], []],
        used: [[], [], [], []]
    }
    inputValues.required = {
        values: [[], [], [], []],
        available: [[], [], [], []],
        used: [[], [], [], []]
    }
    solutionContainer.innerHTML = ""
    forbiddenContainer.innerHTML = ""
    requiredContainer.innerHTML = ""
    resourcesContainer.innerHTML = ""
    variationsContainer.querySelector('ul').innerHTML = ""
    goalContainer.innerHTML = ""
    currInput = 'solution-container'
    changeRows()
    // currInput = 'goal-container'
    // changeRows()

    // Generate New Puzzle
    let params = Object.values(puzzleParamaters)
    console.log(params)

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

        // Display forbidden cubes
        let modifiedForbiddenArr = puzzleData.forbidden
        for (let forbiddenCube of modifiedForbiddenArr) {
            const newForbiddenCube = document.createElement("div")
            newForbiddenCube.innerHTML = forbiddenCube.cube
            if (forbiddenCube.cube === "√") newForbiddenCube.innerHTML = ""
            newForbiddenCube.classList.add("cube", "restraint-cube", forbiddenCube.color, translateName(forbiddenCube.cube.toString()));

            forbiddenContainer.append(newForbiddenCube);
        };

        // Display goal cubes
        let modifiedGoalArr = puzzleData.goal
        for (let goalCube of modifiedGoalArr) {
            const newGoalCube = document.createElement("div")
            newGoalCube.innerHTML = goalCube.cube
            newGoalCube.classList.add("cube", "goal-cube", goalCube.color, translateName(goalCube.toString()))
            // goalContainer.append(newGoalCube)
            // currInput = 'goal-container'
            // checkInputWidth(46, newGoalCube)
            // currInput = null
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

        // Determine required and resources cubes from solution
        let resourcesArr = JSON.parse(JSON.stringify(puzzleData.modifiedCubes))
        let requiredArr = puzzleData.solution.cubes

        console.log(puzzleData.solution.flag)
        console.log(requiredArr)

        // Occasionally remove a cube from required
        if (getRandomNumber(0, 2)) requiredArr = deleteFirstArrItem(requiredArr, randomArrayValue(requiredArr.toString()))
        console.log(requiredArr)

        // Place cubes from required arr into required
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
            newRequiredCube.innerHTML = requiredCube

            // Ensure square root cubes contains svg, not innerHTML
            if (requiredCube === "√") newRequiredCube.innerHTML = ""

            requiredContainer.append(newRequiredCube)
            inputValues.required.values[colorIndex].push(requiredCube.toString())
            inputValues.required.available[colorIndex].push(requiredCube.toString())

            // Remove required cube from resources
            resourcesArr[colorIndex] = deleteFirstArrItem(resourcesArr[colorIndex], requiredCube)
        }

        // Place cubes from resources arr into resources
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
                newResourcesCube.innerHTML = resourcesCube
                console.log(resourcesCube)

                // Ensure square root cubes contain svg, not innerHTML
                if (resourcesCube === "√") newResourcesCube.innerHTML = ""

                resourcesContainer.append(newResourcesCube)
                inputValues.resources.values[i].push(resourcesCube.toString())
                inputValues.resources.available[i].push(resourcesCube.toString())
            };
        };
        console.log(inputValues.required)
        console.log(inputValues.resources)

        // Display variations
        const variationsDisplay = variationsContainer.querySelector('ul')
        for (let x of puzzleData.variations) { variationsDisplay.append(document.createElement('li')) }
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

        // Queue New Puzzle

        // console.groupCollapsed("QUEUE PUZZLE")
        //     const queuePuzzleWorker = new Worker('equations_worker.js');
        //     queuePuzzleWorker.postMessage(params)

        //     queuePuzzleWorker.onmessage = (e) => {
        //         queuedPuzzleData = e.data
        //         queuePuzzleWorker.terminate();
        //     }

        // mainPuzzleWorker.terminate();

        // let string = '1+(1+1)'
        // let string = '0x31+18x58−2'

        // Preset Input
        currInput = 'solution-container'
        let string = '√'
        for (let i = 0; i < string.length; i++) {
            inputCube(translateName(string.charAt(i)))
        }
        solutionContainer.append(cursor)
        // submitInput()

    };
};

// Heading 
const settingsIcon = document.querySelector('#settings-ico')
// Cube Containers
const boardContainer = document.querySelector('#board-container')
const forbiddenContainer = document.querySelector('#forbidden-container');
const requiredContainer = document.querySelector('#required-container');
const resourcesContainer = document.querySelector('#resources-container');
const solutionContainer = document.querySelector('#solution-container');
const solutionHoverContainer = document.querySelector('#solution-hover-container')
const goalContainer = document.querySelector('#goal-container');
// Misc. Puzzle Containers
const variationsContainer = document.querySelector('#variations-container')
const submitButton = document.querySelector('#submit-button');
const header = document.querySelector('header')
// Keyboard
const keyboardContainer = document.querySelector('#keyboard-container');
const keyboardButtons = document.querySelectorAll(".keyboard-row > div")
console.log(keyboardButtons)

solutionContainer.dataset.container = 'solution-container'
goalContainer.dataset.container = 'goal-container'

const workers = {
    mainWorker: null,
    queueWorker: null,
}

const inputValues = {
    solution: {
        selectedCubeIndex: {
            row: 0,
            column: null,
        },
        cursorRow: 0,
        wrap: {
            row: 0,
            elements: [[], []],
            widths: [[], []],
            values: [0, 0],
        },
    },
    goal: {
        selectedCubeIndex: {
            row: 0,
            column: null,
        },
        cursorRow: 0,
        wrap: {
            row: 0,
            elements: [[], []],
            widths: [[], []],
            values: [0, 0],
        },
    },
    resources: {
        available: [[], [], [], []],
        used: [[], [], [], []]
    },
    required: {
        available: [[], [], [], []],
        used: [[], [], [], []]
    },
    wildCube: undefined
}

let puzzleData;
let queuedPuzzleData;
let currInput = null;
newPuzzle()

// Cube Inputs
solutionContainer.addEventListener('click', showKeyboard);
goalContainer.addEventListener('click', showKeyboard);
keyboardContainer.addEventListener('click', function (e) { e.stopPropagation() })
document.addEventListener('click', hideKeyboard);

// function toggleKeyboard(e) {
//     e.stopPropagation();
//     currInput = !currInput;
//     cursor.classList.toggle('blink-animation')
//     keyboardContainer.classList.toggle("hidden")
// };
function showKeyboard(e) {

    let target = e.target.dataset.container
    const targetElement = document.querySelector(`#${target}`)

    e.stopPropagation();
    cursor.classList.add('blink-animation')
    keyboardContainer.classList.remove("hidden")

    let wrap, container, selectedCubeIndex, row, column, cRow, frontCursor, clickedRow
    if (currInput === 'solution-container') {
        container = solutionContainer;
        wrap = inputValues.solution.wrap
        selectedCubeIndex = inputValues.solution.selectedCubeIndex
        cRow = inputValues.solution
    } else {
        container = goalContainer;
        wrap = inputValues.goal.wrap
        selectedCubeIndex = inputValues.goal.selectedCubeIndex
        cRow = inputValues.goal
    };
    
    if (!targetElement.classList.contains('active') && currInput) {

        const activeContainer = document.querySelector('#solution-container.active, #goal-container.active')
        if (activeContainer) {
            activeContainer.classList.remove('active')
        }
        for (let row of wrap.elements) {
            for (let node of row) {
                node.dataset.cursorOffset = 0
            }
        }
        selectedCubeIndex.row = wrap.row
        cRow.cursorRow = wrap.row
        selectedCubeIndex.column = wrap.elements[wrap.row].length - 1

        alignCursor()
        alignNodes()
    }

    if (targetElement.classList.contains('active')) {

        let previousSelectedCubeRow
        
        if (getSelectedCube()) {
            previousSelectedCubeRow = getSelectedCube().dataset.row
        } else {
            previousSelectedCubeRow = 0
        }

        if (e.target === container) {

            row = Math.floor((e.offsetY - 2) / 50)
            
            if (row < 0) row = 0;
            if (row > wrap.row) row--

            cRow.cursorRow = row
            clickedRow = row

            let leftBound = (container.offsetWidth - wrap.values[row]) / 2
            let rightBound = leftBound + wrap.values[row]
            if (e.offsetX < leftBound) { // Clicked to the left of all cubes

                frontCursor = true;
                if (row > 0) { // Ensure cube is not very first cube
                    row--
                    column = wrap.elements[row].length - 1
                } else { // If cube is first cube, set index accordingly
                    row = 0
                    column = null
                }

            } else if (e.offsetX > rightBound) { // Clicked to the right of all cubes
                column = wrap.widths[row].length - 1

                if (wrap.row > row) { 
                    clickedRow = row + 1
                    cRow.cursorRow = row + 1
                    frontCursor = true;
                }

            } else {

                let difference = e.offsetX - leftBound
                column = -1;
                if (difference === 0) column = 0;
                for (let i = 0; difference > 0; i++) {
                    difference -= wrap.widths[row][i]
                    column++
                }

                let clickedCube = wrap.elements[row][column]

                // Clicking on left half of cube will keep column same as left cube
                let halfWidth = (clickedCube.classList.contains('cube')) ? 23 : 8
                if (difference + halfWidth < 0) {
                    if (column > 0) { // Default, select cube to the left
                        column--
                    } else {  // If cube is first of its row
                        frontCursor = true;
                        if (row === 0) { // Cube is very first cube
                            column = null
                        } else { // Default, select last cube of previous row
                            row--
                            column = wrap.elements[row].length - 1
                        }
                    }
                } else if (column === wrap.elements[row].length - 1) { // If clicked to the right of last cube in row
                    if (wrap.row > row) { // Move cursor to first position of next row if applicable
                        clickedRow = row + 1
                        cRow.cursorRow = row + 1
                        frontCursor = true;
                    }
                }

            } 
        } else {

            let clickedCube = e.target
            // if (clickedCube.classList.contains('pointer')) return;
            if (clickedCube.nodeName === 'svg') return;
            let halfWidth = (clickedCube.classList.contains('cube')) ? 23 : 8
            clickedRow = parseInt(clickedCube.dataset.row)
            row = clickedRow
            column = wrap.elements[clickedRow].indexOf(clickedCube)
            cRow.cursorRow = clickedRow
            // Clicking on left half of cube select the previous cube
            if (e.offsetX < halfWidth) {
                if (column > 0) { // Default, select cube to the left
                    column--
                } else { // If cube is first of its row
                    frontCursor = true;
                    if (row === 0) { // Cube is very first cube
                        column = null
                    } else { // Default, select last cube of previous row
                        row--
                        column = wrap.elements[row].length - 1
                    }
                }
            }
        }
        selectedCubeIndex.row = row
        selectedCubeIndex.column = column

        for (let i = 0; i < wrap.elements[previousSelectedCubeRow].length; i++) {
            if (cRow.cursorRow == previousSelectedCubeRow) break;
            wrap.elements[previousSelectedCubeRow][i].dataset.cursorOffset = 0
        }
        for (let i = 0; i < wrap.elements[clickedRow].length; i++) {
            if (i > column || frontCursor) {
                wrap.elements[clickedRow][i].dataset.cursorOffset = 6
            } else [
                wrap.elements[clickedRow][i].dataset.cursorOffset = 0
            ]
        }

        alignCursor([70, 70], frontCursor)
        alignNodes()

    } else if (target === 'solution-container') {
        currInput = 'solution-container'
        solutionContainer.classList.add('active')
        solutionContainer.append(cursor)
        alignCursor([0, 0])
    } else if (target === 'goal-container') {
        currInput = 'goal-container'
        goalContainer.classList.add('active')
        goalContainer.append(cursor)
        alignCursor([0, 0])
    };

}
function hideKeyboard() {

    if (!currInput) return;

    const activeContainer = document.querySelector('#solution-container.active, #goal-container.active')
    
    let selectedCubeIndex, wrap;
    if (currInput === 'solution-container') {
        wrap = inputValues.solution.wrap
        selectedCubeIndex = inputValues.solution.selectedCubeIndex
        input = inputValues.solution
    } else {
        wrap = inputValues.goal.wrap
        selectedCubeIndex = inputValues.goal.selectedCubeIndex
        input = inputValues.goal
    }

    if (wrap) { // Clicked on container while another container was still active
        for (let row of wrap.elements) {
            for (let node of row) {
                node.dataset.cursorOffset = 0
            }
        }

        selectedCubeIndex.row = wrap.row
        input.cursorRow = wrap.row
        selectedCubeIndex.column = wrap.elements[wrap.row].length - 1
        alignCursor()
        alignNodes()
    }

    cursor.classList.remove('blink-animation')
    if (activeContainer) {
        solutionContainer.classList.remove('active')
    }
    keyboardContainer.classList.add("hidden")

    currInput = null;
};

document.addEventListener('keydown', function (keypress) {
    // Input cube on keypress when keyboard is active

    // console.log(keypress.key);
    if (!currInput) return;
    if (keypress.key === 'ArrowLeft' || keypress.key === 'ArrowRight') {
        moveCursor(keypress.key)
    }
    inputCube(translateName(keypress.key));
});
for (let button of keyboardButtons) button.addEventListener('click', function () { inputCube(this.classList[1]) });

function getSelectedCube(width) {
    let selectedCubeIndex, wrap
    if (currInput === 'solution-container') {
        selectedCubeIndex = inputValues.solution.selectedCubeIndex
        wrap = inputValues.solution.wrap
    } else {
        selectedCubeIndex = inputValues.goal.selectedCubeIndex
        wrap = inputValues.goal.wrap
    }
    let value = width ? wrap.widths : wrap.elements
    let cube = value[selectedCubeIndex.row][selectedCubeIndex.column]
    return cube ? cube : null
}

function inputCube(cube) {

    if (document.querySelector('.selector-container')) return;
    if (cube === undefined) return;
    if (cube === 'factorial' && !puzzleData.variations.get('factorial')) return;
    let wrap, selectedCubeIndex;
    if (currInput === 'solution-container') {
        wrap = inputValues.solution.wrap;
        selectedCubeIndex = inputValues.solution.selectedCubeIndex
    } else {
        wrap = inputValues.goal.wrap;
        selectedCubeIndex = inputValues.goal.selectedCubeIndex
    }
    let reqCol = inputValues.required
    let resCol = inputValues.resources

    // Determine current input

    let symbol;
    if (cube === "backspace") {

        const selectedCubeElement = getSelectedCube()

        // If no cubes available, return
        if (!selectedCubeElement) return;

        // Set cube data
        let cubeType = selectedCubeElement.dataset.restraint
        let cubeWidth = 46;
        let symbol = selectedCubeElement.innerText
        if (/[()]/.test(symbol)) cubeWidth = 16;

        // Modify row sizes and check lengths
        wrap.values[selectedCubeIndex.row] -= cubeWidth
        checkInputWidth(cubeWidth);

        // Determine cube color, then remove it
        let currColor = selectedCubeElement.dataset.color, colorIndex
        selectedCubeElement.remove()

        // Remove cube from inputValues color indexes if it has type
        if (!cubeType) return;

        // Set color index
        switch (currColor) {
            case "red": colorIndex = 0; break;
            case "blue": colorIndex = 1; break;
            case "green": colorIndex = 2; break;
            case "black": colorIndex = 3; break;
            default: return;
        }

        if (reqCol.used[colorIndex].includes(symbol) && cubeType === 'required') {
            // If cube was required, move it from used array to avaiable array

            reqCol.used[colorIndex] = deleteFirstArrItem(reqCol.used[colorIndex], symbol)
            reqCol.available[colorIndex].push(symbol)
        } else if (resCol.used[colorIndex].includes(symbol) && cubeType === 'resource') {
            // If cube was resources, move it from used array to available array

            resCol.used[colorIndex] = deleteFirstArrItem(resCol.used[colorIndex], symbol)
            resCol.available[colorIndex].push(symbol)
        }

        return;
    } else {
        // Set symbol
        symbol = translateName(cube)
    };

    // Don't add cubes not within base
    if (parseFloat(symbol) >= puzzleData.variations.get('base')) return;

    // Create cube and add HTML
    const solutionCube = document.createElement('div');
    solutionCube.innerHTML = symbol

    if (symbol === '√') {
        // Ensure square root cubes contain svg, not innerHTML
        solutionCube.innerHTML = ''
        const svg = createSvg('square-root')
        svg.classList.add('svg') // Prevent redundant error from no having no classlist
        svg.dataset.container = currInput
        solutionCube.append(svg)
    }

    // Set classlist and width
    solutionCube.classList.add(cube);
    let cubeWidth = 16;

    if (!/[()]/.test(symbol)) {
        // Add classes and colors if cube is not parenthesis

        cubeWidth = 46
        solutionCube.classList.add('cube', 'solution-cube');

        let colorIndex, finalColor;

        for (let i = 0; i < 4; i++) {
            if (reqCol.available[i].includes(symbol)) {
                // If required colors contains cubes, move it from available array to used array
                // Then, set its color
                colorIndex = i
                reqCol.available[i] = deleteFirstArrItem(reqCol.available[i], symbol)
                reqCol.used[i].push(symbol)
                solutionCube.dataset.restraint = 'required'
                break;
            }
        }

        if (colorIndex === undefined) {
            // If cube is not in required
            for (let i = 0; i < 4; i++) {
                if (resCol.available[i].includes(symbol)) {
                    // If resources colors contains cubes, move it from available array to used array
                    // Then, set its color
                    colorIndex = i
                    resCol.available[i] = deleteFirstArrItem(resCol.available[i], symbol)
                    resCol.used[i].push(symbol)
                    solutionCube.dataset.restraint = 'resource'
                    break;
                }
            }
        }

        switch (colorIndex) {
            case 0: finalColor = "red"; break;
            case 1: finalColor = "blue"; break;
            case 2: finalColor = "green"; break;
            case 3: finalColor = "black"; break;
            default:
                // Cube was not in required nor resources, set random color value

                solutionCube.dataset.restraint = 'unavailable'
                let color;
                if (/[0123]/.test(symbol)) color = randomArrayValue(["red", "blue"])
                if (/[456\^]/.test(symbol)) color = "green"
                if (/[789√]/.test(symbol)) color = "black"
                if (symbol === "!") color = "red"
                if (symbol === "+") color = randomArrayValue(["red", "black"])
                if (symbol === "−") color = randomArrayValue(["red", "green"])
                if (symbol === "x") color = randomArrayValue(["blue", "green"])
                if (symbol === "÷") color = randomArrayValue(["blue", "black"])
                finalColor = color
        }

        solutionCube.classList.add(finalColor)
        solutionCube.dataset.color = finalColor
    }

    // if (currCube === puzzleData.variationsMap.get('wild')) {
    //     solutionCube.classList.add('wild-cube')
    //     solutionCube.addEventListener('click', toggleWildPicker)
    // }

    if (/\d/.test(symbol)) {
        solutionCube.addEventListener('click', toggleSelector);
        solutionCube.classList.add('pointer')
    }
    if (puzzleData.variations.get('imaginary') && symbol === "−") {
        solutionCube.addEventListener('click', toggleSelector);
        solutionCube.classList.add('pointer')
    }
    if (puzzleData.variations.get('log') && symbol === "÷") {
        solutionCube.addEventListener('click', toggleSelector);
        solutionCube.classList.add('pointer')
    }
    if (puzzleData.variations.get('base') > 10 && symbol === "^") { solutionCube.addEventListener('click', toggleSelector); solutionCube.classList.add('pointer') }
    if (puzzleData.variations.get('base') > 11 && symbol === "√") { solutionCube.addEventListener('click', toggleSelector); solutionCube.classList.add('pointer') }
    
    solutionCube.addEventListener('click', showKeyboard)
    solutionCube.dataset.container = currInput

    // Give and remove hidden classlist for fade in effect
    solutionCube.classList.add('hidden')

    if (checkInputWidth(cubeWidth, solutionCube)) {
        solutionCube.classList.remove('hidden')
    }
};

function checkInputWidth(cubeWidth, element) {

    let input, selectedCubeIndex, wrap, cRow
    if (currInput === 'solution-container') {
        input = solutionContainer
        selectedCubeIndex = inputValues.solution.selectedCubeIndex
        wrap = inputValues.solution.wrap
        cRow = inputValues.solution
    } else {
        input = goalContainer
        selectedCubeIndex = inputValues.goal.selectedCubeIndex
        wrap = inputValues.goal.wrap
        cRow = inputValues.goal
    }
    let case1 = false;
    let containerWidth = input.offsetWidth
    let nodeAnimationDuration = 70;
    let cursorAnimationDuration = [0, 30];
    let frontCursor;

    // console.log("INPUTDEBUG")
    // console.log(wrap.values)
    // console.log(wrap.row)
    // console.log(wrap.values[wrap.row])
    // console.log(cubeWidth)

    if (element) {
        // Append element if one is passed

        // Create index for new cube
        let newRow, newColumn

        if (wrap.values[selectedCubeIndex.row] + cubeWidth >= containerWidth - 10) {
            // If current row is too wide, move to next row
            // Also, make sure cursor is not front cursor

            // Maximum solution size
            if (wrap.values[3]) {
                if (wrap.values[3] + cubeWidth >= containerWidth - 10) {
                    notify(`Solution is too big!`, 'red', 'bounce', 1000, '40px', '170px')
                    return false;
                }
            }

            if (selectedCubeIndex.column === wrap.widths[selectedCubeIndex.row].length - 1) {
                // Selected cube is last fitting cube in row
                newRow = selectedCubeIndex.row + 1
                newColumn = 0
                wrap.values[newRow] += cubeWidth

                if (cRow.cursorRow === selectedCubeIndex.row) {
                    // Case where cursor will end up onto next row
                    cRow.cursorRow++
                    cursorAnimationDuration = [0, 0]

                    wrap.row++
                    changeRows()
                } else {
                    // Case where cursor is at leftmost position on non-first row

                    let overflowData = stopOverflow(selectedCubeIndex.row)
                    cursorAnimationDuration = overflowData[0]
                    nodeAnimationDuration = overflowData[1]
                    frontCursor = overflowData[2]
                }

            } else {
                // Default

                // Edge case where cube must move to next row but other objects are in front (i.e. parenthesis that fit)
                let totalWidth = wrap.widths[selectedCubeIndex.row].slice(0, selectedCubeIndex.column + 1).reduce((a, b) => a + b, 0)
                if (totalWidth + cubeWidth > containerWidth - 10) {

                    case1 = true

                    newRow = selectedCubeIndex.row
                    newColumn = selectedCubeIndex.column + 1
                    wrap.values[newRow] += cubeWidth

                } else {
                    newRow = selectedCubeIndex.row
                    if (selectedCubeIndex.column === null) {
                        // Special case for first cube
                       newColumn = selectedCubeIndex.column + 0
                    } else {
                       newColumn = selectedCubeIndex.column + 1
                    }
                    wrap.values[newRow] += cubeWidth

                    let overflowData = stopOverflow(selectedCubeIndex.row)
                    cursorAnimationDuration = overflowData[0]
                    nodeAnimationDuration = overflowData[1]
                    if (overflowData[2] !== null) frontCursor = overflowData[2]
                }

            }

            // If wrap value does not contain index for spare row, make one
            if (!wrap.values[wrap.row + 1]) wrap.values[wrap.row + 1] = 0
            if (!wrap.widths[wrap.row + 1]) wrap.widths[wrap.row + 1] = []
            if (!wrap.elements[wrap.row + 1]) wrap.elements[wrap.row + 1] = []

        } else if (cRow.cursorRow !== selectedCubeIndex.row) {
            // Case where cursor is at leftmost position and cube fits into previous row
            newRow = selectedCubeIndex.row
            newColumn = selectedCubeIndex.column + 1
            wrap.values[newRow] += cubeWidth

            frontCursor = true;
        } else if (selectedCubeIndex.column === null) {
            // Case where no cubes in input yet
            newRow = selectedCubeIndex.row
            newColumn = 0;
            wrap.values[newRow] += cubeWidth
        } else {
            // Default, new index is 1 column to the right of current selected cube
            newRow = selectedCubeIndex.row
            newColumn = selectedCubeIndex.column + 1
            wrap.values[newRow] += cubeWidth
        }

        // Add new cube into wrap indexes
        wrap.widths[newRow].splice(newColumn, 0, cubeWidth)
        wrap.elements[newRow].splice(newColumn, 0, element)

        // Set position
        let totalWidth = (wrap.values[newRow])
        let leftBound = (containerWidth - totalWidth + cubeWidth) / 2
        // Offset is sum of widths up to column
        let offset = wrap.widths[newRow].slice(0, newColumn).reduce((a, b) => a + b, 0)
        let position = leftBound + offset

        element.dataset.offset = offset
        element.dataset.row = newRow
        element.dataset.cursorOffset = 0
        element.style.top = 2 + (newRow * 50) + "px"
        element.style.left = position + "px";

        // Edge case where cube must move to next row but other objects are in front (i.e. parenthesis that fit)

        if (case1) {

            cRow.cursorRow++

            let overflowData = stopOverflow(selectedCubeIndex.row)
            cursorAnimationDuration = overflowData[0]
            nodeAnimationDuration = overflowData[1]
            if (overflowData[2] !== null) frontCursor = overflowData[2]

            newRow = selectedCubeIndex.row + 1
            newColumn = 0

            for (let i = 1; i < wrap.elements[cRow.cursorRow].length; i++) {
                wrap.elements[cRow.cursorRow][i].dataset.cursorOffset = 6
            }

        }

        cursor.style.top = 8 + (newRow * 50) + "px"

        input.append(element)
        selectedCubeIndex.row = newRow;
        selectedCubeIndex.column = newColumn;

        // Adjust offset for succceeding cubes
        for (let i = newColumn + 1; i < wrap.elements[newRow].length; i++) {
            if (case1) break;
            let element = wrap.elements[newRow][i]
            element.dataset.offset = parseInt(element.dataset.offset) + cubeWidth
        }

    } else {
        // Backspace, Remove element

        // if (wrap.row > 0 && wrap.values[wrap.row] === 0 && boardContainer.offsetHeight > 450) {
        if (wrap.row > 0 && wrap.values[wrap.row] === 0) {
            // If current row is empty

            wrap.row--
            cRow.cursorRow--
            changeRows()

            wrap.widths[selectedCubeIndex.row].splice(selectedCubeIndex.column, 1)
            wrap.elements[selectedCubeIndex.row].splice(selectedCubeIndex.column, 1)

            if (selectedCubeIndex.row) {
                selectedCubeIndex.row--
                selectedCubeIndex.column = wrap.elements[wrap.row].length - 1
            }
            else {
                selectedCubeIndex.column = null
            }

            alignCursor(0)
            return;

        }

        cursorAnimationDuration = [0, 70]
        const currCube = getSelectedCube()

        // Remove selected cube from wrap values
        wrap.widths[selectedCubeIndex.row].splice(selectedCubeIndex.column, 1)
        wrap.elements[selectedCubeIndex.row].splice(selectedCubeIndex.column, 1)

        // Adjust offset for succceeding cubes
        for (let i = selectedCubeIndex.column; i < wrap.elements[selectedCubeIndex.row].length; i++) {
            wrap.elements[selectedCubeIndex.row][i].dataset.offset -= cubeWidth
        }

        if (selectedCubeIndex.column) {

            if (selectedCubeIndex.row !== cRow.cursorRow) {
                // If cursor was at leftmost position of next row

                let remainingSpace = (containerWidth - 10) - (wrap.values[selectedCubeIndex.row])
                let nextCubeWidth = wrap.widths[selectedCubeIndex.row + 1][0]
                if (nextCubeWidth && nextCubeWidth < remainingSpace) {
                    // Default, move cursor to rightmost position of current row
                    let cursorOffset = parseInt(currCube.dataset.offset) + 2
                    let leftBound = (containerWidth - (wrap.values[selectedCubeIndex.row] + cubeWidth)) / 2
                    position = leftBound + cursorOffset + cubeWidth

                    cursor.animate(
                        [{ left: position + "px" }], {
                        fill: 'forwards',
                        duration: 0,
                        easing: 'ease',
                    });
                    cursor.style.top = 8 + (cRow.cursorRow * 50) + "px"
                    // Then, let it animate to desired position with align cursor
                    for (let node of wrap.elements[cRow.cursorRow]) { node.dataset.cursorOffset = 0 }
                    cRow.cursorRow--
                } else {
                    // Not enough room to move next row cube into row, activate frontCursor
                    selectedCubeIndex.column = wrap.elements[selectedCubeIndex.row].length
                    frontCursor = true;
                }

            }

            // Default, move selected cube to the left
            selectedCubeIndex.column--

        } else if (selectedCubeIndex.row) {
            // If deleted cube is first of its row, set position accordingly and activate frontCursor
            selectedCubeIndex.row--
            selectedCubeIndex.column = wrap.elements[selectedCubeIndex.row].length - 1
            frontCursor = true;
        } else {
            // Else deleted cube was first cube
            selectedCubeIndex.row = 0
            selectedCubeIndex.column = null
            frontCursor = true;

        }

        let fillData = stopEmptySpace(selectedCubeIndex.row)
        cursorAnimationDuration = fillData[0]
        nodeAnimationDuration = fillData[1]
        if (fillData[2] !== null) frontCursor = fillData[2]

    };
    // console.log(selectedCubeIndex)
    // console.log(wrap.elements)
    // console.log(wrap.widths)
    // console.log(cursorRow)

    alignCursor(cursorAnimationDuration, frontCursor)
    alignNodes(nodeAnimationDuration)

    return true;
}

window.onresize = () => {
    alignNodes()
    alignCursor()
}

function alignNodes(duration = 70, rows = []) {

    let input, wrap
    if (currInput === 'solution-container') {
        input = solutionContainer
        wrap = inputValues.solution.wrap
    } else {
        input = goalContainer
        wrap = inputValues.goal.wrap
    }
    let containerWidth = input.offsetWidth

    for (let node of input.children) {

        if (node.id === 'cursor') continue;
        if (rows.includes(parseInt(node.dataset.row))) return // Future feature for optimization

        let row = parseInt(node.dataset.row)
        let leftBound = (containerWidth - wrap.values[row]) / 2
        let position = leftBound + parseInt(node.dataset.offset) + parseInt(node.dataset.cursorOffset)

        // node.style.top = 2 + (row * 50) + "px"
        node.animate(
            [{ left: position + "px" }], {
            fill: 'forwards',
            duration: duration,
            easing: 'ease',
        });
        node.animate(
            [{ top: (50 * row) + 2 + "px" }], {
            fill: 'forwards',
            duration: duration,
            easing: 'ease',
        });
    };
}

function stopOverflow(startIndex) {

    let input, selectedCubeIndex, wrap, cRow
    if (currInput === 'solution-container') {
        input = solutionContainer
        selectedCubeIndex = inputValues.solution.selectedCubeIndex
        wrap = inputValues.solution.wrap
        cRow = inputValues.solution
    } else {
        input = goalContainer
        selectedCubeIndex = inputValues.goal.selectedCubeIndex
        wrap = inputValues.goal.wrap
        cRow = inputValues.goal
    }
    let containerWidth = input.offsetWidth
    let cursorAnimationDuration = [0, 30];
    let nodeAnimationDuration = 120;
    let frontCursor = null;
    let defaultBehavior = false;

    if (startIndex === undefined) {
        startIndex = 0
        defaultBehavior = true;
    }

    // Have extra cubes move into new row cubes
    for (let i = startIndex; i < wrap.elements.length - 1; i++) {

        let overflowAmount = (wrap.values[i]) - (containerWidth - 10)

        if (overflowAmount >= 0 && i === wrap.row) {
            wrap.row++
            changeRows()
        }
        console.log(overflowAmount)
        while (overflowAmount >= 0) {

            let width = wrap.widths[i].pop()
            overflowAmount -= width
            console.log(width)

            let element = wrap.elements[i].pop()
            let newRow = parseInt(element.dataset.row) + 1
            let offset = 0
            wrap.values[i] -= width
            wrap.elements[i + 1].unshift(element)
            wrap.widths[i + 1].unshift(width)

            for (let j = 0; j < wrap.elements[i + 1].length; j++) {
                let element = wrap.elements[i + 1][j]
                element.dataset.offset = parseInt(element.dataset.offset) + width
            }

            element.dataset.row = newRow
            element.dataset.offset = offset
            element.dataset.cursorOffset = 0
            // nodeAnimationDuration = 70;
            wrap.values[i + 1] += width

            // Moves next row if selected cube does not fit onto row
            if (selectedCubeIndex.column === wrap.elements[selectedCubeIndex.row].length - 1) {
                // Ensure this doesn't happen if cursor is on leftmost position of row
                if (selectedCubeIndex.row === cRow.cursorRow) {
                    cRow.cursorRow++
                    cursorAnimationDuration = [100, 100];
                    frontCursor = true
                    for (let node of wrap.elements[cRow.cursorRow]) { node.dataset.cursorOffset = 6 }
                    nodeAnimationDuration = 100
                };
            }

        }
    }

    return [cursorAnimationDuration, nodeAnimationDuration, frontCursor]

}

function stopEmptySpace(startIndex) {

    let input, selectedCubeIndex, wrap, cRow
    if (currInput === 'solution-container') {
        input = solutionContainer
        selectedCubeIndex = inputValues.solution.selectedCubeIndex
        wrap = inputValues.solution.wrap
        cRow = inputValues.solution
    } else {
        input = goalContainer
        selectedCubeIndex = inputValues.goal.selectedCubeIndex
        wrap = inputValues.goal.wrap
        cRow = inputValues.goal
    }
    let containerWidth = input.offsetWidth
    let cursorAnimationDuration = [0, 70];
    let nodeAnimationDuration = 120;
    let frontCursor = null;
    let defaultBehavior = false;

    if (startIndex === undefined) {
        startIndex = 0;
        defaultBehavior = true
    }

    // Have subsequent cubes fill in remaining space
    for (let i = startIndex; i < wrap.elements.length - 1; i++) {

        // Break if no subsequent cubes
        if (!wrap.widths[i + 1][0]) break;

        let remainingSpace = (containerWidth - 10) - (wrap.values[i])
        while (wrap.widths[i + 1][0] < remainingSpace) {

            let width = wrap.widths[i + 1].shift()
            remainingSpace -= width

            let offset = wrap.widths[i].reduce((a, b) => a + b, 0)

            let element = wrap.elements[i + 1].shift()
            wrap.values[i + 1] -= width
            wrap.elements[i].push(element)
            wrap.widths[i].push(width)

            let newRow = parseInt(element.dataset.row) - 1
            element.dataset.row = newRow
            element.dataset.offset = offset
            if (newRow === cRow.cursorRow) {
                element.dataset.cursorOffset = 6
            };
            nodeAnimationDuration = 100;
            wrap.values[i] += width

            for (let j = 0; j < wrap.elements[i + 1].length; j++) {
                wrap.elements[i + 1][j].dataset.offset -= width
            }

            // Moves cursor to previous row when cubes behind cursor get realigned to previous row
            if (selectedCubeIndex.row !== cRow.cursorRow && selectedCubeIndex.column < wrap.elements[i].length) {
                for (let node of wrap.elements[cRow.cursorRow]) { node.dataset.cursorOffset = 0 }
                cRow.cursorRow--
                cursorAnimationDuration = [0, 0];
                frontCursor = false
            }

            // Next row becomes empty
            if (!wrap.elements[i + 1].length) {
                wrap.row--
                changeRows()
            }
        }
    }

    return [cursorAnimationDuration, nodeAnimationDuration, frontCursor]

}

function moveCursor(key) {
    let selectedCubeIndex, wrap, cRow
    if (currInput === 'solution-container') {
        selectedCubeIndex = inputValues.solution.selectedCubeIndex
        wrap = inputValues.solution.wrap
        cRow = inputValues.solution
    } else {
        selectedCubeIndex = inputValues.goal.selectedCubeIndex
        wrap = inputValues.goal.wrap
        cRow = inputValues.goal
    }
    let frontCursor;
    let cursorAnimationDuration = [0, 100]
    let fixRow = [];

    if (key === 'ArrowLeft') {
        // Left Arrow

        if (selectedCubeIndex.row !== cRow.cursorRow) {
            // Move cursor up a row
            cursorAnimationDuration = [0, 0];
            fixRow.push(cRow.cursorRow)
            cRow.cursorRow--
        }

        if (selectedCubeIndex.column > 0) {
            // Default, move left
            selectedCubeIndex.column--
        } else if (selectedCubeIndex.row) {
            // If not on first row, to leftmost spot of current row
            selectedCubeIndex.row--
            selectedCubeIndex.column = wrap.elements[selectedCubeIndex.row].length - 1
            frontCursor = true
        } else {
            // If on first row, move to leftmost position
            selectedCubeIndex.row = 0
            selectedCubeIndex.column = null
            frontCursor = true
        };

    } else {
        // Right arrow

        if (selectedCubeIndex.column === null) {
            // If cursor is in leftmost position, move to the right of first cube if it exists
            if (wrap.elements[0].length) {
                selectedCubeIndex.column = 0
            }
        } else if (selectedCubeIndex.column + 2 < wrap.elements[selectedCubeIndex.row].length) {
            // Default, move right
            selectedCubeIndex.column++
        } else if (wrap.elements[selectedCubeIndex.row + 1].length) {
            // Move onto next row if available
            if (selectedCubeIndex.column + 2 === wrap.elements[selectedCubeIndex.row].length) {
                // If cursor reaches position before rightmost position, move onto leftmost spot of next row
                // Selected cube will still be rightmost cube of current row
                selectedCubeIndex.column++
                fixRow.push(cRow.cursorRow)
                cRow.cursorRow++
                cursorAnimationDuration = [0, 0];
                frontCursor = true;
            } else {
                // If cursor is already on next row, set selected cube to be first cube on next row
                selectedCubeIndex.row++
                selectedCubeIndex.column = 0
            }
        } else if (selectedCubeIndex.column + 1 < wrap.elements[selectedCubeIndex.row].length) {
            // If on last row, move to rightmost spot of last cube
            selectedCubeIndex.column++
        };

    };

    alignCursor(cursorAnimationDuration, frontCursor)

    for (let row of fixRow) {
        for (let node of wrap.elements[row]) {
            node.dataset.cursorOffset = 0
        }
    }

    if (frontCursor) {
        for (let node of wrap.elements[cRow.cursorRow]) {
            node.dataset.cursorOffset = 6
        }
    } else {
        for (let i = 0; i < wrap.elements[selectedCubeIndex.row].length; i++) {
            if (i <= selectedCubeIndex.column) {
                wrap.elements[selectedCubeIndex.row][i].dataset.cursorOffset = 0;
            } else {
                wrap.elements[selectedCubeIndex.row][i].dataset.cursorOffset = 6;
            }
        }
    }

    alignNodes(120)

    console.log(selectedCubeIndex)

}

function alignCursor(duration = [0, 30], frontCursor) {

    let input, selectedCubeIndex, wrap, cursorRow
    if (currInput === 'solution-container') {
        input = solutionContainer
        selectedCubeIndex = inputValues.solution.selectedCubeIndex
        wrap = inputValues.solution.wrap
        cursorRow = inputValues.solution.cursorRow
    } else {
        input = goalContainer
        selectedCubeIndex = inputValues.goal.selectedCubeIndex
        wrap = inputValues.goal.wrap
        cursorRow = inputValues.goal.cursorRow
    }
    let containerWidth = input.offsetWidth

    if (frontCursor) {
        let cursorLeftBound = (containerWidth - wrap.values[cursorRow]) / 2
        let cursorPosition = cursorLeftBound + 2
        cursor.animate(
            [{ top: 8 + cursorRow * 50 + "px" }], {
            fill: 'forwards',
            duration: duration[0],
            easing: 'ease',
        });
        cursor.animate(
            [{ left: cursorPosition + "px" }], {
            fill: 'forwards',
            duration: duration[1],
            easing: 'ease',
        });

        cursor.classList.remove('blink-animation')
        void cursor.offsetWidth;
        cursor.classList.add('blink-animation')
        return;
    }

    if (getSelectedCube() === null) {
        let cursorPosition = (containerWidth / 2) + 2
        cursor.animate(
            [{ top: 8 + "px" }], {
            fill: 'forwards',
            duration: duration[1],
            easing: 'ease',
        });
        cursor.animate(
            [{ left: cursorPosition + "px" }], {
            fill: 'forwards',
            duration: duration[1],
            easing: 'ease',
        });

        cursor.classList.remove('blink-animation')
        void cursor.offsetWidth;
        cursor.classList.add('blink-animation')
        return;
    }

    let cursorLeftBound = (containerWidth - wrap.values[selectedCubeIndex.row]) / 2
    let cursorOffset = parseInt(getSelectedCube().dataset.offset) + 2
    let cubeWidth = getSelectedCube('width')
    let cursorPosition = cursorLeftBound + cursorOffset + cubeWidth

    cursor.animate(
        [{ top: 8 + (selectedCubeIndex.row * 50) + "px" }], {
        fill: 'forwards',
        duration: duration[0],
        easing: 'ease',
    });
    cursor.animate(
        [{ left: cursorPosition + "px" }], {
        fill: 'forwards',
        duration: duration[1],
        easing: 'ease',
    });

    // Reset cursor animation
    cursor.classList.remove('blink-animation')
    void cursor.offsetWidth;
    cursor.classList.add('blink-animation')
}


document.onkeydown = function (keypress) {
    if (keypress.key !== 'o') return
    console.log(solutionContainer.childElementCount)
    // checkInputWidth2(null)
};

function changeRows() {

    let element, wrap
    if (currInput === 'solution-container') {
        element = solutionContainer
        wrap = inputValues.solution.wrap
    } else {
        element = goalContainer
        wrap = inputValues.goal.wrap
    }

    let elementHeight, parentHeight, boardHeight;
    elementHeight = 50 + 50 * wrap.row + "px"
    parentHeight = 100 + 50 * wrap.row + "px"
    boardHeight = 450 + 50 * wrap.row + "px"
    element.animate(
        [{ height: elementHeight }], {
        fill: 'forwards',
        duration: 100,
        easing: 'ease',
    });
    element.parentNode.animate(
        [{ height: parentHeight }], {
        fill: 'forwards',
        duration: 100,
        easing: 'ease',
    });
    boardContainer.animate(
        [{ height: boardHeight }], {
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
                { top: 0, opacity: 0, easing: 'ease', },
                { top: 72 + 'px', opacity: 1, offset: 0.4, easing: 'ease', },
                { top: 68 + 'px', opacity: 1, offset: 0.8, easing: 'ease', },
                { top: 70 + 'px', opacity: 1, easing: 'ease', }
            ], {
            fill: "forwards",
            duration: 370,
        });
    }
    if (duration === 'persistent') return;
    notification.animate(
        [
            { top: 0, opacity: 1, easing: 'ease', },
            { top: 72 + 'px', opacity: 1, offset: 0.4, easing: 'ease', }
        ], {
        fill: "forwards",
        duration: 300,
        direction: 'reverse',
        delay: duration,
    });
}

const variationsArrowBox = document.querySelector('#variations-arrow-box')
variationsArrowBox.addEventListener('click', function () {
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
    variationsArrowBox.parentElement.classList.toggle('dark') // Remove
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
    selectorContainer.addEventListener('transitionend', function () {
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

function select(e) { e.stopPropagation() }

function toggleOrientation(e) {
    let cube = this.parentElement.parentElement.parentElement
    if (cube.classList.contains('divide') && this.dataset.type === "upsidedown") {
        notify(`Input Error!`, 'red', 'bounce', 1000, '40px', '120px')
        return;
    }
    this.classList.toggle('active')
    cube.classList.toggle(this.dataset.type)
}

// Answer Submission
submitButton.addEventListener('click', submitInput);
const newAnswer = document.createElement('div')
const answerBackground = document.createElement('div')
newAnswer.id = 'new-answer'

answerBackground.id = 'answer-background'
document.body.append(answerBackground)
document.body.append(newAnswer)

// When clicking on answer background, hide newAnswer and answerBackground
answerBackground.addEventListener('click', function () {
    newAnswer.classList.remove('shown')
    answerBackground.classList.remove('shown')
})

function submitInput() {
    try {
        console.log(inputValues)
        let nodes = []
        let arr = []

        for (let node of inputValues.solution.wrap.elements.flat()) {
            nodes.push(node)
            arr.push(translateName(node.classList[0]))
        }

        console.log(arr)
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

        // Calculation

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
                    case "l": return (Math.log(arr[0]) / Math.log(arr[2]))
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
                    if (val % 1 === 0 || val === 'j' || val === 'k') return ['number', 'natural', 'complex']
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
                if (num > 1) arr.push([1, num]);
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
                        arr.push(Math.pow(subsequentVal, 1 / index));
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
            if (cube.classList.contains('exponent')) {
                if (cube.classList.contains('sideways') || cube.classList.contains('upsidedown')) {
                    newVal = 10
                }
            } else if (cube.classList.contains('square-root')) {
                if (cube.classList.contains('sideways') || cube.classList.contains('upsidedown')) {
                    newVal = 11
                }
            }
            if (typeof newVal === "number") {
                if (cube.classList.contains('upsidedown')) newVal *= -1
                if (cube.classList.contains('sideways')) newVal = 1 / newVal
            } else {
                if (cube.classList.contains('sideways') && cube.classList.contains('divide')) newVal = 'l'
                if (cube.classList.contains('sideways') && cube.classList.contains('subtract')) newVal = 'i'
                if (cube.classList.contains('sideways') && cube.classList.contains('divide')) newVal = 'l'
                if (cube.classList.contains('upsidedown') && cube.classList.contains('divide')) newVal = 'l'
            }
            toParseArr.push(newVal)
        }
        console.log(toParseArr)
        let answerArr = parseInput(toParseArr)

        let title, paragraph = '', answer;
        (function checkInput() {

            title = 'Incorrect:'

            console.log(answerArr)
            let goalArr = puzzleData.variations.get('multipleOf') ? puzzleData.goalModValues : puzzleData.goalValues
            let deltaMap = new Map();
            for (let val of answerArr) {
                console.log(val)
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

            // let currWild = (i <= 2) ? inputValues.wildCube.solution1 : inputValues.wildCube.solution2
            // console.log(currWild)

            let requiredValues = clone(inputValues.required.values)
            let resourcesValues = clone(inputValues.resources.values)
            for (let i = 0; i < 4; i++) resourcesValues[i] = resourcesValues[i].concat(requiredValues[i])

            console.log(requiredValues)
            console.log(inputValues.resources.values)
            console.log(resourcesValues)
            // throw "STOP"
            // if (puzzleData.variationsMap.get('wild')) {
            //     requiredValues = requiredValues.replaceAll(puzzleData.variationsMap.get('wild'), translateName(currWild))
            //     resourcesValues = resourcesValues.replaceAll(puzzleData.variationsMap.get('wild'), translateName(currWild))
            // }

            // if (puzzleData.variationsMap.get('wild')) {
            //     arr = arr.replaceAll(puzzleData.variationsMap.get('wild'), translateName(currWild))
            // }
            let input = answer[1][answer[1].length - 1].flat()
            console.log(arr)
            console.log(input)

            if (inputValues.required.available.flat().length) {
                paragraph = `Required cubes missing from Solution.`
                return;
            } else { // DETECT OVERUSED RESOURCES
                let resources = resourcesValues.flat()
                console.log(resources)
                let modifiedResources = clone(resources)
                let operationRegex = /[+−x÷l^√]/

                for (let i = 0; i < input.length; i++) {
                    let val = input[i];
                    if (!isNaN(val)) {
                        if (val % 1 !== 0) val = 1 / val;
                        val = Math.abs(val).toString();
                    }

                    let multiOps;
                    if (puzzleData.variations.get('multipleOperations') && operationRegex.test(val)) {
                        multiOps = true
                    }
                    if (val === 'j' || val === 10) val = '^'
                    if (val === 'k' || val === 11) val = '√'

                    if (modifiedResources.includes(val)) {
                        if (!multiOps) modifiedResources = deleteFirstArrItem(modifiedResources, val)
                    } else {
                        if (resources.includes(val)) {
                            paragraph = `Resources does not contain a ${val} cube.`
                        } else {
                            paragraph = `Solution has too many ${val} cubes.`
                        }
                        return;
                    }
                }
            }
            title = 'Correct'
        })();

        // DISPLAYING ANSWER
        newAnswer.innerHTML = ''
        // HEADER

        const answerHeader = document.createElement('div')
        answerHeader.id = 'answer-header'
        const backButton = document.createElement('div')
        backButton.addEventListener('click', () => { answerBackground.click() })
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
        if (title === 'Correct') inputResult.classList.add('correct')

        const resultTitle = document.createElement('h2')
        const resultParagraph = document.createElement('p');
        resultTitle.innerText = title
        resultParagraph.innerText = paragraph

        inputResult.append(resultTitle)
        inputResult.append(resultParagraph)
        answerContent.append(inputResult)

        // GOAL
        const goalTitle = document.createElement('h2')
        goalTitle.innerText = 'Goal'
        goalTitle.id = 'goal-title'
        answerContent.append(goalTitle)

        const goalParagraph = (puzzleData.variations.get('multipleOf')) ? `Goal reduces down to:` : `Goal is equal to:`
        const goalList = document.createElement('ul')
        goalList.id = 'goal-list'
        goalList.style.cssText = 'display: flex; justify-content: center; flex-direction: column; text-align: left;'


        let goalArr = puzzleData.variations.get('multipleOf') ? puzzleData.goalModValues : puzzleData.goalValues
        goalArr = goalArr.sort((a, b) => { if (a.toString().length < b.toString().length) return -1 }
        )
        console.log(goalArr)
        for (let goal of goalArr) {
            const goalValue = document.createElement('li')
            goalValue.innerText = goal
            goalValue.style.cssText = 'text-align: left'
            goalList.append(goalValue)
        }

        answerContent.append(goalParagraph)
        answerContent.append(goalList)

        const goalHorizontalRule = document.createElement('hr')
        goalHorizontalRule.style.width = '86%'
        answerContent.append(goalHorizontalRule)

        // Title
        const titleNode = document.createElement('h2')
        titleNode.innerText = 'Your Solution'
        answerContent.append(titleNode)

        const inputSolutionContainer = document.createElement('div')
        const inputAnswer = document.createElement('div')
        inputSolutionContainer.classList = 'answer-solution-container'
        inputAnswer.classList = 'answer-solution-sub-container'

        for (let node of nodes) {
            const newNode = node.cloneNode('deep')
            newNode.style.left = '0px'
            newNode.style.top = '0px'
            inputAnswer.append(newNode)
        }
        inputSolutionContainer.append(inputAnswer)
        answerContent.append(inputSolutionContainer)

        // PARAGRAPH
        const evaluationParagraph = document.createElement('p')
        evaluationParagraph.innerText = `Your solution evaluates to ${answer[0]}`
        evaluationParagraph.classList.add('evaluation-paragraph')
        answerContent.append(evaluationParagraph)

        // INPUT BREAKDOWN
        const breakdownContainer = document.createElement('div')
        const breakdownContent = document.createElement('div')
        breakdownContainer.id = 'breakdown-container'
        breakdownContent.id = 'breakdown-content'
        console.log(answer[1])
        let breakdownHeight1 = 0
        for (let i = answer[1].length - 1; i >= -1; i--) {
            breakdownHeight1 += 38.4
            const level = document.createElement('p')
            let arr = answer[1][i]

            let string = ''
            // console.log(arr)
            function stringify(arr) {
                for (let j = 0; j < arr.length; j++) {
                    function pushNumber(input, index) {
                        if (index === input.length - 1) return base10(input[index]);
                        if (typeof input[index + 1] !== 'number') return base10(input[index]);
                        j++
                        let base = puzzleData.variations.get('base') ?? 10
                        return base10(input[index]) * base + base10(input[index + 1])
                    }

                    if (typeof arr[j] === 'number' || arr[j] === 'k' || arr[j] === 'j') {
                        string += (pushNumber(arr, j))
                    } else if (Array.isArray(arr[j])) {
                        string += "("
                        stringify(arr[j])
                        string += ")"
                    } else {
                        switch (arr[j]) {
                            case "l": string += 'log'; break;
                            case "#": string += 'x'; break;
                            default: string += arr[j]; break;
                        }
                    };
                }
            }
            if (i > -1) {
                stringify(arr)
            } else {
                string = answer[0]
            }
            level.innerText = string
            breakdownContent.append(level)
        }
        breakdownContainer.append(breakdownContent)
        answerContent.append(breakdownContainer)

        // SEPARATE ANSWER
        const inputSeparatorDiv = document.createElement('div')
        const horizontalRule = document.createElement('hr')
        inputSeparatorDiv.id = 'separator-div'
        horizontalRule.style.cssText = 'width: 100%;'
        inputSeparatorDiv.append(horizontalRule)
        answerContent.append(inputSeparatorDiv)

        // BREAKDOWN BUTTON
        const breakdownButton = document.createElement('div')
        const breakdownButtonLabel = document.createElement('p')
        breakdownButton.id = 'breakdown-button'
        breakdownButtonLabel.innerText = 'Show Breakdown'
        breakdownButton.append(breakdownButtonLabel)

        const arrowSvg = createSvg('arrow')
        arrowSvg.style.cssText = 'width: 14px; height: 14px; margin-left: 4px;'
        breakdownButton.append(arrowSvg)

        breakdownButton.addEventListener('click', function () {
            this.classList.toggle('active')
            let breakdownHeight
            if (this.classList.contains('active')) {
                breakdownButtonLabel.innerText = 'Hide Breakdown'
                breakdownHeight = breakdownHeight1
                if (Math.abs(answerContent.scrollHeight - answerContent.scrollTop - answerContent.clientHeight) < 1) {
                    answerContent.scrollTo({ top: answerContent.scrollTop - 1 })
                }
                const scrollElement = document.createElement('div')
                scrollElement.style.cssText = `height: ${breakdownHeight + "px"}; flex-shrink: 0;`
                answerContent.append(scrollElement)
                scrollElement.animate(
                    [{ height: "0px" }], {
                    fill: 'forwards',
                    duration: 450,
                    easing: 'cubic-bezier(.13,.94,.37,.99)',
                });
                breakdownContainer.animate(
                    [{ height: breakdownHeight + "px" }], {
                    fill: 'forwards',
                    duration: 450,
                    easing: 'cubic-bezier(.13,.94,.37,.99)',
                });
                let height = breakdownContent.offsetTop
                setTimeout(function () { answerContent.scrollTo({ top: height - 108, behavior: 'smooth' }) }, 8)
                // setTimeout(() => {clearInterval(scrollInterval)}, 750)
                // setTimeout(function() {breakdownContent.scrollIntoView(true, {behavior: "smooth"})}, 700)
                // setTimeout(function () {breakdownContent.scrollIntoView({behavior: 'smooth', block: 'start'})}, 0)
            } else {
                breakdownButtonLabel.innerText = 'Show Breakdown'
                breakdownHeight = 0
                breakdownContainer.animate(
                    [{ height: breakdownHeight + "px" }], {
                    fill: 'forwards',
                    duration: 450,
                    easing: 'cubic-bezier(.13,.94,.37,.99)',
                });
            }
        })
        inputSeparatorDiv.append(breakdownButton)

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
            if (currSymbol === "-") currSymbol = "−"
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

        // PARAGRAPH
        const solutionParagraph = document.createElement('p')
        solutionParagraph.innerText = `Solution evaluates to ${puzzleData.solution.solution}`
        solutionParagraph.classList.add('evaluation-paragraph')
        answerContent.append(solutionParagraph)

        // SOLUTION BREAKDOWN
        // const solutionSeparatorDiv = inputSeparatorDiv.cloneNode('deep')
        // answerContent.append(solutionSeparatorDiv)

        newAnswer.append(answerContent)

        answerBackground.classList.toggle('shown')
        newAnswer.classList.toggle('shown')

    } catch (error) {
        console.log(error)
        notify('Invalid input!', 'red', 'bounce', 1500, '', '')
    }
};

document.addEventListener('keydown', function (keypress) {
    if (keypress.key !== 'p') return
    console.log(inputValues)
    console.log(inputValues.solution.cursorRow)

    // answerContent.scrollTo({top: answerContent.scrollTop - 10})
    // console.log(answerContent.scrollTop)
    // console.log(answerContent.scrollHeight)
    // console.log(answerContent.offsetHeight)
});