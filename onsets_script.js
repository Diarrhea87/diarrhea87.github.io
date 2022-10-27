let setTimer = new Date()

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

function generatePuzzle(randomize = true, setCubes, setUniverse, setVariations, setVariationsLength, setGoal, setForbidden) {
    let returnNewPuzzle;

    console.log(randomize, setCubes, setUniverse, setVariations, setGoal, setForbidden)

    // GENERAL FUNCTIONS:

    function randomArrayValue (arr) {
        return arr[getRandomNumber(0, arr.length - 1)]
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
                if (symmetricDifference) {
                    return val1.filter(val => !val2.includes(val)).concat(val2.filter(val => !val1.includes(val)))
                } else {
                    return val1.filter(val => !val2.includes(val));
                };
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
                        switch(getRandomNumber(1, 4)) {
                            case 1: flag = ["VUV"]; break;
                            case 2: flag = ["VUɅ"]; break;
                            case 3: flag = ["ɅUV"]; break;
                            case 4: flag = ["V∩V"]; break;
                        };
                        switch (getRandomNumber(1, 4)) {
                            case 1: flag.push("V∩Ʌ"); break;
                            case 2: flag.push("Ʌ∩V"); break;
                            case 3: flag.push("Ʌ∩Ʌ"); break;
                            case 4: flag.push("ɅUɅ"); break;
                        };
                    } else if (symmetricDifference) {    // OPERATION IS "-"
                        switch (getRandomNumber(1, 2)) {
                            case 1: flag = [("Ʌ-V")]; break;
                            case 2: flag = [("V-Ʌ")]; break;
                        };
                        switch (getRandomNumber(1, 2)) {
                            case 1: flag.push("V-V"); break;
                            case 2: flag.push("Ʌ-Ʌ"); break;
                        };
                    } else {    // OPERATION IS "-"
                        flag = ["V-Ʌ"];
                        switch (getRandomNumber(1, 3)) {
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
                        for (let l = 0; l < totalValue[0].length; l++) {
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
        if (setCubes) {
            cubesArr = setCubes;
            console.log(cubesArr);
            return;
        }
        cubesArr = [];

        // COLORS:
        const colors = [];
        for (let i = 0; i < 8; i++) {
            let roll = getRandomNumber(1, 6)
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
            let roll = getRandomNumber(1, 6)
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
            let roll = getRandomNumber(1, 6)
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
            let roll = getRandomNumber(1, 6)
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
        universeArr = randomSort(["BRGY","BRG","BRY","BR","BGY","BG","BY","B","RGY","RG","RY","R","GY","G","Y",""]).slice(0, getRandomNumber(10, 14));        
    })();

    let blue, red, green, yellow;
    blue = universeArr.filter(val => /B/.test(val));
    red = universeArr.filter(val => /R/.test(val));
    green = universeArr.filter(val => /G/.test(val));
    yellow = universeArr.filter(val => /Y/.test(val));

    if (setUniverse) {universeArr = setUniverse}

    console.log(universeArr)
    // GENERATE VARIATIONS:
    let variationsArr;
    let requiredCube, wild, noNull, double, forbiddenCard, requiredCard, blankWild, symmetricDifference, twoSolutions;
    (function generateVariations() {
        console.log(setVariations)
        variationsArr = [];
        if (setVariations) {
            for (let x of setVariations) {
                switch (x) {
                    case "requiredCube": variationsArr.push({"requiredCube": variationInput("requiredcube")}); break;
                    case "wild": variationsArr.push({"wild": variationInput("wild")}); break;
                    case "twoOp": variationsArr.push("twoOp"); break;
                    case "noNull": variationsArr.push("noNull"); noNull = true; break;
                    case "absValue": variationsArr.push("absValue"); break;
                    // case "double": variationsArr.push({"double": variationInput("double")}); break;
                    case "double": variationsArr.push({"double": "R∩B"})
                    double = ["BRGY", "BRY", "BR", "BRG"]; break;
                    case "requiredCard": variationsArr.push({"requiredCard": variationInput("requiredcard")}); break;
                    case "forbiddenCard": variationsArr.push({"forbiddenCard": variationInput("forbiddencard")}); break;
                    case "blankWild": variationsArr.push("blankWild"); blankWild = true; break;
                    case "symmetricDifference": variationsArr.push("symmetricDifference"); symmetricDifference = true; break;
                    case "twoSolutions": variationsArr.push("twoSolutions"); twoSolutions = true; break;
                };
            };
        };

        
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
                    switch (getRandomNumber(1, 4)) {
                        case 1: set.push(valArr[0]); valArr.splice(0, 1); break;
                        case 2: set.push(valArr[1]); valArr.splice(1, 1); break;
                        case 3: set.push(valArr[2]); valArr.splice(2, 1); break;
                        case 4: set.push(valArr[3]); valArr.splice(3, 1); break;
                    };
                    if (getRandomNumber(1, 4) !== 1) {
                        switch (getRandomNumber(1, 3)) {
                            case 1: set.push("U"); break;
                            case 2: set.push("∩"); break;
                            case 3: set.push("-"); break;
                        };
                        set.push(valArr[getRandomNumber(1, 2)])
                    };
                    let operationArr = set.slice();
                    if (set.length === 1) operationArr[0] = translateBRGY(operationArr[0]);
                    if (getRandomNumber(0, 1)) {
                        if (!getRandomNumber(0, 2) && set.length === 3) {
                            double = universeArr.filter(val => !setOperation(set).includes(val));
                            set[0] = "(".concat(set[0])
                            set[2] = set[2].concat(")'")
                            if (double.length === 0 || double.length === universeArr.length) return variationInput("double");
                            return set.join("");
                        } else {
                            let index = (getRandomNumber(0, 1) * (set.length - 1));
                            operationArr[index] = universeArr.filter(val => !translateBRGY(operationArr[index]).includes(val));
                            set[index] = set[index].concat("'");
                        };
                    };
                    (set.length === 1) ? double = operationArr[0] : double = setOperation(operationArr);
                    if (double.length === 0 || double.length === universeArr.length) return variationInput("double")
                    return set.join("");
                case "requiredcard":
                    if (universeArr.includes("") && getRandomNumber(1, 4) === 1) {
                        return ""
                    } else {
                        return randomArrayValue(universeArr);
                    };
                case "forbiddencard": return universeArr[getRandomNumber(0, universeArr.length - 1)];
            }
        }
        let i = 0;
        let variationLength = setVariationsLength ?? 6
        while (variationsArr.length < variationLength) {
            i++
            let roll = getRandomNumber(1, 11);
            if (i === 1) roll = 6;
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

    blue = universeArr.filter(val => /B/.test(val));
    red = universeArr.filter(val => /R/.test(val));
    green = universeArr.filter(val => /G/.test(val));
    yellow = universeArr.filter(val => /Y/.test(val));

    // GENERATE GOAL

    let goalArr;
    let goalValues;
    let goalShape;

    function generateGoal() {

        console.group("GENERATING GOAL:")
        if (setGoal) {
            goalArr = setGoal.goalArr;
            goalValues = setGoal.goalValues;
            goalShape = setGoal.goalShape;
            console.log("GOAL", goalArr);
            console.log("GOALVAL", goalValues);
            console.log("UNIVERSE LENGTH: " + universeArr.length);
            console.log("GOALSHAPE: " + goalShape);
            console.groupEnd()
            return;
        }

        goalArr = [];
        goalValues = [];
        let numerals = cubesArr[1].sort((a, b) => a - b), altNumerals, index;
        let case3Alt = 0;
        let universeArrLength = universeArr.length

        if (containsVariation("forbiddenCard") || containsVariation("noNull")) universeArrLength -= 1

        while (goalArr.length === 0) {
            let num1, num2, num3
            switch (getRandomNumber(1, 7)) {
                case 1:     // ADD 1 CUBE
                    goalArr.push(numerals[getRandomNumber(0, 2)]); goalShape = 1; break;
                case 2:     // ADD 2 CUBES
                    altNumerals = [...numerals];
                    index = getRandomNumber(0, 2);
                    num1 = numerals[index];
                    altNumerals = altNumerals.slice(0, index).concat(altNumerals.slice(index + 1));
                    num2 = altNumerals[getRandomNumber(0, 1)];
                    if (getRandomNumber(1, 4) === 1) {     // MAKE SMALLER NUMBER NEGATIVE (25%)
                        num1 < num2 ? num1 *= -1 : num2 *= -1
                    };
                    goalArr = [num1, "+", num2]; goalShape = 2; break;
                case 3:     // ADD 3 CUBES
                    if (numerals[0] + numerals[1] + numerals[2] > universeArrLength || getRandomNumber(1, 4) === 1) {
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
                    index = getRandomNumber(0, 2);
                    num1 = numerals[index];
                    altNumerals = altNumerals.slice(0, index).concat(altNumerals.slice(index + 1));
                    index = getRandomNumber(0, 1);
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
                    index = getRandomNumber(0, 2);
                    num1 = numerals[index];
                    altNumerals = altNumerals.slice(0, index).concat(altNumerals.slice(index + 1));
                    index = getRandomNumber(0, 1);
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
                    index = getRandomNumber(0, 2);
                    num1 = numerals[index];
                    altNumerals = altNumerals.slice(0, index).concat(altNumerals.slice(index + 1));
                    index = getRandomNumber(0, 1);
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

        (totalValues.length > 8) ? forbiddenArrLength = getRandomNumber(3, 4) : forbiddenArrLength = getRandomNumber(1, 2);
        // (totalValues.length > 8) ? forbiddenArrLength = generateRandomNumber(4, 4) : forbiddenArrLength = generateRandomNumber(2, 3);
        
        if (totalValues.length - forbiddenArrLength >= 7 && restrictionCubes.length >= 3) {
            forbiddenArrLength++;
        };
        if (totalValues.length - forbiddenArrLength >= 6 && restrictionCubes.length >= 3 && not) {
            console.log("AVERT TEST")
            // forbiddenArrLength++
        }

        if (setForbidden) {
            forbiddenArrLength = setForbidden.forbiddenArrLength
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
        valuesArr2 = modifiedCubesArr[0].slice();
        for (let x of modifiedCubesArr[3]) if (x === "V" || x === "Ʌ") valuesArr2.push("V");
        console.log("VAL", valuesArr2);
        console.groupEnd()
    };
    generateForbidden()

    // twoSolutions = true;
    // symmetricDifference = true;
    // variationsArr = ['twoSolutions', 'symmetricDifference', 'double', 'blankWild'];
    // if (!variationsArr.includes('twoSolutions')) variationsArr.push('twoSolutions')
    // if (!variationsArr.includes('symmetricDifference')) variationsArr.push('symmetricDifference')

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

    // double = undefined;
    // double = ["G", "GY", "Y", ""];
    // double = ["Y"];
    // universeArr = universeArr.concat(universeArr.filter(val => double.includes(val))).sort();
    // console.log(universeArr);

    // blue = universeArr.filter(val => /B/.test(val));
    // red = universeArr.filter(val => /R/.test(val));
    // green = universeArr.filter(val => /G/.test(val));
    // yellow = universeArr.filter(val => /Y/.test(val));
    
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

            if (randomize) valuesArr2 = randomSort(valuesArr2)
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

            let origcount = 0, count = 0, minRestrictedUniverse
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
                if (index === 1) val1 = totalSetsMap.get(arr[index - 1][0]);
                let val2 = totalSetsMap.get(arr[index + 1][0]);
                if (arr[index] === "<") {
                    for (let i = 0, l1 = val1[0].length; i < l1; i++) {
                        for (let j = 0, l2 = val2[0].length; j < l2; j++) {
                            // PERHAPS ITS FASTER TO CREATE A DB RATHER THAN FILTERING EVERY TIME
                            map.push([val1[0][i].filter(val => val2[0][j].indexOf(val) < 0),[[val2[0][j]], [val2[1][j]]], [val1[1][i], arr[index],val2[1][j]]]) // val1[1][i]
                        };
                    };
                } else {
                    for (let i = 0, l1 = val1[0].length; i < l1; i++) {
                        for (let j = 0, l2 = val2[0].length; j < l2; j++) {
                            let equalsArr = val1[0][i].filter(val => val2[0][j].indexOf(val) < 0).concat(val2[0][j].filter(val => val1[0][i].indexOf(val) < 0));
                            map.push([equalsArr,[[val2[0][j]], [val2[1][j]]], [val1[1][i], arr[index],val2[1][j]]]);
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
                        if (requiredCard !== undefined && !newUniverse.includes(requiredCard)) continue;
                        let mapKey = newUniverse.join(",");
                        if (restrictionsMap.has(mapKey)) {
                            let newArr = restrictionsMap.get(mapKey);
                            newArr.push(keyParam);
                        } else {
                            restrictionsMap.set(mapKey, [keyParam]);
                        };
                        count++;
                    };
                } else {
                    for (let restriction of map) {
                        let newUniverse = universe.filter(val => restriction[0].indexOf(val) < 0);
                        if (newUniverse.length < minRestrictedUniverse) continue;
                        if (requiredCard !== undefined && !newUniverse.includes(requiredCard)) continue;
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
            let permutationsArr = [];

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
            if (randomize) valesArr2 = randomSort(valuesArr2)
            for (let x of filterDuplicates(valuesArr2)) {
                cycleString([[x]], deleteFirstArrItem(valuesArr2, x), restrictionsOperationArr);
            };

            console.log("TOTAL COUNT: " + origcount);
            console.log("COUNT: " + count);
        })();

        console.log(restrictionsMap);
        let stopTimer = new Date(); console.log(" > DONE GENERATING RESTRICTIONS: " + (stopTimer.getTime() - setTimer.getTime())/1000 + " SECONDS");
        console.groupEnd()
    };
    
    let noRestrictions;
    (mustContain || equals) ? generateRestrictions() : noRestrictions = 1;
    let solution;

    function generateSolutions() {
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
        const backupIndex = {"index": undefined, "length": 3}
        let permutationsCount = 0;
        let findPermCount = 0;

        if (!noRestrictions) {
            if (randomize) {
                restrictionsMap = randomSort(restrictionsMap).slice(0, 30)
            } else {
                restrictionsMap = Array.from(restrictionsMap).slice(0, 30);
            }
            console.log(restrictionsMap);
            for (let x of restrictionsMap) {
                x[0] = x[0].split(",");
            };
        };

        // console.log(restrictionsMap)
        function setCycle(arr, values) {    // CREATE SET PERMUTATIONS
            permutationsCount++;
            if (permutationsCount >= 100000/restrictionsMap.length && solutionLengths.length <= 2) return;
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
                        if (requiredCard !== undefined && !permCards.includes(requiredCard)) continue; // BWILD
                        if (forbiddenCard !== undefined && permCards.includes(forbiddenCard)) continue;

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
                                            if (forbiddenCard !== undefined) avaiableCards.filter(val => val !== forbiddenCard)
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
                                            if (forbiddenCard !== undefined) avaiableCards.filter(val => val !== forbiddenCard)
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
                                            if (forbiddenCard !== undefined) avaiableCards.filter(val => val !== forbiddenCard)
                                            blankCard = randomArrayValue(avaiableCards);
                                            if (blankCard) skip = true; break;
                                        case 2:
                                            if (!permCards.includes("")) continue;
                                            avaiableCards = universeArr.filter(val => !(permCards.includes(val)));
                                            if (forbiddenCard !== undefined) avaiableCards.filter(val => val !== forbiddenCard)
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
                            };
                        };
                        let solutionRestriction
                        if (!noRestrictions) solutionRestriction = findRestrictionPermutation(calcScore(permFlag), restriction[1]);
                        findPermCount++;
                        if (!solutionRestriction && !noRestrictions) continue;
                        let relevantCurrentSolutions = backup ? backupSolution[solutionEval][1][arr.length] : currentSolutions[arr.length];
                        if (twoSolutions && relevantCurrentSolutions.length) {
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
                                    backupSolution[solutionEval][0].push([currSol, new Solution(solutionRestriction, permFlag, permCards)]);
                                    backupIndex.index = solutionEval;
                                    backupIndex.length = arr.length;
                                    breakLoop2 = true;
                                } else {
                                    console.log(solutionEval)
                                    solutionsArr.push([currSol, new Solution(solutionRestriction, permFlag, permCards, blankCard)]);
                                    solutionLengths.push(arr.length);
                                    breakLoop1 = true;
                                    breakLoop2 = true;
                                };
                            };
                        };
                        if (twoSolutions) {
                            relevantCurrentSolutions.push(new Solution(solutionRestriction, permFlag, permCards, blankCard));
                        } else {
                            if (backup) {
                                backupSolution[solutionEval][0].push(new Solution(solutionRestriction, permFlag, permCards));
                                backupIndex.index = solutionEval;
                                backupIndex.length = arr.length;
                            } else {
                                console.log(solutionEval)
                                solutionsArr.push(new Solution(solutionRestriction, permFlag, permCards, blankCard));
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
            if (randomize ? Math.random() >= 0.5 : false) {
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

        if (randomize) valuesArr2 = randomSort(valuesArr2)
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
                // GENERATING NEW GOAL
                function newGoal(val) {
                    let numbers = []
                    for (let i = 0; i < 3; i++) {
                        let roll = getRandomNumber(1, 6)
                        switch (roll) {
                            case 1: numbers.push(1); break;
                            case 2: numbers.push(1); break;
                            case 3: numbers.push(2); break;
                            case 4: numbers.push(3); break;
                            case 5: numbers.push(4); break;
                            case 6: numbers.push(5); break;
                        };
                    };
                    let a = numbers[0], b = numbers[1], c = numbers[2]
                    // GOAL SHAPE 1
                    for (let num of numbers) if (num === val) return [[num], 1]
                    // GOAL SHAPE 2
                    if ((a + b) === val) return [[a, "+", b], 2]
                    if ((b + c) === val) return [[b, "+", c], 2]
                    if ((a + c) === val) return [[a, "+", c], 2]
                    // GOAL SHAPE 3
                    if ((a + b + c) === val) return [[a, "+", b, "+", c], 3]
                    // GOAL SHAPE 4
                    if ((a * b) === val) return [[a, "*", b], 4]
                    if ((b * c) === val) return [[b, "*", c], 4];
                    if ((a * c) === val) return [[a, "*", c], 4]
                    // GOAL SHAPE 6
                    if ((a * (b + c)) === val) return [[a, "*", b, "+", c], 6]
                    if ((b * (c + a)) === val) return [[b, "*", c, "+", a], 6]
                    if ((a * (c + b)) === val) return [[a, "*", c, "+", b], 6]
                    // GOAL SHAPE 7
                    if ((a * b + c) === val) return [[a, "*", b, "+", c], 7]
                    if ((b * c + a) === val) return [[b, "*", c, "+", a], 7]
                    if ((a * c + b) === val) return [[a, "*", c, "+", b], 7]
                    // GOAL SHAPE 5
                    if ((a * b * c) === val) return [[a, "*", b, "*", c], 5]
                    return newGoal(val)
                }
                let newGoalInput = newGoal(newGoalValue)
                console.log(newGoalInput)
                goalArr = newGoalInput[0]
                goalShape = newGoalInput[1]
                console.log("SOL", solution);
            } else {
                console.log("NOBACKUP, NEW PUZZLE");
                if (randomize) returnNewPuzzle = true;
            };
        } else {
            let highestSolutionLengthIndex = solutionLengths.indexOf(solutionLengths.slice().sort((a, b) => a - b)[solutionLengths.length - 1]);
            solution = solutionsArr[highestSolutionLengthIndex - 2];
            console.log("SOL", solution);
        };
        let stopTimer = new Date(); console.log(" > DONE GENERATING SOLUTIONS: " + (stopTimer.getTime() - setTimer.getTime())/1000 + " SECONDS");
        
        // MOVING CUBES FROM FORBBIDEN BACK TO RESOURCES
        let count = getRandomNumber(0, forbiddenArr.length)
        for (let i = 0; i < count; i++) {
            let toPush = randomArrayValue(forbiddenArr);
            if (toPush === "V" || toPush === "Ʌ") {
                modifiedCubesArr[3].push(toPush)
            } else {
                modifiedCubesArr[0].push(toPush)
            };
            forbiddenArr = deleteFirstArrItem(forbiddenArr, toPush);
        }        
        
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
        console.log(mapArr[0].join(''))
        console.log(mapArr[1].join(''))
        console.log(mapArr[2].join(''))
        console.log(mapArr[3].join(''))
        console.groupEnd()
    };
    generateSolutions()
    if (returnNewPuzzle) return generatePuzzle(randomize, setCubes, setUniverse, setVariations, setVariationsLength, setGoal, setForbidden);
    class PuzzleData {
        constructor(cubesArr, modifiedCubesArr, universeArr, variationsArr, goalArr, goalShape, goalValues, forbiddenArr, solution) {
            this.cubes = cubesArr;
            this.modifiedCubes = modifiedCubesArr;
            this.universe = universeArr;
            this.variations = variationsArr;
            this.goal = goalArr;
            this.goalShape = goalShape;
            this.goalValues = goalValues;
            this.forbidden = forbiddenArr;
            this.solution = solution;
        };

        getRestrictions() {
            return this.cubes[3].filter(val => val === '<' || val === '=');
        };
    };
    return new PuzzleData(cubesArr, modifiedCubesArr, universeArr, variationsArr, goalArr, goalShape, goalValues, forbiddenArr, solution)
};

// NEW PUZZLE
function newPuzzle(queueData) {
    console.group("NEW PUZZLE")

    // RESETTING CONTAINERS
    inputValues.flatArray = {
        "setNameArr1": [],
        "setNameArr2": [],
        "restrictionArr1": [[]],
        "restrictionArr2": [[]]
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
    inputValues.restrictionIndex = {
        "restrictionArr1": [0],
        "restrictionArr2": [0]
    };
    inputValues.blankWild = {
        "solution1": [false, false, false, false],
        "solution2": [false, false, false, false]
    };
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

    // GEN NEW PUZZLE
    // STARTING NEW PUZZLE WITH EXPANDED ROWS MAKES ROWS REMAIN EXPANDED
    const mainPuzzleWorker = new Worker('onsets_worker.js');
    paramsArr = 

    [undefined]
    // [false,
    //     [   ["R", "B", "G"],
    //         [1, 3, 5],
    //         ["U", "U", "-", "U"],
    //         ["<"]],
    //     ['RG', 'BRY', 'RGY', 'B', 'BRG', 'Y', 'BG', '', 'BRGY', 'G', 'R', 'BY', 'RY'],
    //     ['symmetricDifference', 'blankWild', 'forbiddenCard'],
    //     3,
    //     {
    //         'goalArr': [5, "*", 1, "*", 1],
    //         'goalValues': [5],
    //         'goalShape': 5
    //     },
    //     {
    //         'forbiddenArrLength': 0
    // }];

    // END PARAMS ARRAY

    if (queuedPuzzleData) {
        mainPuzzleWorker.postMessage([
            'return',
            queuedPuzzleData
        ])
    } else {
        mainPuzzleWorker.postMessage(paramsArr)
    };

    mainPuzzleWorker.onmessage = (e) => {
        puzzleData = e.data
        blankWild = puzzleData.variations.includes('blankWild')
        twoSolutions = puzzleData.variations.includes('twoSolutions')
        blankWildContainer.style.display = (blankWild) ? '' : 'none'
        solutionFormContainter.style.display = (twoSolutions) ? '' : 'none'
        
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
                    requiredArr.push(cube.name);
                    requiredContainer.dataset.values += cube.symbol
                    if (cube.symbol === 'V') cube.symbol = resourcesArr.includes("V") ? "V" : "Ʌ"
                    resourcesArr = deleteFirstArrItem(resourcesArr, cube.symbol)
                };
            } else if (highStandard[i]) {
                requiredArr.push(cube.name);
                requiredContainer.dataset.values += cube.symbol
                if (cube.symbol === 'U') cube.symbol = resourcesArr.includes("U") ? "U" : "∩"
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
        for (let requiredCube of requiredArr) {
            const newRequiredCube = document.createElement("div")
            newRequiredCube.classList.add("cube", "restraint-cube", requiredCube);
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
                    case "absValue": variationToPush = "Abs. Val."; break;
                    case "blankWild": variationToPush = "B. Wild"; break;
                    case "symmetricDifference": variationToPush = "Sym. Diff."; break;
                    case "twoSolutions": variationToPush = "Two Sol."; break;
                }
            } else {
                console.log(currVariation)
                switch (Object.keys(currVariation)[0]) {
                    case "requiredCube": variationToPush = "Req. Cube " + currVariation.requiredCube; break;
                    case "wild": variationToPush = "Wild " + currVariation.wild; break;
                    case "double": variationToPush = "Double " + currVariation.double; break;
                    case "requiredCard": variationToPush = "Req. Card " + currVariation.requiredCard; break;
                    case "forbiddenCard": variationToPush = "Forb. Card " + currVariation.forbiddenCard; break;
                }
            }
            variationsDisplay.children[i].innerText = variationToPush;
        }puzzleData
        console.log(puzzleData.variations)
        console.log(variationsDisplay)
        
        const queuePuzzleWorker = new Worker('onsets_worker.js');
        queuePuzzleWorker.postMessage(paramsArr)

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
        "restrictionArr1": [[]],
        "restrictionArr2": [[]]
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
    "restrictionIndex": {
        "restrictionArr1": [0],
        "restrictionArr2": [0]
    },
    "blankWild": {
        "solution1": [false, false, false, false],
        "solution2": [false, false, false, false]
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
        for (let node of inputValues.divNodes.restrictionArr2) {restrictionContainer.append(node)}
        for (let node of inputValues.divNodes.setNameArr2) {solutionContainer.append(node)}
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
        for (let node of restrictionContainer.children) {inputValues.divNodes.restrictionArr2.push(node.cloneNode())}
        for (let node of solutionContainer.children) {inputValues.divNodes.setNameArr2.push(node.cloneNode())}
        restrictionContainer.innerHTML = ""
        solutionContainer.innerHTML = ""
        for (let node of inputValues.divNodes.restrictionArr1) {restrictionContainer.append(node)}
        for (let node of inputValues.divNodes.setNameArr1) {solutionContainer.append(node)}
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
    let input, flatArray, wrap, restrictionIndex;
    let isRestriction = false;
    switch (currInput) {
        case "restriction1":
            input = restrictionContainer;
            flatArray = inputValues.flatArray.restrictionArr1;
            wrap = inputValues.wrapValue.restrictionArr1;
            restrictionIndex = inputValues.restrictionIndex.restrictionArr1;
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
            restrictionIndex = inputValues.restrictionIndex.restrictionArr2;
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
            if (isRestriction) {
                if (!flatArray[0].length) return;
                if (flatArray[restrictionIndex[0]].length) {
                    if (/[()]/.test(flatArray[restrictionIndex[0]].pop())) cubeWidth = 16;
                } else {
                    flatArray.pop()
                    flatArray.pop()
                    restrictionIndex[0] -= 2
                }
            } else {
                if (!flatArray.length) return;
                if (/[()]/.test(flatArray.pop())) cubeWidth = 16;
            };
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
    if (checkInputWidth(input, wrap, cubeWidth)) {
        if (isRestriction) {
            if (currCube === "<" || currCube === "=") {
                flatArray.push(currCube);
                flatArray.push([])
                restrictionIndex[0] += 2;
            } else {
                flatArray[restrictionIndex[0]].push(currCube)
            }
        } else {
            flatArray.push(currCube)
        };
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
    // notificationText.innerText = message
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
                return setOperation([calcSet(arr.slice(0, 3)), arr[3], ...arr.slice(4, arr.length)])
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
            let parsedRestrictionArr = []
            for (let i = 0; i < inputRestriction.length; i++) {
                if (i % 2 === 1) {
                    parsedRestrictionArr.push(inputRestriction[i]);
                } else {
                    parsedRestrictionArr.push(parseInput(inputRestriction[i]));
                };
            };
            let parsedSetName = parseInput(inputSetName)
            
            console.log(parsedRestrictionArr)
            console.log(parsedSetName)
            let restrictedCards = [];
            for (let i = 0; i < (inputRestriction.length - 1) / 2; i++) {
                let operation = parsedRestrictionArr[i * 2 + 1]
                let leftVal = parsedRestrictionArr[i * 2]
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

            if (nullRestriction && puzzleData.variations.includes('noNull')) {
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
            console.log(requiredContainer.dataset.values)
            let requiredScore = altCalcScore(requiredContainer.dataset.values)
            let resourcesScore = altCalcScore(requiredContainer.dataset.values.concat(resourcesContainer.dataset.values))
            for (let i = 1; i <= (twoSolutions ? 4 : 2); i++) {
                let input
                switch (i) {
                    case 1: input = restrictionArr1; break;
                    case 2: input = setNameArr1; break;
                    case 3: input = restrictionArr2; break;
                    case 4: input = setNameArr2; break;
                };
    
                let inputScore = altCalcScore(input)
                console.log(inputScore)
                console.log(requiredScore)
                
                for (let j = 0; j < requiredScore.length; j++) {
                    let min = requiredScore[j]
                    let max = resourcesScore[j]
                    let curr = inputScore[j]
                    if (curr < min) {
                        console.log(i)
                        // resultParagraph.innerText = `Required cubes missing from ${i % 2 == 0 ? 'Set Name' : 'Restriction'}`
                        resultParagraph.innerText = `Required cubes missing from Solution.`
                        return;
                    };
    
                    if (curr > max) {
                        if (j >= 5 && max !== 0) continue;
                        resultTitle.innerText = 'Incorrect:'
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
                    for (let node of inputValues.divNodes.restrictionArr2) {inputRestriction.append(node)}
                    for (let node of inputValues.divNodes.setNameArr2) {inputSetName.append(node)}
                    evaluationParagraph.innerText = `Your solution evaluates to ${solutionSet2.length} cards:`
                    inputCardSet.innerHTML = ''
                    for (let node of inputCardsArr[1]) inputCardSet.append(node)
                } else {    // CLICKED ON FIRST TOGGLE
                    answerLeftToggle.dataset.active = 'true'
                    answerRightToggle.dataset.active = 'false'
                    inputRestriction.innerHTML = ""
                    inputSetName.innerHTML = ""
                    for (let node of inputValues.divNodes.restrictionArr1) {inputRestriction.append(node)}
                    for (let node of inputValues.divNodes.setNameArr1) {inputSetName.append(node)}
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
        const inputSolutionContainer = document.createElement('div')
        const inputRestriction = document.createElement('div')
        const inputSetName = document.createElement('div')
        const bar = document.createElement('div')
        inputSolutionContainer.classList = 'answer-solution-container'
        bar.style.cssText = 'width: 100%; height: 2px; background-color: gray; margin: 5px'
        for (let node of inputValues.divNodes.restrictionArr1) {inputRestriction.append(node.cloneNode())}
        for (let node of inputValues.divNodes.setNameArr1) {inputSetName.append(node.cloneNode())}
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

                console.log(currIterable)


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

const settingsContainer = document.querySelector('#settings-container')
const menuBackground = document.createElement('div')
const header = document.querySelector('header')
menuBackground.id = 'menu-background'
menuBackground.addEventListener('click', () => {
    settingsContainer.classList.remove('shown')
    menuBackground.classList.remove('shown')
    header.classList.remove('dark')
    if (settingsNodesContainer.classList.contains('page-2')) {
        setTimeout(() => {
            settingsNodesContainer.classList.remove('page-2')
            settingsHeaderText.innerText = 'Settings'
        }, 150)
    }
})
header.addEventListener('click', () => menuBackground.click())
document.body.append(menuBackground)

settingsIcon.addEventListener('click', (e) => {
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
});
settingsContainer.addEventListener('click', (e) => e.stopPropagation())
let headerText = 'Settings'
const settingsNodesContainer = document.querySelector('#settings-nodes-container')
const settingsCardView = document.querySelector('#card-view')
const settingsHeader = document.querySelector('#settings-header')
const settingsHeaderText = document.querySelector('#settings-header h4')
const settingsNavButton = document.querySelector('#settings-nav-button')
settingsCardView.addEventListener('click', () => {
    settingsNodesContainer.classList.add('page-2')
    settingsHeaderText.classList.add('fade')
    settingsNavButton.classList.add('fade')
    headerText = 'Card View'
})

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

// currInput = 'restriction1'
// inputCube('red')
// inputCube('must-contain')
// inputCube('green')
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
