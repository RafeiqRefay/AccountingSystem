using System.ComponentModel.DataAnnotations;

public class InvoicesViewDTO
{
    public int ID { get; set; }
    public DateTime Date { get; set; }
    public decimal Total { get; set; }

    public InvoicesViewDTO() { }

    public InvoicesViewDTO(int iD, DateTime date, decimal total)
    {
        ID = iD;
        Date = date;
        Total = total;
    }
}

