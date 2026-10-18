using System.ComponentModel.DataAnnotations;

public class TypesUpdateDTO
{
 [Required]
    public int  ID { get; set; }
    public string?  TypeName { get; set; }

    public TypesUpdateDTO() { }

    public TypesUpdateDTO(int iD, string typeName)
    {
        ID = iD;
        TypeName = typeName;
    }
}

