using System.ComponentModel.DataAnnotations;

public class ExpensesUpdateDTO
{
 [Required]
    public int  ID { get; set; }
    public DateTime?  Date { get; set; }
    public decimal?  Amount { get; set; }
    public string?  Description { get; set; }

    public ExpensesUpdateDTO() { }

    public ExpensesUpdateDTO(int iD, DateTime date, decimal amount, string description)
    {
        ID = iD;
        Date = date;
        Amount = amount;
        Description = description;
    }
}

