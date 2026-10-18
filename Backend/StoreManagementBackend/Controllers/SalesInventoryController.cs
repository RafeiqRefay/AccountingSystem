
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System.Threading;
using System.Threading.Tasks;


[Route("api/salesinventorys")]
[ApiController]
public class SalesInventoryController : ControllerBase
{
  
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]     
[HttpGet("SearchSalesInventory")]
public async Task<ActionResult> SearchSalesInventory(
  [FromQuery] SearchSalesInventoryRequest   request ,
    CancellationToken cancellationToken)
{
    var result = await SalesInventoryService.SearchSalesInventory(
        request.Period, request.FromDate, request.ToDate, request.IsStoreOwned,
        cancellationToken);

    return ApiResponseHelper.GenerateApiResponse(this, result.ErrorType, result);
}

}

