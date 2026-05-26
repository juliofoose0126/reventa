'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Search, User, LogOut, PlusCircle, Ticket, Compass } from 'lucide-react';
import styles from './Header.module.css';

export default function Header() {
  const { user, profile, signOut } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/buscar?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className={`${styles.header} glass`}>
      <div className={styles.container}>
        <div className={styles.leftSection}>
          <Link href="/" className={styles.logo}>
            <Ticket size={24} className={styles.logoIcon} />
            BOLETOS<span>-YA</span>
          </Link>
          <nav className={styles.nav}>
            <Link href="/eventos" className={styles.navLink}>
              <Compass size={18} />
              <span>Explorar</span>
            </Link>
            <Link href="/vender" className={styles.navLink}>
              <PlusCircle size={18} />
              <span>Vender</span>
            </Link>
          </nav>
        </div>

        <form onSubmit={handleSearch} className={styles.searchBar}>
          <input
            type="text"
            placeholder="Busca artistas, eventos o ciudades..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">
            <Search size={18} />
          </button>
        </form>

        <div className={styles.rightSection}>
          {user ? (
            <div className={styles.profileMenu}>
              <button 
                className={`${styles.userBtn} glass`}
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <User size={18} />
                <span className={styles.userName}>{profile?.nombre || 'Usuario'}</span>
              </button>
              
              {menuOpen && (
                <div className={`${styles.dropdown} glass`}>
                  <Link 
                    href="/perfil" 
                    className={styles.dropdownItem}
                    onClick={() => setMenuOpen(false)}
                  >
                    <User size={16} />
                    <span>Mi Perfil</span>
                  </Link>
                  <Link 
                    href="/perfil?tab=ventas" 
                    className={styles.dropdownItem}
                    onClick={() => setMenuOpen(false)}
                  >
                    <Ticket size={16} />
                    <span>Mis Ventas</span>
                  </Link>
                  <button 
                    onClick={() => {
                      signOut();
                      setMenuOpen(false);
                      router.push('/');
                    }}
                    className={`${styles.dropdownItem} ${styles.logout}`}
                  >
                    <LogOut size={16} />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.authButtons}>
              <Link href="/login" className={styles.loginBtn}>
                Iniciar Sesión
              </Link>
              <Link href="/registro" className="btn btn-primary">
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
