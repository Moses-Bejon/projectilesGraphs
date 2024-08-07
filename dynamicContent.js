export const planets = {
    earth:{source:"./assets/maps/2k_earth.jpg", radius:6371000, mass:5.9722e24, angularSpeed:7.292e-5},
    jupiter:{source:"./assets/maps/2k_jupiter.jpg",radius:69911000,mass:1.898e27,angularSpeed:0.0001757},
    mars:{source:"./assets/maps/2k_mars.jpg",radius:3389500,mass:6.4171e23,angularSpeed:0.0000709},
    mercury:{source:"./assets/maps/2k_mercury.jpg",radius:2439700,mass:3.3011e23,angularSpeed:0.00000124},
    moon:{source:"./assets/maps/2k_moon.jpg",radius:1737400,mass:7.342e22,angularSpeed:0.000002662},
    neptune:{source:"./assets/maps/2k_neptune.jpg",radius:24622000,mass:1.02409e26,angularSpeed:0.0001083},
    sun:{source:"./assets/maps/2k_sun.jpg",radius:6.957e8,mass:1.9885e30,angularSpeed:0.000002903},
    uranus:{source:"./assets/maps/2k_uranus.jpg",radius:25362000,mass:8.681e25,angularSpeed:0.0001012},
    venus:{source:"./assets/maps/2k_venus.jpg",radius:6051800,mass:4.8675e24,angularSpeed:2.99239874e-7},
    custom:{source:"./assets/maps/2k_custom.jpg",radius:6000000, mass:6e24, angularSpeed:7e-5}
}

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
    l:{name:"l",label:"Side length of box (m): ",value:"10",min:"1",max:"100",type:"Float",description:"The length of the side of the box which contains the projectile."},
    largeResolution:{name:"resolution",label:"Resolution: ",value:"1000",min:"20",max:"2000",type:"Integer",description:"The number of pixels on each side of the graphic (the graphic is a square so both sides have the same number of pixels)."},
    d:{name:"d",label:"Distance from planet (km): ",value:"20000",min:"1000",max:"100000",type:"Integer",description:"The distance of the focal point of the camera from the planet that is being viewed."},
    latitude:{name:"latitude",label:"Latitude (º): ",value:"0",min:"-90",max:"90",type:"Float",description:"The angle above (positive) or below (negative) the equator of the planet the projectile is launched from."},
    longitude:{name:"longitude",label:"Longitude (º): ",value:"0",min:"-180",max:"180",type:"Float",description:"The angle to the left (negative) or to the right (positive) of the prime meridian of the planet the projectile is launched from."},
    circularAngle:{name:"circularAngle",label:"Circular angle (º): ",value:"0",min:"0",max:"360",type:"Float",description:"The angle around the horizontal of the launch direction of the projectile."},
    largeU:{name:"u",label:"Launch speed (kms<sup>-1</sup>): ",value:"5",min:"1",max:"50",type:"Float",description:"The speed at which the projectile is launched."},
    largeTimeStep:{name:"timeStep",label:"Time step (s): ",value:"0.5",min:"0.1",max:"100",type:"Float",description:"The time period between each successive sample of the trajectory."},
    maxTime:{name:"maxTime",label:"Maximum time of simulation (s): ",value:"10000",min:"10",max:"100000",type:"Integer",description:"This limit is in place to ensure your computer doesn't crash when you find a trajectory that enters orbit."},
    largeH:{name:"h",label:"Height (km): ",value:"0",min:"0",max:"10000",type:"Integer",description:"The height at which the projectile is launched from."},
    timeSpeed:{name:"timeSpeed",label:"Speed of time in animation: ",value:"500",min:"1",max:"5000",type:"Integer",description:"The factor by which the speed of time is increased in the animation. (100 would mean the animation play 100 times faster than the projectile actually takes)."}
}


