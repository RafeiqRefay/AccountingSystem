
using System;
using System.Collections.Generic;
using System.Data;
using Microsoft.Data.SqlClient;
using System.Threading;
using System.Threading.Tasks;

using ConnectionString;

public static class InvoicesData
{
  


    public static async Task<ApiResult<List<InvoicesViewDTO>>> GetAllInvoicesByDateAsync(   // جلب كل الفواتير او جلب كل الفواتير من تاريخ معين الى تاريخ معين 
        DateTime? FromDate, DateTime? ToDate,
        CancellationToken cancellationToken = default)
    {
        var result = new ApiResult<List<InvoicesViewDTO>>();
        var list = new List<InvoicesViewDTO>();
        try
        {
            await using var connection = new SqlConnection(connectionString._connectionString);
            await using var command = new SqlCommand("SP_GetAllInvoicesByDate", connection) { CommandType = CommandType.StoredProcedure };


            command.Parameters.Add("@FromDate", SqlDbType.DateTime).Value =
                (object?)FromDate ?? DBNull.Value;

            command.Parameters.Add("@ToDate", SqlDbType.DateTime).Value =
                (object?)ToDate ?? DBNull.Value;



            await connection.OpenAsync(cancellationToken).ConfigureAwait(false);
            using var reader = await command.ExecuteReaderAsync(cancellationToken).ConfigureAwait(false);
            while (reader.Read())
            {
                list.Add(new InvoicesViewDTO
                {
                    ID = reader.IsDBNull(reader.GetOrdinal("ID")) ? 0 : reader.GetInt32(reader.GetOrdinal("ID")),
                    Date = reader.IsDBNull(reader.GetOrdinal("Date")) ? DateTime.MinValue : reader.GetDateTime(reader.GetOrdinal("Date")),
                    Total = reader.IsDBNull(reader.GetOrdinal("Total")) ? 0 : reader.GetDecimal(reader.GetOrdinal("Total"))
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



    public static async Task<ApiResult<InvoicesViewDTO>> GetInvoicesByIDAsync(
        int ID,
        CancellationToken cancellationToken = default)
    {
        var result = new ApiResult<InvoicesViewDTO>();
        var dto = new InvoicesViewDTO();
        try
        {
            await using var connection = new SqlConnection(connectionString._connectionString);
            await using var command = new SqlCommand("SP_GetInvoicesByInvoiceID", connection) { CommandType = CommandType.StoredProcedure };
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
                dto.Date = reader.IsDBNull(reader.GetOrdinal("Date")) ? DateTime.MinValue : reader.GetDateTime(reader.GetOrdinal("Date"));
                dto.Total = reader.IsDBNull(reader.GetOrdinal("Total")) ? 0 : reader.GetDecimal(reader.GetOrdinal("Total"));
            }
            reader.Close();
            result.Data = dto;
            result.Message = messageParameter.Value?.ToString();
            result.ErrorType = ErrorTypeMapper.GetErrorType(Convert.ToInt32(errorTypeParameter.Value));
        }
        catch (Exception ex)
        {
            result.Data = null;
            result.Message = "Database error occurred while fetching the invoices";
            result.ErrorType = ErrorType.DatabaseError;
        }
        return result;
    }

    public static async Task<ApiResult<InvoicesViewDTO>> AddInvoiceAsync(
         List<InvoiceItemDTO> invoices,

        CancellationToken cancellationToken = default)
    {



        var result = new ApiResult<InvoicesViewDTO>();

        try
        {
            // 🔹 تحويل القائمة إلى DataTable
            DataTable table = new DataTable();
            table.Columns.Add("ProductID", typeof(int));
            table.Columns.Add("Qty", typeof(int));
            table.Columns.Add("Price", typeof(int));
         
                foreach (var item in invoices) // لكل عنصر في الفاتورة
                {
                    table.Rows.Add(item.ProductID, item.QTY, item.Price);
                }
            

            await using var connection = new SqlConnection(connectionString._connectionString);
            await using var command = new SqlCommand("SP_AddInvoices", connection)
            {
                CommandType = CommandType.StoredProcedure
            };


            // 🔹 Table-Valued Parameter
            var param = command.Parameters.AddWithValue("@Items", table);
            param.SqlDbType = SqlDbType.Structured;
            param.TypeName = "InfoInvoiceItem";

            // 🔹 Output Parameters
            var outputID = new SqlParameter("@NewID", SqlDbType.Int)
            {
                Direction = ParameterDirection.Output
            };

            var outputMsg = new SqlParameter("@Message", SqlDbType.NVarChar, 250)
            {
                Direction = ParameterDirection.Output
            };

            var outputError = new SqlParameter("@ErrorType", SqlDbType.Int)
            {
                Direction = ParameterDirection.Output
            };

            command.Parameters.Add(outputID);
            command.Parameters.Add(outputMsg);
            command.Parameters.Add(outputError);

            await connection.OpenAsync(cancellationToken);

            await using var reader = await command.ExecuteReaderAsync(cancellationToken);

            // 🔴 اقرأ النتيجة (ممكن تكون Invoice أو Errors حسب SP)
            if (await reader.ReadAsync(cancellationToken))
            {
                // نحاول نقرأ كـ Invoice (إذا نجحت العملية)
                if (reader.FieldCount == 3) // ID, Date, Total
                {
                    result.Data = new InvoicesViewDTO
                    {
                        ID = reader.GetInt32(0),
                        Date = reader.GetDateTime(1),
                        Total = reader.GetDecimal(2)
                    };
                }
                else
                {
                    // إذا رجع Errors (اختياري - حسب تصميمك)
                    result.Data = null;
                }
            }

            // 🔥 مهم جدًا: إغلاق الـ reader قبل قراءة Output Parameters
            await reader.CloseAsync();

            // 🔹 قراءة النتائج النهائية
            result.Message = outputMsg.Value?.ToString();
            result.ErrorType = ErrorTypeMapper.GetErrorType(
                Convert.ToInt32(outputError.Value)
            );
        }
        catch (Exception ex)
        {
            result.Data = null;
            result.Message = ex.Message; // أفضل من "Database error"
            result.ErrorType = ErrorType.DatabaseError;
        }

        return result;
    }





} 

