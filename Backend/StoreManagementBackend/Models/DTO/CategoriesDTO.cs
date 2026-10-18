using System.ComponentModel.DataAnnotations;

public class CategoriesDTO
{
    public int ID { get; set; }
    public string CategorieName { get; set; }
    [Range(1, int.MaxValue, ErrorMessage = "Invalid Type_ID.")]
    public int Type_ID { get; set; }

    public CategoriesDTO() { }

    public CategoriesDTO(int iD, string categorieName, int type_ID)
    {
        ID = iD;
        CategorieName = categorieName;
        Type_ID = type_ID;
    }
}

