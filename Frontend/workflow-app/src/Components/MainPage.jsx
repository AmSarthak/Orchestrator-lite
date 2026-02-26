import { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./MainPage.css";
import loader from '../assets/loader1.gif';

export default function MainPage() {
  const [showForm, setShowForm] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({ title: "", duration: "", failMode: "", retryCount: "", description: "" });
  const [loading, setIsLoading] = useState(false);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || formData.duration == 0) return;

    const newTask = { ...formData, id: Date.now(), name: formData.title };
    setTasks([...tasks, newTask]);
    setFormData({ title: "", duration: "", failMode: "", retryCount: "", description: "" });
    setShowForm(false);
  };

  const startWorkFlow = async () => {
      if (tasks.length == 0){
        alert("Minimum 1 task required");
        return;
      }
      try {
        setIsLoading(true)
        const triggerEvent = new CustomEvent('WORKFLOW_STARTED', {
          detail: {
            event: "WORKFLOW STARTED", 
            timestamp: new Date().toISOString() 
          }
        });
        window.dispatchEvent(triggerEvent);
        setTimeout(async () => {
          const response = await axios.post("http://localhost:3000/startWorkflow", { steps: tasks });
          setIsLoading(false)
        }, 1000);
        } catch (error) {
          console.log(error)
        }
      
  };
  return (
    <div className="workflow-shell">
      <header className="workflow-header">
        <h1>Workflow Engine</h1>
        <div className="actions">
          <button className="btn-secondary" onClick={() => setShowForm(true)}>+ Add Step</button>
          <button 
            className="btn-primary" 
            onClick={()=>startWorkFlow()}
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
                <h3>Task: {task.name.toUpperCase()}</h3>
                <p>Duration: {task.duration} ms</p>
                {task.failMode && <p>Failure Mode: {task.failMode}</p>}
                {task.retryCount && <p>Retry count: {task.retryCount}</p>}
                <p>{task.description}</p>
              </div>
            ))}
            {showForm && (
              <form className="card form-card" onSubmit={handleAddTask}>
                <input type="text"  placeholder="Title" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
                <div className="input-group">
                    <input type="number" required placeholder="Duration (ms)" value={formData.duration} onChange={(e) => setFormData({...formData, duration: e.target.value})} />
                    <input type="number" placeholder="Retries" value={formData.retryCount} onChange={(e) => setFormData({...formData, retryCount: e.target.value})} />
                    <input type="text" placeholder="Failmode" value={formData.failMode} onChange={(e) => setFormData({...formData, failMode: e.target.value})} />

                </div>
                <button type="submit" className="btn-submit">Save Step</button>
                <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>Cancel</button>
              </form>
            )}
          </div>
        </section>        
      </main>
    </div>
  );
}