using System.ComponentModel.DataAnnotations;

public class CategoriesUpdateDTO
{
 [Required]
    public int  ID { get; set; }
    public string?  CategorieName { get; set; }
    public int?  Type_ID { get; set; }

    public CategoriesUpdateDTO() { }

    public CategoriesUpdateDTO(int iD, string categorieName, int type_ID)
    {
        ID = iD;
        CategorieName = categorieName;
        Type_ID = type_ID;
    }
}

