import LoginForm from '@/components/auth/LoginForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestor Financeiro</h1>
          <p className="text-gray-600 mt-2">Gerencie suas finanças pessoais</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
