using System.ComponentModel.DataAnnotations;

public class TypesDTO
{
    public int ID { get; set; }
    public string TypeName { get; set; }

    public TypesDTO() { }

    public TypesDTO(int iD, string typeName)
    {
        ID = iD;
        TypeName = typeName;
    }
}

