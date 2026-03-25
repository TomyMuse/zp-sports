import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
    const categories = ['Paletas', 'Indumentaria', 'Accesorios'];
    const categoryMap = new Map();
    for (const name of categories) {
        const category = await prisma.category.upsert({
            where: { name },
            update: {},
            create: { name },
        });
        categoryMap.set(name, category.id);
    }
    await prisma.product.createMany({
        data: [
            {
                name: 'ZP Pro X Carbon',
                categoryId: categoryMap.get('Paletas'),
                price: 250000,
                image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBH7Vg6tvSzExdp0sbvu0GJbT6czuJ5sJ-MNdQLwByeHzgMKFaiaCQQZo-Of9jIUTbjRtUQkgacf-2Qz3dMyPsE-vySlRQ6r1I_lCQDbxoIy5nJVl3oe0byP2UWNA8gu6TeNwWZpeWhkH2uQx8bm5O1hXK8XBr87vbHLHf7jQanVbvXCvNM9epsTCHKJn5Z_LOCdi-7YEazdU6FAzY3ekIbySUmyt5Rt2x2aRbnvebeFwVtGwEcilTlgESnoHN3Ds6wsVLUJ5F5ehEO',
                badge: 'Nuevo',
                stock: 20,
            },
            {
                name: 'ZP Control Master',
                categoryId: categoryMap.get('Paletas'),
                price: 220000,
                image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuACOxTztQr6VdEAcxc_oP6ObQaZ_z320bsxPgwiH0xgylk3Lfmb0QfRWzajNz4aNHxLpgRJbzP6w32yDGF0fSc-1RPqR6BPjw9NDvC6i95m4Bcc3zPSlIzBFtF7BZAtM8XtybN0uqc10Ml29_rM9c9TZ97qX5qfl0kQMVwnCKElGV84oHxN7qLNV0SRdAyBxSvOcPd7IfMX_Dlj1S4N40OYTPmrOCQ6o9qLXrI5Kn63eAX65-2_aRCC_1E-J33B0Y1OeCSMOlzyeISm',
                stock: 16,
            },
            {
                name: 'Remera ZP Performance',
                categoryId: categoryMap.get('Indumentaria'),
                price: 45000,
                image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=800&auto=format&fit=crop',
                stock: 30,
            },
            {
                name: 'Short ZP Elite',
                categoryId: categoryMap.get('Indumentaria'),
                price: 38000,
                image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=800&auto=format&fit=crop',
                stock: 30,
            },
            {
                name: 'Bolso ZP Tour',
                categoryId: categoryMap.get('Accesorios'),
                price: 85000,
                image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop',
                stock: 15,
            },
            {
                name: 'Grip ZP Pro (x3)',
                categoryId: categoryMap.get('Accesorios'),
                price: 12000,
                image: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?q=80&w=800&auto=format&fit=crop',
                stock: 50,
            },
        ],
        skipDuplicates: true,
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
        skipDuplicates: true,
    });
    await prisma.court.createMany({
        data: [
            {
                name: 'San Miguel Padel Center',
                location: 'San Miguel, Buenos Aires',
                address: 'Av. Pres. J. D. Peron 1234',
                phone: '+54 11 1234-5678',
                features: ['Techada', 'Blindex', 'Cesped Sintetico'],
                image: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?q=80&w=800&auto=format&fit=crop',
            },
            {
                name: 'La Esquina Padel Club',
                location: 'Bella Vista, Buenos Aires',
                address: 'Ricchieri 567',
                phone: '+54 11 8765-4321',
                features: ['Descubierta', 'Muro', 'Buffet'],
                image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=800&auto=format&fit=crop',
            },
            {
                name: 'Muniz Padel Pro',
                location: 'Muniz, Buenos Aires',
                address: 'Conesa 890',
                phone: '+54 11 5555-4444',
                features: ['Techada', 'Blindex', 'Estacionamiento'],
                image: 'https://images.unsplash.com/photo-1599586120429-48281b6f0ece?q=80&w=800&auto=format&fit=crop',
            },
        ],
        skipDuplicates: true,
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
