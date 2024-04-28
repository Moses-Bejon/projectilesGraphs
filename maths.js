export function toRadians(angle) {
    return angle * Math.PI / 180
}

export function toDegrees(angle) {
    return angle * 180 / Math.PI
}

export function quadraticFormulaNegative(a, b, c) {
    return (-b - Math.sqrt(b ** 2 - 4 * a * c)) / (2 * a)
}

export function quadraticFormulaPositive(a, b, c) {
    return (-b + Math.sqrt(b ** 2 - 4 * a * c)) / (2 * a)
}

export function cubicFormula(a,b,c,d){
    const p = b**2-3*a*c
    const q = 2*b**3-9*a*b*c+27*a**2*d
    const r = ((q+(q**2-4*p**3)**0.5)/2)**(1/3)
    const k = "not done yet"
}

export function horizontalComponent(u, angle) {
    return u * Math.cos(angle)
}

export function verticalComponent(u, angle) {
    return u * Math.sin(angle)
}

export function formatValue(value, precision = 2) {
    if (value < 1e-10 && value > -1e-10) {
        return "0"
    }
    if (Math.log10(value) >= 2 || Math.log10(value) <= -2) {
        const exponent = Math.floor(Math.log10(value))
        const coefficient = value / Math.pow(10, exponent)
        return String(coefficient.toPrecision(precision)) + "×10^" + String(exponent)
    } else {
        return String(value.toPrecision(precision))
    }
}
