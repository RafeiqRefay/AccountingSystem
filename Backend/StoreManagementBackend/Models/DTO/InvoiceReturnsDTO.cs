using System.ComponentModel.DataAnnotations;

public class InvoiceReturnsDTO
{
    public int ID { get; set; }
    [Range(1, int.MaxValue, ErrorMessage = "Invalid InvoiceItemID.")]
    public int InvoiceItemID { get; set; }

    public InvoiceReturnsDTO() { }

    public InvoiceReturnsDTO(int iD, int invoiceItemID)
    {
        ID = iD;
        InvoiceItemID = invoiceItemID;
    }
}

