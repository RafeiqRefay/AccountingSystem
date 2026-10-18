
public class SearchProductItemRequest
{

    public    string?   ProductName { get; set; }
    public string?   TypeName { get; set; }
    public string?   CategorieName { get; set; }
    public DateTime?   FromDate { get; set; }
    public DateTime?   ToDate { get; set; }
    public bool?   IsStoreOwned { get; set; }

}
