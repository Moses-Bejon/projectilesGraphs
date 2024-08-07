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
    sigmoid,
    multiplyMatrices,
    multiply3x3MatrixWithVector,
    findInverseOfUnitary3x3Matrix,
} from "./maths.js"

import {
    getTrajectory,
    getTrajectoryApogee,
    resolution
} from "./trajectory.js"

import {
    equirectangularMap
} from "./equirectangularMap.js"

import {
    planets,
    entryPresets,
    legendPresets,
    homeHTML,
    taskHTML,
    xyGraph,
    trGraph,
    vectorHTML,
    boxHTML,
    planetDropdown,
    notableLocations,
    attributionsHTML
} from "./dynamicContent.js"

const content = document.getElementById("content")

let popupCreated = false
function createPopup(html){

    if (popupCreated){
        return
    }

    popupCreated = true

    const popup = document.createElement("div")
    popup.id = "popup"
    popup.innerHTML = html

    const closingCross = document.createElement("div")
    closingCross.className = "closingCross"
    closingCross.innerText = "╳"
    closingCross.onclick = () => {
        popupCreated = false
        popup.remove()
    }

    popup.appendChild(closingCross)

    document.body.appendChild(popup)
}

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

    page = page%13

    switch (page){
        case 0:{
            home()
            break
        }
        case 12:{
            attributions()
            break
        }
        default:{
            if (page>0) {
                task(page)
            } else {
                attributions()
            }
            break
        }
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
    document.getElementById("task11Button").onclick = function () {
        goToPage(11)
    }
    document.getElementById("attributions").onclick = function (){
        goToPage(12)
    }
}

function attributions(){
    currentPage = 12

    loadInto(attributionsHTML,content)

    document.getElementById("homeButton").onclick = () => {goToPage(0)}
}

