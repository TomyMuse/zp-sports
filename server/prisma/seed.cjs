const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.court.deleteMany();

  const categories = ['Paletas', 'Indumentaria', 'Accesorios'];
  const categoryMap = new Map();

  for (const name of categories) {
    const category = await prisma.category.create({
      data: { name },
    });
    categoryMap.set(name, category.id);
  }

  await prisma.product.createMany({
    data: [
      {
        name: 'Femak ZP Carbon X12',
        categoryId: categoryMap.get('Paletas'),
        price: 315000,
        image: 'https://images.unsplash.com/photo-1617957743103-310f48a52890?q=80&w=900&auto=format&fit=crop',
        badge: 'Exclusivo ZP',
        stock: 18,
      },
      {
        name: 'Femak ZP Control 3K',
        categoryId: categoryMap.get('Paletas'),
        price: 275000,
        image: 'https://images.unsplash.com/photo-1624378444499-1ecac091b265?q=80&w=900&auto=format&fit=crop',
        badge: 'Exclusivo ZP',
        stock: 20,
      },
      {
        name: 'Femak ZP Thunder 18K',
        categoryId: categoryMap.get('Paletas'),
        price: 355000,
        image: 'https://images.unsplash.com/photo-1505238680356-667803448bb6?q=80&w=900&auto=format&fit=crop',
        badge: 'Exclusivo ZP',
        stock: 12,
      },
      {
        name: 'Remera ZP ProDry',
        categoryId: categoryMap.get('Indumentaria'),
        price: 52000,
        image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=900&auto=format&fit=crop',
        stock: 35,
      },
      {
        name: 'Short ZP Elite',
        categoryId: categoryMap.get('Indumentaria'),
        price: 38000,
        image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=900&auto=format&fit=crop',
        stock: 30,
      },
      {
        name: 'Campera ZP Court',
        categoryId: categoryMap.get('Indumentaria'),
        price: 89000,
        image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=900&auto=format&fit=crop',
        stock: 14,
      },
      {
        name: 'Bolso ZP Tour',
        categoryId: categoryMap.get('Accesorios'),
        price: 85000,
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=900&auto=format&fit=crop',
        stock: 15,
      },
      {
        name: 'Overgrip ZP Pro (x3)',
        categoryId: categoryMap.get('Accesorios'),
        price: 14000,
        image: 'https://images.unsplash.com/photo-1584060622420-0673aad46076?q=80&w=900&auto=format&fit=crop',
        stock: 40,
      },
    ],
  });

  await prisma.blogPost.createMany({
    data: [
      {
        title: 'Dominando la Vibora: Rotacion del Core y Munequeo',
        category: 'Tacticas',
        date: '18 Mar 2026',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDueVaPOdN8Gr_L34juP-7FX0QQ0i9b4U6L4xy_dJT0REGTPla3D76btzD1CnAuk1hfEcX-k8WFHgFlsQgeN0qJwV8D8I2Q2ahJSCiJN3R14iIKMY_gsZNzDAAbENgJuThd7xG-w5C0Ki3oNPF7MV0MBBmijZUX9zdViYoe-nTAaJ76F9CBX2R6eLE4geukTEvd53mKn68tlVm8_3ZF_TYwfFu1tXHAwgnxeUOmKOKkbFJITp3TDRhUMFSgLoKnQv9omTh9nKaydrNH',
        excerpt: 'El tiro mas peligroso del padel requiere mas que fuerza. Desglosamos la cadena cinetica.',
        content: [
          'La vibora es uno de los golpes mas letales del padel moderno.',
          'La potencia real nace en la cadena cinetica y termina en el impacto.',
          'Practica la rotacion sin pelota para interiorizar el movimiento.'
        ],
      },
      {
        title: 'Carbono 12K vs 18K: Encuentra tu punto dulce',
        category: 'Tecnologia',
        date: '10 Mar 2026',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxTYEEgNQVUpcaIFJ_8bxmTvqKIeaXLuJ5Hqd1LWI91Lo7otrMA6RRNdA_Hm-SSosP9AtEfQ2S2xV9x8ouzlwipF2GZ8uwBuqGBxCCWvjhs1laJfWa-Zyh01u2lAMV6YZmfoP2V61or37D3jPqRt6mIA36Ep4SZnDLtkkQFkc_LgypNCwC1saL8azcbgosiejfimAK4USW6DEG8WYHRyjKI-FGp9PBKPxlFpcJZy2PEO1EkuxwUTqHrVfuDCyCtLbo93T_J5eeQ0xS',
        excerpt: 'Elegir la densidad correcta puede cambiar tu juego por completo.',
        content: [
          'La K indica miles de filamentos por hilo trenzado.',
          'Mas K suele implicar mayor rigidez, pero depende del nucleo.',
          'Elige segun tu estilo: potencia vs control.'
        ],
      },
    ],
  });

  await prisma.court.createMany({
    data: [
      {
        name: 'Club Champagnat (San Miguel)',
        location: 'Bella Vista, Buenos Aires',
        address: 'Pardo 5201, Bella Vista',
        phone: '',
        features: ['Padel'],
        image: 'https://images.unsplash.com/photo-1599586120429-48281b6f0ece?q=80&w=900&auto=format&fit=crop',
      },
      {
        name: 'Efecto Padel',
        location: 'San Miguel, Buenos Aires',
        address: 'Av. R. Balbin 5070, San Miguel',
        phone: '+54 9 11 5012-2847',
        features: ['Canchas cubiertas'],
        image: 'https://images.unsplash.com/photo-1521412644187-c49fa049e84d?q=80&w=900&auto=format&fit=crop',
      },
      {
        name: 'Fortaleza Padel',
        location: 'San Miguel, Buenos Aires',
        address: 'Av. Gaspar Campos 3400-3498, San Miguel',
        phone: '',
        features: ['Padel'],
        image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=900&auto=format&fit=crop',
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
