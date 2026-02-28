import React, { useState, useEffect } from 'react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: Date;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('brutalist-todos');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((t: Todo) => ({ ...t, createdAt: new Date(t.createdAt) }));
    }
    return [];
  });
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'done'>('all');

  useEffect(() => {
    localStorage.setItem('brutalist-todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setTodos([
      ...todos,
      { id: Date.now(), text: input.trim(), completed: false, createdAt: new Date() }
    ]);
    setInput('');
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  const clearCompleted = () => {
    setTodos(todos.filter(t => !t.completed));
  };

  const filteredTodos = todos.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'done') return t.completed;
    return true;
  });

  const activeCount = todos.filter(t => !t.completed).length;
  const completedCount = todos.filter(t => t.completed).length;

  return (
    <div className="min-h-screen bg-[#f5f5f0] flex flex-col selection:bg-black selection:text-[#ffd000]">
      {/* Noise overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03] z-50"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <main className="flex-1 w-full max-w-3xl mx-auto px-4 md:px-8 py-8 md:py-16">
        {/* Header */}
        <header className="mb-8 md:mb-12">
          <div className="border-[5px] border-black bg-black text-[#f5f5f0] p-4 md:p-6 transform -rotate-1 hover:rotate-0 transition-transform duration-300">
            <h1 className="font-mono text-3xl md:text-5xl lg:text-6xl font-bold tracking-tighter uppercase">
              TO_DO
            </h1>
            <p className="font-mono text-xs md:text-sm mt-2 opacity-70 tracking-widest">
              // BRUTALIST TASK MANAGEMENT
            </p>
          </div>
          <div className="h-2 bg-[#ffd000] border-x-[5px] border-b-[5px] border-black transform translate-y-[-5px]" />
        </header>

        {/* Input Form */}
        <form onSubmit={addTodo} className="mb-8 md:mb-12">
          <div className="flex flex-col sm:flex-row gap-0">
            <div className="flex-1 border-[5px] border-black bg-white transform sm:translate-x-1 translate-y-1 sm:translate-y-0 relative z-10">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="ENTER TASK..."
                className="w-full px-4 py-4 md:py-5 font-mono text-base md:text-lg bg-transparent focus:outline-none placeholder:text-gray-400 uppercase tracking-wide"
              />
            </div>
            <button
              type="submit"
              className="border-[5px] border-black bg-[#ffd000] px-6 md:px-8 py-4 md:py-5 font-mono text-base md:text-lg font-bold uppercase tracking-wider hover:bg-black hover:text-[#ffd000] transition-colors duration-150 active:transform active:translate-y-1"
            >
              ADD+
            </button>
          </div>
        </form>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 md:mb-8">
          {(['all', 'active', 'done'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`
                border-[3px] border-black px-4 py-2 font-mono text-sm md:text-base uppercase tracking-wider
                transition-all duration-150
                ${filter === f
                  ? 'bg-black text-[#f5f5f0] transform -translate-y-1'
                  : 'bg-[#f5f5f0] hover:bg-[#e5e5e0] active:translate-y-0.5'
                }
              `}
            >
              {f} {f === 'all' ? `(${todos.length})` : f === 'active' ? `(${activeCount})` : `(${completedCount})`}
            </button>
          ))}
        </div>

        {/* Stats Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 md:mb-8 p-3 md:p-4 border-[3px] border-black border-dashed">
          <div className="font-mono text-xs md:text-sm uppercase tracking-widest">
            <span className="opacity-50">PENDING:</span>{' '}
            <span className="font-bold text-base md:text-lg">{activeCount}</span>
          </div>
          <div className="font-mono text-xs md:text-sm uppercase tracking-widest">
            <span className="opacity-50">COMPLETED:</span>{' '}
            <span className="font-bold text-base md:text-lg">{completedCount}</span>
          </div>
          {completedCount > 0 && (
            <button
              onClick={clearCompleted}
              className="font-mono text-xs md:text-sm uppercase tracking-wider border-b-2 border-black hover:bg-black hover:text-[#f5f5f0] px-2 py-1 transition-colors"
            >
              CLEAR DONE
            </button>
          )}
        </div>

        {/* Todo List */}
        <div className="space-y-3 md:space-y-4">
          {filteredTodos.length === 0 && (
            <div className="border-[5px] border-black border-dashed p-8 md:p-12 text-center">
              <p className="font-mono text-lg md:text-xl uppercase tracking-widest opacity-40">
                {filter === 'all' ? '// NO TASKS' : filter === 'active' ? '// NO PENDING TASKS' : '// NO COMPLETED TASKS'}
              </p>
            </div>
          )}

          {filteredTodos.map((todo, index) => (
            <div
              key={todo.id}
              className={`
                group border-[5px] border-black p-4 md:p-5 transition-all duration-150
                ${todo.completed
                  ? 'bg-[#e0e0d8] opacity-60'
                  : 'bg-white hover:transform hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#000]'
                }
              `}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start gap-4">
                {/* Checkbox */}
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className={`
                    flex-shrink-0 w-8 h-8 md:w-10 md:h-10 border-[4px] border-black flex items-center justify-center
                    transition-colors duration-150 mt-0.5
                    ${todo.completed
                      ? 'bg-black'
                      : 'bg-white hover:bg-[#ffd000]'
                    }
                  `}
                  aria-label={todo.completed ? "Mark as incomplete" : "Mark as complete"}
                >
                  {todo.completed && (
                    <svg className="w-5 h-5 md:w-6 md:h-6 text-[#ffd000]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={4} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>

                {/* Task Content */}
                <div className="flex-1 min-w-0">
                  <p className={`
                    font-mono text-base md:text-lg uppercase tracking-wide break-words
                    ${todo.completed ? 'line-through opacity-50' : ''}
                  `}>
                    {todo.text}
                  </p>
                  <p className="font-mono text-xs opacity-40 mt-1 tracking-widest">
                    {todo.createdAt.toLocaleDateString('en-US', {
                      month: 'short',
                      day: '2-digit',
                      year: '2-digit'
                    }).toUpperCase().replace(/,/g, '.')}
                  </p>
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 border-[3px] border-black flex items-center justify-center font-mono font-bold text-lg md:text-xl
                    opacity-0 group-hover:opacity-100 hover:bg-black hover:text-[#f5f5f0] transition-all duration-150"
                  aria-label="Delete task"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Decorative Element */}
        <div className="mt-12 md:mt-16 flex items-center gap-4">
          <div className="flex-1 h-[5px] bg-black" />
          <div className="w-4 h-4 md:w-5 md:h-5 bg-[#ffd000] border-[3px] border-black transform rotate-45" />
          <div className="flex-1 h-[5px] bg-black" />
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t-[5px] border-black py-6 md:py-8 px-4 md:px-8">
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-black" />
            <p className="font-mono text-xs uppercase tracking-[0.2em] opacity-50">
              BRUTALIST_TODO v1.0
            </p>
          </div>
          <p className="font-mono text-xs uppercase tracking-wider opacity-40 text-center md:text-right">
            Requested by @web-user · Built by @clonkbot
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
