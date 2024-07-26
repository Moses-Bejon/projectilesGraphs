import {
    formatValue,
    formatExponentWithoutSuperText,
    toRadians,
    toDegrees,
    horizontalComponent,
    verticalComponent,
    quadraticFormulaPositive,
    quadraticFormulaNegative,
    cubicFormula,
    sigmoid
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
    vectorHTML,
    inProgress, boxHTML
} from "./dynamicContent.js";

const content = document.getElementById("content")

const bounceSounds = [
    new Audio("./assets/bounces/01-bounces.mp3"),
    new Audio("./assets/bounces/02-bounces.mp3"),
    new Audio("./assets/bounces/03-bounces.mp3"),
    new Audio("./assets/bounces/04-bounces.mp3")
]

function playBounceSoundEffect(amplitude=1){
    const bounceSound = bounceSounds[Math.floor(Math.random()*bounceSounds.length)]
    bounceSound.volume = amplitude
    bounceSound.play()
}

let currentPage = 0

// used to cancel animations
let currentAnimationFrame
function goToPage(page,saveHistory=true){
    cancelAnimationFrame(currentAnimationFrame)

    page = page%11
    if (page > 0){
        task(page)
    } else {
        home()
    }

    if (saveHistory){
        history.pushState(page,"")
    }
}

onpopstate = (event) => {
    goToPage(event.state,false)
}

document.getElementById("nextButton").onclick = () => {
    if (currentPage === 4){
        goToPage(7)
    } else {
        goToPage(currentPage + 1)
    }
}
document.getElementById("previousButton").onclick = () => {
    if (currentPage === 7){
        goToPage(4)
    } else {
        goToPage(currentPage - 1)
    }
}

// used to enter homescreen and contains behaviour of the home screen
function home() {
    currentPage = 0

    loadInto(homeHTML, content)
    document.getElementById("task1Button").onclick = function () {
        goToPage(1)
    }
    document.getElementById("task2Button").onclick = function () {
        goToPage(2)
    }
    document.getElementById("task3Button").onclick = function () {
        goToPage(3)
    }
    document.getElementById("task4Button").onclick = function () {
        goToPage(4)
    }
    document.getElementById("task7Button").onclick = function (){
        goToPage(7)
    }
    document.getElementById("task8Button").onclick = function (){
        goToPage(8)
    }
    document.getElementById("task9Button").onclick = function (){
        goToPage(9)
    }
    document.getElementById("task10Button").onclick = function () {
        goToPage(10)
    }
}

