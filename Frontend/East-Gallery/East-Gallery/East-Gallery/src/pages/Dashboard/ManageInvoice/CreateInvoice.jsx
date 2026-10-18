import DashboardLayout from "../../../components/layout/DashboardLayout";

import { Receipt, ShoppingCart, Package } from "lucide-react";

import { useEffect, useMemo, useState } from "react";

import Select from "react-select";

import { getAllProducts } from "../../../api/productService";

import { createInvoice } from "../../../api/invoicesService";

import { useToast } from "../../../context/ToastContext";

export default function CreateInvoice() {
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [quantities, setQuantities] = useState({});

  const [customPrices, setCustomPrices] = useState({});

  const [saving, setSaving] = useState(false);

  const [searchName, setSearchName] = useState("");

  const [filterType, setFilterType] = useState("");

  const [filterCategory, setFilterCategory] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 5;

  const { showToast } = useToast();

  const uniqueTypes = useMemo(() => {
    return [...new Set(products.map((p) => p.typeName).filter(Boolean))];
  }, [products]);

  const uniqueCategories = useMemo(() => {
    return [...new Set(products.map((p) => p.categorieName).filter(Boolean))];
  }, [products]);
  // GET PRODUCTS
  const fetchProducts = async () => {
    try {
      setLoading(true);

      const data = await getAllProducts();

      setProducts(data.data || []);
    } catch {
      showToast("فشل تحميل المنتجات", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // CHANGE QTY
  const handleQtyChange = (productId, value) => {
    const qty = Math.max(0, Number(value));

    setQuantities((prev) => ({
      ...prev,
      [productId]: qty,
    }));
  };

  // CHANGE CUSTOM PRICE
  const handlePriceChange = (productId, value) => {
    setCustomPrices((prev) => ({
      ...prev,
      [productId]: value,
    }));
  };

  // GET EFFECTIVE PRICE (custom price if set, otherwise the product's original price)
  const getEffectivePrice = (product) => {
    const custom = customPrices[product.id];

    if (custom !== undefined && custom !== "" && !isNaN(custom)) {
      return Number(custom);
    }

    return product.sale_Price;
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchName = product.productName
        ?.toLowerCase()
        .includes(searchName.toLowerCase());

      const matchType = filterType ? product.typeName === filterType : true;

      const matchCategory = filterCategory
        ? product.categorieName === filterCategory
        : true;

      return matchName && matchType && matchCategory;
    });
  }, [products, searchName, filterType, filterCategory]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;

    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchName, filterType, filterCategory]);

  // SELECTED PRODUCTS
  const selectedProducts = useMemo(() => {
    return products.filter((p) => quantities[p.id] > 0);
  }, [products, quantities]);

  // TOTAL (based on effective price: custom price if set, otherwise original price)
  const total = useMemo(() => {
    return selectedProducts.reduce((acc, product) => {
      return acc + getEffectivePrice(product) * quantities[product.id];
    }, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProducts, quantities, customPrices]);

  // VALIDATE
  const hasInvalidQty = selectedProducts.some(
    (product) => quantities[product.id] > product.quantity,
  );

  // CREATE
  const handleCreateInvoice = async () => {
    if (selectedProducts.length === 0) {
      return showToast("اختر منتج واحد على الأقل", "error");
    }

    if (hasInvalidQty) {
      return showToast("بعض الكميات غير متوفرة", "error");
    }

    try {
      setSaving(true);

      const payload = selectedProducts.map((product) => ({
        productID: product.id,
        qty: quantities[product.id],
        price: getEffectivePrice(product),
      }));

      const res = await createInvoice(payload);

      showToast(res.message || "تم إنشاء الفاتورة بنجاح");

      setQuantities({});

      setCustomPrices({});

      fetchProducts();
    } catch (err) {
      showToast(err.response?.data?.message || "حدث خطأ", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout title="إنشاء فاتورة">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">
            إنشاء فاتورة
          </h1>

          <p className="text-[var(--color-text-light)] mt-1">
            إنشاء فاتورة جديدة وإضافة المنتجات بسهولة
          </p>
        </div>

        <div
          className="
            w-14 h-14 rounded-3xl
            bg-[var(--color-primary)]/10
            flex items-center justify-center
          "
        >
          <Receipt size={26} className="text-[var(--color-primary)]" />
        </div>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        {/* PRODUCTS */}
        <div
          className="
            bg-white rounded-3xl border border-[var(--color-border)]
            p-5 shadow-sm
          "
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-[var(--color-text-light)]">
                المنتجات المختارة
              </p>

              <h3 className="text-2xl font-bold text-[var(--color-text)] mt-1">
                {selectedProducts.length}
              </h3>
            </div>

            <div
              className="
                w-12 h-12 rounded-2xl
                bg-blue-50 text-blue-500
                flex items-center justify-center
              "
            >
              <Package size={20} />
            </div>
          </div>
        </div>

        {/* TOTAL */}
        <div
          className="
            bg-white rounded-3xl border border-[var(--color-border)]
            p-5 shadow-sm
          "
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-[var(--color-text-light)]">
                الإجمالي النهائي
              </p>

              <h3 className="text-2xl font-bold text-[var(--color-primary)] mt-1">
                {total.toLocaleString()} ل.س
              </h3>
            </div>

            <div
              className="
                w-12 h-12 rounded-2xl
                bg-green-50 text-green-500
                flex items-center justify-center
              "
            >
              <ShoppingCart size={20} />
            </div>
          </div>
        </div>
      </div>

      <div
        className="
    bg-white border border-[var(--color-border)]
    rounded-3xl p-5 mb-6 shadow-sm
  "
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            placeholder="ابحث باسم المنتج..."
            className="
        h-12 px-4 rounded-2xl
        border-2 border-[var(--color-border)]
        outline-none
        focus:border-[var(--color-primary)]
        transition-all
      "
          />

          <Select
            options={[
              { value: "", label: "كل الأنواع" },
              ...uniqueTypes.map((type) => ({
                value: type,
                label: type,
              })),
            ]}
            value={{
              value: filterType,
              label: filterType || "كل الأنواع",
            }}
            onChange={(selected) => setFilterType(selected?.value || "")}
            isSearchable
            styles={{
              control: (base) => ({
                ...base,
                minHeight: "48px",
                borderRadius: "18px",
                borderWidth: "2px",
                borderColor: "var(--color-border)",
                boxShadow: "none",
              }),
            }}
          />

          <Select
            options={[
              { value: "", label: "كل التصنيفات" },
              ...uniqueCategories.map((cat) => ({
                value: cat,
                label: cat,
              })),
            ]}
            value={{
              value: filterCategory,
              label: filterCategory || "كل التصنيفات",
            }}
            onChange={(selected) => setFilterCategory(selected?.value || "")}
            isSearchable
            styles={{
              control: (base) => ({
                ...base,
                minHeight: "48px",
                borderRadius: "18px",
                borderWidth: "2px",
                borderColor: "var(--color-border)",
                boxShadow: "none",
              }),
            }}
          />
        </div>
      </div>

      {/* TABLE */}
      <div
        className="
          bg-white border border-[var(--color-border)]
          rounded-3xl overflow-hidden shadow-sm
        "
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--color-hover)]">
              <tr className="text-right">
                <th className="p-4 text-sm font-semibold text-[var(--color-text-light)]">
                  المنتج
                </th>

                <th className="p-4 text-sm font-semibold text-[var(--color-text-light)]">
                  النوع
                </th>

                <th className="p-4 text-sm font-semibold text-[var(--color-text-light)]">
                  التصنيف
                </th>

                <th className="p-4 text-sm font-semibold text-[var(--color-text-light)]">
                  المتوفر
                </th>

                <th className="p-4 text-sm font-semibold text-[var(--color-text-light)]">
                  السعر الأصلي
                </th>

                <th className="p-4 text-sm font-semibold text-[var(--color-text-light)]">
                  سعر مخصص
                </th>

                <th className="p-4 text-sm font-semibold text-[var(--color-text-light)]">
                  الكمية
                </th>

                <th className="p-4 text-sm font-semibold text-[var(--color-text-light)]">
                  الإجمالي
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i} className="border-t border-[var(--color-border)]">
                    {[...Array(8)].map((__, index) => (
                      <td key={index} className="p-4">
                        <div className="h-10 rounded-2xl bg-gray-100 animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-16 text-center">
                    <Package size={40} className="text-gray-200 mx-auto mb-3" />

                    <p className="text-[var(--color-text-light)] text-sm">
                      لا توجد منتجات
                    </p>
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((product, index) => {
                  const qty = quantities[product.id] || 0;

                  const invalid = qty > product.quantity;

                  const effectivePrice = getEffectivePrice(product);

                  return (
                    <tr
                      key={product.id}
                      className="
                        border-t border-[var(--color-border)]
                        hover:bg-[var(--color-hover)]
                        transition-all duration-150
                      "
                      style={{
                        animation: `fadeUp 0.3s ${index * 0.03}s both`,
                      }}
                    >
                      {/* PRODUCT */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="
                              w-11 h-11 rounded-2xl
                              bg-[var(--color-hover)]
                              border border-[var(--color-border)]
                              flex items-center justify-center
                            "
                          >
                            <Package
                              size={18}
                              className="text-[var(--color-primary)]"
                            />
                          </div>

                          <div>
                            <h4 className="font-medium text-[var(--color-text)]">
                              {product.productName}
                            </h4>
                          </div>
                        </div>
                      </td>

                      {/* TYPE */}
                      <td className="p-4">
                        <span className="text-sm text-[var(--color-text)]">
                          {product.typeName}
                        </span>
                      </td>

                      {/* CATEGORY */}
                      <td className="p-4">
                        <span className="text-sm text-[var(--color-text)]">
                          {product.categorieName || "-"}
                        </span>
                      </td>

                      {/* STOCK */}
                      <td className="p-4">
                        <span
                          className={`
                            inline-flex items-center justify-center
                            px-3 h-8 rounded-xl text-xs font-semibold
                            ${
                              product.quantity > 0
                                ? "bg-green-50 text-green-600"
                                : "bg-red-50 text-red-500"
                            }
                          `}
                        >
                          {product.quantity}
                        </span>
                      </td>

                      {/* ORIGINAL PRICE */}
                      <td className="p-4">
                        <span className="font-semibold text-[var(--color-primary)]">
                          {product.sale_Price.toLocaleString()}                     <span style={{ color: "var(--color-primary)" }}>ل.س</span>

                        </span>
                      </td>

                      {/* CUSTOM PRICE */}
                      <td className="p-4">
                        <input
                          type="number"
                          min="0"
                          placeholder={String(product.sale_Price)}
                          value={customPrices[product.id] ?? ""}
                          onChange={(e) =>
                            handlePriceChange(product.id, e.target.value)
                          }
                          className="
                            w-24 h-11 px-3 rounded-2xl
                            border-2 border-[var(--color-border)]
                            outline-none text-sm
                            focus:border-[var(--color-primary)]
                            transition-all
                          "
                        />
                      </td>

                      {/* QTY */}
                      <td className="p-4">
                        <div>
                          <input
                            type="number"
                            min="0"
                            value={qty}
                            onChange={(e) =>
                              handleQtyChange(product.id, e.target.value)
                            }
                            className={`
                              w-24 h-11 px-3 rounded-2xl
                              border-2 outline-none text-sm
                              transition-all
                              ${
                                invalid
                                  ? "border-red-400 text-red-500"
                                  : "border-[var(--color-border)] focus:border-[var(--color-primary)]"
                              }
                            `}
                          />

                          {invalid && (
                            <p className="text-red-500 text-xs mt-1">
                              الكمية غير متوفرة
                            </p>
                          )}
                        </div>
                      </td>

                      {/* TOTAL */}
                      <td className="p-4">
                        <span className="font-bold text-[var(--color-text)]">
                          {(effectivePrice * qty).toLocaleString()} <span style={{ color: "var(--color-primary)" }}>ل.س</span>
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 mt-6">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className="
      px-4 h-11 rounded-2xl
      border border-[var(--color-border)]
      bg-white
      disabled:opacity-40
      transition-all
    "
        >
          السابق
        </button>

        {[...Array(totalPages)].map((_, index) => {
          const page = index + 1;

          return (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`
          w-11 h-11 rounded-2xl
          transition-all font-medium
          ${
            currentPage === page
              ? "bg-[var(--color-primary)] text-white shadow-lg"
              : "bg-white border border-[var(--color-border)]"
          }
        `}
            >
              {page}
            </button>
          );
        })}

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="
      px-4 h-11 rounded-2xl
      border border-[var(--color-border)]
      bg-white
      disabled:opacity-40
      transition-all
    "
        >
          التالي
        </button>
      </div>

      {/* ACTIONS */}
      <div className="flex justify-end mt-8">
        <button
          onClick={handleCreateInvoice}
          disabled={saving || hasInvalidQty}
          className="
            h-14 px-8 rounded-2xl
            bg-[var(--color-primary)]
            hover:bg-[var(--color-primary-hover)]
            disabled:opacity-50 disabled:cursor-not-allowed
            text-white font-medium
            flex items-center gap-3
            transition-all active:scale-95
            shadow-lg shadow-[var(--color-primary)]/30
          "
        >
          <Receipt size={18} />

          {saving ? "جاري إنشاء الفاتورة..." : "إنشاء الفاتورة"}
        </button>
      </div>

      <style>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(8px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </DashboardLayout>
  );
}
