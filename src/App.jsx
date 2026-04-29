import { useState, useEffect } from 'react'
import { Toaster, toast } from 'react-hot-toast'

const SAMPLE = [
  { id:1, title:'Laptop not booting', category:'Hardware', priority:'High', status:'Open', date:'2025-04-28' },
  { id:2, title:'Cannot access VPN', category:'Network', priority:'High', status:'In Progress', date:'2025-04-27' },
  { id:3, title:'Excel not opening', category:'Software', priority:'Low', status:'Resolved', date:'2025-04-26' },
  { id:4, title:'Monitor flickering', category:'Hardware', priority:'Medium', status:'Open', date:'2025-04-25' },
  { id:5, title:'Forgot email password', category:'Access', priority:'Medium', status:'Open', date:'2025-04-24' },
]

export default function App() {
  const [tickets, setTickets] = useState(() => {
    const saved = localStorage.getItem('tickets')
    return saved ? JSON.parse(saved) : SAMPLE
  })
  const [filter, setFilter] = useState('All')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title:'', category:'Hardware', priority:'Medium' })

  useEffect(() => {
    localStorage.setItem('tickets', JSON.stringify(tickets))
  }, [tickets])

  const addTicket = () => {
    if (!form.title.trim()) { toast.error('Please enter a title'); return }
    setTickets(prev => [{
      id: Date.now(), ...form,
      status:'Open', date: new Date().toISOString().split('T')[0]
    }, ...prev])
    setForm({ title:'', category:'Hardware', priority:'Medium' })
    setShowForm(false)
    toast.success('Ticket created!')
  }

  const filtered = filter === 'All' ? tickets : tickets.filter(t => t.status === filter)

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Toaster />
      <h1 className="text-2xl font-semibold mb-6">IT Helpdesk</h1>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label:'Total', value: tickets.length, bg:'bg-gray-100' },
          { label:'Open', value: tickets.filter(t=>t.status==='Open').length, bg:'bg-red-50' },
          { label:'Resolved', value: tickets.filter(t=>t.status==='Resolved').length, bg:'bg-green-50' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-xl p-4 text-center`}>
            <p className="text-2xl font-semibold">{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        {['All','Open','In Progress','Resolved'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-sm border cursor-pointer
              ${filter===s ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-300'}`}>
            {s}
          </button>
        ))}
        <button onClick={() => setShowForm(!showForm)}
          className="ml-auto px-4 py-1.5 rounded-full text-sm bg-blue-600 text-white cursor-pointer">
          + New Ticket
        </button>
      </div>

      {showForm && (
        <div className="border rounded-xl p-4 mb-4 bg-gray-50">
          <p className="font-medium mb-3">New Ticket</p>
          <input value={form.title}
            onChange={e => setForm({...form, title: e.target.value})}
            placeholder="Issue title"
            className="w-full border rounded-lg px-3 py-2 text-sm mb-2 outline-none" />
          <div className="flex gap-2 mb-3">
            <select value={form.category}
              onChange={e => setForm({...form, category: e.target.value})}
              className="flex-1 border rounded-lg px-3 py-2 text-sm">
              {['Hardware','Software','Network','Access'].map(c => <option key={c}>{c}</option>)}
            </select>
            <select value={form.priority}
              onChange={e => setForm({...form, priority: e.target.value})}
              className="flex-1 border rounded-lg px-3 py-2 text-sm">
              {['Low','Medium','High'].map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div className="flex gap-2">
            <button onClick={addTicket}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm cursor-pointer">Submit</button>
            <button onClick={() => setShowForm(false)}
              className="px-4 py-2 border rounded-lg text-sm cursor-pointer">Cancel</button>
          </div>
        </div>
      )}

      {filtered.map(t => (
        <div key={t.id} className="border rounded-xl p-4 mb-3 bg-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium">{t.title}</p>
              <p className="text-sm text-gray-500 mt-1">{t.category} · {t.priority} priority · {t.date}</p>
            </div>
            <span className={`text-xs px-3 py-1 rounded-full font-medium
              ${t.status==='Open' ? 'bg-red-100 text-red-700' :
                t.status==='In Progress' ? 'bg-yellow-100 text-yellow-700' :
                'bg-green-100 text-green-700'}`}>
              {t.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}