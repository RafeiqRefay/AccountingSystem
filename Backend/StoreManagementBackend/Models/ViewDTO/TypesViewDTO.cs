using System.ComponentModel.DataAnnotations;

public class TypesViewDTO
{
    public int ID { get; set; }
    public string TypeName { get; set; }

    public TypesViewDTO() { }

    public TypesViewDTO(int iD, string typeName)
    {
        ID = iD;
        TypeName = typeName;
    }
}

