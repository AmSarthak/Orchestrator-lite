import { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./MainPage.css";
import loader from '../assets/loader1.gif';

export default function MainPage() {
  const [showForm, setShowForm] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({ title: "", duration: "", failMode: "", retryCount: "", description: "" });
  const [eventList, setEventList] = useState([]);
  const [loading, setIsLoading] = useState(false);
  //const eventList = [];

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || formData.duration == 0) return;

    const newTask = { ...formData, id: Date.now(), name: formData.title };
    setTasks([...tasks, newTask]);
    setFormData({ title: "", duration: "", failMode: "", retryCount: "", description: "" });
    setShowForm(false);
  };

  const startWorkFlow = async () => {
    setEventList([]);
    if (tasks.length < 2){
        alert("Minimum 2 tasks required");
        return;
    }
    setIsLoading(true);
    try {
      const socket = new WebSocket("ws://localhost:3002");
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setEventList(prevList => [...prevList, data]);
        setIsLoading(false);
      };
      const response = await axios.post("http://localhost:3000/startWorkflow", { steps: tasks });
      
      // setEventList(response.data.events);
    } catch (err) {
      console.error("Workflow failed", err);
    } finally {
    }
  };

  const bottomRef = useRef(null);

  useEffect(() => {
    // This scrolls the bottom div into view smoothly
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [eventList]); // Triggered every time the list length changes

  return (
    <div className="workflow-shell">
      <header className="workflow-header">
        <h1>Workflow Engine</h1>
        <div className="actions">
          <button className="btn-secondary" onClick={() => setShowForm(true)}>+ Add Step</button>
          <button 
            className="btn-primary" 
            disabled={loading || tasks.length < 2} 
            onClick={startWorkFlow}
          >
            {loading ? "Running..." : "Run Workflow"}
          </button>
        </div>
      </header>

      <main className="workflow-grid">
        {/* Left Column: Builder */}
        <section className="column">
          <div className="scroll-area">
            {tasks.map((task) => (
              <div key={task.id} className="card task-card">
                <h3>{task.name}</h3>
                <p>{task.description}</p>
              </div>
            ))}
            {showForm && (
              <form className="card form-card" onSubmit={handleAddTask}>
                <input type="text" placeholder="Title" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
                <div className="input-group">
                    <input type="number" placeholder="Duration (ms)" value={formData.duration} onChange={(e) => setFormData({...formData, duration: e.target.value})} />
                    <input type="number" placeholder="Retries" value={formData.retryCount} onChange={(e) => setFormData({...formData, retryCount: e.target.value})} />
                    <input type="text" placeholder="Failmode" value={formData.failMode} onChange={(e) => setFormData({...formData, failMode: e.target.value})} />

                </div>
                <button type="submit" className="btn-submit">Save Step</button>
                <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>Cancel</button>
              </form>
            )}
          </div>
        </section>

        {/* Right Column: Monitor */}
        <section className="column">
          <div className="column-header"><h2>{(tasks.length > 0)?'Monitor':''}</h2></div>
          <div className="scroll-area">
            {loading && <div className="loader-wrap"><img height={60} width={60} src={loader} alt="loading" /></div>}
            {!loading && eventList.map((event, idx) => (
              <div key={idx} className={`card event-card ${event.type.toLowerCase().includes('fail') ? 'error' : ''}`}>
                <span className="timestamp">{event.startTime}</span>
                <h4>{event.type}</h4>
                <p>{event.title?.name || "System"}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <div ref={bottomRef} />
    </div>
  );
}