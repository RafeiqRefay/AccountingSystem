using System.ComponentModel.DataAnnotations;

public class SalesInventoryViewDTO
{
    public decimal TotalCost { get; set; }
    public decimal TotalProducts { get; set; }
    public decimal TotalPurchasePriceProduct { get; set; }
    public decimal TotalSalePriceProduct { get; set; }
    public decimal TotalProductsSold { get; set; }
    public decimal TotalProfit { get; set; }
    public decimal TotalInventorySaleValue { get; set; }

    public decimal TotalExpenses { get; set; }

    public decimal TotalReturnCost { get; set; }



    
    public SalesInventoryViewDTO() { }

    public SalesInventoryViewDTO(decimal totalCost, decimal totalProducts, decimal totalPurchasePriceProduct, decimal totalSalePriceProduct, decimal totalProductsSold, decimal totalProfit, decimal totalInventorySaleValue, decimal totalExpenses, decimal totalReturnCost)
    {
        TotalCost = totalCost;
        TotalProducts = totalProducts;
        TotalPurchasePriceProduct = totalPurchasePriceProduct;
        TotalSalePriceProduct = totalSalePriceProduct;
        TotalProductsSold = totalProductsSold;
        TotalProfit = totalProfit;
        TotalInventorySaleValue = totalInventorySaleValue;
        TotalExpenses = totalExpenses;
        TotalReturnCost = totalReturnCost;
    }
}

