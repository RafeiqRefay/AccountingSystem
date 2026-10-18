using Microsoft.Data.SqlClient;
using Microsoft.SqlServer.Management.Common;
using Microsoft.SqlServer.Management.Smo;

namespace MyApp.Database
{
    public class DatabaseInitializer
    {
        public static void Initialize()
        {
            string masterConnection =
                @"Server=(localdb)\MSSQLLocalDB;Database=master;Trusted_Connection=True;TrustServerCertificate=True;";

            bool databaseCreated = false;

            using (SqlConnection con = new SqlConnection(masterConnection))
            {
                con.Open();

                string checkSql =
                    "SELECT COUNT(*) FROM sys.databases WHERE name = 'AppDB'";

                using SqlCommand checkCmd = new SqlCommand(checkSql, con);

                int count = (int)checkCmd.ExecuteScalar();

                if (count == 0)
                {
                    using SqlCommand createCmd =
                        new SqlCommand("CREATE DATABASE AppDB", con);

                    createCmd.ExecuteNonQuery();

                    databaseCreated = true;

                    Console.WriteLine("AppDB created successfully.");

                    Thread.Sleep(1000);
                }
                else
                {
                    Console.WriteLine("AppDB already exists.");
                }
            }

            if (!databaseCreated)
                return;

            // استخدم BaseDirectory بدل CurrentDirectory
            string sqlPath = Path.Combine(
      AppContext.BaseDirectory,
      "DataBase",
      "DataBase.sql"
  );

            Console.WriteLine(sqlPath);

            Console.WriteLine($"SQL Path: {sqlPath}");

            if (!File.Exists(sqlPath))
            {
                Console.WriteLine("DataBase.sql not found.");
                return;
            }

            string script = File.ReadAllText(
                sqlPath,
                System.Text.Encoding.UTF8
            );

            string databaseConnection =
                @"Server=(localdb)\MSSQLLocalDB;Database=AppDB;Trusted_Connection=True;TrustServerCertificate=True;";

            using SqlConnection sqlConnection =
                new SqlConnection(databaseConnection);

            sqlConnection.Open();

            ServerConnection serverConnection =
                new ServerConnection(sqlConnection);

            Server server =
                new Server(serverConnection);

            server.ConnectionContext.StatementTimeout = 300;

            server.ConnectionContext.ExecuteNonQuery(script);

            Console.WriteLine("Database structure created successfully.");
        }
    }
}