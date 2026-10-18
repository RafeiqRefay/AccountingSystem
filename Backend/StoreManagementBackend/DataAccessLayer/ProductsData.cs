
using System;
using System.Collections.Generic;
using System.Data;
using Microsoft.Data.SqlClient;
using System.Threading;
using System.Threading.Tasks;

using ConnectionString;

public static class ProductsData
{
    public static async Task<ApiResult<List<ProductsViewDTO>>> SearchProducts(
    string? NameProduct,
    string? TypeName,
    string? CategorieName,
     bool? OrderByLowestQuantity,
    CancellationToken cancellationToken = default)
    {
        var result = new ApiResult<List<ProductsViewDTO>>();
        var list = new List<ProductsViewDTO>();
        try
        {
            await using var connection = new SqlConnection(connectionString._connectionString);
            await using var command = new SqlCommand("SP_SearchProducts", connection) { CommandType = CommandType.StoredProcedure };
            command.Parameters.Add("@ProductName", SqlDbType.NVarChar).Value = (object?)NameProduct ?? DBNull.Value;
            command.Parameters.Add("@TypeName", SqlDbType.NVarChar).Value = (object?)TypeName ?? DBNull.Value;
            command.Parameters.Add("@CategorieName", SqlDbType.NVarChar).Value = (object?)CategorieName ?? DBNull.Value;
            command.Parameters.Add("@OrderByLowestQuantity", SqlDbType.Bit).Value = (object?)OrderByLowestQuantity ?? DBNull.Value;

            await connection.OpenAsync(cancellationToken).ConfigureAwait(false);
            using var reader = await command.ExecuteReaderAsync(cancellationToken).ConfigureAwait(false);
            while (reader.Read())
            {
                list.Add(new ProductsViewDTO
                {
                    ID = reader.IsDBNull(reader.GetOrdinal("ID")) ? 0 : reader.GetInt32(reader.GetOrdinal("ID")),
                    ProductName = reader.IsDBNull(reader.GetOrdinal("ProductName")) ? null : reader.GetString(reader.GetOrdinal("ProductName")),
                    TypeName = reader.IsDBNull(reader.GetOrdinal("TypeName")) ? null : reader.GetString(reader.GetOrdinal("TypeName")),
                    CategorieName = reader.IsDBNull(reader.GetOrdinal("CategorieName")) ? null : reader.GetString(reader.GetOrdinal("CategorieName")),
                    Quantity = reader.IsDBNull(reader.GetOrdinal("Quantity")) ? 0 : reader.GetInt32(reader.GetOrdinal("Quantity")),
                    Purchase_Price = reader.IsDBNull(reader.GetOrdinal("Purchase_Price")) ? 0 : reader.GetDecimal(reader.GetOrdinal("Purchase_Price")),
                    Sale_Price = reader.IsDBNull(reader.GetOrdinal("Sale_Price")) ? 0 : reader.GetDecimal(reader.GetOrdinal("Sale_Price")),
                    IsStoreOwned = reader.IsDBNull(reader.GetOrdinal("IsStoreOwned")) ? false : reader.GetBoolean(reader.GetOrdinal("IsStoreOwned"))
                });
            }
            result.Data = list;
        }
        catch (Exception ex)
        {
            result.Data = null;
            result.Message = "Database error occurred while fetching data.";
            result.ErrorType = ErrorType.DatabaseError;
        }
        return result;
    }

   

