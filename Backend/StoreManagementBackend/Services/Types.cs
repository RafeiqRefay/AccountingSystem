
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

public static class TypesService
{

public static async Task<ApiResult<List<TypesViewDTO>>> GetAllTypesAsync(
    CancellationToken cancellationToken = default)
{
    var result = await TypesData.GetAllTypesAsync(cancellationToken);

    if (result.Data == null || result.Data.Count == 0)
    {
        return new ApiResult<List<TypesViewDTO>>(
            null,
            "No Typess found.",
            ErrorType.NotFound
        );
    }

    return new ApiResult<List<TypesViewDTO>>(
        result.Data,
        "Typess retrieved successfully.",
        ErrorType.None
    );
}



public static async Task<ApiResult<TypesViewDTO>> GetTypesByIDAsync(
    int ID,
    CancellationToken cancellationToken = default)
{
  
    return await TypesData.GetTypesByIDAsync(
        ID,
        cancellationToken);
}


public static async Task<ApiResult<TypesDTO>> AddTypesAsync(
    TypesDTO dto,
    CancellationToken cancellationToken = default)
{
    if (dto == null)
    {
        return new ApiResult<TypesDTO>
        {
            Data = null,
            Message = "Types cannot be null.",
            ErrorType = ErrorType.InvalidId
        };
    }

    return await TypesData.AddTypesAsync(dto, cancellationToken);
}


public static async Task<ApiResult<TypesUpdateDTO>> UpdateTypesByIDAsync(
    TypesUpdateDTO dto,
    CancellationToken cancellationToken = default)
{
    if (dto == null )
    {
        return new ApiResult<TypesUpdateDTO>
        {
            Data = null,
            Message = "Invalid Types data.",
            ErrorType = ErrorType.InvalidId
        };
    }

    return await TypesData.UpdateTypesByIDAsync(dto, cancellationToken);
}


public static async Task<ApiResult<TypesDTO>> DeleteTypesByIDAsync(
    int ID,
    CancellationToken cancellationToken = default)
{
   

    return await TypesData.DeleteTypesByIDAsync(
        ID,
        cancellationToken);
}

}