function task(number) {
    currentPage = number

    loadInto(taskHTML, content)
    const inputs = document.getElementById("inputs")
    const output = document.getElementById("output")

    function setbuttons() {
        const fitButton = document.getElementById("fitButton")
        fitButton.onclick = () => {
            graph.updateAxes()
        }

        const homeButton = document.getElementById("homeButton")
        homeButton.onclick = () => {goToPage(0)}
    }
    switch (number) {
        case 1: {
            loadInto(xyGraph,output)
            const graph = document.getElementById("graph")

            const entries = addEntries(
                ["angle", "g", "u", "h", "timeStep"],[], inputs, updatePlot
            )

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
            loadInto(xyGraph,output)
            const graph = document.getElementById("graph")

            const entries = addEntries(
                ["angle", "g", "u", "h"],[], inputs, updatePlot
            )

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
            loadInto(xyGraph,output)
            const graph = document.getElementById("graph")

            const entries = addEntries(
                ["g", "u", "X", "Y"],["minU","highBall","lowBall","maxX"], inputs, updatePlot
            )

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

                const angleLow = Math.atan(quadraticFormulaNegative(
                    g * X ** 2, -2 * u ** 2 * X, 2 * u ** 2 * Y + g * X ** 2
                ))
                const angleHigh = Math.atan(quadraticFormulaPositive(
                    g * X ** 2, -2 * u ** 2 * X, 2 * u ** 2 * Y + g * X ** 2
                ))

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
            loadInto(xyGraph,output)
            const graph = document.getElementById("graph")

            const entries = addEntries(
                ["angle", "g", "u", "h"],["inputX","maxX"], inputs, updatePlot
            )
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
            loadInto(trGraph, output)
            const graph = document.getElementById("graph")

            const entries = addEntries(
                ["g", "u", "h", "angle"], ["turningPoints"], inputs, updatePlot
            )
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

                const Tturning = cubicFormula(
                    g ** 2, -3 * g * vy, 2 * (vx ** 2 + vy ** 2 - g * height), 2 * vy * height
                )
                const turningPoints = []
                let turningPointsInfo = ""

                Tturning.forEach((complex) => {
                    if (complex.a > 0.0001 && complex.b < 0.0001 && complex.b > -0.0001) {
                        const x = vx * complex.a
                        const y = height + vy * complex.a - 0.5 * g * complex.a ** 2
                        const r = Math.sqrt(x ** 2 + y ** 2)
                        turningPointsInfo += "(" + formatValue(complex.a, 4) + "," + formatValue(r, 4) + ") "
                        turningPoints.push([complex.a, r])
                    }
                })

                if (turningPointsInfo === "") {
                    turningPointsLabel.innerText = "no positive real turning points"
                } else {
                    turningPointsLabel.innerHTML = turningPointsInfo
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
            loadInto(xyGraph, output)

            const graph = document.getElementById("graph")

            const entries = addEntries(
                ["g", "u", "h", "angle","N","C","timeStep","fps","resolution"],[], inputs, updatePlot
            )
            const gInput = entries.next().value
            const uInput = entries.next().value
            const heightInput = entries.next().value
            const angleInput = entries.next().value
            const NInput = entries.next().value
            const CInput = entries.next().value
            const timeStepInput = entries.next().value
            const fpsInput = entries.next().value
            const resolutionInput = entries.next().value

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
                graph.cancelRender()

                const angle = toRadians(parseFloat(angleInput.value))
                const g = parseFloat(gInput.value)
                const u = parseFloat(uInput.value)
                const height = parseFloat(heightInput.value)
                const N = parseInt(NInput.value)
                const C = parseFloat(CInput.value)
                const timeStep = parseFloat(timeStepInput.value)
                const fps = parseFloat(fpsInput.value)
                const resolution = parseInt(resolutionInput.value)

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

                    // There is no reason why a user would want to restart the rendering process without first changing
                    // one of the parameters. Therefore, this button is deactivated
                    deactivateButton(saveButton)
                    deactivateButton(playButton)

                    saveButton.innerText = "Saving animation"
                    const loadingAnimation = new loadAnimation(saveButton)
                    graph.saveFirstLine(timeStep,fps,resolution).then(()=>{
                        loadingAnimation.finishLoad()
                        activateButton(saveButton)
                        activateButton(playButton)
                        saveButton.innerText = "Save animation as mp4"
                        updatePlot()
                    })
                }

            }

            const buttonContainer = document.getElementById("fitButtonContainer")

            buttonContainer.appendChild(playButton)

            if (typeof VideoEncoder !== "undefined") {
                buttonContainer.appendChild(saveButton)
            } else{
                window.alert("Video encoders are not supported by your browser. You cannot save this animation as an mp4.")
            }

            setbuttons()
            break

        }

        case 9:{

            loadInto(xyGraph,output)
            const graph = document.getElementById("graph")

            const entries = addEntries(
                ["angle", "g", "u", "h","m","Cd","rho","A","timeStep"],["drag","noDrag"], inputs, updatePlot
            )

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

        case 10:{
            const inconsequentialVelocity = 0.0001

            loadInto(boxHTML,output)

            const entries = addEntries(
                ["dimensions","r","l","C","Cd","rho","A","m"],[],inputs,updatePlot
            )

            inputs.innerHTML += vectorHTML

            const positionLabel = document.getElementById("position")
            const velocityLabel = document.getElementById("velocity")
            const gLabel = document.getElementById("g")

            const box = document.getElementById("box")

            const dimensionsInput = entries.next().value
            const rInput = entries.next().value
            const lInput = entries.next().value
            const CInput = entries.next().value
            const CdInput = entries.next().value
            const rhoInput = entries.next().value
            const AInput = entries.next().value
            const mInput = entries.next().value

            let audioActive = false
            const audioButton = document.createElement("button")
            audioButton.id = "audioButton"
            audioButton.className = "navigationButton"
            audioButton.innerText = "Unmute audio"
            audioButton.onclick = () => {
                if (audioActive){
                    audioActive = false
                    audioButton.innerText = "Unmute audio"
                } else {
                    audioActive = true
                    audioButton.innerText = "Mute audio"
                }
            }

            let position = []
            let positionInputs = []
            let velocity = []
            let velocityInputs = []
            let g = []
            let gInputs = []

            let dimensions
            let r
            let l
            let C
            let Cd
            let rho
            let A
            let m

            let k

            // Used to get delta time later on, done here to time the upcoming commands
            // for sensible estimation of initial delta time
            let previousTime = performance.now()

            // used to store the current method of displaying our svg
            let getSVGContent

            updatePlot()

            function getOneDimensionalSVGContent(){
                return `
                <rect width = ${2*r/l} height = 1 x = ${(position[0]-r)/l} y = 0></rect>
                `
            }

            function getTwoDimensionalSVGContent(){
                return `
                <circle cx = ${position[0]/l} cy = ${position[1]/l} r=${r/l}></circle>
                `
            }

            function getThreeDimensionalSVGContent(){
                const focalLength = 1+r/l
                const distance = 1

                const scalingDueToDistance = focalLength/(distance+position[2]/l)

                const backRectSide = focalLength/(distance+1)
                const backRectCorner = 0.5-backRectSide/2
                return `
                    <rect width = ${backRectSide} height = ${backRectSide} x = ${backRectCorner} y = ${backRectCorner} fill="none" stroke-width="0.001" stroke="black"></rect>
                    <line x1="0" y1="0" x2="${backRectCorner}" y2="${backRectCorner}" stroke="black" stroke-width="0.001"></line>
                    <line x1="1" y1="0" x2="${1-backRectCorner}" y2="${backRectCorner}" stroke="black" stroke-width="0.001"></line>
                    <line x1="0" y1="1" x2="${backRectCorner}" y2="${1-backRectCorner}" stroke="black" stroke-width="0.001"></line>
                    <line x1="1" y1="1" x2="${1-backRectCorner}" y2="${1-backRectCorner}" stroke="black" stroke-width="0.001"></line>
                    <circle cx = ${0.5+scalingDueToDistance*(position[0]/l-0.5)} cy = ${0.5+scalingDueToDistance*(position[1]/l-0.5)} r = ${scalingDueToDistance*r/l}></circle>
                `
            }

            function getFourDimensionalSVGContent(){
                return `
                <rect width = 1 height = 1 x = 0 y = 0 fill = "rgb(${255*position[3]/l},255,255)"></rect>
                `+getThreeDimensionalSVGContent()
            }

            function getFiveDimensionalSVGContent(){
                return `
                <rect width = 1 height = 1 x = 0 y = 0 fill = "rgb(${255*position[3]/l},${255*position[4]/l},255)"></rect>
                `+getThreeDimensionalSVGContent()
            }

            function getSixDimensionalSVGContent(){
                return `
                <rect width = 1 height = 1 x = 0 y = 0 fill = "rgb(${255*position[3]/l},${255*position[4]/l},${255*position[5]/l})"></rect>
                `+getThreeDimensionalSVGContent()
            }

            function updateAnimation(){
                const currentTime = performance.now()
                const deltaTime = currentTime - previousTime
                previousTime = currentTime

                moveProjectileThroughTimePeriod(deltaTime/1000)

                for (let i = 0;i<dimensions;i++){
                    positionInputs[i].value = formatValue(position[i],4,formatExponentWithoutSuperText)
                    velocityInputs[i].value = formatValue(velocity[i],4,formatExponentWithoutSuperText)
                    gInputs[i].value = formatValue(g[i],4,formatExponentWithoutSuperText)
                }

                box.innerHTML = getSVGContent()
                currentAnimationFrame = requestAnimationFrame(updateAnimation)
            }

            function updatePlot(){
                cancelAnimationFrame(currentAnimationFrame)

                dimensions = parseInt(dimensionsInput.value)
                r = parseFloat(rInput.value)
                l = parseFloat(lInput.value)
                C = parseFloat(CInput.value)
                Cd = parseFloat(CdInput.value)
                rho = parseFloat(rhoInput.value)
                A = parseFloat(AInput.value)
                m = parseFloat(mInput.value)

                k = Cd*rho*A/(2*m)

                if (position.length > dimensions){

                    for (let i = dimensions;i<position.length;i++){
                        positionInputs[i].remove()
                        velocityInputs[i].remove()
                        gInputs[i].remove()
                    }

                    position = position.slice(0,dimensions)
                    positionInputs = positionInputs.slice(0,dimensions)
                    velocity = velocity.slice(0,dimensions)
                    velocityInputs = velocityInputs.slice(0,dimensions)
                    g = g.slice(0,dimensions)
                    gInputs = gInputs.slice(0,dimensions)

                } else if (position.length < dimensions){
                    const lengthOfMissingRegion = dimensions-position.length
                    position = position.concat(new Array(lengthOfMissingRegion).fill(l/2))
                    velocity = velocity.concat(new Array(lengthOfMissingRegion).fill(0))
                    g = g.concat(new Array(lengthOfMissingRegion).fill(0))

                    for (let i = 0;i<lengthOfMissingRegion;i++){
                        const index = i+position.length-lengthOfMissingRegion

                        const positionEntry = document.createElement("input")
                        positionEntry.type = "text" // this removes arrows that off centre the number
                        positionEntry.value = String(l/2)
                        positionEntry.className = "vectorEntry"
                        positionEntry.inputMode = "numeric"
                        positionEntry.addEventListener("focusin",()=>{
                            positionInputs[index] = document.createElement("input")
                        })
                        positionEntry.addEventListener("focusout",()=>{
                            positionInputs[index] = positionEntry
                            cancelAnimationFrame(currentAnimationFrame)
                            position[index] = parseFloat(positionEntry.value)
                            updateAnimation()
                        })
                        positionInputs.push(positionEntry)
                        positionLabel.appendChild(positionEntry)

                        const velocityEntry = document.createElement("input")
                        velocityEntry.type = "text"
                        velocityEntry.value = "0"
                        velocityEntry.className = "vectorEntry"
                        velocityEntry.inputMode = "numeric"
                        velocityEntry.addEventListener("focusin",()=>{
                            velocityInputs[index] = document.createElement("input")
                        })
                        velocityEntry.addEventListener("focusout",()=>{
                            velocityInputs[index] = velocityEntry
                            cancelAnimationFrame(currentAnimationFrame)
                            velocity[index] = parseFloat(velocityEntry.value)
                            updateAnimation()
                        })
                        velocityInputs.push(velocityEntry)
                        velocityLabel.appendChild(velocityEntry)

                        const gEntry = document.createElement("input")
                        gEntry.type = "text"
                        gEntry.value = "0"
                        gEntry.className = "vectorEntry"
                        gEntry.inputMode = "numeric"
                        gEntry.addEventListener("focusin",()=>{
                            gInputs[index] = document.createElement("input")
                        })
                        gEntry.addEventListener("focusout",()=>{
                            gInputs[index] = gEntry
                            cancelAnimationFrame(currentAnimationFrame)
                            g[index] = parseFloat(gEntry.value)
                            updateAnimation()
                        })
                        gInputs.push(gEntry)
                        gLabel.appendChild(gEntry)
                    }
                }

                switch (dimensions){
                    case 1:{
                        getSVGContent = getOneDimensionalSVGContent
                        break
                    }
                    case 2:{
                        getSVGContent = getTwoDimensionalSVGContent
                        break
                    }
                    case 3:{
                        getSVGContent = getThreeDimensionalSVGContent
                        break
                    }
                    case 4:{
                        getSVGContent = getFourDimensionalSVGContent
                        break
                    }
                    case 5:{
                        getSVGContent = getFiveDimensionalSVGContent
                        break
                    }
                    case 6:{
                        getSVGContent = getSixDimensionalSVGContent
                        break
                    }
                }

                updateAnimation()

            }

            function moveProjectileThroughTimePeriod(time){
                const acceleration = getAcceleration(time)

                for (let i = 0;i<dimensions;i++){
                    moveAlongDimension(i,time,acceleration[i])
                }
            }

            function moveAlongDimension(dimension,time,acceleration){

                const nextPosition = position[dimension]+(velocity[dimension]+0.5*acceleration*time)*time

                if (nextPosition < r){
                    const t = tfromuas(-velocity[dimension],-acceleration,position[dimension]-r)
                    position[dimension] = r
                    if (velocity[dimension] <= -inconsequentialVelocity){
                        velocity[dimension] = -C * (velocity[dimension] + acceleration*t)
                        if (audioActive){
                            playBounceSoundEffect(sigmoid(Math.abs(velocity[dimension])))
                        }
                        moveAlongDimension(dimension,time-t,acceleration)

                    } else{
                        velocity[dimension] = 0
                    }
                } else if (nextPosition > l-r){
                    const t = tfromuas(velocity[dimension],acceleration,l-position[dimension]-r)
                    position[dimension] = l-r

                    if (velocity[dimension] >= inconsequentialVelocity){
                        velocity[dimension] = -C * (velocity[dimension] + acceleration*t)
                        if (audioActive) {
                            playBounceSoundEffect(sigmoid(Math.abs(velocity[dimension])))
                        }
                        moveAlongDimension(dimension,time-t,acceleration)
                    } else{
                        velocity[dimension] = 0
                    }
                } else{
                    position[dimension] = nextPosition
                    velocity[dimension] += acceleration*time
                }
            }

            function getAcceleration(){

                let speed = 0
                for (let i = 0;i<dimensions;i++){
                    speed += velocity[i]**2
                }
                speed = Math.sqrt(speed)
                const airResistanceMagnitude = -k*speed

                // acceleration is stored for use in finding the velocity after this
                const acceleration = []


                for (let i = 0;i<dimensions;i++) {
                    acceleration.push(airResistanceMagnitude * velocity[i] + g[i])
                }

                return acceleration
            }

            function tfromuas(u,a,s){
                if (a !== 0) {
                    return (-u + Math.sqrt(u ** 2 + 2 * a * s)) / a
                } else{
                    return s/u
                }
            }

            setbuttons()
            document.getElementById("fitButton").remove()
            document.getElementById("fitButtonContainer").appendChild(audioButton)

            break
        }

    }
}

