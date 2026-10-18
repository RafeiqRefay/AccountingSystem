
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

public static class CategoriesService
{

public static async Task<ApiResult<List<CategoriesViewDTO>>> GetAllCategoriesAsync(
    CancellationToken cancellationToken = default)
{
    var result = await CategoriesData.GetAllCategoriesAsync(cancellationToken);

    if (result.Data == null || result.Data.Count == 0)
    {
        return new ApiResult<List<CategoriesViewDTO>>(
            null,
            "No Categoriess found.",
            ErrorType.NotFound
        );
    }

    return new ApiResult<List<CategoriesViewDTO>>(
        result.Data,
        "Categoriess retrieved successfully.",
        ErrorType.None
    );
}



public static async Task<ApiResult<CategoriesViewDTO>> GetCategoriesByIDAsync(
    int ID,
    CancellationToken cancellationToken = default)
{
  
    return await CategoriesData.GetCategoriesByIDAsync(
        ID,
        cancellationToken);
}


public static async Task<ApiResult<CategoriesDTO>> AddCategoriesAsync(
    CategoriesDTO dto,
    CancellationToken cancellationToken = default)
{
    if (dto == null)
    {
        return new ApiResult<CategoriesDTO>
        {
            Data = null,
            Message = "Categories cannot be null.",
            ErrorType = ErrorType.InvalidId
        };
    }

    return await CategoriesData.AddCategoriesAsync(dto, cancellationToken);
}


public static async Task<ApiResult<CategoriesUpdateDTO>> UpdateCategoriesByIDAsync(
    CategoriesUpdateDTO dto,
    CancellationToken cancellationToken = default)
{
    if (dto == null )
    {
        return new ApiResult<CategoriesUpdateDTO>
        {
            Data = null,
            Message = "Invalid Categories data.",
            ErrorType = ErrorType.InvalidId
        };
    }

    return await CategoriesData.UpdateCategoriesByIDAsync(dto, cancellationToken);
}


public static async Task<ApiResult<CategoriesDTO>> DeleteCategoriesByIDAsync(
    int ID,
    CancellationToken cancellationToken = default)
{
   

    return await CategoriesData.DeleteCategoriesByIDAsync(
        ID,
        cancellationToken);
}

}

