'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Compass, Shield, Sparkles } from 'lucide-react';
import styles from './Hero.module.css';

export default function Hero() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/buscar?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <section className={styles.hero}>
      {/* Decorative background glows */}
      <div className={styles.glow1}></div>
      <div className={styles.glow2}></div>
      <div className={styles.gridOverlay}></div>

      <div className={styles.content}>
        <div className={`${styles.badge} glass animate-fade-in`}>
          <Sparkles size={14} className={styles.badgeIcon} />
          <span>La Revolución de la Reventa de Boletos</span>
        </div>

        <h1 className={styles.title}>
          La forma más <span className={styles.gradientText}>creativa</span> y <span className={styles.glowText}>segura</span> de conseguir tus boletos
        </h1>
        
        <p className={styles.subtitle}>
          Compra con garantía del 100% o vende los boletos que te sobren en minutos. Sin complicaciones, con tecnología de punta.
        </p>

        <form onSubmit={handleSearch} className={`${styles.searchBox} glass`}>
          <div className={styles.inputWrapper}>
            <Search className={styles.searchIcon} size={22} />
            <input
              type="text"
              placeholder="¿Qué concierto, partido o evento estás buscando?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Buscar Evento
          </button>
        </form>

        <div className={styles.features}>
          <div className={styles.featureItem}>
            <Shield size={18} />
            <span>Garantía del 100%</span>
          </div>
          <div className={styles.featureItem}>
            <Compass size={18} />
            <span>+10,000 Eventos</span>
          </div>
        </div>
      </div>
    </section>
  );
}
