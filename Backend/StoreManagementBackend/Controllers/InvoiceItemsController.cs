using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace StoreManagementBackend.Controllers
{
    [Route("api/InvoiceItemss")]
    [ApiController]
    public class InvoiceItemsController : ControllerBase
    {

        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
[HttpGet("SearchInvoiceItems")]
public async Task<ActionResult> SearchInvoiceItems(
  [FromQuery] SearchInvoiceItemsRequest request,
    CancellationToken cancellationToken)
        {
            var result = await InvoiceItemsService.SearchInvoiceItems(
                request.ProductID, request.IsStoreOwned,request.FromDate, request.ToDate,
                cancellationToken);

            return ApiResponseHelper.GenerateApiResponse(this, result.ErrorType, result);
        }



        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [HttpGet("GetInvoiceItemByInvoiceID")]
        public async Task<ActionResult> GetInvoiceItemByInvoiceID(
 int InvoiceID,
CancellationToken cancellationToken)
        {
            var result = await InvoiceItemsService.GetInvoiceItemByInvoiceID(
                   InvoiceID,
                cancellationToken);

            return ApiResponseHelper.GenerateApiResponse(this, result.ErrorType, result);
        }


    }
}
