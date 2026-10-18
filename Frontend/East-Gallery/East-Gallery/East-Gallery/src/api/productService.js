import axiosInstance from "./axios";

// ══════════════════════════════════════════
//  INTERNAL — ProductName API (private helpers)
//  لا يُستخدم هذا مباشرةً من أي مكون
// ══════════════════════════════════════════

const _productNameApi = {
  getAll: () =>
    axiosInstance.get("/productnames/all").then((r) => r.data),

  create: (productName) =>
    axiosInstance
      .post("/productnames", { productNameID: 0, productName })
      .then((r) => r.data),

  update: (productNameID, productName) =>
    axiosInstance
      .put(`/productnames/${productNameID}`, { productNameID, productName })
      .then((r) => r.data),

  delete: (productNameID) =>
    axiosInstance
      .delete(`/productnames/${productNameID}`)
      .then((r) => r.data),
};

// ══════════════════════════════════════════
//  CORE LOGIC — resolveOrCreateProductName
//  الدالة الأساسية: تجد الاسم أو تنشئه تلقائياً
// ══════════════════════════════════════════

/**
 * يبحث عن الاسم في القائمة الموجودة.
 * إن وجده يعيد ID الموجود، وإن لم يجده ينشئ اسماً جديداً ويعيد ID الجديد.
 *
 * @param {string} productName
 * @param {Array}  cachedNames - قائمة الأسماء الموجودة (اختياري، لتجنب call زائد)
 * @returns {Promise<number>} productNameID
 */
async function resolveOrCreateProductName(productName, cachedNames = null) {
  const names = cachedNames ?? (await _productNameApi.getAll()).data;

  const normalizedInput = productName.trim().toLowerCase();
  const existing = names.find(
    (n) => n.productName.trim().toLowerCase() === normalizedInput
  );

  if (existing) {
    return existing.productNameID;
  }

  const created = await _productNameApi.create(productName.trim());
  return created.data.productNameID;
}

// ══════════════════════════════════════════
//  PUBLIC — Products API
//  هذه الدوال فقط هي المستخدمة في الـ Components
// ══════════════════════════════════════════

/**
 * جلب جميع المنتجات
 * @returns {Promise<{ data: Product[], message: string }>}
 */
export const getAllProducts = () =>
  axiosInstance
    .get("/productss/searchProduct")
    .then((r) => r.data);

/**
 * جلب منتج واحد بالـ ID
 * @param {number} id
 */
export const getProductById = (id) =>
  axiosInstance.get(`/productss/${id}`).then((r) => r.data);



/**
 * فلترة المنتجات
 * يمكن استخدام أي فلتر أو تركهم جميعاً فارغين
 *
/**
 * @param {{
 *  NameProduct?: string,
 *  TypeName?: string,
 *  CategorieName?: string,
 *  OrderByLowestQuantity?: boolean
 * }} filters
 */
export const searchProducts = (filters = {}) => {
  const params = {};

  if (filters.NameProduct?.trim()) {
    params.NameProduct = filters.NameProduct.trim();
  }

  if (filters.TypeName?.trim()) {
    params.TypeName = filters.TypeName.trim();
  }

  if (filters.CategorieName?.trim()) {
    params.CategorieName = filters.CategorieName.trim();
  }

  if (filters.OrderByLowestQuantity) {
    params.OrderByLowestQuantity = true;
  }

  return axiosInstance
    .get("/productss/searchProduct", { params })
    .then((r) => r.data);
};


/**
 * إنشاء منتج جديد
 * يحل اسم المنتج تلقائياً (يجد أو ينشئ productNameID)
 *
 * @param {{ productName, type_ID, category_ID, quantity, purchase_Price, sale_Price, isStoreOwned }} payload
 */
export const createProduct = async (payload) => {
  const { productName, ...rest } = payload;

  const productNameID = await resolveOrCreateProductName(productName);

  const response = await axiosInstance.post("/productss", {
    id: 0,
    productNameID,
    ...rest,
  });

  return response.data;
};

/**
 * تعديل منتج موجود
 * يحل اسم المنتج تلقائياً — يدعم تغيير الاسم
 *
 * @param {number} id
 * @param {{ productName, type_ID, category_ID, quantity, purchase_Price, sale_Price, isStoreOwned }} payload
 */
export const updateProduct = async (id, payload) => {
  const { productName, ...rest } = payload;

  const productNameID = await resolveOrCreateProductName(productName);

  const response = await axiosInstance.put(`/productss/${id}`, {
    id,
    productNameID,
    ...rest,
  });

  return response.data;
};

/**
 * حذف منتج
 * @param {number} id
 */
export const deleteProduct = (id) =>
  axiosInstance.delete(`/productss/${id}`).then((r) => r.data);

// ══════════════════════════════════════════
//  PUBLIC — ProductNames Management
//  للصفحات التي تدير الأسماء بشكل مستقل (اختياري)
// ══════════════════════════════════════════

export const getAllProductNames = () => _productNameApi.getAll();
export const createProductName  = (name) => _productNameApi.create(name);
export const updateProductName  = (id, name) => _productNameApi.update(id, name);
export const deleteProductName  = (id) => _productNameApi.delete(id);