import { HashRouter, Routes, Route } from "react-router-dom";

import ManageTypes from "./pages/Dashboard/ManageTypes/ManageTypes";
import ExpensesManagement from "./pages/Dashboard/ManageExpenses/ManageExpenses";
import CategoriesManagement from "./pages/Dashboard/ManageCategories/ManageCategories";
import ProductsManagement from "./pages/Dashboard/ManageProducts/ManagePrdoucts";
import ProductNamesManagement from "./pages/Dashboard/ManageProducts/ProductNamesManagement";
import CreateInvoice from "./pages/Dashboard/ManageInvoice/CreateInvoice";
import InvoicesManagement from "./pages/Dashboard/ManageInvoice/ManageInvoice";
import DisplaySales from "./pages/Dashboard/ManageSales/DisplaySales";
import DisplayInvoiceReturns from "./pages/Dashboard/ManageInvoice/DisplayInvoiceReturns";
import DisplaySalesInventory from "./pages/Dashboard/DisplaySalesInventory";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<DisplaySalesInventory />} />

        <Route
          path="/dashboard/manage-types"
          element={<ManageTypes />}
        />

        <Route
          path="/dashboard/manage-expenses"
          element={<ExpensesManagement />}
        />

        <Route
          path="/dashboard/manage-categories"
          element={<CategoriesManagement />}
        />

        <Route
          path="/dashboard/manage-products"
          element={<ProductsManagement />}
        />

        <Route
          path="/dashboard/manage-name-products"
          element={<ProductNamesManagement />}
        />

        <Route
          path="/dashboard/create-invoices"
          element={<CreateInvoice />}
        />

        <Route
          path="/dashboard/view-invoices"
          element={<InvoicesManagement />}
        />

        <Route
          path="/dashboard/view-sales"
          element={<DisplaySales />}
        />

        <Route
          path="/dashboard/display-invoice-returns"
          element={<DisplayInvoiceReturns />}
        />
      </Routes>
    </HashRouter>
  );
}