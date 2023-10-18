import { useEffect, useState } from 'react';

export default function ProtectPage({ children }: any) {
  const [isVerified, setIsVerified] = useState(false)

  useEffect(() => {
    fetch('/api/verify')
      .then((res: Response) => res.json())
      .then((data: any) => {
        // @ts-ignore
        data.status ? setIsVerified(true) : window.location.href = '/login'
      })
  }, [])

  return (
    <div>
      {isVerified ? children : <h1>Verifying User</h1>}
    </div>
  )
}
