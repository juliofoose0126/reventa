'use client';
import { useEffect, useState, use } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { User, Ticket, ShoppingBag, Calendar, MapPin, Loader2, Sparkles } from 'lucide-react';
import styles from './page.module.css';

export default function PerfilPage({ searchParams }) {
  // Unwrap searchParams using React.use() to comply with Next.js 14/15 standards
  const resolvedSearchParams = use(searchParams);
  const activeTabQuery = resolvedSearchParams?.tab || 'compras';

  const { user, profile, loading: authLoading } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState(activeTabQuery);
  const [compras, setCompras] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (activeTabQuery) {
      setActiveTab(activeTabQuery);
    }
  }, [activeTabQuery]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchUserData = async () => {
      setDataLoading(true);
      try {
        // 1. Fetch Compras (Transactions)
        const { data: dbCompras, error: comprasError } = await supabase
          .from('transactions')
          .select('*, ticket:tickets(*, event:events(*))')
          .eq('comprador_id', user.id)
          .order('creado_en', { ascending: false });

        if (!comprasError && dbCompras) {
          setCompras(dbCompras);
        }

        // 2. Fetch Ventas (Tickets posted by user)
        const { data: dbVentas, error: ventasError } = await supabase
          .from('tickets')
          .select('*, event:events(*)')
          .eq('vendedor_id', user.id)
          .order('creado_en', { ascending: false });

        if (!ventasError && dbVentas) {
          setVentas(dbVentas);
        }

      } catch (err) {
        console.error('Error fetching user dashboard data:', err);
      } finally {
        setDataLoading(false);
      }
    };

    fetchUserData();
  }, [user, authLoading, router]);

  if (authLoading || (user && dataLoading)) {
    return (
      <div className={styles.spinnerWrapper}>
        <Loader2 className={styles.spinner} size={48} />
        <p>Cargando tu cuenta...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="grid-container">
      <div className={styles.container}>
        {/* User Card Header */}
        <div className={`${styles.profileCard} glass`}>
          <div className={styles.avatarWrapper}>
            <div className={styles.avatar}>
              <User size={36} />
            </div>
            <div>
              <h2>{profile?.nombre || 'Usuario'}</h2>
              <p>{profile?.email}</p>
            </div>
          </div>
          <div className={styles.stats}>
            <div className={styles.statItem}>
              <span className={styles.statNum}>{compras.length}</span>
              <span className={styles.statLabel}>Compras</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNum}>{ventas.length}</span>
              <span className={styles.statLabel}>Ventas</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className={styles.tabsWrapper}>
          <button 
            className={`${styles.tabBtn} glass ${activeTab === 'compras' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('compras')}
          >
            <ShoppingBag size={18} />
            <span>Mis Compras</span>
          </button>
          <button 
            className={`${styles.tabBtn} glass ${activeTab === 'ventas' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('ventas')}
          >
            <Ticket size={18} />
            <span>Mis Boletos en Venta</span>
          </button>
        </div>

        {/* Tabs Content */}
        <div className={styles.contentSection}>
          {activeTab === 'compras' ? (
            <div className={styles.list}>
              {compras.length > 0 ? (
                compras.map((compra) => {
                  const event = compra.ticket?.event;
                  if (!event) return null;
                  return (
                    <div key={compra.id} className={`${styles.itemCard} glass`}>
                      <div className={styles.itemInfo}>
                        <span className="badge badge-conciertos">{event.categoria}</span>
                        <h3>{event.titulo}</h3>
                        <div className={styles.metaRow}>
                          <div className={styles.metaItem}>
                            <Calendar size={14} />
                            <span>{new Date(event.fecha).toLocaleDateString('es-MX')}</span>
                          </div>
                          <div className={styles.metaItem}>
                            <MapPin size={14} />
                            <span>{event.lugar}</span>
                          </div>
                        </div>
                        <div className={styles.ticketDetails}>
                          <span>Sección: <strong>{compra.ticket.seccion}</strong></span>
                          {compra.ticket.fila !== 'N/A' && <span>Fila: <strong>{compra.ticket.fila}</strong></span>}
                          <span>Cantidad: <strong>{compra.cantidad}</strong></span>
                        </div>
                      </div>
                      <div className={styles.itemSummary}>
                        <span className={styles.price}>${compra.total.toLocaleString('es-MX')}</span>
                        <span className={styles.dateLabel}>Comprado el {new Date(compra.creado_en).toLocaleDateString('es-MX')}</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className={`${styles.emptyState} glass`}>
                  <ShoppingBag size={32} className={styles.emptyIcon} />
                  <h3>Aún no has comprado boletos</h3>
                  <p>Explora los eventos disponibles y asegura tu lugar en los mejores espectáculos.</p>
                  <button onClick={() => router.push('/eventos')} className="btn btn-primary">
                    Explorar Eventos
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.list}>
              {ventas.length > 0 ? (
                ventas.map((venta) => {
                  const event = venta.event;
                  if (!event) return null;
                  return (
                    <div key={venta.id} className={`${styles.itemCard} glass`}>
                      <div className={styles.itemInfo}>
                        <span className={`badge badge-deportes`}>{venta.estado}</span>
                        <h3>{event.titulo}</h3>
                        <div className={styles.metaRow}>
                          <div className={styles.metaItem}>
                            <Calendar size={14} />
                            <span>{new Date(event.fecha).toLocaleDateString('es-MX')}</span>
                          </div>
                          <div className={styles.metaItem}>
                            <MapPin size={14} />
                            <span>{event.lugar}</span>
                          </div>
                        </div>
                        <div className={styles.ticketDetails}>
                          <span>Sección: <strong>{venta.seccion}</strong></span>
                          {venta.fila !== 'N/A' && <span>Fila: <strong>{venta.fila}</strong></span>}
                          <span>Cantidad: <strong>{venta.cantidad}</strong></span>
                        </div>
                      </div>
                      <div className={styles.itemSummary}>
                        <span className={styles.price}>${venta.precio.toLocaleString('es-MX')} c/u</span>
                        <span className={styles.dateLabel}>Publicado el {new Date(venta.creado_en).toLocaleDateString('es-MX')}</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className={`${styles.emptyState} glass`}>
                  <Ticket size={32} className={styles.emptyIcon} />
                  <h3>No tienes boletos a la venta</h3>
                  <p>¿Tienes entradas que no vayas a usar? Publícalas y recupera tu dinero de forma segura.</p>
                  <button onClick={() => router.push('/vender')} className="btn btn-secondary">
                    Vender Boletos
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
