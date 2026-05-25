'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { fallbackEvents } from '@/data/events';
import Hero from '@/components/Hero';
import EventCard from '@/components/EventCard';
import { Music, Trophy, Theater, Disc, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('todos');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .order('fecha', { ascending: true });

        if (error || !data || data.length === 0) {
          // If Supabase fails or is empty, use fallback
          setEvents(fallbackEvents);
        } else {
          setEvents(data);
        }
      } catch (err) {
        console.error('Supabase query error, using fallback:', err);
        setEvents(fallbackEvents);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const categories = [
    { id: 'todos', label: 'Todos', icon: Disc },
    { id: 'conciertos', label: 'Conciertos', icon: Music },
    { id: 'deportes', label: 'Deportes', icon: Trophy },
    { id: 'teatro', label: 'Teatro', icon: Theater },
    { id: 'festivales', label: 'Festivales', icon: Music },
  ];

  const filteredEvents = selectedCategory === 'todos' 
    ? events 
    : events.filter(e => e.categoria === selectedCategory);

  const featuredEvents = events.filter(e => e.destacado);

  return (
    <div className={styles.container}>
      <Hero />

      {/* Categories Bar */}
      <section className={styles.categoriesSection}>
        <div className="grid-container">
          <h2 className={styles.sectionTitle}>Explorar por Categoría</h2>
          <div className={styles.categoryTabs}>
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`${styles.categoryTab} glass ${selectedCategory === cat.id ? styles.activeTab : ''}`}
                >
                  <Icon size={20} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Events */}
      {featuredEvents.length > 0 && selectedCategory === 'todos' && (
        <section className={styles.section}>
          <div className="grid-container">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Eventos Destacados</h2>
              <span className={styles.glowIndicator}>En Tendencia</span>
            </div>
            
            <div className={styles.grid}>
              {loading ? (
                Array(3).fill(0).map((_, idx) => <div key={idx} className={`${styles.skeletonCard} glass`}></div>)
              ) : (
                featuredEvents.slice(0, 3).map(event => (
                  <EventCard key={event.id} event={event} />
                ))
              )}
            </div>
          </div>
        </section>
      )}

      {/* All / Filtered Events */}
      <section className={styles.section}>
        <div className="grid-container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              {selectedCategory === 'todos' ? 'Próximos Eventos' : `Eventos de ${selectedCategory}`}
            </h2>
            <Link href="/eventos" className={styles.seeAll}>
              <span>Ver todos</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className={styles.grid}>
            {loading ? (
              Array(6).fill(0).map((_, idx) => <div key={idx} className={`${styles.skeletonCard} glass`}></div>)
            ) : filteredEvents.length > 0 ? (
              filteredEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))
            ) : (
              <div className={`${styles.noEvents} glass`}>
                <p>No se encontraron eventos en esta categoría.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Seller Call to Action */}
      <section className={styles.ctaSection}>
        <div className="grid-container">
          <div className={`${styles.ctaBox} glass`}>
            <div className={styles.ctaGlow}></div>
            <div className={styles.ctaContent}>
              <h2>¿Tienes boletos que no vas a usar?</h2>
              <p>
                Publícalos en REVENTA gratis. Es seguro, rápido y tú decides el precio. Únete a miles de fans que venden de forma segura.
              </p>
              <Link href="/vender" className="btn btn-secondary">
                Poner Boletos a la Venta
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
