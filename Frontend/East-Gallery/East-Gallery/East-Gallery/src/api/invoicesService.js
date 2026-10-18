import axiosInstance from "./axios";

// CREATE INVOICE
export const createInvoice = async (data) => {
  const response = await axiosInstance.post("/invoicess", data);

  return response.data;
};





export const getAllInvoicesByDate = async (fromDate, toDate) => {
  const params = {};

  if (fromDate) {
    params.FromDate = `${fromDate}T00:00:00`;
  }

  if (toDate) {
    params.ToDate = `${toDate}T23:59:59`;
  }

  const response = await axiosInstance.get(
    "/invoicess/GetAllInvoicesByDate",
    {
      params,
    }
  );

  return response.data;
};


// GET BY ID
export const getInvoiceItemsById = async (invoiceId) => {
  const response = await axiosInstance.get(
    "/InvoiceItemss/GetInvoiceItemByInvoiceID",
    {
      params: {
        InvoiceID: invoiceId,
      },
    }
  );

  return response.data;
};

export const searchProductItems = async (filters = {}) => {
  const params = {};

  if (filters.productID !== undefined && filters.productID !== "") {
    params.ProductID = Number(filters.productID);
  }


  if (
    filters.isStoreOwned !== undefined &&
    filters.isStoreOwned !== ""
  ) {
    params.IsStoreOwned = filters.isStoreOwned === "true";
  }


  // From Date
  if (filters.fromDate) {
    params.FromDate = `${filters.fromDate}T00:00:00`;
  }


  // To Date
  if (filters.toDate) {
    params.ToDate = `${filters.toDate}T23:59:59`;
  }


  const response = await axiosInstance.get(
    "/InvoiceItemss/SearchInvoiceItems",
    {
      params,
    }
  );

  return response.data;
};


export const createInvoiceReturn = async (invoiceItemID) => {
  console.log("invoiceItemID:", invoiceItemID, typeof invoiceItemID);

  const response = await axiosInstance.post("/invoicereturnss", {
    invoiceItemID: Number(invoiceItemID),
  });

  return response.data;
};


export const getAllInvoiceReturns = async () => {
  const response = await axiosInstance.get("/invoicereturnss/all");

  return response.data;
};


export const searchSalesInventory = async (filters = {}) => {
  const params = {};

  if (
    filters.period !== undefined &&
    filters.period !== ""
  ) {
    params.Period = Number(filters.period);
  }


  if (
    filters.period === "6"
  ) {

    if (filters.fromDate) {
      params.FromDate = `${filters.fromDate}T00:00:00`;
    }

    if (filters.toDate) {
      params.ToDate = `${filters.toDate}T23:59:59`;
    }

  }


  if (
    filters.isStoreOwned !== undefined &&
    filters.isStoreOwned !== ""
  ) {
    params.IsStoreOwned =
      filters.isStoreOwned === "true";
  }


  const response = await axiosInstance.get(
    "/salesinventorys/SearchSalesInventory",
    {
      params,
    }
  );


  return response.data;
};