"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, Plus, Edit, Trash2, RefreshCw, X } from "lucide-react"

export default function ManageStock() {
  const router = useRouter()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false)
  const [addingProducts, setAddingProducts] = useState(false)

  // Form state for adding products
  const [productItems, setProductItems] = useState([{ product_id: "", size: "", quantity: 1 }])

  // Available sizes
  const availableSizes = ["XS", "S", "M", "L", "XL", "XXL"]

  // Update state untuk modal create product
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [creatingProduct, setCreatingProduct] = useState(false)

  // Form state untuk create product
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category_id: "",
    sizes: [
      { size: "S", stock: 0 },
      { size: "M", stock: 0 },
      { size: "L", stock: 0 },
      { size: "XL", stock: 0 },
    ],
    images: [""],
  })

  // Available categories (you might want to fetch this from API)
  const availableCategories = [
    { id: 1, name: "Men" },
    { id: 2, name: "Women" }
  ]

  // Update product form functions
  const updateProductForm = (field, value) => {
    setProductForm((prev) => ({ ...prev, [field]: value }))
  }

  const updateSizeStock = (sizeIndex, stock) => {
    setProductForm((prev) => ({
      ...prev,
      sizes: prev.sizes.map((item, index) =>
        index === sizeIndex ? { ...item, stock: Number.parseInt(stock) || 0 } : item,
      ),
    }))
  }

  const addImageUrl = () => {
    setProductForm((prev) => ({
      ...prev,
      images: [...prev.images, ""],
    }))
  }

  const removeImageUrl = (index) => {
    if (productForm.images.length > 1) {
      setProductForm((prev) => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index),
      }))
    }
  }

  const updateImageUrl = (index, url) => {
    setProductForm((prev) => ({
      ...prev,
      images: prev.images.map((img, i) => (i === index ? url : img)),
    }))
  }

  const resetProductForm = () => {
    setProductForm({
      name: "",
      description: "",
      price: "",
      stock: "",
      category_id: "",
      sizes: [
        { size: "S", stock: 0 },
        { size: "M", stock: 0 },
        { size: "L", stock: 0 },
        { size: "XL", stock: 0 },
      ],
      images: [""],
    })
  }

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }
    fetchProducts()
  }, [router])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")

      if (!token) {
        router.push("/login")
        return
      }

      const response = await fetch("http://localhost:8000/api/products", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (response.status === 401) {
        localStorage.removeItem("token")
        router.push("/login")
        return
      }

      const data = await response.json()

      if (data.success) {
        setProducts(data.products)
      } else {
        console.error("Failed to fetch products:", data.message)
      }
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (stock) => {
    if (stock === 0) return "bg-red-500"
    if (stock <= 5) return "bg-yellow-500"
    return "bg-green-500"
  }

  const getStatusText = (stock) => {
    if (stock === 0) return "Out of Stock"
    if (stock <= 5) return "Low Stock"
    return "In Stock"
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.product_id.toString().includes(searchTerm),
  )

  // Add product item functions
  const addProductItem = () => {
    setProductItems([...productItems, { product_id: "", size: "", quantity: 1 }])
  }

  const removeProductItem = (index) => {
    if (productItems.length > 1) {
      setProductItems(productItems.filter((_, i) => i !== index))
    }
  }

  const updateProductItem = (index, field, value) => {
    const updatedItems = productItems.map((item, i) => {
      if (i === index) {
        return { ...item, [field]: value }
      }
      return item
    })
    setProductItems(updatedItems)
  }

  const deleteProduct = async (productId) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        const token = localStorage.getItem("token")

        if (!token) {
          router.push("/login")
          return
        }

        const response = await fetch(`http://localhost:8000/api/products/${productId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (response.status === 401) {
          localStorage.removeItem("token")
          router.push("/login")
          return
        }

        if (response.ok) {
          fetchProducts()
        }
      } catch (error) {
        console.error("Error deleting product:", error)
      }
    }
  }

  const handleCreateProduct = async () => {
    try {
      // Validate form
      if (!productForm.name || !productForm.price || !productForm.category_id) {
        alert("Please fill in all required fields (Name, Price, Category)")
        return
      }

      // Validate images
      const validImages = productForm.images.filter((img) => img.trim() !== "")
      if (validImages.length === 0) {
        alert("Please add at least one product image")
        return
      }

      setCreatingProduct(true)
      const token = localStorage.getItem("token")

      if (!token) {
        router.push("/login")
        return
      }

      // Calculate total stock from sizes
      const totalStock = productForm.sizes.reduce((sum, size) => sum + size.stock, 0)

      const requestBody = {
        name: productForm.name,
        description: productForm.description,
        price: Number.parseInt(productForm.price),
        stock: totalStock, // Total stock from all sizes
        category_id: Number.parseInt(productForm.category_id),
        sizes: productForm.sizes.filter((size) => size.stock > 0), // Only include sizes with stock
        images: validImages,
      }

      const response = await fetch("http://localhost:8000/api/products", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      if (response.status === 401) {
        localStorage.removeItem("token")
        router.push("/login")
        return
      }

      const data = await response.json()

      if (response.ok && data.success) {
        alert("Product created successfully!")
        setShowCreateModal(false)
        resetProductForm()
        fetchProducts() // Refresh the products list
      } else {
        alert(`Failed to create product: ${data.message || "Unknown error"}`)
      }
    } catch (error) {
      console.error("Error creating product:", error)
      alert("Error creating product. Please try again.")
    } finally {
      setCreatingProduct(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-white text-2xl font-semibold">Manage Stock</h2>
        <div className="flex gap-2">
          <button
            onClick={fetchProducts}
            className="flex items-center px-4 py-2 border border-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Product
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-gray-800 border border-gray-700 max-h-[400px] rounded-lg overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <RefreshCw className="h-8 w-8 animate-spin text-white" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="min-w-full inline-block align-middle">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider min-w-[100px]">
                      Product ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider min-w-[200px]">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider min-w-[120px]">
                      Category
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider min-w-[80px]">
                      Stock
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider min-w-[120px]">
                      Price
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider min-w-[100px]">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider min-w-[120px]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {filteredProducts.map((product) => (
                    <tr key={product.product_id} className="hover:bg-gray-700 transition-colors">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-white">
                        #{product.product_id}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-300">
                        <div className="max-w-[200px]">
                          <div className="font-medium text-white truncate">{product.name}</div>
                          {product.description && (
                            <div className="text-xs text-gray-400 truncate">{product.description}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                        {product.category || "Uncategorized"}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300 font-medium">
                        {product.stock || 0}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300 font-medium">
                        {formatCurrency(product.price)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full text-white ${getStatusColor(product.stock || 0)}`}
                        >
                          {getStatusText(product.stock || 0)}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => deleteProduct(product.product_id)}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-gray-600 rounded transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredProducts.length === 0 && !loading && (
              <div className="text-center py-12 text-gray-400">
                <div className="text-lg font-medium">No products found</div>
                <div className="text-sm mt-1">Try adjusting your search criteria</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Products Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg border border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white">Add Products</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div className="text-sm text-gray-400 mb-4">
                Add multiple product items with their sizes and quantities
              </div>

              {/* Product Items */}
              <div className="space-y-4">
                {productItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-gray-700 rounded-lg">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-300 mb-1">Product ID</label>
                      <select
                        value={item.product_id}
                        onChange={(e) => updateProductItem(index, "product_id", e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Product</option>
                        {products.map((product) => (
                          <option key={product.product_id} value={product.product_id}>
                            #{product.product_id} - {product.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="w-24">
                      <label className="block text-sm font-medium text-gray-300 mb-1">Size</label>
                      <select
                        value={item.size}
                        onChange={(e) => updateProductItem(index, "size", e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Size</option>
                        {availableSizes.map((size) => (
                          <option key={size} value={size}>
                            {size}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="w-24">
                      <label className="block text-sm font-medium text-gray-300 mb-1">Quantity</label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateProductItem(index, "quantity", e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <button
                      onClick={() => removeProductItem(index)}
                      disabled={productItems.length === 1}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-gray-600 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Item Button */}
              <button
                onClick={addProductItem}
                className="flex items-center px-4 py-2 text-blue-400 hover:text-blue-300 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Another Item
              </button>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-700">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProducts}
                disabled={addingProducts}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {addingProducts && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
                {addingProducts ? "Adding..." : "Add Products"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Product Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg border border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white">Create New Product</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Product Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={productForm.name}
                      onChange={(e) => updateProductForm("name", e.target.value)}
                      placeholder="e.g., Kaos Oversize Off-White Minimalis"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Price (IDR) <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="number"
                      value={productForm.price}
                      onChange={(e) => updateProductForm("price", e.target.value)}
                      placeholder="145000"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Category <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={productForm.category_id}
                      onChange={(e) => updateProductForm("category_id", e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Category</option>
                      {availableCategories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <textarea
                    value={productForm.description}
                    onChange={(e) => updateProductForm("description", e.target.value)}
                    placeholder="Product description..."
                    rows={6}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
              </div>

              {/* Size Stock Management */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">Size & Stock Management</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {productForm.sizes.map((sizeItem, index) => (
                    <div key={sizeItem.size} className="bg-gray-700 p-4 rounded-lg">
                      <div className="text-center mb-2">
                        <span className="text-white font-medium">{sizeItem.size}</span>
                      </div>
                      <input
                        type="number"
                        min="0"
                        value={sizeItem.stock}
                        onChange={(e) => updateSizeStock(index, e.target.value)}
                        placeholder="0"
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                      />
                      <div className="text-xs text-gray-400 text-center mt-1">Stock</div>
                    </div>
                  ))}
                </div>
                <div className="mt-2 text-sm text-gray-400">
                  Total Stock: {productForm.sizes.reduce((sum, size) => sum + size.stock, 0)} items
                </div>
              </div>

              {/* Product Images */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Product Images <span className="text-red-400">*</span>
                </label>
                <div className="space-y-3">
                  {productForm.images.map((image, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="flex-1">
                        <input
                          type="url"
                          value={image}
                          onChange={(e) => updateImageUrl(index, e.target.value)}
                          placeholder="https://imgur.com/example"
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <button
                        onClick={() => removeImageUrl(index)}
                        disabled={productForm.images.length === 1}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-gray-700 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={addImageUrl}
                  className="mt-3 flex items-center px-3 py-2 text-blue-400 hover:text-blue-300 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Image URL
                </button>
              </div>

              {/* Preview Section */}
              <div className="border-t border-gray-700 pt-6">
                <h4 className="text-white font-medium mb-3">Preview</h4>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <div className="text-white font-medium">{productForm.name || "Product Name"}</div>
                  <div className="text-gray-300 text-sm mt-1">
                    {productForm.description || "Product description will appear here..."}
                  </div>
                  <div className="text-blue-400 font-medium mt-2">
                    {productForm.price ? formatCurrency(Number.parseInt(productForm.price)) : "Price"}
                  </div>
                  <div className="text-gray-400 text-sm mt-1">
                    Total Stock: {productForm.sizes.reduce((sum, size) => sum + size.stock, 0)} items
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-700">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={resetProductForm}
                className="px-4 py-2 text-yellow-400 hover:text-yellow-300 hover:bg-gray-700 rounded-lg transition-colors"
              >
                Reset Form
              </button>
              <button
                onClick={handleCreateProduct}
                disabled={creatingProduct}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {creatingProduct && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
                {creatingProduct ? "Creating..." : "Create Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
