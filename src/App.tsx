import { HashRouter as Router } from 'react-router-dom';
import { CartProvider } from './hooks/useCart';
import Header from './components/Header';
import RouterComponent from './components/Router';
import Footer from './components/Footer';

function App() {
  console.log("App component rendered");
  return (
    <CartProvider>
      <Router>
        <div className="App">
          <Header />
          <main className="pt-16">
            <RouterComponent />
          </main>
          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
