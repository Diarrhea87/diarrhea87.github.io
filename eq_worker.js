importScripts("https://cdnjs.cloudflare.com/ajax/libs/mathjs/11.3.3/math.js");
onmessage = (e) => {

    console.log(e)

    if (e.data[0] === 'return') {
        postMessage(e.data[1]);
        return;
    }

    // console.groupCollapsed("GENERATE PUZZLE")

    let setTimer = new Date()
    function logTime(message, start) {
        let stopTimer = new Date();
        if (start) {
            console.log(message + math.round((stopTimer.getTime() - setTimer.getTime())/1000 - start, 3) + " SECONDS")
            return;
        }
        console.log(message + (stopTimer.getTime() - setTimer.getTime())/1000 + " SECONDS")
        return (stopTimer.getTime() - setTimer.getTime())/1000
    }

    function generatePuzzle(randomize = false, setCubes, setVariations) {

        let returnNewPuzzle;

        //GENERAL FUNCTIONS
        function getRandomNumber(min, max) {
            return Math.floor(Math.random() * (max + 1 - min)) + min;
        };
    
        function deleteArrIndex(array, index) {
            return array.slice(0, index).concat(array.slice(index + 1));
        };
    
        function deleteFirstArrItem(array, item) {
            if (!array.includes(item)) return array;
            let index = array.indexOf(item);
            return array.slice(0, index).concat(array.slice(index + 1));
        };
    
        function deleteFirstArrItems(array, ...items) {
            items.forEach(item => {
                let index = array.indexOf(item);
                array = array.slice(0, index).concat(array.slice(index + 1));
            })
            return array;
        }

        function randomArrayValue (arr) {
            return arr[getRandomNumber(0, arr.length - 1)]
        };

        function log(number, base) {
            return Math.log(number) / Math.log(base);
        }
    
        function customEval(arr, leftFlag, rightFlag) {
            let arrOperation = arr[1], answer = [], flag = []
            switch (arrOperation) {
                case "+":
                    answer.push(arr[0] + arr[2]);
                    flag.push(leftFlag + "+" + rightFlag); break;
                case "-":
                    answer.push(arr[0] - arr[2]);
                    flag.push(leftFlag + "-" + rightFlag); break;
                case "x":
                    answer.push(arr[0] * arr[2]);
                    flag.push(leftFlag + "x" + rightFlag); break;
                case "/":
                    answer.push(arr[0] / arr[2]);
                    flag.push(leftFlag + "÷" + rightFlag);
                    if (logarithm) {
                        answer.push(log(arr[0], arr[2]))
                        flag.push(leftFlag + 's÷' + rightFlag)
                    }
                    break;
                case "^":
                    let val;
                    if (arr[2] > 15 && parseBigInt) {
                        try {
                            arr[0] = BigInt(arr[0])
                            arr[2] = BigInt(arr[2])
                        } catch {
                            arr[0] = Number(arr[0])
                            arr[2] = Number(arr[2])
                            val = val = arr[0] ** arr[2]
                            if (val > Number.MAX_SAFE_INTEGER || val < Number.MIN_SAFE_INTEGER) {
                                return [[], []]
                            }
                        }
                        val = arr[0] ** arr[2]
                    } else {
                        val = arr[0] ** arr[2]
                        if (val > Number.MAX_SAFE_INTEGER) return [[], []]
                    }
                    answer.push(val);
                    flag.push(leftFlag + "^" + rightFlag); break;
            }
            return [answer, flag];
        }

        // console.log(math.equals())
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
    
        function filterDuplicates(arr) {
            return [...new Set(arr)]
        };

        function strToArr(string) {
            let arr = string.split("")
            for (let i = 0; i < arr.length; i++) {
                let num = parseFloat(arr[i])
                if (!isNaN(num)) arr[i] = num
            }
            return arr;
        };
        function isFactoriable(num) {
            if (!Number.isInteger(num)) return;
            if (num > 9 || num < 0) return;
            if (num === 1 || num === 2) return;
            return true;
        }

        function factorial(num) {
            let val = 1;
            for (let i = 2; i <= num; i++) val = val * i;
            return val;
        }

        function base(num, base) {
            num = num.toString()
            if (!num.includes(".")) num += ".0"
            let [integer, decimal = ""] = num.split('.')
            let sum = []
            for (let i = 0, arr = integer.split('').reverse(); i < integer.length; i++) {
                sum.push(arr[i] * base ** i)
            }
            for (let i = 0, arr = decimal.split(''); i < decimal.length; i++) {
                sum.push(arr[i] * base ** [-1 - i])
            }
            return sum.reduce((a, b) => a + b)
        }
    
        //GENERATION
    
        let cubesArr;
    
        (function generateCubes() {
            if (setCubes) {
                cubesArr = setCubes;
                console.log(cubesArr);
                return;
            }
            cubesArr = []

            const redCubes = [];
            for (let i = 0; i < 6; i++) {
                let roll = getRandomNumber(1, 6)
                switch (roll) {
                    case 1: redCubes.push(0); break;
                    case 2: redCubes.push(1); break;
                    case 3: redCubes.push(2); break;
                    case 4: redCubes.push(3); break;
                    case 5: redCubes.push("+"); break;
                    case 6: redCubes.push("-"); break;
                    default: redCubes.push(null);
                };
            };
            cubesArr.push(redCubes);
    
            const blueCubes = [];
            for (let i = 0; i < 6; i++) {
                let roll = getRandomNumber(1, 6)
                switch (roll) {
                    case 1: blueCubes.push(0); break;
                    case 2: blueCubes.push(1); break;
                    case 3: blueCubes.push(2); break;
                    case 4: blueCubes.push(3); break;
                    case 5: blueCubes.push("x"); break;
                    case 6: blueCubes.push("/"); break;
                    default: blueCubes.push(null);
                };
            };
            cubesArr.push(blueCubes);
    
            const greenCubes = [];
            for (let i = 0; i < 6; i++) {
                let roll = getRandomNumber(1, 6)
                switch (roll) {
                    case 1: greenCubes.push(4); break;
                    case 2: greenCubes.push(5); break;
                    case 3: greenCubes.push(6); break;
                    case 4: greenCubes.push("-"); break;
                    case 5: greenCubes.push("x"); break;
                    case 6: greenCubes.push("^"); break;
                    default: greenCubes.push(null);
                };
            };
            cubesArr.push(greenCubes);
    
            const blackCubes = [];
            for (let i = 0; i < 6; i++) {
                let roll = getRandomNumber(1, 6)
                switch (roll) {
                    case 1: blackCubes.push(7); break;
                    case 2: blackCubes.push(8); break;
                    case 3: blackCubes.push(9); break;
                    case 4: blackCubes.push("+"); break;
                    case 5: blackCubes.push("/"); break;
                    case 6: blackCubes.push("√"); break;
                    default: blackCubes.push(null);
                };
            };
            cubesArr.push(blackCubes);
    
            // IN THE UNLIKELY CHANCE THAT FEW NUMERALS OR OPERATIONS ARE ROLLED
            let numeralsArr = cubesArr.flat().filter(val => typeof val === "number");
            let operationsArr = cubesArr.flat().filter(val => typeof val === "string");
            if (numeralsArr.length < 8 || operationsArr.length < 8) generateCubes();
    
            console.log(cubesArr);
        })();
    
        let variationsMap = new Map();
        let logarithm, parseBigInt = true;
    
        (function generateVariations() {
            variationsMap = new Map();
            console.log(setVariations)
            setVariations = ['base', 'factorial', 'numberOfFactors']
            if (setVariations) {
                for (let x of setVariations) {
                    switch (x) {
                        case "wild": variationsMap.set("wild", variationInput("wild")); break;
                        case "powersOfBase": variationsMap.set("powersOfBase", true); break;
                        // case "base": variationsMap.set('base', variationInput("base")); break;
                        case "base": variationsMap.set('base', 12); break;
                        case "multipleOf": variationsMap.set("multipleOf", variationInput('multipleOf')); break;
                        case "multipleOperations": variationsMap.set("multipleOperations", true); break;
                        case "factorial": variationsMap.set("factorial", true); break;
                        case "numberOfFactors": variationsMap.set("numberOfFactors", true); break;
                        case "exponent":
                            while (!variationsMap.get('exponent')) {
                                let exponentColor = variationInput("exponent")
                                let coloredNumerals = cubesArr[exponentColor[0]].filter(val => typeof val === "number")
                                if (coloredNumerals.length) variationsMap.set("exponent", exponentColor[1]);
                            }
                            break;
                        case "imaginary": variationsMap.set("imaginary", true); break;
                        case "decimal": variationsMap.set("decimal", true); break;
                        case "log": variationsMap.set("log", true); break;
                    };
                };
            };
            function variationInput(input) { // GENERATES INPUT FOR VARIATIONS THAT REQUIRE INPUTS
                switch (input) {
                    case "wild": return getRandomNumber(0, 1) && cubesArr.flat().includes(0) ? 0 : "x";
                    case "base":
                        let base = getRandomNumber(8, 12);
                        return base === 10 ? variationInput("base") : base;
                    case "multipleof": return getRandomNumber(6, 11);
                    case "exponent":
                        switch (getRandomNumber(0, 3)) {
                            case 0: return [0, "red"];
                            case 1: return [1, "blue"];
                            case 2: return [2, "green"];
                            case 3: return [3, "black"];
                        }
                }
            }
            
            let i = 0;
            // let variationLength = setVariationsLength ?? 6
            let variationLength = 6;

            while (variationsMap.size < variationLength) {
                i++
                let roll = getRandomNumber(1, 11);
                    switch (roll) {
                        case 1:
                            break;
                            if (!!variationsMap.get('wild') && cubesArr.flat().some(val => val === 0 || val === "x")) {
                                variationsMap.set("wild", variationInput("wild"));
                            }; break;
                        case 2:
                            break;
                            if (!variationsMap.get('powersOfBase')) {
                                variationsMap.set("powersOfBase", true);
                            }; break;
                        case 3:
                            if (!variationsMap.get('base')) {
                                variationsMap.set("base", variationInput("base"));
                            }; break;
                        case 4:
                            if (!variationsMap.get('multipleOf')) {
                                variationsMap.set("multipleOf", variationInput("multipleof"));
                            }; break;
                        case 5:
                            if (!variationsMap.get('multipleOperations')) {
                                variationsMap.set("multipleOperations", true);
                            }; break;
                        case 6:
                            if (!variationsMap.get('factorial')) {
                                variationsMap.set("factorial", true);
                            }; break;
                        case 7:
                            if (!variationsMap.get('numberOfFactors')) {
                                variationsMap.set("numberOfFactors", true);
                            }; break;
                        case 8:
                            break;
                            if (!variationsMap.get('exponent')) {
                                let exponentColor = variationInput("exponent")
                                let coloredNumerals = cubesArr[exponentColor[0]].filter(val => typeof val === "number")
                                if (coloredNumerals.length) variationsMap.set("exponent", exponentColor[1]);
                            }; break;
                        case 9:
                            break;
                            if (!variationsMap.get('imaginary')) {
                                variationsMap.set("imaginary", true);
                            }; break;
                        case 10:
                            if (!variationsMap.get('decimal')) {
                                variationsMap.set("decimal", true);
                            }; break;
                        case 11:
                            if (!variationsMap.get('log')) {
                                variationsMap.set("log", true);
                            }; break;
                    }
                if (i > 100) break;
            };
            console.log(variationsMap)
        })();  

        let goalArr = [];
        let modifiedCubesArr = [...cubesArr];
        class GoalCube {
            constructor (cube, color, orientation) {
                this.cube = cube;
                this.color = color;
                this.orientation = orientation;
            };
        };

        (function generateGoal() {
            console.group("GENERATING GOAL: ")
            let resourcesArr = cubesArr.flat();
            let numeralsArr = resourcesArr.filter(val => typeof val === "number");
            let operationsArr = resourcesArr.filter(val => typeof val === "string");
            let coloredNumerals;
    
            //console.log(resourcesArr);
            //console.log(numeralsArr);
            //console.log(operationsArr);
    
            //FUNCTION ADDS CUBE TO GOAL THEN REMOVES IT FROM RESOURCES
            function goalAdd(cube, orientation = "up", forceColor = false) {
                // console.log("D")
                // console.log(randomNumerals)
                // console.log(randomNumerals[0])
                // console.log(cube)
                let colorIndex;
                //RANDOMLY CHOOSE COLOR INDEX UNTIL CUBE IS FOUND
                if (!forceColor) {
                    function findColorIndex(cube, ...index) {
                        let tryIndex = getRandomNumber(0, 3)
                        if (index.includes(tryIndex)) { // IF TRYINDEX ALREADY CHECKED, TRY AGAIN WITH ANOTHER INDEX
                            if (index.length === 4) {
                                console.log(index);
                                console.log(tryIndex);
                                return "NOT FOUND";
                            };
                            return findColorIndex(cube, ...index);
                        } else { // IF MCUBESARR CONTAINS TRYINDEX THEN SET COLOR INDEX, ELSE TRY AGAIN WITH ANOTHER INDEX
                            if (modifiedCubesArr[tryIndex].includes(cube)) return tryIndex;
                            index.push(tryIndex);
                            return findColorIndex(cube, ...index);
                        };
                    };
                    colorIndex = findColorIndex(cube);
                    if (typeof colorIndex !== "number") {
                        console.log(colorIndex);
                        return;
                    };
                } else {
                    colorIndex = forceColor;
                };
                
                let color;
                switch (colorIndex) {
                    case 0: color = "red"; break;
                    case 1: color = "blue"; break;
                    case 2: color = "green"; break;
                    case 3: color = "black"; break;
                };
                goalArr.push(new GoalCube(cube, color, orientation))
                
                //DELETE CUBE FROM OTHER ARRAYS
                modifiedCubesArr[colorIndex] = deleteFirstArrItem(modifiedCubesArr[colorIndex], cube);
                resourcesArr = deleteFirstArrItem(resourcesArr, cube);
    
                if (typeof cube === "number") {
                    numeralsArr = deleteFirstArrItem(numeralsArr, cube);
                    randomNumerals = deleteFirstArrItem(randomNumerals, cube);
                } else {
                    operationsArr = deleteFirstArrItem(operationsArr, cube);
                    randomOperations = deleteFirstArrItem(randomOperations, cube);
                };
                
                if (forceColor) {
                    coloredNumerals = deleteFirstArrItem(coloredNumerals, cube);
                };
            };
    
            //ADDING CUBES TO THE GOAL
            let randomNumerals = randomSort(numeralsArr);
            if (variationsMap.get('base')) randomNumerals = randomNumerals.filter(val => val < variationsMap.get('base'))
            console.log(randomNumerals)
            let randomOperations = randomSort(operationsArr).filter(val => (val !== "√" && val !== "/"));
            let zeroFilter = variationsMap.get('wild') === 0 ? () => true : (val) => val !== 0
    
            let goalStatus = [];
            console.log(operationsArr)
            function goalAdd2Numerals(thirdNumeral = true) {
                if (variationsMap.get("numberOfFactors") && operationsArr.includes("x") && !getRandomNumber(0, 4) && thirdNumeral && false) {
                        // IF # OF FACTORS: APPEND IT, THEN APPEND 2 NUMERALS (20%)
                        goalAdd("x");
                        goalAdd(randomNumerals.filter(zeroFilter)[0]);
                        goalAdd(randomNumerals[0]);
                        goalStatus.push("NUMFACTOR");
                    } else if (variationsMap.get("decimal") && !getRandomNumber(0, 3) && thirdNumeral) {
                        // IF DECIMAL POINT: ADD 3 NUMERALS (25%)
                        goalAdd(randomNumerals.filter(zeroFilter)[0]);
                        goalAdd(randomNumerals[0]);
                        goalAdd(randomNumerals[0]);
                    } else if (variationsMap.get('exponent') && !getRandomNumber(0, 4) && thirdNumeral && false) {
                        // IF EXPONENT: APPEND A NUMERAL THEN 2 NUMERALS OF EXPONENT COLOR (20%)
                        let exponentColor = variationsMap.get('exponent');
                        let colorIndex;
                        switch (exponentColor) {
                            case "red": colorIndex = 0; break;
                            case "blue": colorIndex = 1; break;
                            case "green": colorIndex = 2; break;
                            case "black": colorIndex = 3; break;
                        };
    
                        goalAdd(randomNumerals[0]);
                        try {
                            coloredNumerals = randomSort(modifiedCubesArr[colorIndex].filter(val => typeof val === "number"))
                        } catch (error) {
                            console.log(error)
                            console.log(modifiedCubesArr)
                            console.log(colorIndex)
                            console.log(exponentColor)
                            console.log(variationsMap.get('exponent'))
                            console.log(variationsMap)
                        }
                        
                        if (coloredNumerals.length >= 2) {
                            goalAdd(coloredNumerals[0], "up", colorIndex);
                            goalAdd(coloredNumerals[0], "up", colorIndex);
                        } else if (coloredNumerals.length >= 1) {
                            goalAdd(coloredNumerals[0], "up", colorIndex);
                        } else {
                            goalAdd(randomNumerals[0]);
                        };
                    } else {
                        // DEFAULT: APPEND 2 NUMERALS
                        goalAdd(randomNumerals.filter(zeroFilter)[0]);
                        goalAdd(randomNumerals[0]);
                        goalStatus.push("2NUM");
                    };
                };
            
            if (getRandomNumber(1, 10) > 4) { // APPEND 2 NUMERALS TO GOAL (60%)
                goalAdd2Numerals();
            } else { // APPEND 1 NUMERAL TO GOAL (40%)
                goalAdd(randomNumerals.filter(zeroFilter)[0]);
    
                //APPEND OPERATION AND NUMERALS
                if (randomOperations[0] === "^")  { // IF EXPONENT, APPEND IT + 1 NUMERAL
                    goalAdd(randomOperations[0]);
                    goalAdd(randomNumerals.filter(zeroFilter)[0]);
                    goalStatus.push("EXPONENTOP");
                } else { // ELSE APPEND OPERATION AND 1-3 NUMERALS
                    goalAdd(randomOperations[0]);
                    goalStatus.push("NUMOP");
                    getRandomNumber(0, 1) ? goalAdd2Numerals() : goalAdd(randomNumerals[0]);
                };
            };

            //STAGE 2: APPEND MORE NUMERALS IF THERE IS ROOM
            // if ((goalStatus.includes("NUMFACTOR") || (goalStatus.includes("2NUM") && variationsMap.get("multipleOf")))
            // && operationsArr.includes("^") && getRandomNumber(0, 1) && goalStatus.includes("NUMOP")) {
            if (variationsMap.get('multipleOf') && operationsArr.includes("^") && goalArr.length < 3) {
                //IF POSSIBLE, APPEND EXPONENT AND 1-2 NUMERALS (50%)
                goalAdd("^");
                goalAdd(randomNumerals.filter(zeroFilter)[0]);
                goalAdd(randomNumerals[0])
                // if (getRandomNumber(0, 4)) goalAdd(randomNumerals[0]) // APPEND SECOND NUMERAL (80%)
            } else if (goalArr.length === 2) { // IF GOAL LENGTH = 2: APPEND OPERATION AND 1 - 3 CUBES
                goalAdd(randomOperations.filter(val => val !== "^")[0]);
                getRandomNumber(0, 1) ? goalAdd2Numerals() : goalAdd(randomNumerals[0]);
            }
            if (goalArr.length === 3 && getRandomNumber(0, 2)) { // IF GOAL LENGTH = 3; APPEND OPERATION AND 1 - 2 CUBES (66%)
                if (!goalStatus.includes("EXPONENTOP")) {
                    goalAdd(randomOperations.filter(val => val !== "^")[0]);
                } else {
                    goalAdd(randomOperations.filter(val => val !== "^" && val !== "+" && val !== "-")[0]);
                }
                getRandomNumber(0, 1) ? goalAdd2Numerals(false) : goalAdd(randomNumerals[0]);
            } else if (goalArr.length === 4 && getRandomNumber(0, 1)) { // IF GOAL LENGTH = 4; APPEND OPERATION AND 1 CUBE (50%)
                goalAdd(randomOperations.filter(val => val !== "^")[0]);
                goalAdd(randomNumerals[0]);
            }
    
            console.log(goalArr);
            // let newArr = []
            // for (let x of goalArr) newArr.push(x.cube)
            // console.log(newArr)
            // throw "STOP"

            // console.log(modifiedCubesArr);
        })();
        let operationRegex = /[-+/x^]/
        const goalValues = [], goalFlags = [], goalModValues = [];
        //CALCULATE GOAL
        (function calcGoal(arr = goalArr, init = true) {
            if (init) {
                // goalArr.length = 0
                // variationsMap.set('factorial', undefined)
                // variationsMap.set('base', undefined)
                // variationsMap.set('decimal', true)
                // variationsMap.set('multipleOf', 11)
                // let goalString = "4^735"
                // console.log(strToArr(goalString))
                // for (let x of strToArr(goalString)) goalArr.push(new GoalCube(x, 'black', 'up'));
                console.log(goalArr)

                let newGoalArr = [];
                for (let i = 0; i < goalArr.length; i++) {

                    function pushNumber(index) {
                        // console.log("I")
                        // console.log(goalArr[index])
                        // console.log(goalArr[index + 1])
                        if (index === goalArr.length - 1) return goalArr[index].cube;
                        if (typeof goalArr[index + 1].cube === "string") return goalArr[index].cube;
                        i++
                        return parseFloat(`${goalArr[index].cube}${pushNumber(index + 1)}`)
                    }
                    if (typeof goalArr[i].cube === "number") {
                        newGoalArr.push(pushNumber(i))
                    } else {
                        newGoalArr.push(goalArr[i].cube)
                    };
                };
                console.log(newGoalArr)
                let values = calcGoal(newGoalArr, false)
                console.log(values)
                for (let val of values[0]) goalValues.push(val)
                for (let flag of values[1]) goalFlags.push(flag)
                if (variationsMap.get('multipleOf')) {
                    for (let val of values[0]) {
                        // console.log(val)
                        if (typeof val === 'number') {
                            goalModValues.push(val % variationsMap.get('multipleOf'))
                        } else {
                            goalModValues.push(Number(val % BigInt(variationsMap.get('multipleOf'))))
                        }
                    }
                }
                return values;
            } else if (arr.length >= 3) {
                let iterationCount = (arr.length - 1) / 2;
                let permutations = [];
                let flag = [];
                for (let i = 0; i < iterationCount; i++) {
                    let leftValues = calcGoal(arr.slice(0, (i + 1) * 2 - 1), false);
                    let rightValues = calcGoal(arr.slice((i + 1) * 2, arr.length), false);
                    let operation = arr[(i + 1) * 2 - 1];
                    for (let j = 0; j < leftValues[1].length; j++) {
                        if (operationRegex.test(leftValues[1][j])) leftValues[1][j] = "(" + leftValues[1][j] + ")";
                    };
                    for (let j = 0; j < rightValues[1].length; j++) {
                        if (operationRegex.test(rightValues[1][j])) rightValues[1][j] = "(" + rightValues[1][j] + ")";
                    };
                    for (let j = 0; j < leftValues[0].length; j++) {
                        for (let k = 0; k < rightValues[0].length; k++) {
                            let totalValue = customEval([leftValues[0][j], operation, rightValues[0][k]], leftValues[1][j], rightValues[1][k])
                            if (variationsMap.get('factorial') && !variationsMap.get('multipleOf')) {
                                let factorialCount = (leftValues[1][j] + rightValues[1][k]).match(/!/g) ?? ""
                                if (factorialCount.length > 2) continue;
                                if (arr.slice(0, (i + 1) * 2 - 1).length > 1 && factorialCount < 2 && isFactoriable(leftValues[0][j])) {
                                    let leftFactorial = customEval([factorial(leftValues[0][j]), operation, rightValues[0][k]], leftValues[1][j] + '!', rightValues[1][k])
                                    for (let l = 0; l < leftFactorial[0].length; l++) {
                                        totalValue[0].push(leftFactorial[0][l])
                                        totalValue[1].push(leftFactorial[1][l])
                                    }
                                }
                                if (arr.slice((i + 1) * 2, arr.length).length > 1 && factorialCount < 2 && isFactoriable(rightValues[0][k])) {
                                    let rightFactorial = customEval([leftValues[0][j], operation, factorial(rightValues[0][k])], leftValues[1][j], rightValues[1][k] + "!")
                                    for (let l = 0; l < rightFactorial[0].length; l++) {
                                        totalValue[0].push(rightFactorial[0][l])
                                        totalValue[1].push(rightFactorial[1][l])
                                    }
                                }
                            }
                            for (let l = 0; l < totalValue[0].length; l++) {
                                let value = totalValue[0][l]
                                if (typeof val === "number") {
                                    value = Math.round(totalValue[0][l] * 10000000000000) / 10000000000000
                                }
                                let push = true;
                                if (permutations.includes(value)) push = false;
                                if (push) {
                                    permutations.push(value);
                                    flag.push(totalValue[1][l]);
                                };
                            };
                        };
                    };
                };
                return [permutations, flag];
            } else if (arr.length === 1) {
                let answer = []; flag = []
                let num = variationsMap.get('base') ? parseInt(arr[0], variationsMap.get('base')) : arr[0]
                // console.log(parseInt(arr[0], variationsMap.get('base')))
                answer.push(num); flag.push(arr[0].toString())
                // console.log(num)

                if (variationsMap.get('decimal') && Number.isInteger(num)) {
                    for (let i = 1; i <= num.toString().length; i++) {
                        if (variationsMap.get('base')) {
                            answer.push(base(num / (10 ** i), variationsMap.get('base')))
                        } else {
                            answer.push(num / (10 ** i))
                        }
                        flag.push((num / (10 ** i)).toString())
                    }
                }
                if (variationsMap.get('factorial') && !variationsMap.get('multipleOf') && isFactoriable(num)) {
                    answer.push(factorial(num))
                    flag.push(arr[0] + "!")
                }
                // console.log(flag)
                return [answer, flag];
            }
        }());
        // throw "STOP"
        console.log(goalValues)
        console.log(goalFlags)
        console.log(goalModValues)
        
        console.log([...modifiedCubesArr.flat()])
        console.groupEnd()
        
        let forbiddenArr = [], forbiddenArrLength;
    
        (function generateForbidden() { // RANDOMLY ADD CUBES TO FORBIDDEN ARRAY
            console.group("VALUES AND FORBIDDEN: ")
            switch (goalArr.length) { // forbiddenArrLength BASED ON GOAL 
                case 3: forbiddenArrLength = 8 + getRandomNumber(0, 1); break;
                case 4: forbiddenArrLength = 7 + getRandomNumber(0, 1); break;
                case 5: forbiddenArrLength = 6 + getRandomNumber(0, 1); break;
                case 6: forbiddenArrLength = 5 + getRandomNumber(0, 1); break;
            }

            if (variationsMap.get('base')) {
                let cubesCloneArr = [...modifiedCubesArr[3]]
                for (let cube of cubesCloneArr) {
                    if (cube >= variationsMap.get('base')) {
                        forbiddenArr.push({"cube": cube, "color": "black"})
                        modifiedCubesArr[3] = deleteFirstArrItem(modifiedCubesArr[3], cube)
                    }
                }
            }

            function addForbiddenCubes(...index) {
                
                let tryIndex = getRandomNumber(0, 3);
                let currIndex = modifiedCubesArr[tryIndex];
                if (index.includes(tryIndex)) { // IF TRYINDEX ALREADY CHECKED, TRY AGAIN WITH ANOTHER INDEX
                    if (index.length === 4) {
                        console.log(index)
                        console.log(tryIndex)
                        return;
                    }
                    addForbiddenCubes(...index);
                 } else if (forbiddenArr.length < forbiddenArrLength) {
                    let filterFunc = (val) => true
                    // NO LESS THAN 5 NUMBERS / OPERATIONS
                    if (modifiedCubesArr.flat().filter(val => typeof val === "number").length < 5) {
                        filterFunc = (val => typeof val === "string")
                    } else if (modifiedCubesArr.flat().filter(val => typeof val === "string").length < 5) {
                        filterFunc = (val => typeof val === "number")
                    }
                    //IF FILTERED MCUBESARR CONTAINS TRYINDEX THEN APPEND TO FORBIDDEN, ELSE TRY AGAIN WITH ANOTHER INDEX
                    if (currIndex.filter(filterFunc).length) {
    
                        let color = "";
                        switch (tryIndex) {
                            case 0: color = "red"; break;
                            case 1: color = "blue"; break;
                            case 2: color = "green"; break;
                            case 3: color = "black"; break;
                        }
    
                        forbiddenArr.push({"cube": currIndex.filter(filterFunc)[0], "color": color})
                        modifiedCubesArr[tryIndex] = deleteFirstArrItem(currIndex, currIndex.filter(filterFunc)[0])
                        addForbiddenCubes(...index)
    
                    } else {
                        index.push(tryIndex);
                        addForbiddenCubes(...index)
                    }
                }
            };
    
            addForbiddenCubes();
    
        })();
        
        console.log(modifiedCubesArr)
        console.log(forbiddenArr)

        let allValues = modifiedCubesArr.flat();
        
        // allValues = [1, 7, 5, 9, "+", "+", "+"]
    
        let numeralsArr = allValues.filter(val => typeof val === "number")
        let operationsArr = allValues.filter(val => typeof val === "string" && val !== "√")
        let containsSqrt = allValues.includes("√")
        console.log(allValues);
        console.log(numeralsArr);
        console.log(operationsArr);
        console.groupEnd()

        let permutationsArr = [], solution;
        
        (function generateSolutions() {
            console.group("GENERATING SOLUTIONS: ")

            class Solution {
                constructor(solution, flag, cubes) {
                    this.solution = solution;
                    this.flag = flag;
                    this.cubes = cubes
                }
            }

            if (variationsMap.get('log')) logarithm = true;
            parseBigInt = false;

            let stop;
            let calcCount = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ,0]
            const solutionsArr = []
            const solutionLengths = [1, 3];
    
            function calcSolution(arr, init = 0) {
                if (arr.length >= 3) {
                    let iterationCount = (arr.length - 1) / 2;
                    let permutations = [];
                    let flag = [];
                    for (let i = 0; i < iterationCount; i++) {
                        let leftValues = calcSolution(arr.slice(0, (i + 1) * 2 - 1));
                        let rightValues = calcSolution(arr.slice((i + 1) * 2, arr.length));
                        let operation = arr[(i + 1) * 2 - 1];
                        for (let j = 0; j < leftValues[1].length; j++) {
                            if (leftValues[1][j].length >= 3) leftValues[1][j] = "(" + leftValues[1][j] + ")";
                        };
                        for (let j = 0; j < rightValues[1].length; j++) {
                            if (rightValues[1][j].length >= 3) rightValues[1][j] = "(" + rightValues[1][j] + ")";
                        };
                        for (let j = 0; j < leftValues[0].length; j++) {
                            if (leftValues[0][j] > 10 ** 6) continue;
                            for (let k = 0; k < rightValues[0].length; k++) {
                                if (rightValues[0][j] > 10 ** 6) continue;
                                let integer;
                                if (Number.isInteger(leftValues[0][j]) && Number.isInteger(rightValues[0][j])) integer = true;
                                if (!variationsMap.get('multipleOperations') && variationsMap.get('factorial')) {
                                    let factorialArr = (leftValues[1][j] + rightValues[1][k]).match(/!/g) ?? ''
                                    if (factorialArr.length > 2) continue;
                                }
                                let totalValue = customEval([leftValues[0][j], operation, rightValues[0][k]], leftValues[1][j], rightValues[1][k])
                                for (let l = 0; l < totalValue[0].length; l++) {
                                    value = Math.round(totalValue[0][l] * 10000000000000) / 10000000000000
                                    // if (Math.round(totalValue[0][l]) === -82 && !Number.isInteger(totalValue[0][l])) {
                                    //     console.log("E")
                                    //     console.log(totalValue[0])
                                    //     console.log(totalValue[0][l] * 10000000000000)
                                    //     console.log(Math.round(totalValue[0][l] * 100000000000) / 100000000000)
                                    //     console.log(value)
                                    //     console.log(math.equal(value, -82.4))
                                    // }
                                    if (!integer && !Number.isInteger(value)) continue;
                                    let push = true;
                                    if (permutations.includes(value)) push = false;
                                    if (value > 10 ** 3) push = false;
                                    if (push) {
                                        permutations.push(value);
                                        flag.push(totalValue[1][l]);
                                    };
                                };
                            };
                        };
                    };
                    // if (init) return [permutations.sort((a, b) => a - b), flag];
                    return [permutations, flag];
                } else if (arr.length === 1) {
                    let num = arr[0], answer = [], flag = []
                    if (num >= 10) {
                        answer.push(parseInt(num, variationsMap.get('base'))); flag.push(arr[0].toString())
                    } else {
                        answer.push(num); flag.push(arr[0].toString())
                        answer.push(-1 * num); flag.push("u" + arr[0])
                        answer.push(1 / num); flag.push("s" + arr[0])
                        answer.push(-1 / num); flag.push("n" + arr[0])
                        if (variationsMap.get('factorial') && isFactoriable(num)) {
                            answer.push(factorial(num)); flag.push(arr[0] + "!")
                        }
                    }
                    return [answer, flag];
                }
            }
            // console.log(Math.round((-19.6) * 10000000000000) / 10000000000000)
            
            // console.log(calcSolution(strToArr("3"), 3))
            // let permutations = (calcSolution(strToArr('1+3x5/7+3x8/1+9'), 3, 1))[0]
            // let b = logTime("PRE ")
            // console.log(permutations)
            // console.log(calcSolution(strToArr('1x5/7/6'), 3))
            // let abacus
            // goalValues.length = 0
            // goalValues.push(1, 2, 3, 4)
            // console.log(goalValues)
            // for (let i = 0; i < 10000; i++) { 
            //     for (let j of permutations) {
            //         // for (let k of goalValues) abacus = (math.equal(j, k))
            //         abacus = (goalValues.includes(j))
            //     }
            // }
            // console.log(abacus)
            // logTime("1 ", b)
            // throw 'STOP'
            // let arr = [1, 3, 3]
            // let newArr = []

            // let foo = logTime("PRE")
            // let regex = /!/g, string1 = "14194!10490", string2 = "1419!41049!0"
            // let match1, match2, total;
            // for (let i = 0; i < 10000000; i++) {
            //     // total = num.toString()
            // }
            // console.log(total)
            // logTime("POST", foo)
            // throw "STOP"
            function solutionCycle(arr, numerals, operations) {
                if (stop) return
                if (permutationsArr.length % 100000 === 0 && permutationsArr.length) {
                    console.log((permutationsArr.length/1000) + " THOUSAND")
                    console.log(logTime())
                    if (logTime() > 7) stop = true;
                }
                if (!solutionLengths.includes(arr.length)) {
                    let permutationValues = calcSolution(arr)
                    calcCount[(arr.length - 1) / 2]++;
                    for (let i = 0, l = permutationValues[0].length; i < l; i++) {
                        let solutionEval = permutationValues[0][i]
                        let solutionFlag = permutationValues[1][i];
                        if (variationsMap.get('multipleOf')) {
                            if (!goalModValues.includes(solutionEval % variationsMap.get('multipleOf'))) continue;
                            if (goalValues.includes(solutionEval)) continue;
                        } else {
                            if (!goalValues.includes(solutionEval)) continue;
                        }
                        let cubesArr = [];
                        for (let cube of arr) {
                            if (typeof cube === "string" || cube < 10) {
                                cubesArr.push(cube)
                            } else {
                                stringNum = cube.toString()
                                for (let i = 0; i < stringNum.length; i++) {
                                    cubesArr.push(parseFloat(stringNum.charAt(i)))
                                }
                            }
                        }
                        solutionsArr.push(new Solution(solutionEval, solutionFlag, cubesArr));
                        solutionLengths.push(arr.length);
                        if (!getRandomNumber(0, 10)) {
                            console.log("ENDING CYCLE")
                            stop = true;
                        }
                        break;
                    };
                };
                permutationsArr.push(arr)
    
                if (numerals.length && operations.length) {
                    for (let i of filterDuplicates(operations)) {
                        for (let j of filterDuplicates(numerals)) {
                            if (variationsMap.get('base')) {
                                if (i !== 0 && Math.random() >= 0.5 && numerals.length > 1) {
                                    for (let k of deleteFirstArrItem(filterDuplicates(numerals), j)) {
                                    solutionCycle(arr.concat(i).concat(parseFloat(`${j}${k}`)), deleteFirstArrItems(numerals, j, k), deleteFirstArrItem(operations, i))
                                    }
                                } else {
                                    solutionCycle(arr.concat(i).concat(j), deleteFirstArrItem(numerals, j), deleteFirstArrItem(operations, i))
                                }
                            } else {
                                solutionCycle(arr.concat(i).concat(j), deleteFirstArrItem(numerals, j), deleteFirstArrItem(operations, i))
                            };
                        };
                    };
                };
            };
            console.log(numeralsArr)
            for (let i of filterDuplicates(numeralsArr)) {
                if (variationsMap.get('base')) {
                    if (i !== 0 && Math.random() >= 0.5) {
                        for (let j of deleteFirstArrItem(filterDuplicates(numeralsArr), i)) {
                            solutionCycle([parseFloat(`${i}${j}`)], deleteFirstArrItems(numeralsArr, i, j), operationsArr);
                        }
                    } else {
                        solutionCycle([i], deleteFirstArrItem(numeralsArr, i), operationsArr);
                    }
                } else {
                    solutionCycle([i], deleteFirstArrItem(numeralsArr, i), operationsArr);
                }
            }
            
            // console.log("SAMPLE: ")
            // for (let i = 0; i < 10; i++) {
            //     let randomIndex = permutationsArr[getRandomNumber(0, permutationsArr.length - 1)]
            //     console.log(randomIndex)
            //     console.log(calcSolution(randomIndex))
            // }
            console.log("TOTAL LENGTH: " + permutationsArr.length)
            console.log(calcCount)
            console.log(goalValues)
            console.log(goalModValues)
            console.log(goalArr)
            console.log(solutionsArr)

            if (solutionsArr.length === 0) {
                console.log("NO SOLUTION, NEW PUZZLE");
                if (randomize) returnNewPuzzle = true;
            } else {
                let highestSolutionLengthIndex = solutionLengths.indexOf(solutionLengths.slice().sort((a, b) => a - b)[solutionLengths.length - 1]);
                solution = solutionsArr[highestSolutionLengthIndex - 2];
                console.log("SOL", solution);
            };
            logTime("DONE: ")
            console.groupEnd()
        })();


        // MOVING CUBES FROM FORBBIDEN BACK TO RESOURCES
        console.log(forbiddenArr)
        let count = getRandomNumber(0, forbiddenArr.length)
        console.log(count)
        for (let i = 0; i < count; i++) {
            let toPush = randomArrayValue(forbiddenArr), index;
            switch (toPush.color) {
                case "red": index = 0; break;
                case "blue": index = 1; break;
                case "green": index = 2; break;
                case "black": index = 3; break;
            };
            modifiedCubesArr[index].push(toPush.cube)
            forbiddenArr = deleteFirstArrItem(forbiddenArr, toPush);
        }
        console.log(forbiddenArr)
        if (returnNewPuzzle) return generatePuzzle(randomize, setCubes);
        class PuzzleData {
            constructor(cubesArr, modifiedCubesArr, variations, goalArr, goalValues, goalModValues, forbiddenArr, solution) {
                this.cubes = cubesArr;
                this.modifiedCubes = modifiedCubesArr;
                this.variations = variations
                this.goal = goalArr;
                this.goalValues = goalValues;
                this.goalModValues = goalModValues;
                this.forbidden = forbiddenArr;
                this.solution = solution;
            };
        };
        return new PuzzleData(cubesArr, modifiedCubesArr, variationsMap, goalArr, goalValues, goalModValues, forbiddenArr, solution)
    };

    let queueData = generatePuzzle(...e.data)
    console.log(queueData)
    console.groupEnd()
    console.log('DONE GENERATION')

    postMessage(queueData);
}


// 0X Wild / Powers of the Base Conflict: Wild representing 1 can represent power ? Assume they cannot
// Exponent / UD / SW Conflict: Exponent can be sideways or upsidedown ? Assume they cannot

// multiple of k, decimal in goal (2)
// NUMBERAL CUBES !IN SOLUTIONS! CAN BE SW AND UD
// 0X wild : MUST REPRESENT SAME THING EVERYWHERE, MOPS ALLOWS MULTIPLE USES OF OPERATIONS (3)
// UD (4)
// ^ = 10 (BASE M)
// SW (5)
// Powers of the Base (6)
// BASE M (7)
// MOPS (8)
// Imaginary / Log (10)
// Exponent (11)
// ! and # of Factors during parsing (no larger than 8!; x(a ^ b + c) is prohibited) (13)