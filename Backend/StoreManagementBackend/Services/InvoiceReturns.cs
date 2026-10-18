
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

public static class InvoiceReturnsService
{



public static async Task<ApiResult<List<InvoiceReturnsViewDTO>>> GetAllInvoiceReturnsAsync(
    CancellationToken cancellationToken = default)
{
    var result = await InvoiceReturnsData.GetAllInvoiceReturnsAsync(cancellationToken);

    if (result.Data == null || result.Data.Count == 0)
    {
        return new ApiResult<List<InvoiceReturnsViewDTO>>(
            null,
            "No InvoiceReturnss found.",
            ErrorType.NotFound
        );
    }

    return new ApiResult<List<InvoiceReturnsViewDTO>>(
        result.Data,
        "InvoiceReturnss retrieved successfully.",
        ErrorType.None
    );
}


public static async Task<ApiResult<InvoiceReturnsDTO>> AddInvoiceReturnsAsync(
    InvoiceReturnsDTO dto,
    CancellationToken cancellationToken = default)
{
    if (dto == null)
    {
        return new ApiResult<InvoiceReturnsDTO>
        {
            Data = null,
            Message = "InvoiceReturns cannot be null.",
            ErrorType = ErrorType.InvalidId
        };
    }

    return await InvoiceReturnsData.AddInvoiceReturnsAsync(dto, cancellationToken);
}




public static async Task<ApiResult<InvoiceReturnsViewDTO>> GetInvoiceReturnsByIDAsync(
    int ID,
    CancellationToken cancellationToken = default)
{
  
    return await InvoiceReturnsData.GetInvoiceReturnsByIDAsync(
        ID,
        cancellationToken);
}

}

