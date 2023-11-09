import easyFetch from 'modules/easyFetch';
import { ReactNode, useEffect, useState } from 'react';
import { ResBody } from 'types';

export default function ProtectPage({ children }: { children: ReactNode }) {
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    (async() => {
      const data: ResBody = await easyFetch('/api/verify', 'GET');
      data.username ? setIsVerified(true) : window.location.href = '/login';
    })();
  }, []);

  return (
    <div>
      {isVerified ? children : <h1>Verifying User</h1>}
    </div>
  )
}
