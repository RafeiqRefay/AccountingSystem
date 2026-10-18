public class InvoiceDTO
{
  
  
    public List<InvoiceItemDTO> InvoiceItems { get; set; } = new List<InvoiceItemDTO>();


    public InvoiceDTO() { }

    public InvoiceDTO(List<InvoiceItemDTO> invoicesItem)
    {
      InvoiceItems = invoicesItem;
    }
}