import { RefObject } from 'react';
import NewInput from 'components/NewInput';
import { verifyInputs, viewErrors, getFormInputs } from 'modules/inputValidation';
import { ResBody, ServerObj, Servers } from 'types';
import easyFetch from 'modules/easyFetch';

export default function NewConnection({ 
  servers, 
  setServers, 
  setToggle,
  setCurrentServer,
  chatRef,
}: {
  servers: Servers,
  setServers: Function,
  setToggle: Function,
  setCurrentServer: Function,
  chatRef: RefObject<HTMLDivElement>,
}) {
  return (
    <form className='flex flex-wrap gap-4' onSubmit={async(e) => {
      e.preventDefault();
      const form = e.target as HTMLFormElement;
      const { servername } = getFormInputs(form)
      console.log(servername)

      // If user is already connected to this server, just switch chat view to that server
      if (Object.keys(servers).includes(servername)) {
        setCurrentServer(servername);
        form.reset();
        return;
      }

      const validity = verifyInputs({ servername });
      if (!validity.isValid) {
        return viewErrors(form, validity.errors)
      }

      // Fetch port from server
      const res: Response = await easyFetch('/api/getPort', 'POST', { servername }, true)
      const { errors, port }: ResBody = await res.json();

      // If no errors in response, setup new websocket
      if (Object.keys(errors).length) {
        return viewErrors(form, errors);
      }
      form.reset();

      // Set up new web socket connection
      const ws = new WebSocket(`ws://${new URL(res.url).hostname}:${port}`) as ServerObj;
      ws.servername = servername;
      ws.chatHistory = [];
      ws.onclose = () => {
        delete servers[ws.servername];
        setToggle((oldToggle: boolean) => !oldToggle);
      }
      ws.onmessage = ({ data }: { data: string }) => {
        if (chatRef.current) {
          let { scrollHeight, scrollTop, clientHeight } = chatRef.current;
          if (scrollHeight - scrollTop === clientHeight) {
            setTimeout(() => {
              if (chatRef.current) {
                chatRef.current.scrollTop = chatRef.current.scrollHeight;
              }
            }, 50);
          }
        }
        ws.chatHistory.push(data);
        setToggle((oldToggle: boolean) => !oldToggle);
      }

      setServers((oldServers: Servers) => {
        oldServers[servername] = ws;
        return oldServers;
      });
      setCurrentServer(servername);
    }}>
      <NewInput inputName='servername'
        className='flex flex-1 justify-between gap-4'
        labelClassName='flex justify-center items-center flex-1'
        inputClassName='p-1 px-2 bg-gray-600'
        type='text'
      />
      <button className='flex-1 bg-blue-700 p-1 px-4' type='submit'>Connect</button>
    </form>
  )
}
