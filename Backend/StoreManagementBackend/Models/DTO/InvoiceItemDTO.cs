
public class InvoiceItemDTO
{
    public int ProductID { get; set; }
    public int QTY { get; set; }
    public int Price { get; set; }  
  

    public InvoiceItemDTO() { }

    public InvoiceItemDTO(int proudctID, int qTY, int costPrice, int unitPrice)
    {
        ProductID = proudctID;
        QTY = qTY;
    }
}

