function generatePuzzle() {

    //GENERAL FUNCTIONS
    function generateRandomNumber(min, max) {
        return Math.floor(Math.random() * (max + 1 - min)) + min;
    };

    function deleteArrIndex(array, index) {
        return array.slice(0, index).concat(array.slice(index + 1));
    };

    function deleteFirstArrItem(array, item) {
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

    function parenthesis(val) {;
        return "(".concat(val.toString().concat(")"));
    }

    function round100000(num) {
        return Math.round(num * 100000) / 100000
    }

    function customEval(arr) {
        let arrOperation = arr[1]
        let answer;
        switch (arrOperation) {
            case "+":
                answer = arr[0] + arr[2]; break;
            case "-":
                answer = arr[0] - arr[2]; break;
            case "*":
                answer = arr[0] * arr[2]; break;
            case "/":
                answer = arr[0] / arr[2]; break;
            case "**":
                answer = arr[0] ** arr[2]; break;
        }
        return answer;
    }

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

    //DOES ARRAY CONTAIN VARIATION OBJECT? (WILD, BASE, MULTIPLEOF, EXPONENT)
    function containsVariation(input) {
        return (variationsArr.findIndex(val => Object.keys(val)[0] === input) !== -1) ? true : false
    }

    //UNUSED; ROLLS 2 DICE TO GET BINOMIAL DISTRIBUTION
    function binomialRandomNumber() {
        let sum = generateRandomNumber(1, 6) + generateRandomNumber(1, 6);
        if (sum > 6) {
            sum = 6 - (sum - 7);
        };
        return sum;
    };

    //GENERATION

    let cubesArr = [];

    (function generateCubes() {
        //RED
        const redCubes = [];
        for (let i = 0; i < 6; i++) {
            let roll = generateRandomNumber(1, 6)
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

        //BLUE
        const blueCubes = [];
        for (let i = 0; i < 6; i++) {
            let roll = generateRandomNumber(1, 6)
            switch (roll) {
                case 1: blueCubes.push(0); break;
                case 2: blueCubes.push(1); break;
                case 3: blueCubes.push(2); break;
                case 4: blueCubes.push(3); break;
                case 5: blueCubes.push("*"); break;
                case 6: blueCubes.push("/"); break;
                default: blueCubes.push(null);
            };
        };
        cubesArr.push(blueCubes);

        //GREEN
        const greenCubes = [];
        for (let i = 0; i < 6; i++) {
            let roll = generateRandomNumber(1, 6)
            switch (roll) {
                case 1: greenCubes.push(4); break;
                case 2: greenCubes.push(5); break;
                case 3: greenCubes.push(6); break;
                case 4: greenCubes.push("-"); break;
                case 5: greenCubes.push("*"); break;
                case 6: greenCubes.push("**"); break;
                default: greenCubes.push(null);
            };
        };
        cubesArr.push(greenCubes);

        //BLACK
        const blackCubes = [];
        for (let i = 0; i < 6; i++) {
            let roll = generateRandomNumber(1, 6)
            switch (roll) {
                case 1: blackCubes.push(7); break;
                case 2: blackCubes.push(8); break;
                case 3: blackCubes.push(9); break;
                case 4: blackCubes.push("+"); break;
                case 5: blackCubes.push("/"); break;
                case 6: blackCubes.push("sqrt"); break;
                default: blackCubes.push(null);
            };
        };
        cubesArr.push(blackCubes);

        //UNLIKELY CHANCE THAT FEW NUMERALS OR OPERATIONS ARE ROLLED
        let numeralsArr = cubesArr.flat().filter(val => typeof val === "number");
        let operationsArr = cubesArr.flat().filter(val => typeof val === "string");
        if (numeralsArr.length < 8 || operationsArr.length < 8) {
            cubesArr = [];
            generateCubes();
        };

        console.log(cubesArr);
    })();

    const variationsArr = [];

    (function generateVariations() {
        
        //GENERATES INPUT FOR VARIATIONS THAT REQUIRE INPUTS
        function variationInput(input) {
            switch (input) {
                case "wild": return generateRandomNumber(0, 1) && cubesArr.flat().some(val => val === 0 ) ? 0 : "x"; break;
                case "base":
                    let base = generateRandomNumber(8, 12);
                    return base === 10 ? variationInput("base") : base; break;
                case "multipleof": return generateRandomNumber(6, 11); break;
                case "exponent":
                    switch (generateRandomNumber(1, 4)) {
                        case 1: return "red"; break;
                        case 2: return "blue"; break;
                        case 3: return "green"; break;
                        case 4: return "black"; break;
                    }
            }
                
        }
        
        //GENERATES VARIATION
        while (variationsArr.length < generateRandomNumber(3, 6)) {
            let roll = generateRandomNumber(1, 11);
                switch (roll) {
                    case 1:
                        if (!containsVariation("wild") && cubesArr.flat().some(val => val === 0 || val === "x")) {
                            variationsArr.push({"wild": variationInput("wild")});
                        }; break;
                    case 2:
                        if (variationsArr.indexOf("PowersOfBase") === -1) {
                            variationsArr.push("PowersOfBase");
                        }; break;
                    case 3:
                        if (!containsVariation("Base")) {
                            variationsArr.push({"Base": variationInput("base")});
                        }; break;
                    case 4:
                        if (!containsVariation("MultipleOf")) {
                            variationsArr.push({"MultipleOf": variationInput("multipleof")});
                        }; break;
                    case 5:
                        if (variationsArr.indexOf("MultipleOperations") === -1) {
                            variationsArr.push("MultipleOperations");
                        }; break;
                    case 6:
                        if (variationsArr.indexOf("Factorial") === -1) {
                            variationsArr.push("Factorial");
                        }; break;
                    case 7:
                        if (variationsArr.indexOf("NumberOfFactors") === -1) {
                            variationsArr.push("NumberOfFactors");
                        }; break;
                    case 8:
                        if (!containsVariation("Exponent")) {
                            let exponentColor = variationInput("exponent")
                            let colorIndex;
                            switch (exponentColor) {
                                case "red": colorIndex = 0; break;
                                case "blue": colorIndex = 1; break;
                                case "green": colorIndex = 2; break;
                                case "black": colorIndex = 3; break;
                            }
                            let coloredNumerals = cubesArr[colorIndex].filter(val => typeof val === "number")
                            if (coloredNumerals.length > 0) {
                                variationsArr.push({"Exponent": exponentColor});
                            }
                        }; break;
                    case 9:
                        if (variationsArr.indexOf("Imaginary") === -1) {
                            variationsArr.push("Imaginary");
                        }; break;
                    case 10:
                        if (variationsArr.indexOf("Decimal") === -1) {
                            variationsArr.push("Decimal");
                        }; break;
                    case 11:
                        if (variationsArr.indexOf("Log") === -1) {
                            variationsArr.push("Log");
                        }; break;
                    default:
                        variationsArr.push(undefined);
                }
        };

        console.log(variationsArr);
    })();  
    let goalArr = [];
    let modifiedCubesArr = [...cubesArr];

    (function generateGoal() {

        let resourcesArr = cubesArr.flat();
        let numeralsArr = resourcesArr.filter(val => typeof val === "number");
        let operationsArr = resourcesArr.filter(val => typeof val === "string");
        let coloredNumerals;

        //console.log(resourcesArr);
        //console.log(numeralsArr);
        //console.log(operationsArr);

        //FUNCTION ADDS CUBE TO GOAL THEN REMOVES IT FROM RESOURCES
        function goalAddCube(cube, orientation = "up", forceColor = "false") {
            
            let colorIndex;
            //RANDOMLY CHOOSE COLOR INDEX UNTIL CUBE IS FOUND
            if (forceColor === "false") {
                function findColorIndex(...index) {
                    let tryIndex = generateRandomNumber(0, 3)
                    //IF TRYINDEX ALREADY CHECKED, TRY AGAIN WITH ANOTHER INDEX
                    if (index.indexOf(tryIndex) !== -1) {
                        if (index.length === 4) {
                            console.log(index);
                            console.log(tryIndex);
                            return "NOT FOUND";
                        };
                        return findColorIndex(...index);
                    } else {
                        //IF MCUBESARR CONTAINS TRYINDEX THEN SET COLOR INDEX, ELSE TRY AGAIN WITH ANOTHER INDEX
                        if (modifiedCubesArr[tryIndex].indexOf(cube) !== -1) {
                            return tryIndex;
                        } else {
                            index.push(tryIndex);
                            return findColorIndex(...index);
                        };
                    };
                };
                colorIndex = findColorIndex();
                if (typeof colorIndex !== "number") {
                    console.log(colorIndex);
                    return;
                };
            } else {
                colorIndex = forceColor;
            };
            
            let color = "";
            switch (colorIndex) {
                case 0: color = "red"; break;
                case 1: color = "blue"; break;
                case 2: color = "green"; break;
                case 3: color = "black"; break;
            };

            //PUSH CUBE TO GOAL
            
            goalArr.push({"cube":cube, "color": color, "orientation": orientation});
            
            //DELETE CUBE FROM OTHER ARRAYS
            modifiedCubesArr[colorIndex] = deleteFirstArrItem(modifiedCubesArr[colorIndex], cube);
            resourcesArr = deleteFirstArrItem(resourcesArr, cube);

            if (typeof cube === "number") {
                numeralsArr = deleteFirstArrItem(numeralsArr, cube);
                randomNumerals = randomSort(numeralsArr);
            } else {
                operationsArr = deleteFirstArrItem(operationsArr, cube);
                randomOperations = randomSort(operationsArr).filter(val => (val !== "sqrt" && val !== "/"));
            };
            
            if (forceColor !== "false") {
                coloredNumerals = deleteFirstArrItem(coloredNumerals, cube);
                coloredNumerals = randomSort(modifiedCubesArr[colorIndex].filter(val => typeof val === "number"));
            };

        };

        //ADDING CUBES TO THE GOAL
        let randomNumerals = randomSort(numeralsArr);
        let randomOperations = randomSort(operationsArr).filter(val => (val !== "sqrt" && val !== "/"));

        let goalStatus = [];

        function goalAdd2Numerals(three = true) {
                if (variationsArr.indexOf("NumberOfFactors") !== -1 
                && operationsArr.indexOf("x") !== -1 
                && generateRandomNumber(1, 5) === 1 
                && three === true) {
                    //IF # OF FACTORS: APPEND IT, THEN APPEND 2 NUMERALS (20%)
                    goalAddCube("x");
                    if (variationsArr.some(val => Object.values(val)[0] === 0)) {
                        goalAddCube(randomNumerals[0]);
                    } else {
                        goalAddCube(randomNumerals.filter(val => val !== 0)[0]);
                    };
                    goalAddCube(randomNumerals[0]);
                    goalStatus.push("NUMFACTOR");
                } else if (variationsArr.indexOf("Decimal") !== -1 && generateRandomNumber(1, 4) === 1 && three === true) {
                    //IF DECIMAL POINT: ADD 3 NUMERALS (25%)
                    if (variationsArr.some(val => Object.values(val)[0] === 0)) {
                        goalAddCube(randomNumerals[0]);
                    } else {
                        goalAddCube(randomNumerals.filter(val => val !== 0)[0]);
                    };
                    goalAddCube(randomNumerals[0]);
                    goalAddCube(randomNumerals[0]);
                } else if (containsVariation("Exponent") && generateRandomNumber(1, 5) === 1 && three === true){
                    //IF EXPONENT: APPEND A NUMERAL THEN 2 NUMERALS OF EXPONENT COLOR (20%)
                    let exponentColor = variationsArr[variationsArr.findIndex(val => Object.keys(val)[0] === "Exponent")].Exponent;
                    let colorIndex;
                    switch (exponentColor) {
                        case "red": colorIndex = 0; break;
                        case "blue": colorIndex = 1; break;
                        case "green": colorIndex = 2; break;
                        case "black": colorIndex = 3; break;
                    };

                    goalAddCube(randomNumerals[0]);
                    try {
                        coloredNumerals = randomSort(modifiedCubesArr[colorIndex].filter(val => typeof val === "number"))
                    } catch (error) {
                        console.log(error)
                        console.log(modifiedCubesArr)
                        console.log(colorIndex)
                        console.log(exponentColor)
                        console.log(variationsArr.findIndex(val => Object.keys(val)[0] === "Exponent"))
                        console.log(variationsArr[variationsArr.findIndex(val => Object.keys(val)[0] === "Exponent")])
                        console.log(Object.keys(variationsArr))
                    }
                    
                    if (coloredNumerals.length >= 2) {
                        goalAddCube(coloredNumerals[0], "up", colorIndex);
                        goalAddCube(coloredNumerals[0], "up", colorIndex);
                    } else if (coloredNumerals.length >= 1) {
                        goalAddCube(coloredNumerals[0], "up", colorIndex);
                    } else {
                        goalAddCube(randomNumerals[0]);
                    };
                } else {
                    //DEFAULT: APPEND 2 NUMERALS (DONT APPEND 0 FIRST UNLESS 0 WILD)
                    if (variationsArr.some(val => Object.values(val)[0] === 0)) {
                        goalAddCube(randomNumerals[0]);
                    } else {
                        goalAddCube(randomNumerals.filter(val => val !== 0)[0]);
                    };
                    goalAddCube(randomNumerals[0]);
                    goalStatus.push("2NUM");
                };
            };
        
        if (generateRandomNumber(1, 10) > 4) {
            //APPEND 2 NUMERALS TO GOAL (60%)
            goalAdd2Numerals();
        } else {
            //APPEND 1 NUMERAL TO GOAL (40%)
            //console.log("1 NUMERAL")
            //console.log(randomNumerals)
            if (variationsArr.some(val => Object.values(val)[0] === 0)) {
                goalAddCube(randomNumerals[0]);
            } else {
                goalAddCube(randomNumerals.filter(val => val !== 0)[0]);
            };

            //APPEND OPERATION AND NUMERALS
                if (randomOperations[0] === "**")  {
                    //IF EXPONENT, APPEND IT + 1 NUMERAL
                    goalAddCube(randomOperations[0]);
                    if (variationsArr.some(val => Object.values(val)[0] === 0)) {
                        goalAddCube(randomNumerals[0]);
                    } else {
                        goalAddCube(randomNumerals.filter(val => val !== 0)[0]);
                    };
                    goalStatus.push("EXPONENTOP");
                } else {
                    //ELSE APPEND OPERATION AND 1-3 NUMERALS
                    goalAddCube(randomOperations[0]);
                    goalStatus.push("NUMOP");
                    generateRandomNumber(0, 1) ? goalAdd2Numerals() : goalAddCube(randomNumerals[0]);
                };
            
        };

        //STAGE 2: APPEND MORE NUMERALS IF THERE IS ROOM

        if ((goalStatus.indexOf("NUMFACTOR") !== -1 || 
        (goalStatus.indexOf("2NUM") !== -1 && containsVariation("MultipleOf")))
        && operationsArr.indexOf("**") !== -1 
        && generateRandomNumber(1, 2) === 1
        && goalStatus.indexOf("NUMOP") === -1) {
            //IF POSSIBLE, APPEND EXPONENT AND 1-2 NUMERALS (50%)
            goalAddCube("**");
            if (variationsArr.some(val => Object.values(val)[0] === 0)) {
                goalAddCube(randomNumerals[0]);
            } else {
                goalAddCube(randomNumerals.filter(val => val !== 0)[0]);
            };
            if (generateRandomNumber(1, 5) !== 1) {
            //APPEND SECOND NUMERAL (80%)
            goalAddCube(randomNumerals[0]);
            };
        } else if (goalArr.length === 2) {
            //IF GOAL LENGTH = 2: APPEND OPERATION AND 1 - 3 CUBES
            goalAddCube(randomOperations.filter(val => val !== "**")[0]);
            generateRandomNumber(0, 1) ? goalAdd2Numerals() : goalAddCube(randomNumerals[0]);
        }

        if (goalArr.length === 3 && generateRandomNumber(1, 3) > 1) {
            //IF GOAL LENGTH = 3; APPEND OPERATION AND 1 - 2 CUBES (66%)
            if (goalStatus.indexOf("EXPONENTOP") === -1) {
                goalAddCube(randomOperations.filter(val => val !== "**")[0]);
            } else {
                goalAddCube(randomOperations.filter(val => val !== "**" && val !== "+" && val !== "-")[0]);
            }
            generateRandomNumber(0, 1) ? goalAdd2Numerals(false) : goalAddCube(randomNumerals[0]);
        } else if (goalArr.length === 4 && generateRandomNumber(0, 1)) {
            //IF GOAL LENGTH = 4; APPEND OPERATION AND 1 CUBE (50%)
            goalAddCube(randomOperations.filter(val => val !== "**")[0]);
            goalAddCube(randomNumerals[0]);
        }

        console.log(goalArr);
        // console.log(modifiedCubesArr);
    })();

    const goalValues = [];

    //CALCULATE GOAL
    (function calcGoal() {
        let newGoalArr = [];
        for (let i = 0; i < goalArr.length; i++) {
            function pushNumber(index) {
                if (index < goalArr.length - 1) {
                    if (typeof goalArr[index + 1].cube === "string") {
                        return goalArr[index].cube;
                    }
                } else {
                    return goalArr[index].cube;
                }
                i++
                // console.log(goalArr)
                // console.log(goalArr[index])
                // console.log(goalArr[index + 1])
                return goalArr[index].cube.toString().concat(pushNumber(index + 1))
            }

            if (variationsArr.indexOf("NumberOfFactors") !== -1) {
                if (goalArr[i].cube === "x" && i > 0) {
                    if (typeof goalArr[i - 1].cube === "string") {
                        newGoalArr.push(pushNumber(i))
                        continue;
                    }
                } else if (goalArr[i].cube === "x") {
                    newGoalArr.push(pushNumber(i))
                    continue;
                }
            }

            if (typeof goalArr[i].cube === "number") {
                newGoalArr.push(pushNumber(i))
            } else {
                newGoalArr.push(goalArr[i].cube)
            }
        }
        console.log(newGoalArr)
        
        let answ = [];
        let calcGoalPermutations = []

        function generatePermutations(arr = newGoalArr) {
            let iterationCount = (arr.length - 1) / 2
        
            for (let i = 0; i < iterationCount; i++) {
                // console.log("I: " + i)
                let permutationToPush = [];
                for (let j = 0; j < i * 2; j++) {
                    permutationToPush.push(arr[j]);
                };
                
                permutationToPush.push("(" + arr[i * 2] + arr[i * 2 + 1] + arr[i * 2 + 2] + ")");
                for (let j = i * 2 + 3; j < arr.length; j++) {
                    permutationToPush.push(arr[j]);
                };
                if (permutationToPush.length > 3) {
                    generatePermutations(permutationToPush);
                };
                if (iterationCount <= 2) {
                    calcGoalPermutations.push(permutationToPush);
                };
                
                // console.log(permutationToPush);
            }
        };
        
        generatePermutations(newGoalArr);
        
        
        // console.log(arr);
        console.log(calcGoalPermutations)
        calcGoalPermutations.forEach(val => answ.push(eval(val.join(""))));

        if (newGoalArr.length === 1) {
            answ = newGoalArr;
        }

        // console.log(answ)
        for (let x of answ) {
            goalValues.push(x)
        }
        return answ;
        
    }());

    console.log(goalValues)

    console.log([...modifiedCubesArr.flat()])

    let forbiddenArr = [];

    //RANDOMLY ADD CUBES TO FORBIDDEN ARRAY
    (function generateForbidden() {

        //forbiddenArrLength BASED ON GOAL 
        switch (goalArr.length) {
            case 3: forbiddenArrLength = generateRandomNumber(9, 11); break;
            case 4: forbiddenArrLength = generateRandomNumber(8, 10); break;
            case 5: forbiddenArrLength = generateRandomNumber(7, 9); break;
            case 6: forbiddenArrLength = generateRandomNumber(6, 8); break;
        }

        function addForbiddenCubes(...index) {

            let tryIndex = generateRandomNumber(0, 3)
            //IF TRYINDEX ALREADY CHECKED, TRY AGAIN WITH ANOTHER INDEX
            if (index.indexOf(tryIndex) !== -1) {
                
                if (index.length === 4) {
                    console.log(index)
                    console.log(tryIndex)
                    return;
                }
                addForbiddenCubes(...index);

             } else if (forbiddenArr.length < forbiddenArrLength) {
                let filterFunc = (val) => true
                //IF LESS THAN 5 NUMBERS, ONLY APPEND OPERATIONS + VICE VERSA
                if (modifiedCubesArr.flat().filter(val => typeof val === "number").length < 5) {
                    filterFunc = (val => typeof val === "string")
                } else if (modifiedCubesArr.flat().filter(val => typeof val === "string").length < 5) {
                    filterFunc = (val => typeof val === "number")
                }
                //IF FILTERED MCUBESARR CONTAINS TRYINDEX THEN APPEND TO FORBIDDEN, ELSE TRY AGAIN WITH ANOTHER INDEX
                if (modifiedCubesArr[tryIndex].filter(filterFunc).length !== 0) {

                    let color = "";
                    switch (tryIndex) {
                        case 0: color = "red"; break;
                        case 1: color = "blue"; break;
                        case 2: color = "green"; break;
                        case 3: color = "black"; break;
                    }

                    forbiddenArr.push({"cube": modifiedCubesArr[tryIndex].filter(filterFunc)[0], "color": color})
                    let arrIndex = modifiedCubesArr[tryIndex].indexOf(modifiedCubesArr[tryIndex].filter(filterFunc)[0])
                    modifiedCubesArr[tryIndex] = deleteArrIndex(modifiedCubesArr[tryIndex], arrIndex)
                    addForbiddenCubes(...index)

                } else {
                    index.push(tryIndex);
                    addForbiddenCubes(...index)
                }
            }
        };

        addForbiddenCubes();

    })();

    console.log(forbiddenArr)
    let allValues = [modifiedCubesArr.flat()];
    
    allValues = [[1, 2, 3, 4, 5, 6, "+", "-", "*", "/"]]

    let numeralsArr = allValues[0].filter(val => typeof val === "number")
    let operationsArr = allValues[0].filter(val => typeof val === "string")

    console.log(allValues);
    console.log(numeralsArr);
    console.log(operationsArr);
    let permutationsArr = [];

    let setTimer = new Date();


    let solutionsArr = [];

    (function generateSolutions() {

        let permutationRegex = /.+(?=\/)/;
        let flagRegex = /\/.*/;
        let nonExponentRegex = /[+-/*]/
        let numbersRegex = /[-\d]+/

        function calcSolution(arr, type = 2, returnPermutations = 0) {
            if (type === 1) {
                let answ = [];
                let calcPermutations = []

                function generatePermutations(arr) {
                    let iterationCount = (arr.length - 1) / 2
                
                    for (let i = 0; i < iterationCount; i++) {
                        let permutationToPush = [];
                        for (let j = 0; j < i * 2; j++) {
                            permutationToPush.push(arr[j]);
                        };
                        // IF OPERATION IS DIVISION
                        if (arr[i * 2 + 1] === "/") {
                            if (arr[i * 2].toString().match(numbersRegex)[0] % arr[i * 2 + 2].toString().match(numbersRegex)[0] !== 0) {
                                continue;
                            }
                        }
                        permutationToPush.push("(" + arr[i * 2] + arr[i * 2 + 1] + arr[i * 2 + 2] + ")");
                        for (let j = i * 2 + 3; j < arr.length; j++) {
                            permutationToPush.push(arr[j]);
                        };
                        if (permutationToPush.length > 3) {
                            generatePermutations(permutationToPush);
                        };
                        if (iterationCount <= 2) {
                            calcPermutations.push(permutationToPush);
                        };
                        
                        // console.log(permutationToPush);
                    }  
                }
                generatePermutations(arr);
                
                // console.log(arr);
                // console.log(calcPermutations)
                if (returnPermutations) {
                    return calcPermutations
                }
                calcPermutations.forEach(val => answ.push(eval(val.join(""))));

                if (arr.length === 1) {
                    answ = arr;
                }
                // console.log(answ);
                return answ;
            } else if (type === 2) {

                if (arr.length === 3) {
                    // console.log(arr)
                    answer = customEval(arr)
                    // if (answer === NaN || answer === Infinity) {
                    //     return "break";
                    // }
                    return [answer]
                } else if (arr.length > 3) {
                    let iterationCount = (arr.length - 1) / 2;
                    let permutations = []

                    for (let i = 0; i < iterationCount; i++) {
                        let leftValues = (calcSolution(arr.slice(0, (i + 1) * 2 - 1)))
                        let rightValues = (calcSolution(arr.slice((i + 1) * 2, arr.length)))
                        for (let j of leftValues) {
                            // if (j === "break") {
                            //     continue;
                            // };
                            let lValue = j
                            for (let k of rightValues) {
                                // if (k === "break") {
                                //     continue;
                                // };
                                let rValue = k
                                let totalValue = customEval([lValue, arr[(i + 1) * 2 - 1], rValue])
                                if (totalValue === NaN || totalValue === Infinity) {
                                    continue;
                                };
                                permutations.push(totalValue);
                            }
                            
                        }
                    }
                    for (let i of permutations) {
                        for (let j of goalValues) {
                            if (i === j) {
                                solutionsArr.push(arr)
                            }
                        }
                    }
                    return permutations;

                } else if (arr.length === 1) {
                    return [arr[0]];
                }

            } else {
                console.log("INCORRECT TYPE")
            }
            
        }

        // ARR = CURRENT ARRAY, NUMERALS/OPERATIONS = AVAILABLE NUMERALS/OPERATIONS, VARIANTS = APPLIED VARIATIONS
        function solutionCycle(arr, numerals, operations, variants = []) {
            if (permutationsArr.length % 100000 === 0 && permutationsArr.length > 0) {
                console.log((permutationsArr.length/1000) + " THOUSAND")
            }
            // calcSolution(arr)
            permutationsArr.push(arr)

            if (numerals.length > 0 && operations.filter(val => val !== "sqrt").length > 0) {
                // SUBSEQUENT TIMES CALLING THE ARRAY: APPEND AN OPERATION AND A NUMERAL
                for (let i of filterDuplicates(operations).filter(val => val !== "sqrt")) {
                    for (let j of filterDuplicates(numerals)) {
                        // APPEND OPERATION AND NUMERAL
                        solutionCycle(arr.concat(i).concat(j), deleteFirstArrItem(numerals, j), deleteFirstArrItem(operations, i))
                        // UPSIDEDOWN
                        if (j !== 0) {
                            solutionCycle(arr.concat(i).concat(-j), deleteFirstArrItem(numerals.filter(val => val !== 0), j), deleteFirstArrItem(operations, i))
                            // SIDEWAYS
                            // if (j !== 1 && (i === "*" || i == "/")) {
                            //     solutionCycle(arr.concat(i).concat(round100000(1/j)), deleteFirstArrItem(numerals, j), deleteFirstArrItem(operations, i))
                            //     solutionCycle(arr.concat(i).concat(parenthesis(round100000(-1/j))), deleteFirstArrItem(numerals, j), deleteFirstArrItem(operations, i))
                            // } 
                        }
                    }
                }
            }
            // console.log(arr)
            // console.log(numerals)
            // console.log(operations)
            // console.log(variants)
        }

        function firstSolutionCycle(arr, numerals, operations, variants = []) {
            for (let i of filterDuplicates(numerals)) {
                solutionCycle([i], deleteFirstArrItem(numerals, i), operations)
                //UPSIDEDOWN
                if (i !== 0) {
                    solutionCycle([-i], deleteFirstArrItem(numerals, i), operations)
                    // SIDEWAYS
                    // if (i !== 1 && (i === "*" || i === "/")) {
                    //     solutionCycle([round100000(1/i)], deleteFirstArrItem(numerals, i), operations)
                    //     solutionCycle([parenthesis(round100000(-1/i))], deleteFirstArrItem(numerals, i), operations)
                    // }
                }
            }
        }

        firstSolutionCycle([], [...numeralsArr], [...operationsArr])

        console.log("TESTING: ")

        let testArr = [2, '-', 1, '-', 1, "*", 5, "**", 5]

        for (let i = 0; i < 1000; i++) {
            // calcSolution(testArr)
            // calcSolution(testArr, 2)
        }

        console.log(calcSolution(testArr, 2))
        console.log(calcSolution(testArr, 1))
        // console.log(calcSolution([1, "-", 2, "-", 3], 4))
        let testForDuplicates = calcSolution(testArr, 1, 1)
        // console.log(testForDuplicates)
        let skip = []
        for (let i of testForDuplicates) {
            let match = false;
            for (let x of skip) {
                if (testForDuplicates.indexOf(i) === x) {
                    match = true;
                }
            }
            if (match === true) {
                continue;
            }
            if (testForDuplicates.indexOf(i) >= testForDuplicates.length / 2 + 1) {
                continue;
            }
            for (let j of testForDuplicates) {
                let match = true;
                for (let k = 0; k < j.length; k++) {
                    if (i[k] !== j[k] || testForDuplicates.indexOf(i) === testForDuplicates.indexOf(j)) {
                        match = false;
                    }
                }
                if (match === true) {
                    // console.log("DUPLICATE: " + testForDuplicates.indexOf(i) + " + " + testForDuplicates.indexOf(j))
                    skip.push(testForDuplicates.indexOf(j))
                }
            }
        }
        
        
        console.log("TOTAL LENGTH: " + permutationsArr.length)
        console.log("SAMPLE: ")

        for (let i = 0; i < 10; i++) {
            let randomIndex = permutationsArr[generateRandomNumber(0, permutationsArr.length - 1)]
            console.log(randomIndex)
            console.log(calcSolution(randomIndex))
        }

        console.log(solutionsArr)
        // for (let x of permutationsArr.filter(val => val.length === 2)) {
        //     console.log(x)
        // }

        /*
        0X Wild / Powers of the Base Conflict: Wild representing 1 can represent power ? Assume they cannot
        Exponent / UD / SW Conflict: Exponent can be sideways or upsidedown ? Assume they cannot
        Working definition of BASE M : TWO DIGIT NUMERALS IN SOLUTION AND GOAL ARE INTERPRETED BASE M BEFORE OPERATIONS
        AFTER OPERATIONS, THEY ARE INTERPRETED BASE 10 

        multiple of k, decimal in goal (2)
        NUMBERAL CUBES !IN SOLUTIONS! CAN BE SW AND UD


        0X wild : MUST REPRESENT SAME THING EVERYWHERE, MOPS ALLOWS MULTIPLE USES OF OPERATIONS (3)

        UD (4)
        
        ^ = 10 (BASE M)
        SW (5)

        Powers of the Base (6)

        BASE M (7)

        MOPS (8)

        Imaginary / Log (10)

        Exponent (11)

        ! and # of Factors during parsing (no larger than 8!; x(a ^ b + c) is prohibited) (13)
        */
    })();
    let stopTimer = new Date()
    // console.log(setTimer.getTime())
    // console.log(stopTimer)
    console.log((stopTimer.getTime() - setTimer.getTime())/1000 + " SECONDS")






    //TURN ** INTO ^

    let modifiedGoalArr = goalArr.map(val => {
        let modify = {...val};
        switch (modify.cube) {
            case "-": modify.cube = "−"; break;
            case "*": modify.cube = "x"; break;
            case "/": modify.cube = "÷"; break;
            case "**": modify.cube = "^"; break;
            case "sqrt": modify.cube = "√"; break;
        }
        return modify;
    })

    let modifiedForbiddenArr = forbiddenArr.map(val => {
        let modify = {...val};
        switch (modify.cube) {
            case "-": modify.cube = "−"; break;
            case "*": modify.cube = "x"; break;
            case "/": modify.cube = "÷"; break;
            case "**": modify.cube = "^"; break;
            case "sqrt": modify.cube = "√"; break;
        }
        return modify;
    })

    // console.log(modifiedGoalArr)
    //GOAL

    let goalContainer = document.getElementById("goal-container")
    let goalBar = document.getElementById("goal-bar")

    for (let i = 0; goalContainer.childElementCount > 1; i++) {
        goalContainer.removeChild(goalContainer.children[0])
    }

    for (let i = 0; goalContainer.childElementCount < modifiedGoalArr.length + 1 && i < 100; i++) {
        let newGoalCube = document.createElement("div");
        newGoalCube.innerHTML = modifiedGoalArr[i].cube;
        newGoalCube.classList.add("cube", "answercube", modifiedGoalArr[i].color);
        goalContainer.insertBefore(newGoalCube, goalBar);
    }

    // console.log(forbiddenArr)
    //FORBIDDEN

    let forbiddenContainer = document.getElementById("forbidden-container")

    forbiddenContainer.innerHTML = ""

    for (let i = 0; forbiddenContainer.childElementCount < modifiedForbiddenArr.length && i < 100; i++) {
        let newForbiddenCube = document.createElement("div");
        newForbiddenCube.innerHTML = modifiedForbiddenArr[i].cube;
        newForbiddenCube.classList.add("cube", "restraint-cube", modifiedForbiddenArr[i].color);
        forbiddenContainer.append(newForbiddenCube);
    }
    // console.log(goalContainer)


};

generatePuzzle();





/*
if (arr.length === 3) {
    let answer = (eval(arr.join("")) + "/");
    if (answer === NaN || answer === Infinity) {
        return "break";
    }
    return answer;
} else if (arr.length > 3) {
    let permutations = [];
    let w = []
    let q = []
    w.push(calcGoal(arr.slice(0, arr.length - 2)));
    q.push(calcGoal(arr.slice(2, arr.length)));
    w = w.flat()
    q = q.flat()
    for (let x of w) {
        if (x === "break") {
            continue;
        };
        let permutation = parenthesis(x.match(permutationRegex)[0]);
        let flag = x.match(flagRegex)[0];
        permutation = round100000(eval(permutation + arr[arr.length - 2] + arr[arr.length - 1])).toString();
        if (permutation === NaN || permutation === Infinity) {
            continue;
        };
        // console.log(permutation)
        x = permutation.concat(flag.concat("w"));
        permutations.push(x)
    }
    for (let x of q) {
        if (x === "break") {
            continue;
        };
        let permutation = parenthesis(x.match(permutationRegex)[0]);
        let flag = x.match(flagRegex)[0];
        permutation = (eval(arr[0] + arr[1] + permutation).toString());
        if (permutation === NaN || permutation === Infinity) {
            continue;
        };
        // console.log(permutation)
        x = permutation.concat(flag.concat("q"));
        permutations.push(x);
    }
    console.log(permutations)
    return permutations;
} else if (arr.length === 1) {
    return arr[0];
}


*/


//FIGURE OUT THE FLAGS TO GET THIS TO WORK

//let flagRegex2 = /(?<=\/).+/;

/*
if (arr.length === 3) {
    // console.log(arr)
    answer = customEval(arr)
    if (answer === NaN || answer === Infinity) {
        return "break";
    }
    return [answer + "/"]
} else if (arr.length > 3) {
    let iterationCount = (arr.length - 1) / 2;
    let permutations = []

    for (let i = 0; i < iterationCount; i++) {
        let leftValues = (calcSolution(arr.slice(0, (i + 1) * 2 - 1), 3))
        let rightValues = (calcSolution(arr.slice((i + 1) * 2, arr.length), 3))
        console.log(arr)
        console.log(leftValues)
        console.log(rightValues)
        // iterations = iterations.flat()
        for (let j of leftValues) {
            if (j === "break") {
                continue;
            };
            let lValue = parseFloat(j.match(permutationRegex)[0]);
            let lFlag = ""
            if (flagRegex2.test(j)) {
                lFlag = j.match(flagRegex2)[0];
            }
            for (let k of rightValues) {
                if (k === "break") {
                    continue;
                };
                let rValue = parseFloat(k.match(permutationRegex)[0]);
                let rFlag = ""
                if (flagRegex2.test(k)) {
                    rFlag = k.match(flagRegex2)[0]
                }
                let totalValue = customEval([lValue, arr[(i + 1) * 2 - 1], rValue])
                if (totalValue === NaN || totalValue === Infinity) {
                    continue;
                };
                console.log(totalValue)
                // console.log(lFlag)
                // console.log(rFlag)
                totalValue = `${totalValue}/l${lFlag}r${rFlag}`
                totalValue = totalValue.toString().concat(lFlag.concat(rFlag.concat(i + 1 + "/")))
                console.log(totalValue)
                permutations.push(totalValue);
            }
            
        }
    }
    
    return permutations;

} else if (arr.length === 1) {
    return [arr[0] + "/"];
}
*/

/*
(function generatePossibleValues() {
    return;
    

    if (containsVariation("wild")) {
        let wildValues0 = [1, 2, 3, 4, 5, 6, 7, 8, 9, "+", "-", "x", "/", "**", "sqrt"]
        let wildValuesX = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, "+", "-", "/", "**", "sqrt"]

        if (variationsArr.some(val => Object.values(val)[0] === 0)) {
            for (let i = 0; i < wildValues0.length; i++) {
                let newWildArr = allValues[0].map(val => {
                    let modify = val
                    if (modify === 0) {
                        modify = wildValues0[i]
                        return modify
                    } else {
                        return modify
                    }
                })
                allValues.push(newWildArr);
            }
        } else {
            for (let i = 0; i < wildValuesX.length; i++) {
                let newWildArr = allValues[0].map(val => {
                    let modify = val
                    if (modify === "x") {
                        modify = wildValues0[i]
                        return modify
                    } else {
                        return modify
                    }
                })
                allValues.push(newWildArr);
            }
        }

    }


    console.log(modifiedCubesArr)
    console.log(allValues);

})();
*/