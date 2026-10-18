using System.ComponentModel.DataAnnotations;

public class ProductNamesUpdateDTO
{
 [Required]
    public int  ProductNameID { get; set; }
    public string?  ProductName { get; set; }

    public ProductNamesUpdateDTO() { }

    public ProductNamesUpdateDTO(int productNameID, string productName)
    {
        ProductNameID = productNameID;
        ProductName = productName;
    }
}

