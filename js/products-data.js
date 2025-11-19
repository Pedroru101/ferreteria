/**
 * Catálogo de productos hardcodeado
 * Este archivo contiene todos los productos disponibles cuando Google Sheets no está configurado
 * Estructura compatible con products-loader.js
 */

const PRODUCTS_DATA = {
    postes: [
        {
            id: 'poste_hormigon_2_5',
            name: 'Poste de Hormigón 2.5m',
            category: 'postes',
            subcategory: 'hormigon',
            description: 'Poste de hormigón armado con varillas de hierro de 6mm. Ideal para cercados perimetrales de alta durabilidad.',
            specs: {
                material: 'Hormigón armado',
                height: '2.5m',
                diameter: '12cm',
                weight: '45kg',
                durability: '50+ años',
                resistance: {
                    humidity: 10,
                    pests: 10,
                    fire: 10
                }
            },
            applications: ['Rural', 'Industrial', 'Residencial', 'Perímetros'],
            price: 3500,
            stock: 150,
            image: 'assets/images/products/poste-hormigon.jpg',
            featured: true
        },
        {
            id: 'poste_hormigon_3_0',
            name: 'Poste de Hormigón 3.0m',
            category: 'postes',
            subcategory: 'hormigon',
            description: 'Poste de hormigón armado de mayor altura para cercados de seguridad o terrenos irregulares.',
            specs: {
                material: 'Hormigón armado',
                height: '3.0m',
                diameter: '12cm',
                weight: '55kg',
                durability: '50+ años',
                resistance: {
                    humidity: 10,
                    pests: 10,
                    fire: 10
                }
            },
            applications: ['Industrial', 'Seguridad', 'Terrenos irregulares'],
            price: 4200,
            stock: 100,
            image: 'assets/images/products/poste-hormigon.jpg',
            featured: false
        },
        {
            id: 'poste_quebracho_2_5',
            name: 'Poste de Quebracho 2.5m',
            category: 'postes',
            subcategory: 'quebracho',
            description: 'Poste de quebracho colorado, madera de extrema dureza y resistencia natural. Ideal para alta exigencia.',
            specs: {
                material: 'Quebracho colorado',
                height: '2.5m',
                diameter: '12-15cm',
                weight: '35kg',
                durability: '40+ años',
                resistance: {
                    humidity: 9,
                    pests: 9,
                    fire: 5
                }
            },
            applications: ['Rural alta exigencia', 'Estancias', 'Campos'],
            price: 4200,
            stock: 80,
            image: 'assets/images/products/poste-quebracho.jpg',
            featured: true
        },
        {
            id: 'poste_quebracho_3_0',
            name: 'Poste de Quebracho 3.0m',
            category: 'postes',
            subcategory: 'quebracho',
            description: 'Poste de quebracho de mayor altura, perfecto para cercados rurales de gran extensión.',
            specs: {
                material: 'Quebracho colorado',
                height: '3.0m',
                diameter: '12-15cm',
                weight: '42kg',
                durability: '40+ años',
                resistance: {
                    humidity: 9,
                    pests: 9,
                    fire: 5
                }
            },
            applications: ['Rural', 'Estancias', 'Campos extensos'],
            price: 5000,
            stock: 60,
            image: 'assets/images/products/poste-quebracho.jpg',
            featured: false
        },
        {
            id: 'poste_eucalipto_2_5',
            name: 'Poste de Eucalipto 2.5m',
            category: 'postes',
            subcategory: 'eucalipto',
            description: 'Poste de eucalipto tratado, opción económica con buena relación precio-calidad para cercados residenciales.',
            specs: {
                material: 'Eucalipto tratado',
                height: '2.5m',
                diameter: '10-12cm',
                weight: '25kg',
                durability: '20+ años',
                resistance: {
                    humidity: 6,
                    pests: 6,
                    fire: 5
                }
            },
            applications: ['Residencial', 'Temporal', 'Jardines'],
            price: 2100,
            stock: 200,
            image: 'assets/images/products/poste-eucalipto.jpg',
            featured: true
        },
        {
            id: 'poste_eucalipto_3_0',
            name: 'Poste de Eucalipto 3.0m',
            category: 'postes',
            subcategory: 'eucalipto',
            description: 'Poste de eucalipto tratado de mayor altura, ideal para cercados económicos.',
            specs: {
                material: 'Eucalipto tratado',
                height: '3.0m',
                diameter: '10-12cm',
                weight: '30kg',
                durability: '20+ años',
                resistance: {
                    humidity: 6,
                    pests: 6,
                    fire: 5
                }
            },
            applications: ['Residencial', 'Temporal'],
            price: 2500,
            stock: 150,
            image: 'assets/images/products/poste-eucalipto.jpg',
            featured: false
        },
        {
            id: 'poste_olimpo_2_5',
            name: 'Poste Olimpo 2.5m',
            category: 'postes',
            subcategory: 'olimpo',
            description: 'Poste de hormigón con 3 hilos de alambre de púa incorporados. Máxima seguridad y durabilidad.',
            specs: {
                material: 'Hormigón armado + alambre de púa',
                height: '2.5m',
                diameter: '12cm',
                weight: '48kg',
                durability: '50+ años',
                resistance: {
                    humidity: 10,
                    pests: 10,
                    fire: 10
                },
                wireStrands: 3,
                wireType: 'Alambre de púa galvanizado'
            },
            applications: ['Seguridad', 'Industrial', 'Perímetros de alta seguridad'],
            price: 4000,
            stock: 90,
            image: 'assets/images/products/poste-olimpo.jpg',
            featured: true
        },
        {
            id: 'poste_olimpo_3_0',
            name: 'Poste Olimpo 3.0m',
            category: 'postes',
            subcategory: 'olimpo',
            description: 'Poste Olimpo de mayor altura para cercados de seguridad perimetral.',
            specs: {
                material: 'Hormigón armado + alambre de púa',
                height: '3.0m',
                diameter: '12cm',
                weight: '58kg',
                durability: '50+ años',
                resistance: {
                    humidity: 10,
                    pests: 10,
                    fire: 10
                },
                wireStrands: 3,
                wireType: 'Alambre de púa galvanizado'
            },
            applications: ['Seguridad', 'Industrial'],
            price: 4800,
            stock: 70,
            image: 'assets/images/products/poste-olimpo.jpg',
            featured: false
        }
    ],

    tejidos: [
        {
            id: 'tejido_romboidal_1_00',
            name: 'Tejido Romboidal 1.00m',
            category: 'tejidos',
            subcategory: 'romboidal',
            description: 'Tejido romboidal galvanizado calibre 14, rombo de 63mm. Rollo de 10 metros lineales.',
            specs: {
                material: 'Alambre galvanizado',
                caliber: '14',
                meshSize: '63mm',
                height: '1.00m',
                rollLength: '10m',
                weight: '12kg/rollo',
                coating: 'Galvanizado en caliente'
            },
            applications: ['Cercados bajos', 'Jardines', 'Divisiones'],
            price: 8500,
            priceUnit: 'rollo',
            stock: 50,
            image: 'assets/images/products/tejido-romboidal.jpg',
            featured: true
        },
        {
            id: 'tejido_romboidal_1_20',
            name: 'Tejido Romboidal 1.20m',
            category: 'tejidos',
            subcategory: 'romboidal',
            description: 'Tejido romboidal galvanizado calibre 14, rombo de 63mm. Rollo de 10 metros lineales.',
            specs: {
                material: 'Alambre galvanizado',
                caliber: '14',
                meshSize: '63mm',
                height: '1.20m',
                rollLength: '10m',
                weight: '14kg/rollo',
                coating: 'Galvanizado en caliente'
            },
            applications: ['Cercados residenciales', 'Jardines', 'Divisiones'],
            price: 10200,
            priceUnit: 'rollo',
            stock: 60,
            image: 'assets/images/products/tejido-romboidal.jpg',
            featured: true
        },
        {
            id: 'tejido_romboidal_1_50',
            name: 'Tejido Romboidal 1.50m',
            category: 'tejidos',
            subcategory: 'romboidal',
            description: 'Tejido romboidal galvanizado calibre 14, rombo de 63mm. Rollo de 10 metros lineales.',
            specs: {
                material: 'Alambre galvanizado',
                caliber: '14',
                meshSize: '63mm',
                height: '1.50m',
                rollLength: '10m',
                weight: '18kg/rollo',
                coating: 'Galvanizado en caliente'
            },
            applications: ['Cercados perimetrales', 'Seguridad media', 'Industrial'],
            price: 12800,
            priceUnit: 'rollo',
            stock: 45,
            image: 'assets/images/products/tejido-romboidal.jpg',
            featured: true
        },
        {
            id: 'tejido_romboidal_1_80',
            name: 'Tejido Romboidal 1.80m',
            category: 'tejidos',
            subcategory: 'romboidal',
            description: 'Tejido romboidal galvanizado calibre 14, rombo de 63mm. Rollo de 10 metros lineales.',
            specs: {
                material: 'Alambre galvanizado',
                caliber: '14',
                meshSize: '63mm',
                height: '1.80m',
                rollLength: '10m',
                weight: '21kg/rollo',
                coating: 'Galvanizado en caliente'
            },
            applications: ['Seguridad', 'Industrial', 'Deportivo'],
            price: 15400,
            priceUnit: 'rollo',
            stock: 40,
            image: 'assets/images/products/tejido-romboidal.jpg',
            featured: false
        },
        {
            id: 'tejido_romboidal_2_00',
            name: 'Tejido Romboidal 2.00m',
            category: 'tejidos',
            subcategory: 'romboidal',
            description: 'Tejido romboidal galvanizado calibre 14, rombo de 63mm. Rollo de 10 metros lineales.',
            specs: {
                material: 'Alambre galvanizado',
                caliber: '14',
                meshSize: '63mm',
                height: '2.00m',
                rollLength: '10m',
                weight: '24kg/rollo',
                coating: 'Galvanizado en caliente'
            },
            applications: ['Alta seguridad', 'Industrial', 'Deportivo'],
            price: 17000,
            priceUnit: 'rollo',
            stock: 35,
            image: 'assets/images/products/tejido-romboidal.jpg',
            featured: false
        }
    ],

    alambres: [
        {
            id: 'alambre_galvanizado_17',
            name: 'Alambre Galvanizado Cal. 17',
            category: 'alambres',
            subcategory: 'galvanizado',
            description: 'Alambre galvanizado calibre 17 para cercados. Venta por kilo en bobinas de 25kg.',
            specs: {
                material: 'Acero galvanizado',
                caliber: '17',
                diameter: '1.47mm',
                presentation: 'Bobina 25kg',
                coating: 'Galvanizado en caliente',
                tensileStrength: '350-550 N/mm²'
            },
            applications: ['Cercados ligeros', 'Ataduras', 'Fijaciones'],
            price: 180,
            priceUnit: 'kg',
            stock: 500,
            image: 'assets/images/products/alambre-galvanizado.jpg',
            featured: false
        },
        {
            id: 'alambre_galvanizado_14',
            name: 'Alambre Galvanizado Cal. 14',
            category: 'alambres',
            subcategory: 'galvanizado',
            description: 'Alambre galvanizado calibre 14 para cercados. Venta por kilo en bobinas de 25kg.',
            specs: {
                material: 'Acero galvanizado',
                caliber: '14',
                diameter: '2.11mm',
                presentation: 'Bobina 25kg',
                coating: 'Galvanizado en caliente',
                tensileStrength: '350-550 N/mm²'
            },
            applications: ['Cercados estándar', 'Refuerzos', 'Estructuras'],
            price: 190,
            priceUnit: 'kg',
            stock: 600,
            image: 'assets/images/products/alambre-galvanizado.jpg',
            featured: true
        },
        {
            id: 'alambre_galvanizado_12',
            name: 'Alambre Galvanizado Cal. 12',
            category: 'alambres',
            subcategory: 'galvanizado',
            description: 'Alambre galvanizado calibre 12 para cercados de alta resistencia. Venta por kilo en bobinas de 25kg.',
            specs: {
                material: 'Acero galvanizado',
                caliber: '12',
                diameter: '2.77mm',
                presentation: 'Bobina 25kg',
                coating: 'Galvanizado en caliente',
                tensileStrength: '350-550 N/mm²'
            },
            applications: ['Cercados reforzados', 'Alta tensión', 'Industrial'],
            price: 200,
            priceUnit: 'kg',
            stock: 400,
            image: 'assets/images/products/alambre-galvanizado.jpg',
            featured: true
        },
        {
            id: 'alambre_pua_galvanizado',
            name: 'Alambre de Púa Galvanizado',
            category: 'alambres',
            subcategory: 'pua',
            description: 'Alambre de púa galvanizado de 4 puntas. Rollo de 250 metros. Ideal para seguridad perimetral.',
            specs: {
                material: 'Acero galvanizado',
                caliber: '14',
                diameter: '2.11mm',
                presentation: 'Rollo 250m',
                spacing: '10cm entre púas',
                points: '4 puntas',
                coating: 'Galvanizado en caliente'
            },
            applications: ['Seguridad', 'Perímetros', 'Disuasión'],
            price: 12500,
            priceUnit: 'rollo',
            stock: 80,
            image: 'assets/images/products/alambre-pua.jpg',
            featured: true
        },
        {
            id: 'alambre_negro_recocido_16',
            name: 'Alambre Negro Recocido Cal. 16',
            category: 'alambres',
            subcategory: 'negro',
            description: 'Alambre negro recocido calibre 16 para ataduras y construcción. Venta por kilo en bobinas de 25kg.',
            specs: {
                material: 'Acero recocido',
                caliber: '16',
                diameter: '1.65mm',
                presentation: 'Bobina 25kg',
                coating: 'Sin recubrimiento',
                tensileStrength: '300-450 N/mm²'
            },
            applications: ['Ataduras', 'Construcción', 'Armado de estructuras'],
            price: 150,
            priceUnit: 'kg',
            stock: 700,
            image: 'assets/images/products/alambre-negro.jpg',
            featured: false
        }
    ],

    accesorios: [
        {
            id: 'grampa_u_galvanizada',
            name: 'Grampa U Galvanizada',
            category: 'accesorios',
            subcategory: 'grampas',
            description: 'Grampa en U galvanizada para fijación de alambres a postes de madera. Bolsa x 100 unidades.',
            specs: {
                material: 'Acero galvanizado',
                size: '40mm',
                thickness: '3mm',
                presentation: 'Bolsa x 100 unidades',
                coating: 'Galvanizado'
            },
            applications: ['Fijación de alambres', 'Postes de madera'],
            price: 850,
            priceUnit: 'bolsa',
            stock: 200,
            image: 'assets/images/products/grampa-u.jpg',
            featured: false
        },
        {
            id: 'tensor_alambre',
            name: 'Tensor para Alambre',
            category: 'accesorios',
            subcategory: 'tensores',
            description: 'Tensor metálico para ajuste y tensado de alambres. Unidad.',
            specs: {
                material: 'Acero galvanizado',
                size: '150mm',
                maxLoad: '500kg',
                presentation: 'Unidad',
                coating: 'Galvanizado'
            },
            applications: ['Tensado de alambres', 'Ajuste de cercados'],
            price: 320,
            priceUnit: 'unidad',
            stock: 150,
            image: 'assets/images/products/tensor.jpg',
            featured: false
        },
        {
            id: 'varilla_anclaje',
            name: 'Varilla de Anclaje',
            category: 'accesorios',
            subcategory: 'anclajes',
            description: 'Varilla de anclaje para postes de hormigón. Largo 60cm, diámetro 12mm.',
            specs: {
                material: 'Acero',
                length: '60cm',
                diameter: '12mm',
                presentation: 'Unidad',
                coating: 'Sin recubrimiento'
            },
            applications: ['Anclaje de postes', 'Refuerzo estructural'],
            price: 450,
            priceUnit: 'unidad',
            stock: 300,
            image: 'assets/images/products/varilla-anclaje.jpg',
            featured: false
        },
        {
            id: 'abrazadera_poste',
            name: 'Abrazadera para Poste',
            category: 'accesorios',
            subcategory: 'abrazaderas',
            description: 'Abrazadera metálica para fijación de alambres a postes de hormigón. Unidad.',
            specs: {
                material: 'Acero galvanizado',
                diameter: '12cm',
                thickness: '2mm',
                presentation: 'Unidad',
                coating: 'Galvanizado'
            },
            applications: ['Fijación a postes de hormigón', 'Sujeción de alambres'],
            price: 280,
            priceUnit: 'unidad',
            stock: 250,
            image: 'assets/images/products/abrazadera.jpg',
            featured: false
        },
        {
            id: 'esquinero_metalico',
            name: 'Esquinero Metálico Reforzado',
            category: 'accesorios',
            subcategory: 'esquineros',
            description: 'Esquinero metálico reforzado para postes de esquina. Incluye pernos de fijación.',
            specs: {
                material: 'Acero galvanizado',
                size: '20x20cm',
                thickness: '4mm',
                presentation: 'Unidad con pernos',
                coating: 'Galvanizado'
            },
            applications: ['Refuerzo de esquinas', 'Postes esquineros'],
            price: 1200,
            priceUnit: 'unidad',
            stock: 100,
            image: 'assets/images/products/esquinero.jpg',
            featured: false
        },
        {
            id: 'alambre_atar_galvanizado',
            name: 'Alambre para Atar Galvanizado',
            category: 'accesorios',
            subcategory: 'ataduras',
            description: 'Alambre galvanizado calibre 18 para ataduras. Rollo de 1kg.',
            specs: {
                material: 'Acero galvanizado',
                caliber: '18',
                diameter: '1.25mm',
                presentation: 'Rollo 1kg',
                coating: 'Galvanizado'
            },
            applications: ['Ataduras', 'Fijaciones temporales', 'Uniones'],
            price: 220,
            priceUnit: 'rollo',
            stock: 400,
            image: 'assets/images/products/alambre-atar.jpg',
            featured: false
        },
        {
            id: 'portillon_metalico',
            name: 'Portillón Metálico 1.00m',
            category: 'accesorios',
            subcategory: 'portillones',
            description: 'Portillón metálico galvanizado con marco reforzado. Ancho 1.00m, altura 1.50m. Incluye bisagras y cerradura.',
            specs: {
                material: 'Caño estructural galvanizado',
                width: '1.00m',
                height: '1.50m',
                frameSize: '40x40mm',
                presentation: 'Unidad completa',
                coating: 'Galvanizado',
                includes: 'Bisagras y cerradura'
            },
            applications: ['Accesos', 'Entradas', 'Cercados'],
            price: 18500,
            priceUnit: 'unidad',
            stock: 25,
            image: 'assets/images/products/portillon.jpg',
            featured: true
        },
        {
            id: 'tranquera_metalica',
            name: 'Tranquera Metálica 3.00m',
            category: 'accesorios',
            subcategory: 'tranqueras',
            description: 'Tranquera metálica galvanizada para acceso vehicular. Ancho 3.00m, altura 1.50m. Incluye herrajes.',
            specs: {
                material: 'Caño estructural galvanizado',
                width: '3.00m',
                height: '1.50m',
                frameSize: '50x50mm',
                presentation: 'Unidad completa',
                coating: 'Galvanizado',
                includes: 'Herrajes y pasadores'
            },
            applications: ['Acceso vehicular', 'Campos', 'Industrial'],
            price: 42000,
            priceUnit: 'unidad',
            stock: 15,
            image: 'assets/images/products/tranquera.jpg',
            featured: true
        }
    ]
};

