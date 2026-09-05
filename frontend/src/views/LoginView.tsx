import { zodResolver } from '@hookform/resolvers/zod'
import { Dumbbell, Lock, Mail } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Navigate } from 'react-router-dom'
import { z } from 'zod'
import { Button, Input } from '@/components/ui'
import { haySesion, useLogin } from '@/hooks/useAuth'

const FOTO_GIMNASIO =
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80'

const esquemaLogin = z.object({
  email: z.string().min(1, 'Ingresá tu email.').email('Ingresá un email válido.'),
  password: z.string().min(1, 'Ingresá tu contraseña.'),
})

type FormularioLogin = z.infer<typeof esquemaLogin>

export const LoginView = () => {
  const login = useLogin()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormularioLogin>({
    resolver: zodResolver(esquemaLogin),
    defaultValues: { email: '', password: '' },
  })

  if (haySesion()) return <Navigate to="/panel" replace />

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center bg-fondo px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2">
            <Dumbbell className="size-6 text-marca" aria-hidden="true" />
            <span className="font-titulo text-xl font-semibold">GymStats</span>
          </div>

          <h1 className="text-2xl font-semibold">Entrá a tu panel</h1>
          <p className="mt-1 text-sm text-texto-suave">
            Gestioná socios, vencimientos y asistencias.
          </p>

          <form
            className="mt-8 space-y-4"
            onSubmit={handleSubmit((datos) => login.mutate(datos))}
            noValidate
          >
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="tu@gimnasio.com"
                icono={<Mail className="size-4" />}
                error={errors.email?.message}
                {...register('email')}
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-medium">
                Contraseña
              </label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                icono={<Lock className="size-4" />}
                error={errors.password?.message}
                {...register('password')}
              />
            </div>

            <Button type="submit" size="lg" className="w-full" cargando={login.isPending}>
              Iniciar sesión
            </Button>
          </form>
        </div>
      </div>

      <div className="relative hidden bg-marca lg:block">
        <img
          src={FOTO_GIMNASIO}
          alt=""
          className="size-full object-cover opacity-80"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-texto/50" />
        <div className="absolute inset-0 flex flex-col justify-end p-12">
          <h2 className="font-titulo text-4xl font-bold text-marca-contraste">GymStats</h2>
          <p className="mt-2 max-w-md text-marca-contraste/80">
            Todo tu gimnasio en una pantalla: quién entrenó hoy, a quién se le vence el plan y
            cuántos socios tenés al día.
          </p>
        </div>
      </div>
    </div>
  )
}
