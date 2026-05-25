import { AuthProvider } from '@/context/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './globals.css';

export const metadata = {
  title: 'REVENTA | Compra y Venta de Boletos Segura en México',
  description: 'Comprar y vender boletos para conciertos, deportes, teatro y festivales de forma rápida, segura y creativa en México.',
  keywords: 'boletos, reventa, conciertos, deportes, teatro, festivales, mexico, comprar boletos, vender boletos',
  openGraph: {
    title: 'REVENTA - Compra y Venta de Boletos',
    description: 'La forma más moderna, creativa y segura de conseguir tus boletos en México.',
    type: 'website',
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="es-MX">
      <body>
        <AuthProvider>
          <div className="app-container">
            <Header />
            <main className="main-content">
              {children}
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
