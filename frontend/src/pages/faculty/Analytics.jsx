import { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import API from '../../api/axios'
import toast, { Toaster } from 'react-hot-toast'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const COLORS = ['#6366f1', '#8b5cf6', '#14b8a6', '#f59e0b', '#f43f5e', '#10b981']

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: 'var(--card2,#17172a)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px' }}>
      <p style={{ color: 'white', fontSize: 13, fontWeight: 600 }}>{label || payload[0]?.name}</p>
      <p style={{ color: '#818cf8', fontSize: 13, fontWeight: 700, marginTop: 2 }}>{payload[0]?.value} students</p>
    </div>
  )
}

export default function Analytics() {
  const [subjectData, setSubjectData] = useState([])
  const [studentData, setStudentData] = useState([])
  const [fraudData, setFraudData] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([
      API.get('/analytics/subject-wise'),
      API.get('/analytics/student-attendance'),
      API.get('/analytics/fraud-summary'),
    ]).then(([s, st, f]) => {
      setSubjectData(s.data.subject_wise)
      setStudentData(st.data.student_attendance.slice(0, 10))
      setFraudData(f.data.fraud_summary)
    }).catch(() => toast.error('Failed to load analytics'))
    .finally(() => setLoading(false))
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Toaster position="top-right" toastOptions={{ style: { background: 'var(--card)', color: 'var(--text)', border: '1px solid var(--border)' } }} />
      <Navbar />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }} className="page">
        <button onClick={() => navigate('/faculty')} style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--muted2)', fontSize: 13, background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: 24 }}>
          <ChevronLeft size={16} /> Back
        </button>

        <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 26, color: 'white', marginBottom: 6 }}>Analytics</h1>
        <p style={{ color: 'var(--muted2)', fontSize: 14, marginBottom: 28 }}>Insights across all your sessions and students</p>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {[1,2,3,4].map(i => <div key={i} className="card shimmer-bg" style={{ height: 280 }} />)}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Row 1: charts */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

              {/* Subject bar chart */}
              <div className="card" style={{ padding: 24 }}>
                <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 15, color: 'white', marginBottom: 20 }}>Attendance by Subject</h3>
                {subjectData.length === 0 ? (
                  <div className="empty-state" style={{ padding: 40 }}><p>No data yet</p></div>
                ) : (
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={subjectData} barCategoryGap="30%">
                      <XAxis dataKey="subject" tick={{ fill: 'var(--muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: 'var(--muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99,102,241,0.06)' }} />
                      <Bar dataKey="count" radius={[6,6,0,0]} fill="url(#barGrad)" />
                      <defs>
                        <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#6366f1" />
                          <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.7} />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* Fraud pie chart */}
              <div className="card" style={{ padding: 24 }}>
                <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 15, color: 'white', marginBottom: 20 }}>Fraud Attempt Breakdown</h3>
                {fraudData.length === 0 ? (
                  <div className="empty-state" style={{ padding: 40 }}>
                    <p style={{ fontSize: 14, color: 'var(--muted2)' }}>🎉 No fraud attempts recorded!</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={fraudData} dataKey="count" nameKey="reason" cx="50%" cy="50%" outerRadius={80} innerRadius={40} paddingAngle={3}>
                        {fraudData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10 }} labelStyle={{ color: 'white' }} />
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: 'var(--muted2)' }} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Student table */}
            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 15, color: 'white', marginBottom: 20 }}>Student Attendance Summary</h3>
              {studentData.length === 0 ? (
                <div className="empty-state" style={{ padding: 40 }}><p>No student data yet</p></div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                      {['#', 'Student', 'Roll Number', 'Total Present'].map(h => (
                        <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontSize: 12, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {studentData.map((s, i) => (
                      <tr key={i} className="table-row">
                        <td style={{ padding: '10px 12px', fontSize: 13, color: 'var(--muted)', fontFamily: 'JetBrains Mono,monospace' }}>{i + 1}</td>
                        <td style={{ padding: '10px 12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: 28, height: 28, borderRadius: '50%', background: `hsl(${(i*60)%360},60%,50%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'white' }}>
                              {s.name?.[0]?.toUpperCase()}
                            </div>
                            <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>{s.name}</span>
                          </div>
                        </td>
                        <td style={{ padding: '10px 12px', fontSize: 13, color: 'var(--muted)', fontFamily: 'JetBrains Mono,monospace' }}>{s.roll_number}</td>
                        <td style={{ padding: '10px 12px' }}>
                          <span className="badge badge-indigo" style={{ fontSize: 13, fontWeight: 700 }}>{s.total_present}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}