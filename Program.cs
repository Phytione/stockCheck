using Microsoft.EntityFrameworkCore;
using System;

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
    product.Size = updatedProduct.Size;   // BEDEN buradan geliyor
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

// ----- Sale Endpoints -----
app.MapGet("/sales", async (FloDbContext db) => await db.Sales.ToListAsync());

app.MapGet("/sales/{id}", async (int id, FloDbContext db) =>
    await db.Sales.FindAsync(id) is Sale sale ? Results.Ok(sale) : Results.NotFound());

app.MapPost("/sales", async (Sale sale, FloDbContext db) =>
{
    var product = await db.Products.FindAsync(sale.ProductId);
    if (product == null) return Results.NotFound("Ürün bulunamadı");

    if (sale.Quantity <= 0)
        return Results.BadRequest("Satış miktarı 0 veya negatif olamaz.");

    if (product.Stock < sale.Quantity)
        return Results.BadRequest($"Yeterli stok yok! Mevcut stok: {product.Stock}");

    // Stoktan düş
    product.Stock -= sale.Quantity;

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
    public DbSet<Sale> Sales { get; set; }
}

// -------------------- Models --------------------
public class Product
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Brand { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Size { get; set; } = string.Empty;   // BEDEN buraya geldi
    public decimal Price { get; set; }
    public int Stock { get; set; }
}

public class Sale
{
    public int Id { get; set; }
    public int ProductId { get; set; }   // Artık direkt Product üzerinden
    public int Quantity { get; set; }
    public DateTime Date { get; set; }
}
