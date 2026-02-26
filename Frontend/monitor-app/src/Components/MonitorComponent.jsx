import React from 'react'
import { useState , useEffect , useRef } from 'react'
import loader from '../assets/loader1.gif';
import './Monitor.css'

function MonitorComponent() {
  const bottomRef = useRef(null);

  const [eventList, setEventList] = useState([]);

  const [loading, setIsLoading] = useState(false)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, [eventList]);

    useEffect(()=>{
      const handleNewTask = (event) => {
        if(event.detail.hasOwnProperty("timestamp")){
          setIsLoading(true)
          const socket = new WebSocket("ws://localhost:3002");
          socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if(data.hasOwnProperty('type')){
              setEventList(prevList => [...prevList, data]);
              setIsLoading(false);
            }
          };
        }
      }
      window.addEventListener('WORKFLOW_STARTED', handleNewTask);
      return () => {
        //socket.close();
        window.removeEventListener('WORKFLOW_STARTED', handleNewTask);
      };
    },[])

    //Dev Testing Purpose
    // useEffect(()=>{
    //     setEventList([])
    //     setIsLoading(true)
    //     const socket = new WebSocket("ws://localhost:3002");
    //     socket.onmessage = (event) => {
    //     const data = JSON.parse(event.data);
    //     if(data.hasOwnProperty('type')){
    //       setEventList(prevList => [...prevList, data]);
    //       setIsLoading(false);
    //     }
        
    //     };
    //     return () => {
    //     socket.close();
    // };
    // },[])

  return (
    <>
      <section className="column">
        <div className="column-header"><h2>Task Monitor</h2></div>
        <div className="scroll-area">
          {loading && <div className="loader-wrap"><img height={60} width={60} src={loader} alt="loading" /></div>}
          {!loading && eventList.map((event, idx) => (
            <div key={idx} className={`card event-card ${(event.type?.toLowerCase().includes('fail') || event.type?.toLowerCase().includes('limit') ) ? 'error' : ''}`}>
              <h4>{event.type?.toUpperCase()}</h4>
              <h4>{event.status?.toUpperCase()}</h4>
              {event.taskId && <p className="timestamp">PID: {event.taskId}</p>}
              {event.title && <p>Process: {event.title?.toUpperCase()}</p>}
              {event.time && <p className="timestamp">Time: {event.time}</p>}
            </div>
          ))}
        </div>
      </section>
      <div ref={bottomRef} />
    </>
  )
}

export default MonitorComponent