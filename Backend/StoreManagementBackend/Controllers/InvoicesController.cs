using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System.Threading;
using System.Threading.Tasks;


[Route("api/invoicess")]
[ApiController]
public class InvoicesController : ControllerBase
{
  [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]



    [HttpGet("GetAllInvoicesByDate")]
    public async Task<ActionResult> GetAllInvoicesByDate(
    [FromQuery] GetInvoicesByDateRequest request,
    CancellationToken cancellationToken)
    {
        var result = await InvoicesService.GetAllInvoicesByDateAsync(
            request.FromDate,
            request.ToDate,
            cancellationToken);

        return ApiResponseHelper.GenerateApiResponse(this, result.ErrorType, result);
    }

    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
[HttpGet("{id}", Name = "GetInvoicesByID")]
public async Task<ActionResult> GetInvoicesByID(
    int id,
    CancellationToken cancellationToken)
{
    var result = await InvoicesService.GetInvoicesByIDAsync(
        id,
        cancellationToken);

    return ApiResponseHelper.GenerateApiResponse(this, result.ErrorType, result);
}





    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    [HttpPost(Name = "AddInvoice")]
    public async Task<ActionResult> AddInvoice(
     [FromBody] List<InvoiceItemDTO> invoices,
     CancellationToken cancellationToken)
    {
        var result = await InvoicesService.AddInvoiceAsync(invoices, cancellationToken);

        return ApiResponseHelper.GenerateApiResponse(
            this,
            result.ErrorType,
            result,
            newID: result.Data?.ID,
            routeName: nameof(GetInvoicesByID),
            routeParamName: "id"
        );
    }

    //[HttpGet("check-available/{productID}", Name = "CheckProductAvailable")]
    //public async Task<ActionResult<CheckCartProductResponse>> CheckProductAvailable(
    //int productID,
    //CancellationToken cancellationToken)
    //{
    //    var result = await ProductsService.CheckProductAvailableAsync(productID, cancellationToken);
    //    return Ok(result);
    //}
}

