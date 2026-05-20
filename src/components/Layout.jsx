import Sidebar from './Sidebar'

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen w-full bg-[#0a0a0f]">
      <Sidebar />
      <div className="flex flex-col flex-1 ml-60 min-h-screen">
        {children}
      </div>
    </div>
  )
}