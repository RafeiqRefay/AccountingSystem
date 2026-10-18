using System.ComponentModel.DataAnnotations;

public class InvoicesUpdateDTO
{
 [Required]
    public int  ProudctID { get; set; }
    public int?  QTY { get; set; }
    public decimal?  Discount { get; set; }

    public InvoicesUpdateDTO() { }

    public InvoicesUpdateDTO(int proudctID, int qTY, decimal discount)
    {
        ProudctID = proudctID;
        QTY = qTY;
        Discount = discount;
    }
}

