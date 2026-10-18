
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System.Threading;
using System.Threading.Tasks;


[Route("api/categoriess")]
[ApiController]
public class CategoriesController : ControllerBase
{
  [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
[HttpGet("all", Name = "GetAllCategories")]
public async Task<ActionResult> GetAllCategories(
    CancellationToken cancellationToken)
{
    var result = await CategoriesService.GetAllCategoriesAsync(cancellationToken);
    return ApiResponseHelper.GenerateApiResponse(this, result.ErrorType, result);
}

 [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
[HttpGet("{id}", Name = "GetCategoriesByID")]
public async Task<ActionResult> GetCategoriesByID(
    int id,
    CancellationToken cancellationToken)
{
    var result = await CategoriesService.GetCategoriesByIDAsync(
        id,
        cancellationToken);

    return ApiResponseHelper.GenerateApiResponse(this, result.ErrorType, result);
}
       [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
[HttpPost(Name = "AddCategories")]
public async Task<ActionResult> AddCategories(
    [FromBody] CategoriesDTO dto,
    CancellationToken cancellationToken)
{
    var result = await CategoriesService.AddCategoriesAsync(dto, cancellationToken);

    return ApiResponseHelper.GenerateApiResponse(
        this,
        result.ErrorType,
        result,
        newID: result.Data?.ID,
        routeName: nameof(GetCategoriesByID),routeParamName:"id" );
}
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
[HttpPut("{id}", Name = "UpdateCategoriesByID")]
public async Task<ActionResult> UpdateCategoriesByID(
    int id, [FromBody] CategoriesUpdateDTO dto,
    CancellationToken cancellationToken)  
{  
      dto.ID=id;

    var result = await CategoriesService.UpdateCategoriesByIDAsync(
      dto,
        cancellationToken);

    return ApiResponseHelper.GenerateApiResponse(this, result.ErrorType, result);
}
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
[HttpDelete("{id}", Name = "DeleteCategoriesByID")]
public async Task<ActionResult> DeleteCategoriesByID(
    int id, CancellationToken cancellationToken)
{

    var result = await CategoriesService.DeleteCategoriesByIDAsync(
        id
        , cancellationToken);

    return ApiResponseHelper.GenerateApiResponse(this, result.ErrorType, result);
}
}

