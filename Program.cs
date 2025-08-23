using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;

// -------------------- Builder --------------------
var builder = WebApplication.CreateBuilder(args);

// -------------------- Services --------------------
builder.Services.AddDbContext<FloDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// -------------------- CORS --------------------
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// -------------------- Middleware --------------------
app.UseCors();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// -------------------- Minimal API Endpoints --------------------

// ----- Product Endpoints -----
app.MapGet("/products", async (FloDbContext db) =>
{
    return await db.Products.ToListAsync();
});

app.MapGet("/products/{id}", async (int id, FloDbContext db) =>
    await db.Products.FindAsync(id) is Product product ? Results.Ok(product) : Results.NotFound());

app.MapPost("/products", async (Product product, FloDbContext db) =>
{
    // Gelen veriyi veritabanına kaydetmeden önce standartlaştır
    product.Name = product.Name.Trim().ToLower();
    product.Brand = product.Brand.Trim().ToLower();
    product.Category = product.Category.Trim().ToLower();
    product.Size = product.Size.Trim();

    db.Products.Add(product);
    await db.SaveChangesAsync();
    return Results.Created($"/products/{product.Id}", product);
});

app.MapPut("/products/{id}", async (int id, Product updatedProduct, FloDbContext db) =>
{
    var product = await db.Products.FindAsync(id);
    if (product == null) return Results.NotFound();

    product.Name = updatedProduct.Name.Trim().ToLower();
    product.Brand = updatedProduct.Brand.Trim().ToLower();
    product.Category = updatedProduct.Category.Trim().ToLower();
    product.Size = updatedProduct.Size.Trim();
    product.Price = updatedProduct.Price;
    product.Stock = updatedProduct.Stock;

    await db.SaveChangesAsync();
    return Results.Ok(product);
});

app.MapDelete("/products/{id}", async (int id, FloDbContext db) =>
{
    var product = await db.Products.FindAsync(id);
    if (product == null) return Results.NotFound();

    db.Products.Remove(product);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

// ----- Sizes Endpoint (Dropdown için) -----
app.MapGet("/products/{productId}/sizes", async (int productId, FloDbContext db) =>
{
    var product = await db.Products.FindAsync(productId);
    if (product == null) return Results.NotFound();

    var sizes = await db.Products
        .Where(p => p.Name == product.Name
                 && p.Brand == product.Brand
                 && p.Category == product.Category
                 && p.Price == product.Price)
        .Select(p => new { p.Size, p.Stock })
        .ToListAsync();

    return Results.Ok(sizes);
});


// ----- Sale Endpoints -----
app.MapGet("/sales", async (FloDbContext db) => await db.Sales.ToListAsync());

app.MapGet("/sales/{id}", async (int id, FloDbContext db) =>
    await db.Sales.FindAsync(id) is Sale sale ? Results.Ok(sale) : Results.NotFound());

app.MapPost("/sales", async (Sale sale, FloDbContext db) =>
{
    // Gelen veriyi standartlaştırıyoruz
    sale.Name = sale.Name.Trim().ToLower();
    sale.Brand = sale.Brand.Trim().ToLower();
    sale.Category = sale.Category.Trim().ToLower();
    sale.Size = sale.Size.Trim();

    var product = await db.Products
        .FirstOrDefaultAsync(p => p.Name == sale.Name
                               && p.Brand == sale.Brand
                               && p.Category == sale.Category
                               && p.Price == sale.Price
                               && p.Size == sale.Size);

    if (product == null) return Results.NotFound("Seçilen ürün bilgisi veya bedeni bulunamadı.");

    if (sale.Quantity <= 0)
        return Results.BadRequest("Satış miktarı 0 veya negatif olamaz.");

    if (product.Stock < sale.Quantity)
        return Results.BadRequest($"Yeterli stok yok! Mevcut stok: {product.Stock}");

    // Stoktan düş
    product.Stock -= sale.Quantity;
    db.Sales.Add(sale);
    await db.SaveChangesAsync();

    return Results.Ok(sale);
});

// -------------------- NEW TOP SELLING ENDPOINTS --------------------

// ----- Top Selling Products Endpoint -----
app.MapGet("/top-selling-products", async (FloDbContext db) =>
{
    var topProducts = await db.Sales
        .GroupBy(s => new { s.Name, s.Brand, s.Category })
        .Select(g => new
        {
            Name = g.Key.Name,
            Brand = g.Key.Brand,
            Category = g.Key.Category,
            TotalQuantitySold = g.Sum(s => s.Quantity)
        })
        .OrderByDescending(x => x.TotalQuantitySold)
        .Take(10)
        .ToListAsync();

    return Results.Ok(topProducts);
});

// ----- Top Selling Categories Endpoint -----
app.MapGet("/top-selling-categories", async (FloDbContext db) =>
{
    var topCategories = await db.Sales
        .GroupBy(s => s.Category)
        .Select(g => new
        {
            Category = g.Key,
            TotalQuantitySold = g.Sum(s => s.Quantity)
        })
        .OrderByDescending(x => x.TotalQuantitySold)
        .Take(10)
        .ToListAsync();

    return Results.Ok(topCategories);
});

// ----- Top Selling Brands Endpoint -----
app.MapGet("/top-selling-brands", async (FloDbContext db) =>
{
    var topBrands = await db.Sales
        .GroupBy(s => s.Brand)
        .Select(g => new
        {
            Brand = g.Key,
            TotalQuantitySold = g.Sum(s => s.Quantity)
        })
        .OrderByDescending(x => x.TotalQuantitySold)
        .Take(10)
        .ToListAsync();

    return Results.Ok(topBrands);
});

// -------------------- Run App --------------------
app.Run();

// -------------------- DbContext --------------------
public class FloDbContext : DbContext
{
    public FloDbContext(DbContextOptions<FloDbContext> options) : base(options) { }
    public DbSet<Product> Products { get; set; }
    public DbSet<Sale> Sales { get; set; }
}

// -------------------- Models --------------------
public class Product
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Brand { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Size { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int Stock { get; set; }
}

public class Sale
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Brand { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string Size { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public DateTime Date { get; set; }
}