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

class complex{
    constructor(a,b) {
        this.a=a
        this.b=b
    }

    static sqrt(real){
        if (real >= 0){
            return new complex(real**0.5,0)
        } else{
            return new complex(0,(-1*real)**0.5)
        }
    }

    transform(transformationTheta,transformationR){
        const r = transformationR((this.a**2+this.b**2)**0.5)
        const theta = transformationTheta(Math.atan2(this.b,this.a))
        return new complex(r*Math.cos(theta),r*Math.sin(theta))
    }
    addToComplex(complexInput){
        return new complex(complexInput.a+this.a,complexInput.b+this.b)
    }
    addToReal(real){
        return new complex(this.a+real,this.b)
    }
    multiplyWithReal(real){
        return new complex(this.a*real,real*this.b)
    }
    realDividedByComplex(real){
        const d = (-1*this.b*real)/(this.a**2+this.b**2)
        const c = (real+this.b*d)/this.a
        return new complex(c,d)
    }

}

export function cubicFormula(a,b,c,d){
    const p = b**2-3*a*c
    const q = 2*b**3-9*a*b*c+27*a**2*d

    const r0 = complex.sqrt(q ** 2 - 4 * p ** 3).addToReal(q).multiplyWithReal(0.5).transform(
            (x) => {return x/3},(x) =>{return Math.cbrt(x)})
    const r1 = r0.transform((x)=>{return x+2*Math.PI/3},(x)=>{return x})
    const r2 = r0.transform((x)=>{return x-2*Math.PI/3},(x)=>{return x})

    const cubeRoots = [r0,r1,r2]
    const roots = []

    cubeRoots.forEach((cubeRoot) => {
        roots.push(cubeRoot.addToReal(b).addToComplex(cubeRoot.realDividedByComplex(p)).multiplyWithReal(-1/(3*a)))
    })

    return roots
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

    const loggedValue = Math.log10(Math.abs(value))

    if (loggedValue >= 2 || loggedValue <= -2) {
        const exponent = Math.floor(loggedValue)
        const coefficient = value / Math.pow(10, exponent)
        return String(coefficient.toPrecision(precision)) + "×10^" + String(exponent)
    } else {
        return String(value.toPrecision(precision))
    }
}
