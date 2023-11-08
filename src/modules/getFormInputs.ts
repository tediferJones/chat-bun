import { FormInputs } from 'types';

export default function getFormData(formElement: HTMLFormElement): FormInputs {
  const formData = new FormData(formElement)
  const result: FormInputs = {};
  
  for (let entry of formData.entries()) {
    result[entry[0].toString()] = entry[1].toString();
  }

  return result;
}
