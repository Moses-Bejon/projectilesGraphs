import plot from "./plot.js"

import {
    formatValue,
    toRadians,
    toDegrees,
    horizontalComponent,
    verticalComponent,
    quadraticFormulaPositive,
    quadraticFormulaNegative
} from "./maths.js"

import {
    getTrajectory,
    getTrajectoryApogee,
    resolution
} from "./trajectory.js";

import {
    entryPresets,
    legendPresets,
    homeHTML,
    taskHTML
} from "./dynamicContent.js";

const content = document.getElementById("content")

function loadInto(html, into, callback){
    into.innerHTML = html
    callback()
}

// used to enter homescreen and contains behaviour of the home screen
function home() {
    loadInto(homeHTML, content, function () {
        document.getElementById("task1Button").onclick = function () {
            task(1)
        }
        document.getElementById("task2Button").onclick = function () {
            task(2)
        }
        document.getElementById("task3Button").onclick = function () {
            task(3)
        }
        document.getElementById("task4Button").onclick = function () {
            task(4)
        }
    })
}

function task(number) {
    loadInto(taskHTML, content, function () {
        const inputs = document.getElementById("inputs")
        const graph = document.getElementById("graph")

        function setbuttons() {
            const fitButton = document.getElementById("fitButton")
            fitButton.onclick = () => {
                graph.updateAxes()
            }

            const homeButton = document.getElementById("homeButton")
            homeButton.onclick = home
        }
        switch (number) {
            case 1: {
                const entries = addEntries(["angle", "g", "u", "h", "timeStep"],[], inputs, updatePlot)

                const angleInput = entries.next().value
                const gInput = entries.next().value
                const uInput = entries.next().value
                const heightInput = entries.next().value
                const timeStepInput = entries.next().value

                updatePlot()
                graph.updateAxes()

                function updatePlot() {
                    const angle = toRadians(parseFloat(angleInput.value))
                    const g = parseFloat(gInput.value)
                    const u = parseFloat(uInput.value)
                    const height = parseFloat(heightInput.value)
                    const timeStep = parseFloat(timeStepInput.value)

                    let vx = horizontalComponent(u, angle)
                    let vy = verticalComponent(u, angle)
                    let x = 0
                    let y = height

                    const points = []

                    points.push([x, y])
                    while (y >= 0) {
                        x += vx * timeStep
                        vy += 0.5 * -g * timeStep
                        y += vy * timeStep
                        vy += 0.5 * -g * timeStep
                        points.push([x, y])
                    }

                    graph.clearLinePlotData()
                    graph.plotLine(points, "black")
                }

                setbuttons()
                break
            }
            case 2: {
                const entries = addEntries(["angle", "g", "u", "h"],[], inputs, updatePlot)

                const angleInput = entries.next().value
                const gInput = entries.next().value
                const uInput = entries.next().value
                const heightInput = entries.next().value

                updatePlot()
                graph.updateAxes()

                function updatePlot() {
                    const angle = toRadians(parseFloat(angleInput.value))
                    const g = parseFloat(gInput.value)
                    const u = parseFloat(uInput.value)
                    const height = parseFloat(heightInput.value)
                    const trajectory = getTrajectory(g, u, angle, height)

                    graph.clearLinePlotData()
                    graph.plotLine(trajectory.points, "black")
                    graph.clearPointPlotData()
                    graph.plotPoint(getTrajectoryApogee(g, u, angle, height), "Apogee")
                }

                setbuttons()
                break
            }
            case 3: {
                const entries = addEntries(["g", "u", "X", "Y"],["minU","highBall","lowBall","maxX"], inputs, updatePlot)

                const gInput = entries.next().value
                const uInput = entries.next().value
                const XInput = entries.next().value
                const YInput = entries.next().value


                const minUAngleLabel = entries.next().value
                const minULabel = entries.next().value
                const minULengthLabel = entries.next().value
                const highBallAngleLabel = entries.next().value
                const highBallLengthLabel = entries.next().value
                const lowBallAngleLabel = entries.next().value
                const lowBallLengthLabel = entries.next().value
                const maxAngleLabel = entries.next().value
                const maxDistanceLabel = entries.next().value
                const maxLengthLabel = entries.next().value

                updatePlot()
                graph.updateAxes()

                function updatePlot() {
                    const g = parseFloat(gInput.value)
                    const u = parseFloat(uInput.value)
                    const X = parseFloat(XInput.value)
                    const Y = parseFloat(YInput.value)

                    const angleLow = Math.atan(quadraticFormulaNegative(g * X ** 2, -2 * u ** 2 * X, 2 * u ** 2 * Y + g * X ** 2))
                    const angleHigh = Math.atan(quadraticFormulaPositive(g * X ** 2, -2 * u ** 2 * X, 2 * u ** 2 * Y + g * X ** 2))

                    const minU = Math.sqrt(g * Y + g * Math.sqrt(Y ** 2 + X ** 2))
                    const minUAngle = Math.atan((Y + Math.sqrt(Y ** 2 + X ** 2)) / X)

                    const maxDistance = u ** 2 / g
                    const maxAngle = Math.PI / 4

                    graph.clearLinePlotData()

                    if (isNaN(angleLow)) {
                        highBallAngleLabel.innerHTML = "N/A"
                        lowBallAngleLabel.innerHTML = "N/A"
                    } else {
                        const lowBallTrajectory = getTrajectory(g, u, angleLow, 0)
                        const highBallTrajectory = getTrajectory(g, u, angleHigh, 0)

                        highBallAngleLabel.innerHTML = formatValue(toDegrees(angleHigh), 4) + "º"
                        lowBallAngleLabel.innerHTML = formatValue(toDegrees(angleLow), 4) + "º"
                        highBallLengthLabel.innerHTML = formatValue(highBallTrajectory.length,4) + "m"
                        lowBallLengthLabel.innerHTML = formatValue(lowBallTrajectory.length,4)+"m"

                        graph.plotLine(lowBallTrajectory.points, "green")
                        graph.plotLine(highBallTrajectory.points, "blue")
                    }

                    const xStepForBoundary = (u ** 2 / g) * (1/resolution)
                    const boundaryPoints = []
                    for (let i = 0; i <= resolution; i++) {
                        const x = i * xStepForBoundary
                        const y = (u ** 4 - (g * x) ** 2) / (2 * u ** 2 * g)
                        boundaryPoints.push([x, y])
                    }

                    const minUTrajectory = getTrajectory(g, minU, minUAngle, 0)
                    const maxDistanceTrajectory = getTrajectory(g, u, maxAngle, 0)

                    minUAngleLabel.innerHTML = formatValue(toDegrees(minUAngle), 4)
                    minULabel.innerHTML = formatValue(minU, 4)
                    minULengthLabel.innerHTML = formatValue(minUTrajectory.length,4)
                    maxAngleLabel.innerHTML = formatValue(toDegrees(maxAngle),4)
                    maxDistanceLabel.innerHTML = formatValue(maxDistance,4)
                    maxLengthLabel.innerHTML = formatValue(maxDistanceTrajectory.length,4)

                    graph.plotLine(minUTrajectory.points, "black")
                    graph.plotLine(maxDistanceTrajectory.points,"red")
                    graph.plotLine(boundaryPoints, "purple")

                    graph.clearPointPlotData()
                    graph.plotPoint([X, Y], "Target")
                }

                setbuttons()
                break
            }
            case 4: {
                const entries = addEntries(["angle", "g", "u", "h"],["inputX","maxX"], inputs, updatePlot)
                const angleInput = entries.next().value
                const gInput = entries.next().value
                const uInput = entries.next().value
                const heightInput = entries.next().value

                const distanceLabel = entries.next().value
                const lengthLabel = entries.next().value
                const maxAngleLabel = entries.next().value
                const maxDistanceLabel = entries.next().value
                const maxLengthLabel = entries.next().value

                updatePlot()
                graph.updateAxes()

                function updatePlot() {
                    const angle = toRadians(parseFloat(angleInput.value))
                    const g = parseFloat(gInput.value)
                    const u = parseFloat(uInput.value)
                    const height = parseFloat(heightInput.value)

                    const trajectory = getTrajectory(g, u, angle, height)
                    const distance = trajectory.points[trajectory.points.length - 1][0]
                    const maxDistance = u * Math.sqrt(2 * height * g + u ** 2) / g
                    const maxAngle = Math.atan(u / (Math.sqrt(2 * height * g + u ** 2)))
                    const maxDistanceTrajectory = getTrajectory(g, u, maxAngle, height)

                    distanceLabel.innerHTML = formatValue(distance, 4)
                    lengthLabel.innerHTML = formatValue(trajectory.length,4)
                    maxDistanceLabel.innerHTML = formatValue(maxDistance, 4)
                    maxAngleLabel.innerHTML = formatValue(toDegrees(maxAngle), 4)
                    maxLengthLabel.innerHTML = formatValue(maxDistanceTrajectory.length,4)

                    graph.clearLinePlotData()
                    graph.plotLine(trajectory.points, "black")
                    graph.plotLine(maxDistanceTrajectory.points,"red")


                }

                setbuttons()
                break
            }
        }
    })
}

