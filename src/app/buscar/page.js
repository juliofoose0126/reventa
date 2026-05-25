'use client';
import { useEffect, useState, use } from 'react';
import { supabase } from '@/lib/supabase';
import { fallbackEvents } from '@/data/events';
import EventCard from '@/components/EventCard';
import { Search } from 'lucide-react';
import styles from './page.module.css';

export default function BuscarPage({ searchParams }) {
  // Unwrap searchParams using React.use() to comply with Next.js 14/15 standards
  const resolvedSearchParams = use(searchParams);
  const query = resolvedSearchParams?.q || '';
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const performSearch = async () => {
      setLoading(true);
      if (!query.trim()) {
        setResults([]);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .ilike('titulo', `%${query}%`)
          .order('fecha', { ascending: true });

        if (error || !data || data.length === 0) {
          // Fallback search filter
          const matched = fallbackEvents.filter(e => 
            e.titulo.toLowerCase().includes(query.toLowerCase()) || 
            e.descripcion.toLowerCase().includes(query.toLowerCase()) ||
            e.lugar.toLowerCase().includes(query.toLowerCase())
          );
          setResults(matched);
        } else {
          setResults(data);
        }
      } catch (err) {
        console.error('Search error, using fallback:', err);
        const matched = fallbackEvents.filter(e => 
          e.titulo.toLowerCase().includes(query.toLowerCase()) || 
          e.descripcion.toLowerCase().includes(query.toLowerCase()) ||
          e.lugar.toLowerCase().includes(query.toLowerCase())
        );
        setResults(matched);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [query]);

  return (
    <div className="grid-container">
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <Search size={24} className={styles.icon} />
          <h1>Resultados para: &ldquo;{query}&rdquo;</h1>
        </div>
        <p className={styles.subtitle}>
          Encontramos {results.length} evento{results.length === 1 ? '' : 's'} coincidente{results.length === 1 ? '' : 's'}
        </p>
      </div>

      <div className={styles.resultsGrid}>
        {loading ? (
          Array(3).fill(0).map((_, idx) => <div key={idx} className={`${styles.skeletonCard} glass`}></div>)
        ) : results.length > 0 ? (
          results.map(event => (
            <EventCard key={event.id} event={event} />
          ))
        ) : (
          <div className={`${styles.noResults} glass`}>
            <h3>No encontramos resultados</h3>
            <p>Intenta buscar otra palabra clave, artista o deporte.</p>
          </div>
        )}
      </div>
    </div>
  );
}
