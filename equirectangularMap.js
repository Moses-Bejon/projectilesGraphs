const G = 6.6743e-11

export class equirectangularMap{
    constructor(mapSource,planetRadius,planetMass,angularSpeed,consideringRotation) {
        this.twoPI = Math.PI*2
        this.halfPI = Math.PI/2

        this.setMass(planetMass)
        this.radius = planetRadius
        this.angularSpeed = angularSpeed
        this.currentRotation = 0
        this.consideringRotation = consideringRotation
        this.landed = false

        // canvas is for creating an image data object
        this.canvas = document.createElement("canvas")
        this.context = this.canvas.getContext("2d")

        this.image = new Image()
        this.image.src = mapSource

        return new Promise((resolve,reject) => {
            this.image.onload = () => {
                this.height = this.canvas.height = this.image.height
                this.width = this.canvas.width =  this.image.width
                this.context.drawImage(this.image,0,0)
                this.imageData = this.context.getImageData(0,0,this.width,this.height).data
                resolve(this)
            }

            this.image.onerror = (error) => {
                reject(error)
            }
        })
    }

    setMass(mass){
        this.mass = mass
        this.GtimesMass = G*this.mass
    }

    considerEarthRotation(){
        this.consideringRotation = true
    }

    stopConsideringEarthRotation(){
        this.consideringRotation = false
        this.currentRotation = 0
    }

    getPixel(x,y,z){
        const latitude = Math.atan2(z,(x**2+y**2)**0.5)
        const longitude = Math.atan2(y,x)

        // leftshifting the binary value by 0 bits is a hack to truncate the value quickly
        const column = (this.width*((longitude+Math.PI-this.currentRotation)%this.twoPI)/(this.twoPI)) << 0
        const row = (this.height*(-latitude+this.halfPI)/Math.PI) << 0

        const beginAt = 4*(row*this.width+column)

        // this is faster than array.slice
        return [
            this.imageData[beginAt],
            this.imageData[beginAt+1],
            this.imageData[beginAt+2]
        ]
    }

    setCurrentTime(time){
        this.airTime = time
        if (this.consideringRotation){
            this.currentRotation = this.angularSpeed*time
        }
    }

    getTrajectory(latitude,longitude,angle,circularAngle,u,h,timeStep,maxTime){
        this.timeStep = timeStep

        // We will assume we didn't land, this will be changed if we did
        this.landed = false
        this.setCurrentTime(maxTime)

        const r = this.radius+h

        const relevantLength = r*Math.cos(latitude)
        const relevantSpeed = u*Math.cos(angle)

        let position = [relevantLength*Math.cos(longitude),relevantLength*Math.sin(longitude),r*Math.sin(latitude)]
        let velocity = [relevantSpeed*Math.cos(circularAngle),relevantSpeed*Math.sin(circularAngle),u*Math.sin(angle)]

        // rotate the velocity vector so it is facing the correct direction after its position has been rotated
        const cosLatitude = Math.cos(this.halfPI-latitude)
        const sinLatitude = Math.sin(this.halfPI-latitude)

        velocity = [
            velocity[0]*cosLatitude+velocity[2]*sinLatitude,
            velocity[1],
            -velocity[0]*sinLatitude+velocity[2]*cosLatitude
        ]

        const cosLongitude = Math.cos(longitude)
        const sinLongitude = Math.sin(longitude)

        velocity = [
            velocity[0]*cosLongitude-velocity[1]*sinLongitude,
            velocity[0]*sinLongitude+velocity[1]*cosLongitude,
            velocity[2]
        ]

        const trajectory = [position]

        let totalTime
        for (totalTime = 0;totalTime<maxTime;totalTime += timeStep){
            const halfOftimeStepSquared = 0.5*timeStep**2

            const gFactor = -this.GtimesMass/(position[0]**2+position[1]**2+position[2]**2)**1.5
            const acceleration = [gFactor*position[0],gFactor*position[1],gFactor*position[2]]

            position = [
                position[0]+velocity[0]*timeStep+acceleration[0]*halfOftimeStepSquared,
                position[1]+velocity[1]*timeStep+acceleration[1]*halfOftimeStepSquared,
                position[2]+velocity[2]*timeStep+acceleration[2]*halfOftimeStepSquared
            ]

            velocity = [
                velocity[0]+acceleration[0]*timeStep,
                velocity[1]+acceleration[1]*timeStep,
                velocity[2]+acceleration[2]*timeStep
            ]

            trajectory.push(position)

            if (position[0]**2+position[1]**2+position[2]**2<this.radius**2){

                this.airTime = totalTime

                if (this.consideringRotation) {
                    this.setCurrentTime(totalTime)
                }

                let longitude = (Math.atan2(position[1],position[0])-this.currentRotation)%this.twoPI

                if (longitude > Math.PI){
                    longitude = longitude - this.twoPI
                } else if (longitude < -Math.PI){
                    longitude = longitude + this.twoPI
                }

                this.landed = {
                    latitude:Math.atan2(position[2],(position[0]**2+position[1]**2)**0.5),
                    longitude: longitude
                }
                break
            }
        }

        return trajectory
    }

    getCameraPixelPositions(distanceFromOrigin,focalLength,sensorSize,resolution){
        const pixels = []

        const screenx = distanceFromOrigin-focalLength
        const oneMinusResolution = 1-resolution
        const twoTimesResolution = 2*resolution

        for (let i = resolution-1; i >= 0;i--){

            const row = []

            for (let j = 0; j < resolution;j++){

                const pixelPosition = [
                    screenx,sensorSize*(2*j+oneMinusResolution)/twoTimesResolution,sensorSize*(2*i+oneMinusResolution)/twoTimesResolution
                ]

                const a = (pixelPosition[0]-distanceFromOrigin)**2+pixelPosition[1]**2+pixelPosition[2]**2
                const b = -distanceFromOrigin*(pixelPosition[0]-distanceFromOrigin)
                const c = distanceFromOrigin**2-this.radius**2

                const discriminant = b**2-a*c

                if (discriminant<0){
                    row.push(false)
                    continue
                }

                const t = (b-discriminant**0.5)/a

                const x = (pixelPosition[0]-distanceFromOrigin)*t+distanceFromOrigin
                const y = pixelPosition[1]*t
                const z = pixelPosition[2]*t

                row.push([x,y,z])
            }

            pixels.push(row)
        }

        return pixels

    }

    projectPoint(point,distanceFromOrigin,focalLength,sensorSize,resolution){

        // if the point is behind the camera it is not visible
        if (point[0]>distanceFromOrigin-focalLength){
            return false
        }

        // if the point is behind the planet it is not visible
        const a = (point[0]-distanceFromOrigin)**2+point[1]**2+point[2]**2
        const b = -distanceFromOrigin*(point[0]-distanceFromOrigin)

        if ((b-(b**2-a*(distanceFromOrigin**2-this.radius**2))**0.5)/a < 1){
            return false
        }

        const distanceFromCamera = distanceFromOrigin-point[0]

        const projectedx = focalLength*point[1]/distanceFromCamera
        const projectedy = focalLength*point[2]/distanceFromCamera

        const actualx = resolution*(projectedx/sensorSize+0.5)
        const actualy = resolution*(-projectedy/sensorSize+0.5)

        return [actualx,actualy]
    }
}
