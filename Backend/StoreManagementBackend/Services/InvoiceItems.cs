
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

public class InvoiceItemsService
{



    public static async Task<ApiResult<List<InvoiceItemsViewDTO>>> SearchInvoiceItems(
        int? ProductID, bool? IsStoreOwned, DateTime? FromDate, DateTime? ToDate,
        CancellationToken cancellationToken = default)
    {
        var result = await InvoiceItemsData.SearchInvoiceItems(
            ProductID, IsStoreOwned,FromDate,ToDate,
            cancellationToken);

        if (result.Data == null || result.Data.Count == 0)
        {
            return new ApiResult<List<InvoiceItemsViewDTO>>(
                null,
                "No InvoiceItemss found.",
                ErrorType.NotFound
            );
        }

        return new ApiResult<List<InvoiceItemsViewDTO>>(
            result.Data,
            "InvoiceItemss retrieved successfully.",
            ErrorType.None
        );
    }


    public static async Task<ApiResult<List<InvoiceItemsViewDTO>>> GetInvoiceItemByInvoiceID(
     int InvoiceID,
      CancellationToken cancellationToken = default)
    {
        var result = await InvoiceItemsData.GetInvoiceItemByInvoiceID(
        InvoiceID,
            cancellationToken);

        if (result.Data == null || result.Data.Count == 0)
        {
            return new ApiResult<List<InvoiceItemsViewDTO>>(
                null,
                "No InvoiceItemss found.",
                ErrorType.NotFound
            );
        }

        return new ApiResult<List<InvoiceItemsViewDTO>>(
            result.Data,
            "InvoiceItemss retrieved successfully.",
            ErrorType.None
        );
    }
}

