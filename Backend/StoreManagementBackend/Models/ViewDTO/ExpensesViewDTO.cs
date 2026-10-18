using System.ComponentModel.DataAnnotations;

public class ExpensesViewDTO
{
    public int ID { get; set; }
    public DateTime Date { get; set; }
    public decimal Amount { get; set; }
    public string Description { get; set; }

    public ExpensesViewDTO() { }

    public ExpensesViewDTO(int iD, DateTime date, decimal amount, string description)
    {
        ID = iD;
        Date = date;
        Amount = amount;
        Description = description;
    }
}

