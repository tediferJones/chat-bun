import inputConstraints from '../modules/inputConstraints'

export default function NewInput({
  inputName,
  className,
}: {
  inputName: string,
  className?: string,
}) {
  console.log(inputConstraints[inputName])
  return <label className={className} htmlFor={inputName}>
    {inputName[0].toUpperCase() + inputName.slice(1) + ':'}
    <input id={inputName} 
      name={inputName} 
      type='text' 
      onInput={(e) => {
        e.currentTarget.setCustomValidity('')
      }}
      required 
      {...inputConstraints[inputName]}
    />
      {/*
      onInvalid={(e) => {
        console.log('FAILED VALIDATION')
      }}
      */}
  </label>
}
