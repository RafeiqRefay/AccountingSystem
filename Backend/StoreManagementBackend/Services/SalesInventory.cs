
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

public static class SalesInventoryService
{

public static async Task<ApiResult<List<SalesInventoryViewDTO>>> SearchSalesInventory(
    int? Period, DateTime? FromDate, DateTime? ToDate, bool? IsStoreOwned,
    CancellationToken cancellationToken = default)
{
    var result = await SalesInventoryData.SearchSalesInventory(
        Period, FromDate, ToDate, IsStoreOwned,
        cancellationToken);

    if (result.Data == null || result.Data.Count == 0)
    {
        return new ApiResult<List<SalesInventoryViewDTO>>(
            null,
            "No SalesInventorys found.",
            ErrorType.NotFound
        );
    }

    return new ApiResult<List<SalesInventoryViewDTO>>(
        result.Data,
        "SalesInventorys retrieved successfully.",
        ErrorType.None
    );
}



}

