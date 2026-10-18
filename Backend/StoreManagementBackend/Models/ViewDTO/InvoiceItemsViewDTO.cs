using System.ComponentModel.DataAnnotations;

public class InvoiceItemsViewDTO
{
    public int ID { get; set; }
    public int ProductID { get; set; }
    public string ProductName { get; set; }
    public int Qty { get; set; }
    public decimal OriginalPrice { get; set; }
    public decimal CostPrice { get; set; }
    public decimal UnitPrice { get; set; }
    public bool IsStoreOwned { get; set; }
    public DateTime Date { get; set; }

    public bool? IsReturned {  get; set; }  

    public InvoiceItemsViewDTO() { }

    public InvoiceItemsViewDTO(int iD, int productID, string productName, int qty, decimal originalPrice, decimal costPrice, decimal unitPrice, bool isStoreOwned, DateTime date, bool? isReturned)
    {
        ID = iD;
        ProductID = productID;
        ProductName = productName;
        Qty = qty;
        OriginalPrice = originalPrice;
        CostPrice = costPrice;
        UnitPrice = unitPrice;
        IsStoreOwned = isStoreOwned;
        Date = date;
        IsReturned = isReturned;    
    }
}
