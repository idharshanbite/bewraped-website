// This is the only file you need to edit for most future menu, price, and contact updates.

export const siteConfig = {
  brand: 'Bewraped',
  announcement: 'Freshly made bubble waffles and small-batch brews, made for your good moments.',
  email: 'bewraped.info@gmail.com',
  phone: 'WhatsApp details coming soon',
  instagram: 'Instagram coming soon',
  location: 'Location details coming soon',
  socialLinks: {
    instagram: 'https://www.instagram.com/bewrapedlk?igsh=MWg1dDVoYng5YWpjYw==',
    tiktok: 'https://www.tiktok.com/@bewraped.lk?_r=1&_t=ZS-98kChobDDEG',
    linkedin: 'https://www.linkedin.com/company/bewrappedsrilanka/',
    whatsapp: 'https://whatsapp.com/channel/0029Vb8MrVb0LKZMVSLKrd3G',
  },
  orderUrl: '#/contact',
  contactFormEndpoint: 'https://script.google.com/macros/s/AKfycbw1utTv1mj-bbqUqgSR6T85QvU1C59qn-BAjWfhbFRjxT8Ze0dOD0QrsAMEBoWS8GM/exec',
}

export const heroSlides = [
  {
    eyebrow: 'Made for the moment',
    title: 'Waffles worth unwrapping.',
    description: 'Golden bubble waffles, made fresh and packed with the toppings you love.',
    cta: 'Explore signature waffles',
    target: '#/menu',
    position: 'right center',
  },
  {
    eyebrow: 'The Bewraped way',
    title: 'A little cloud in every cup.',
    description: 'Our Cloud Brew is smooth, creamy, and ready to slow down your day.',
    cta: 'See coffee menu',
    target: '#/menu',
    position: '80% center',
  },
  {
    eyebrow: 'Cold, bold, beautiful',
    title: 'Cold brew, your way.',
    description: 'Deep coffee flavour, ice-cold refreshment, and your favourite waffle on the side.',
    cta: 'Choose a drink',
    target: '#/menu',
    position: '75% center',
  },
  {
    eyebrow: 'Share something sweet',
    title: 'Fresh flavours. Zero fuss.',
    description: 'Pick your base, choose your toppings, and let us wrap up something special.',
    cta: 'View the menu',
    target: '#/menu',
    position: 'right 35%',
  },
  {
    eyebrow: 'Your new comfort order',
    title: 'Sweet, warm, Bewraped.',
    description: 'Whether it is a quick treat or a coffee catch-up, there is always room for one more bite.',
    cta: 'Find us',
    target: '#/contact',
    position: '70% center',
  },
]

export const categories = [
  { icon: 'waffle', title: 'Bubble Waffles', copy: 'Golden outside, soft inside.', target: '#/menu' },
  { icon: 'cloud', title: 'Cloud Brew', copy: 'Creamy, airy coffee comfort.', target: '#/menu' },
  { icon: 'cold', title: 'Cold Brew', copy: 'Bold coffee, served chilled.', target: '#/menu' },
]

export const reasons = [
  { icon: 'sparkle', title: 'Made fresh', copy: 'Every waffle is cooked to order for that just-made warmth.' },
  { icon: 'gift', title: 'Wrapped with care', copy: 'Easy to carry, easy to share, and always a little special.' },
  { icon: 'leaf', title: 'Good ingredients', copy: 'Simple, quality ingredients with flavours that speak for themselves.' },
  { icon: 'heart', title: 'Made for your moments', copy: 'A comfort order for catch-ups, celebrations, and everything in between.' },
]

// Add real product photos and final prices here when they are ready.
export const shopProducts = [
  {
    id: 'cap',
    name: 'Bewraped Cap',
    category: 'Headwear',
    description: 'An easy everyday cap for carrying a little Bewraped energy with you.',
    price: 'Price coming soon',
    icon: 'cap',
    label: 'New drop',
  },
  {
    id: 'tumbler',
    name: 'Bewraped Tumbler',
    category: 'Drinkware',
    description: 'A reusable tumbler made for iced brews, busy days, and good moments.',
    price: 'Price coming soon',
    icon: 'tumbler',
    label: 'Coming soon',
  },
  {
    id: 'mug',
    name: 'Bewraped Mug',
    category: 'Drinkware',
    description: 'A cosy, everyday mug for coffee breaks and slow, sweet mornings.',
    price: 'Price coming soon',
    icon: 'mug',
    label: 'Coming soon',
  },
]

export const menuSections = [
  {
    id: 'waffles',
    eyebrow: 'Signature waffles',
    title: 'Pick a favourite. Make it yours.',
    description: 'A starting menu you can update anytime in this file.',
    items: [
      { name: 'Strawberry Cloud', description: 'Fresh strawberry, cream and chocolate drizzle.', price: 'Price coming soon', position: '80% center' },
      { name: 'Chocolate Crush', description: 'Chocolate sauce, crunchy crumbs and a creamy finish.', price: 'Price coming soon', position: '70% center' },
      { name: 'Berry Bliss', description: 'Berry topping with a bright, sweet finish.', price: 'Price coming soon', position: '90% center' },
      { name: 'Classic Wrap', description: 'Your choice of sauce and toppings, wrapped fresh.', price: 'Price coming soon', position: '75% center' },
    ],
  },
  {
    id: 'coffee',
    eyebrow: 'Coffee menu',
    title: 'Brewed to pair beautifully.',
    description: 'Keep this list simple or expand it with seasonal specials later.',
    items: [
      { name: 'Cloud Brew', description: 'Cold coffee topped with a silky cloud of cream.', price: 'Price coming soon', position: '100% center' },
      { name: 'Classic Cold Brew', description: 'Slow-steeped, smooth and seriously refreshing.', price: 'Price coming soon', position: '100% center' },
      { name: 'Mocha Cold Brew', description: 'Cold brew with a chocolatey twist.', price: 'Price coming soon', position: '100% center' },
      { name: 'Vanilla Cloud', description: 'A gentle vanilla finish for an extra-soft sip.', price: 'Price coming soon', position: '100% center' },
    ],
  },
]
