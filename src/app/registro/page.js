'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { User, Mail, Lock, AlertCircle, Loader2, CheckCircle } from 'lucide-react';
import styles from './page.module.css';

export default function RegistroPage() {
  const { signUp } = useAuth();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (password !== confirmPassword) {
      return setError('Las contraseñas no coinciden.');
    }
    
    if (password.length < 6) {
      return setError('La contraseña debe tener al menos 6 caracteres.');
    }

    setLoading(true);

    try {
      await signUp(email, password, nombre);
      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error al registrar la cuenta. Intenta con otro correo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.glow}></div>
      <div className={`${styles.card} glass`}>
        <div className={styles.header}>
          <Link href="/" className={styles.logo}>
            RE<span>VENTA</span>
          </Link>
          <h2>Crea tu cuenta</h2>
          <p>Únete hoy y empieza a comprar y vender boletos</p>
        </div>

        {error && (
          <div className={styles.errorBox}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className={styles.successBox}>
            <CheckCircle size={18} />
            <span>¡Registro exitoso! Redirigiendo al inicio de sesión...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="nombre">Nombre Completo</label>
            <div className={styles.inputWrapper}>
              <User size={18} className={styles.inputIcon} />
              <input
                id="nombre"
                type="text"
                placeholder="Juan Pérez"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                disabled={loading || success}
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="email">Correo Electrónico</label>
            <div className={styles.inputWrapper}>
              <Mail size={18} className={styles.inputIcon} />
              <input
                id="email"
                type="email"
                placeholder="ejemplo@correo.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading || success}
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Contraseña</label>
            <div className={styles.inputWrapper}>
              <Lock size={18} className={styles.inputIcon} />
              <input
                id="password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading || success}
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="confirmPassword">Confirmar Contraseña</label>
            <div className={styles.inputWrapper}>
              <Lock size={18} className={styles.inputIcon} />
              <input
                id="confirmPassword"
                type="password"
                placeholder="Repite tu contraseña"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading || success}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading || success}>
            {loading ? (
              <>
                <Loader2 size={18} className={styles.spinner} />
                <span>Registrando...</span>
              </>
            ) : (
              <span>Registrarse</span>
            )}
          </button>
        </form>

        <div className={styles.footer}>
          <span>¿Ya tienes una cuenta?</span>
          <Link href="/login">Inicia sesión</Link>
        </div>
      </div>
    </div>
  );
}
