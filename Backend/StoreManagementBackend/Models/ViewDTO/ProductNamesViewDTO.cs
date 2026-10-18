using System.ComponentModel.DataAnnotations;

public class ProductNamesViewDTO
{
    public int ProductNameID { get; set; }
    public string ProductName { get; set; }

    public ProductNamesViewDTO() { }

    public ProductNamesViewDTO(int productNameID, string productName)
    {
        ProductNameID = productNameID;
        ProductName = productName;
    }
}

