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

let products: Product[] = [
  {
    id: '1',
    name: 'Laptop Pro X',
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

export const handlers = [
  // GET /api/v1/products
  http.get('/api/v1/products', async ({ request }) => {
    await delay(500); // Simulate network latency
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') || '1')
    const limit = Number(url.searchParams.get('limit') || '10')
    const search = url.searchParams.get('search')?.toLowerCase() || ''
    const active = url.searchParams.get('active')

    // Filter
    let filteredProducts = [...products];

    if (search) {
      filteredProducts = filteredProducts.filter(p => p.name.toLowerCase().includes(search));
    }
    if (active === 'true' || active === 'false') {
      const isActive = active === 'true';
      filteredProducts = filteredProducts.filter(p => p.active === isActive);
    }

    // Pagination
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

  // GET /api/v1/products/:id
  http.get('/api/v1/products/:id', async ({ params }) => {
    await delay(300);
    const { id } = params;
    const product = products.find(p => p.id === id);
    if (!product) {
      return HttpResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return HttpResponse.json({ data: product });
  }),

  // POST /api/v1/products
  http.post('/api/v1/products', async ({ request }) => {
    await delay(600);
    const body = await request.json() as Partial<Product>;
    
    // Very basic backend validation matching requirements
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
      id: Math.random().toString(36).substr(2, 9),
      name: body.name,
      description: body.description || null,
      price: body.price,
      stock: body.stock,
      sku: body.sku,
      active: body.active !== undefined ? body.active : true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    products.push(newProduct);
    return HttpResponse.json({ data: newProduct }, { status: 201 });
  }),

  // PUT /api/v1/products/:id
  http.put('/api/v1/products/:id', async ({ request, params }) => {
    await delay(600);
    const { id } = params;
    const body = await request.json() as Partial<Product>;
    
    const index = products.findIndex(p => p.id === id);
    if (index === -1) {
      return HttpResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    if (body.sku && body.sku !== products[index].sku && products.some(p => p.sku === body.sku)) {
      return HttpResponse.json({ error: 'SKU must be unique' }, { status: 422 });
    }

    const updatedProduct = {
      ...products[index],
      ...body,
      updated_at: new Date().toISOString()
    };

    products[index] = updatedProduct;
    return HttpResponse.json({ data: updatedProduct });
  }),

  // DELETE /api/v1/products/:id
  http.delete('/api/v1/products/:id', async ({ params }) => {
    await delay(400);
    const { id } = params;
    const index = products.findIndex(p => p.id === id);
    if (index === -1) {
      return HttpResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    products.splice(index, 1);
    return new HttpResponse(null, { status: 204 });
  })
];
