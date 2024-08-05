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

export function sigmoid(z){
    return 1/(1+Math.exp(-z*0.1))
}

export function multiplyMatrices(matrix1,matrix2){
    const product = []

    for (let i = 0; i<matrix1.length;i++){
        product.push([])
        for (let j = 0; j<matrix2[0].length;j++){
            let total = 0
            for (let k = 0; k <matrix2.length;k++){
                total += matrix1[i][k]*matrix2[k][j]
            }
            product[i].push(total)
        }
    }

    return product
}

export function multiplyMatrixWithVector(matrix,vector){
    const product = []
    const length = vector.length

    for (let i = 0; i<length;i++){
        let sum = 0
        for (let j = 0; j<length;j++){
            sum += matrix[i][j]*vector[j]
        }
        product.push(sum)
    }

    return product
}

// This function is 3 times faster than the above function.
// As this is a speed-critical scenario it's worth cluttering the codebase for.
export function multiply3x3MatrixWithVector(matrix,vector){
    return [
        matrix[0][0]*vector[0]+matrix[0][1]*vector[1]+matrix[0][2]*vector[2],
        matrix[1][0]*vector[0]+matrix[1][1]*vector[1]+matrix[1][2]*vector[2],
        matrix[2][0]*vector[0]+matrix[2][1]*vector[1]+matrix[2][2]*vector[2]
    ]
}

export function findInverseOf3x3Matrix(matrix){
    const a = matrix[0][0]
    const b = matrix[0][1]
    const c = matrix[0][2]
    const d = matrix[1][0]
    const e = matrix[1][1]
    const f = matrix[1][2]
    const g = matrix[2][0]
    const h = matrix[2][1]
    const i = matrix[2][2]

    const A = e*i-f*h
    const B = f*g-d*i
    const C = d*h-e*g
    const D = c*h-b*i
    const E = a*i-c*g
    const F = b*g-a*h
    const G = b*f-c*e
    const H = c*d-a*f
    const I = a*e-b*d

    const determinant = a*A + b*B + c*C

    return [
        [A/determinant,D/determinant,G/determinant],
        [B/determinant,E/determinant,H/determinant],
        [C/determinant,F/determinant,I/determinant]
    ]
}

export function findInverseOfUnitary3x3Matrix(matrix){
    return [
        [matrix[0][0],matrix[1][0],matrix[2][0]],
        [matrix[0][1],matrix[1][1],matrix[2][1]],
        [matrix[0][2],matrix[1][2],matrix[2][2]]
    ]
}

export function formatExponentWithSuperText(exponent){
    return "<sup>" + String(exponent) + "</sup>"
}
export function formatExponentWithoutSuperText(exponent){
    return "^"+String(exponent)
}

export function formatValue(value, precision = 2,formatExponent = formatExponentWithSuperText) {
    if (value < 1e-10 && value > -1e-10) {
        return "0"
    }

    const loggedValue = Math.log10(Math.abs(value))

    if (loggedValue > 2 || loggedValue < -2) {
        const exponent = Math.floor(loggedValue)
        const coefficient = value / Math.pow(10, exponent)
        return String(coefficient.toPrecision(precision)) + "×10" + formatExponent(exponent)
    } else {
        return String(value.toPrecision(precision))
    }
}


