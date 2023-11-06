// import { inputConstraints } from "../modules/inputValidation"

export default function NewInput({
  inputName,
  className,
  inputClassName,
}: {
  inputName: string,
  className?: string,
  inputClassName?: string,
}) {
  // console.log(inputConstraints[inputName])
  // THIS SHOULD PROBABLY BE CONVERTED TO A DIV CONTAINING A LABEL AND INPUT, this makes styling easier and more controllable
  return <label className={className} htmlFor={inputName}>
    {inputName[0].toUpperCase() + inputName.slice(1) + ':'}
    <input id={inputName} 
      className={inputClassName}
      name={inputName} 
      type='text' 
      onInput={(e) => {
        e.currentTarget.setCustomValidity('')
      }}
      required 
    />
      {/*
      {...inputConstraints[inputName]}
      onInvalid={(e) => {
        console.log('FAILED VALIDATION')
      }}
      */}
  </label>
}
