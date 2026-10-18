
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System.Threading;
using System.Threading.Tasks;


[Route("api/expensess")]
[ApiController]
public class ExpensesController : ControllerBase
{
  [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
[HttpGet("all", Name = "GetAllExpenses")]
public async Task<ActionResult> GetAllExpenses(
    CancellationToken cancellationToken)
{
    var result = await ExpensesService.GetAllExpensesAsync(cancellationToken);
    return ApiResponseHelper.GenerateApiResponse(this, result.ErrorType, result);
}

 [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
[HttpGet("{id}", Name = "GetExpensesByID")]
public async Task<ActionResult> GetExpensesByID(
    int id,
    CancellationToken cancellationToken)
{
    var result = await ExpensesService.GetExpensesByIDAsync(
        id,
        cancellationToken);

    return ApiResponseHelper.GenerateApiResponse(this, result.ErrorType, result);
}
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
[HttpPost(Name = "AddExpenses")]
public async Task<ActionResult> AddExpenses(
    [FromBody] ExpensesDTO dto,
    CancellationToken cancellationToken)
{
    var result = await ExpensesService.AddExpensesAsync(dto, cancellationToken);

    return ApiResponseHelper.GenerateApiResponse(
        this,
        result.ErrorType,
        result,
        newID: result.Data?.ID,
        routeName: nameof(GetExpensesByID),routeParamName:"id" );
}
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
[HttpPut("{id}", Name = "UpdateExpensesByID")]
public async Task<ActionResult> UpdateExpensesByID(
    int id, [FromBody] ExpensesUpdateDTO dto,
    CancellationToken cancellationToken)  
{  
      dto.ID=id;

    var result = await ExpensesService.UpdateExpensesByIDAsync(
      dto,
        cancellationToken);

    return ApiResponseHelper.GenerateApiResponse(this, result.ErrorType, result);
}
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
[HttpDelete("{id}", Name = "DeleteExpensesByID")]
public async Task<ActionResult> DeleteExpensesByID(
    int id, CancellationToken cancellationToken)
{

    var result = await ExpensesService.DeleteExpensesByIDAsync(
        id
        , cancellationToken);

    return ApiResponseHelper.GenerateApiResponse(this, result.ErrorType, result);
}
}

