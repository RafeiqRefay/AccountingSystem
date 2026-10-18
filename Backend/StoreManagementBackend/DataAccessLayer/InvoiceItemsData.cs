

using System;
using System.Collections.Generic;
using System.Data;
using Microsoft.Data.SqlClient;
using System.Threading;
using System.Threading.Tasks;

using ConnectionString;


    public class InvoiceItemsData
    {


    public static async Task<ApiResult<List<InvoiceItemsViewDTO>>> SearchInvoiceItems(
int? ProductID,
bool? IsStoreOwned, DateTime? FromDate, DateTime? ToDate,
    CancellationToken cancellationToken = default)
    {
        var result = new ApiResult<List<InvoiceItemsViewDTO>>();
        var list = new List<InvoiceItemsViewDTO>();
        try
        {
            await using var connection = new SqlConnection(connectionString._connectionString);
            await using var command = new SqlCommand("SP_SearchInvoiceItems", connection) { CommandType = CommandType.StoredProcedure };
            command.Parameters.Add("@ProductID", SqlDbType.Int).Value = ProductID;
            command.Parameters.Add("@IsStoreOwned", SqlDbType.Bit).Value = IsStoreOwned;
            command.Parameters.Add("@FromDate", SqlDbType.DateTime).Value = FromDate;
            command.Parameters.Add("@ToDate", SqlDbType.DateTime).Value = ToDate;

            await connection.OpenAsync(cancellationToken).ConfigureAwait(false);
            using var reader = await command.ExecuteReaderAsync(cancellationToken).ConfigureAwait(false);
            while (reader.Read())
            {
                list.Add(new InvoiceItemsViewDTO
                {
                    ID = reader.IsDBNull(reader.GetOrdinal("ID")) ? 0 : reader.GetInt32(reader.GetOrdinal("ID")),
                    ProductID = reader.IsDBNull(reader.GetOrdinal("ProductID")) ? 0 : reader.GetInt32(reader.GetOrdinal("ProductID")),
                    ProductName = reader.IsDBNull(reader.GetOrdinal("ProductName")) ? null : reader.GetString(reader.GetOrdinal("ProductName")),
                    Qty = reader.IsDBNull(reader.GetOrdinal("Qty")) ? 0 : reader.GetInt32(reader.GetOrdinal("Qty")),
                    OriginalPrice = reader.IsDBNull(reader.GetOrdinal("OriginalPrice")) ? 0 : reader.GetDecimal(reader.GetOrdinal("OriginalPrice")),
                    CostPrice = reader.IsDBNull(reader.GetOrdinal("CostPrice")) ? 0 : reader.GetDecimal(reader.GetOrdinal("CostPrice")),
                    UnitPrice = reader.IsDBNull(reader.GetOrdinal("UnitPrice")) ? 0 : reader.GetDecimal(reader.GetOrdinal("UnitPrice")),
                    IsStoreOwned = reader.IsDBNull(reader.GetOrdinal("IsStoreOwned")) ? false : reader.GetBoolean(reader.GetOrdinal("IsStoreOwned")),
                    Date = reader.IsDBNull(reader.GetOrdinal("Date")) ? DateTime.MinValue : reader.GetDateTime(reader.GetOrdinal("Date"))
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


    public static async Task<ApiResult<List<InvoiceItemsViewDTO>>> GetInvoiceItemByInvoiceID(
int InvoiceID,
 CancellationToken cancellationToken = default)
    {
        var result = new ApiResult<List<InvoiceItemsViewDTO>>();
        var list = new List<InvoiceItemsViewDTO>();
        try
        {
            await using var connection = new SqlConnection(connectionString._connectionString);
            await using var command = new SqlCommand("SP_GetAllInvoiceItemsByInvoiceID", connection) { CommandType = CommandType.StoredProcedure };
            command.Parameters.Add("@InvoiceID", SqlDbType.Int).Value = InvoiceID;
       

            await connection.OpenAsync(cancellationToken).ConfigureAwait(false);
            using var reader = await command.ExecuteReaderAsync(cancellationToken).ConfigureAwait(false);
            while (reader.Read())
            {
                list.Add(new InvoiceItemsViewDTO
                {
                    ID = reader.IsDBNull(reader.GetOrdinal("ID")) ? 0 : reader.GetInt32(reader.GetOrdinal("ID")),
                    ProductID = reader.IsDBNull(reader.GetOrdinal("ProductID")) ? 0 : reader.GetInt32(reader.GetOrdinal("ProductID")),
                    ProductName = reader.IsDBNull(reader.GetOrdinal("ProductName")) ? null : reader.GetString(reader.GetOrdinal("ProductName")),
                    Qty = reader.IsDBNull(reader.GetOrdinal("Qty")) ? 0 : reader.GetInt32(reader.GetOrdinal("Qty")),
                    OriginalPrice = reader.IsDBNull(reader.GetOrdinal("OriginalPrice")) ? 0 : reader.GetDecimal(reader.GetOrdinal("OriginalPrice")),
                    CostPrice = reader.IsDBNull(reader.GetOrdinal("CostPrice")) ? 0 : reader.GetDecimal(reader.GetOrdinal("CostPrice")),
                    UnitPrice = reader.IsDBNull(reader.GetOrdinal("UnitPrice")) ? 0 : reader.GetDecimal(reader.GetOrdinal("UnitPrice")),
                    IsStoreOwned = reader.IsDBNull(reader.GetOrdinal("IsStoreOwned")) ? false : reader.GetBoolean(reader.GetOrdinal("IsStoreOwned")),
                    Date = reader.IsDBNull(reader.GetOrdinal("Date")) ? DateTime.MinValue : reader.GetDateTime(reader.GetOrdinal("Date")),
                    IsReturned = reader.IsDBNull(reader.GetOrdinal("IsReturned")) ? false : reader.GetBoolean(reader.GetOrdinal("IsReturned")),
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

}


