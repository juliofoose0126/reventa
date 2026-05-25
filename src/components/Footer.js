import Link from 'next/link';
import { ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={`${styles.footer} glass`}>
      <div className={styles.container}>
        <div className={styles.aboutCol}>
          <Link href="/" className={styles.logo}>
            RE<span>VENTA</span>
          </Link>
          <p className={styles.description}>
            La plataforma de reventa de boletos más creativa y segura de México. Compra y vende entradas para tus eventos favoritos con total tranquilidad.
          </p>
          <div className={styles.security}>
            <ShieldCheck size={20} className={styles.securityIcon} />
            <span>Garantía de Compra 100% Segura</span>
          </div>
        </div>

        <div className={styles.linksCol}>
          <h3>Categorías</h3>
          <ul>
            <li><Link href="/eventos?cat=conciertos">Conciertos</Link></li>
            <li><Link href="/eventos?cat=deportes">Deportes</Link></li>
            <li><Link href="/eventos?cat=teatro">Teatro</Link></li>
            <li><Link href="/eventos?cat=festivales">Festivales</Link></li>
          </ul>
        </div>

        <div className={styles.linksCol}>
          <h3>Enlaces Útiles</h3>
          <ul>
            <li><Link href="/vender">Vender Boletos</Link></li>
            <li><Link href="/perfil">Mi Cuenta</Link></li>
            <li><Link href="/soporte">Soporte y Ayuda</Link></li>
            <li><Link href="/terminos">Términos de Servicio</Link></li>
          </ul>
        </div>

        <div className={styles.contactCol}>
          <h3>Contacto</h3>
          <ul>
            <li>
              <Mail size={16} />
              <span>soporte@reventa.com.mx</span>
            </li>
            <li>
              <Phone size={16} />
              <span>+52 (55) 5555-5555</span>
            </li>
            <li>
              <MapPin size={16} />
              <span>Ciudad de México, México</span>
            </li>
          </ul>
          <div className={styles.socials}>
            <a href="#" className={styles.socialLink}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>
            <a href="#" className={styles.socialLink}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
            </a>
            <a href="#" className={styles.socialLink}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
          </div>
        </div>
      </div>
      
      <div className={styles.bottomBar}>
        <div className={styles.bottomContainer}>
          <p>&copy; {new Date().getFullYear()} REVENTA. Todos los derechos reservados.</p>
          <div className={styles.bottomLinks}>
            <a href="#">Privacidad</a>
            <a href="#">Cookies</a>
            <a href="#">Aviso Legal</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
