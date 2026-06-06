import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user } = useAuth()

  return (
    <nav style={{
      width: '100%',
      borderBottom: '1px solid #1e1e2e',
      backgroundColor: '#111118',
      padding: '14px 35px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: '5px', color: 'white', fontWeight: 500 }}>{user?.username}</p>
          <p style={{ fontSize: '5px', color: '#71717a' }}>{user?.role}</p>
        </div>
        <div style={{
          width: '34px', height: '34px', borderRadius: '50%',
          backgroundColor: '#4f46e5', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          fontSize: '13px', fontWeight: 700, color: 'white',
        }}>
          {user?.username?.[0]?.toUpperCase()}
        </div>
      </div>
    </nav>
  )
}