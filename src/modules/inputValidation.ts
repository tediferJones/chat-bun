export const inputConstraints: { [key: string]: { minLength: number, maxLength: number } } = {
  username: { minLength: 4, maxLength: 32 },
  password: { minLength: 4, maxLength: 32 },
  servername: { minLength: 4, maxLength: 32 },
}

export function verifyInputs(inputs: { [key: string]: string }): { isValid: boolean, errors: { [key: string]: string } } {
  let result: { isValid: boolean, errors: { [key: string]: string } } = {
    isValid: true,
    errors: {},
  }

  const verifyFunctions: { [key: string]: { verify: Function, error: Function } } = {
    minLength: {
      verify: (value: string, constraint: number) => value.length >= constraint,
      error: (constraint: number) => `Must be at least ${constraint} characters`,
    },
    maxLength: {
      verify: (value: string, constraint: number) => value.length <= constraint,
      error: (constraint: number) => `Must be at most ${constraint} characters`,
    },
  }

  // inputs contains all things that need validated
  Object.keys(inputs).forEach((input: string) => {
    const constraints: { [key: string]: number }  = inputConstraints[input];
    const value: string = inputs[input];
    Object.keys(constraints).forEach((constraint: string) => {
      if (!verifyFunctions[constraint].verify(value, constraints[constraint])) {
        result.isValid = false;
        result.errors[input] = verifyFunctions[constraint].error(constraints[constraint])
      }
    });
  });

  return result;
}

export function viewErrors(form: HTMLFormElement, errors: { [key: string]: string }) {
  if (Object.keys(errors).length) {
    Object.keys(errors).forEach((input: string) => {
      form[input].setCustomValidity(errors[input])
    });
    form.reportValidity();
  }
}
