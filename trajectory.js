import {horizontalComponent, quadraticFormulaNegative, verticalComponent} from "./maths.js";

export const resolution = 100

export function getTrajectory(g, u, angle, height) {
    const vx = horizontalComponent(u, angle)
    const vy = verticalComponent(u, angle)

    const lastX = quadraticFormulaNegative(-g / (2 * vx ** 2), vy / vx, height)
    const xStep = lastX * (1/resolution)

    const points = []
    points.push([0, height])

    for (let i = 1; i <= 100; i++) {
        const x = i * xStep
        points.push([x, height + vy * x / vx - (g * x ** 2) / (2 * vx ** 2)])
    }

    const bound1 = vy/vx-(g/(vx**2))*lastX
    const bound2 = vy/vx
    const bound1Pattern = Math.sqrt(bound1**2+1)
    const bound2Pattern = Math.sqrt(bound2**2+1)
    const adding = 0.5*Math.log(bound1Pattern+bound1)+0.5*bound1*bound1Pattern
    const subtracting = 0.5*Math.log(bound2Pattern+bound2)+0.5*bound2*bound2Pattern
    const trajectoryLength = (-1*vx**2/g)*(adding-subtracting)

    return {points:points,length:trajectoryLength}
}

export function getTrajectoryApogee(g, u, angle, height) {
    const vx = horizontalComponent(u, angle)
    const vy = verticalComponent(u, angle)

    return [vy * vx / g, height + vy ** 2 / (2 * g)]
}
