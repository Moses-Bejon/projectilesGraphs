import {
    formatValue,
} from "./maths.js";

export default class plot {
    constructor(canvas, yaxis, xaxis, initialTop, initialRight) {
        this.canvas = canvas
        this.yaxis = yaxis
        this.xaxis = xaxis

        this.linePlots = []
        this.pointPlots = []

        this.top = initialTop
        this.right = initialRight

    }

    plotLine(points, colour) {
        this.linePlots.push({points: points, colour: colour})
        this.drawLine(points, colour)
    }

    drawLine(points, colour) {
        let path = "<path id=\"linePlot\" style='stroke:" + colour + "' d=\"M " + String(points[0][0] / this.right) + " " + String(1 - points[0][1] / this.top)
        for (let i = 1; i < points.length; i++) {
            path += " L " + String(points[i][0] / this.right) + " " + String(1 - points[i][1] / this.top)
        }
        path += "\">"

        this.canvas.innerHTML += path

    }

    plotPoint(point, label) {
        this.pointPlots.push({point: point, label: label})
        this.drawPoint(point, label)
    }

    drawPoint(point, label) {
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

    updateAxes() {
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

            this.canvas.innerHTML += "<line class='gridLine' x1='0' y1='" + String(1 - y / this.top) + "' x2='1' y2='" + String(1 - y / this.top) + "'>"
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
            this.canvas.innerHTML += "<line class='gridLine' x1='" + String(x / this.right) + "' y1='0' x2='" + String(x / this.right) + "' y2='1'>"

            x += xStep
            counter++
        }

        this.xaxis.innerHTML = axisValues

        this.linePlots.forEach((data) => {
            this.drawLine(data["points"], data["colour"])
        })
        this.pointPlots.forEach((data) => {
            this.drawPoint(data["point"], data["label"])
        })
    }

    clearLinePlots() {
        const lines = this.canvas.querySelectorAll("path")
        lines.forEach((line) => {
            line.remove()
        })
    }

    clearPointPlots() {
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