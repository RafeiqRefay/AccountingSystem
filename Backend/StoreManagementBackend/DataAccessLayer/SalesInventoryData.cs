
using System;
using System.Collections.Generic;
using System.Data;
using Microsoft.Data.SqlClient;
using System.Threading;
using System.Threading.Tasks;

using ConnectionString;

public static class SalesInventoryData
{
public static async Task<ApiResult<List<SalesInventoryViewDTO>>> SearchSalesInventory(
int? Period,
DateTime? FromDate,
DateTime? ToDate,
bool? IsStoreOwned,
    CancellationToken cancellationToken = default)
{
    var result = new ApiResult<List<SalesInventoryViewDTO>>();
    var list = new List<SalesInventoryViewDTO>();
    try
    {
        await using var connection = new SqlConnection(connectionString._connectionString);
        await using var command = new SqlCommand("SP_SearchSalesInventory", connection) { CommandType = CommandType.StoredProcedure };
        command.Parameters.Add("@Period", SqlDbType.Int).Value = Period ;
        command.Parameters.Add("@FromDate", SqlDbType.DateTime).Value = FromDate ;
        command.Parameters.Add("@ToDate", SqlDbType.DateTime).Value = ToDate ;
        command.Parameters.Add("@IsStoreOwned", SqlDbType.Bit).Value = IsStoreOwned ;
        await connection.OpenAsync(cancellationToken).ConfigureAwait(false);
        using var reader = await command.ExecuteReaderAsync(cancellationToken).ConfigureAwait(false);
        while (reader.Read())
        {
            list.Add(new SalesInventoryViewDTO
            {
                TotalCost = reader.IsDBNull(reader.GetOrdinal("TotalCost")) ? 0 : reader.GetDecimal(reader.GetOrdinal("TotalCost")),
                TotalProducts = reader.IsDBNull(reader.GetOrdinal("TotalProducts")) ? 0 : reader.GetDecimal(reader.GetOrdinal("TotalProducts")),
                TotalPurchasePriceProduct = reader.IsDBNull(reader.GetOrdinal("TotalPurchasePriceProduct")) ? 0 : reader.GetDecimal(reader.GetOrdinal("TotalPurchasePriceProduct")),
                TotalSalePriceProduct = reader.IsDBNull(reader.GetOrdinal("TotalSalePriceProduct")) ? 0 : reader.GetDecimal(reader.GetOrdinal("TotalSalePriceProduct")),
                TotalProductsSold = reader.IsDBNull(reader.GetOrdinal("TotalProductsSold")) ? 0 : reader.GetDecimal(reader.GetOrdinal("TotalProductsSold")),
                TotalProfit = reader.IsDBNull(reader.GetOrdinal("TotalProfit")) ? 0 : reader.GetDecimal(reader.GetOrdinal("TotalProfit")),
                TotalInventorySaleValue = reader.IsDBNull(reader.GetOrdinal("TotalInventorySaleValue")) ? 0 : reader.GetDecimal(reader.GetOrdinal("TotalInventorySaleValue")),
                TotalExpenses = reader.IsDBNull(reader.GetOrdinal("TotalExpenses")) ? 0 : reader.GetDecimal(reader.GetOrdinal("TotalExpenses")),
                TotalReturnCost = reader.IsDBNull(reader.GetOrdinal("TotalReturnCost")) ? 0 : reader.GetDecimal(reader.GetOrdinal("TotalReturnCost"))



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

