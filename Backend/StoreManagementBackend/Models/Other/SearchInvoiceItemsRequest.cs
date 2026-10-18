public class SearchInvoiceItemsRequest
{
    public int? ProductID { get; set; }
    public bool? IsStoreOwned { get; set; }
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }


}
