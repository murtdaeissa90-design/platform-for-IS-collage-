"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/components/AppProvider";

const TASKS_KEY = "study_tasks";

export default function TasksPage() {
  const { L } = useApp();
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    try {
      setTasks(JSON.parse(localStorage.getItem(TASKS_KEY)) || []);
    } catch {}
  }, []);

  const save = (list) => {
    setTasks(list);
    try {
      localStorage.setItem(TASKS_KEY, JSON.stringify(list));
    } catch (e) {
      console.error("Could not save tasks:", e);
    }
  };

  const add = () => {
    const v = text.trim();
    if (!v) return;
    save([...tasks, { text: v, done: false }]);
    setText("");
  };

  return (
    <div className="container">
      <div className="title">
        <h2>{L("📝 My Study Tasks", "📝 مهام مذاكرتي")}</h2>
      </div>
      <div className="task-add">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder={L("Write a new task...", "اكتب مهمة جديدة...")}
        />
        <button type="button" onClick={add}>{L("➕ Add", "➕ إضافة")}</button>
      </div>
      <ul className="task-list">
        {tasks.map((t, i) => (
          <li key={i} className={t.done ? "done" : ""}>
            <span onClick={() => save(tasks.map((x, j) => (j === i ? { ...x, done: !x.done } : x)))}>{t.text}</span>
            <button type="button" aria-label={L("Delete task", "حذف المهمة")}
              onClick={() => save(tasks.filter((_, j) => j !== i))}>✕</button>
          </li>
        ))}
      </ul>
      {tasks.length === 0 && (
        <p className="empty">{L("No tasks yet. Add your first one above 👆", "لا توجد مهام بعد. أضف أول مهمة من الأعلى 👆")}</p>
      )}
    </div>
  );
}
