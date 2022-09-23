let setTimer = new Date()

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
function test() {
    let stopTimer = new Date(); console.log((stopTimer.getTime() - setTimer.getTime())/1000 + " SECONDS");
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
test()

function calcScore(inputArr, type = 1) {
    let score = [0, 0, 0, 0, 0, false, false, false]
    if (type === 2) {
        for (let i = 0, l = inputArr.length; i < l; i += 2) {
            // console.log(inputArr[i])
            for (let j = 0, l = inputArr[i].length; j < l; j++) {
                // console.log(inputArr[i].charAt(j))
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

function generatePuzzle() {
    let returnNewPuzzle;

    // GENERAL FUNCTIONS:

    function generateRandomNumber(min, max) {
        return Math.floor(Math.random() * (max + 1 - min)) + min;
    };

    function randomArrayValue (arr) {
        return arr[generateRandomNumber(0, arr.length - 1)]
    };

    function containsVariation(input) {    // DOES ARRAY CONTAIN INPUT VARIATION?
        return (variationsArr.findIndex(val => Object.keys(val)[0] === input) !== -1)
    }

    function translateBRGY(val) {
        switch (val) {
            case "B": return blue;
            case "R": return red;
            case "G": return green;
            case "Y": return yellow;
            case "V": return universeArr;
            default: return val;
        };
    };

    function setOperation(arr) {
        let val1 = translateBRGY(arr[0]);
        let val2 = translateBRGY(arr[2]);
        switch (arr[1]) {
            case "U":
                // return filterDuplicates(val1.concat(val2));
                return val1.concat(val2.filter(val => !val1.includes(val)));
            case "∩":
                return val1.filter(val => val2.includes(val));
            case "-":
                // if (symmetricDifference) {
                    return val1.filter(val => !val2.includes(val)).concat(val2.filter(val => !val1.includes(val)))
                // } else {
                    // return val1.filter(val => !val2.includes(val));
                // };
        };
    };

    function compareArr(arr1, arr2) {    // RETURNS TRUE IF ARRAYS ARE EQUAL
        if (arr1.length !== arr2.length) return false;
        arr1.sort();
        arr2.sort();
        for (let i = 0; i < arr1.length; i++) if (arr1[i] !== arr2[i]) return false;
        return true;
    }

    function calcSet(arr, init = 0, universe = universeArr) {    // CALCULATE DEFINITION FOR SETS

        if (arr.length === 3) {
            let answer = [setOperation(arr)];
            if (arr[1] === "U") answer.push(setOperation([arr[0], "∩", arr[2]]));    // U/∩ INTERCHANGABLE

            // V/Ʌ INTERCHANGABLE
            if (arr[0] === "V") {
                if (arr[2] === "V") return [universe, []];
                answer.push([]);
                if (not) {
                    if (arr[1] === "-") answer.push(translateBRGY(arr[2]));
                    if (arr[1] === "U") answer.push(universe.filter(val => translateBRGY(arr[2]).indexOf(val) === -1));
                };
                return answer;
            } else if (arr[2] === "V") {
                if (arr[1] === "-") answer.push(translateBRGY(arr[0]));
                if (arr[1] === "U") answer.push([]);    // U/∩ INTERCHANGABLE
                if (not) answer.push(universe.filter(val => translateBRGY(arr[0]).indexOf(val) === -1));
                return answer;
            };
            if (not) {
                let leftNot = universe.filter(val => translateBRGY(arr[0]).indexOf(val) === -1);
                let rightNot = universe.filter(val => translateBRGY(arr[2]).indexOf(val) === -1);
                answer.push(setOperation([leftNot, arr[1], arr[2]]));    // L' U R
                answer.push(setOperation([arr[0], arr[1], rightNot]));    // L' U R
                answer.push(setOperation([leftNot, arr[1], rightNot]));    // L' U R'
                // (L U R)' 
                if (init) answer.push(universe.filter(val => setOperation(arr).indexOf(val) === -1));
                if (arr[1] === "U") {       // U/∩ INTERCHANGABLE
                    answer.push(setOperation([leftNot, "∩", arr[2]]));    // L' U R
                    answer.push(setOperation([arr[0], "∩", rightNot]));    // L' U R
                    answer.push(setOperation([leftNot, "∩", rightNot]));    // L' U R'
                    // (L U R)'
                    if (init) answer.push(universe.filter(val => setOperation([arr[0], "∩", arr[2]]).indexOf(val) === -1));
                };
            };
            return answer
        } else if (arr.length > 3) {
            let iterationCount = (arr.length - 1) / 2;
            let permutations = [];

            for (let i = 0; i < iterationCount; i++) {
                let leftValues = calcSet(arr.slice(0, (i + 1) * 2 - 1), 0, universe);
                let rightValues = calcSet(arr.slice((i + 1) * 2, arr.length), 0, universe);
                for (let lValue of leftValues) {
                    for (let rValue of rightValues) {
                        let totalValue = calcSet([lValue, arr[(i + 1) * 2 - 1], rValue], 0, universe);
                        for (let i of totalValue) {
                            let push = true;
                            for (let j of permutations) if (compareArr(i, j)) push = false;
                            if (push) permutations.push(i.sort());
                        };
                    };
                };
            };
            return permutations;

        } else if (arr.length === 1) {
            let answer = []
            answer.push(translateBRGY(arr[0]))
            if (arr[0] === "V") return [universeArr, []];
            if (not && init) answer.push(universe.filter(val => translateBRGY(arr[0]).indexOf(val) === -1))
            return answer;
        };
    };

    function advancedCalcSet(arr, universe, init = 0, leftVal = arr[0], rightVal = arr[2]) {
        if (arr.length === 3) {
            let answer = [setOperation(arr)];
            let flag = [leftVal + arr[1] + rightVal];
            if (arr[1] === "U") {    // U/∩ INTERCHANGABLE
                answer.push(setOperation([arr[0], "∩", arr[2]]));
                flag.push(leftVal + "∩" + rightVal);
            }
            // V/Ʌ INTERCHANGABLE
            if (arr[0] === "V") {
                if (arr[2] === "V") {
                    answer = [universe, []]
                    if (arr[1] === "U") {
                        switch(generateRandomNumber(1, 4)) {
                            case 1: flag = ["VUV"]; break;
                            case 2: flag = ["VUɅ"]; break;
                            case 3: flag = ["ɅUV"]; break;
                            case 4: flag = ["V∩V"]; break;
                        };
                        switch (generateRandomNumber(1, 4)) {
                            case 1: flag.push("V∩Ʌ"); break;
                            case 2: flag.push("Ʌ∩V"); break;
                            case 3: flag.push("Ʌ∩Ʌ"); break;
                            case 4: flag.push("ɅUɅ"); break;
                        };
                    } else if (symmetricDifference) {    // OPERATION IS "-"
                        switch (generateRandomNumber(1, 2)) {
                            case 1: flag = [("Ʌ-V")]; break;
                            case 2: flag = [("V-Ʌ")]; break;
                        };
                        switch (generateRandomNumber(1, 2)) {
                            case 1: flag.push("V-V"); break;
                            case 2: flag.push("Ʌ-Ʌ"); break;
                        };
                    } else {    // OPERATION IS "-"
                        flag = ["V-Ʌ"];
                        switch (generateRandomNumber(1, 3)) {
                            case 1: flag.push("V-V"); break;
                            case 2: flag.push("Ʌ-V"); break;
                            case 3: flag.push("Ʌ-Ʌ"); break;
                        };
                    };
                    return [answer, flag];
                };
                if (arr[1] === "-") {
                    if (symmetricDifference) {
                        answer.push(translateBRGY(arr[2]))
                        flag.push(`Ʌ-${arr[2]}`)
                        return [answer,flag]
                    }
                    flag.push(`Ʌ-${arr[2]}`) 
                } else {
                    flag.push(`Ʌ∩${arr[2]}`)
                };
                answer.push([]);
                if (not) {
                    if (arr[1] === "-") {
                        answer.push(translateBRGY(arr[2]));
                        flag.push(`V-${arr[2]}'`)
                    };
                    if (arr[1] === "U") {
                        answer.push(universe.filter(val => !translateBRGY(arr[2]).includes(val)));
                        flag.push(`V∩${arr[2]}'`)
                    };
                };
                return [answer, flag];
            } else if (arr[2] === "V") {
                if (arr[1] === "-") {
                    if (symmetricDifference) {
                        answer.push(translateBRGY(arr[2]))
                        flag.push(`Ʌ-${arr[2]}`)
                        return [answer,flag]
                    }
                    answer.push(translateBRGY(arr[0]));
                    flag.push(`${leftVal}-Ʌ`);
                };
                if (arr[1] === "U") {
                    answer.push([]);
                    flag.push(`${leftVal}∩Ʌ`);
                };
                if (not) {
                    answer.push(universe.filter(val => translateBRGY(arr[0]).indexOf(val) === -1));
                    (arr[1] === "U") ? flag.push(`${leftVal}'∩V`) : flag.push(`${leftVal}'-Ʌ`);
                };
                return [answer, flag];
            };
            if (not) {
                let leftNot = universe.filter(val => translateBRGY(arr[0]).indexOf(val) === -1);
                let rightNot = universe.filter(val => translateBRGY(arr[2]).indexOf(val) === -1);
                answer.push(setOperation([leftNot, arr[1], arr[2]]));    // L' U R
                answer.push(setOperation([arr[0], arr[1], rightNot]));    // L U R'
                answer.push(setOperation([leftNot, arr[1], rightNot]));    // L' U R'
                flag.push(leftVal + "'" + arr[1] + rightVal);
                flag.push(leftVal + arr[1] + rightVal + "'")
                flag.push(leftVal + "'" + arr[1] + rightVal + "'")
                if (init) {    // (L U R)' 
                    answer.push(universe.filter(val => setOperation(arr).indexOf(val) === -1));
                    flag.push("(" + leftVal + arr[1] + rightVal + ")'")
                };
                if (arr[1] === "U") {       // U/∩ INTERCHANGABLE
                    answer.push(setOperation([leftNot, "∩", arr[2]]));    // L' U R
                    answer.push(setOperation([arr[0], "∩", rightNot]));    // L U R'
                    answer.push(setOperation([leftNot, "∩", rightNot]));    // L' U R'
                    flag.push(leftVal + "'" + "∩" + rightVal);
                    flag.push(leftVal + "∩" + rightVal + "'")
                    flag.push(leftVal + "'" + "∩" + rightVal + "'")
                    if (init) {    // (L U R)'
                        answer.push(universe.filter(val => setOperation([arr[0], "∩", arr[2]]).indexOf(val) === -1));
                        flag.push("(" + leftVal + "∩" + rightVal + ")'")
                    };
                };
            };
            if (init) {
                for (let i = 0, l = answer.length; i < l; i++) {
                    answer[i] = answer[i].filter(val => universe.includes(val));
                };
            };
            return [answer, flag]

        } else if (arr.length > 3) {

            let iterationCount = (arr.length - 1) / 2;
            let permutations = [];
            let flag = [];
            for (let i = 0; i < iterationCount; i++) {
                let leftValues = advancedCalcSet(arr.slice(0, (i + 1) * 2 - 1), universe);
                let rightValues = advancedCalcSet(arr.slice((i + 1) * 2, arr.length), universe);
                let operation = arr[(i + 1) * 2 - 1];
                for (let j = 0; j < leftValues[1].length; j++) {
                    if (leftValues[1][j].length >= 3) leftValues[1][j] = "(" + leftValues[1][j] + ")";
                };
                for (let j = 0; j < rightValues[1].length; j++) {
                    if (rightValues[1][j].length >= 3) rightValues[1][j] = "(" + rightValues[1][j] + ")";
                };
                for (let j = 0; j < leftValues[0].length; j++) {
                    for (let k = 0; k < rightValues[0].length; k++) {
                        let totalValue = advancedCalcSet([leftValues[0][j], operation, rightValues[0][k]], universe, 0, leftValues[1][j], rightValues[1][k]);
                        for (l = 0; l < totalValue[0].length; l++) {
                            let push = true;
                            for (let j of permutations) if (compareArr(totalValue[0][l], j)) push = false;
                            if (push) {
                                permutations.push(totalValue[0][l].sort());
                                flag.push(totalValue[1][l]);
                            };
                        };
                    };
                };
            };
            if (init) {
                for (let i = 0, l = permutations.length; i < l; i++) {
                    permutations[i] = permutations[i].filter(val => universe.includes(val));
                };
            };
            return [permutations, flag];

        } else if (arr.length === 1) {

            let answer = [];
            let flag = [arr[0]];
            answer.push(translateBRGY(arr[0]));
            if (arr[0] === "V") return [[universeArr, []], ["V", "Ʌ"]];
            if (not && init) {
                answer.push(universe.filter(val => translateBRGY(arr[0]).indexOf(val) === -1));
                flag.push(arr[0] + "'");
            };
            if (init) {
                for (let i = 0, l = answer.length; i < l; i++) {
                    answer[i] = answer[i].filter(val => universe.includes(val));
                };
            };
            return [answer, flag];
        };
    };

    // ROLE CUBES:

    let cubesArr;

    (function generateCubes() {
        cubesArr = [];

        // COLORS:
        const colors = [];
        for (let i = 0; i < 8; i++) {
            let roll = generateRandomNumber(1, 6)
            switch (roll) {
                case 1: colors.push("R"); break;
                case 2: colors.push("R"); break;
                case 3: colors.push("B"); break;
                case 4: colors.push("B"); break;
                case 5: colors.push("G"); break;
                case 6: colors.push("Y"); break;
                default: colors.push(null);
            };
        };
        cubesArr.push(colors);

        // NUMBERS:
        const numbers = [];
        for (let i = 0; i < 3; i++) {
            let roll = generateRandomNumber(1, 6)
            switch (roll) {
                case 1: numbers.push(1); break;
                case 2: numbers.push(1); break;
                case 3: numbers.push(2); break;
                case 4: numbers.push(3); break;
                case 5: numbers.push(4); break;
                case 6: numbers.push(5); break;
                default: numbers.push(null);
            };
        };
        cubesArr.push(numbers);

        // OPERATIONS:
        const operations = [];
        for (let i = 0; i < 4; i++) {
            let roll = generateRandomNumber(1, 6)
            switch (roll) {
                case 1: operations.push("-"); break;
                case 2: operations.push("'"); break;
                case 3: operations.push("U"); break;
                case 4: operations.push("U"); break;
                case 5: operations.push("∩"); break;
                case 6: operations.push("∩"); break;
                default: operations.push(null);
            };
        };
        cubesArr.push(operations);

        // RESTRICTIONS:
        const restrictions = [];
        for (let i = 0; i < 3; i++) {
            let roll = generateRandomNumber(1, 6)
            switch (roll) {
                case 1: restrictions.push("Ʌ"); break;
                case 2: restrictions.push("V"); break;
                case 3: restrictions.push("<"); break;
                case 4: restrictions.push("<"); break;
                case 5: restrictions.push("="); break;
                case 6: restrictions.push("="); break;
                default: restrictions.push(null);
            };
        };
        cubesArr.push(restrictions);

        console.log(cubesArr);
    })();

    // GENERATE UNIVERSE:
    let universeArr;

    (function generateUniverse() {
        universeArr = randomSort(["BRGY","BRG","BRY","BR","BGY","BG","BY","B","RGY","RG","RY","R","GY","G","Y",""]).slice(0, generateRandomNumber(10, 14));        
    })();

    let blue, red, green, yellow;
    blue = universeArr.filter(val => /B/.test(val));
    red = universeArr.filter(val => /R/.test(val));
    green = universeArr.filter(val => /G/.test(val));
    yellow = universeArr.filter(val => /Y/.test(val));

    console.log(universeArr)
    // GENERATE VARIATIONS:
    let variationsArr;
    let requiredCube, wild, noNull, double, forbiddenCard, requiredCard, blankWild, symmetricDifference, twoSolutions;
    (function generateVariations() {
        variationsArr = []
        function variationInput(input) {
            switch(input) {
                case "requiredcube":
                    let restrictionRegex = /[<=Ʌ]/;
                    let nonNumeral = cubesArr.flat().filter(val => typeof val === "string" && !restrictionRegex.test(val));
                    return randomArrayValue(nonNumeral);
                case "wild":
                    let wildCubeRegex = /[\d<=]/
                    let wildCube = cubesArr.flat().filter(val => !wildCubeRegex.test(val))
                    return randomArrayValue(wildCube);
                case "double": 
                    let set = [];
                    let valArr = ["B", "R", "G", "Y"]
                    switch (generateRandomNumber(1, 4)) {
                        case 1: set.push(valArr[0]); valArr.splice(0, 1); break;
                        case 2: set.push(valArr[1]); valArr.splice(1, 1); break;
                        case 3: set.push(valArr[2]); valArr.splice(2, 1); break;
                        case 4: set.push(valArr[3]); valArr.splice(3, 1); break;
                    };
                    if (generateRandomNumber(1, 4) !== 1) {
                        switch (generateRandomNumber(1, 3)) {
                            case 1: set.push("U"); break;
                            case 2: set.push("∩"); break;
                            case 3: set.push("-"); break;
                        };
                        set.push(valArr[generateRandomNumber(1, 2)])
                    };
                    let operationArr = set.slice();
                    if (set.length === 1) operationArr[0] = translateBRGY(operationArr[0]);
                    if (generateRandomNumber(0, 1)) {
                        if (!generateRandomNumber(0, 2) && set.length === 3) {
                            double = universeArr.filter(val => !setOperation(set).includes(val));
                            set[0] = "(".concat(set[0])
                            set[2] = set[2].concat(")'")
                            if (double.length === 0 || double.length === universeArr.length) return variationInput("double");
                            return set.join("");
                        } else {
                            let index = (generateRandomNumber(0, 1) * (set.length - 1));
                            operationArr[index] = universeArr.filter(val => !translateBRGY(operationArr[index]).includes(val));
                            set[index] = set[index].concat("'");
                        };
                    };
                    (set.length === 1) ? double = operationArr[0] : double = setOperation(operationArr);
                    if (double.length === 0 || double.length === universeArr.length) return variationInput("double")
                    return set.join("");
                case "requiredcard": 
                    if (universeArr.includes("") && generateRandomNumber(1, 2) === 1) {
                        return ""
                    } else {
                        return randomArrayValue(universeArr);
                    };
                case "forbiddencard": return universeArr[generateRandomNumber(0, universeArr.length - 1)];
            }
        }
        let i = 0;
        while (variationsArr.length < generateRandomNumber(6, 6)) {
            i++
            let roll = generateRandomNumber(1, 11);
            switch (roll) {
                case 1:
                    if (!containsVariation("requiredCube")) {
                        variationsArr.push({"requiredCube": variationInput("requiredcube")});
                    }; break;
                case 2:
                    if (!containsVariation("wild")) {
                    variationsArr.push({"wild": variationInput("wild")});
                }; break;
                case 3:
                    if (!variationsArr.includes("twoOp")) {
                        variationsArr.push("twoOp");
                    }; break;
                case 4: 
                    if (!variationsArr.includes("noNull")) {
                        variationsArr.push("noNull");
                        noNull = true;
                    }; break;
                case 5:
                    if (!variationsArr.includes("absValue")) {
                        variationsArr.push("absValue");
                    }; break;
                case 6:
                    if (!containsVariation("double")) {
                        variationsArr.push({"double": variationInput("double")});
                    }; break;
                case 7:
                    if (!(containsVariation("requiredCard") || containsVariation("forbiddenCard"))) {
                        variationsArr.push({"requiredCard": variationInput("requiredcard")});
                    }; break;
                case 8:
                    if (!(containsVariation("requiredCard") || containsVariation("forbiddenCard"))) {
                        variationsArr.push({"forbiddenCard": variationInput("forbiddencard")});
                    }; break;
                case 9: 
                    if (!variationsArr.includes("blankWild")) {
                        variationsArr.push("blankWild");
                        blankWild = true;
                    }; break;
                case 10:
                    if (!variationsArr.includes("symmetricDifference")) {
                        variationsArr.push("symmetricDifference");
                        symmetricDifference = true;
                    }; break;
                case 11:
                    if (!variationsArr.includes("twoSolutions")) {
                        variationsArr.push("twoSolutions");
                        twoSolutions = true;
                    }; break;
                default:
                    variationsArr.push(undefined)
            };
            if (i > 100) break;
        }
        for (let i = 0; i < variationsArr.length; i++) {
            switch (Object.keys(variationsArr[i])[0]) {
                case "requiredCube": requiredCube = variationsArr[i].requiredCube; break;
                case "wild": wild = variationsArr[i].wild; break;
                // case "double": double = variationsArr[i].double; break;
                case "forbiddenCard": forbiddenCard = variationsArr[i].forbiddenCard; break;
                case "requiredCard": requiredCard = variationsArr[i].requiredCard; break;
            };
        };
        console.log(variationsArr);
        if (double) {
            console.log("DOUBLE", double);
            universeArr = universeArr.concat(universeArr.filter(val => double.includes(val))).sort();
            console.log(universeArr)
        };
    })();

    // GENERATE GOAL

    let goalArr;
    let goalValues;
    let goalShape;

    function generateGoal() {
        console.group("GENERATING GOAL:")
        goalArr = [];
        goalValues = [];
        let numerals = cubesArr[1].sort((a, b) => a - b)
        let altNumerals;
        let index;
        let case3Alt = 0;

        let i = 0;

        let universeArrLength = universeArr.length
        if (containsVariation("forbiddenCard") || containsVariation("noNull")) universeArrLength -= 1

        while (goalArr.length === 0) {
            i++
            switch (generateRandomNumber(1, 7)) {
                case 1:     // ADD 1 CUBE
                    goalArr.push(numerals[generateRandomNumber(0, 2)]); goalShape = 1; break;
                case 2:     // ADD 2 CUBES
                    altNumerals = [...numerals];
                    index = generateRandomNumber(0, 2);
                    num1 = numerals[index];
                    altNumerals = altNumerals.slice(0, index).concat(altNumerals.slice(index + 1));
                    num2 = altNumerals[generateRandomNumber(0, 1)];
                    if (generateRandomNumber(1, 4) === 1) {     // MAKE SMALLER NUMBER NEGATIVE (25%)
                        num1 < num2 ? num1 *= -1 : num2 *= -1
                    };
                    goalArr = [num1, "+", num2]; goalShape = 2; break;
                case 3:     // ADD 3 CUBES
                    if (numerals[0] + numerals[1] + numerals[2] > universeArrLength || generateRandomNumber(1, 4) === 1) {
                        numerals[0] *= -1;
                    } else if (numerals[2] > numerals[0] + numerals[1] && Math.random() >= 0.5) {
                        numerals[0] *= -1;
                        numerals[1] *= -1;
                        case3Alt = 1;
                    }
                    altNumerals = randomSort(numerals)
                    goalArr = [altNumerals[0], "+", altNumerals[1], "+", altNumerals[2]]; goalShape = 3; break;
                case 4:     // MULTIPLY 2 CUBES
                    altNumerals = [...numerals];
                    index = generateRandomNumber(0, 2);
                    num1 = numerals[index];
                    altNumerals = altNumerals.slice(0, index).concat(altNumerals.slice(index + 1));
                    index = generateRandomNumber(0, 1);
                    num2 = altNumerals[index];
                    num3 = altNumerals[1 - index];
                    if (num1 * num2 > universeArrLength) {
                        if (num1 * num3 <= universeArrLength) {
                            goalArr = [num1, "*", num3];
                        } else if (num2 * num3 <= universeArrLength) {
                            goalArr = [num2, "*", num3];
                        };
                    } else {
                        goalArr = [num1, "*", num2];
                    }; goalShape = 4; break;
                case 5:     // MULTIPLY 3 CUBES
                    if (numerals[0] * numerals[1] * numerals[2] <= universeArrLength) {
                        altNumerals = randomSort(numerals);
                        goalArr = [altNumerals[0], "*", altNumerals[1], "*", altNumerals[2]];
                    }; goalShape = 5; break;
                case 6:     // A x (B + C) or (A x B) + (A x C)
                    altNumerals = [...numerals];
                    index = generateRandomNumber(0, 2);
                    num1 = numerals[index];
                    altNumerals = altNumerals.slice(0, index).concat(altNumerals.slice(index + 1));
                    index = generateRandomNumber(0, 1);
                    num2 = altNumerals[index];
                    num3 = altNumerals[1 - index];
                    altNumerals.sort((a, b) => a - b)

                    if (num1 * (altNumerals[1] - altNumerals[0]) <= universeArrLength) {

                        if (num1 * (altNumerals[1] + altNumerals[0]) <= universeArrLength && Math.random() >= 0.5) {
                            goalArr = [num1, "*", altNumerals[1], "+", altNumerals[0]];
                        } else {
                            goalArr = [num1, "*", altNumerals[1], "+", -altNumerals[0]];
                        };

                    } else {

                        altNumerals.push(num1);
                        index = altNumerals.indexOf(num2);
                        altNumerals = altNumerals.slice(0, index).concat(altNumerals.slice(index + 1));
                        altNumerals.sort((a, b) => a - b)

                        if (num2 * (altNumerals[1] - altNumerals[0]) <= universeArrLength) {
                            if (num2 * (altNumerals[1] + altNumerals[0]) <= universeArrLength && Math.random() >= 0.5) {
                                goalArr = [num2, "*", altNumerals[1], "+", altNumerals[0]];
                            } else {
                                goalArr = [num2, "*", altNumerals[1], "+", -altNumerals[0]];
                            }
                        } else {

                            altNumerals.push(num3);
                            index = altNumerals.indexOf(num3);
                            altNumerals = altNumerals.slice(0, index).concat(altNumerals.slice(index + 1));
                            altNumerals.sort((a, b) => a - b)

                            if (num3 * (altNumerals[1] + altNumerals[0]) <= universeArrLength && Math.random() >= 0.5) {
                                goalArr = [num3, "*", altNumerals[1], "+", altNumerals[0]];
                            } else if (num3 * (altNumerals[1] - altNumerals[0]) <= universeArrLength) {
                                goalArr = [num3, "*", altNumerals[1], "+", -altNumerals[0]];
                            };
                            
                        };
                        
                    }; goalShape = 6; break;
                case 7:     // MULTIPLY 2 CUBES THEN ADD 1 CUBE
                    altNumerals = [...numerals];
                    index = generateRandomNumber(0, 2);
                    num1 = numerals[index];
                    altNumerals = altNumerals.slice(0, index).concat(altNumerals.slice(index + 1));
                    index = generateRandomNumber(0, 1);
                    num2 = altNumerals[index];
                    num3 = altNumerals[1 - index];
                    if (num1 * num2 - num3 <= universeArrLength) {
                        if (num1 * num2 + num3 <= universeArrLength && Math.random() >= 0.5) {
                            goalArr = [num1, "*", num2, "+", num3];
                        } else if (num1 * num2 - num3 > 0) {
                            goalArr = [num1, "*", num2, "+", -num3];
                        };
                    } else if (num1 * num3 - num2 <= universeArrLength) {
                        if (num1 * num3 + num2 <= universeArrLength && Math.random() >= 0.5) {
                            goalArr = [num1, "*", num3, "+", num2];
                        } else if (num1 * num3 - num2 > 0) {
                            goalArr = [num1, "*", num3, "+", -num2];
                        };
                    } else if (num2 * num3 - num1 <= universeArrLength) {
                        if (num2 * num3 + num1 <= universeArrLength && Math.random() >= 0.5) {
                            goalArr = [num2, "*", num3, "+", num1];
                        } else if (num2 * num3 - num1 > 0) {
                            goalArr = [num2, "*", num3, "+", -num1];
                        };
                    }; goalShape = 7; break;
                default: console.log("GOAL ERROR 2");
            };
        };

        // GOAl VALUES
        function customEval(arr, absVal = 0) {
            let arrOperation = arr[1]
            let answer;
            switch (arrOperation) {
                case "+":
                    answer = arr[0] + arr[2];
                    if (absVal) {
                        answer = Math.abs(arr[0]) + Math.abs(arr[2]);
                    }; break;
                case "*":
                    answer = arr[0] * arr[2]; break;
            };
            return answer;
        };

        let calcAbsValue = 0;
        
        if (goalArr.some(val => (typeof val === "number" && Math.abs(val) !== val)) && variationsArr.indexOf("absValue") !== -1) {
            calcAbsValue = 1;
            console.log("CALC ABS VAL");
        }
        if (goalShape === 1) {
            goalValues.push(goalArr[0]);
        } else if (goalShape !== 6) {
            let answ = customEval([goalArr[0], goalArr[1], goalArr[2]]);
            if (goalArr.length > 3) answ = customEval([answ, goalArr[3], goalArr[4]]);
            goalValues.push(answ);
            if (calcAbsValue) {
                answ = customEval([goalArr[0], goalArr[1], goalArr[2]], 1);
                if (goalArr.length > 3) answ = customEval([answ, goalArr[3], goalArr[4]], 1);
                goalValues.push(answ);
            };

        } else {
            goalValues.push(customEval([goalArr[0], goalArr[1], customEval([goalArr[2], goalArr[3], goalArr[4]])]))
            if (calcAbsValue) {
                goalValues.push(customEval([goalArr[0], goalArr[1], customEval([goalArr[2], goalArr[3], goalArr[4]], 1)], 1))
            };
        };

        if (case3Alt && calcAbsValue) {
            for (let i = 0; i <= 4; i+= 2) {
                let altGoal = [...goalArr];
                altGoal[i] = Math.abs(goalArr[i]);
                if (altGoal[i] !== goalArr[i]) {
                    goalValues.push(customEval([customEval([altGoal[0], altGoal[1], altGoal[2]]), altGoal[3], altGoal[4]]));
                };
            };
        };

        goalValues.filter(val => val <= universeArrLength)
        goalValues.sort((a, b) => a - b)
        
        console.log("GOAL", goalArr);
        console.log("GOALVAL", goalValues);
        
        console.log("UNIVERSE LENGTH: " + universeArr.length);
        console.log("GOALSHAPE: " + goalShape);
        if (variationsArr.indexOf("absValue") !== -1) console.log("ABSOLUTE VALUE");
        if (goalValues.every(val => val <= 0)) {
            console.log("INVALID GOAL");
            generateGoal()
        }
        console.groupEnd()
    };
    generateGoal();
    // RANDOMLY ADD CUBES TO FORBIDDEN ARRAY
    console.group("VALUES AND FORBIDDEN:")
    let forbiddenArr;
    let modifiedCubesArr;

    let valuesArr, valuesArr2;

    let operationsArr = cubesArr[2];
    let operationsArr2 = [];
    for (let x of operationsArr) {
        (x === "∩") ? operationsArr2.push("U") : operationsArr2.push(x);
    };
    operationsArr2 = [...new Set(operationsArr2)];
    console.log("AVAILABLE OPERATIONS", operationsArr2);
    
    let restrictionCubes = cubesArr[3].filter(val => val === "<" || val === "=");
    console.log("RESTRICTION CUBES", restrictionCubes);

    let union, subtraction, not, equals, mustContain;
    union = (operationsArr2.includes("U"));
    subtraction = (operationsArr2.includes("-"));
    not = (operationsArr2.includes("'"));
    equals = (restrictionCubes.includes('='))    
    mustContain = (restrictionCubes.includes('<'))

    function generateForbidden() {

        let totalValues = cubesArr[0].slice();
        for (let x of cubesArr[3]) if (x === "V" || x === "Ʌ") totalValues.push("V");
        let forbiddenArrLength;
        forbiddenArr = [];
        modifiedCubesArr = cubesArr.slice();

        (totalValues.length > 8) ? forbiddenArrLength = generateRandomNumber(3, 4) : forbiddenArrLength = generateRandomNumber(1, 2);
        // (totalValues.length > 8) ? forbiddenArrLength = generateRandomNumber(4, 4) : forbiddenArrLength = generateRandomNumber(2, 3);

        if (totalValues.length - forbiddenArrLength >= 7 && restrictionCubes.length >= 3) {
            forbiddenArrLength++;
        };
        if (totalValues.length - forbiddenArrLength >= 6 && restrictionCubes.length >= 3 && not) {
            console.log("AVERT TEST")
            // forbiddenArrLength++
        }
        for (let i = 0; i < forbiddenArrLength; i++) {
            let tempValuesArr = modifiedCubesArr[0].concat(modifiedCubesArr[3].filter(val => val === "V" || val === "Ʌ"));
            
            let toPush = randomArrayValue(tempValuesArr);
            forbiddenArr.push(toPush);
            if (toPush === "V" || toPush === "Ʌ") {
                modifiedCubesArr[3] = deleteFirstArrItem(modifiedCubesArr[3], toPush);
            } else {
                modifiedCubesArr[0] = deleteFirstArrItem(modifiedCubesArr[0], toPush);
            };
            
        };
        console.log("FORBIDDEN", forbiddenArr);
        console.log(modifiedCubesArr);

        valuesArr = modifiedCubesArr[0].concat(modifiedCubesArr[3].filter(val => val === "V" || val === "Ʌ"));
        valuesArr2 = modifiedCubesArr[0];
        for (let x of modifiedCubesArr[3]) if (x === "V" || x === "Ʌ") valuesArr2.push("V");
        console.log("VAL", valuesArr2);
        console.groupEnd()
    };
    generateForbidden()

    // twoSolutions = true;
    // symmetricDifference = true;
    // variationsArr = ['twoSolutions', 'symmetricDifference', 'double', 'blankWild'];
    // if (!variationsArr.includes('twoSolutions')) variationsArr.push('twoSolutions')
    //     if (!variationsArr.includes('symmetricDifference')) variationsArr.push('symmetricDifference')

        // blankWild = true;
        // requiredCard = undefined;
        // console.log(forbiddenCard)
        // forbiddenCard = 'BG';
        // requiredCube = undefined;
        
        // union = true;
        // subtraction = true;
        // not = false;
        // restrictionCubes = ["="];
        // valuesArr2 = ["R", "B", "G"];
        // equals = true;
        // mustContain = false;
        // goalValues = [5]
        
        // universeArr = ['RG', 'BRY', 'RGY', 'B', 'BRG', 'Y', 'BG', '', 'BRGY', 'G', 'R', 'BY', 'RY'];

        // double = undefined;
        // double = ["G", "GY", "Y", ""];
        // double = ["Y"];
        // universeArr = universeArr.concat(universeArr.filter(val => double.includes(val))).sort();
        // console.log(universeArr);

    blue = universeArr.filter(val => /B/.test(val));
    red = universeArr.filter(val => /R/.test(val));
    green = universeArr.filter(val => /G/.test(val));
    yellow = universeArr.filter(val => /Y/.test(val));
    
    // GENERATE RESTRICTIONS

    let restrictionsMap = [], totalSetsMap, mustContainMap, equalsMap;
    function generateRestrictions(doGenerateSets = 1) {
        
        restrictionsMap = new Map();

        function generateSets() {    // GENERATE SETS
            console.group("GENERATING RESTRICTIONS:")
            totalSetsMap = new Map();
            mustContainMap = new Map();
            equalsMap = new Map();

            function setCycle(arr, values) {    // CREATE SET PERMUTATIONS
                if (arr.length <= 5) {
                    totalSetsMap.set(arr.join(""), advancedCalcSet(arr, universeArr, 1));
                    // totalSetsMap.set(arr.join(""), calcSet(arr, 1));
                    if (union) {
                        for (let x of filterDuplicates(values)) {
                            setCycle(arr.concat("U").concat(x), deleteFirstArrItem(values, x));
                        };
                    };
                    if (subtraction) {
                        for (let x of filterDuplicates(values)) {
                            setCycle(arr.concat("-").concat(x), deleteFirstArrItem(values, x));
                        };
                    }; 
                };
            };

            valuesArr2 = randomSort(valuesArr2)
            for (let x of filterDuplicates(valuesArr2)) {    // INITIALIZE SET GENERATION
                setCycle([x], deleteFirstArrItem(valuesArr2, x));
            };
            console.log(totalSetsMap);
            return;
            let mapSize = 0;
            for (let set1 of totalSetsMap) {    // CREATE RESTRICTION DEFINITION FOR SETS
                let mustContainMap2 = new Map();
                let equalsMap2 = new Map()
                for (let set2 of totalSetsMap) {
                    let mustContainArr = [];
                    let equalsArr = [];
                    for (let set1values of set1[1]) {
                        for (let set2values of set2[1]) {
                            mapSize++;
                            if (mapSize % 1000000 === 0 && mapSize > 0) {
                                console.log((mapSize/1000000) + " MILLION");
                                if (mapSize >= 9000000) {
                                    console.log("REGENERATE MAP");
                                    generateForbidden();
                                    generateSets();
                                    return;
                                };
                            };
                            let value1 = set1values.filter(val => set2values.indexOf(val) < 0);
                            if (mustContain) mustContainArr.push(value1);
                            if (equals) {
                                let value2 = set2values.filter(val => set1values.indexOf(val) < 0);
                                equalsArr.push(value1.concat(value2));
                            };
                        };
                    };
                    if (mustContain) {
                        mustContainArr = Array.from(new Set(mustContainArr.map(JSON.stringify)), JSON.parse);
                        mustContainMap2.set(set2[0], mustContainArr);
                    };
                    if (equals) {
                        equalsArr = Array.from(new Set(equalsArr.map(JSON.stringify)), JSON.parse);
                        equalsMap2.set(set2[0], equalsArr);
                    };
                };
                if (mustContain) mustContainMap.set(set1[0], mustContainMap2);
                if (equals) equalsMap.set(set1[0], equalsMap2)
            };

            console.log(mustContainMap);
            console.log(equalsMap);
            console.log("MAP SIZE: " + mapSize);

            let stopTimer = new Date(); console.log(" > DONE GENERATING MAPS: " + (stopTimer.getTime() - setTimer.getTime())/1000 + " SECONDS");
        };
        
        if (doGenerateSets) generateSets();
        // return;
        console.log(" > EVALUATING RESTRICTIONS");
        (function generatePermutations() {      // GENERATE POSSIBLE WAYS TO WRITE RESTRICTIONS

            let origcount = 0, count = 0, mapCount = 0, minRestrictedUniverse, treeCount = 0;
            let i = 1;
            do {
                if (i > 1) console.log(i + " RUNS")
                minRestrictedUniverse = goalValues[goalValues.length - i];
                i++
                if (i > 10) break;
            } while (minRestrictedUniverse > universeArr.length);

            if (containsVariation("twoSolutions")) minRestrictedUniverse++
            console.log("MIN UNIVERSE: " + minRestrictedUniverse);

            let restrictionsOperationArr = [...restrictionCubes];
            if (union) restrictionsOperationArr.push("U");
            if (subtraction) restrictionsOperationArr.push("-");

            function evaluatePermutation(arr, universe = universeArr, index = 1, val1, key = []) {
                let map = [];
                if (index === 1) {
                    val1 = totalSetsMap.get(arr[index - 1][0]);
                };
                let val2 = totalSetsMap.get(arr[index + 1][0]);
                if (arr[index] === "<") {
                    for (let i = 0, l1 = val1[0].length; i < l1; i++) {
                        for (let j = 0, l2 = val2[0].length; j < l2; j++) {
                            // PERHAPS ITS FASTER TO CREATE A DB RATHER THAN FILTERING EVERY TIME
                            map.push([val1[0][i].filter(val => val2[0][j].indexOf(val) < 0),[[val2[0][j]], [val2[1][j]]], [val1[1][i], arr[index],val2[1][j]]]) // val1[1][i]
                            treeCount++
                        };
                    };
                } else {
                    for (let i = 0, l1 = val1[0].length; i < l1; i++) {
                        for (let j = 0, l2 = val2[0].length; j < l2; j++) {
                            let equalsArr = val1[0][i].filter(val => val2[0][j].indexOf(val) < 0).concat(val2[0][j].filter(val => val1[0][i].indexOf(val) < 0));
                            map.push([equalsArr,[[val2[0][j]], [val2[1][j]]], [val1[1][i], arr[index],val2[1][j]]]);
                            treeCount++;
                        };
                    };
                };
                if (index >= arr.length - 2) {
                    for (let restriction of map) {
                        origcount++;
                        let keyParam;
                        if (index === 1) {
                            keyParam = restriction[2];
                        } else {
                            keyParam = key.slice();
                            keyParam.push(restriction[2][1]);
                            keyParam.push(restriction[2][2]);
                        };
                        let newUniverse = universe.filter(val => restriction[0].indexOf(val) < 0);
                        if (origcount % 5000000 === 0 && origcount > 0) console.log((origcount/1000000) + " MILLION");
                        if (newUniverse.length < minRestrictedUniverse) continue;
                        if (noNull && newUniverse.length === universeArr.length) continue;
                        if (requiredCard && !newUniverse.includes(requiredCard)) continue;
                        let mapKey = newUniverse.join(",");
                        if (restrictionsMap.has(mapKey)) {
                            newArr = restrictionsMap.get(mapKey);
                            newArr.push(keyParam);
                            mapCount++;
                        } else {
                            restrictionsMap.set(mapKey, [keyParam]);
                        };
                        count++;
                    };
                } else {
                    for (let restriction of map) {
                        let newUniverse = universe.filter(val => restriction[0].indexOf(val) < 0);
                        if (newUniverse.length < minRestrictedUniverse) continue;
                        if (requiredCard && !newUniverse.includes(requiredCard)) continue;
                        let keyParam;
                        if (index === 1) {
                            keyParam = restriction[2];
                        } else {
                            keyParam = key.slice();
                            keyParam.push(restriction[2][1]);
                            keyParam.push(restriction[2][2]);
                        };
                        evaluatePermutation(arr, newUniverse, index + 2, restriction[1], keyParam);
                    };
                };
            };
            function merge(arr, val1, val2) {
                let newArr = arr.slice();
                newArr[newArr.length - 1] = arr[arr.length - 1].slice();
                newArr[newArr.length - 1][0] = newArr[newArr.length - 1][0].concat(val1).concat(val2);
                return newArr;
            };
            permutationsArr = [];

            function cycleString(arr, values, operations) {
                if (arr.length === (restrictionCubes.length * 2) + 1) {
                    evaluatePermutation(arr, universeArr);
                    permutationsArr.push(arr);
                };
                if (values.length) {
                    let currentLength = arr[arr.length - 1][0].length;
                    for (let i of filterDuplicates(operations)) {
                        if (i === "<" || i === "=") {
                            for (let j of filterDuplicates(values)) {
                                cycleString(arr.concat(i).concat([[j]]),deleteFirstArrItem(values, j),deleteFirstArrItem(operations, i))
                            };
                        } else if (currentLength < 5) {
                            for (let j of filterDuplicates(values)) {
                                cycleString(merge(arr, i, j),deleteFirstArrItem(values, j),operations);
                            };
                        };
                    };
                };
            };
            valesArr2 = randomSort(valuesArr2)
            for (let x of filterDuplicates(valuesArr2)) {
                cycleString([[x]], deleteFirstArrItem(valuesArr2, x), restrictionsOperationArr);
            };

            console.log("TOTAL COUNT: " + origcount);
            console.log("COUNT: " + count);
            // console.log("MAPLENGTH W/O KEYS: " + mapCount);
            // console.log("TREECOUNT: " + treeCount);
        })();

        console.log(restrictionsMap);
        let stopTimer = new Date(); console.log(" > DONE GENERATING RESTRICTIONS: " + (stopTimer.getTime() - setTimer.getTime())/1000 + " SECONDS");
        console.groupEnd()
    };
    
    let noRestrictions;
    (mustContain || equals) ? generateRestrictions() : noRestrictions = 1;
    let solution;
    // return;
    function generateSolutions() {
        // return;
        console.group("GENERATING SOLUTIONS:")
        
        function findRestrictionPermutation(score, restriction) {
            let restrictionPermutation = [];
            let backupRestrictionPermutation = [];
            for (let x of restriction) {
                let restrictionScore = calcScore(x, 2);
                let numberDeviation = 0;
                let operationDeviation = 0;
                for (let i = 0; i < restrictionScore.length; i++) {
                    if (i <= 4) {
                        let difference = Math.abs(score[i] - restrictionScore[i])
                        if (difference > 1) numberDeviation += 2;
                        if (difference === 1) numberDeviation++;
                    } else {
                        if (score[i] !== restrictionScore[i]) operationDeviation++;
                    };
                };
                if (numberDeviation + operationDeviation === 0) {
                    restrictionPermutation = x;
                    break;
                } else if (numberDeviation + operationDeviation <= 1 && !backupRestrictionPermutation.length) {
                    backupRestrictionPermutation = x
                };
            };
            if (!restrictionPermutation.length) {
                if (!backupRestrictionPermutation.length) return 0;
                restrictionPermutation = backupRestrictionPermutation;
            };
            return restrictionPermutation;
        };

        class Solution {
            constructor(restriction, flag, cards, blankCard) {
                this.restriction = restriction;
                this.flag = flag;
                this.cards = cards;
                this.blankCard = blankCard;
            }
        }

        let calcCount = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ,0]

        const solutionLengths = [1, 3];
        const solutionsArr = [];
        const currentSolutions = [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []]
        const backupSolution = []
        for (let i = 0; i < 32; i++) {
            let array = [];
            for (let i = 0; i < 16; i++) array.push([]);
            backupSolution.push([[], array]);
        };
        // backupSolution.push([[], currentSolutions.slice()]) 
        // let backupIndex = [[], 3]
        const backupIndex = {"index": undefined, "length": 3}
        let permutationsCount = 0;
        let findPermCount = 0;

        if (!noRestrictions) {
            restrictionsMap = randomSort(restrictionsMap).slice(0, 10);
            // restrictionsMap = Array.from(restrictionsMap).slice(0, 30);
            console.log(restrictionsMap)
            // console.log("PERMUTATION UPPER LIMIT: " + 100000/restrictionsMap.length);
            for (let x of restrictionsMap) {
                x[0] = x[0].split(",");
            };
        };

        // console.log(restrictionsMap)
        function setCycle(arr, values) {    // CREATE SET PERMUTATIONS
            permutationsCount++;
            if (permutationsCount >= 100000/restrictionsMap.length && solutionLengths.length <= 2) return;
            // if (permutationsCount % 10000 === 0 && permutationsCount > 0) console.log((permutationsCount/1000) + " THOUSAND");
            if (arr.length >= 11 && !solutionLengths.includes(arr.length - 2)) return;
            if (requiredCube && !arr.includes(requiredCube)) {
            } else if (!solutionLengths.includes(arr.length)) {
                if (noRestrictions) restrictionsMap = [[universeArr], ["NORESTRICTIONS"]];
                let permutationValues = advancedCalcSet(arr, universeArr, 1)
                for (let restriction of restrictionsMap) {
                    let breakLoop1;
                    calcCount[(arr.length - 1) / 2]++;
                    for (let i = 0, l = permutationValues[0].length; i < l; i++) {
                        let permCards = permutationValues[0][i].filter(val => restriction[0].includes(val));
                        let permFlag = permutationValues[1][i];
                        let breakLoop2;
                        if (requiredCard && !permCards.includes(requiredCard)) continue; // BWILD
                        if (forbiddenCard && permCards.includes(forbiddenCard)) continue;

                        let solutionEval = permCards.length;
                        let backup = false;
                        let blankCard;
                        if (!goalValues.includes(solutionEval)) {
                            let skip;
                            if (blankWild) {
                                for (let goalVal of goalValues) {
                                    let goalDeviation = solutionEval - goalVal;
                                    let avaiableCards = [];
                                    switch (goalDeviation) {
                                        case -2:
                                            if (permCards.includes("") || !double) continue;
                                            avaiableCards = permCards.filter(val => double.includes(val));
                                            blankCard = randomArrayValue(avaiableCards);
                                            if (blankCard) skip = true; break;
                                        case -1: 
                                            avaiableCards = permCards;
                                            if (permCards.includes("")) {
                                                if (double) {
                                                    if (double && !double.includes("")) {
                                                        avaiableCards = avaiableCards.filter(val => double.includes(val));
                                                    } else {
                                                        continue;
                                                    }
                                                }
                                            } else if (double) {
                                                avaiableCards = avaiableCards.filter(val => !double.includes(val))
                                            };
                                            blankCard = randomArrayValue(avaiableCards);
                                            if (blankCard) skip = true; break;
                                        case 1:
                                            if (!permCards.includes("")) continue;
                                            if (double) {
                                                if (double.includes("")) {
                                                    avaiableCards = permCards.filter(val => !double.includes(val))
                                                } else {
                                                    avaiableCards = universeArr.filter(val => !(permCards.includes(val)));
                                                };
                                            };
                                            blankCard = randomArrayValue(avaiableCards);
                                            if (blankCard) skip = true; break;
                                        case 2:
                                            if (!permCards.includes("")) continue;
                                            avaiableCards = universeArr.filter(val => !(permCards.includes(val)));
                                            blankCard = randomArrayValue(avaiableCards);
                                            if (blankCard) skip = true; break;
                                    };
                                    if (skip) break;
                                };
                            };
                            if (!skip) {
                                if ((arr.length > backupIndex.length)) {
                                    backup = true;
                                } else {
                                    continue;
                                };
                            }
                        };
                        let solutionRestriction
                        if (!noRestrictions) solutionRestriction = findRestrictionPermutation(calcScore(permFlag), restriction[1]);
                        findPermCount++;
                        if (!solutionRestriction && !noRestrictions) continue;
                        let relevantCurrentSolutions = backup ? backupSolution[solutionEval][1][arr.length] : currentSolutions[arr.length];
                        if (twoSolutions && relevantCurrentSolutions) {
                            let primaryCurrSol
                            let secondaryCurrSol = false;
                            let usePrimary = false;
                            for (let relCurrSolution of relevantCurrentSolutions) {
                                if (compareArr(relCurrSolution.cards, permCards)) continue;
                                let arrScore = calcScore(permFlag)
                                let solutionScore = calcScore(relCurrSolution.flag)
                                let deviation = 0;
                                for (let j = 0; j < solutionScore.length; j++) {
                                    if (j <= 4) {
                                        let difference = Math.abs(arrScore[j] - solutionScore[j])
                                        if (difference > 1) deviation += 2;
                                        if (difference === 1) deviation++;
                                    } else {
                                        if (arrScore[j] !== solutionScore[j]) deviation++
                                    };
                                };
                                if (deviation === 0) {
                                    primaryCurrSol = relCurrSolution;
                                    usePrimary = true;
                                    break;
                                } else if (deviation <= 1 && !secondaryCurrSol.length) {
                                    secondaryCurrSol = relCurrSolution;
                                };
                            };
                            if (usePrimary || secondaryCurrSol) {
                                const currSol = usePrimary ? primaryCurrSol : secondaryCurrSol
                                if (backup) {
                                    // backupSolution[solutionEval][0].push([currSol, [solutionRestriction, permFlag, permCards]]);
                                    backupSolution[solutionEval][0].push([currSol, new Solution(solutionRestriction, permFlag, permCards)]);
                                    backupIndex.index = solutionEval;
                                    backupIndex.length = arr.length;
                                    breakLoop2 = true;
                                } else {
                                    solutionsArr.push([currSol, new Solution(solutionRestriction, permFlag, permCards, blankCard)]);
                                    solutionLengths.push(arr.length);
                                    breakLoop1 = true;
                                    breakLoop2 = true;
                                };
                            };
                        };
                        if (twoSolutions) {
                            relevantCurrentSolutions.push(new Solution(solutionRestriction, permFlag, permCards, blankCard));
                            // relevantCurrentSolutions.push([solutionRestriction, permFlag, permCards, blankCard]);
                        } else {
                            if (backup) {
                                // backupSolution[solutionEval][0].push([solutionRestriction, permFlag, permCards]);
                                backupSolution[solutionEval][0].push(new Solution(solutionRestriction, permFlag, permCards));
                                backupIndex.index = solutionEval;
                                backupIndex.length = arr.length;
                            } else {
                                solutionsArr.push(new Solution(solutionRestriction, permFlag, permCards, blankCard))
                                // solutionsArr.push([solutionRestriction, permFlag, permCards, blankCard]);
                                solutionLengths.push(arr.length);
                                breakLoop1 = true;
                                breakLoop2 = true;
                                break;
                            };
                        };
                        if (breakLoop2) break;
                    };
                    if (breakLoop1) break;
                };
            };
            if (!values.length) return;
            if (Math.random() >= 0.5) {
            // if (false) {
                if (subtraction) {
                    for (let x of filterDuplicates(values)) {
                        setCycle(arr.concat("-").concat(x), deleteFirstArrItem(values, x));
                    };
                }; 
                if (union) {
                    for (let x of filterDuplicates(values)) {
                        setCycle(arr.concat("U").concat(x), deleteFirstArrItem(values, x));
                    };
                };
            } else {
                if (union) {
                    for (let x of filterDuplicates(values)) {
                        setCycle(arr.concat("U").concat(x), deleteFirstArrItem(values, x));
                    };
                };
                if (subtraction) {
                    for (let x of filterDuplicates(values)) {
                        setCycle(arr.concat("-").concat(x), deleteFirstArrItem(values, x));
                    };
                }; 
            };
        };

        valuesArr2 = randomSort(valuesArr2)
        for (let x of filterDuplicates(valuesArr2)) {    // INITIALIZE SET GENERATION
            setCycle([x], deleteFirstArrItem(valuesArr2, x));
        };

        console.log(calcCount);
        console.log(findPermCount);
        console.log("CURSOL", currentSolutions);
        console.log("BACKSOL", backupSolution[backupIndex.index]);
        console.log("SOLARR", solutionsArr);
        console.log("BACKUPINDEX", backupIndex);

        if (solutionsArr.length === 0) {
            console.log("NO SOLUTION, ATTEMPTING BACKUP");
            if (backupIndex.index) {
                solution = backupSolution[backupIndex.index][0][backupSolution[backupIndex.index][0].length - 1];
                let newGoalValue = backupIndex.index
                goalValues = [newGoalValue];
                switch (newGoalValue) {
                    case 0: goalArr = [1, "-", 1]; cubesArr[1] = [1, 1, 1]; goalShape = "2";
                    case 1: goalArr = [2, "-", 1]; cubesArr[1] = [1, 1, 2]; goalShape = "2";
                    case 2: goalArr = [1, "+", 1]; cubesArr[1] = [1, 1, 1]; goalShape = "2";
                    case 3: goalArr = [1, "+", 2]; cubesArr[1] = [1, 1, 2]; goalShape = "2";
                    case 4: goalArr = [1, "+", 3]; cubesArr[1] = [1, 1, 3]; goalShape = "2";
                    case 5: goalArr = [1, "+", 4]; cubesArr[1] = [1, 1, 4]; goalShape = "2";
                    case 6: goalArr = [1, "+", 5]; cubesArr[1] = [1, 1, 5]; goalShape = "2";
                    case 7: goalArr = [1, "+", 6]; cubesArr[1] = [1, 1, 6]; goalShape = "2";
                    case 8: goalArr = [6, "+", 2]; cubesArr[1] = [6, 1, 2]; goalShape = "2";
                    case 9: goalArr = [6, "+", 3]; cubesArr[1] = [6, 1, 3]; goalShape = "2";
                    case 10: goalArr = [6, "+", 4]; cubesArr[1] = [6, 1, 4]; goalShape = "2";
                    case 11: goalArr = [6, "+", 5]; cubesArr[1] = [6, 1, 5]; goalShape = "2";
                    case 12: goalArr = [6, "+", 6]; cubesArr[1] = [6, 1, 6]; goalShape = "2";
                    case 13: goalArr = [6, "+", 6, "+", 1]; cubesArr[1] = [6, 6, 6]; goalShape = "3";
                    case 14: goalArr = [6, "+", 6, "+", 2]; cubesArr[1] = [6, 6, 2]; goalShape = "3";
                    case 15: goalArr = [6, "+", 6, "+", 3]; cubesArr[1] = [6, 6, 3]; goalShape = "3";
                    case 16: goalArr = [6, "+", 6, "+", 4]; cubesArr[1] = [6, 6, 4]; goalShape = "3";
                    case 17: goalArr = [6, "+", 6, "+", 5]; cubesArr[1] = [6, 6, 5]; goalShape = "3";
                    case 18: goalArr = [6, "+", 6, "+", 6]; cubesArr[1] = [6, 6, 6]; goalShape = "3";
                    case 19: goalArr = [6, "*", 3, "+", 1]; cubesArr[1] = [6, 3, 1]; goalShape = "7";
                    case 20: goalArr = [6, "*", 3, "+", 2]; cubesArr[1] = [6, 3, 2]; goalShape = "7";
                    case 21: goalArr = [6, "*", 3, "+", 3]; cubesArr[1] = [6, 3, 3]; goalShape = "7";
                    case 22: goalArr = [6, "*", 3, "+", 4]; cubesArr[1] = [6, 3, 4]; goalShape = "7";
                    case 23: goalArr = [6, "*", 3, "+", 5]; cubesArr[1] = [6, 3, 5]; goalShape = "7";
                    case 24: goalArr = [6, "*", 3, "+", 6]; cubesArr[1] = [6, 3, 6]; goalShape = "7";
                    case 25: goalArr = [6, "*", 4, "+", 1]; cubesArr[1] = [6, 4, 1]; goalShape = "7";
                    case 26: goalArr = [6, "*", 4, "+", 2]; cubesArr[1] = [6, 4, 2]; goalShape = "7";
                }
                console.log("SOL", solution);
            } else {
                console.log("NOBACKUP, NEW PUZZLE");
                returnNewPuzzle = true;
            };
        } else {
            let highestSolutionLengthIndex = solutionLengths.indexOf(solutionLengths.slice().sort((a, b) => a - b)[solutionLengths.length - 1]);
            solution = solutionsArr[highestSolutionLengthIndex - 2];
            console.log("SOL", solution);
        };
        let stopTimer = new Date(); console.log(" > DONE GENERATING SOLUTIONS: " + (stopTimer.getTime() - setTimer.getTime())/1000 + " SECONDS");
        let mapArr = [["[    ]", "[    ]", "[    ]", "[    ]"], ["[    ]", "[    ]", "[    ]", "[    ]"], ["[    ]", "[    ]", "[    ]", "[    ]"], ["[    ]", "[    ]", "[    ]", "[    ]"]];
        for (let i = 0; i < universeArr.length; i++) {
            switch (universeArr[i]) {
                case "BR": mapArr[0][0] = "[ BR ]"; break;
                case "BRY": mapArr[0][1] = "[BRY ]"; break;
                case "BY": mapArr[0][2] = "[ BY ]"; break;
                case "B": mapArr[0][3] = "[ B  ]"; break;
                case "BRG": mapArr[1][0] = "[BRG ]"; break;
                case "BRGY": mapArr[1][1] = "[BRGY]"; break;
                case "BGY": mapArr[1][2] = "[BGY ]"; break;
                case "BG": mapArr[1][3] = "[ BG ]"; break;
                case "RG": mapArr[2][0] = "[ RG ]"; break;
                case "RGY": mapArr[2][1] = "[RGY ]"; break;
                case "GY": mapArr[2][2] = "[ GY ]"; break;
                case "G": mapArr[2][3] = "[ G  ]"; break;
                case "R": mapArr[3][0] = "[ R  ]"; break;
                case "RY": mapArr[3][1] = "[ RY ]"; break;
                case "Y": mapArr[3][2] = "[ Y  ]"; break;
                case "": mapArr[3][3] = "[BLNK]"; break;
            }
        }
        console.log(mapArr[0].join(""))
        console.log(mapArr[1].join(""))
        console.log(mapArr[2].join(""))
        console.log(mapArr[3].join(""))
        console.groupEnd()
    };
    generateSolutions()
    if (returnNewPuzzle) return generatePuzzle();
    class PuzzleData {
        constructor(cubesArr, modifiedCubesArr, universeArr, variationsArr, goalArr, goalShape, goalValues, forbiddenArr, solution) {
            this.cubes = cubesArr;
            this.modfiedCubes = modifiedCubesArr;
            this.universe = universeArr;
            this.variations = variationsArr;
            this.goal = goalArr;
            this.goalShape = goalShape;
            this.goalValues = goalValues;
            this.forbidden = forbiddenArr;
            this.solution = solution;
        };

        getRestrictions() {
            return this.cubes[3].filter(val => val === "<" || val === "=");
        }
    };
    return new PuzzleData(cubesArr, modifiedCubesArr, universeArr, variationsArr, goalArr, goalShape, goalValues, forbiddenArr, solution)
};

function newPuzzle() {
    let puzzleData = generatePuzzle()
    console.log(puzzleData);
    console.log(puzzleData.forbidden)
    for (let forbiddenCube of puzzleData.forbidden) {
        const newForbiddenCube = document.createElement("div")
        newForbiddenCube.classList.add("cube", "restraint-cube", "z-index2");
        newForbiddenCube.addEventListener("click", hideKeyboard)
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
    for (let x of puzzleData.goalValues) goalAddCube(x)
    if (puzzleData.variations.includes("twoSolutions")) {
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
                if (currentScore < standardScore) {
                    highStandard[i] = currentScore;
                }
            } else {
                if (!currentScore) highStandard[i] = false
            }
        }
    }
    console.log("HSTD", highStandard);
    let requiredArr = []
    let resourcesArr = puzzleData.modfiedCubes[0].concat(puzzleData.modfiedCubes[2]).concat(puzzleData.modfiedCubes[3])
    console.log(resourcesArr.length)
    console.log(resourcesArr)
    for (let i = 0; i < highStandard.length; i++) {
        let cube;
        switch(i) {
            case 0: cube = "blue"; resourcesArr = deleteFirstArrItem(resourcesArr, "B"); break;
            case 1: cube = "red"; resourcesArr = deleteFirstArrItem(resourcesArr, "R"); break;
            case 2: cube = "green"; resourcesArr = deleteFirstArrItem(resourcesArr, "G"); break;
            case 3: cube = "yellow"; resourcesArr = deleteFirstArrItem(resourcesArr, "Y"); break;
            case 4: 
                cube = "universe"; 
                if (resourcesArr.includes("V")) {
                    resourcesArr = deleteFirstArrItem(resourcesArr, "V")
                } else {
                    resourcesArr = deleteFirstArrItem(resourcesArr, "Ʌ")
                }; break;
            case 5: cube = "union"; resourcesArr = deleteFirstArrItem(resourcesArr, "U"); ;
            case 6: cube = "intersect"; resourcesArr = deleteFirstArrItem(resourcesArr, "∩"); break;
            case 7: cube = "not"; resourcesArr = deleteFirstArrItem(resourcesArr, "'"); break;
        }
        if (highStandard[i] === 'number') {
            for (let i = 0; i < highStandard[i]; i++) {
                requiredArr.push(cube);
            };
        } else if (highStandard[i]) {
            requiredArr.push(cube);
        };
    };
    console.log(requiredArr)
    requiredArr = randomSort(requiredArr)
    for (let x of puzzleData.getRestrictions()) {
        resourcesArr = deleteFirstArrItem(resourcesArr, x);
        (x === "<") ? requiredArr.push("must-contain") : requiredArr.push("equals");
    }
    for (let requiredCube of requiredArr) {
        const newRequiredCube = document.createElement("div")
        newRequiredCube.classList.add("cube", "restraint-cube", "z-index2", requiredCube);
        newRequiredCube.addEventListener("click", hideKeyboard)
        requiredContainer.append(newRequiredCube);
    };
    for (let resourceCube of resourcesArr) {
        const newResourcesCube = document.createElement("div")
        newResourcesCube.classList.add("cube", "restraint-cube", "z-index2");
        newResourcesCube.addEventListener("click", hideKeyboard)
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
        resourcesContainer.append(newResourcesCube);
    }
    function addColorChild(card, color) {
        const newColor = document.createElement('div')
        newColor.classList.add(color)
        card.append(newColor)
    }
    console.log(filterDuplicates(puzzleData.universe))
    const mapArr = map.querySelectorAll("td")
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
        newCard.addEventListener("click", hideKeyboard);
        newCard.classList.add('card', 'z-index2')
        if (/B/.test(card)) addColorChild(newCard, "blue")
        if (/R/.test(card)) addColorChild(newCard, "red")
        if (/G/.test(card)) addColorChild(newCard, "green")
        if (/Y/.test(card)) addColorChild(newCard, "yellow")
        cardsContainer.append(newCard)
    }
    console.log(variationsContainer)
    let variationsDisplay = variationsContainer.querySelector('ul')
    for (let i = 0; i < variationsDisplay.children.length; i++) {
        let currVariation = puzzleData.variations[i]
        let variationToPush;
        if (typeof currVariation === "string") {
            switch (currVariation) {
                case "twoOp": variationToPush = "Two Op."; break;
                case "noNull": variationToPush = "No Null"; break;
                case "absValue": variationToPush = "Abs. Val."; break;
                case "blankWild": variationToPush = "B. Wild"; break;
                case "symmetricDifference": variationToPush = "Sym. Diff."; break;
                case "twoSolutions": variationToPush = "Two Sol."; break;
            }
        } else {
            switch (Object.keys(currVariation)[0]) {
                case "requiredCube": variationToPush = "Req. Cube " + currVariation.requiredCube; break;
                case "wild": variationToPush = "Wild " + currVariation.wild; break;
                case "double": variationToPush = "Double " + currVariation.double; break;
                case "requiredCard": variationToPush = "Req. Card" + currVariation.requiredCard; break;
                case "forbiddenCard": variationToPush = "Forb. Card" + currVariation.forbiddenCard; break;
            }
        }
        variationsDisplay.children[i].innerText = variationToPush;
    }
    console.log(puzzleData.variations)
    console.log(variationsDisplay)
    if (puzzleData.variations.includes('twoSolutions')) {
        let restriction1
        let restriction2
        if (puzzleData.solution[0].restriction === undefined) {
            restriction1 = "NO RESTRICTION"
        } else {
            restriction1 = puzzleData.solution[0].restriction.join("")
        };
        if (puzzleData.solution[1].restriction === undefined) {
            restriction2 = "NO RESTRICTION"
        } else {
            restriction2 = puzzleData.solution[1].restriction.join("")
        };
        console.log(restriction1)
        console.log(restriction2)
        restriction1 = restriction1.replace(/</g, "&lt");
        restriction2 = restriction2.replace(/</g, "&lt");
        solution1.innerHTML = `<strong>Restriction: </strong>${restriction1}, <strong>Solution: </strong>${puzzleData.solution[0].flag}, <strong>Cards: </strong>${puzzleData.solution[0].cards.join(",")}, <strong>Blank Card: </strong>${puzzleData.solution[0].blankCard}`
        solution2.innerHTML = `<strong>Restriction: </strong>${restriction2}, <strong>Solution: </strong>${puzzleData.solution[1].flag}, <strong>Cards: </strong>${puzzleData.solution[1].cards.join(",")}, <strong>Blank Card: </strong>${puzzleData.solution[1].blankCard}`
    } else {
        let restriction1
        if (puzzleData.solution.restriction === undefined) {
            restriction1 = "NO RESTRICTION"
        } else {
            restriction1 = puzzleData.solution.restriction.join("")
        };
        console.log(restriction1)
        restriction1 = restriction1.replace(/</g, "&lt");
        solution1.innerHTML = `<strong>Restriction: </strong>${restriction1}, <strong>Solution: </strong>${puzzleData.solution.flag}, <strong>Cards: </strong>${puzzleData.solution.cards.join(",")}, <strong>Blank Card: </strong>${puzzleData.solution.blankCard}`
    };
};

function goalAddCube(cube) {
    const newGoalCube = document.createElement("div")
    newGoalCube.innerText = cube;
    newGoalCube.classList.add("cube", "z-index2", "goal-cube")
    goalContainer.append(newGoalCube)
}

const forbiddenContainer = document.querySelector("#forbidden-container");
const requiredContainer = document.querySelector("#required-container");
const resourcesContainer = document.querySelector('#resources-container');
const cardsContainer = document.querySelector('#cards-container');
const variationsContainer = document.querySelector('#variations-container')
const solution1 = document.querySelector('#solution1')
const solution2 = document.querySelector('#solution2')
const map = document.querySelector('#map')
let solutionArr = [];
const solutionArrWrap = {"values":[0, 0], "row":0};
const goalContainer = document.querySelector("#goal-container");
newPuzzle();
let stopTimer = new Date(); console.log((stopTimer.getTime() - setTimer.getTime())/1000 + " SECONDS");
let keyboardActive = false;
console.log(" > DONE")

const solutionContainer = document.querySelector("#solution-container")
const keyboard = document.querySelector("#keyboard-container");
const cover = document.querySelector("#cover")
const boardContainer = document.querySelector("#board-container")
const correctAnswerArrow = document.querySelector('#correct-answer-arrow')
const correctAnswerViewContainer = document.querySelector('#correct-answer-view-container')
correctAnswerArrow.addEventListener("click", function(){
    // correctAnswerArrow.innerText = "^"
    correctAnswerViewContainer.classList.toggle("hidden");
})
solutionContainer.addEventListener("click", showKeyboard, true);
document.addEventListener("keydown", function(keypress){
    // console.log(keypress.key);
    if (!keyboardActive) {
        return;
    }
    switch (keypress.key) {
        case "b": solutionAddCube("blue"); break;
        case "r": solutionAddCube("red"); break;
        case "g": solutionAddCube("green"); break;
        case "y": solutionAddCube("yellow"); break;
        case "u": solutionAddCube("union"); break;
        case "n": solutionAddCube("intersect"); break;
        case "-": solutionAddCube("subtract"); break;
        case "'": solutionAddCube("not"); break;
        case "v": solutionAddCube("universe"); break;
        case "m": solutionAddCube("empty-set"); break;
        case "<": solutionAddCube("must-contain"); break;
        case "=": solutionAddCube("equals"); break;
        case "(": solutionAddCube("left-parenthesis", true); break;
        case ")": solutionAddCube("right-parenthesis", true); break;
        case "Backspace": removeCube(); break;
    };
});
function removeCube() {
    solutionArr.pop()
    console.log(solutionArr)
    solutionContainer.lastElementChild.remove();
};
function solutionAddCube(cube, parenthesis) {
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
        case "must-contain": currCube = "<"; break;
        case "equals": currCube = "="; break;
        case "left-parenthesis": currCube = "("; break;
        case "right-parenthesis": currCube = ")"; break;
    };
    solutionArr.push(currCube)
    const solutionCube = document.createElement("div");
    if (parenthesis) {
        solutionArrWrap.values[solutionArrWrap.row] += 16
        solutionCube.classList.add("z-index2", cube);
    } else {
        solutionArrWrap.values[solutionArrWrap.row] += 48
        solutionCube.classList.add("cube", "solution-cube", "z-index2", cube);
    };
    if (solutionArrWrap.values[0] >= 524) {
        console.log("NEW ROW")
        alert("TOO LARGE")
        return;
        solutionArrWrap.row++
        boardContainer.classList.add("addRow1")
    }
    console.log(solutionArrWrap)
    console.log(solutionArr)
    solutionContainer.append(solutionCube);
};

cover.addEventListener("click", hideKeyboard, true);

function hideKeyboard() {
    keyboardActive = false;
    keyboard.classList.add("hidden")
};
function showKeyboard() {
    resourcesContainer.scrollTop = resourcesContainer.scrollHeight;
    keyboardActive = true;
    keyboard.classList.remove("hidden")
};


// function cycle(arr, arrangement, values, key) {
                
    //     permutationsArr.push(arr)
    //     if (!values.length) {
    //         return;
    //     }
    //     if (arrangement[key] > 1) {
            // if (union) {
            //     for (let x of filterDuplicates(values)) {
            //         cycle(arr.concat("U").concat(x), subtractKey(arrangement, key), deleteFirstArrItem(values, x), key)
            //         // let newArr = [...arr]
            //         // newArr.push("U")
            //         // newArr.push(x)
            //         // console.log(newArr)
            //     }
            // }  

    //         if (subtraction) {

    //         }
    //     } else {
    //         // newKey = key.splice(0) + 2
    //         // key += 2;
    //         for (let x of filterDuplicates(values)) {
    //             // console.log(arrangement)
    //             // console.log(key)
    //             cycle(arr.concat(arrangement[key + 1]).concat(x), arrangement, deleteFirstArrItem(values ,x), key + 2)
    //             // let newArr = [...arr]
    //             // newArr.push(x)
    //             // console.log(newArr)
    //         }
    //     }
        
    // }

    // function subtractKey(arrangement, key) {
        //     newArrangement = arrangement.slice(0)
        //     newArrangement[key] -= 1
        //     return newArrangement
        // }

        // let arrangements = [];

        // (function generateArrangements(arr = [], limit = maxRestrictionValues, restrictions = restrictionCubes) {
        //     // console.log(arr)
        //     if (restrictions.indexOf("<") !== -1) {
        //         for (let i = 1; i < limit; i++) {
        //             newArr = [i, "<", limit - i].concat(arr.slice(1, arr.length))
        //             arrangements.push(newArr)
        //             generateArrangements(newArr, i, deleteFirstArrItem(restrictions, "<"))
        //         }
        //     }
        //     if (restrictions.indexOf("=") !== -1) {
        //         for (let i = 1; i < limit; i++) {
        //             newArr = [i, "=", limit - i].concat(arr.slice(1, arr.length))
        //             arrangements.push(newArr)
        //             generateArrangements(newArr, i, deleteFirstArrItem(restrictions, "="))
        //         }
        //     }
        // })();

        // function merge(arr, val1, val2) {
            //     let newArr = arr.slice()
            //     newArr[newArr.length - 1] = arr[arr.length - 1].slice()
            //     newArr[newArr.length - 1].push(val1)
            //     newArr[newArr.length - 1].push(val2)
            //     return newArr;
            // }
            // function cycle(arr, values, operations) {
            //     if (permutationsArr.length % 1000000 === 0 && permutationsArr.length > 0) {
            //         console.log((permutationsArr.length/1000000) + " MILLION")
            //     }
            //     if (arr.length > 0) {
            //         permutationsArr.push(arr)
            //     }
            //     if (values.length) {
            //         let currentLength = arr[arr.length - 1].length;
            //         for (let i of filterDuplicates(operations)) {
            //             if (i === "<" || i === "=") {
            //                 for (let j of values) {
            //                     cycle(arr.concat(i).concat([[j]]),deleteFirstArrItem(values, j),deleteFirstArrItem(operations, i))
            //                 }
            //             } else if (currentLength <= 3) {
            //                 for (let j of values) {
            //                     cycle(merge(arr, i, j),deleteFirstArrItem(values, j),operations);
            //                 }
            //             }
            //         }
            //     }
            // }
