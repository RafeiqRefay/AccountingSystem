
using System;
using System.Collections.Generic;
using System.Data;
using Microsoft.Data.SqlClient;
using System.Threading;
using System.Threading.Tasks;

using ConnectionString;

public static class InvoiceReturnsData
{


public static async Task<ApiResult<List<InvoiceReturnsViewDTO>>> GetAllInvoiceReturnsAsync(
    CancellationToken cancellationToken = default)
{
    var result = new ApiResult<List<InvoiceReturnsViewDTO>>();
    var list = new List<InvoiceReturnsViewDTO>();
    try
    {
        await using var connection = new SqlConnection(connectionString._connectionString);
        await using var command = new SqlCommand("SP_GetAllInvoiceReturns", connection) { CommandType = CommandType.StoredProcedure };
        await connection.OpenAsync(cancellationToken).ConfigureAwait(false);
        using var reader = await command.ExecuteReaderAsync(cancellationToken).ConfigureAwait(false);
        while (reader.Read())
        {
            list.Add(new InvoiceReturnsViewDTO
            {
                ID = reader.IsDBNull(reader.GetOrdinal("ID")) ? 0 : reader.GetInt32(reader.GetOrdinal("ID")),
                InvoiceItemID = reader.IsDBNull(reader.GetOrdinal("InvoiceItemID")) ? 0 : reader.GetInt32(reader.GetOrdinal("InvoiceItemID")),
                ReturnPrice = reader.IsDBNull(reader.GetOrdinal("ReturnPrice")) ? 0 : reader.GetDecimal(reader.GetOrdinal("ReturnPrice")),
                ReturnDate = reader.IsDBNull(reader.GetOrdinal("ReturnDate")) ? DateTime.MinValue : reader.GetDateTime(reader.GetOrdinal("ReturnDate")),
                Qty = reader.IsDBNull(reader.GetOrdinal("Qty")) ? 0 : reader.GetInt32(reader.GetOrdinal("Qty")),
                CostPrice = reader.IsDBNull(reader.GetOrdinal("CostPrice")) ? 0 : reader.GetDecimal(reader.GetOrdinal("CostPrice")),
                ProductName = reader.IsDBNull(reader.GetOrdinal("ProductName")) ? null : reader.GetString(reader.GetOrdinal("ProductName")),
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

public static async Task<ApiResult<InvoiceReturnsDTO>> AddInvoiceReturnsAsync(
    InvoiceReturnsDTO invoicereturns,
    CancellationToken cancellationToken = default)
{
    var result = new ApiResult<InvoiceReturnsDTO>();
    try
    {
        await using var connection = new SqlConnection(connectionString._connectionString);
        await using var command = new SqlCommand("SP_AddInvoiceReturns", connection) { CommandType = CommandType.StoredProcedure };
        command.Parameters.Add("@InvoiceItemID", SqlDbType.Int).Value = invoicereturns.InvoiceItemID;
        var outputID = new SqlParameter("@NewID", SqlDbType.Int) { Direction = ParameterDirection.Output };
        var outputMsg = new SqlParameter("@Message", SqlDbType.NVarChar, 250) { Direction = ParameterDirection.Output };
        var outputErrorType = new SqlParameter("@ErrorType", SqlDbType.Int) { Direction = ParameterDirection.Output };
        command.Parameters.Add(outputID);
        command.Parameters.Add(outputMsg);
        command.Parameters.Add(outputErrorType);
        await connection.OpenAsync(cancellationToken).ConfigureAwait(false);
        await command.ExecuteNonQueryAsync(cancellationToken).ConfigureAwait(false);
        invoicereturns.ID = (int)outputID.Value;
        result.Data = invoicereturns;
        result.Message = outputMsg.Value?.ToString();
        result.ErrorType = ErrorTypeMapper.GetErrorType(Convert.ToInt32(outputErrorType.Value));
    }
    catch (Exception ex)
    {
        result.Data = null;
        result.Message = "Database error occurred while adding the invoicereturns.";
        result.ErrorType = ErrorType.DatabaseError;
    }
    return result;
}





public static async Task<ApiResult<InvoiceReturnsViewDTO>> GetInvoiceReturnsByIDAsync(
    int ID,
    CancellationToken cancellationToken = default)
{
    var result = new ApiResult<InvoiceReturnsViewDTO>();
    var dto = new InvoiceReturnsViewDTO();
    try
    {
        await using var connection = new SqlConnection(connectionString._connectionString);
        await using var command = new SqlCommand("SP_GetInvoiceReturnsByID", connection) { CommandType = CommandType.StoredProcedure };
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
            dto.InvoiceItemID = reader.IsDBNull(reader.GetOrdinal("InvoiceItemID")) ? 0 : reader.GetInt32(reader.GetOrdinal("InvoiceItemID"));
            dto.ReturnPrice = reader.IsDBNull(reader.GetOrdinal("ReturnPrice")) ? 0 : reader.GetDecimal(reader.GetOrdinal("ReturnPrice"));
            dto.ReturnDate = reader.IsDBNull(reader.GetOrdinal("ReturnDate")) ? DateTime.MinValue : reader.GetDateTime(reader.GetOrdinal("ReturnDate"));
            dto.Qty = reader.IsDBNull(reader.GetOrdinal("Qty")) ? 0 : reader.GetInt32(reader.GetOrdinal("Qty"));
            dto.CostPrice = reader.IsDBNull(reader.GetOrdinal("CostPrice")) ? 0 : reader.GetDecimal(reader.GetOrdinal("CostPrice"));
            dto.ProductName = reader.IsDBNull(reader.GetOrdinal("ProductName")) ? null : reader.GetString(reader.GetOrdinal("ProductName"));
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
        result.Message = "Database error occurred while fetching the invoicereturns";
        result.ErrorType = ErrorType.DatabaseError;
    }
    return result;
}

}

