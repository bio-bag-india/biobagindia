import { useState } from 'react';
import { 
  Product, 
  ProductSize, 
  getProducts, 
  addProduct, 
  updateProduct, 
  deleteProduct, 
  toggleProductStatus 
} from '@/lib/productStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  X,
  Package,
  Image as ImageIcon
} from 'lucide-react';

const categories = [
  { value: 'carry', label: 'Carry Bags' },
  { value: 'garbage', label: 'Garbage Bags' },
  { value: 'grocery', label: 'Grocery Bags' },
  { value: 'courier', label: 'Courier Bags' },
  { value: 'nursery', label: 'Nursery Bags' },
  { value: 'medical', label: 'Medical Bags' },
  { value: 'agriculture', label: 'Agriculture Bags' },
  { value: 'custom', label: 'Custom Bags' },
];

interface ProductFormData {
  name: string;
  description: string;
  category: Product['category'];
  image: string;
  pricePerKg: number;
  sizes: ProductSize[];
  features: string[];
  isActive: boolean;
}

const emptyForm: ProductFormData = {
  name: '',
  description: '',
  category: 'carry',
  image: '/placeholder.svg',
  pricePerKg: 0,
  sizes: [],
  features: [],
  isActive: true,
};

const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>(getProducts());
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>(emptyForm);
  const [newFeature, setNewFeature] = useState('');
  const [newSize, setNewSize] = useState<ProductSize>({ size: '', micron: 0, capacity: '', pcsPerKg: 0 });

  const refreshProducts = () => setProducts(getProducts());

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleAddNew = () => {
    setEditingProduct(null);
    setFormData(emptyForm);
    setShowModal(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      image: product.image,
      pricePerKg: product.pricePerKg,
      sizes: [...product.sizes],
      features: [...product.features],
      isActive: product.isActive,
    });
    setShowModal(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      const deleted = deleteProduct(id);
      if (deleted) {
        refreshProducts();
        toast({
          title: 'Product Deleted',
          description: `${name} has been deleted successfully.`,
        });
      }
    }
  };

  const handleToggleStatus = (id: string) => {
    const updated = toggleProductStatus(id);
    if (updated) {
      refreshProducts();
      toast({
        title: updated.isActive ? 'Product Activated' : 'Product Deactivated',
        description: `${updated.name} is now ${updated.isActive ? 'visible' : 'hidden'} on the products page.`,
      });
    }
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFormData({ ...formData, features: [...formData.features, newFeature.trim()] });
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFormData({ ...formData, features: formData.features.filter((_, i) => i !== index) });
  };

  const handleAddSize = () => {
    if (newSize.size && newSize.micron > 0) {
      setFormData({ ...formData, sizes: [...formData.sizes, { ...newSize }] });
      setNewSize({ size: '', micron: 0, capacity: '', pcsPerKg: 0 });
    }
  };

  const handleRemoveSize = (index: number) => {
    setFormData({ ...formData, sizes: formData.sizes.filter((_, i) => i !== index) });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({ title: 'Error', description: 'Product name is required.', variant: 'destructive' });
      return;
    }

    if (editingProduct) {
      const updated = updateProduct(editingProduct.id, formData);
      if (updated) {
        refreshProducts();
        setShowModal(false);
        toast({
          title: 'Product Updated',
          description: `${formData.name} has been updated successfully.`,
        });
      }
    } else {
      const newProduct = addProduct(formData);
      if (newProduct) {
        refreshProducts();
        setShowModal(false);
        toast({
          title: 'Product Added',
          description: `${formData.name} has been added successfully.`,
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="font-display text-xl font-bold text-foreground">Products Management</h2>
        <Button onClick={handleAddNew} className="gap-2">
          <Plus className="w-4 h-4" />
          Add New Product
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(cat => (
              <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((product) => (
          <div 
            key={product.id} 
            className={`bg-card border rounded-xl p-4 transition-all ${!product.isActive ? 'opacity-60' : ''}`}
          >
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                {product.image && product.image !== '/placeholder.svg' ? (
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate">{product.name}</h3>
                <p className="text-sm text-muted-foreground capitalize">{product.category}</p>
                <p className="text-sm font-medium text-primary mt-1">
                  {product.pricePerKg > 0 ? `₹${product.pricePerKg}/kg` : 'Custom Pricing'}
                </p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mt-3 line-clamp-2">{product.description}</p>

            <div className="flex flex-wrap gap-1 mt-3">
              {product.features.slice(0, 2).map((feature, i) => (
                <span key={i} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                  {feature}
                </span>
              ))}
              {product.features.length > 2 && (
                <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
                  +{product.features.length - 2} more
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 mt-4 pt-4 border-t">
              <Button variant="outline" size="sm" onClick={() => handleEdit(product)} className="flex-1 gap-1">
                <Edit className="w-3 h-3" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleToggleStatus(product.id)}
                className={product.isActive ? 'text-primary' : 'text-muted-foreground'}
              >
                {product.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(product.id, product.name)}
                className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12 bg-card rounded-xl border">
          <Package className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
          <p className="text-muted-foreground">No products found</p>
        </div>
      )}

      {/* Add/Edit Product Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-foreground/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-lg">
            <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-card z-10">
              <h3 className="font-display text-xl font-bold text-foreground">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">Basic Information</h4>
                
                <div>
                  <label className="text-sm font-medium text-foreground">Product Name *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter product name"
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground">Description</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter product description"
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">Category</label>
                    <Select 
                      value={formData.category} 
                      onValueChange={(value) => setFormData({ ...formData, category: value as Product['category'] })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-foreground">Price per Kg (₹)</label>
                    <Input
                      type="number"
                      value={formData.pricePerKg}
                      onChange={(e) => setFormData({ ...formData, pricePerKg: Number(e.target.value) })}
                      placeholder="0"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground">Image URL</label>
                  <Input
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="Enter image URL or leave for placeholder"
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Enter a valid image URL. Leave as default for placeholder.
                  </p>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">Features</h4>
                
                <div className="flex gap-2">
                  <Input
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="Add a feature"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                  />
                  <Button type="button" variant="outline" onClick={handleAddFeature}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {formData.features.map((feature, index) => (
                    <span key={index} className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                      {feature}
                      <button type="button" onClick={() => handleRemoveFeature(index)}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">Available Sizes</h4>
                
                <div className="grid grid-cols-4 gap-2">
                  <Input
                    value={newSize.size}
                    onChange={(e) => setNewSize({ ...newSize, size: e.target.value })}
                    placeholder="Size (e.g., 10 X 12)"
                  />
                  <Input
                    type="number"
                    value={newSize.micron || ''}
                    onChange={(e) => setNewSize({ ...newSize, micron: Number(e.target.value) })}
                    placeholder="Micron"
                  />
                  <Input
                    value={newSize.capacity}
                    onChange={(e) => setNewSize({ ...newSize, capacity: e.target.value })}
                    placeholder="Capacity"
                  />
                  <Button type="button" variant="outline" onClick={handleAddSize}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {formData.sizes.length > 0 && (
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-muted">
                        <tr>
                          <th className="text-left py-2 px-3">Size</th>
                          <th className="text-left py-2 px-3">Micron</th>
                          <th className="text-left py-2 px-3">Capacity</th>
                          <th className="text-left py-2 px-3">Pcs/Kg</th>
                          <th className="py-2 px-3"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.sizes.map((size, index) => (
                          <tr key={index} className="border-t">
                            <td className="py-2 px-3">{size.size}</td>
                            <td className="py-2 px-3">{size.micron}</td>
                            <td className="py-2 px-3">{size.capacity}</td>
                            <td className="py-2 px-3">{size.pcsPerKg}</td>
                            <td className="py-2 px-3">
                              <button type="button" onClick={() => handleRemoveSize(index)} className="text-destructive">
                                <X className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Active Status */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="isActive" className="text-sm text-foreground">
                  Product is active and visible on the products page
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
