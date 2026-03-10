import { http, HttpResponse, delay } from 'msw'

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  sku: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

const timeOut = 500;
const STORAGE_KEY = 'products';

/**
 * Initial mock data (only used first time)
 */
const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Laptop Pro X (egx)',
    description: 'High performance laptop for professionals',
    price: 1299.99,
    stock: 45,
    sku: 'LAP-PRO-X-01',
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Wireless Mouse',
    description: 'Ergonomic wireless mouse with 6 buttons',
    price: 29.99,
    stock: 120,
    sku: 'W-MOUSE-02',
    active: true,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: '3',
    name: 'Mechanical Keyboard',
    description: 'RGB mechanical keyboard with red switches',
    price: 89.99,
    stock: 0,
    sku: 'MECH-KB-03',
    active: false,
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date(Date.now() - 172800000).toISOString()
  }
];

function getProducts(): Product[] {
  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialProducts));
    return initialProducts;
  }

  return JSON.parse(stored);
}

function saveProducts(products: Product[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

export const handlers = [

  http.get('/api/v1/products', async ({ request }) => {
    await delay(timeOut);

    const products = getProducts();

    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') || '1')
    const limit = Number(url.searchParams.get('limit') || '10')
    const search = url.searchParams.get('search')?.toLowerCase() || ''
    const active = url.searchParams.get('active')

    let filteredProducts = [...products];

    if (search) {
      filteredProducts = filteredProducts.filter(p =>
        p.name.toLowerCase().includes(search)
      );
    }

    if (active === 'true' || active === 'false') {
      const isActive = active === 'true';
      filteredProducts = filteredProducts.filter(p => p.active === isActive);
    }

    const total = filteredProducts.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const end = start + limit;

    const paginatedProducts = filteredProducts.slice(start, end);

    return HttpResponse.json({
      data: paginatedProducts,
      meta: {
        current_page: page,
        total_pages: totalPages,
        total_count: total,
      }
    });
  }),

  http.get('/api/v1/products/:id', async ({ params }) => {
    await delay(timeOut);

    const products = getProducts();
    const { id } = params;

    const product = products.find(p => p.id === id);

    if (!product) {
      return HttpResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return HttpResponse.json({ data: product });
  }),

  http.post('/api/v1/products', async ({ request }) => {
    await delay(timeOut);

    const products = getProducts();
    const body = await request.json() as Partial<Product>;

    if (!body.name || body.name.length < 3 || body.name.length > 100) {
      return HttpResponse.json({ error: 'Name validation failed' }, { status: 422 });
    }

    if (body.price === undefined || body.price <= 0) {
      return HttpResponse.json({ error: 'Price must be greater than 0' }, { status: 422 });
    }

    if (body.stock === undefined || body.stock < 0) {
      return HttpResponse.json({ error: 'Stock cannot be negative' }, { status: 422 });
    }

    if (!body.sku || !/^[A-Z0-9]+(-[A-Z0-9]+)*$/.test(body.sku)) {
      return HttpResponse.json({ error: 'Invalid SKU format' }, { status: 422 });
    }

    if (products.some(p => p.sku === body.sku)) {
      return HttpResponse.json({ error: 'SKU must be unique' }, { status: 422 });
    }

    const newProduct: Product = {
      id: crypto.randomUUID(),
      name: body.name!,
      description: body.description || null,
      price: body.price!,
      stock: body.stock!,
      sku: body.sku!,
      active: body.active ?? true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    products.push(newProduct);
    saveProducts(products);

    return HttpResponse.json({ data: newProduct }, { status: 201 });
  }),

  http.put('/api/v1/products/:id', async ({ request, params }) => {
    await delay(timeOut);

    const products = getProducts();
    const body = await request.json() as Partial<Product>;
    const { id } = params;

    const index = products.findIndex(p => p.id === id);

    if (index === -1) {
      return HttpResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    if (
      body.sku &&
      body.sku !== products[index].sku &&
      products.some(p => p.sku === body.sku)
    ) {
      return HttpResponse.json({ error: 'SKU must be unique' }, { status: 422 });
    }

    const updatedProduct: Product = {
      ...products[index],
      ...body,
      updated_at: new Date().toISOString()
    };

    products[index] = updatedProduct;
    saveProducts(products);

    return HttpResponse.json({ data: updatedProduct });
  }),

  http.delete('/api/v1/products/:id', async ({ params }) => {
    await delay(timeOut);

    const products = getProducts();
    const { id } = params;

    const index = products.findIndex(p => p.id === id);

    if (index === -1) {
      return HttpResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    products.splice(index, 1);
    saveProducts(products);

    return new HttpResponse(null, { status: 204 });
  })
];