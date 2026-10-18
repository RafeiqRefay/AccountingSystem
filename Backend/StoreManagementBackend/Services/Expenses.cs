
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

public static class ExpensesService
{

public static async Task<ApiResult<List<ExpensesViewDTO>>> GetAllExpensesAsync(
    CancellationToken cancellationToken = default)
{
    var result = await ExpensesData.GetAllExpensesAsync(cancellationToken);

    if (result.Data == null || result.Data.Count == 0)
    {
        return new ApiResult<List<ExpensesViewDTO>>(
            null,
            "No Expensess found.",
            ErrorType.NotFound
        );
    }

    return new ApiResult<List<ExpensesViewDTO>>(
        result.Data,
        "Expensess retrieved successfully.",
        ErrorType.None
    );
}





public static async Task<ApiResult<ExpensesViewDTO>> GetExpensesByIDAsync(
    int ID,
    CancellationToken cancellationToken = default)
{
  
    return await ExpensesData.GetExpensesByIDAsync(
        ID,
        cancellationToken);
}


public static async Task<ApiResult<ExpensesDTO>> AddExpensesAsync(
    ExpensesDTO dto,
    CancellationToken cancellationToken = default)
{
    if (dto == null)
    {
        return new ApiResult<ExpensesDTO>
        {
            Data = null,
            Message = "Expenses cannot be null.",
            ErrorType = ErrorType.InvalidId
        };
    }

    return await ExpensesData.AddExpensesAsync(dto, cancellationToken);
}


public static async Task<ApiResult<ExpensesUpdateDTO>> UpdateExpensesByIDAsync(
    ExpensesUpdateDTO dto,
    CancellationToken cancellationToken = default)
{
    if (dto == null )
    {
        return new ApiResult<ExpensesUpdateDTO>
        {
            Data = null,
            Message = "Invalid Expenses data.",
            ErrorType = ErrorType.InvalidId
        };
    }

    return await ExpensesData.UpdateExpensesByIDAsync(dto, cancellationToken);
}


public static async Task<ApiResult<ExpensesDTO>> DeleteExpensesByIDAsync(
    int ID,
    CancellationToken cancellationToken = default)
{
   

    return await ExpensesData.DeleteExpensesByIDAsync(
        ID,
        cancellationToken);
}

}

