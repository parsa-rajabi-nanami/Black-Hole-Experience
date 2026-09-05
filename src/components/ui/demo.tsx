import { TestimonialCarousel } from '@/components/ui/testimonial'

const TESTIMONIAL_DATA = [
  {
    id: 1,
    name: 'John Doe',
    avatar: 'https://cdn.21st.dev/assets/mirror/b1/b1f6209ae26207ebe11c243a659f0e5e15a0a48232261ecf3c05211a40af2225.jpg',
    description: 'Amazing experience working with this team! The results exceeded my expectations.',
  },
  {
    id: 2,
    name: 'Jane Smith',
    avatar: 'https://cdn.21st.dev/assets/mirror/7c/7c408d5bb79392ba04b0b8a6294b4eee47a16ec377d3dae0c3108e918864bfad.jpg',
    description: 'Highly recommended! Great service and professional approach.',
  },
  {
    id: 3,
    name: 'Mike Johnson',
    avatar: 'https://cdn.21st.dev/assets/mirror/71/716cfb40836039a4e9e34d89320b6398ba7871ea7882e32b7397029586f6dda7.jpg',
    description: 'Exceptional quality and professionalism. Would definitely work with them again.',
  },
]

export function TestimonialCarouselDemo() {
  return (
    <TestimonialCarousel
      testimonials={TESTIMONIAL_DATA}
      className="mx-auto max-w-2xl"
    />
  )
}
