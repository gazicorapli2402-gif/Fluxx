import React, { useState } from "react";
import { TodoModalProps } from "../types/index";

export default function TodoModal({ task, onClose, onUpdate }) {
  const [description, setDescription] = useState(task.description || "");
  const [text, setText] = useState(task.text);

  const handleSave = () => {
    onUpdate({ text, description });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <div className="tag" style={{
          background: task.category === 'urgent' ? 'rgba(239, 68, 68, 0.2)' : 
                     task.category === 'work' ? 'rgba(59, 130, 246, 0.2)' :
                     task.category === 'study' ? 'rgba(168, 85, 247, 0.2)' : 'rgba(16, 185, 129, 0.2)',
          color: task.category === 'urgent' ? '#ef4444' : 
                 task.category === 'work' ? '#3b82f6' :
                 task.category === 'study' ? '#a855f7' : '#10b981'
        }}>
          {task.category}
        </div>

        <input 
          className="edit-input" 
          value={text} 
          onChange={(e) => setText(e.target.value)}
          style={{fontSize: '1.5rem', fontWeight: 'bold', width: '100%', marginBottom: '20px'}}
        />

        <div className="analytics-title">Açıklama</div>
        <textarea 
          className="modal-description"
          placeholder="Bu görev hakkında detaylı bilgi ekleyin..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div style={{marginTop: '30px', display: 'flex', gap: '10px', justifyContent: 'flex-end'}}>
          <button className="btn-add" style={{background: 'rgba(255,255,255,0.1)', color: 'white'}} onClick={onClose}>İptal</button>
          <button className="btn-add" onClick={handleSave}>Kaydet</button>
        </div>
      </div>
    </div>
  );
}