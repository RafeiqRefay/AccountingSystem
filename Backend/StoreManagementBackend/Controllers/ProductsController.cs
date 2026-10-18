
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System.Threading;
using System.Threading.Tasks;


[Route("api/productss")]
[ApiController]



public class ProductsController : ControllerBase
{


    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]

   

    [HttpGet("searchProduct")]
    public async Task<ActionResult> SearchProducts([FromQuery] SearchProductsRequest request, CancellationToken cancellationToken)

    {
        var result = await ProductsService.SearchProducts(
            request.NameProduct, request.TypeName, request.CategorieName, request.OrderByLowestQuantity,
            cancellationToken);

        return ApiResponseHelper.GenerateApiResponse(this, result.ErrorType, result);
    }




   

  
    [HttpGet("{id}", Name = "GetProductsByID")]
public async Task<ActionResult> GetProductsByID(
    int id,
    CancellationToken cancellationToken)
{
    var result = await ProductsService.GetProductsByIDAsync(
        id,
        cancellationToken);

    return ApiResponseHelper.GenerateApiResponse(this, result.ErrorType, result);
}
       [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
[HttpPost(Name = "AddProducts")]
public async Task<ActionResult> AddProducts(
    [FromBody] ProductsDTO dto,
    CancellationToken cancellationToken)
{
    var result = await ProductsService.AddProductsAsync(dto, cancellationToken);

    return ApiResponseHelper.GenerateApiResponse(
        this,
        result.ErrorType,
        result,
        newID: result.Data?.ID,
        routeName: nameof(GetProductsByID),routeParamName:"id" );
}
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
[HttpPut("{id}", Name = "UpdateProductsByID")]
public async Task<ActionResult> UpdateProductsByID(
    int id, [FromBody] ProductsUpdateDTO dto,
    CancellationToken cancellationToken)  
{  
      dto.ID=id;

    var result = await ProductsService.UpdateProductsByIDAsync(
      dto,
        cancellationToken);

    return ApiResponseHelper.GenerateApiResponse(this, result.ErrorType, result);
}
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
[HttpDelete("{id}", Name = "DeleteProductsByID")]
public async Task<ActionResult> DeleteProductsByID(
    int id, CancellationToken cancellationToken)
{

    var result = await ProductsService.DeleteProductsByIDAsync(
        id
        , cancellationToken);

    return ApiResponseHelper.GenerateApiResponse(this, result.ErrorType, result);
}

    //[ProducesResponseType(StatusCodes.Status200OK)]
    //[ProducesResponseType(StatusCodes.Status400BadRequest)]
    //[ProducesResponseType(StatusCodes.Status500InternalServerError)]
    //[HttpPost("check-stock", Name = "CheckProductStock")]
    //public async Task<ActionResult<CheckStockResponse>> CheckProductStock(
    //  [FromBody] CheckStockRequest request,
    //  CancellationToken cancellationToken)
    //{
    //    if (request == null || request.RequestedQty <= 0)
    //    {
    //        return BadRequest(new CheckStockResponse
    //        {
    //            Success = false,
    //            Message = "Invalid request data."
    //        });
    //    }

    //    var result = await ProductsService.CheckProductStockAsync(
    //        request.ProductID,
    //        request.RequestedQty,
    //        cancellationToken
    //    );

    //    return Ok(result);
    //}

    //[ProducesResponseType(StatusCodes.Status200OK)]
    //[ProducesResponseType(StatusCodes.Status400BadRequest)]
    //[ProducesResponseType(StatusCodes.Status500InternalServerError)]
    //[HttpPost("check-available", Name = "CheckProductAvailable")]
    //public async Task<ActionResult<CheckCartProductResponse>> CheckProductAvailable(
    //[FromBody] CheckCartProductRequest request,
    //CancellationToken cancellationToken)
    //{
    //    if (request == null || request.ProductID <= 0)
    //    {
    //        return BadRequest(new CheckCartProductResponse
    //        {
    //            Success = false,
    //            Message = "Invalid request data."
    //        });
    //    }

    //    var result = await ProductsService.CheckProductAvailableAsync(
    //        request.ProductID,
    //        cancellationToken
    //    );

    //    return Ok(result);
    //}
}

