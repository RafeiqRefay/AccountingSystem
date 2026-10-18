ALTER DATABASE [AppDB] SET COMPATIBILITY_LEVEL = 150
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [AppDB].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [AppDB] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [AppDB] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [AppDB] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [AppDB] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [AppDB] SET ARITHABORT OFF 
GO
ALTER DATABASE [AppDB] SET AUTO_CLOSE ON 
GO
ALTER DATABASE [AppDB] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [AppDB] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [AppDB] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [AppDB] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [AppDB] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [AppDB] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [AppDB] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [AppDB] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [AppDB] SET  ENABLE_BROKER 
GO
ALTER DATABASE [AppDB] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [AppDB] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [AppDB] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [AppDB] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [AppDB] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [AppDB] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [AppDB] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [AppDB] SET RECOVERY SIMPLE 
GO
ALTER DATABASE [AppDB] SET  MULTI_USER 
GO
ALTER DATABASE [AppDB] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [AppDB] SET DB_CHAINING OFF 
GO
ALTER DATABASE [AppDB] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [AppDB] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [AppDB] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [AppDB] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
ALTER DATABASE [AppDB] SET QUERY_STORE = OFF
GO
USE [AppDB]
GO
/****** Object:  UserDefinedTableType [dbo].[InfoInvoiceItem]    Script Date: 7/29/2026 5:38:16 AM ******/
CREATE TYPE [dbo].[InfoInvoiceItem] AS TABLE(
	[ProductId] [int] NULL,
	[Quantity] [int] NULL,
	[Price] [decimal](18, 2) NULL
)
GO
/****** Object:  UserDefinedFunction [dbo].[fn_Total_Purchase_Price_Product]    Script Date: 7/29/2026 5:38:16 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE FUNCTION [dbo].[fn_Total_Purchase_Price_Product]
(
   @IsStoreOwned bit =null
)
RETURNS DECIMAL(18,2)
AS
BEGIN
    DECLARE @Total DECIMAL(18,2);		

    SELECT @Total =    sum(Products.Purchase_Price* Quantity)    
    FROM Products
	where @IsStoreOwned is null
	or 
	Products.IsStoreOwned=@IsStoreOwned
  
  

    RETURN @Total;
END;
GO
/****** Object:  UserDefinedFunction [dbo].[fn_Total_Sale_Price_Product]    Script Date: 7/29/2026 5:38:16 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE FUNCTION [dbo].[fn_Total_Sale_Price_Product]
(
 @IsStoreOwned bit =null  
)
RETURNS DECIMAL(18,2)
AS
BEGIN
    DECLARE @Total DECIMAL(18,2);		

    SELECT @Total =    sum(Products.Sale_Price* Quantity)    
    FROM Products
		where @IsStoreOwned is null
	or 
	Products.IsStoreOwned=@IsStoreOwned
  
  

    RETURN @Total;
END;
GO
/****** Object:  UserDefinedFunction [dbo].[fn_TotalCost]    Script Date: 7/29/2026 5:38:16 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE FUNCTION [dbo].[fn_TotalCost]
(
    @Period INT,
    @FromDate DATE = NULL,
    @ToDate DATE = NULL,
		@IsStoreOwned bit=null
)
RETURNS DECIMAL(18,2)
AS
BEGIN
    DECLARE @Total DECIMAL(18,2);

    SELECT @Total = ISNULL(SUM(ii.CostPrice * ii.Qty), 0)
    FROM InvoiceItems ii
    INNER JOIN Invoices i
        ON ii.InvoiceID = i.ID
			    INNER JOIN Products
			on Products.ID=ii.ProductID
    WHERE NOT EXISTS
(
    SELECT *
    FROM InvoiceReturns ir
    WHERE ir.InvoiceItemID = ii.ID
) and 
    (
        (@Period = 1 AND CAST(i.[Date] AS DATE) = CAST(GETDATE() AS DATE))
        OR
        (@Period = 2 AND i.[Date] >= DATEADD(DAY, 1 - DATEPART(WEEKDAY, GETDATE()), CAST(GETDATE() AS DATE)))
        OR
        (@Period = 3 AND MONTH(i.[Date]) = MONTH(GETDATE()) AND YEAR(i.[Date]) = YEAR(GETDATE()))
        OR
        (@Period = 4 AND i.[Date] >= DATEADD(DAY, -30, GETDATE()))
        OR
        (@Period = 5 AND YEAR(i.[Date]) = YEAR(GETDATE()))
        OR
        (@Period = 6 AND i.[Date] BETWEEN @FromDate AND @ToDate)
		or
		(@Period is null)
    )
		AND 
	(
      @IsStoreOwned IS NULL
   OR Products.IsStoreOwned = @IsStoreOwned
);

    RETURN @Total;
END;
GO
/****** Object:  UserDefinedFunction [dbo].[fn_TotalExpenses]    Script Date: 7/29/2026 5:38:16 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE FUNCTION [dbo].[fn_TotalExpenses]
(
    @Period INT,
    @FromDate DATE = NULL,
    @ToDate DATE = NULL
)
RETURNS DECIMAL(18,2)
AS
BEGIN
    DECLARE @Total DECIMAL(18,2);

    SELECT @Total = ISNULL(SUM(e.Amount), 0)
    FROM Expenses e
    WHERE
    (
        (@Period = 1 AND CAST(e.[Date] AS DATE) = CAST(GETDATE() AS DATE))
        OR
        (@Period = 2 AND e.[Date] >= DATEADD(DAY, 1 - DATEPART(WEEKDAY, GETDATE()), CAST(GETDATE() AS DATE)))
        OR
        (@Period = 3 AND MONTH(e.[Date]) = MONTH(GETDATE()) AND YEAR(e.[Date]) = YEAR(GETDATE()))
        OR
        (@Period = 4 AND e.[Date] >= DATEADD(DAY, -30, GETDATE()))
        OR
        (@Period = 5 AND YEAR(e.[Date]) = YEAR(GETDATE()))
        OR
        (@Period = 6 AND e.[Date] BETWEEN @FromDate AND @ToDate)
        OR
        (@Period IS NULL)
    );

    RETURN @Total;
END;
GO
/****** Object:  UserDefinedFunction [dbo].[fn_TotalProductInSystem]    Script Date: 7/29/2026 5:38:16 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE FUNCTION [dbo].[fn_TotalProductInSystem] 
(
   @IsStoreOwned bit =null
)
RETURNS DECIMAL(18,2)
AS
BEGIN
    DECLARE @Total DECIMAL(18,2);		

    SELECT @Total =    sum(Products.Quantity)    
    FROM Products
		where @IsStoreOwned is null
	or 
	Products.IsStoreOwned=@IsStoreOwned
  
  

    RETURN @Total;
END;
GO
/****** Object:  UserDefinedFunction [dbo].[fn_TotalProductsSold]    Script Date: 7/29/2026 5:38:16 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE FUNCTION [dbo].[fn_TotalProductsSold] 
(
    @Period INT,
    @FromDate DATE = NULL,
    @ToDate DATE = NULL,
			@IsStoreOwned bit=null

)
RETURNS DECIMAL(18,2)
AS
BEGIN
    DECLARE @Total DECIMAL(18,2);		

    SELECT @Total = ISNULL(SUM(ii.Qty ), 0)
    FROM InvoiceItems ii
    INNER JOIN Invoices i
        ON ii.InvoiceID = i.ID
		    INNER JOIN Products
			on Products.ID=ii.ProductID
	
    WHERE NOT EXISTS
(
    SELECT *
    FROM InvoiceReturns ir
    WHERE ir.InvoiceItemID = ii.ID
) and
    (
        (@Period = 1 AND CAST(i.[Date] AS DATE) = CAST(GETDATE() AS DATE))
        OR
        (@Period = 2 AND i.[Date] >= DATEADD(DAY, 1 - DATEPART(WEEKDAY, GETDATE()), CAST(GETDATE() AS DATE)))
        OR
        (@Period = 3 AND MONTH(i.[Date]) = MONTH(GETDATE()) AND YEAR(i.[Date]) = YEAR(GETDATE()))
        OR
        (@Period = 4 AND i.[Date] >= DATEADD(DAY, -30, GETDATE()))
        OR
        (@Period = 5 AND YEAR(i.[Date]) = YEAR(GETDATE()))
        OR
        (@Period = 6 AND i.[Date] BETWEEN @FromDate AND @ToDate)	or
		(@Period is null)
    )
	AND 
	(
      @IsStoreOwned IS NULL
   OR Products.IsStoreOwned = @IsStoreOwned
);

    RETURN @Total;
END;
GO
/****** Object:  UserDefinedFunction [dbo].[fn_TotalProfit]    Script Date: 7/29/2026 5:38:16 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE FUNCTION [dbo].[fn_TotalProfit]
(
    @Period INT,
    @FromDate DATE = NULL,
    @ToDate DATE = NULL,
	@IsStoreOwned bit=null
)
RETURNS DECIMAL(18,2)
AS
BEGIN
    DECLARE @Total DECIMAL(18,2);

    SELECT @Total = ISNULL(SUM((ii.UnitPrice - ii.CostPrice) * ii.Qty), 0)
    FROM InvoiceItems ii
    INNER JOIN Invoices i
        ON ii.InvoiceID = i.ID
    INNER JOIN Products
			on Products.ID=ii.ProductID
	
	
WHERE NOT EXISTS
(
    SELECT *
    FROM InvoiceReturns ir
    WHERE ir.InvoiceItemID = ii.ID
)
and

    (
        (@Period = 1 AND CAST(i.[Date] AS DATE) = CAST(GETDATE() AS DATE) )
        OR
        (@Period = 2 AND i.[Date] >= DATEADD(DAY, 1 - DATEPART(WEEKDAY, GETDATE()), CAST(GETDATE() AS DATE)))
        OR
        (@Period = 3 AND MONTH(i.[Date]) = MONTH(GETDATE()) AND YEAR(i.[Date]) = YEAR(GETDATE()))
        OR
        (@Period = 4 AND i.[Date] >= DATEADD(DAY, -30, GETDATE()))
        OR
        (@Period = 5 AND YEAR(i.[Date]) = YEAR(GETDATE()))
        OR
        (@Period = 6 AND i.[Date] BETWEEN @FromDate AND @ToDate)
		 OR (@Period IS NULL)
		
    )

	AND
(
      @IsStoreOwned IS NULL
   OR Products.IsStoreOwned = @IsStoreOwned
);

    RETURN @Total;
END;
GO
/****** Object:  UserDefinedFunction [dbo].[fn_TotalProfitWithCost]    Script Date: 7/29/2026 5:38:16 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE FUNCTION [dbo].[fn_TotalProfitWithCost]
(
    @Period INT,
    @FromDate DATE = NULL,
    @ToDate DATE = NULL,
		@IsStoreOwned bit=null
)
RETURNS DECIMAL(18,2)
AS
BEGIN
    DECLARE @Total DECIMAL(18,2);

    SELECT @Total = ISNULL(SUM(ii.UnitPrice  * ii.Qty), 0)
    FROM InvoiceItems ii
    INNER JOIN Invoices i
        ON ii.InvoiceID = i.ID
		    INNER JOIN Products
			on Products.ID=ii.ProductID
	
    WHERE NOT EXISTS
(
    SELECT *
    FROM InvoiceReturns ir
    WHERE ir.InvoiceItemID = ii.ID
) and 
    (
        (@Period = 1 AND CAST(i.[Date] AS DATE) = CAST(GETDATE() AS DATE))
        OR
        (@Period = 2 AND i.[Date] >= DATEADD(DAY, 1 - DATEPART(WEEKDAY, GETDATE()), CAST(GETDATE() AS DATE)))
        OR
        (@Period = 3 AND MONTH(i.[Date]) = MONTH(GETDATE()) AND YEAR(i.[Date]) = YEAR(GETDATE()))
        OR
        (@Period = 4 AND i.[Date] >= DATEADD(DAY, -30, GETDATE()))
        OR
        (@Period = 5 AND YEAR(i.[Date]) = YEAR(GETDATE()))
        OR
        (@Period = 6 AND i.[Date] BETWEEN @FromDate AND @ToDate)	or
		(@Period is null)
    )
		AND
(
      @IsStoreOwned IS NULL
   OR Products.IsStoreOwned = @IsStoreOwned
);


    RETURN @Total;
END;
GO
/****** Object:  UserDefinedFunction [dbo].[fn_TotalReturnCost]    Script Date: 7/29/2026 5:38:16 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE FUNCTION [dbo].[fn_TotalReturnCost]
(
    @Period INT,
    @FromDate DATE = NULL,
    @ToDate DATE = NULL,
		@IsStoreOwned bit=null
)
RETURNS DECIMAL(18,2)
AS
BEGIN
    DECLARE @Total DECIMAL(18,2);

    SELECT @Total = ISNULL(SUM(ii.UnitPrice * ii.Qty), 0)
    FROM InvoiceItems ii
    INNER JOIN Invoices i
        ON ii.InvoiceID = i.ID
			    INNER JOIN Products
			on Products.ID=ii.ProductID
    WHERE  EXISTS
(
    SELECT *
    FROM InvoiceReturns ir
    WHERE ir.InvoiceItemID = ii.ID
) and 
    (
        (@Period = 1 AND CAST(i.[Date] AS DATE) = CAST(GETDATE() AS DATE))
        OR
        (@Period = 2 AND i.[Date] >= DATEADD(DAY, 1 - DATEPART(WEEKDAY, GETDATE()), CAST(GETDATE() AS DATE)))
        OR
        (@Period = 3 AND MONTH(i.[Date]) = MONTH(GETDATE()) AND YEAR(i.[Date]) = YEAR(GETDATE()))
        OR
        (@Period = 4 AND i.[Date] >= DATEADD(DAY, -30, GETDATE()))
        OR
        (@Period = 5 AND YEAR(i.[Date]) = YEAR(GETDATE()))
        OR
        (@Period = 6 AND i.[Date] BETWEEN @FromDate AND @ToDate)
		or
		(@Period is null)
    )
		AND 
	(
      @IsStoreOwned IS NULL
   OR Products.IsStoreOwned = @IsStoreOwned
);

    RETURN @Total;
END;
GO
/****** Object:  Table [dbo].[Categories]    Script Date: 7/29/2026 5:38:16 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Categories](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[CategorieName] [nvarchar](100) NOT NULL,
	[Type_ID] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Expenses]    Script Date: 7/29/2026 5:38:16 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Expenses](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[Date] [datetime] NOT NULL,
	[Amount] [decimal](18, 2) NOT NULL,
	[Description] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[InvoiceItems]    Script Date: 7/29/2026 5:38:16 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[InvoiceItems](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[InvoiceID] [int] NOT NULL,
	[ProductID] [int] NOT NULL,
	[Qty] [int] NOT NULL,
	[OriginalPrice] [decimal](10, 2) NOT NULL,
	[CostPrice] [decimal](10, 2) NOT NULL,
	[UnitPrice] [decimal](10, 2) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[InvoiceReturns]    Script Date: 7/29/2026 5:38:16 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[InvoiceReturns](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[InvoiceItemID] [int] NULL,
	[ReturnPrice] [decimal](18, 2) NULL,
	[ReturnDate] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Invoices]    Script Date: 7/29/2026 5:38:16 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Invoices](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[Date] [datetime] NOT NULL,
	[Total] [decimal](10, 2) NULL,
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO


GO
 
CREATE TABLE [dbo].[AppConfig] (
    [Id]          INT IDENTITY(1,1) PRIMARY KEY,
    [ConfigKey]   NVARCHAR(100) NOT NULL,
    [ConfigValue] NVARCHAR(500) NOT NULL
)
GO
 
/****** Object:  Table [dbo].[ProductNames]    Script Date: 7/29/2026 5:38:16 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ProductNames](
	[ProductNameID] [int] IDENTITY(1,1) NOT NULL,
	[ProductName] [nvarchar](100) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[ProductNameID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Products]    Script Date: 7/29/2026 5:38:16 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Products](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[Type_ID] [int] NULL,
	[Category_ID] [int] NULL,
	[Quantity] [int] NOT NULL,
	[Purchase_Price] [decimal](18, 2) NOT NULL,
	[Sale_Price] [decimal](18, 2) NOT NULL,
	[IsStoreOwned] [bit] NOT NULL,
	[ProductNameID] [int] NOT NULL,
 CONSTRAINT [PK__Products__3214EC27703B6602] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Types]    Script Date: 7/29/2026 5:38:16 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Types](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[TypeName] [nvarchar](100) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Index [IX_InvoiceItems_InvoiceID]    Script Date: 7/29/2026 5:38:16 AM ******/