class loadAnimation{
    constructor(element) {
        this.element = element
        this.defaultText = this.element.innerText
        this.load1()
    }

    load1() {
        this.element.innerText = `${this.defaultText}.`
        this.timeoutID = setTimeout(()=>{this.load2()}, 500)
    }

    load2() {
        this.element.innerText = `${this.defaultText}..`
        this.timeoutID = setTimeout(()=>{this.load3()}, 500)
    }

    load3(){
        this.element.innerText = `${this.defaultText}...`
        this.timeoutID = setTimeout(()=>{this.load1()}, 500)
    }

    finishLoad(){
        clearTimeout(this.timeoutID)
        this.defaultText = this.element.innerText
    }

}

function loadInto(html, into){
    into.innerHTML = html
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

    const entry = document.createElement("div")
    entry.className = "entry"
    entry.innerHTML = `
    <label class="inputLabel" for="${name}">${label}</label>
    <input id="${name}" class="numberInput" type="number" name="${name}" min="${min}" max="${max}" value="${value}">
    <input id="${name}Slider" class="slider" type="range" name="${name}" min="${min}" max="${max}" value="${value}" step="${step}">
    `

    into.appendChild(entry)
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

function deactivateButton(button){
    button.className = "inactiveNavigationButton"
}
function activateButton(button){
    button.className = "navigationButton"
    button.onmouseover = null
}

home()
