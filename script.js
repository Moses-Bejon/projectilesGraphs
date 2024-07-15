import {
    formatValue,
    toRadians,
    toDegrees,
    horizontalComponent,
    verticalComponent,
    quadraticFormulaPositive,
    quadraticFormulaNegative, cubicFormula
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
    taskHTML,
    xyGraph,
    trGraph,
    inProgress
} from "./dynamicContent.js";

const content = document.getElementById("content")

function loadInto(html, into){
    into.innerHTML = html
}

// used to enter homescreen and contains behaviour of the home screen
function home() {
    loadInto(homeHTML, content)
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
    document.getElementById("task7Button").onclick = function (){
        task(7)
    }
    document.getElementById("task8Button").onclick = function (){
        task(8)
    }
    document.getElementById("task9Button").onclick = function (){
        task(9)
    }
}

function task(number) {
    loadInto(taskHTML, content)
    const inputs = document.getElementById("inputs")

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
            loadInto(xyGraph,document.getElementById("output"))
            const graph = document.getElementById("graph")

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
            loadInto(xyGraph,document.getElementById("output"))
            const graph = document.getElementById("graph")

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
            loadInto(xyGraph,document.getElementById("output"))
            const graph = document.getElementById("graph")

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
            loadInto(xyGraph,document.getElementById("output"))
            const graph = document.getElementById("graph")

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
        case 7: {
            loadInto(trGraph, document.getElementById("output"))
            const graph = document.getElementById("graph")

            const entries = addEntries(["g", "u", "h", "angle"], ["turningPoints"], inputs, updatePlot)
            const gInput = entries.next().value
            const uInput = entries.next().value
            const heightInput = entries.next().value
            const angleInput = entries.next().value

            const turningPointsLabel = entries.next().value


            updatePlot()
            graph.updateAxes()

            function updatePlot() {
                const angle = toRadians(parseFloat(angleInput.value))
                const g = parseFloat(gInput.value)
                const u = parseFloat(uInput.value)
                const height = parseFloat(heightInput.value)

                const vx = horizontalComponent(u, angle)
                const vy = verticalComponent(u, angle)

                const lastT = 1.2 * (vy + Math.sqrt(vy ** 2 + 2 * g * height)) / g
                const Tstep = lastT / resolution
                const points = []

                for (let i = 0; i <= resolution; i++) {
                    const T = Tstep * i
                    points.push([T, Math.sqrt((vx * T) ** 2 + (height + vy * T - 0.5 * g * T ** 2) ** 2)])
                }

                const Tturning = cubicFormula(g ** 2, -3 * g * vy, 2 * (vx ** 2 + vy ** 2 - g * height), 2 * vy * height)
                const turningPoints = []
                let turningPointsInfo = ""

                Tturning.forEach((complex) => {
                    if (complex.a > 0.0001 && complex.b < 0.0001 && complex.b > -0.0001) {
                        const x = vx * complex.a
                        const y = height + vy * complex.a - 0.5 * g * complex.a ** 2
                        turningPointsInfo += "(" + formatValue(x, 4) + "," + formatValue(y, 4) + ") "
                        turningPoints.push([complex.a, Math.sqrt(x ** 2 + y ** 2)])
                    }
                })

                if (turningPointsInfo === "") {
                    turningPointsLabel.innerText = "no positive real turning points"
                } else {
                    turningPointsLabel.innerText = turningPointsInfo
                }

                graph.clearLinePlotData()
                graph.plotLine(points, "black")

                graph.clearPointPlotData()
                turningPoints.forEach((turningPoint) => {
                    graph.plotPoint(turningPoint, "Turning point")
                })

            }

            setbuttons()
            break
        }


        case 8: {
            loadInto(xyGraph, document.getElementById("output"))

            const graph = document.getElementById("graph")

            const entries = addEntries(["g", "u", "h", "angle","N","C","timeStep"],[], inputs, updatePlot)
            const gInput = entries.next().value
            const uInput = entries.next().value
            const heightInput = entries.next().value
            const angleInput = entries.next().value
            const NInput = entries.next().value
            const CInput = entries.next().value
            const timeStepInput = entries.next().value

            const playButton = document.createElement("button")
            playButton.id = "playButton"
            playButton.className = "navigationButton"
            playButton.innerText = "Play animation"

            const saveButton = document.createElement("button")
            saveButton.id = "saveButton"
            saveButton.className = "navigationButton"
            saveButton.innerText = "Save animation as mp4"

            updatePlot()
            graph.updateAxes()

            function moveProjectileThroughTimePeriod(g,position,vx,vy,C,bounces,N,time){

                let [x,y] = position

                const nexty = y + vy*time - 0.5*g*time**2

                if (nexty<0){
                    bounces += 1
                    if (bounces > N){
                        return false
                    }

                    const t = (vy+Math.sqrt(vy**2+2*g*y))/g

                    x+=vx*t
                    y=0
                    vy = -1*C*(vy-g*t)

                    return moveProjectileThroughTimePeriod(g,[x,y],vx,vy,C,bounces,N,time-t)
                }

                x += vx*time
                vy -= g*time

                return [[x,nexty],vy,bounces]

            }

            function updatePlot() {
                graph.cancelAnimation()

                const angle = toRadians(parseFloat(angleInput.value))
                const g = parseFloat(gInput.value)
                const u = parseFloat(uInput.value)
                const height = parseFloat(heightInput.value)
                const N = parseInt(NInput.value)
                const C = parseFloat(CInput.value)
                const timeStep = parseFloat(timeStepInput.value)

                let position = [0,height]
                const vx = horizontalComponent(u, angle)
                let vy = verticalComponent(u, angle)

                const points = [position]

                let bounces = 0

                while (true){
                    const movement = moveProjectileThroughTimePeriod(g,position,vx,vy,C,bounces,N,timeStep)

                    if (!movement){
                        break
                    }
                    [position,vy,bounces] = movement
                    points.push(position)

                }

                graph.clearLinePlotData()
                graph.plotLine(points, "black")

                playButton.onclick = () => {graph.animateFirstLine(timeStep)}
                saveButton.onclick = () => {
                    saveButton.innerText = "Saving animation..."
                    graph.saveFirstLine(timeStep,30).then(()=>{
                        saveButton.innerText = "Save animation as mp4"
                    })
                }

            }

            const buttonContainer = document.getElementById("fitButtonContainer")

            buttonContainer.appendChild(playButton)
            buttonContainer.appendChild(saveButton)

            setbuttons()
            break

        }

        case 9:{

            loadInto(xyGraph,document.getElementById("output"))
            const graph = document.getElementById("graph")

            const entries = addEntries(["angle", "g", "u", "h","m","Cd","rho","A","timeStep"],["drag","noDrag"], inputs, updatePlot)

            const angleInput = entries.next().value
            const gInput = entries.next().value
            const uInput = entries.next().value
            const heightInput = entries.next().value
            const massInput = entries.next().value
            const cdInput = entries.next().value
            const rhoInput = entries.next().value
            const aInput = entries.next().value
            const timeStepInput = entries.next().value

            const observationsLabel = entries.next().value
            console.log(observationsLabel)

            updatePlot()
            graph.updateAxes()

            function updatePlot() {
                const angle = toRadians(parseFloat(angleInput.value))
                const g = parseFloat(gInput.value)
                const u = parseFloat(uInput.value)
                const height = parseFloat(heightInput.value)
                const mass = parseFloat(massInput.value)
                const cd = parseFloat(cdInput.value)
                const rho = parseFloat(rhoInput.value)
                const a = parseFloat(aInput.value)
                const timeStep = parseFloat(timeStepInput.value)

                const noDragTrajectory = getTrajectory(g, u, angle, height)

                let vx = horizontalComponent(u, angle)
                let vy = verticalComponent(u, angle)
                let x = 0
                let y = height

                const k = cd*rho*a/(2*mass)

                const dragTrajectory = [[x,y]]

                while (y >= 0) {

                    const v = Math.sqrt(vx**2+vy**2)
                    const ax = -k*v*vx
                    const ay = -k*v*vy-g

                    x += vx*timeStep+0.5*ax*timeStep**2
                    y += vy*timeStep+0.5*ay*timeStep**2

                    vx += ax*timeStep
                    vy += ay*timeStep

                    dragTrajectory.push([x,y])
                }

                if (dragTrajectory.length <= 20){
                    observationsLabel.innerText = "The time step is too high for drag results to be meaningful (You can manually set it by clicking the number if the slider is limiting)"
                } else{
                    observationsLabel.innerText = ""
                }

                graph.clearLinePlotData()
                graph.plotLine(noDragTrajectory.points, "blue")
                graph.plotLine(dragTrajectory,"red")
            }

            setbuttons()
            break
        }

    }
}

function* addEntries(entries,legends,into,updatePlot){
    entries.forEach((entry)=>{
        const presets = entryPresets[entry]

        switch (presets.type){
            case "Integer":
                addEntry(presets.name,presets.label,into,presets.value,presets.min,presets.max,1)
                break
            case "Float":
                addEntry(presets.name,presets.label,into,presets.value,presets.min,presets.max,0.001)
                break
        }
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

function addEntry(name, label, into, value=5, min=1, max=100, step = 0.001) {
    const html = `<div class="entry">
    <label class="inputLabel" for="${name}">${label}</label>
    <input id="${name}" class="numberInput" type="number" name="${name}" min="${min}" max="${max}" value="${value}">
    <input id="${name}Slider" class="slider" type="range" name="${name}" min="${min}" max="${max}" value="${value}" step="${step}">
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