function task(number) {
    currentPage = number

    loadInto(taskHTML, content)
    const inputs = document.getElementById("inputs")
    const output = document.getElementById("output")

    function setbuttons(graph,overview,entries) {
        const fitButton = document.getElementById("fitButton")
        fitButton.onclick = () => {
            graph.updateAxes()
        }

        const homeButton = document.getElementById("homeButton")
        homeButton.onclick = () => {goToPage(0)}

        const aboutButton = document.getElementById("aboutButton")
        aboutButton.onclick = () => {
            let html = `
            <h2 class="aboutSubtitle">Overview</h2> 
            <p>${overview}</p>
            <h2 class="aboutSubtitle">Input descriptions</h2>
            <ul>
            `
            entries.forEach((entry) => {
                html += `<li>${entryPresets[entry].label}${entryPresets[entry].description}</li>`
            })
            html += "</ul>"
            createPopup(html)
        }
    }
    switch (number) {
        case 1: {
            loadInto(xyGraph,output)
            const graph = document.getElementById("graph")

            const overview = `
            For task 1 I created a graph of x position against y position of a projectile (neglecting drag) using discrete, fixed, time step intervals. 
            I began by finding the components of the initial velocity using the launch angle. 
            Since there are no forces acting in the horizontal direction, this velocity will remain constant. 
            In the y direction, the projectile is accelerating downward at the rate g.
            As x and y can both be found in terms of time, time in incremented by the time step and x and y are both found and plotted at each time until the projectile collides with the ground.
            `

            const entryArray = ["angle", "g", "u", "h", "timeStep"]
            const entries = addEntries(
                entryArray,[], inputs, updatePlot
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

            setbuttons(graph,overview,entryArray)
            break
        }
        case 2: {
            loadInto(xyGraph,output)
            const graph = document.getElementById("graph")

            const overview = `
            In task 2, using x and y in terms of t, it is possible to find y in terms of x. 
            This analytical solution allows you to plot the graph in constant increments of x, which results in constant "smoothness" across the graph.
            I found the maximum value of x (where y = 0) and then used an x step that was one hundredth of this.
            This means there are 100 points on the graph and they are all equally spaced.
            I used this technique for plotting all the analytical graphs throughout this challenge.
            I was then able to find the apogee (the highest point on the trajectory) by finding the point where the gradient of this graph is equal to zero.
            `

            const entryArray = ["angle", "g", "u", "h"]
            const entries = addEntries(
                entryArray,[], inputs, updatePlot
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

            setbuttons(graph,overview,entryArray)
            break
        }
        case 3: {
            loadInto(xyGraph,output)
            const graph = document.getElementById("graph")

            const overview = `
            For task 3, given some point (X,Y), I had to find trajectories that would pass through this point launched from (0,0) with the inputs specified (initial speed etc.).
            Two such trajectories will exist, one with a greater angle than the other, these are called "high ball" and "low ball" trajectories.
            There is also a trajectory with the minimum initial speed. This is the minimum launch speed trajectory.
            Tasks 5 and 6 were both to update task 3.
            <br>
            <br>
            For task 5 I had to find the bounding parabola of all possible points (X, Y) reachable by the given trajectory and the given launch speed as the launch angle varies.
            This parabola is given in purple.
            <br>
            <br>
            For task 6 I had to find the length along my trajectories (The length of the curved path taken). 
            These are given in the table as distances in metres and found through integration.
            `

            const entryArray = ["g", "u", "X", "Y"]
            const entries = addEntries(
                entryArray,["minU","highBall","lowBall","maxX"], inputs, updatePlot
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

            setbuttons(graph,overview,entryArray)
            break
        }
        case 4: {
            loadInto(xyGraph,output)
            const graph = document.getElementById("graph")

            const overview = `
            Task 4 was to find the horizontal distance travelled. 
            This is the positive value of x when y is equal to zero. 
            It is given in the table.
            I also had to find the maximum distance possible as the launch angle varies, which was found through differentiation.
            This is plotted as a separate trajectory.
            `

            const entryArray = ["angle", "g", "u", "h"]
            const entries = addEntries(
                entryArray,["inputX","maxX"], inputs, updatePlot
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

            setbuttons(graph,overview,entryArray)
            break
        }
        case 7: {
            loadInto(trGraph, output)
            const graph = document.getElementById("graph")

            const overview = `
            Task 7 required me to plot the distance (r) from the origin against time as the projectile moved.
            This was found using the original x/y against time formulae used in task 1, and using these to find the distance of the projectile, at any given time, from the origin.
            (<span class="noWrap">√<span class="underSquareRoot">x² + y²</span></span>)
            I then had to find any turning points, which involved differentiating and solving a cubic equation.
            `

            const entryArray = ["g", "u", "h", "angle"]
            const entries = addEntries(
                entryArray, ["turningPoints"], inputs, updatePlot
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

            setbuttons(graph,overview,entryArray)
            break
        }


        case 8: {
            loadInto(xyGraph, output)

            const graph = document.getElementById("graph")

            const overview = `
            For task 8 I incorporated a bounce using a numerical approach. 
            I used the solutions presented in task 1, but every time y becomes negative, instead of ending the simulation, a bounce is computed.
            During a bounce, the vertical velocity is flipped and multiplied by the coefficient of restitution.
            In accordance with the task, I made it a playable animation, which can be watched via the play button.
            You can also save the animation as an mp4 through the save animation button, and can configure the mp4's resolution and framerate.
            `

            const entryArray = ["g", "u", "h", "angle","N","C","timeStep","fps","resolution"]
            const entries = addEntries(
                entryArray,[], inputs, updatePlot
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

            setbuttons(graph,overview,entryArray)
            break

        }

        case 9:{

            loadInto(xyGraph,output)
            const graph = document.getElementById("graph")

            const overview = `
            For task 9 I used the Verlet method in discrete time steps to take into account air resistance (which is assumed to vary with the square of velocity).
            This (in red) is compared with the old model without air resistance (in blue).
            `

            const entryArray = ["angle", "g", "u", "h","m","Cd","rho","A","timeStep"]
            const entries = addEntries(
                entryArray,["drag","noDrag"], inputs, updatePlot
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

            setbuttons(graph,overview,entryArray)
            break
        }

        case 10:{
            const inconsequentialVelocity = 0.0001

            loadInto(boxHTML,output)

            const overview = `
            For the N-dimensional extension, I noticed that the formula I had used to compute the motion of projectiles in task 9 was entirely in terms of vectors. 
            This meant it was trivial to write algorithms to compute the positions of particles in any number of dimensions.
            However, I decided to also incorporate a bounce so as to keep my projectile in a fixed space.
            I also needed to somehow convey the position of the projectile in a large number of dimensions.
            As the computer screen is two dimensional, graphically displaying up to two dimensions was trivial.
            Displaying the third dimension required some perspective and projection but was still a relatively standard procedure.
            I decided to encode further dimensions in terms of colour. 
            The less red the room, the closer the ball is to you in the fourth dimension. The less green the room, the closer the ball is to you in the fifth dimension, and so on.
            `

            const entryArray = ["dimensions","r","l","C","Cd","rho","A","m"]
            const entries = addEntries(
                entryArray,[],inputs,updatePlot
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

            setbuttons(document.createElement("graph-component"),overview,entryArray)
            document.getElementById("fitButton").remove()
            document.getElementById("fitButtonContainer").appendChild(audioButton)

            break
        }

        case 11:{

            loadInto(planetDropdown,output)
            const planetsDropDown = document.getElementById("planetDropdown")
            planetsDropDown.onchange = () => {
                loadPlanet(planetsDropDown.value)
            }

            let notableLocationOptions = []
            const notableLocationsDropdownLabel = document.createElement("label")
            notableLocationsDropdownLabel.for = "notableLocationsDropdown"
            notableLocationsDropdownLabel.innerText = "Launch from: "
            const notableLocationsDropdown = document.createElement("select")
            notableLocationsDropdown.id = "notableLocationsDropdown"
            const noneOption = document.createElement("option")
            noneOption.innerText = "Given longitude and latitude"
            noneOption.value = ""
            notableLocationsDropdown.appendChild(noneOption)
            output.appendChild(notableLocationsDropdownLabel)
            output.appendChild(notableLocationsDropdown)

            const screen = document.createElement("canvas")
            const context = screen.getContext("2d",{willReadFrequently:true,alpha:false})
            output.appendChild(screen)
            context.fillStyle = "white"
            context.fillRect(0,0,screen.width,screen.height)

            const overview = `
            Provided is a ray casted image of a planet, made using an equirectangular projection of the planet, along with a trajectory of 3D projected points. The image can be rotated by clicking and dragging.
            The model uses Newton's law of universal gravitation numerically to find the path of a trajectory using the inputs.
            You are able to select which celestial body and location you would like to launch from. This can be done by using the dropdowns above the render.
            If you select custom planet, this allows you to set the planet's properties like mass and speed of rotation.
            The buttons allow you to turn on/off planet rotation (as separate from the projectile's velocity) and play the animation of the projectile reaching its destination.
            `

            const entryArray = ["latitude","longitude","angle","circularAngle","largeU", "largeH","largeTimeStep","d","largeResolution","maxTime","timeSpeed"]
            const entries = addEntries(entryArray,["earth"],inputs,updatePlot)

            const latitudeInput = entries.next().value
            const latitudeSlider = document.getElementById("latitudeSlider")
            const longitudeSlider = document.getElementById("longitudeSlider")
            const longitudeInput = entries.next().value
            const angleInput = entries.next().value
            const circularAngleInput = entries.next().value
            const uInput = entries.next().value
            const hInput = entries.next().value
            const timeStepInput = entries.next().value
            const dInput = entries.next().value
            const distanceSlider = document.getElementById("dSlider")
            const resolutionInput = entries.next().value
            const maxTimeInput = entries.next().value
            const timeSpeedInput = entries.next().value
            const landingLatitudeLabel = entries.next().value
            const landingLongitudeLabel = entries.next().value

            let consideringPlanetRotation = false
            const rotateEarthButton = document.createElement("button")
            rotateEarthButton.className = "navigationButton"
            rotateEarthButton.innerText = "Consider planet's rotation"
            rotateEarthButton.onclick = () => {
                if (consideringPlanetRotation){
                    rotateEarthButton.innerText = "Consider planet's rotation"
                    consideringPlanetRotation = false
                    map.stopConsideringEarthRotation()
                    updatePlot()
                } else {
                    rotateEarthButton.innerText = "Stop considering planet's rotation"
                    consideringPlanetRotation = true
                    map.considerEarthRotation()
                    updatePlot()
                }
            }

            const playAnimationButton = document.createElement("button")
            playAnimationButton.className = "navigationButton"
            playAnimationButton.innerText = "Play animation"
            playAnimationButton.onclick = () => {
                cancelAnimationFrame(currentAnimationFrame)
                updatePlot()
                animateTrajectory(structuredClone(unRotatedTrajectory),performance.now(),map.timeStep,map.airTime)
            }

            let resolution
            let d
            let timeSpeed
            let trajectory
            let unRotatedTrajectory
            let map
            let imageData
            let dataArray
            let pixelPositions

            const sensitivity = 0.005
            const focalLength = 0.1
            const sensorSize = 0.1

            let overallRotationMatrix = [
                [1,0,0],
                [0,1,0],
                [0,0,1]
            ]
            let overallTrajectoryRotationMatrix = structuredClone(overallRotationMatrix)

            let customPlanetInputs = []

            loadPlanet("earth")

            function loadPlanet(option){
                const planet = planets[option]

                const mapPromise = new equirectangularMap(
                    planet.source,
                    planet.radius,
                    planet.mass,
                    planet.angularSpeed,
                    consideringPlanetRotation
                )

                mapPromise.then(mapInstance => {
                    map = mapInstance

                    const radiusInKm = map.radius/1000
                    distanceSlider.min = radiusInKm+500
                    distanceSlider.max = 10*radiusInKm
                    const defaultValueOfCameraDistance = Math.round(3*radiusInKm/1000)*1000
                    distanceSlider.value = defaultValueOfCameraDistance
                    dInput.value = defaultValueOfCameraDistance

                    notableLocationOptions.forEach((notableLocationOption) => notableLocationOption.remove())
                    notableLocationOptions = []
                    for (const notableLocation in notableLocations[option]){
                        const notableLocationOption = document.createElement("option")
                        notableLocationOption.value = notableLocationOption.innerText = notableLocation
                        notableLocationsDropdown.appendChild(notableLocationOption)
                        notableLocationOptions.push(notableLocationOption)
                    }
                    notableLocationsDropdown.onchange = () => {
                        if (notableLocationsDropdown.value) {
                            const location = notableLocations[option][notableLocationsDropdown.value]
                            const latitude = parseFloat(location.latitude)
                            const longitude = parseFloat(location.longitude)

                            latitudeSlider.value = latitude
                            latitudeInput.value = latitude
                            longitudeSlider.value = longitude
                            longitudeInput.value = longitude

                            updatePlot()
                        }
                    }

                    if (option === "custom"){
                        customPlanetInputs = []

                        customPlanetInputs.push(
                            addEntry("r","Planet radius (km): ",inputs,6000,1000,50000,1,true)
                        )
                        customPlanetInputs.push(
                            addEntry("m", "Planet mass (Yg): ",inputs,6,0.1,500,0.001,true)
                        )
                        customPlanetInputs.push(
                            addEntry("angularSpeed","Planet angular speed (rad/μs): ",inputs,70,0,10000,1,true)
                        )

                        const radiusInput = connectToEntry("r",updatePlanet)
                        const massInput = connectToEntry("m",updatePlanet)
                        const angularSpeedInput = connectToEntry("angularSpeed",updatePlanet)

                        function updatePlanet(){
                            map.radius = parseInt(radiusInput.value)*1000
                            map.setMass(parseFloat(massInput.value)*1e24)
                            map.angularSpeed = parseInt(angularSpeedInput.value)*1e-6

                            updatePlot()
                        }

                    } else {
                        customPlanetInputs.forEach((customPlanetInput) => customPlanetInput.remove())
                    }

                    updatePlot()
                }).catch(error => {
                    console.log(error)
                })
            }

            function updatePlot(){
                cancelAnimationFrame(currentAnimationFrame)

                resolution = parseInt(resolutionInput.value)
                d = parseInt(dInput.value)*1000
                timeSpeed = parseInt(timeSpeedInput.value)

                const latitude = toRadians(parseFloat(latitudeInput.value))
                const longitude = toRadians(parseFloat(longitudeInput.value))
                const angle = toRadians(parseFloat(angleInput.value))
                const circularAngle = toRadians(parseFloat(circularAngleInput.value))
                const u = parseFloat(uInput.value)*1000
                const h = parseFloat(hInput.value)*1000
                const timeStep = parseFloat(timeStepInput.value)
                const maxTime = parseInt(maxTimeInput.value)

                screen.width = resolution
                screen.height = resolution

                context.fillStyle = "white"
                context.fillRect(0,0,resolution,resolution)

                pixelPositions = map.getCameraPixelPositions(d,focalLength,sensorSize,resolution)

                imageData = context.getImageData(0,0,resolution,resolution)
                dataArray = imageData.data

                unRotatedTrajectory = map.getTrajectory(latitude,longitude,angle,circularAngle,u,h,timeStep,maxTime)
                trajectory = new Array(unRotatedTrajectory.length)

                transformPixelPositionsByMatrix(overallRotationMatrix)
                transformTrajectoryByMatrix(overallTrajectoryRotationMatrix)

                updateGlobePixels()

                drawTrajectory()

                const landed = map.landed
                if (landed){
                    landingLatitudeLabel.innerHTML = toDegrees(landed.latitude).toFixed(2) + "º"
                    landingLongitudeLabel.innerHTML = toDegrees(landed.longitude).toFixed(2) + "º"
                } else {
                    landingLatitudeLabel.innerText = "Didn't land"
                    landingLongitudeLabel.innerText = "Didn't land"
                }
            }

            function updateGlobePixels(){
                for (let i = 0;i<resolution;i++){
                    for (let j = 0;j<resolution;j++){

                        const pixelPosition = pixelPositions[i][j]
                        const beginAt = 4 * (i * resolution + j)

                        if (pixelPosition) {

                            const pixel = map.getPixel(pixelPosition[0],pixelPosition[1],pixelPosition[2])

                            dataArray[beginAt] = pixel[0]
                            dataArray[beginAt + 1] = pixel[1]
                            dataArray[beginAt + 2] = pixel[2]
                        }
                    }
                }

                context.putImageData(imageData,0,0)
            }

            function drawTrajectory(){

                let visible = false

                context.beginPath()

                for (let i = 0; i<unRotatedTrajectory.length;i++){
                    const point = map.projectPoint(trajectory[i],d,focalLength,sensorSize,resolution)

                    if (point) {
                        if (visible) {
                            context.lineTo(point[0], point[1])
                        } else {
                            context.moveTo(point[0], point[1])
                        }
                        visible = true
                    } else {
                        visible = false
                    }
                }

                context.lineWidth = resolution/300
                context.strokeStyle = "red"
                context.stroke()
            }

            // This function has looooooooots of room for optimisation, will do if causes problems
            function animateTrajectory(fullTrajectory,timeBegan,timeStep,timeLength){
                const time = timeSpeed*(performance.now()-timeBegan)/1000

                if (time > timeLength){
                    updatePlot()
                    return
                }

                map.setCurrentTime(time)

                const frame = time/timeStep << 0
                const subFrame = (time%timeStep)/timeStep

                unRotatedTrajectory = fullTrajectory.slice(0,frame+1)

                const currentPoint = fullTrajectory[frame]
                const nextPoint = fullTrajectory[frame+1]

                unRotatedTrajectory.push(
                    [
                        currentPoint[0]+subFrame*(nextPoint[0]-currentPoint[0]),
                        currentPoint[1]+subFrame*(nextPoint[1]-currentPoint[1]),
                        currentPoint[2]+subFrame*(nextPoint[2]-currentPoint[2])
                    ]
                )

                trajectory = new Array(unRotatedTrajectory.length)

                transformTrajectoryByMatrix(overallTrajectoryRotationMatrix)

                console.log(trajectory)

                updateGlobePixels()
                drawTrajectory()

                currentAnimationFrame = requestAnimationFrame(() => animateTrajectory(fullTrajectory,timeBegan,timeStep,timeLength))
            }

            function transformPixelPositionsByMatrix(matrix){
                for (let i = 0;i<resolution;i++) {
                    for (let j = 0; j < resolution; j++) {
                        const pixelPosition = pixelPositions[i][j]

                        if (pixelPosition) {
                            pixelPositions[i][j] = multiply3x3MatrixWithVector(matrix,pixelPosition)
                        }
                    }
                }
            }

            function transformTrajectoryByMatrix(matrix){
                for (let i = 0; i<unRotatedTrajectory.length; i++){
                    trajectory[i] = multiply3x3MatrixWithVector(matrix,unRotatedTrajectory[i])
                }
            }

            output.addEventListener("mousedown", (mouseEvent) => {

                const initialx = mouseEvent.clientX
                const initialy = mouseEvent.clientY

                let rotationMatrix
                let inverseRotationMatrix = [
                    [1,0,0],
                    [0,1,0],
                    [0,0,1]
                ]

                //let timeDoingMatrixStuff = 0
                //let timeDoingPixelStuff = 0
                //let numberOfStuff = 0

                function handleMouseMoveRotation(mouseEvent){
                    const z = initialx-mouseEvent.clientX
                    const y = initialy-mouseEvent.clientY

                    const magnitude = (y**2+z**2)**0.5

                    if (magnitude === 0){
                        return
                    }

                    const u = multiply3x3MatrixWithVector(overallRotationMatrix,[0,y/magnitude,z/magnitude])
                    const ux = u[0]
                    const uy = u[1]
                    const uz = u[2]

                    const angle = magnitude*sensitivity

                    const sine = Math.sin(angle)
                    const cosine = Math.cos(angle)
                    const oneMinusCosine = 1-cosine
                    rotationMatrix = [
                        [ux**2*oneMinusCosine+cosine,ux*uy*oneMinusCosine-uz*sine,ux*uz*oneMinusCosine+uy*sine],
                        [ux*uy*oneMinusCosine+uz*sine,cosine+uy**2*oneMinusCosine,uy*uz*oneMinusCosine-ux*sine],
                        [ux*uz*oneMinusCosine-uy*sine,uz*uy*oneMinusCosine+ux*sine,cosine+uz**2*oneMinusCosine]
                    ]

                    overallTrajectoryRotationMatrix = findInverseOfUnitary3x3Matrix(multiplyMatrices(rotationMatrix,overallRotationMatrix))

                    // const beforeMatrixMultiplication = performance.now()

                    transformPixelPositionsByMatrix(multiplyMatrices(rotationMatrix,inverseRotationMatrix))
                    transformTrajectoryByMatrix(overallTrajectoryRotationMatrix)

                    //timeDoingMatrixStuff += performance.now()-beforeMatrixMultiplication

                    inverseRotationMatrix = findInverseOfUnitary3x3Matrix(rotationMatrix)

                    //const beforePixelStuff = performance.now()

                    updateGlobePixels()

                    drawTrajectory()

                    //timeDoingPixelStuff += performance.now()-beforePixelStuff

                    //numberOfStuff ++
                    //console.log(timeDoingMatrixStuff/numberOfStuff,timeDoingPixelStuff/numberOfStuff)

                }

                function stopRotation(){

                    if (typeof rotationMatrix !== "undefined"){
                        overallRotationMatrix = multiplyMatrices(rotationMatrix,overallRotationMatrix)
                        overallTrajectoryRotationMatrix = findInverseOfUnitary3x3Matrix(overallRotationMatrix)
                    }
                    output.removeEventListener("mousemove",handleMouseMoveRotation)
                    document.removeEventListener("mouseup",stopRotation)
                    document.removeEventListener("visibilitychange",stopRotation)
                }

                output.addEventListener("mousemove",handleMouseMoveRotation)

                document.addEventListener("mouseup",stopRotation)

                document.addEventListener("visibilitychange",stopRotation)
            })

            setbuttons(document.createElement("graph-component"),overview,entryArray)
            const buttonContainer = document.getElementById("fitButtonContainer")
            buttonContainer.appendChild(rotateEarthButton)
            buttonContainer.appendChild(playAnimationButton)
            document.getElementById("fitButton").remove()

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

function addEntry(name, label, into, value=5, min=1, max=100, step = 0.001,insertBefore = false) {

    const entry = document.createElement("div")
    entry.className = "entry"
    entry.innerHTML = `
    <label class="inputLabel" for="${name}">${label}</label>
    <input id="${name}" class="numberInput" type="number" name="${name}" min="${min}" max="${max}" value="${value}">
    <input id="${name}Slider" class="slider" type="range" name="${name}" min="${min}" max="${max}" value="${value}" step="${step}">
    `

    if (insertBefore){
        into.prepend(entry)
    } else {
        into.appendChild(entry)
    }

    return entry
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
