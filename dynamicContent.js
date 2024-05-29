export const entryPresets= {
    angle:{name:"angle",label:"Launch angle (º): ",value:"45",min:"1",max:"89"},
    timeStep:{name:"timeStep",label:"Time step (s): ",value:"0.01",min:"0.001",max:"2"},
    g:{name:"g",label:"Strength of gravity (ms<sup>-2</sup>): ",value:"9.8",min:"1",max:"100"},
    u:{name:"u",label:"Launch speed (ms<sup>-1</sup>): ",value:"20",min:"1",max:"100"},
    h:{name:"h",label:"Height (m): ",value:"5",min:"0",max:"100"},
    X:{name:"X",label:"Target X (m): ",value:"5",min:"1",max:"100"},
    Y:{name:"Y",label:"Target Y (m): ",value:"10",min:"1",max:"100"}
}

export const legendPresets = {
    highBall:{label:"High ball trajectory: ",infoBefores:["Angle: ","Trajectory length: "],infos:["highBallAngle","highBallLength"],infoAfters:["",""],colour:"blue"},
    lowBall:{label:"Low ball trajectory: ",infoBefores:["Angle: ","Trajectory Length: "],infos:["lowBallAngle","lowBallLength"],infoAfters:["",""],colour:"green"},
    minU:{label:"Minimum launch speed trajectory: ",infoBefores:["Angle: ","Initial velocity: ","Trajectory Length: "],infos:["minUAngle","minU","minULength"],infoAfters:["º","ms<sup>-1</sup>","m"],colour:"black"},
    maxX:{label:"Maximum distance coverable: ",infoBefores:["Angle: ","Distance covered: ","Trajectory Length: "],infos:["maxXAngle","maxX","maxXLength"],infoAfters:["º","m","m"],colour:"red"},
    inputX:{label:"Input trajectory: ",infoBefores:["Distance covered: ","Trajectory length: "],infos:["inputX","inputLength"],infoAfters:["m","m"],colour:"black"}
}

export const homeHTML = `
<button id="task1Button" class="navigationButton">Task 1</button>
<button id="task2Button" class="navigationButton">Task 2</button>
<button id="task3Button" class="navigationButton">Task 3</button>
<button id="task4Button" class="navigationButton">Task 4</button>
<button id="task7Button" class="navigationButton">Task 7</button>
`
export const taskHTML = `
<div id="taskContentGrid">
    <div id="output"></div>
    <div id="table">
        <div id="inputs"></div>
        <div>
            <div id="fitButtonContainer">
                <button id="fitButton" class="navigationButton">Fit axes to graph</button>
                <button id="homeButton" class="navigationButton">Home</button>
            </div>
        </div>
    </div>
</div>
`

export const oneGraphOutput = `
<graph-component id="graph"></graph-component>
`

export const twoGGraphOutput = `
<graph-component id="graph1"></graph-component>
<graph-component id="graph2"></graph-component>
`

export const inProgress = `
This feature/page is currently under construction
`


export const task7HTML = `

`
