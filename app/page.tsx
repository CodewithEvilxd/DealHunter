import dynamic from 'next/dynamic'
import Hero from "@/components/hero"

const Testimonials = dynamic(() => import('@/components/testimonials'), {
  loading: () => <div className="py-16 bg-theme-surface/50 animate-pulse">
    <div className="container mx-auto px-6">
      <div className="text-center mb-12">
        <div className="h-8 bg-theme-secondary/50 rounded w-64 mx-auto mb-4"></div>
        <div className="h-4 bg-theme-secondary/50 rounded w-96 mx-auto"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-theme-background border border-theme-secondary/20 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-theme-secondary/50 rounded-full mr-4"></div>
              <div>
                <div className="h-4 bg-theme-secondary/50 rounded w-24 mb-2"></div>
                <div className="h-3 bg-theme-secondary/50 rounded w-16"></div>
              </div>
            </div>
            <div className="h-16 bg-theme-secondary/50 rounded mb-4"></div>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((j) => (
                <div key={j} className="w-4 h-4 bg-theme-secondary/50 rounded"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
})

export default function Home() {
  return (
    <main className="bg-theme-background">
      <Hero />
      <Testimonials />
    </main>
  )
}
