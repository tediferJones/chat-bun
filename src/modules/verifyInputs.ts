import inputConstraints from "./inputConstraints";

export default function verifyInputs(inputs: { [key: string]: string }): { isValid: boolean, errors: { [key: string]: string } } {
  // This is really only good for length checks, 
  // If you want more in-depth checking, convert each field to a function
  // const validators: { [key: string]: { min: number, max: number } } = {
  //   username: { min: 4, max: 32 },
  //   password: { min: 4, max: 32 },
  //   servername: { min: 4, max: 32 },
  // }

  // let result: { isValid: boolean, errors: string[] } = {
  let result: { isValid: boolean, errors: { [key: string]: string } } = {
    isValid: true,
    // errors: [],
    errors: {},
  };

  Object.keys(inputs).forEach((input: string) => {
    // console.log(input)
    // const constraints = validators[input]
    const constraints = inputConstraints[input];
    const value = inputs[input];
    if (!(constraints.minLength <= value.length && value.length <= constraints.maxLength)) {
      result.isValid = false;
      // result.errors.push(`${input} must be between ${constraints.minLength} and ${constraints.maxLength} characters long`);
      result.errors[input] = `${input} must be between ${constraints.minLength} and ${constraints.maxLength} characters long`;
    }
  })

  return result;
}
