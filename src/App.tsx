import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './App.css';
import Router from './components/Router';
import WhatsAppButton from './components/WhatsAppButton';

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.dir = i18n.dir(i18n.language);
    if (i18n.language === 'ar') {
      document.documentElement.classList.add('font-arabic');
    } else {
      document.documentElement.classList.remove('font-arabic');
    }
  }, [i18n, i18n.language]);

  return (
    <>
      <Router />
      <WhatsAppButton />
    </>
  );
}

export default App;