CREATE NONCLUSTERED INDEX [IX_InvoiceItems_InvoiceID] ON [dbo].[InvoiceItems]
(
	[InvoiceID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_InvoiceItems_ProductID]    Script Date: 7/29/2026 5:38:16 AM ******/
CREATE NONCLUSTERED INDEX [IX_InvoiceItems_ProductID] ON [dbo].[InvoiceItems]
(
	[ProductID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_InvoiceReturns_InvoiceItemID]    Script Date: 7/29/2026 5:38:16 AM ******/
CREATE NONCLUSTERED INDEX [IX_InvoiceReturns_InvoiceItemID] ON [dbo].[InvoiceReturns]
(
	[InvoiceItemID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_Products_CategoryID]    Script Date: 7/29/2026 5:38:16 AM ******/
CREATE NONCLUSTERED INDEX [IX_Products_CategoryID] ON [dbo].[Products]
(
	[Category_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_Products_ProductNameID]    Script Date: 7/29/2026 5:38:16 AM ******/
CREATE NONCLUSTERED INDEX [IX_Products_ProductNameID] ON [dbo].[Products]
(
	[ProductNameID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_Products_TypeID]    Script Date: 7/29/2026 5:38:16 AM ******/
CREATE NONCLUSTERED INDEX [IX_Products_TypeID] ON [dbo].[Products]
(
	[Type_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Expenses] ADD  DEFAULT (getdate()) FOR [Date]
GO
ALTER TABLE [dbo].[InvoiceReturns] ADD  DEFAULT (getdate()) FOR [ReturnDate]
GO
ALTER TABLE [dbo].[Invoices] ADD  DEFAULT (getdate()) FOR [Date]
GO
ALTER TABLE [dbo].[Invoices] ADD  DEFAULT ((0)) FOR [Total]
GO
ALTER TABLE [dbo].[Products] ADD  CONSTRAINT [DF__Products__Quanti__3C69FB99]  DEFAULT ((0)) FOR [Quantity]
GO
ALTER TABLE [dbo].[Products] ADD  CONSTRAINT [DF__Products__IsStor__3D5E1FD2]  DEFAULT ((1)) FOR [IsStoreOwned]
GO
ALTER TABLE [dbo].[Categories]  WITH CHECK ADD  CONSTRAINT [FK_Categories_Types] FOREIGN KEY([Type_ID])
REFERENCES [dbo].[Types] ([ID])
GO
ALTER TABLE [dbo].[Categories] CHECK CONSTRAINT [FK_Categories_Types]
GO
ALTER TABLE [dbo].[InvoiceItems]  WITH CHECK ADD  CONSTRAINT [FK_InvoiceItems_Invoices] FOREIGN KEY([InvoiceID])
REFERENCES [dbo].[Invoices] ([ID])
GO
ALTER TABLE [dbo].[InvoiceItems] CHECK CONSTRAINT [FK_InvoiceItems_Invoices]
GO
ALTER TABLE [dbo].[InvoiceItems]  WITH CHECK ADD  CONSTRAINT [FK_InvoiceItems_Products] FOREIGN KEY([ProductID])
REFERENCES [dbo].[Products] ([ID])
GO
ALTER TABLE [dbo].[InvoiceItems] CHECK CONSTRAINT [FK_InvoiceItems_Products]
GO
ALTER TABLE [dbo].[InvoiceReturns]  WITH CHECK ADD  CONSTRAINT [ID_InvoiceReturns_InvoiceItems] FOREIGN KEY([InvoiceItemID])
REFERENCES [dbo].[InvoiceItems] ([ID])
GO
ALTER TABLE [dbo].[InvoiceReturns] CHECK CONSTRAINT [ID_InvoiceReturns_InvoiceItems]
GO
ALTER TABLE [dbo].[Products]  WITH CHECK ADD  CONSTRAINT [FK_Products_Categories] FOREIGN KEY([Category_ID])
REFERENCES [dbo].[Categories] ([ID])
GO
ALTER TABLE [dbo].[Products] CHECK CONSTRAINT [FK_Products_Categories]
GO
ALTER TABLE [dbo].[Products]  WITH CHECK ADD  CONSTRAINT [FK_Products_ProductNames] FOREIGN KEY([ProductNameID])
REFERENCES [dbo].[ProductNames] ([ProductNameID])
GO
ALTER TABLE [dbo].[Products] CHECK CONSTRAINT [FK_Products_ProductNames]
GO
ALTER TABLE [dbo].[Products]  WITH CHECK ADD  CONSTRAINT [FK_Products_Types] FOREIGN KEY([Type_ID])
REFERENCES [dbo].[Types] ([ID])
GO
ALTER TABLE [dbo].[Products] CHECK CONSTRAINT [FK_Products_Types]
GO
/****** Object:  StoredProcedure [dbo].[SP_AddCategories]    Script Date: 7/29/2026 5:38:16 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


/* -----------------------------------------------------------
   FIX #6 — اسم التصنيف لازم يكون فريد لكل Type_ID، مش عالميًا
   ----------------------------------------------------------- */
CREATE PROCEDURE [dbo].[SP_AddCategories]
    @CategorieName nvarchar(MAX),
    @Type_ID int
    ,@NewID INT OUTPUT
    ,@Message NVARCHAR(250) OUTPUT
    ,@ErrorType INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        IF NOT EXISTS (SELECT 1 FROM Types WHERE ID = @Type_ID)
        BEGIN
            SET @NewID = -1;
            SET @Message = N'هذا النوع غير موجود في السستم .';
            SET @ErrorType = 3;
            RETURN;
        END

        -- ✅ الإصلاح: التكرار بيتفحص ضمن نفس النوع بس، مش على مستوى الجدول كامل
        IF EXISTS (
            SELECT 1 FROM Categories
            WHERE Categories.CategorieName = @CategorieName
              AND Categories.Type_ID = @Type_ID
        )
        BEGIN
            SET @Message = N'هذا الصنف موجود مسبقاً ضمن هذا النوع';
            SET @ErrorType = 4;
            RETURN;
        END

        INSERT INTO Categories (CategorieName, Type_ID)
        VALUES (@CategorieName, @Type_ID);

        SET @NewID = SCOPE_IDENTITY();
        SET @Message = N'تمت إضافة التصنيف بنجاح.';
        SET @ErrorType = 0;

    END TRY
    BEGIN CATCH
        SET @NewID = -1;
        SET @Message = ERROR_MESSAGE();
        SET @ErrorType = 5;
    END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[SP_AddExpenses]    Script Date: 7/29/2026 5:38:16 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[SP_AddExpenses]
   
    @Amount decimal(18,2),
    @Description nvarchar(MAX)
    ,@NewID INT OUTPUT
    ,@Message NVARCHAR(250) OUTPUT
    ,@ErrorType INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY

        INSERT INTO Expenses (Date, Amount, Description)
        VALUES (GETDATE(), @Amount, @Description);

        SET @NewID = SCOPE_IDENTITY();
        SET @Message = N'تمت إضافة المصروف بنجاح.';
        SET @ErrorType = 0;  -- Success

    END TRY
    BEGIN CATCH
        SET @NewID = -1;
        SET @Message = ERROR_MESSAGE();
        SET @ErrorType = 5;  -- DatabaseError
    END CATCH
END

GO
/****** Object:  StoredProcedure [dbo].[SP_AddInvoiceReturns]    Script Date: 7/29/2026 5:38:16 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


/* -----------------------------------------------------------
   FIX #4 — InvoiceReturns.ReturnPrice لازم يخزن قيمة الإرجاع
   الكاملة (UnitPrice × Qty) مش سعر القطعة الواحدة بس
   ----------------------------------------------------------- */
CREATE PROCEDURE [dbo].[SP_AddInvoiceReturns]
(
    @InvoiceItemID INT,
    @NewID INT OUTPUT,
    @Message NVARCHAR(250) OUTPUT,
    @ErrorType INT OUTPUT
)
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (SELECT 1 FROM InvoiceReturns WHERE InvoiceItemID = @InvoiceItemID)
    BEGIN
        SET @NewID = -1;
        SET @Message = N'This invoice item has already been returned.';
        SET @ErrorType = 3;
        RETURN;
    END

    DECLARE
        @Qty DECIMAL(18,2),
        @ProductID INT,
        @UnitPrice DECIMAL(18,2);

    BEGIN TRY

        IF NOT EXISTS (SELECT 1 FROM InvoiceItems WHERE ID = @InvoiceItemID)
        BEGIN
            SET @NewID = -1;
            SET @Message = N'Invalid Invoice Item.';
            SET @ErrorType = 2;
            RETURN;
        END

        SELECT
            @Qty = Qty,
            @ProductID = ProductID,
            @UnitPrice = UnitPrice
        FROM InvoiceItems
        WHERE ID = @InvoiceItemID;

        BEGIN TRANSACTION;

        INSERT INTO InvoiceReturns
        (
            InvoiceItemID,
            ReturnPrice,
            ReturnDate
        )
        VALUES
        (
            @InvoiceItemID,
            @UnitPrice * @Qty,   -- ✅ الإصلاح: قيمة الإرجاع الكاملة مش سعر القطعة بس
            GETDATE()
        );

        UPDATE Products
        SET Quantity = Quantity + @Qty
        WHERE ID = @ProductID;

        COMMIT TRANSACTION;

        SET @NewID = SCOPE_IDENTITY();
        SET @Message = N'Invoice return added successfully.';
        SET @ErrorType = 0;

    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        SET @NewID = -1;
        SET @Message = ERROR_MESSAGE();
        SET @ErrorType = 5;
    END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[SP_AddInvoices]    Script Date: 7/29/2026 5:38:16 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[SP_AddInvoices]
    @Items InfoInvoiceItem READONLY,
    @NewID INT OUTPUT,
    @Message NVARCHAR(250) OUTPUT,
    @ErrorType INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY

        BEGIN TRANSACTION;

        -------------------------------------------------
        -- ✅ التحقق من وجود عناصر
        -------------------------------------------------
        IF NOT EXISTS (SELECT 1 FROM @Items)
        BEGIN
            SET @NewID = -1;
            SET @Message = N'الفاتورة لا تحتوي على عناصر';
            SET @ErrorType = 1;

            ROLLBACK TRANSACTION;
            RETURN;
        END

        -------------------------------------------------
        -- ✅ التحقق أن الكمية أكبر من صفر
        -------------------------------------------------
        IF EXISTS
        (
            SELECT 1
            FROM @Items
            WHERE Quantity <= 0
        )
        BEGIN
            SET @NewID = -1;
            SET @Message = N'يوجد عنصر كميته صفر أو أقل';
            SET @ErrorType = 2;

            ROLLBACK TRANSACTION;
            RETURN;
        END

        -------------------------------------------------
        -- ✅ التحقق من وجود المنتج
        -------------------------------------------------
        IF EXISTS
        (
            SELECT 1
            FROM @Items i
            LEFT JOIN Products p ON i.ProductId = p.ID
            WHERE p.ID IS NULL
        )
        BEGIN
            SET @NewID = -1;
            SET @Message = N'هذا منتج غير موجود';
            SET @ErrorType = 3;

            ROLLBACK TRANSACTION;
            RETURN;
        END

        -------------------------------------------------
        -- ✅ التحقق من توفر الكمية
        -------------------------------------------------
      DECLARE @ProductName NVARCHAR(200);

SELECT TOP 1
    @ProductName = pn.ProductName
FROM @Items i
INNER JOIN Products p
    ON i.ProductId = p.ID
INNER JOIN ProductNames pn
    ON p.ProductNameID = pn.ProductNameID
WHERE i.Quantity > p.Quantity;

IF @ProductName IS NOT NULL
BEGIN
    SET @NewID = -1;
    SET @Message = N'الكمية المطلوبة أكبر من المخزون للمنتج: ' + @ProductName;
    SET @ErrorType = 4;

    ROLLBACK TRANSACTION;
    RETURN;
END

        -------------------------------------------------
        -- ✅ إنشاء الفاتورة
        -------------------------------------------------
        INSERT INTO Invoices (Date, Total)
        VALUES (GETDATE(), 0);

        SET @NewID = SCOPE_IDENTITY();

        -------------------------------------------------
        -- ✅ إدخال العناصر
        -------------------------------------------------
        INSERT INTO InvoiceItems
        (
            InvoiceID,
            ProductID,
            Qty,
            OriginalPrice,
			CostPrice,
			UnitPrice
        )
        SELECT
            @NewID,
            i.ProductId,
            i.Quantity,
            p.sale_Price,
			p.Purchase_Price,
			i.Price
			
        FROM @Items i
        INNER JOIN Products p
            ON i.ProductID = p.ID;

        -------------------------------------------------
        -- ✅ تحديث المخزون
        -------------------------------------------------
        UPDATE p
        SET p.Quantity = p.Quantity - i.Quantity
        FROM Products p
        INNER JOIN @Items i
            ON p.ID = i.ProductId;

 
        UPDATE Invoices
        SET Total =
        (
            SELECT
                SUM
                (
                    ii.UnitPrice * ii.Qty 
                )
            FROM InvoiceItems ii
            WHERE ii.InvoiceID = @NewID
        )
        WHERE ID = @NewID;

        -------------------------------------------------
        -- ✅ نجاح العملية
        -------------------------------------------------
        SET @Message = N'تم إنشاء الفاتورة بنجاح';
        SET @ErrorType = 0;

        COMMIT TRANSACTION;

        -------------------------------------------------
        -- ✅ إرجاع بيانات الفاتورة
        -------------------------------------------------
        SELECT
            ID,
            Date,
            Total
        FROM Invoices
        WHERE ID = @NewID;

    END TRY

    BEGIN CATCH

        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        SET @NewID = -1;
        SET @Message = ERROR_MESSAGE();
        SET @ErrorType = 5;

    END CATCH

END




GO
/****** Object:  StoredProcedure [dbo].[SP_AddProductNames]    Script Date: 7/29/2026 5:38:16 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- (اختياري بس منصوح فيه) قيد فريد حقيقي بمستوى قاعدة البيانات كخط دفاع إضافي
-- ⚠️ شغل هاد السطر بس لو متأكد إنه ما في بيانات مكررة حاليًا، وإلا رح يفشل
-- ALTER TABLE Categories ADD CONSTRAINT UQ_Categories_Name_Type UNIQUE (CategorieName, Type_ID);


/* -----------------------------------------------------------
   FIX #7 — فحص تكرار اسم المنتج لازم يعمل TRIM
   ----------------------------------------------------------- */
CREATE PROCEDURE [dbo].[SP_AddProductNames]
    @ProductName nvarchar(MAX)
    ,@NewID INT OUTPUT
    ,@Message NVARCHAR(250) OUTPUT
    ,@ErrorType INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        -- ✅ الإصلاح: مقارنة بعد TRIM عشان تطابق نفس منطق الفرونت اند
        IF EXISTS (
            SELECT 1 FROM ProductNames
            WHERE LTRIM(RTRIM(ProductNames.ProductName)) = LTRIM(RTRIM(@ProductName))
        )
        BEGIN
            SET @Message = N'هذا اسم المنتج موجود مسبقاً';
            SET @ErrorType = 4;
            RETURN;
        END

        INSERT INTO ProductNames (ProductName)
        VALUES (LTRIM(RTRIM(@ProductName)));

        SET @NewID = SCOPE_IDENTITY();
        SET @Message = N'تمت إضافة اسم المنتج بنجاح.';
        SET @ErrorType = 0;

    END TRY
    BEGIN CATCH
        SET @NewID = -1;
        SET @Message = ERROR_MESSAGE();
        SET @ErrorType = 5;
    END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[SP_AddProducts]    Script Date: 7/29/2026 5:38:16 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[SP_AddProducts]
(
    @ProductNameID INT,
    @Type_ID INT = NULL,
    @Category_ID INT = NULL,
    @Quantity INT,
    @Purchase_Price DECIMAL(18,2),
    @Sale_Price DECIMAL(18,2),
    @IsStoreOwned BIT,

    @NewID INT OUTPUT,
    @Message NVARCHAR(250) OUTPUT,
    @ErrorType INT OUTPUT
)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY


        ----------------------------------------------------
        -- Quantity Validation
        ----------------------------------------------------
        IF @Quantity <= 0
        BEGIN
            SET @NewID = -1;
            SET @Message = N'الكمية يجب أن تكون أكبر من صفر.';
            SET @ErrorType = 3;
            RETURN;
        END



        ----------------------------------------------------
        -- Product Name Validation
        ----------------------------------------------------
        IF NOT EXISTS
        (
            SELECT 1
            FROM ProductNames
            WHERE ProductNameID = @ProductNameID
        )
        BEGIN
            SET @NewID = -1;
            SET @Message = N'اسم المنتج غير صالح.';
            SET @ErrorType = 3;
            RETURN;
        END



        ----------------------------------------------------
        -- Type Validation
        ----------------------------------------------------
        IF @Type_ID IS NOT NULL
        AND NOT EXISTS
        (
            SELECT 1
            FROM Types
            WHERE ID = @Type_ID
        )
        BEGIN
            SET @NewID = -1;
            SET @Message = N'النوع غير صالح.';
            SET @ErrorType = 3;
            RETURN;
        END



        ----------------------------------------------------
        -- Category Validation
        ----------------------------------------------------
        IF @Category_ID IS NOT NULL
        AND NOT EXISTS
        (
            SELECT 1
            FROM Categories
            WHERE ID = @Category_ID
        )
        BEGIN
            SET @NewID = -1;
            SET @Message = N'التصنيف غير صالح.';
            SET @ErrorType = 3;
            RETURN;
        END



        ----------------------------------------------------
        -- Category controls Type
        ----------------------------------------------------
        IF @Category_ID IS NOT NULL
        BEGIN

            DECLARE @CategoryTypeID INT;


            SELECT @CategoryTypeID = Type_ID
            FROM Categories
            WHERE ID = @Category_ID;



            -- User selected Type but it is different
            IF @Type_ID IS NOT NULL
            AND @Type_ID <> @CategoryTypeID
            BEGIN
                SET @NewID = -1;
                SET @Message = N'التصنيف المحدد لا ينتمي إلى هذا النوع.';
                SET @ErrorType = 3;
                RETURN;
            END



            -- Take Type from Category
            SET @Type_ID = @CategoryTypeID;

        END



        ----------------------------------------------------
        -- Duplicate Product Check
        ----------------------------------------------------
        IF EXISTS
        (
            SELECT 1
            FROM Products
            WHERE ProductNameID = @ProductNameID
            AND ISNULL(Type_ID,-1) = ISNULL(@Type_ID,-1)
            AND ISNULL(Category_ID,-1) = ISNULL(@Category_ID,-1)
        )
        BEGIN
            SET @NewID = -1;
            SET @Message = N'هذا المنتج موجود مسبقاً.';
            SET @ErrorType = 3;
            RETURN;
        END



        ----------------------------------------------------
        -- Insert Product
        ----------------------------------------------------
        INSERT INTO Products
        (
            ProductNameID,
            Type_ID,
            Category_ID,
            Quantity,
            Purchase_Price,
            Sale_Price,
            IsStoreOwned
        )
        VALUES
        (
            @ProductNameID,
            @Type_ID,
            @Category_ID,
            @Quantity,
            @Purchase_Price,
            @Sale_Price,
            @IsStoreOwned
        );



        SET @NewID = SCOPE_IDENTITY();
        SET @Message = N'تمت إضافة المنتج بنجاح.';
        SET @ErrorType = 0;



    END TRY

    BEGIN CATCH

        SET @NewID = -1;
        SET @Message = ERROR_MESSAGE();
        SET @ErrorType = 5;

    END CATCH

END
GO
/****** Object:  StoredProcedure [dbo].[SP_AddTypes]    Script Date: 7/29/2026 5:38:16 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[SP_AddTypes]
    @TypeName nvarchar(MAX)
    ,@NewID INT OUTPUT
    ,@Message NVARCHAR(250) OUTPUT
    ,@ErrorType INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
IF EXISTS (SELECT 1 FROM Types WHERE TypeName = @TypeName)
BEGIN
    SET @Message = N'هذا النوع موجود مسبقاً';
    SET @ErrorType = 4;
	return ;
	
END

        INSERT INTO Types (TypeName)
        VALUES (@TypeName);

        SET @NewID = SCOPE_IDENTITY();
        SET @Message = N'تمت إضافة النوع بنجاح.';
        SET @ErrorType = 0;  -- Success

    END TRY
    BEGIN CATCH
        SET @NewID = -1;
        SET @Message = ERROR_MESSAGE();
        SET @ErrorType = 5;  -- DatabaseError
    END CATCH
END

GO
/****** Object:  StoredProcedure [dbo].[SP_DeleteCategoriesByID]    Script Date: 7/29/2026 5:38:16 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[SP_DeleteCategoriesByID]
    @ID int,
    @Message NVARCHAR(250) OUTPUT,
    @ErrorType INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY

	if  exists (select 1 from Products where Products.Category_ID=@ID)
	begin
	   SET @Message = N'لا يمكن حذف التصنيف لأنه مرتبط بسجلات أخرى.';
            SET @ErrorType = 4;
			return;

	end
   
        IF NOT EXISTS (SELECT 1 FROM [Categories] WHERE [ID] = @ID)
        BEGIN
            SET @Message = N'التصنيف غير موجود.';
            SET @ErrorType = 2;
            RETURN;
        END

        DELETE FROM [Categories] WHERE [ID] = @ID;

        SET @Message = N'تم حذف التصنيف بنجاح.';
        SET @ErrorType = 0;

    END TRY
    BEGIN CATCH
        -- FK Constraint
        IF ERROR_NUMBER() = 547
        BEGIN
            SET @Message = N'لا يمكن حذف التصنيف لأنه مرتبط بسجلات أخرى.';
            SET @ErrorType = 4;
        END
        ELSE
        BEGIN
            SET @Message = ERROR_MESSAGE();
            SET @ErrorType = 5;
        END
    END CATCH
END

GO
/****** Object:  StoredProcedure [dbo].[SP_DeleteExpensesByID]    Script Date: 7/29/2026 5:38:16 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[SP_DeleteExpensesByID]
    @ID int,
    @Message NVARCHAR(250) OUTPUT,
    @ErrorType INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY

        -- التحقق أن الصف موجود
        IF NOT EXISTS (SELECT 1 FROM [Expenses] WHERE [ID] = @ID)
        BEGIN
            SET @Message = N'المصروف غير موجود.';
            SET @ErrorType = 2;
            RETURN;
        END

        DELETE FROM [Expenses] WHERE [ID] = @ID;

        SET @Message = N'تم حذف المصروف بنجاح.';
        SET @ErrorType = 0;

    END TRY
    BEGIN CATCH
        -- FK Constraint
        IF ERROR_NUMBER() = 547
        BEGIN
            SET @Message = N'لا يمكن حذف المصروف لأنه مرتبط بسجلات أخرى.';
            SET @ErrorType = 4;
        END
        ELSE
        BEGIN
            SET @Message = ERROR_MESSAGE();
            SET @ErrorType = 5;
        END
    END CATCH
END


GO
/****** Object:  StoredProcedure [dbo].[SP_DeleteProductNamesByProductNameID]    Script Date: 7/29/2026 5:38:16 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[SP_DeleteProductNamesByProductNameID]
    @ProductNameID int,
    @Message NVARCHAR(250) OUTPUT,
    @ErrorType INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY


		if  exists (select 1 from Products where Products.ProductNameID=@ProductNameID)
	begin
	   SET @Message = N'لا يمكن حذف اسم المنتج لأنه مرتبط بسجلات أخرى.';
            SET @ErrorType = 4;
			return ;

	end
   
        -- التحقق أن الصف موجود
        IF NOT EXISTS (SELECT 1 FROM [ProductNames] WHERE [ProductNameID] = @ProductNameID)
        BEGIN
            SET @Message = N'اسم المنتج غير موجود.';
            SET @ErrorType = 2;
            RETURN;
        END

        DELETE FROM [ProductNames] WHERE [ProductNameID] = @ProductNameID;

        SET @Message = N'تم حذف اسم المنتج بنجاح.';
        SET @ErrorType = 0;

    END TRY
    BEGIN CATCH
        -- FK Constraint
        IF ERROR_NUMBER() = 547
        BEGIN
            SET @Message = N'لا يمكن حذف اسم المنتج لأنه مرتبط بسجلات أخرى.';
            SET @ErrorType = 4;
        END
        ELSE
        BEGIN
            SET @Message = ERROR_MESSAGE();
            SET @ErrorType = 5;
        END
    END CATCH
END


GO
/****** Object:  StoredProcedure [dbo].[SP_DeleteProductsByID]    Script Date: 7/29/2026 5:38:16 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[SP_DeleteProductsByID]
    @ID int,
    @Message NVARCHAR(250) OUTPUT,
    @ErrorType INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY

	if  exists(select 1 from InvoiceItems where InvoiceItems.ProductID=@ID)
	begin
	      SET @Message = N'لا يمكن حذف المنتج لأنه مرتبط بسجلات أخرى.';
            SET @ErrorType = 4;
			return;
	end

        -- التحقق أن الصف موجود
        IF NOT EXISTS (SELECT 1 FROM [Products] WHERE [ID] = @ID)
        BEGIN
            SET @Message = N'المنتج غير موجود.';
            SET @ErrorType = 2;
            RETURN;
        END

        DELETE FROM [Products] WHERE [ID] = @ID;

        SET @Message = N'تم حذف المنتج بنجاح.';
        SET @ErrorType = 0;

    END TRY
    BEGIN CATCH
        -- FK Constraint
        IF ERROR_NUMBER() = 547
        BEGIN
            SET @Message = N'لا يمكن حذف المنتج لأنه مرتبط بسجلات أخرى.';
            SET @ErrorType = 4;
        END
        ELSE
        BEGIN
            SET @Message = ERROR_MESSAGE();
            SET @ErrorType = 5;
        END
    END CATCH
END




select * from Products
GO
/****** Object:  StoredProcedure [dbo].[SP_DeleteTypesByID]    Script Date: 7/29/2026 5:38:16 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[SP_DeleteTypesByID]
    @ID int,
    @Message NVARCHAR(250) OUTPUT,
    @ErrorType INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
		if  exists (select 1 from Products where Products.Type_ID=@ID)
	begin
	   SET @Message = N'لا يمكن حذف النوع لأنه مرتبط بسجلات أخرى.';
            SET @ErrorType = 4;
			return;

	end
		if  exists (select 1 from Categories where Categories.Type_ID=@ID)
	begin
	   SET @Message = N'لا يمكن حذف النوع لأنه مرتبط بسجلات أخرى.';
            SET @ErrorType = 4;
			return;

	end

        -- التحقق أن الصف موجود
        IF NOT EXISTS (SELECT 1 FROM [Types] WHERE [ID] = @ID)
        BEGIN
            SET @Message = N'النوع غير موجود.';
            SET @ErrorType = 2;
            RETURN;
        END


        DELETE FROM [Types] WHERE [ID] = @ID;

        SET @Message = N'تم حذف النوع بنجاح.';
        SET @ErrorType = 0;

    END TRY
    BEGIN CATCH
        -- FK Constraint
        IF ERROR_NUMBER() = 547
        BEGIN
            SET @Message = N'لا يمكن حذف النوع لأنه مرتبط بسجلات أخرى.';
            SET @ErrorType = 4;
        END
        ELSE
        BEGIN
            SET @Message = ERROR_MESSAGE();
            SET @ErrorType = 5;
        END
    END CATCH
END

GO
/****** Object:  StoredProcedure [dbo].[SP_GetAllCategories]    Script Date: 7/29/2026 5:38:16 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[SP_GetAllCategories]
AS
BEGIN

    
      SELECT Categories.ID, Categories.CategorieName, Types.TypeName 
FROM     Categories INNER JOIN
                  Types ON Categories.Type_ID = Types.ID
;
END
GO
/****** Object:  StoredProcedure [dbo].[SP_GetAllExpenses]    Script Date: 7/29/2026 5:38:16 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[SP_GetAllExpenses]
AS
BEGIN

SELECT ID, Date, Amount, Description FROM     Expenses
;
END


GO
/****** Object:  StoredProcedure [dbo].[SP_GetAllInvoiceItems]    Script Date: 7/29/2026 5:38:16 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[SP_GetAllInvoiceItems]
    @ProductName NVARCHAR(MAX) = NULL,
    @TypeName NVARCHAR(MAX) = NULL,
    @CategorieName NVARCHAR(MAX) = NULL,
    @FromDate DATE = NULL,
    @ToDate DATE = NULL,
    @IsStoreOwned BIT = NULL
AS
BEGIN

SELECT 
    InvoiceItems.ID,
    Products.ID AS ProductID,
    ProductNames.ProductName,
    Types.TypeName,
    Categories.CategorieName,
    Invoices.Date,
    InvoiceItems.Qty,
    InvoiceItems.UnitPrice,
    Products.IsStoreOwned
FROM InvoiceItems
INNER JOIN Products 
    ON InvoiceItems.ProductID = Products.ID
INNER JOIN ProductNames 
    ON Products.ProductNameID = ProductNames.ProductNameID
INNER JOIN Types 
    ON Products.Type_ID = Types.ID
LEFT JOIN Categories 
    ON Products.Category_ID = Categories.ID
INNER JOIN Invoices 
    ON InvoiceItems.InvoiceID = Invoices.ID

WHERE
(@ProductName IS NULL OR ProductNames.ProductName = @ProductName)
AND (@TypeName IS NULL OR Types.TypeName = @TypeName)
AND (@CategorieName IS NULL OR Categories.CategorieName = @CategorieName)
AND (@IsStoreOwned IS NULL OR Products.IsStoreOwned = @IsStoreOwned)
AND (@FromDate IS NULL OR Invoices.Date >= @FromDate)
AND (@ToDate IS NULL OR Invoices.Date <= @ToDate)

END


GO
/****** Object:  StoredProcedure [dbo].[SP_GetAllInvoiceItemsByInvoiceID]    Script Date: 7/29/2026 5:38:16 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[SP_GetAllInvoiceItemsByInvoiceID]
    @InvoiceID int


AS
BEGIN
    SET NOCOUNT ON;


     
  SELECT     InvoiceItems.ID,     Products.ID AS ProductID,     ProductNames.ProductName,     InvoiceItems.Qty,     InvoiceItems.OriginalPrice,     InvoiceItems.CostPrice,     InvoiceItems.UnitPrice, 	Products.IsStoreOwned, 	Invoices.Date 	,CAST(CASE WHEN EXISTS (
    SELECT 1 FROM InvoiceReturns r WHERE r.InvoiceItemID = InvoiceItems.ID
) THEN 1 ELSE 0 END AS BIT) AS IsReturned
  FROM InvoiceItems Inner join Invoices on InvoiceItems.InvoiceID=Invoices.ID
  INNER JOIN Products     ON InvoiceItems.ProductID = Products.ID 
  INNER JOIN ProductNames     ON Products.ProductNameID = ProductNames.ProductNameID


				  WHERE InvoiceItems.InvoiceID = @InvoiceID

    


END

GO
/****** Object:  StoredProcedure [dbo].[SP_GetAllInvoiceReturns]    Script Date: 7/29/2026 5:38:16 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[SP_GetAllInvoiceReturns]
AS
BEGIN

        
SELECT InvoiceReturns.ID, InvoiceReturns.InvoiceItemID, InvoiceReturns.ReturnPrice,InvoiceReturns.ReturnDate, InvoiceItems.Qty, InvoiceItems.CostPrice, ProductNames.ProductName, Products.IsStoreOwned
FROM     InvoiceReturns 
                  INNER JOIN
                  InvoiceItems ON InvoiceReturns.InvoiceItemID = InvoiceItems.ID
				  INNER JOIN
                  Products ON InvoiceItems.ProductID = Products.ID
				  INNER JOIN
                  ProductNames ON Products.ProductNameID = ProductNames.ProductNameID
;
END


GO
/****** Object:  StoredProcedure [dbo].[SP_GetAllInvoicesByDate]    Script Date: 7/29/2026 5:38:16 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[SP_GetAllInvoicesByDate]
    @FromDate datetime=null,
	@ToDate datetime=null
AS
BEGIN

SELECT ID, Date, Total FROM     Invoices
    WHERE
       ( Invoices.Date between @FromDate and @ToDate ) or (@FromDate is null and @ToDate is null)
;
END

GO
/****** Object:  StoredProcedure [dbo].[SP_GetAllNumberProducts]    Script Date: 7/29/2026 5:38:16 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[SP_GetAllNumberProducts]
AS
BEGIN
select count(Products.ID)as[NumberOfProduct] from Products

        

;
END
GO
/****** Object:  StoredProcedure [dbo].[SP_GetAllProductNames]    Script Date: 7/29/2026 5:38:16 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[SP_GetAllProductNames]
AS
BEGIN

        SELECT
            [ProductNames].[ProductNameID],
            [ProductNames].[ProductName]
        FROM [ProductNames]
;
END


GO
/****** Object:  StoredProcedure [dbo].[SP_GetAllTypes]    Script Date: 7/29/2026 5:38:16 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[SP_GetAllTypes]
AS
BEGIN

        SELECT
            [Types].[ID],
            [Types].[TypeName]
        FROM [Types]
;
END


GO
/****** Object:  StoredProcedure [dbo].[SP_GetCategoriesByID]    Script Date: 7/29/2026 5:38:16 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[SP_GetCategoriesByID]
    @ID int,
    @Message VARCHAR(150) OUTPUT,
    @ErrorType INT OUTPUT

AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY


        IF NOT EXISTS (
                    SELECT 1
            FROM [Categories]
                    WHERE [Categories].[ID] = @ID
        )
        BEGIN
            SET @Message = N'التصنيف غير موجود.';
            SET @ErrorType = 2;
            RETURN;
        END

      SELECT Categories.ID, Categories.CategorieName, Types.TypeName 
FROM     Categories INNER JOIN
                  Types ON Categories.Type_ID = Types.ID
        WHERE [Categories].[ID] = @ID

        SET @Message = N'تم تحميل التصنيفات بنجاح.';
        SET @ErrorType = 0;

    END TRY
    BEGIN CATCH
        SET @Message =
            ERROR_MESSAGE() + N' | السطر: ' + CAST(ERROR_LINE() AS VARCHAR);
        SET @ErrorType = 5;
    END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[SP_GetExpensesByID]    Script Date: 7/29/2026 5:38:16 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[SP_GetExpensesByID]
    @ID int,
    @Message VARCHAR(150) OUTPUT,
    @ErrorType INT OUTPUT

AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY


        IF NOT EXISTS (
        SELECT ID, Date, Amount, Description FROM     Expenses
            
                    WHERE [Expenses].[ID] = @ID
        )
        BEGIN
            SET @Message = N'المصروف غير موجود.';
            SET @ErrorType = 2;
            RETURN;
        END

SELECT ID, Date, Amount, Description FROM     Expenses
        WHERE [Expenses].[ID] = @ID

        SET @Message = N'تم تحميل المصروفات بنجاح.';
        SET @ErrorType = 0;

    END TRY
    BEGIN CATCH
        SET @Message =
            ERROR_MESSAGE() + N' | السطر: ' + CAST(ERROR_LINE() AS VARCHAR);
        SET @ErrorType = 5;
    END CATCH
END


GO
/****** Object:  StoredProcedure [dbo].[SP_GetInvoicesByID]    Script Date: 7/29/2026 5:38:16 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[SP_GetInvoicesByID]
    @ID int,
    @Message VARCHAR(150) OUTPUT,
    @ErrorType INT OUTPUT

AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY


        IF NOT EXISTS (
        SELECT ID, Date, Total FROM     Invoices
            
                    WHERE [Invoices].[ID] = @ID
        )
        BEGIN
            SET @Message = N'الفاتورة غير موجودة.';
            SET @ErrorType = 2;
            RETURN;
        END

SELECT ID, Date, Total FROM     Invoices
        WHERE [Invoices].[ID] = @ID

        SET @Message = N'تم تحميل الفواتير بنجاح.';
        SET @ErrorType = 0;

    END TRY
    BEGIN CATCH
        SET @Message =
            ERROR_MESSAGE() + N' | السطر: ' + CAST(ERROR_LINE() AS VARCHAR);
        SET @ErrorType = 5;
    END CATCH
END


GO
/****** Object:  StoredProcedure [dbo].[SP_GetProductNamesByProductNameID]    Script Date: 7/29/2026 5:38:16 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[SP_GetProductNamesByProductNameID]
    @ProductNameID int,
    @Message VARCHAR(150) OUTPUT,
    @ErrorType INT OUTPUT

AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY


        IF NOT EXISTS (
                    SELECT 1
            FROM [ProductNames]
                    WHERE [ProductNames].[ProductNameID] = @ProductNameID
        )
        BEGIN
            SET @Message = N'اسم المنتج غير موجود.';
            SET @ErrorType = 2;
            RETURN;
        END

        SELECT
            [ProductNames].[ProductNameID],
            [ProductNames].[ProductName]
        FROM [ProductNames]
        WHERE [ProductNames].[ProductNameID] = @ProductNameID

        SET @Message = N'تم تحميل أسماء المنتجات بنجاح.';
        SET @ErrorType = 0;

    END TRY
    BEGIN CATCH
        SET @Message =
            ERROR_MESSAGE() + N' | السطر: ' + CAST(ERROR_LINE() AS VARCHAR);
        SET @ErrorType = 5;
    END CATCH
END


GO
/****** Object:  StoredProcedure [dbo].[SP_GetProductsByID]    Script Date: 7/29/2026 5:38:16 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[SP_GetProductsByID]
    @ID int,
    @Message VARCHAR(150) OUTPUT,
    @ErrorType INT OUTPUT

AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY


        IF NOT EXISTS (
SELECT 
    Products.ID, 
    ProductNames.ProductName, 
    Types.TypeName, 
    Categories.CategorieName, 
    Products.Quantity, 
    Products.Purchase_Price, 
    Products.Sale_Price, 
    Products.IsStoreOwned
FROM Products
INNER JOIN ProductNames 
    ON Products.ProductNameID = ProductNames.ProductNameID
LEFT JOIN Categories 
    ON Products.Category_ID = Categories.ID
INNER JOIN Types 
    ON Products.Type_ID = Types.ID   
				  
                    WHERE [Products].[ID] = @ID
        )
        BEGIN
            SET @Message = N'المنتج غير موجود.';
            SET @ErrorType = 2;
            RETURN;
        END

SELECT 
    Products.ID, 
    ProductNames.ProductName, 
    Types.TypeName, 
    Categories.CategorieName, 
    Products.Quantity, 
    Products.Purchase_Price, 
    Products.Sale_Price, 
    Products.IsStoreOwned
FROM Products
INNER JOIN ProductNames 
    ON Products.ProductNameID = ProductNames.ProductNameID
LEFT JOIN Categories 
    ON Products.Category_ID = Categories.ID
INNER JOIN Types 
    ON Products.Type_ID = Types.ID    
				  
				  WHERE [Products].[ID] = @ID

        SET @Message = N'تم تحميل المنتجات بنجاح.';
        SET @ErrorType = 0;

    END TRY
    BEGIN CATCH
        SET @Message =
            ERROR_MESSAGE() + N' | السطر: ' + CAST(ERROR_LINE() AS VARCHAR);
        SET @ErrorType = 5;
    END CATCH
END

GO
/****** Object:  StoredProcedure [dbo].[SP_GetTypesByID]    Script Date: 7/29/2026 5:38:16 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[SP_GetTypesByID]
    @ID int,
    @Message VARCHAR(150) OUTPUT,
    @ErrorType INT OUTPUT

AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY


        IF NOT EXISTS (
                    SELECT 1
            FROM [Types]
                    WHERE [Types].[ID] = @ID
        )
        BEGIN
            SET @Message = N'النوع غير موجود.';
            SET @ErrorType = 2;
            RETURN;
        END

        SELECT
            [Types].[ID],
            [Types].[TypeName]
        FROM [Types]
        WHERE [Types].[ID] = @ID

        SET @Message = N'تم تحميل الأنواع بنجاح.';
        SET @ErrorType = 0;

    END TRY
    BEGIN CATCH
        SET @Message =
            ERROR_MESSAGE() + N' | السطر: ' + CAST(ERROR_LINE() AS VARCHAR);
        SET @ErrorType = 5;
    END CATCH
END


GO
/****** Object:  StoredProcedure [dbo].[SP_SearchInvoiceItems]    Script Date: 7/29/2026 5:38:16 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[SP_SearchInvoiceItems]
    @ProductID int=NULL,
    @IsStoreOwned bit=NULL,
	@FromDate Date=null,
	@ToDate Date=null


AS
BEGIN
  SELECT     InvoiceItems.ID,     Products.ID AS ProductID,     ProductNames.ProductName,     InvoiceItems.Qty,     InvoiceItems.OriginalPrice,     InvoiceItems.CostPrice,     InvoiceItems.UnitPrice, 	Products.IsStoreOwned, 	Invoices.Date 	 FROM InvoiceItems Inner join Invoices on InvoiceItems.InvoiceID=Invoices.ID INNER JOIN Products     ON InvoiceItems.ProductID = Products.ID INNER JOIN ProductNames     ON Products.ProductNameID = ProductNames.ProductNameID
				  
WHERE
 	
  not EXISTS
(

    SELECT *
    FROM InvoiceReturns 
	where InvoiceReturns.InvoiceItemID=InvoiceItems.ID
    
)
and 
(
    (@ProductID IS NULL OR Products.ID = @ProductID)
AND (@IsStoreOwned IS NULL OR Products.IsStoreOwned = @IsStoreOwned)
AND
(
    (@FromDate IS NULL OR @ToDate IS NULL)
    OR Invoices.Date BETWEEN @FromDate AND @ToDate
));
		


;
END
GO
/****** Object:  StoredProcedure [dbo].[SP_SearchProducts]    Script Date: 7/29/2026 5:38:16 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[SP_SearchProducts]
    @ProductName NVARCHAR(MAX) = NULL,
    @TypeName NVARCHAR(MAX) = NULL,
    @CategorieName NVARCHAR(MAX) = NULL,
	@OrderByLowestQuantity bit =null
AS
BEGIN
 if (@OrderByLowestQuantity=1) begin 

 SELECT 
    Products.ID, 
    ProductNames.ProductName, 
    Types.TypeName, 
    Categories.CategorieName, 
    Products.Quantity, 
    Products.Purchase_Price, 
    Products.Sale_Price, 
    Products.IsStoreOwned
FROM Products
INNER JOIN ProductNames 
    ON Products.ProductNameID = ProductNames.ProductNameID
LEFT JOIN Categories 
    ON Products.Category_ID = Categories.ID
LEFT JOIN Types 
    ON Products.Type_ID = Types.ID   
order by Quantity

 return ;
 end 
 

SELECT 
    Products.ID, 
    ProductNames.ProductName, 
    Types.TypeName, 
    Categories.CategorieName, 
    Products.Quantity, 
    Products.Purchase_Price, 
    Products.Sale_Price, 
    Products.IsStoreOwned
FROM Products
INNER JOIN ProductNames 
    ON Products.ProductNameID = ProductNames.ProductNameID
LEFT JOIN Categories 
    ON Products.Category_ID = Categories.ID
LEFT JOIN Types 
    ON Products.Type_ID = Types.ID   



    WHERE
        (@ProductName IS NULL OR ProductNames.ProductName COLLATE SQL_Latin1_General_CP1_CI_AS LIKE @ProductName + '%')
        AND (@TypeName IS NULL OR Types.TypeName COLLATE SQL_Latin1_General_CP1_CI_AS LIKE @TypeName + '%')
        AND (@CategorieName IS NULL OR Categories.CategorieName COLLATE SQL_Latin1_General_CP1_CI_AS LIKE @CategorieName + '%')

END

GO
/****** Object:  StoredProcedure [dbo].[SP_SearchSalesInventory]    Script Date: 7/29/2026 5:38:16 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[SP_SearchSalesInventory]
     @Period INT=NULL,
    @FromDate DATE = NULL,
    @ToDate DATE = NULL,
	@IsStoreOwned bit=null
AS
BEGIN

     select
dbo.fn_TotalCost(@Period,@FromDate,@ToDate,@IsStoreOwned) as [TotalCost],
dbo.fn_TotalProductInSystem(@IsStoreOwned) as [TotalProducts], 
dbo.fn_Total_Purchase_Price_Product(@IsStoreOwned)as[TotalPurchasePriceProduct],
dbo.fn_Total_Sale_Price_Product(@IsStoreOwned) as[TotalSalePriceProduct],
dbo.fn_TotalProductsSold(@Period,@FromDate,@ToDate,@IsStoreOwned)  as [TotalProductsSold],
dbo.fn_TotalProfit(@Period,@FromDate,@ToDate,@IsStoreOwned) as [TotalProfit],
dbo.fn_TotalProfitWithCost(@Period,@FromDate,@ToDate,@IsStoreOwned) as [TotalInventorySaleValue],
dbo.fn_TotalExpenses(@Period,@FromDate,@ToDate) as [TotalExpenses],
dbo.fn_TotalReturnCost(@Period,@FromDate,@ToDate,@IsStoreOwned) as [TotalReturnCost]


;
END
GO
/****** Object:  StoredProcedure [dbo].[SP_UpdateCategoriesByID]    Script Date: 7/29/2026 5:38:16 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[SP_UpdateCategoriesByID]
    @ID int,
    @CategorieName nvarchar(MAX),
    @Type_ID int,
    @Message NVARCHAR(250) OUTPUT,
    @ErrorType INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        -- تحقق وجود الصف
           IF NOT EXISTS (SELECT 1 FROM [Categories] WHERE [ID] = @ID)
        BEGIN
            SET @Message = N'التصنيف غير موجود.';
            SET @ErrorType = 2;
            RETURN;
        END

        -- تحقق الأعمدة الأجنبية

        IF @Type_ID IS NOT NULL AND  NOT EXISTS (SELECT 1 FROM [Types] WHERE [Types].[ID] = @Type_ID)
        BEGIN
            SET @Message = N'النوع غير صالح';
            SET @ErrorType = 3;  -- AlreadyExists
            RETURN;
        END

				if exists (select 1 from Categories where Categories.CategorieName=@CategorieName) 
		begin
		       
            SET @Message = N'اسم التصنيف موجود مسبقاً.';
            SET @ErrorType = 3;
            RETURN;



		end

        -- تحديث الصف
        UPDATE [Categories]
        SET
            [CategorieName] = COALESCE(@CategorieName,CategorieName),
            [Type_ID] = COALESCE(@Type_ID,Type_ID)
        WHERE [ID] = @ID;

        SET @Message = N'تم تحديث التصنيف بنجاح.';
        SET @ErrorType = 0;

        -- ارجاع الصف المحدث
        SELECT [Categories].[ID], [Categories].[CategorieName], [Categories].[Type_ID]
        FROM [Categories]
        WHERE [ID] = @ID;

    END TRY
    BEGIN CATCH
        SET @Message = ERROR_MESSAGE() + N' | السطر: ' + CAST(ERROR_LINE() AS NVARCHAR);
        SET @ErrorType = 5;
    END CATCH
END


GO
/****** Object:  StoredProcedure [dbo].[SP_UpdateExpensesByID]    Script Date: 7/29/2026 5:38:16 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
Create PROCEDURE [dbo].[SP_UpdateExpensesByID]
    @ID int,
    @Amount decimal(18,2),
    @Description nvarchar(MAX),
    @Message NVARCHAR(250) OUTPUT,
    @ErrorType INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        -- تحقق وجود الصف
           IF NOT EXISTS (SELECT 1 FROM [Expenses] WHERE [ID] = @ID)
        BEGIN
            SET @Message = N'المصروف غير موجود.';
            SET @ErrorType = 2;
            RETURN;
        END

        -- تحقق الأعمدة الأجنبية

        -- تحديث الصف
        UPDATE [Expenses]
        SET
            [Amount] = COALESCE(@Amount,Amount),
            [Description] = COALESCE(@Description,Description)
        WHERE [ID] = @ID;

        SET @Message = N'تم تحديث المصروف بنجاح.';
        SET @ErrorType = 0;

        -- ارجاع الصف المحدث
        SELECT [Expenses].[ID], [Expenses].[Date], [Expenses].[Amount], [Expenses].[Description]
        FROM [Expenses]
        WHERE [ID] = @ID;

    END TRY
    BEGIN CATCH
        SET @Message = ERROR_MESSAGE() + N' | السطر: ' + CAST(ERROR_LINE() AS NVARCHAR);
        SET @ErrorType = 5;
    END CATCH
END


GO
/****** Object:  StoredProcedure [dbo].[SP_UpdateProductNamesByProductNameID]    Script Date: 7/29/2026 5:38:16 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[SP_UpdateProductNamesByProductNameID]
    @ProductNameID int,
    @ProductName nvarchar(MAX),
    @Message NVARCHAR(250) OUTPUT,
    @ErrorType INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        -- تحقق وجود الصف
           IF NOT EXISTS (SELECT 1 FROM [ProductNames] WHERE [ProductNameID] = @ProductNameID)
        BEGIN
            SET @Message = N'اسم المنتج غير موجود.';
            SET @ErrorType = 2;
            RETURN;
        END


				if exists (select 1 from ProductNames where ProductNames.ProductName=@ProductName) 
		begin
		       
            SET @Message = N'اسم المنتج موجود مسبقاً.';
            SET @ErrorType = 3;
            RETURN;



		end
        -- تحقق الأعمدة الأجنبية

        -- تحديث الصف
        UPDATE [ProductNames]
        SET
            [ProductName] = COALESCE(@ProductName,ProductName)
        WHERE [ProductNameID] = @ProductNameID;

        SET @Message = N'تم تحديث اسم المنتج بنجاح.';
        SET @ErrorType = 0;

        -- ارجاع الصف المحدث
        SELECT [ProductNames].[ProductNameID], [ProductNames].[ProductName]
        FROM [ProductNames]
        WHERE [ProductNameID] = @ProductNameID;

    END TRY
    BEGIN CATCH
        SET @Message = ERROR_MESSAGE() + N' | السطر: ' + CAST(ERROR_LINE() AS NVARCHAR);
        SET @ErrorType = 5;
    END CATCH
END


GO
/****** Object:  StoredProcedure [dbo].[SP_UpdateProductsByID]    Script Date: 7/29/2026 5:38:16 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


-- SP_UpdateProductsByID
CREATE PROCEDURE [dbo].[SP_UpdateProductsByID]
    @ID int,
    @ProductNameID INT,
    @Type_ID int,
    @Category_ID int,
    @Quantity int,
    @Purchase_Price decimal(18,2),
    @Sale_Price decimal(18,2),
    @IsStoreOwned bit,
    @Message NVARCHAR(250) OUTPUT,
    @ErrorType INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        IF NOT EXISTS (SELECT 1 FROM [Products] WHERE [ID] = @ID)
        BEGIN
            SET @Message = N'المنتج غير موجود.';
            SET @ErrorType = 2;
            RETURN;
        END
		-- اول شي لازم جيب اسم الصنف هل متطابق مع  النوع  يعني مثلا لو غير النوع لازم يكون متاطبق مع نوع الصنف 
		--if EXISTS (SELECT Categories.Type_ID from Categories where Categories. )
		
 if @Type_ID IS NOT NULL AND @Category_ID Is not null and  not	 (select Categories.Type_ID from Categories where Categories.ID=@Category_ID)=(select Types.ID from Types where Types.ID=@Type_ID)
		begin 
		         SET @Message = N'معرف النوع غير صالح';
            SET @ErrorType = 3;
            RETURN;

		end 

        IF @Type_ID IS NOT NULL AND NOT EXISTS (SELECT 1 FROM [Types] WHERE [Types].[ID] = @Type_ID)
        BEGIN
            SET @Message = N'النوع غير صالح';
            SET @ErrorType = 3;
            RETURN;
        END

        IF @Category_ID IS NOT NULL AND NOT EXISTS (SELECT 1 FROM [Categories] WHERE [Categories].[ID] = @Category_ID)
        BEGIN
            SET @Message = N'التصنيف غير صالح';
            SET @ErrorType = 3;
            RETURN;
        END

        -- ✅ الإصلاح: لو فيه Category_ID جاي بالتحديث، الـ Type_ID لازم ينشتق منها دايمًا
        IF @Category_ID IS NOT NULL
        BEGIN
            SELECT @Type_ID = Type_ID FROM Categories WHERE ID = @Category_ID;
        END

        UPDATE [Products]
        SET
            [ProductNameID] = COALESCE(@ProductNameID, ProductNameID),
            [Type_ID] = COALESCE(@Type_ID, Type_ID),
            [Category_ID] = COALESCE(@Category_ID, Category_ID),
            [Quantity] = COALESCE(@Quantity, Quantity),
            [Purchase_Price] = COALESCE(@Purchase_Price, Purchase_Price),
            [Sale_Price] = COALESCE(@Sale_Price, Sale_Price),
            [IsStoreOwned] = COALESCE(@IsStoreOwned, IsStoreOwned)
        WHERE [ID] = @ID;

        SET @Message = N'تم تحديث المنتج بنجاح.';
        SET @ErrorType = 0;

        SELECT [Products].[ID], [Products].[Type_ID], [Products].[Category_ID], [Products].[Quantity],
               [Products].[Purchase_Price], [Products].[Sale_Price], [Products].[IsStoreOwned], [Products].[ProductNameID]
        FROM [Products]
        WHERE [ID] = @ID;

    END TRY
    BEGIN CATCH
        SET @Message = ERROR_MESSAGE() + N' | السطر: ' + CAST(ERROR_LINE() AS NVARCHAR);
        SET @ErrorType = 5;
    END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[SP_UpdateTypesByID]    Script Date: 7/29/2026 5:38:16 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[SP_UpdateTypesByID]
    @ID int,
    @TypeName nvarchar(MAX),
    @Message NVARCHAR(250) OUTPUT,
    @ErrorType INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        -- تحقق وجود الصف
           IF NOT EXISTS (SELECT 1 FROM [Types] WHERE [ID] = @ID)
        BEGIN
            SET @Message = N'النوع غير موجود.';
            SET @ErrorType = 2;
            RETURN;
        END
		if exists (select 1 from Types where Types.TypeName=@TypeName) 
		begin
		       
            SET @Message = N'اسم النوع موجود مسبقاً.';
            SET @ErrorType = 3;
            RETURN;



		end

        -- تحقق الأعمدة الأجنبية

        -- تحديث الصف
        UPDATE [Types]
        SET
            [TypeName] = COALESCE(@TypeName,TypeName)
        WHERE [ID] = @ID;

        SET @Message = N'تم تحديث النوع بنجاح.';
        SET @ErrorType = 0;

        -- ارجاع الصف المحدث
        SELECT [Types].[ID], [Types].[TypeName]
        FROM [Types]
        WHERE [ID] = @ID;

    END TRY
    BEGIN CATCH
        SET @Message = ERROR_MESSAGE() + N' | السطر: ' + CAST(ERROR_LINE() AS NVARCHAR);
        SET @ErrorType = 5;
    END CATCH
END


GO
USE [master]
GO
ALTER DATABASE [AppDB] SET  READ_WRITE 
GO
