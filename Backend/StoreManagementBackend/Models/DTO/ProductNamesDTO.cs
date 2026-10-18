using System.ComponentModel.DataAnnotations;

public class ProductNamesDTO
{
    public int ProductNameID { get; set; }
    public string ProductName { get; set; }

    public ProductNamesDTO() { }

    public ProductNamesDTO(int productNameID, string productName)
    {
        ProductNameID = productNameID;
        ProductName = productName;
    }
}