function* addEntries(entries,legends,into,updatePlot){
    entries.forEach((entry)=>{
        const presets = entryPresets[entry]
        addEntry(presets["name"],presets["label"],into,presets["value"],presets["min"],presets["max"])
    })
    legends.forEach((legend) =>{
        const presets = legendPresets[legend]
        addLegend(presets["label"],presets["infoBefores"],presets["infos"],presets["infoAfters"],presets["colour"],into)
    })
    for (const entry of entries){
        yield connectToEntry(entryPresets[entry]["name"],updatePlot)
    }
    for (const legend of legends){
        for (const info of legendPresets[legend]["infos"]) {
            yield document.getElementById(info)
        }
    }
}

function addLegend(label,infoBefores,infos,infoAfters,colour,into){
    let html = `<div class="legend">
    <label class="label">${label}</label>
    <div class="colourContainer"><div class="colour ${colour}"></div></div>
    <div class="info">`

    for (let i = 0;i<infos.length;i++){
        html += infoBefores[i]
        html += `<span id="${infos[i]}"></span>`
        html += infoAfters[i]+"<br>"
    }
    html += "</div></div>"
    into.innerHTML += html
}

function addEntry(name, label, into, value=5, min=1, max=100) {
    const html = `<div class="entry">
    <label class="inputLabel" for="${name}">${label}</label>
    <input id="${name}" class="numberInput" type="number" name="${name}" min="${min}" max="${max}" value="${value}">
    <input id="${name}Slider" class="slider" type="range" name="${name}" min="${min}" max="${max}" value="${value}" step="0.001">
    </div>`

    into.innerHTML += html
}

function connectToEntry(name,updatePlot){
    const input = document.getElementById(`${name}`)
    const slider = document.getElementById(`${name}Slider`)
    input.addEventListener('change', () => {
        slider.value = input.value
        updatePlot()
    })
    slider.addEventListener('input', () => {
        input.value = slider.value
        updatePlot()
    })

    return input
}

home()