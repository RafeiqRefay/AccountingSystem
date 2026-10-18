
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System.Threading;
using System.Threading.Tasks;


[Route("api/productnames")]
[ApiController]
public class ProductNamesController : ControllerBase
{
  [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
[HttpGet("all", Name = "GetAllProductNames")]
public async Task<ActionResult> GetAllProductNames(
    CancellationToken cancellationToken)
{
    var result = await ProductNamesService.GetAllProductNamesAsync(cancellationToken);
    return ApiResponseHelper.GenerateApiResponse(this, result.ErrorType, result);
}

 [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
[HttpGet("{productnameid}", Name = "GetProductNamesByProductNameID")]
public async Task<ActionResult> GetProductNamesByProductNameID(
    int productnameid,
    CancellationToken cancellationToken)
{
    var result = await ProductNamesService.GetProductNamesByProductNameIDAsync(
        productnameid,
        cancellationToken);

    return ApiResponseHelper.GenerateApiResponse(this, result.ErrorType, result);
}
       [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
[HttpPost(Name = "AddProductNames")]
public async Task<ActionResult> AddProductNames(
    [FromBody] ProductNamesDTO dto,
    CancellationToken cancellationToken)
{
    var result = await ProductNamesService.AddProductNamesAsync(dto, cancellationToken);

    return ApiResponseHelper.GenerateApiResponse(
        this,
        result.ErrorType,
        result,
        newID: result.Data?.ProductNameID,
        routeName: nameof(GetProductNamesByProductNameID),routeParamName:"productnameid" );
}
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
[HttpPut("{productnameid}", Name = "UpdateProductNamesByProductNameID")]
public async Task<ActionResult> UpdateProductNamesByProductNameID(
    int productnameid, [FromBody] ProductNamesUpdateDTO dto,
    CancellationToken cancellationToken)  
{  
      dto.ProductNameID=productnameid;

    var result = await ProductNamesService.UpdateProductNamesByProductNameIDAsync(
      dto,
        cancellationToken);

    return ApiResponseHelper.GenerateApiResponse(this, result.ErrorType, result);
}
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
[HttpDelete("{productnameid}", Name = "DeleteProductNamesByProductNameID")]
public async Task<ActionResult> DeleteProductNamesByProductNameID(
    int productnameid, CancellationToken cancellationToken)
{

    var result = await ProductNamesService.DeleteProductNamesByProductNameIDAsync(
        productnameid
        , cancellationToken);

    return ApiResponseHelper.GenerateApiResponse(this, result.ErrorType, result);
}
}

