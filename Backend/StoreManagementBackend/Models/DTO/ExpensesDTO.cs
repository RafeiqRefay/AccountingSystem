using System.ComponentModel.DataAnnotations;

public class ExpensesDTO
{
    public int ID { get; set; }
    public decimal Amount { get; set; }
    public string Description { get; set; }

    public ExpensesDTO() { }

    public ExpensesDTO(int iD,  decimal amount, string description)
    {
        ID = iD;
        Amount = amount;
        Description = description;
    }
}

