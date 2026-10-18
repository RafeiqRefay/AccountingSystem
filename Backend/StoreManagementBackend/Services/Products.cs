
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

public static class ProductsService
{

    public static async Task<ApiResult<List<ProductsViewDTO>>> SearchProducts(
    string? NameProduct, string? TypeName, string ? CategorieName, bool ? OrderByLowestQuantity, 
    CancellationToken cancellationToken = default)
    {
        var result = await ProductsData.SearchProducts(
            NameProduct, TypeName, CategorieName,OrderByLowestQuantity,
            cancellationToken);

        if (result.Data == null || result.Data.Count == 0)
        {
            return new ApiResult<List<ProductsViewDTO>>(
                null,
                "No Products found.",
                ErrorType.NotFound
            );
        }

        return new ApiResult<List<ProductsViewDTO>>(
            result.Data,
            "Products retrieved successfully.",
            ErrorType.None
        );
    }

 


    public static async Task<ApiResult<ProductsViewDTO>> GetProductsByIDAsync(
    int ID,
    CancellationToken cancellationToken = default)
{
  
    return await ProductsData.GetProductsByIDAsync(
        ID,
        cancellationToken);
}


public static async Task<ApiResult<ProductsDTO>> AddProductsAsync(
    ProductsDTO dto,
    CancellationToken cancellationToken = default)
{
    if (dto == null)
    {
        return new ApiResult<ProductsDTO>
        {
            Data = null,
            Message = "Products cannot be null.",
            ErrorType = ErrorType.InvalidId
        };
    }

    return await ProductsData.AddProductsAsync(dto, cancellationToken);
}



 
    public static async Task<ApiResult<ProductsUpdateDTO>> UpdateProductsByIDAsync(
    ProductsUpdateDTO dto,
    CancellationToken cancellationToken = default)
{
    if (dto == null )
    {
        return new ApiResult<ProductsUpdateDTO>
        {
            Data = null,
            Message = "Invalid Products data.",
            ErrorType = ErrorType.InvalidId
        };
    }

    return await ProductsData.UpdateProductsByIDAsync(dto, cancellationToken);
}


public static async Task<ApiResult<ProductsDTO>> DeleteProductsByIDAsync(
    int ID,
    CancellationToken cancellationToken = default)
{
   

    return await ProductsData.DeleteProductsByIDAsync(
        ID,
        cancellationToken);
}

 
}

