
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

public static class ProductNamesService
{

public static async Task<ApiResult<List<ProductNamesViewDTO>>> GetAllProductNamesAsync(
    CancellationToken cancellationToken = default)
{
    var result = await ProductNamesData.GetAllProductNamesAsync(cancellationToken);

    if (result.Data == null || result.Data.Count == 0)
    {
        return new ApiResult<List<ProductNamesViewDTO>>(
            null,
            "No ProductNamess found.",
            ErrorType.NotFound
        );
    }

    return new ApiResult<List<ProductNamesViewDTO>>(
        result.Data,
        "ProductNamess retrieved successfully.",
        ErrorType.None
    );
}



public static async Task<ApiResult<ProductNamesViewDTO>> GetProductNamesByProductNameIDAsync(
    int ProductNameID,
    CancellationToken cancellationToken = default)
{
  
    return await ProductNamesData.GetProductNamesByProductNameIDAsync(
        ProductNameID,
        cancellationToken);
}


public static async Task<ApiResult<ProductNamesDTO>> AddProductNamesAsync(
    ProductNamesDTO dto,
    CancellationToken cancellationToken = default)
{
    if (dto == null)
    {
        return new ApiResult<ProductNamesDTO>
        {
            Data = null,
            Message = "ProductNames cannot be null.",
            ErrorType = ErrorType.InvalidId
        };
    }

    return await ProductNamesData.AddProductNamesAsync(dto, cancellationToken);
}


public static async Task<ApiResult<ProductNamesUpdateDTO>> UpdateProductNamesByProductNameIDAsync(
    ProductNamesUpdateDTO dto,
    CancellationToken cancellationToken = default)
{
    if (dto == null )
    {
        return new ApiResult<ProductNamesUpdateDTO>
        {
            Data = null,
            Message = "Invalid ProductNames data.",
            ErrorType = ErrorType.InvalidId
        };
    }

    return await ProductNamesData.UpdateProductNamesByProductNameIDAsync(dto, cancellationToken);
}


public static async Task<ApiResult<ProductNamesDTO>> DeleteProductNamesByProductNameIDAsync(
    int ProductNameID,
    CancellationToken cancellationToken = default)
{
   

    return await ProductNamesData.DeleteProductNamesByProductNameIDAsync(
        ProductNameID,
        cancellationToken);
}

}