    public static async Task<ApiResult<ProductsViewDTO>> GetProductsByIDAsync(
    int ID,
    CancellationToken cancellationToken = default)
{
    var result = new ApiResult<ProductsViewDTO>();
    var dto = new ProductsViewDTO();
    try
    {
        await using var connection = new SqlConnection(connectionString._connectionString);
        await using var command = new SqlCommand("SP_GetProductsByID", connection) { CommandType = CommandType.StoredProcedure };
        command.Parameters.Add("@ID", SqlDbType.Int).Value = ID;
        var messageParameter = new SqlParameter("@Message", SqlDbType.NVarChar, 250) { Direction = ParameterDirection.Output };
        var errorTypeParameter = new SqlParameter("@ErrorType", SqlDbType.Int) { Direction = ParameterDirection.Output };
        command.Parameters.Add(messageParameter);
        command.Parameters.Add(errorTypeParameter);
        await connection.OpenAsync(cancellationToken).ConfigureAwait(false);
        using var reader = await command.ExecuteReaderAsync(cancellationToken).ConfigureAwait(false);
        if (reader.Read())
        {
            dto.ID = reader.IsDBNull(reader.GetOrdinal("ID")) ? 0 : reader.GetInt32(reader.GetOrdinal("ID"));
            dto.ProductName = reader.IsDBNull(reader.GetOrdinal("ProductName")) ? null : reader.GetString(reader.GetOrdinal("ProductName"));
            dto.TypeName = reader.IsDBNull(reader.GetOrdinal("TypeName")) ? null : reader.GetString(reader.GetOrdinal("TypeName"));
            dto.CategorieName = reader.IsDBNull(reader.GetOrdinal("CategorieName")) ? null : reader.GetString(reader.GetOrdinal("CategorieName"));
            dto.Quantity = reader.IsDBNull(reader.GetOrdinal("Quantity")) ? 0 : reader.GetInt32(reader.GetOrdinal("Quantity"));
            dto.Purchase_Price = reader.IsDBNull(reader.GetOrdinal("Purchase_Price")) ? 0 : reader.GetDecimal(reader.GetOrdinal("Purchase_Price"));
            dto.Sale_Price = reader.IsDBNull(reader.GetOrdinal("Sale_Price")) ? 0 : reader.GetDecimal(reader.GetOrdinal("Sale_Price"));
            dto.IsStoreOwned = reader.IsDBNull(reader.GetOrdinal("IsStoreOwned")) ? false : reader.GetBoolean(reader.GetOrdinal("IsStoreOwned"));
        }
        reader.Close();
        result.Data = dto;
        result.Message = messageParameter.Value?.ToString();
        result.ErrorType = ErrorTypeMapper.GetErrorType(Convert.ToInt32(errorTypeParameter.Value));
    }
    catch (Exception ex)
    {
        result.Data = null;
        result.Message = "Database error occurred while fetching the products";
        result.ErrorType = ErrorType.DatabaseError;
    }
    return result;
}

public static async Task<ApiResult<ProductsDTO>> AddProductsAsync(
    ProductsDTO products,
    CancellationToken cancellationToken = default)
{
    var result = new ApiResult<ProductsDTO>();
    try
    {
        await using var connection = new SqlConnection(connectionString._connectionString);
        await using var command = new SqlCommand("SP_AddProducts", connection) { CommandType = CommandType.StoredProcedure };
            
        command.Parameters.Add("@ProductNameID", SqlDbType.Int).Value = products.ProductNameID;
        command.Parameters.Add("@Type_ID", SqlDbType.Int).Value = products.Type_ID == null ? (object)DBNull.Value : products.Type_ID;
            command.Parameters.Add("@Category_ID", SqlDbType.Int).Value =
    products.Category_ID == null ? (object)DBNull.Value : products.Category_ID;
        command.Parameters.Add("@Quantity", SqlDbType.Int).Value = products.Quantity;
        command.Parameters.Add("@Purchase_Price", SqlDbType.Decimal).Value = products.Purchase_Price;
        command.Parameters.Add("@Sale_Price", SqlDbType.Decimal).Value = products.Sale_Price;
        command.Parameters.Add("@IsStoreOwned", SqlDbType.Bit).Value = products.IsStoreOwned;
        var outputID = new SqlParameter("@NewID", SqlDbType.Int) { Direction = ParameterDirection.Output };
        var outputMsg = new SqlParameter("@Message", SqlDbType.NVarChar, 250) { Direction = ParameterDirection.Output };
        var outputErrorType = new SqlParameter("@ErrorType", SqlDbType.Int) { Direction = ParameterDirection.Output };
        command.Parameters.Add(outputID);
        command.Parameters.Add(outputMsg);
        command.Parameters.Add(outputErrorType);
        await connection.OpenAsync(cancellationToken).ConfigureAwait(false);
        await command.ExecuteNonQueryAsync(cancellationToken).ConfigureAwait(false);
        products.ID = (int)outputID.Value;
        result.Data = products;
        result.Message = outputMsg.Value?.ToString();
        result.ErrorType = ErrorTypeMapper.GetErrorType(Convert.ToInt32(outputErrorType.Value));
    }
    catch (Exception ex)
    {
        result.Data = null;
        result.Message = "Database error occurred while adding the products.";
        result.ErrorType = ErrorType.DatabaseError;
    }
    return result;
}

public static async Task<ApiResult<ProductsUpdateDTO>> UpdateProductsByIDAsync(
    ProductsUpdateDTO products,
    CancellationToken cancellationToken = default)
{
    var result = new ApiResult<ProductsUpdateDTO>();
    try
    {
        await using var connection = new SqlConnection(connectionString._connectionString);
        await using var command = new SqlCommand("SP_UpdateProductsByID", connection) { CommandType = CommandType.StoredProcedure };
        command.Parameters.Add("@ID", SqlDbType.Int).Value = (object?)products.ID ?? DBNull.Value;
            command.Parameters.Add("@ProductNameID", SqlDbType.Int).Value = (object?)products.ProductNameID ?? DBNull.Value;

        command.Parameters.Add("@Type_ID", SqlDbType.Int).Value = (object?)products.Type_ID ?? DBNull.Value;
        command.Parameters.Add("@Category_ID", SqlDbType.Int).Value = (object?)products.Category_ID ?? DBNull.Value;
        command.Parameters.Add("@Quantity", SqlDbType.Int).Value = (object?)products.Quantity ?? DBNull.Value;
        command.Parameters.Add("@Purchase_Price", SqlDbType.Decimal).Value = (object?)products.Purchase_Price ?? DBNull.Value;
        command.Parameters.Add("@Sale_Price", SqlDbType.Decimal).Value = (object?)products.Sale_Price ?? DBNull.Value;
        command.Parameters.Add("@IsStoreOwned", SqlDbType.Bit).Value = (object?)products.IsStoreOwned ?? DBNull.Value;
        var outputMsg = new SqlParameter("@Message", SqlDbType.NVarChar, 250) { Direction = ParameterDirection.Output };
        var outputErrorType = new SqlParameter("@ErrorType", SqlDbType.Int) { Direction = ParameterDirection.Output };
        command.Parameters.Add(outputMsg);
        command.Parameters.Add(outputErrorType);
        await connection.OpenAsync(cancellationToken).ConfigureAwait(false);
        using var reader = await command.ExecuteReaderAsync(cancellationToken).ConfigureAwait(false);
        if (reader.Read())
        {
            products.ID = reader.IsDBNull(reader.GetOrdinal("ID")) ? 0 : reader.GetInt32(reader.GetOrdinal("ID"));
                products.ProductNameID = reader.IsDBNull(reader.GetOrdinal("ProductNameID")) ? 0 : reader.GetInt32(reader.GetOrdinal("ProductNameID"));

            products.Type_ID = reader.IsDBNull(reader.GetOrdinal("Type_ID")) ? 0 : reader.GetInt32(reader.GetOrdinal("Type_ID"));
            products.Category_ID = reader.IsDBNull(reader.GetOrdinal("Category_ID")) ? 0 : reader.GetInt32(reader.GetOrdinal("Category_ID"));
            products.Quantity = reader.IsDBNull(reader.GetOrdinal("Quantity")) ? 0 : reader.GetInt32(reader.GetOrdinal("Quantity"));
            products.Purchase_Price = reader.IsDBNull(reader.GetOrdinal("Purchase_Price")) ? 0 : reader.GetDecimal(reader.GetOrdinal("Purchase_Price"));
            products.Sale_Price = reader.IsDBNull(reader.GetOrdinal("Sale_Price")) ? 0 : reader.GetDecimal(reader.GetOrdinal("Sale_Price"));
            products.IsStoreOwned = reader.IsDBNull(reader.GetOrdinal("IsStoreOwned")) ? false : reader.GetBoolean(reader.GetOrdinal("IsStoreOwned"));
        }
        reader.Close();
        result.Data = products;
        result.Message = outputMsg.Value?.ToString();
        result.ErrorType = ErrorTypeMapper.GetErrorType(Convert.ToInt32(outputErrorType.Value));
    }
    catch (Exception ex)
    {
        result.Data = null;
        result.Message = "Database error occurred while updating the products";
        result.ErrorType = ErrorType.DatabaseError;
    }
    return result;
}

public static async Task<ApiResult<ProductsDTO>> DeleteProductsByIDAsync(
    int iD,
    CancellationToken cancellationToken = default)
{
    var result = new ApiResult<ProductsDTO>();
    var products = new ProductsDTO
    {
        ID = iD,
    };
    try
    {
        await using var connection = new SqlConnection(connectionString._connectionString);
        await using var command = new SqlCommand("SP_DeleteProductsByID", connection) { CommandType = CommandType.StoredProcedure };
        command.Parameters.Add("@ID", SqlDbType.Int).Value = products.ID;
        var outputMsg = new SqlParameter("@Message", SqlDbType.NVarChar, 250) { Direction = ParameterDirection.Output };
        var outputErrorType = new SqlParameter("@ErrorType", SqlDbType.Int) { Direction = ParameterDirection.Output };
        command.Parameters.Add(outputMsg);
        command.Parameters.Add(outputErrorType);
        await connection.OpenAsync(cancellationToken).ConfigureAwait(false);
        await command.ExecuteNonQueryAsync(cancellationToken).ConfigureAwait(false);
        result.Data = products;
        result.Message = outputMsg.Value?.ToString();
        result.ErrorType = ErrorTypeMapper.GetErrorType(Convert.ToInt32(outputErrorType.Value));
    }
    catch (Exception ex)
    {
        result.Data = null;
        result.Message = "Database error occurred while deleting the products";
        result.ErrorType = ErrorType.DatabaseError;
    }
    return result;

}


  

   

}