export const legendPresets = {
    highBall:{label:"High ball trajectory: ",infoBefores:["Angle: ","Trajectory length: "],infos:["highBallAngle","highBallLength"],infoAfters:["",""],colour:"blue"},
    lowBall:{label:"Low ball trajectory: ",infoBefores:["Angle: ","Trajectory Length: "],infos:["lowBallAngle","lowBallLength"],infoAfters:["",""],colour:"green"},
    minU:{label:"Minimum launch speed trajectory: ",infoBefores:["Angle: ","Initial velocity: ","Trajectory Length: "],infos:["minUAngle","minU","minULength"],infoAfters:["º","ms<sup>-1</sup>","m"],colour:"black"},
    maxX:{label:"Maximum distance coverable: ",infoBefores:["Angle: ","Distance covered: ","Trajectory Length: "],infos:["maxXAngle","maxX","maxXLength"],infoAfters:["º","m","m"],colour:"red"},
    inputX:{label:"Input trajectory: ",infoBefores:["Distance covered: ","Trajectory length: "],infos:["inputX","inputLength"],infoAfters:["m","m"],colour:"black"},
    turningPoints:{label:"Distance from (0,0) of projectile over time: ",infoBefores:["Turning points (x (m),y (m)): "],infos:["turningPoints"],infoAfters:[""],colour:"black"},
    drag:{label:"Trajectory with drag: ",infoBefores:[""],infos:["observations"],infoAfters:[""],colour:"red"},
    noDrag:{label:"Trajectory without drag: ",infoBefores:[],infos:[],infoAfters:[],colour:"blue"},
    earth:{label:"Input trajectory: ",infoBefores:["Landing latitude: ","Landing longitude: "],infos:["landingLatitude","landingLongitude"],infoAfters:["",""],colour:"red"}
}

export const homeHTML = `
<div id="homeContainer">
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
<div class="taskContainer" id="task11Button">
    <img class="taskPreview" src = "assets/taskPreviews/task11Preview.png" alt="Preview image of my projectile launched from earth extension">
    <button class="taskButton">Projectile launched from earth extension</button>
</div>
<div class="taskContainer" id="attributions">
    <img class="taskPreview" src = "assets/taskPreviews/attributionIcon.svg" alt="Preview image of my attribution page">
    <button class="taskButton">Attributions</button>
</div>
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

export const planetDropdown = `
<label for="planets">Celestial body:</label>
<select name="planets" id="planetDropdown">
    <option value="earth">Earth</option>
    <option value="jupiter">Jupiter</option>
    <option value="mars">Mars</option>
    <option value="mercury">Mercury</option>
    <option value="moon">Moon</option>
    <option value="neptune">Neptune</option>
    <option value="sun">Sun</option>
    <option value="uranus">Uranus</option>
    <option value="venus">Venus</option>
    <option value="custom">Custom</option>
</select>
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

export const attributionsHTML = `
<h1>Attributions</h1>
<h2>Libraries</h2>
<ol>
    <li><a href="https://github.com/Vanilagy/mp4-muxer">mp4-muxer</a> by Vanilagy - Multiplexes the mp4 video produced in task 8 - Used under the <a href="https://opensource.org/license/mit">MIT License</a></li>
</ol>
<h2>Audio assets</h2>
<ol>
    <li><a href="https://freesound.org/s/125154/">Bounce sound</a> by alienistcog - Source of the audio heard in the N-dimensional projectile extension - Used under the <a href="https://creativecommons.org/publicdomain/zero/1.0/">CC0 1.0 universal deed</a></li>
</ol>
<h2>Graphical assets</h2>
<ol>
    <li><a href="https://www.solarsystemscope.com/textures/">Planet textures</a> by INOVE - Used to texture the planets seen in the projectile launched from earth extension - Used under the <a href="https://creativecommons.org/licenses/by/4.0/">Attribution 4.0 international deed</a></li>
    <li><a href="https://thenounproject.com/icon/projectile-4311335/">Projectile icon</a> by Adrien Coquet - Used as webpage favicon and is in the webpage banner - Used under the <a href="https://creativecommons.org/licenses/by/3.0/deed.en">Attribution 3.0 unported deed</a></li>
    <li><a href="https://thenounproject.com/icon/left-bracket-342654/">Left bracket</a> by Icon Island - Used to form the vector notation seen in the N-dimensional projectile extension - Used under the <a href="https://creativecommons.org/licenses/by/3.0/deed.en">Attribution 3.0 unported deed</a></li>
    <li><a href="https://thenounproject.com/icon/attribution-6854685/">Attribution icon</a> by Iconic Creations - Used as a preview for the attributions page on the home page - Used under the <a href="https://creativecommons.org/licenses/by/3.0/deed.en">Attribution 3.0 unported deed</a></li>
</ol>
<h2>Data</h2>
<ol>
    <li><a href="https://simplemaps.com/data/world-cities">City data</a> by simplemaps - Provided the geographic coordinates for notable locations on earth in the projectile launched from earth extension - Used under the <a href="https://creativecommons.org/licenses/by/4.0/">Attribution 4.0 international deed</a></li>
</ol>
<center><button id="homeButton" class="navigationButton">Home</button></center>
`

