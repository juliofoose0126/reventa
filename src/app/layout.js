import { AuthProvider } from '@/context/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './globals.css';

export const metadata = {
  title: 'BOLETOS-YA | Compra y Venta de Boletos Segura en México',
  description: 'Comprar y vender boletos para conciertos, deportes, teatro y festivales de forma rápida, 100% segura y garantizada en México.',
  keywords: 'boletos, boletos-ya, reventa, conciertos, deportes, teatro, festivales, mexico, comprar boletos, vender boletos',
  openGraph: {
    title: 'BOLETOS-YA - Compra y Venta Segura de Boletos',
    description: 'La forma más moderna, creativa y confiable de conseguir tus boletos en México con garantía del 100%.',
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
