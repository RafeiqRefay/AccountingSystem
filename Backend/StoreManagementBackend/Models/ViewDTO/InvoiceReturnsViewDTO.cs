using System.ComponentModel.DataAnnotations;

public class InvoiceReturnsViewDTO
{
    public int ID { get; set; }
    public int InvoiceItemID { get; set; }
    public decimal ReturnPrice { get; set; }
    public DateTime ReturnDate { get; set; }
    public int Qty { get; set; }
    public decimal CostPrice { get; set; }
    public string ProductName { get; set; }
    public bool IsStoreOwned { get; set; }

    public InvoiceReturnsViewDTO() { }

    public InvoiceReturnsViewDTO(int iD, int invoiceItemID, decimal returnPrice, DateTime returnDate, int qty, decimal costPrice, string productName, bool isStoreOwned)
    {
        ID = iD;
        InvoiceItemID = invoiceItemID;
        ReturnPrice = returnPrice;
        ReturnDate = returnDate;
        Qty = qty;
        CostPrice = costPrice;
        ProductName = productName;
        IsStoreOwned = isStoreOwned;
    }
}

