
using System;
using System.Collections.Generic;
using System.Data;
using Microsoft.Data.SqlClient;
using System.Threading;
using System.Threading.Tasks;

using ConnectionString;

public static class ProductNamesData
{
public static async Task<ApiResult<List<ProductNamesViewDTO>>> GetAllProductNamesAsync(
    CancellationToken cancellationToken = default)
{
    var result = new ApiResult<List<ProductNamesViewDTO>>();
    var list = new List<ProductNamesViewDTO>();
    try
    {
        await using var connection = new SqlConnection(connectionString._connectionString);
        await using var command = new SqlCommand("SP_GetAllProductNames", connection) { CommandType = CommandType.StoredProcedure };
        await connection.OpenAsync(cancellationToken).ConfigureAwait(false);
        using var reader = await command.ExecuteReaderAsync(cancellationToken).ConfigureAwait(false);
        while (reader.Read())
        {
            list.Add(new ProductNamesViewDTO
            {
                ProductNameID = reader.IsDBNull(reader.GetOrdinal("ProductNameID")) ? 0 : reader.GetInt32(reader.GetOrdinal("ProductNameID")),
                ProductName = reader.IsDBNull(reader.GetOrdinal("ProductName")) ? null : reader.GetString(reader.GetOrdinal("ProductName"))
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

public static async Task<ApiResult<ProductNamesViewDTO>> GetProductNamesByProductNameIDAsync(
    int ProductNameID,
    CancellationToken cancellationToken = default)
{
    var result = new ApiResult<ProductNamesViewDTO>();
    var dto = new ProductNamesViewDTO();
    try
    {
        await using var connection = new SqlConnection(connectionString._connectionString);
        await using var command = new SqlCommand("SP_GetProductNamesByProductNameID", connection) { CommandType = CommandType.StoredProcedure };
        command.Parameters.Add("@ProductNameID", SqlDbType.Int).Value = ProductNameID;
        var messageParameter = new SqlParameter("@Message", SqlDbType.NVarChar, 250) { Direction = ParameterDirection.Output };
        var errorTypeParameter = new SqlParameter("@ErrorType", SqlDbType.Int) { Direction = ParameterDirection.Output };
        command.Parameters.Add(messageParameter);
        command.Parameters.Add(errorTypeParameter);
        await connection.OpenAsync(cancellationToken).ConfigureAwait(false);
        using var reader = await command.ExecuteReaderAsync(cancellationToken).ConfigureAwait(false);
        if (reader.Read())
        {
            dto.ProductNameID = reader.IsDBNull(reader.GetOrdinal("ProductNameID")) ? 0 : reader.GetInt32(reader.GetOrdinal("ProductNameID"));
            dto.ProductName = reader.IsDBNull(reader.GetOrdinal("ProductName")) ? null : reader.GetString(reader.GetOrdinal("ProductName"));
        }
        reader.Close();
        result.Data = dto;
        result.Message = messageParameter.Value?.ToString();
        result.ErrorType = ErrorTypeMapper.GetErrorType(Convert.ToInt32(errorTypeParameter.Value));
    }
    catch (Exception ex)
    {
        result.Data = null;
        result.Message = "Database error occurred while fetching the productnames";
        result.ErrorType = ErrorType.DatabaseError;
    }
    return result;
}

public static async Task<ApiResult<ProductNamesDTO>> AddProductNamesAsync(
    ProductNamesDTO productnames,
    CancellationToken cancellationToken = default)
{
    var result = new ApiResult<ProductNamesDTO>();
    try
    {
        await using var connection = new SqlConnection(connectionString._connectionString);
        await using var command = new SqlCommand("SP_AddProductNames", connection) { CommandType = CommandType.StoredProcedure };
        command.Parameters.Add("@ProductName", SqlDbType.NVarChar, 50).Value = (object?)productnames.ProductName ?? DBNull.Value;
        var outputID = new SqlParameter("@NewID", SqlDbType.Int) { Direction = ParameterDirection.Output };
        var outputMsg = new SqlParameter("@Message", SqlDbType.NVarChar, 250) { Direction = ParameterDirection.Output };
        var outputErrorType = new SqlParameter("@ErrorType", SqlDbType.Int) { Direction = ParameterDirection.Output };
        command.Parameters.Add(outputID);
        command.Parameters.Add(outputMsg);
        command.Parameters.Add(outputErrorType);
        await connection.OpenAsync(cancellationToken).ConfigureAwait(false);
        await command.ExecuteNonQueryAsync(cancellationToken).ConfigureAwait(false);
        productnames.ProductNameID = (int)outputID.Value;
        result.Data = productnames;
        result.Message = outputMsg.Value?.ToString();
        result.ErrorType = ErrorTypeMapper.GetErrorType(Convert.ToInt32(outputErrorType.Value));
    }
    catch (Exception ex)
    {
        result.Data = null;
        result.Message = "Database error occurred while adding the productnames.";
        result.ErrorType = ErrorType.DatabaseError;
    }
    return result;
}

public static async Task<ApiResult<ProductNamesUpdateDTO>> UpdateProductNamesByProductNameIDAsync(
    ProductNamesUpdateDTO productnames,
    CancellationToken cancellationToken = default)
{
    var result = new ApiResult<ProductNamesUpdateDTO>();
    try
    {
        await using var connection = new SqlConnection(connectionString._connectionString);
        await using var command = new SqlCommand("SP_UpdateProductNamesByProductNameID", connection) { CommandType = CommandType.StoredProcedure };
        command.Parameters.Add("@ProductNameID", SqlDbType.Int).Value = (object?)productnames.ProductNameID ?? DBNull.Value;
        command.Parameters.Add("@ProductName", SqlDbType.NVarChar, 500).Value = (object?)productnames.ProductName ?? DBNull.Value;
        var outputMsg = new SqlParameter("@Message", SqlDbType.NVarChar, 250) { Direction = ParameterDirection.Output };
        var outputErrorType = new SqlParameter("@ErrorType", SqlDbType.Int) { Direction = ParameterDirection.Output };
        command.Parameters.Add(outputMsg);
        command.Parameters.Add(outputErrorType);
        await connection.OpenAsync(cancellationToken).ConfigureAwait(false);
        using var reader = await command.ExecuteReaderAsync(cancellationToken).ConfigureAwait(false);
        if (reader.Read())
        {
            productnames.ProductNameID = reader.IsDBNull(reader.GetOrdinal("ProductNameID")) ? 0 : reader.GetInt32(reader.GetOrdinal("ProductNameID"));
            productnames.ProductName = reader.IsDBNull(reader.GetOrdinal("ProductName")) ? null : reader.GetString(reader.GetOrdinal("ProductName"));
        }
        reader.Close();
        result.Data = productnames;
        result.Message = outputMsg.Value?.ToString();
        result.ErrorType = ErrorTypeMapper.GetErrorType(Convert.ToInt32(outputErrorType.Value));
    }
    catch (Exception ex)
    {
        result.Data = null;
        result.Message = "Database error occurred while updating the productnames";
        result.ErrorType = ErrorType.DatabaseError;
    }
    return result;
}

public static async Task<ApiResult<ProductNamesDTO>> DeleteProductNamesByProductNameIDAsync(
    int productNameID,
    CancellationToken cancellationToken = default)
{
    var result = new ApiResult<ProductNamesDTO>();
    var productnames = new ProductNamesDTO
    {
        ProductNameID = productNameID,
    };
    try
    {
        await using var connection = new SqlConnection(connectionString._connectionString);
        await using var command = new SqlCommand("SP_DeleteProductNamesByProductNameID", connection) { CommandType = CommandType.StoredProcedure };
        command.Parameters.Add("@ProductNameID", SqlDbType.Int).Value = productnames.ProductNameID;
        var outputMsg = new SqlParameter("@Message", SqlDbType.NVarChar, 250) { Direction = ParameterDirection.Output };
        var outputErrorType = new SqlParameter("@ErrorType", SqlDbType.Int) { Direction = ParameterDirection.Output };
        command.Parameters.Add(outputMsg);
        command.Parameters.Add(outputErrorType);
        await connection.OpenAsync(cancellationToken).ConfigureAwait(false);
        await command.ExecuteNonQueryAsync(cancellationToken).ConfigureAwait(false);
        result.Data = productnames;
        result.Message = outputMsg.Value?.ToString();
        result.ErrorType = ErrorTypeMapper.GetErrorType(Convert.ToInt32(outputErrorType.Value));
    }
    catch (Exception ex)
    {
        result.Data = null;
        result.Message = "Database error occurred while deleting the productnames";
        result.ErrorType = ErrorType.DatabaseError;
    }
    return result;
}

}

