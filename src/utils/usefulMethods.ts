export function isCPFValid(cpf: string) {
    const multiplyNumbers = (arr: number[]) => arr.reduce((acc, number, index) => {
        const multiplier = arr.length + 1;
        return (number * (multiplier - index)) + acc
    }, 0)

    const getRest = (number: number) => (number * 10 % 11) % 10

    const cpfNumbers = onlyNumbers(cpf).split('').map((num) => Number(num))
    const isNumberEqual = cpfNumbers.every((number, _, arr) => number == arr[0])

    if (cpfNumbers.length !== 11 || isNumberEqual) return false

    const verificationNumbers = cpfNumbers.splice(-2, 2)

    const firstDigit = multiplyNumbers(cpfNumbers)
    const secondDigit = multiplyNumbers([...cpfNumbers, verificationNumbers[0]])


    return (
        Number(verificationNumbers[0]) === getRest(firstDigit)
        && Number(verificationNumbers[1]) === getRest(secondDigit)
    )
}

export function onlyNumbers(str: string) {
    return str.replace(/\D/g, "")
}