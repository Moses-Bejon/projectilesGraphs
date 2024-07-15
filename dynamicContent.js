export const entryPresets= {
    angle:{name:"angle",label:"Launch angle (º): ",value:"45",min:"1",max:"89",type:"Float"},
    timeStep:{name:"timeStep",label:"Time step (s): ",value:"0.01",min:"0.001",max:"2",type:"Float"},
    g:{name:"g",label:"Strength of gravity (ms<sup>-2</sup>): ",value:"9.8",min:"1",max:"100",type:"Float"},
    u:{name:"u",label:"Launch speed (ms<sup>-1</sup>): ",value:"20",min:"1",max:"100",type:"Float"},
    h:{name:"h",label:"Height (m): ",value:"5",min:"0",max:"100",type:"Float"},
    X:{name:"X",label:"Target X (m): ",value:"5",min:"1",max:"100",type:"Float"},
    Y:{name:"Y",label:"Target Y (m): ",value:"10",min:"1",max:"100",type:"Float"},
    N:{name:"N",label:"Number of bounces: ",value:"3",min:"0",max:"100",type:"Integer"},
    C:{name:"C",label:"Coefficient of restitution: ",value:"0.6",min:"0",max:"1",type:"Float"},
    Cd:{name:"Cd",label:"Drag coefficient: ",value:"0.47",min:"0.01",max:"1.5",type:"Float"},
    rho:{name:"rho",label:"Air density (Kgm<sup>-3</sup>): ",value:"1",min:"0",max:"100",type:"Float"},
    A:{name:"A",label:"Cross-section (m<sup>2</sup>): ",value:"0.25",min:"0",max:"100",type:"Float"},
    m:{name:"m",label:"Mass (Kg): ",value:"1",min:"0.01",max:"1000",type:"Float"}
}

export const legendPresets = {
    highBall:{label:"High ball trajectory: ",infoBefores:["Angle: ","Trajectory length: "],infos:["highBallAngle","highBallLength"],infoAfters:["",""],colour:"blue"},
    lowBall:{label:"Low ball trajectory: ",infoBefores:["Angle: ","Trajectory Length: "],infos:["lowBallAngle","lowBallLength"],infoAfters:["",""],colour:"green"},
    minU:{label:"Minimum launch speed trajectory: ",infoBefores:["Angle: ","Initial velocity: ","Trajectory Length: "],infos:["minUAngle","minU","minULength"],infoAfters:["º","ms<sup>-1</sup>","m"],colour:"black"},
    maxX:{label:"Maximum distance coverable: ",infoBefores:["Angle: ","Distance covered: ","Trajectory Length: "],infos:["maxXAngle","maxX","maxXLength"],infoAfters:["º","m","m"],colour:"red"},
    inputX:{label:"Input trajectory: ",infoBefores:["Distance covered: ","Trajectory length: "],infos:["inputX","inputLength"],infoAfters:["m","m"],colour:"black"},
    turningPoints:{label:"Distance from (0,0) of projectile over time: ",infoBefores:["Turning points (x (m),y (m)): "],infos:["turningPoints"],infoAfters:[""],colour:"black"},
    drag:{label:"Trajectory with drag: ",infoBefores:[""],infos:["observations"],infoAfters:[""],colour:"red"},
    noDrag:{label:"Trajectory without drag: ",infoBefores:[],infos:[],infoAfters:[],colour:"blue"}
}

export const homeHTML = `
<button id="task1Button" class="navigationButton">Task 1</button>
<button id="task2Button" class="navigationButton">Task 2</button>
<button id="task3Button" class="navigationButton">Task 3</button>
<button id="task4Button" class="navigationButton">Task 4</button>
<button id="task7Button" class="navigationButton">Task 7</button>
<button id="task8Button" class="navigationButton">Task 8</button>
<button id="task9Button" class="navigationButton">Task 9</button>
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

export const xyGraph = `
<graph-component id="graph"></graph-component>
`

export const trGraph = `
<graph-component id="graph" yaxislabel="r (m)" xaxislabel="t (s)" yaxis="r (m)"></graph-component>
`

export const inProgress = `
This feature/page is currently under construction
`
