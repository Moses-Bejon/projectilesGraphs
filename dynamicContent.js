export const entryPresets= {
    angle:{name:"angle",label:"Launch angle (º): ",value:"45",min:"1",max:"89",type:"Float",description:"The angle above horizontal of the launch direction of the projectile."},
    timeStep:{name:"timeStep",label:"Time step (s): ",value:"0.01",min:"0.001",max:"2",type:"Float",description:"The time period between each successive sample of the graph."},
    g:{name:"g",label:"Strength of gravity (ms<sup>-2</sup>): ",value:"9.8",min:"1",max:"100",type:"Float",description:"The acceleration of the projectile downward due to gravity."},
    u:{name:"u",label:"Launch speed (ms<sup>-1</sup>): ",value:"20",min:"1",max:"100",type:"Float",description:"The speed at which the projectile is launched."},
    h:{name:"h",label:"Height (m): ",value:"5",min:"0",max:"100",type:"Float",description:"The height at which the projectile is launched from."},
    X:{name:"X",label:"Target X (m): ",value:"5",min:"1",max:"100",type:"Float",description:"The x position of the point on the graph through which the trajectory moves through."},
    Y:{name:"Y",label:"Target Y (m): ",value:"10",min:"1",max:"100",type:"Float",description:"The y position of the point on the graph through which the trajectory moves through."},
    N:{name:"N",label:"Number of bounces: ",value:"3",min:"0",max:"100",type:"Integer",description:"The number of times the projectile bounces before the simulation ends."},
    C:{name:"C",label:"Coefficient of restitution: ",value:"0.6",min:"0",max:"1",type:"Float",description:"The proportion of velocity that is flipped when the projectile bounces."},
    Cd:{name:"Cd",label:"Drag coefficient: ",value:"0.47",min:"0.01",max:"1.5",type:"Float",description:"A coefficient that captures how complex factors, like shape and material, affect drag. A larger number results in more drag."},
    rho:{name:"rho",label:"Air density (Kgm<sup>-3</sup>): ",value:"1",min:"0",max:"10",type:"Float",description:"The amount of matter contained within a unit volume of air."},
    A:{name:"A",label:"Cross-section (m<sup>2</sup>): ",value:"0.25",min:"0",max:"10",type:"Float",description:"The 2D area of the projectile facing in the direction it is moving."},
    m:{name:"m",label:"Mass (Kg): ",value:"1",min:"0.01",max:"50",type:"Float",description:"The amount of matter that makes up the projectile."},
    fps:{name:"fps",label:"FPS of mp4 (Hz): ",value:"30",min:"0.1",max:"100",type:"Float",description:"The number of individual images that are displayed in one second of the exported mp4 video."},
    resolution:{name:"resolution",label:"Resolution of mp4: ",value:"500",min:"20",max:"900",type:"Integer",description:"The number of pixels on each side of the video (the video is a square so both sides have the same number of pixels)."},
    dimensions:{name:"dimensions",label:"Number of dimensions: ",value:"3",min:"1",max:"6",type:"Integer",description:"The number of axes through which the projectile can move."},
    r:{name:"r",label:"Ball radius (m): ",value:"0.1",min:"0.01",max:"5",type:"Float",description:"The distance from the centre to the surface of the projectile."},
    l:{name:"l",label:"Side length of box (m): ",value:"10",min:"1",max:"100",type:"Float",description:"The length of the side of the box which contains the projectile."}
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
<div class="taskContainer" id="task1Button">
    <img class="taskPreview" src = "assets/taskPreviews/task1Preview.svg" alt="Preview image of task 1">
    <button class="taskButton">Task 1</button>
</div>
<div class="taskContainer" id="task2Button">
    <img class="taskPreview" src = "assets/taskPreviews/task2Preview.svg" alt="Preview image of task 2">
    <button class="taskButton">Task 2</button>
</div>
<div class="taskContainer" id="task3Button">
    <img class="taskPreview" src = "assets/taskPreviews/task3Preview.svg" alt="Preview image of task 3">
    <button class="taskButton">Task 3</button>
</div>
<div class="taskContainer" id="task4Button">
    <img class="taskPreview" src = "assets/taskPreviews/task4Preview.svg" alt="Preview image of task 4">
    <button class="taskButton">Task 4</button>
</div>
<div class="taskContainer" id="task7Button">
    <img class="taskPreview" src = "assets/taskPreviews/task7Preview.svg" alt="Preview image of task 7">
    <button class="taskButton">Task 7</button>
</div>
<div class="taskContainer" id="task8Button">
    <img class="taskPreview" src = "assets/taskPreviews/task8Preview.svg" alt="Preview image of task 8">
    <button class="taskButton">Task 8</button>
</div>
<div class="taskContainer" id="task9Button">
    <img class="taskPreview" src = "assets/taskPreviews/task9Preview.svg" alt="Preview image of task 9">
    <button class="taskButton">Task 9</button>
</div>
<div class="taskContainer" id="task10Button">
    <img class="taskPreview" src = "assets/taskPreviews/task10Preview.svg" alt="Preview image of my N-dimensional projectile extension">
    <button class="taskButton">N-dimensional projectile extension</button>
</div>
`
export const taskHTML = `
<div id="taskContentGrid">
    <div id="output"></div>
    <div id="table">
        <div id="inputs"></div>
        <div id="fitButtonContainer">
            <button id="fitButton" class="navigationButton">Fit axes to graph</button>
            <button id="homeButton" class="navigationButton">Home</button>
            <button id="aboutButton" class="navigationButton">About</button>
        </div>
    </div>
</div>
`

// The superscript with nothing in it is to ensure the position label is aligned with the velocity and gravity labels
export const vectorHTML = `
    <div id="vectorLabels">
        <h2>Position (m<sup></sup>)</h2>
        <h2>Velocity (ms<sup>-1</sup>)</h2>
        <h2>Gravity (ms<sup>-2</sup>)</h2>
    </div>
    <div id="vectors">
        <img class="leftBracket" src="assets/leftBracket.svg" aria-hidden="true" alt="">
        <div id="position" class="vector"></div>
        <img class="rightBracket" src="assets/leftBracket.svg" aria-hidden="true" alt="">
        <img class="leftBracket" src="assets/leftBracket.svg" aria-hidden="true" alt="">
        <div id="velocity" class="vector"></div>
        <img class="rightBracket" src="assets/leftBracket.svg" aria-hidden="true" alt="">
        <img class="leftBracket" src="assets/leftBracket.svg" aria-hidden="true" alt="">
        <div id="g" class="vector"></div>
        <img class="rightBracket" src="assets/leftBracket.svg" aria-hidden="true" alt="">
    </div>
`

export const boxHTML = `
<svg id="box" viewBox="0 0 1 1">    
</svg>
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
