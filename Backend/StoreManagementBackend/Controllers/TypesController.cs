
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System.Threading;
using System.Threading.Tasks;


[Route("api/typess")]
[ApiController]
public class TypesController : ControllerBase
{
  [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
[HttpGet("all", Name = "GetAllTypes")]
public async Task<ActionResult> GetAllTypes(
    CancellationToken cancellationToken)
{
    var result = await TypesService.GetAllTypesAsync(cancellationToken);
    return ApiResponseHelper.GenerateApiResponse(this, result.ErrorType, result);
}

 [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
[HttpGet("{id}", Name = "GetTypesByID")]
public async Task<ActionResult> GetTypesByID(
    int id,
    CancellationToken cancellationToken)
{
    var result = await TypesService.GetTypesByIDAsync(
        id,
        cancellationToken);

    return ApiResponseHelper.GenerateApiResponse(this, result.ErrorType, result);
}
       [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
[HttpPost(Name = "AddTypes")]
public async Task<ActionResult> AddTypes(
    [FromBody] TypesDTO dto,
    CancellationToken cancellationToken)
{
    var result = await TypesService.AddTypesAsync(dto, cancellationToken);

    return ApiResponseHelper.GenerateApiResponse(
        this,
        result.ErrorType,
        result,
        newID: result.Data?.ID,
        routeName: nameof(GetTypesByID),routeParamName:"id" );
}
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
[HttpPut("{id}", Name = "UpdateTypesByID")]
public async Task<ActionResult> UpdateTypesByID(
    int id, [FromBody] TypesUpdateDTO dto,
    CancellationToken cancellationToken)  
{  
      dto.ID=id;

    var result = await TypesService.UpdateTypesByIDAsync(
      dto,
        cancellationToken);

    return ApiResponseHelper.GenerateApiResponse(this, result.ErrorType, result);
}
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
[HttpDelete("{id}", Name = "DeleteTypesByID")]
public async Task<ActionResult> DeleteTypesByID(
    int id, CancellationToken cancellationToken)
{

    var result = await TypesService.DeleteTypesByIDAsync(
        id
        , cancellationToken);

    return ApiResponseHelper.GenerateApiResponse(this, result.ErrorType, result);
}
}

