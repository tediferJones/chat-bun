import { inputConstraints } from 'modules/inputValidation';

export default function NewInput({
  inputName,
  type,
  className,
  inputClassName,
  labelClassName,
  useHTMLValidators,
}: {
  inputName: string,
  type: 'number' | 'text' | 'password',
  className?: string,
  inputClassName?: string,
  labelClassName?: string,
  useHTMLValidators?: true,
}) {
  const builtInValidators = useHTMLValidators ? inputConstraints[inputName] : {}
  return <div className={className}>
    <label className={labelClassName} htmlFor={inputName}>
      {inputName[0].toUpperCase() + inputName.replace(/([A-Z])/g, ' $1').slice(1) + ':'}
    </label>
    <input id={inputName} 
      className={inputClassName}
      name={inputName} 
      type={type} 
      onInput={(e) => {
        e.currentTarget.setCustomValidity('')
      }}
      {...builtInValidators}
    />
  </div>
}
