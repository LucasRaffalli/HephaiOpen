import { BrowserRouter, Navigate, Route, Router, Routes } from 'react-router-dom'
import Home from './views/Home'
import NotFoundPage from './views/NotFoundPage'
import Layout from './layout/Layout'
import { Invoice } from '@/views/Invoice'
import Chart from './views/Chart'
import Settings from './views/Settings'
import Clients from './components/navbar/nav_content/Clients'
import NavigationLayout from './layout/NavigationLayout'
import SettingsBackup from './views/Settings__backup'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="navigation/factures" element={<Invoice />} />
        <Route path="navigation/graphique" element={<Chart />} />
        {/* <Route path="navigation" element={<NavigationLayout />}>
          <Route path="factures" element={<Invoice />} />
          <Route path="graphique" element={<Chart />} />
        </Route> */}
        <Route path="clients" element={<Clients />} />
        <Route path="settings" element={<Settings />} />
        {/* <Route path="settings" element={<SettingsBackup />} /> */}
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>

  )
}

export default App