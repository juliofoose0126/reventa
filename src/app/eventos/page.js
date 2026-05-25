'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { fallbackEvents } from '@/data/events';
import EventCard from '@/components/EventCard';
import { Music, Trophy, Theater, Disc, Compass } from 'lucide-react';
import styles from './page.module.css';

export default function EventosPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [searchFilter, setSearchFilter] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .order('fecha', { ascending: true });

        if (error || !data || data.length === 0) {
          setEvents(fallbackEvents);
        } else {
          setEvents(data);
        }
      } catch (err) {
        console.error('Fetch error, using fallback:', err);
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

  const filteredEvents = events.filter(event => {
    const matchesCategory = selectedCategory === 'todos' || event.categoria === selectedCategory;
    const matchesSearch = event.titulo.toLowerCase().includes(searchFilter.toLowerCase()) ||
                          event.lugar.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="grid-container">
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <Compass size={24} className={styles.icon} />
          <h1>Explorar Eventos</h1>
        </div>
        <p className={styles.subtitle}>Encuentra boletos para los mejores espectáculos en vivo en todo el país</p>
      </div>

      <div className={styles.filterSection}>
        <div className={styles.categoryTabs}>
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`${styles.categoryTab} glass ${selectedCategory === cat.id ? styles.activeTab : ''}`}
              >
                <Icon size={16} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        <div className={styles.searchFilter}>
          <input
            type="text"
            placeholder="Filtrar por nombre o lugar..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="glass"
          />
        </div>
      </div>

      <div className={styles.eventsGrid}>
        {loading ? (
          Array(6).fill(0).map((_, idx) => <div key={idx} className={`${styles.skeletonCard} glass`}></div>)
        ) : filteredEvents.length > 0 ? (
          filteredEvents.map(event => (
            <EventCard key={event.id} event={event} />
          ))
        ) : (
          <div className={`${styles.noEvents} glass`}>
            <h3>No encontramos eventos</h3>
            <p>Intenta cambiar los filtros de categoría o búsqueda.</p>
          </div>
        )}
      </div>
    </div>
  );
}
