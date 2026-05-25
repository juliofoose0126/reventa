-- REVENTA DATABASE SCHEMA
-- Copia y pega este script en el SQL Editor de tu proyecto de Supabase para configurar la base de datos.

-- 1. Crear tabla de perfiles (enlazada con auth.users de Supabase)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    nombre TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    rol TEXT DEFAULT 'usuario' CHECK (rol IN ('usuario', 'administrador')),
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar Row Level Security (RLS) en profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Perfiles públicos: lectura permitida para todos"
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Perfiles privados: edición solo por el dueño"
ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Crear tabla de eventos
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titulo TEXT NOT NULL,
    descripcion TEXT,
    categoria TEXT NOT NULL CHECK (categoria IN ('conciertos', 'deportes', 'teatro', 'festivales')),
    fecha TIMESTAMP WITH TIME ZONE NOT NULL,
    lugar TEXT NOT NULL,
    imagen_url TEXT,
    destacado BOOLEAN DEFAULT false,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS en events
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Eventos: lectura permitida para todos"
ON public.events FOR SELECT USING (true);

CREATE POLICY "Eventos: escritura solo administradores"
ON public.events FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() AND profiles.rol = 'administrador'
    )
);

-- 3. Crear tabla de boletos (tickets a la venta)
CREATE TABLE IF NOT EXISTS public.tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    vendedor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    precio NUMERIC(10, 2) NOT NULL CHECK (precio > 0),
    seccion TEXT NOT NULL,
    fila TEXT,
    cantidad INTEGER NOT NULL CHECK (cantidad > 0),
    estado TEXT DEFAULT 'disponible' CHECK (estado IN ('disponible', 'reservado', 'vendido')),
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS en tickets
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Boletos: lectura permitida para todos"
ON public.tickets FOR SELECT USING (true);

CREATE POLICY "Boletos: inserción solo usuarios autenticados"
ON public.tickets FOR INSERT WITH CHECK (auth.uid() = vendedor_id);

CREATE POLICY "Boletos: actualización solo el vendedor o admin"
ON public.tickets FOR UPDATE USING (
    auth.uid() = vendedor_id OR 
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() AND profiles.rol = 'administrador'
    )
);

-- 4. Crear tabla de transacciones (compras)
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID NOT NULL REFERENCES public.tickets(id) ON DELETE RESTRICT,
    comprador_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    cantidad INTEGER NOT NULL CHECK (cantidad > 0),
    total NUMERIC(10, 2) NOT NULL CHECK (total > 0),
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS en transacciones
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Transacciones: lectura solo comprador, vendedor o admin"
ON public.transactions FOR SELECT USING (
    auth.uid() = comprador_id OR 
    EXISTS (
        SELECT 1 FROM public.tickets 
        WHERE tickets.id = ticket_id AND tickets.vendedor_id = auth.uid()
    ) OR
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() AND profiles.rol = 'administrador'
    )
);

CREATE POLICY "Transacciones: inserción solo usuarios autenticados"
ON public.transactions FOR INSERT WITH CHECK (auth.uid() = comprador_id);

-- 5. Trigger para crear perfil automáticamente al registrarse en Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, nombre, email, rol)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'nombre', split_part(new.email, '@', 1)),
        new.email,
        'usuario'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. Insertar algunos eventos populares en México (Semilla / Mock Data)
INSERT INTO public.events (titulo, descripcion, categoria, fecha, lugar, imagen_url, destacado) VALUES
(
    'Coldplay - Music of the Spheres Tour',
    'La banda británica regresa a México con su aclamado tour mundial sustentable, lleno de luces, color y sus más grandes éxitos.',
    'conciertos',
    NOW() + INTERVAL '45 days',
    'Foro Sol, CDMX',
    'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=600&auto=format&fit=crop',
    true
),
(
    'Gran Premio de México de Fórmula 1',
    'Vive la adrenalina del Gran Circo en el Autódromo Hermanos Rodríguez. El evento deportivo más emocionante del año en la CDMX.',
    'deportes',
    NOW() + INTERVAL '120 days',
    'Autódromo Hermanos Rodríguez, CDMX',
    'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=600&auto=format&fit=crop',
    true
),
(
    'El Rey León - El Musical',
    'La espectacular producción de Broadway en México. Una experiencia teatral inolvidable con música de Elton John y maravillosas marionetas.',
    'teatro',
    NOW() + INTERVAL '15 days',
    'Teatro Telcel, CDMX',
    'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?q=80&w=600&auto=format&fit=crop',
    false
),
(
    'Corona Capital 2026',
    'El festival de música internacional más importante de México. Tres días de bandas increíbles y el mejor ambiente de festival.',
    'festivales',
    NOW() + INTERVAL '180 days',
    'Curva 4 del Foro Sol, CDMX',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600&auto=format&fit=crop',
    true
),
(
    'Clásico Nacional: América vs Guadalajara',
    'El clásico del fútbol mexicano. Dos gigantes frente a frente en el Coloso de Santa Úrsula por el orgullo y los tres puntos.',
    'deportes',
    NOW() + INTERVAL '30 days',
    'Estadio Azteca, CDMX',
    'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=600&auto=format&fit=crop',
    false
),
(
    'Luis Miguel Tour 2026',
    'El Sol de México brilla de nuevo con una espectacular serie de conciertos interpretando sus icónicos boleros, mariachi y pop.',
    'conciertos',
    NOW() + INTERVAL '60 days',
    'Arena Ciudad de México, CDMX',
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=600&auto=format&fit=crop',
    true
);
