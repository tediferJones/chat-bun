export default function verifyInputs(inputs: { [key: string]: string }) {
  // This is really only good for length checks, 
  // If you want more in-depth checking, convert each field to a function
  const validators: { [key: string]: { min: number, max: number } } = {
    username: { min: 4, max: 32 },
    password: { min: 4, max: 32 },
    servername: { min: 4, max: 32 },
  }

  let result: { isValid: boolean, errors: string[] } = {
    isValid: true,
    errors: [],
  };

  Object.keys(inputs).forEach((input: string) => {
    // console.log(input)
    const constraints = validators[input]
    const value = inputs[input]
    if (!(constraints.min <= value.length && value.length <= constraints.max)) {
      result.isValid = false;
      result.errors.push(`${input} must be between ${constraints.min} and ${constraints.max} characters long`)
    }
  })

  return result
}
