using System.ComponentModel.DataAnnotations;

public class ProductsViewDTO
{
    public int ID { get; set; }
    public string? ProductName { get; set; }
    public string? TypeName { get; set; }
    public string? CategorieName { get; set; }
    public int Quantity { get; set; }
    public decimal Purchase_Price { get; set; }
    public decimal Sale_Price { get; set; }
    public bool IsStoreOwned { get; set; }

    public ProductsViewDTO() { }

    public ProductsViewDTO(int iD, string productName, string typeName, string categorieName, int quantity, decimal purchase_Price, decimal sale_Price, bool isStoreOwned)
    {
        ID = iD;
        ProductName = productName;
        TypeName = typeName;
        CategorieName = categorieName;
        Quantity = quantity;
        Purchase_Price = purchase_Price;
        Sale_Price = sale_Price;
        IsStoreOwned = isStoreOwned;
    }
}

