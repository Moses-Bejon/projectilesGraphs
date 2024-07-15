import {
    formatValue,
} from "./maths.js";

import { Muxer, ArrayBufferTarget } from './mp4-muxer.mjs';

const serializer = new XMLSerializer()
const DOMURL = self.URL || self.webkitURL || self;
const frame = new Image()

const template = document.createElement("template")
template.innerHTML=`
<style>
#graphContainer{
    display: grid;
    grid-template-columns: 30px 20fr;
    grid-template-rows: 20fr 30px;
}
#canvas{
    grid-column: 2;
    grid-row: 1;
    aspect-ratio: 1/1;
    border: 1px solid black;
}
#yaxisContainer{
    grid-column: 1;
    grid-row: 1;

    /* used to position numbers on scale */
    position: relative;
}
#xaxisContainer{
    grid-column: 2;
    grid-row: 2;

    /* used to position numbers on scale */
    position: relative;
}
.yaxisValue,.xaxisValue{
    position: absolute;
    font-size: 6px;
    width: 100%;
    padding: 0;
    margin: 0;
}
.yaxisValue{
    text-align: right;
}
.xaxisValue{
    vertical-align: top;
}
.axisLabel{
    font-size: x-small;
    text-align: right;
    padding: 0;
    margin: 0;
}
.labelLine{
    stroke: black;
    stroke-width: 0.002
}
</style>
<div id="graphContainer">
    <div id="yaxisContainer">
        <p class="axisLabel" id="yaxisLabel"></p>
        <div id="yaxis"></div>
    </div>
    <svg id="canvas" viewBox="0 0 1 1"><rect x="0" y="0" width="1" height="1" style="stroke: #FFFFFF;"></rect></svg>
    <div id="xaxisContainer">
        <div id="xaxis"></div>
        <p class="axisLabel" id="xaxisLabel"></p>
    </div>
</div>
`

export class graph extends HTMLElement {
    static observedAttributes = ["yaxislabel","xaxislabel"]

    constructor() {
        super()
        this.yaxisLabel = "y (m)"
        this.xaxisLabel = "x (m)"
        this.requestedAnimationFrame = null

        this.linePlots = []
        this.pointPlots = []

        this.top = 50
        this.right = 50
    }

    connectedCallback(){
        this.attachShadow({mode:"open"})
        this.shadowRoot.appendChild(template.content.cloneNode(true))

        this.canvas = this.shadowRoot.getElementById("canvas")
        this.yaxis = this.shadowRoot.getElementById("yaxis")
        this.xaxis = this.shadowRoot.getElementById("xaxis")
        this.shadowRoot.getElementById("yaxisLabel").innerText = this.yaxisLabel
        this.shadowRoot.getElementById("xaxisLabel").innerText = this.xaxisLabel
    }

    disconnectedCallback(){
        this.cancelAnimation()
    }

    plotLine(points, colour) {
        this.linePlots.push({points: points, colour: colour})
        this.drawLine(points, colour)
    }

    drawGraph(){
        this.linePlots.forEach((data) => {
            this.drawLine(data["points"], data["colour"])
        })
        this.pointPlots.forEach((data) => {
            this.drawPoint(data["point"], data["label"])
        })
    }

    drawLine(points, colour) {
        let path = `<path style="stroke:${colour};
        stroke-width:0.005;
        fill:none;" 
        d=\"M ${String(points[0][0] / this.right)} ${String(1 - points[0][1] / this.top)}`
        for (let i = 1; i < points.length; i++) {
            path += " L " + String(points[i][0] / this.right) + " " + String(1 - points[i][1] / this.top)
        }
        path += "\">"

        this.canvas.innerHTML += path

    }

    animateFirstLine(timeStep){

        this.cancelAnimation()

        // user enters data in seconds whereas performance.now uses milliseconds
        timeStep = timeStep*1000

        const lineToAnimate = this.linePlots[0]

        // clear graph
        this.clearLinePlots()
        this.clearPointPlots()

        const timeBegan = performance.now()
        const timeLength = (lineToAnimate.points.length-1)*timeStep

        this.updateAnimation(timeBegan,timeLength,timeStep,lineToAnimate)

        this.clearLinePlots()
        this.drawGraph()
    }

    updateAnimation(timeBegan,timeLength,timeStep,lineToAnimate){
        const time = performance.now()-timeBegan

        if (time>=timeLength){
            return
        }

        this.goToTime(time,timeStep,lineToAnimate)

        this.requestedAnimationFrame = requestAnimationFrame(()=>{
            this.updateAnimation(timeBegan,timeLength,timeStep,lineToAnimate)
        })

    }

