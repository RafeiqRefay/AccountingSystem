
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

public static class InvoicesService
{




    public static async Task<ApiResult<List<InvoicesViewDTO>>> GetAllInvoicesByDateAsync(
        DateTime? FromDate, DateTime? ToDate,
        CancellationToken cancellationToken = default)
    {
        var result = await InvoicesData.GetAllInvoicesByDateAsync(
            FromDate, ToDate,
            cancellationToken);

        if (result.Data == null || result.Data.Count == 0)
        {
            return new ApiResult<List<InvoicesViewDTO>>(
                null,
                "No Invoicess found.",
                ErrorType.NotFound
            );
        }

        return new ApiResult<List<InvoicesViewDTO>>(
            result.Data,
            "Invoicess retrieved successfully.",
            ErrorType.None
        );
    }


    public static async Task<ApiResult<InvoicesViewDTO>> GetInvoicesByIDAsync(
        int ID,
        CancellationToken cancellationToken = default)
    {

        return await InvoicesData.GetInvoicesByIDAsync(
            ID,
            cancellationToken);
    }



    public static async Task<ApiResult<InvoicesViewDTO>> AddInvoiceAsync(
   List<InvoiceItemDTO> invoices,
    CancellationToken cancellationToken = default)
    {
        if (invoices == null)
        {
            return new ApiResult<InvoicesViewDTO>
            {
                Data = null,
                Message = "Invoice is empty",
                ErrorType = ErrorType.InvalidId
            };
        }

        return await InvoicesData.AddInvoiceAsync(invoices, cancellationToken);
    }


}

