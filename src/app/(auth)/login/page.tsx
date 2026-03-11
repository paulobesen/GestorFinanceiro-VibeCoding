import LoginForm from '@/components/auth/LoginForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
            Gestor Financeiro
          </h1>
          <p className="text-slate-400 mt-2">Gerencie suas finanças pessoais</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