    goToTime(time,timeStep,line){
        const frame = Math.trunc(time/timeStep)
        const subFrame = (time%timeStep)/timeStep

        const pointsToPlot = line.points.slice(0,frame+1)
        const currentPoint = line.points[frame]
        const nextPoint = line.points[frame+1]
        const subX = currentPoint[0]+subFrame*(nextPoint[0]-currentPoint[0])
        const subY = currentPoint[1]+subFrame*(nextPoint[1]-currentPoint[1])
        pointsToPlot.push([subX,subY])

        this.clearLinePlots()

        if (pointsToPlot.length>0) {
            this.drawLine(pointsToPlot, line.colour)
        }
    }

    cancelAnimation(){
        if (!(this.requestedAnimationFrame == null)) {
            cancelAnimationFrame(this.requestedAnimationFrame)
            this.requestedAnimationFrame = null
        }
    }

    async saveFirstLine(timeStep,fps){
        this.cancelAnimation()
        this.clearLinePlots()
        this.clearPointPlots()

        let muxer = new Muxer({
            target: new ArrayBufferTarget(),
            video: {
                codec: 'avc',
                width: 500,
                height: 500
            },
            fastStart: 'in-memory'
        });

        this.videoEncoder = new VideoEncoder({
            output: (chunk, meta) => muxer.addVideoChunk(chunk, meta),
            error: e => console.error(e)
        });
        this.videoEncoder.configure({
            codec: 'avc1.42001f',
            width: 500,
            height: 500,
            bitrate: 1e6
        });

        const timePerFrame = 1000/fps
        const timePerTimestamp = Math.round(1000000/fps)
        timeStep = timeStep*1000
        const lineToAnimate = this.linePlots[0]
        const numberOfFrames = Math.trunc(lineToAnimate.points.length*timeStep/timePerFrame)

        for (let i = 0; i<numberOfFrames;i++){

            this.goToTime(i*timePerFrame,timeStep,lineToAnimate)

            await this.captureFrame(timePerTimestamp*i,timePerTimestamp)
        }

        await this.videoEncoder.flush();
        muxer.finalize();

        let { buffer } = muxer.target; // Buffer contains final MP4 file

        const videoUrl = URL.createObjectURL(new Blob([buffer], { type: 'video/mp4' }));

        // Create a download link
        const downloadLink = document.createElement('a');
        downloadLink.href = videoUrl;
        downloadLink.download = 'bouncingProjectile.mp4';

        // Trigger the download automatically
        downloadLink.click();

    }

    async captureFrame(timeStamp,duration){

        // fun fact, it's actually faster to recreate the canvas each time from scratch than it is to clone the node
        const canvas = document.createElement("canvas")
        canvas.width = 1000
        canvas.height = 1000
        const ctx = canvas.getContext("2d")

        const svgString = serializer.serializeToString(this.canvas)

        const svgBinary = new Blob([svgString],{type:"image/svg+xml;charset=utf-8"})
        const svgURL = DOMURL.createObjectURL(svgBinary)

        frame.src = svgURL

        return new Promise((resolve) => {
            frame.onload = () => {
                ctx.drawImage(frame,0,0)

                const videoFrame = new VideoFrame(canvas, { timestamp: timeStamp, duration: duration, alpha: "keep"})
                this.videoEncoder.encode(videoFrame)
                videoFrame.close()

                resolve()
            }
        })

    }

    plotPoint(point, label) {
        this.pointPlots.push({point: point, label: label})
        this.drawPoint(point, label)
    }

    drawPoint(point, label){
        const xPoint = point[0] / this.right
        const yPoint = 1 - point[1] / this.top

        if (xPoint < 0 || xPoint > 1 || yPoint < 0 || yPoint > 1) {
            return
        }

        this.canvas.innerHTML += "<circle cx='" + String(xPoint) + "' cy='" + String(yPoint) + "' r='0.01'>"

        let xLabel
        let yLabel
        let textAnchor
        if (xPoint >= 0.5) {
            xLabel = point[0] / this.right - 0.05
            textAnchor = "end"
        } else {
            xLabel = point[0] / this.right + 0.05
            textAnchor = "start"
        }
        if (yPoint <= 0.08) {
            yLabel = 1.05 - point[1] / this.top
        } else {
            yLabel = 0.95 - point[1] / this.top
        }
        this.canvas.innerHTML += "<line class='labelLine' x1='" + String(xPoint) + "' y1='" + String(yPoint) + "' x2='" + String(xLabel) + "' y2='" + String(yLabel) + "'>"

        this.canvas.innerHTML += "<text text-anchor='" + textAnchor + "' font-size='0.03px' class='pointLabel' x='" + String(xLabel) + "' y='" + yLabel + "' >" + label + " (" + formatValue(point[0], 4) + "," + formatValue(point[1], 4) + ")</text>"

    }

