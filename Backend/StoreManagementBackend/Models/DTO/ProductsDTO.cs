using System.ComponentModel.DataAnnotations;

public class ProductsDTO
{
    public int ID { get; set; }
    [Range(1, int.MaxValue, ErrorMessage = "Invalid ProudctName_ID.")]

    public int ProductNameID { get; set; }
    public int? Type_ID { get; set; }
    public int? Category_ID { get; set; }
    public int Quantity { get; set; }
    public decimal Purchase_Price { get; set; }
    public decimal Sale_Price { get; set; }
    public bool IsStoreOwned { get; set; }

    public ProductsDTO() { }

    public ProductsDTO(int iD, int productNameID, int type_ID, int category_ID, int quantity, decimal purchase_Price, decimal sale_Price, bool isStoreOwned)
    {
        ID = iD;
        ProductNameID = productNameID;
        Type_ID = type_ID;
        Category_ID = category_ID;
        Quantity = quantity;
        Purchase_Price = purchase_Price;
        Sale_Price = sale_Price;
        IsStoreOwned = isStoreOwned;
    }
}

