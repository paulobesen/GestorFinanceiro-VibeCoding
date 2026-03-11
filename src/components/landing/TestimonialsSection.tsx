'use client'

import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Mariana Silva',
    role: 'Designer Freelancer',
    avatar: 'MS',
    content:
      'Finalmente encontrei uma ferramenta que realmente me ajuda a entender para onde vai meu dinheiro. O dashboard é incrível e os relatórios me deram clareza total sobre minhas finanças.',
    rating: 5,
    color: 'cyan',
    gradientFrom: 'from-cyan-400',
    gradientTo: 'to-blue-500',
  },
  {
    name: 'Rafael Santos',
    role: 'Desenvolvedor de Software',
    avatar: 'RS',
    content:
      'A funcionalidade de lançamentos recorrentes mudou minha vida. Não preciso mais lembrar de registrar contas fixas todo mês. A interface é limpa e moderna.',
    rating: 5,
    color: 'violet',
    gradientFrom: 'from-violet-400',
    gradientTo: 'to-purple-500',
  },
  {
    name: 'Ana Costa',
    role: 'Empreendedora',
    avatar: 'AC',
    content:
      'Uso o Gestor Financeiro tanto para minhas finanças pessoais quanto para ter uma visão do meu pequeno negócio. Os gráficos de evolução mensal são fantásticos!',
    rating: 5,
    color: 'emerald',
    gradientFrom: 'from-emerald-400',
    gradientTo: 'to-green-500',
  },
  {
    name: 'Carlos Oliveira',
    role: 'Contador',
    avatar: 'CO',
    content:
      'Como contador, eu sou exigente com ferramentas financeiras. O Gestor surpreendeu pela qualidade dos relatórios e facilidade de uso. Recomendo para todos os meus clientes.',
    rating: 5,
    color: 'blue',
    gradientFrom: 'from-blue-400',
    gradientTo: 'to-indigo-500',
  },
  {
    name: 'Juliana Mendes',
    role: 'Professora',
    avatar: 'JM',
    content:
      'Sempre tive dificuldade em controlar minhas finanças. Com o Gestor, tudo ficou mais simples. Já economizei mais de R$ 500 no primeiro mês usando as classificações!',
    rating: 5,
    color: 'amber',
    gradientFrom: 'from-amber-400',
    gradientTo: 'to-orange-500',
  },
  {
    name: 'Pedro Almeida',
    role: 'Engenheiro',
    avatar: 'PA',
    content:
      'O fechamento mensal é genial! Posso revisar e fechar cada mês com tranquilidade, sabendo que meus dados estão protegidos e organizados. Melhor investimento que fiz!',
    rating: 5,
    color: 'rose',
    gradientFrom: 'from-rose-400',
    gradientTo: 'to-pink-500',
  },
]

export default function TestimonialsSection() {
  return (
    <section id="depoimentos" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-[128px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
            <Star className="w-4 h-4 text-amber-400" />
            <span className="text-amber-300 text-sm font-medium">Depoimentos</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-6">
            Quem usa,{' '}
            <span className="bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">
              recomenda
            </span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Milhares de pessoas já transformaram sua relação com o dinheiro usando o Gestor
            Financeiro.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group relative bg-slate-900/60 backdrop-blur-sm border border-slate-700/30 rounded-2xl p-6 sm:p-8 hover:border-slate-600/50 transition-all duration-500 hover:-translate-y-1"
            >
              {/* Quote Icon */}
              <Quote className="w-8 h-8 text-slate-700 mb-4" />

              {/* Content */}
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6">
                &ldquo;{testimonial.content}&rdquo;
              </p>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full bg-gradient-to-br ${testimonial.gradientFrom} ${testimonial.gradientTo} flex items-center justify-center text-white text-xs font-bold`}
                >
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{testimonial.name}</p>
                  <p className="text-xs text-slate-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
