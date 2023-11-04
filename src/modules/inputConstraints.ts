const inputConstraints: { [key: string]: { minLength: number, maxLength: number } } = {
  username: { minLength: 4, maxLength: 32 },
  password: { minLength: 4, maxLength: 32 },
  servername: { minLength: 4, maxLength: 32 },
}
export default inputConstraints as { [key: string]: { minLength: number, maxLength: number } }
