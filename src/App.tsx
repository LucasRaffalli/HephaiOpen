import { Route, Routes } from 'react-router-dom'
import Home from './views/Home'
import NotFoundPage from './views/NotFoundPage'
import Layout from './layout/Layout'
import { Invoice } from '@/views/Invoice'
import Settings from './views/Settings'
import Clients from './components/navbar/nav_content/Clients'
import { pdfjs } from 'react-pdf';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ShortcutsPanel from './components/shortcut/ShortcutsPanel'
import UpdatePage from './components/update'
import { useEscapeKey } from './hooks/useEscapeKey'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

function App() {
  useEscapeKey();

  return (
    <>
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" className="toast-container-custom" toastClassName="toast-custom" style={{ zIndex: 9999 }} />
      <ShortcutsPanel />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="navigation/factures" element={<Invoice />} />
          <Route path="clients" element={<Clients />} />
          <Route path="settings" element={<Settings />} />
          <Route path="update" element={<UpdatePage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;