import React, { useState, useRef } from "react";
import { TodoFormProps, TodoFormState } from "../types/index";

export default function TodoForm({ addTodo }) {
  const [text, setText] = useState("");
  const [category, setCategory] = useState("personal");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isListening, setIsListening] = useState(false);
  
  // Start Time State
  const [startHours, setStartHours] = useState(new Date().getHours());
  const [startMinutes, setStartMinutes] = useState(new Date().getMinutes());
  
  // End Time State
  const [endHours, setEndHours] = useState(new Date().getHours() + 1);
  const [endMinutes, setEndMinutes] = useState(new Date().getMinutes());
  
  const timerRef = useRef(null);
  const timeoutRef = useRef(null);

  // Speech Recognition Logic
  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Tarayıcınız ses tanımayı desteklemiyor.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'tr-TR';
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setText(transcript);
    };

    recognition.start();
  };

  const adjustTime = (target, type, amount) => {
    const setter = target === 'start' ? 
      (type === 'h' ? setStartHours : setStartMinutes) : 
      (type === 'h' ? setEndHours : setEndMinutes);
    
    setter((prev) => {
      const max = type === 'h' ? 24 : 60;
      return (prev + amount + max) % max;
    });
  };

  const startAdjusting = (target, type, amount) => {
    adjustTime(target, type, amount);
    timeoutRef.current = setTimeout(() => {
      timerRef.current = setInterval(() => adjustTime(target, type, amount), 100);
    }, 500);
  };

  const stopAdjusting = () => {
    clearTimeout(timeoutRef.current);
    clearInterval(timerRef.current);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      const startDate = `${date}T${startHours.toString().padStart(2, '0')}:${startMinutes.toString().padStart(2, '0')}`;
      const endDate = `${date}T${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
      addTodo(text, endDate, category, startDate);
      setText("");
    }
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <div className="input-group">
        <div style={{position: 'relative', flex: 1}}>
          <input
            className="todo-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Yeni bir görev ekle..."
            style={{paddingRight: '45px', width: '100%'}}
          />
          <button 
            type="button" 
            className={`btn-voice ${isListening ? 'listening' : ''}`}
            onClick={handleVoiceInput}
            title="Sesle ekle"
          >
            🎤
          </button>
        </div>
        <select 
          className="filter-select" 
          value={category} 
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="work">İş</option>
          <option value="personal">Kişisel</option>
          <option value="urgent">Acil</option>
          <option value="study">Ders</option>
        </select>
      </div>

      <div style={{display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap'}}>
        <input
          type="date"
          className="date-input"
          style={{background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '12px'}}
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <div className="custom-time-picker">
          <span style={{fontSize: '0.7rem', color: '#818cf8'}}>BAŞLA</span>
          <div className="time-controls">
            <div className="time-unit">
              <button type="button" onMouseDown={() => startAdjusting('start', 'h', 1)} onMouseUp={stopAdjusting} onMouseLeave={stopAdjusting}>▲</button>
              <span>{startHours.toString().padStart(2, '0')}</span>
              <button type="button" onMouseDown={() => startAdjusting('start', 'h', -1)} onMouseUp={stopAdjusting} onMouseLeave={stopAdjusting}>▼</button>
            </div>
            <span className="time-sep">:</span>
            <div className="time-unit">
              <button type="button" onMouseDown={() => startAdjusting('start', 'm', 5)} onMouseUp={stopAdjusting} onMouseLeave={stopAdjusting}>▲</button>
              <span>{startMinutes.toString().padStart(2, '0')}</span>
              <button type="button" onMouseDown={() => startAdjusting('start', 'm', -5)} onMouseUp={stopAdjusting} onMouseLeave={stopAdjusting}>▼</button>
            </div>
          </div>
        </div>

        <div className="custom-time-picker">
          <span style={{fontSize: '0.7rem', color: '#ef4444'}}>BİTİR</span>
          <div className="time-controls">
            <div className="time-unit">
              <button type="button" onMouseDown={() => startAdjusting('end', 'h', 1)} onMouseUp={stopAdjusting} onMouseLeave={stopAdjusting}>▲</button>
              <span>{endHours.toString().padStart(2, '0')}</span>
              <button type="button" onMouseDown={() => startAdjusting('end', 'h', -1)} onMouseUp={stopAdjusting} onMouseLeave={stopAdjusting}>▼</button>
            </div>
            <span className="time-sep">:</span>
            <div className="time-unit">
              <button type="button" onMouseDown={() => startAdjusting('end', 'm', 5)} onMouseUp={stopAdjusting} onMouseLeave={stopAdjusting}>▲</button>
              <span>{endMinutes.toString().padStart(2, '0')}</span>
              <button type="button" onMouseDown={() => startAdjusting('end', 'm', -5)} onMouseUp={stopAdjusting} onMouseLeave={stopAdjusting}>▼</button>
            </div>
          </div>
        </div>

        <button className="btn-add" type="submit" style={{height: '45px'}}>Ekle</button>
      </div>
    </form>
  );
}