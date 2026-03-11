import type { Metadata } from 'next'
import LandingPageClient from './LandingPageClient'

export const metadata: Metadata = {
  title: 'Gestor Financeiro – Controle suas finanças do futuro',
  description:
    'Plataforma inteligente para gerenciar suas finanças pessoais. Dashboard interativo, relatórios detalhados, lançamentos recorrentes e muito mais. Comece gratuitamente!',
}

export default function LandingPage() {
  return <LandingPageClient />
}