const getAllProducts = () => {
    return [
        ...PRODUCTS_DATA.postes,
        ...PRODUCTS_DATA.tejidos,
        ...PRODUCTS_DATA.alambres,
        ...PRODUCTS_DATA.accesorios
    ];
};

const getProductsByCategory = (category) => {
    return PRODUCTS_DATA[category] || [];
};

const getProductById = (productId) => {
    const allProducts = getAllProducts();
    return allProducts.find(p => p.id === productId);
};

const getFeaturedProducts = () => {
    const allProducts = getAllProducts();
    return allProducts.filter(p => p.featured);
};

const searchProducts = (query) => {
    const allProducts = getAllProducts();
    const lowerQuery = query.toLowerCase();
    return allProducts.filter(p => 
        p.name.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery) ||
        p.category.toLowerCase().includes(lowerQuery)
    );
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        PRODUCTS_DATA,
        getAllProducts,
        getProductsByCategory,
        getProductById,
        getFeaturedProducts,
        searchProducts
    };
}

if (typeof window !== 'undefined') {
    window.PRODUCTS_DATA = PRODUCTS_DATA;
    window.getAllProducts = getAllProducts;
    window.getProductsByCategory = getProductsByCategory;
    window.getProductById = getProductById;
    window.getFeaturedProducts = getFeaturedProducts;
    window.searchProducts = searchProducts;
}
