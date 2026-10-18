
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System.Threading;
using System.Threading.Tasks;


[Route("api/invoicereturnss")]
[ApiController]
public class InvoiceReturnsController : ControllerBase
{
  [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
[HttpGet("all", Name = "GetAllInvoiceReturns")]
public async Task<ActionResult> GetAllInvoiceReturns(
    CancellationToken cancellationToken)
{
    var result = await InvoiceReturnsService.GetAllInvoiceReturnsAsync(cancellationToken);
    return ApiResponseHelper.GenerateApiResponse(this, result.ErrorType, result);
}
       [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
[HttpPost(Name = "AddInvoiceReturns")]
public async Task<ActionResult> AddInvoiceReturns(
    [FromBody] InvoiceReturnsDTO dto,
    CancellationToken cancellationToken)
{
    var result = await InvoiceReturnsService.AddInvoiceReturnsAsync(dto, cancellationToken);

    return ApiResponseHelper.GenerateApiResponse(
        this,
        result.ErrorType,
        result,
        newID: result.Data?.ID,
        routeName: nameof(GetInvoiceReturnsByID),routeParamName:"id" );
}
    

 [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
[HttpGet("{id}", Name = "GetInvoiceReturnsByID")]
public async Task<ActionResult> GetInvoiceReturnsByID(
    int id,
    CancellationToken cancellationToken)
{
    var result = await InvoiceReturnsService.GetInvoiceReturnsByIDAsync(
        id,
        cancellationToken);

    return ApiResponseHelper.GenerateApiResponse(this, result.ErrorType, result);
}
}

