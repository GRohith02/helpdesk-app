import { useState, useEffect } from 'react'
import { Toaster, toast } from 'react-hot-toast'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const SAMPLE = [
  { id:1, title:'Laptop not booting', category:'Hardware', priority:'High', status:'Open', date:'2025-04-28' },
  { id:2, title:'Cannot access VPN', category:'Network', priority:'High', status:'In Progress', date:'2025-04-27' },
  { id:3, title:'Excel not opening', category:'Software', priority:'Low', status:'Resolved', date:'2025-04-26' },
  { id:4, title:'Monitor flickering', category:'Hardware', priority:'Medium', status:'Open', date:'2025-04-25' },
  { id:5, title:'Forgot email password', category:'Access', priority:'Medium', status:'Open', date:'2025-04-24' },
  { id:6, title:'Printer not working', category:'Hardware', priority:'Low', status:'Resolved', date:'2025-04-23' },
  { id:7, title:'Slow internet connection', category:'Network', priority:'High', status:'In Progress', date:'2025-04-22' },
  { id:8, title:'Software license expired', category:'Software', priority:'Medium', status:'Open', date:'2025-04-21' },
]

const COLORS = ['#3b82f6','#f59e0b','#10b981']

export default function App() {
  const [tickets, setTickets] = useState(() => {
    const saved = localStorage.getItem('tickets')
    return saved ? JSON.parse(saved) : SAMPLE
  })
  const [filter, setFilter] = useState('All')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title:'', category:'Hardware', priority:'Medium' })
  const [tab, setTab] = useState('dashboard')

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

  const updateStatus = (id, status) => {
    setTickets(prev => prev.map(t => t.id === id ? {...t, status} : t))
    toast.success(`Status updated to ${status}`)
  }

  const filtered = filter === 'All' ? tickets : tickets.filter(t => t.status === filter)

  const pieData = [
    { name:'Open', value: tickets.filter(t=>t.status==='Open').length },
    { name:'In Progress', value: tickets.filter(t=>t.status==='In Progress').length },
    { name:'Resolved', value: tickets.filter(t=>t.status==='Resolved').length },
  ]

  const barData = ['Hardware','Software','Network','Access'].map(cat => ({
    name: cat,
    count: tickets.filter(t=>t.category===cat).length
  }))

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />

      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">IT Helpdesk</h1>
        <div className="flex gap-2">
          {['dashboard','admin','analytics'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-full text-sm cursor-pointer capitalize
                ${tab===t ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">

        {tab === 'dashboard' && (
          <>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { label:'Total', value: tickets.length, bg:'bg-blue-50', text:'text-blue-700' },
                { label:'Open', value: tickets.filter(t=>t.status==='Open').length, bg:'bg-red-50', text:'text-red-700' },
                { label:'Resolved', value: tickets.filter(t=>t.status==='Resolved').length, bg:'bg-green-50', text:'text-green-700' },
              ].map(s => (
                <div key={s.label} className={`${s.bg} rounded-xl p-4 text-center`}>
                  <p className={`text-3xl font-semibold ${s.text}`}>{s.value}</p>
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
              <div className="border rounded-xl p-4 mb-4 bg-white shadow-sm">
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
          </>
        )}

        {tab === 'admin' && (
          <>
            <p className="text-sm text-gray-500 mb-4">Change ticket status as admin — updates reflect instantly on dashboard</p>
            {tickets.map(t => (
              <div key={t.id} className="border rounded-xl p-4 mb-3 bg-white flex justify-between items-center">
                <div>
                  <p className="font-medium">{t.title}</p>
                  <p className="text-sm text-gray-500 mt-1">{t.category} · {t.priority} priority</p>
                </div>
                <select value={t.status}
                  onChange={e => updateStatus(t.id, e.target.value)}
                  className="border rounded-lg px-3 py-1.5 text-sm cursor-pointer">
                  {['Open','In Progress','Resolved'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            ))}
          </>
        )}

        {tab === 'analytics' && (
          <>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white border rounded-xl p-4">
                <p className="font-medium mb-4 text-sm">Tickets by status</p>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({name,value})=>`${name}: ${value}`}>
                      {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white border rounded-xl p-4">
                <p className="font-medium mb-4 text-sm">Tickets by category</p>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={barData}>
                    <XAxis dataKey="name" tick={{fontSize:12}} />
                    <YAxis tick={{fontSize:12}} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3 mt-6">
              {['Hardware','Software','Network','Access'].map(cat => (
                <div key={cat} className="bg-white border rounded-xl p-4 text-center">
                  <p className="text-2xl font-semibold text-blue-600">{tickets.filter(t=>t.category===cat).length}</p>
                  <p className="text-xs text-gray-500 mt-1">{cat}</p>
                </div>
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  )
}