export const notableLocations = {
    "earth": {"Abidjan, C\u00f4te d\u2019Ivoire": {"latitude": "5.3167", "longitude": "-4.0333"}, "Ahmedabad, India": {"latitude": "23.0225", "longitude": "72.5714"}, "Alexandria, Egypt": {"latitude": "31.1975", "longitude": "29.8925"}, "Ankara, Turkey": {"latitude": "39.9300", "longitude": "32.8500"}, "Atlanta, United States": {"latitude": "33.7628", "longitude": "-84.4220"}, "Baghdad, Iraq": {"latitude": "33.3153", "longitude": "44.3661"}, "Bangalore, India": {"latitude": "12.9789", "longitude": "77.5917"}, "Bangkok, Thailand": {"latitude": "13.7525", "longitude": "100.4942"}, "Baoding, China": {"latitude": "38.8740", "longitude": "115.4640"}, "Barcelona, Spain": {"latitude": "41.3828", "longitude": "2.1769"}, "Beijing, China": {"latitude": "39.9067", "longitude": "116.3975"}, "Belo Horizonte, Brazil": {"latitude": "-19.9167", "longitude": "-43.9333"}, "Berlin, Germany": {"latitude": "52.5200", "longitude": "13.4050"}, "Bijie, China": {"latitude": "27.2840", "longitude": "105.2920"}, "Bogot\u00e1, Colombia": {"latitude": "4.7111", "longitude": "-74.0722"}, "Bozhou, China": {"latitude": "33.8626", "longitude": "115.7742"}, "Buenos Aires, Argentina": {"latitude": "-34.6033", "longitude": "-58.3817"}, "Cairo, Egypt": {"latitude": "30.0444", "longitude": "31.2358"}, "Cangzhou, China": {"latitude": "38.3047", "longitude": "116.8387"}, "Cape Town, South Africa": {"latitude": "-33.9253", "longitude": "18.4239"}, "Changde, China": {"latitude": "29.0310", "longitude": "111.6990"}, "Chattogram, Bangladesh": {"latitude": "22.3350", "longitude": "91.8325"}, "Chengdu, China": {"latitude": "30.6600", "longitude": "104.0633"}, "Chennai, India": {"latitude": "13.0825", "longitude": "80.2750"}, "Chicago, United States": {"latitude": "41.8375", "longitude": "-87.6866"}, "Chongqing, China": {"latitude": "29.5637", "longitude": "106.5504"}, "Dalian, China": {"latitude": "38.9000", "longitude": "121.6000"}, "Dallas, United States": {"latitude": "32.7935", "longitude": "-96.7667"}, "Dar es Salaam, Tanzania": {"latitude": "-6.8161", "longitude": "39.2803"}, "Dazhou, China": {"latitude": "31.2093", "longitude": "107.4678"}, "Delhi, India": {"latitude": "28.6100", "longitude": "77.2300"}, "Dezhou, China": {"latitude": "37.4360", "longitude": "116.3590"}, "Dhaka, Bangladesh": {"latitude": "23.7639", "longitude": "90.3889"}, "Dongguan, China": {"latitude": "23.0210", "longitude": "113.7520"}, "Douala, Cameroon": {"latitude": "4.0500", "longitude": "9.7000"}, "Foshan, China": {"latitude": "23.0214", "longitude": "113.1216"}, "Fuyang, China": {"latitude": "32.8900", "longitude": "115.8140"}, "Ganzhou, China": {"latitude": "25.8310", "longitude": "114.9330"}, "Giza, Egypt": {"latitude": "29.9870", "longitude": "31.2118"}, "Guadalajara, Mexico": {"latitude": "20.6767", "longitude": "-103.3475"}, "Guangzhou, China": {"latitude": "23.1300", "longitude": "113.2600"}, "Guilin, China": {"latitude": "25.2750", "longitude": "110.2960"}, "Hangzhou, China": {"latitude": "30.2670", "longitude": "120.1530"}, "Hanoi, Vietnam": {"latitude": "21.0000", "longitude": "105.8500"}, "Hengyang, China": {"latitude": "26.8940", "longitude": "112.5720"}, "Heze, China": {"latitude": "35.2343", "longitude": "115.4796"}, "Ho Chi Minh City, Vietnam": {"latitude": "10.7756", "longitude": "106.7019"}, "Hong Kong, Hong Kong": {"latitude": "22.3000", "longitude": "114.2000"}, "Houston, United States": {"latitude": "29.7860", "longitude": "-95.3885"}, "Huanggang, China": {"latitude": "30.4537", "longitude": "114.8724"}, "Huanglongsi, China": {"latitude": "34.7950", "longitude": "114.3450"}, "Hyder\u0101b\u0101d, India": {"latitude": "17.3617", "longitude": "78.4747"}, "Istanbul, Turkey": {"latitude": "41.0136", "longitude": "28.9550"}, "Jakarta, Indonesia": {"latitude": "-6.1750", "longitude": "106.8275"}, "Ji\u2019an, China": {"latitude": "27.0912", "longitude": "114.9668"}, "Jieyang, China": {"latitude": "23.5510", "longitude": "116.3727"}, "Jinan, China": {"latitude": "36.6702", "longitude": "117.0207"}, "Jining, China": {"latitude": "35.4151", "longitude": "116.5871"}, "Johannesburg, South Africa": {"latitude": "-26.2044", "longitude": "28.0456"}, "Karachi, Pakistan": {"latitude": "24.8600", "longitude": "67.0100"}, "Khartoum, Sudan": {"latitude": "15.6000", "longitude": "32.5000"}, "Kinshasa, Congo (Kinshasa)": {"latitude": "-4.3219", "longitude": "15.3119"}, "Kolk\u0101ta, India": {"latitude": "22.5675", "longitude": "88.3700"}, "Kuala Lumpur, Malaysia": {"latitude": "3.1478", "longitude": "101.6953"}, "Lagos, Nigeria": {"latitude": "6.4550", "longitude": "3.3841"}, "Lahore, Pakistan": {"latitude": "31.5497", "longitude": "74.3436"}, "Langfang, China": {"latitude": "39.5383", "longitude": "116.6835"}, "Liaocheng, China": {"latitude": "36.4559", "longitude": "115.9852"}, "Lima, Peru": {"latitude": "-12.0600", "longitude": "-77.0375"}, "Linyi, China": {"latitude": "35.1038", "longitude": "118.3564"}, "London, United Kingdom": {"latitude": "51.5072", "longitude": "-0.1275"}, "Los Angeles, United States": {"latitude": "34.1141", "longitude": "-118.4068"}, "Luanda, Angola": {"latitude": "-8.8383", "longitude": "13.2344"}, "Madrid, Spain": {"latitude": "40.4169", "longitude": "-3.7033"}, "Manila, Philippines": {"latitude": "14.5958", "longitude": "120.9772"}, "Maoming, China": {"latitude": "21.6627", "longitude": "110.9255"}, "Melbourne, Australia": {"latitude": "-37.8142", "longitude": "144.9631"}, "Mexico City, Mexico": {"latitude": "19.4333", "longitude": "-99.1333"}, "Miami, United States": {"latitude": "25.7840", "longitude": "-80.2101"}, "Mianyang, China": {"latitude": "31.4680", "longitude": "104.6790"}, "Monterrey, Mexico": {"latitude": "25.6667", "longitude": "-100.3000"}, "Moscow, Russia": {"latitude": "55.7558", "longitude": "37.6172"}, "Mumbai, India": {"latitude": "19.0761", "longitude": "72.8775"}, "Nagoya, Japan": {"latitude": "35.1833", "longitude": "136.9000"}, "Nairobi, Kenya": {"latitude": "-1.2864", "longitude": "36.8172"}, "Nanchong, China": {"latitude": "30.8372", "longitude": "106.1106"}, "Nangandao, China": {"latitude": "35.3036", "longitude": "113.9268"}, "Nanjing, China": {"latitude": "32.0608", "longitude": "118.7789"}, "Nanyang, China": {"latitude": "32.9987", "longitude": "112.5292"}, "New York, United States": {"latitude": "40.6943", "longitude": "-73.9249"}, "\u014csaka, Japan": {"latitude": "34.6939", "longitude": "135.5022"}, "Paris, France": {"latitude": "48.8567", "longitude": "2.3522"}, "Philadelphia, United States": {"latitude": "40.0077", "longitude": "-75.1339"}, "Pingdingshan, China": {"latitude": "33.7350", "longitude": "113.2999"}, "Pudong, China": {"latitude": "31.2347", "longitude": "121.5064"}, "Pune, India": {"latitude": "18.5203", "longitude": "73.8567"}, "Qingdao, China": {"latitude": "36.0669", "longitude": "120.3827"}, "Quanzhou, China": {"latitude": "24.8744", "longitude": "118.6757"}, "Qujing, China": {"latitude": "25.4910", "longitude": "103.7960"}, "Rangoon, Burma": {"latitude": "16.7950", "longitude": "96.1600"}, "Rio de Janeiro, Brazil": {"latitude": "-22.9111", "longitude": "-43.2056"}, "Riyadh, Saudi Arabia": {"latitude": "24.6333", "longitude": "46.7167"}, "Saint Petersburg, Russia": {"latitude": "59.9375", "longitude": "30.3086"}, "Santiago, Chile": {"latitude": "-33.4372", "longitude": "-70.6506"}, "S\u00e3o Paulo, Brazil": {"latitude": "-23.5500", "longitude": "-46.6333"}, "Seoul, \"Korea": {"latitude": "37.5600", "longitude": "126.9900"}, "Shanghai, China": {"latitude": "31.2286", "longitude": "121.4747"}, "Shangqiu, China": {"latitude": "34.4150", "longitude": "115.6560"}, "Shangrao, China": {"latitude": "28.4551", "longitude": "117.9431"}, "Shaoyang, China": {"latitude": "27.2395", "longitude": "111.4679"}, "Shenyang, China": {"latitude": "41.8025", "longitude": "123.4281"}, "Shenzhen, China": {"latitude": "22.5415", "longitude": "114.0596"}, "Singapore, Singapore": {"latitude": "1.3000", "longitude": "103.8000"}, "Suqian, China": {"latitude": "33.9331", "longitude": "118.2831"}, "Surabaya, Indonesia": {"latitude": "-7.2458", "longitude": "112.7378"}, "S\u016brat, India": {"latitude": "21.1702", "longitude": "72.8311"}, "Suzhou, China": {"latitude": "33.6333", "longitude": "116.9683"}, "Sydney, Australia": {"latitude": "-33.8678", "longitude": "151.2100"}, "Tai\u2019an, China": {"latitude": "36.2020", "longitude": "117.0870"}, "Tehran, Iran": {"latitude": "35.6892", "longitude": "51.3889"}, "Tianjin, China": {"latitude": "39.1336", "longitude": "117.2054"}, "Tokyo, Japan": {"latitude": "35.6897", "longitude": "139.6922"}, "Tongshan, China": {"latitude": "34.2040", "longitude": "117.2840"}, "Toronto, Canada": {"latitude": "43.7417", "longitude": "-79.3733"}, "Washington, United States": {"latitude": "38.9047", "longitude": "-77.0163"}, "Wuhan, China": {"latitude": "30.5934", "longitude": "114.3046"}, "Xi\u2019an, China": {"latitude": "34.2611", "longitude": "108.9422"}, "Xiangyang, China": {"latitude": "32.0100", "longitude": "112.1220"}, "Xingtai, China": {"latitude": "37.0717", "longitude": "114.5048"}, "Xinyang, China": {"latitude": "32.1490", "longitude": "114.0910"}, "Yancheng, China": {"latitude": "33.3482", "longitude": "120.1626"}, "Yichun, China": {"latitude": "27.8160", "longitude": "114.4170"}, "Yongzhou, China": {"latitude": "26.4200", "longitude": "111.6130"}, "Yulin, China": {"latitude": "22.6540", "longitude": "110.1810"}, "Yuncheng, China": {"latitude": "35.0267", "longitude": "111.0070"}, "Zhangzhou, China": {"latitude": "24.5130", "longitude": "117.6470"}, "Zhanjiang, China": {"latitude": "21.2701", "longitude": "110.3575"}, "Zhaotong, China": {"latitude": "27.3380", "longitude": "103.7170"}, "Zhengzhou, China": {"latitude": "34.7640", "longitude": "113.6840"}, "Zhoukou, China": {"latitude": "33.6250", "longitude": "114.6418"}, "Zhumadian, China": {"latitude": "33.0140", "longitude": "114.0220"}, "Zunyi, China": {"latitude": "27.7220", "longitude": "107.0310"}},
    "jupiter": {"Great Red Spot": {"latitude": -20, "longitude": -48}},
    "mars": {"Amazonis Planitia": {"latitude": 24.8,"longitude": 196},"Arabia Terra": {"latitude": 21,"longitude": 6},"Argyre Planitia": {"latitude": -49.7,"longitude": 316},"Hellas Planitia": {"latitude": -42.7,"longitude": 70.5},"Olympus Mons": {"latitude": 18.65,"longitude": 226.2},"Planum Australe": {"latitude":-87,"longitude": -49},"Planum Boreum": {"latitude": 88,"longitude": 15},"Syrtis Major Planum": {"latitude": 18.855,"longitude": 77.519}},
    "mercury": {"Apollodorus": {"latitude": 33.7,"longitude": 158.7}},
    "moon": {"Apollo 11 landing site":{"latitude": -0.6875,"longitude": 23.473},"Mare Crisium":{"latitude": 17,"longitude": 59.1},"Mare Imbrium": {"latitude": 32.8,"longitude": -15.6},"Mare Orientale":{"latitude": -19.4,"longitude": -92.8},"Mare Serenitatis": {"latitude": 28,"longitude": 17.5},"Mare Smythii":{"latitude": 1.3,"longitude": 87.5},"Mare Tranquillitatis": {"latitude": 8.5,"longitude": 31.4},"South Pole–Aitken basin": {"latitude": -53,"longitude": -169}},
    "neptune": {"Great Dark Spot": {"latitude": -15.5,"longitude": 17}},
    "sun": {},
    "uranus": {},
    "venus": {"Alpha Regio":{"latitude": -22,"longitude": 5},"Aphrodite Terra":{"latitude":-10,"longitude": 100},"Beta Regio":{"latitude": 25.3,"longitude": 282.8},"Ishtar Terra": {"latitude": 70.4,"longitude": 27.5},"Maat Mons":{"latitude": 0.5,"longitude": 194.6},"Maxwell Montes": {"latitude": 65.2,"longitude": 3.3},"Ovda Regio": {"latitude": 12.5,"longitude": 80}},
    "custom": {}
}
