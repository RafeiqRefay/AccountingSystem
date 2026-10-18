using System.ComponentModel.DataAnnotations;

public class CategoriesViewDTO
{
    public int ID { get; set; }
    public string CategorieName { get; set; }
    public string TypeName { get; set; }

    public CategoriesViewDTO() { }

    public CategoriesViewDTO(int iD, string categorieName, string typeName)
    {
        ID = iD;
        CategorieName = categorieName;
        TypeName = typeName;
    }
}

