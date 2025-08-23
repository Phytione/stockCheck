using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System;

// -------------------- Builder --------------------
var builder = WebApplication.CreateBuilder(args);

// -------------------- Services --------------------

// DbContext için SQL Server bağlantısı
builder.Services.AddDbContext<FloDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Swagger/OpenAPI
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
app.MapGet("/products", async (FloDbContext db) => await db.Products.ToListAsync());

app.MapGet("/products/{id}", async (int id, FloDbContext db) =>
    await db.Products.FindAsync(id) is Product product ? Results.Ok(product) : Results.NotFound());

app.MapPost("/products", async (Product product, FloDbContext db) =>
{
    db.Products.Add(product);
    await db.SaveChangesAsync();
    return Results.Created($"/products/{product.Id}", product);
});

app.MapPut("/products/{id}", async (int id, Product updatedProduct, FloDbContext db) =>
{
    var product = await db.Products.FindAsync(id);
    if (product == null) return Results.NotFound();

    product.Name = updatedProduct.Name;
    product.Brand = updatedProduct.Brand;
    product.Category = updatedProduct.Category;
    product.Price = updatedProduct.Price;

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

// ----- ProductVariant Endpoints -----
app.MapGet("/products/{id}/variants", async (int id, FloDbContext db) =>
    await db.ProductVariants.Where(v => v.ProductId == id).ToListAsync());

app.MapPost("/products/{id}/variants", async (int id, ProductVariant variant, FloDbContext db) =>
{
    variant.ProductId = id;
    db.ProductVariants.Add(variant);
    await db.SaveChangesAsync();
    return Results.Created($"/products/{id}/variants/{variant.Id}", variant);
});

// ----- Sale Endpoints -----
app.MapGet("/sales", async (FloDbContext db) => await db.Sales.ToListAsync());

app.MapGet("/sales/{id}", async (int id, FloDbContext db) =>
    await db.Sales.FindAsync(id) is Sale sale ? Results.Ok(sale) : Results.NotFound());

app.MapPost("/sales", async (Sale sale, FloDbContext db) =>
{
    var variant = await db.ProductVariants.FindAsync(sale.ProductVariantId);
    if (variant == null) return Results.NotFound("Ürün varyasyonu bulunamadı");

    // Stok kontrolü
    if (sale.Quantity <= 0)
        return Results.BadRequest("Satış miktarı 0 veya negatif olamaz.");

    if (variant.Stock < sale.Quantity)
        return Results.BadRequest($"Yeterli stok yok! Mevcut stok: {variant.Stock}");

    // Stoktan düş
    variant.Stock -= sale.Quantity;

    // Satışı kaydet
    db.Sales.Add(sale);
    await db.SaveChangesAsync();

    return Results.Ok(sale);
});

// -------------------- Run App --------------------
app.Run();

// -------------------- DbContext --------------------
public class FloDbContext : DbContext
{
    public FloDbContext(DbContextOptions<FloDbContext> options) : base(options) { }

    public DbSet<Product> Products { get; set; }
    public DbSet<ProductVariant> ProductVariants { get; set; }
    public DbSet<Sale> Sales { get; set; }
}

// -------------------- Models --------------------
public class Product
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Brand { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public decimal Price { get; set; }

    // Navigation
    public List<ProductVariant> Variants { get; set; } = new();
}

public class ProductVariant
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public string Size { get; set; } = string.Empty;  // Örn: 40, 41, 42
    public int Stock { get; set; }

    // Navigation
    public Product Product { get; set; }
}

public class Sale
{
    public int Id { get; set; }
    public int ProductVariantId { get; set; }   // artık varyasyon bazlı
    public int Quantity { get; set; }
    public DateTime Date { get; set; }
}
