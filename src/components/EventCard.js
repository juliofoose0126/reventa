import Link from 'next/link';
import { Calendar, MapPin, Ticket } from 'lucide-react';
import styles from './EventCard.module.css';

export default function EventCard({ event }) {
  const { id, titulo, descripcion, categoria, fecha, lugar, imagen_url, destacado } = event;

  // Format date to: 15 Oct 2026
  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className={`${styles.card} glass ${destacado ? styles.destacado : ''}`}>
      <div className={styles.imageWrapper}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imagen_url || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=600&auto=format&fit=crop'} alt={titulo} className={styles.image} />
        <span className={`badge badge-${categoria} ${styles.badge}`}>
          {categoria}
        </span>
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{titulo}</h3>
        <p className={styles.description}>{descripcion}</p>

        <div className={styles.meta}>
          <div className={styles.metaItem}>
            <Calendar size={16} />
            <span>{formatDate(fecha)}</span>
          </div>
          <div className={styles.metaItem}>
            <MapPin size={16} />
            <span>{lugar}</span>
          </div>
        </div>

        <Link href={`/evento/${id}`} className={`btn btn-primary ${styles.btn}`}>
          <Ticket size={16} />
          <span>Ver Boletos</span>
        </Link>
      </div>
    </div>
  );
}