    // while the structure of this function means it won't work when javascript modifies the attribute
    // I can't even seem to get the function to fire when javascript does this so, maybe a problem for future me
    attributeChangedCallback(name,oldValue,newValue){
        switch (name){
            case "yaxislabel":
                this.yaxisLabel = newValue
                break
            case "xaxislabel":
                this.xaxisLabel = newValue
                break
        }
    }

    updateAxes() {
        this.cancelAnimation()

        this.clearGridLines()
        this.clearLinePlots()
        this.clearPointPlots()

        this.top = 0
        this.right = 0

        this.pointPlots.forEach((point) => {
            if (point[0] > this.right) {
                this.right = point[0]
            }
            if (point[1] > this.top) {
                this.top = point[1]
            }
        })

        this.linePlots.forEach((line) => {
            line["points"].forEach((point) => {
                if (point[0] > this.right) {
                    this.right = point[0]
                }
                if (point[1] > this.top) {
                    this.top = point[1]
                }
            })
        })

        this.top = this.top * 1.1
        this.right = this.right * 1.1

        const yStep = 10 ** (Math.floor(Math.log10(this.top) - 1))
        let y = yStep

        let plotPeriod
        if (this.top / yStep >= 80) {
            plotPeriod = 8
        } else if (this.top / yStep >= 40) {
            plotPeriod = 4
        } else if (this.top / yStep >= 20) {
            plotPeriod = 2
        } else {
            plotPeriod = 1
        }

        let axisValues = ""

        let counter = 1
        while (y < this.top) {
            if (counter % plotPeriod === 0 && y < this.top - yStep * plotPeriod) {
                axisValues += "<p class='yaxisValue' style='bottom: " + String(100 * y / this.top) + "%'>" + formatValue(y) + "</p>"
            }

            this.canvas.innerHTML += "<line class='gridLine' style='stroke: gray; stroke-width: 0.001;' x1='0' y1='" + String(1 - y / this.top) + "' x2='1' y2='" + String(1 - y / this.top) + "'>"
            y += yStep
            counter++
        }

        this.yaxis.innerHTML = axisValues


        const xStep = 10 ** (Math.floor(Math.log10(this.right) - 1))
        let x = xStep

        if (this.right / xStep >= 80) {
            plotPeriod = 16
        } else if (this.right / xStep >= 40) {
            plotPeriod = 8
        } else if (this.right / xStep >= 20) {
            plotPeriod = 4
        } else if (this.right / xStep >= 10) {
            plotPeriod = 2
        } else {
            plotPeriod = 1
        }

        axisValues = ""

        counter = 1
        while (x < this.right) {
            if (counter % plotPeriod === 0 && x < this.right - xStep * plotPeriod) {
                axisValues += "<p class='xaxisValue' style='left: " + String(100 * x / this.right) + "%'>" + formatValue(x) + "</p>"
            }
            this.canvas.innerHTML += "<line class='gridLine' style='stroke: gray; stroke-width: 0.001;' x1='" + String(x / this.right) + "' y1='0' x2='" + String(x / this.right) + "' y2='1'>"

            x += xStep
            counter++
        }

        this.xaxis.innerHTML = axisValues

        this.drawGraph()
    }

    clearLinePlots() {
        const lines = this.canvas.querySelectorAll("path")
        lines.forEach((line) => {
            line.remove()
        })
    }

    clearPointPlots(){
        const points = this.canvas.querySelectorAll("circle")
        points.forEach((point) => {
            point.remove()
        })
        const labelLines = this.canvas.querySelectorAll(".labelLine")
        labelLines.forEach((line) => {
            line.remove()
        })
        const labels = this.canvas.querySelectorAll(".pointLabel")
        labels.forEach((label) => {
            label.remove()
        })
    }

    clearLinePlotData() {
        this.clearLinePlots()
        this.linePlots = []
    }

    clearPointPlotData() {
        this.clearPointPlots()
        this.pointPlots = []
    }

    clearGridLines() {
        const gridLines = this.canvas.querySelectorAll(".gridLine")
        gridLines.forEach(gridLine => {
            gridLine.remove()
        })
    }
}
window.customElements.define("graph-component",graph)
