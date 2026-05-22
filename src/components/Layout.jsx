import { useState } from 'react'
import Sidebar from './Sidebar'

export default function Layout({ children }) {
  // Estado que controla se a sidebar está expandida ou recolhida
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      width: '100%',
      backgroundColor: '#0a0a0f',
    }}>
      {/* Container da Sidebar dinâmico */}
      <div style={{ 
        flexShrink: 0, 
        width: isExpanded ? '240px' : '75px', 
        transition: 'width 0.3s ease' /* Transição suave ao abrir/fechar */
      }}>
        {/* Passamos o estado e a função de mudar o estado para dentro da Sidebar */}
        <Sidebar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
      </div>
      
      {/* Conteúdo Principal */}
      <main style={{
        flex: 1,
        minWidth: 0, 
        display: 'flex',
        flexDirection: 'column',
        padding: '24px',
        boxSizing: 'border-box',
      }}>
        {children}
      </main>
    </div>
  )
}