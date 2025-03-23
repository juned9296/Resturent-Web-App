"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { X, Plus } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

// Define product categories and types
const productCategories = ["Breakfast", "Burgers", "Main Course", "Appetizers", "Desserts", "Drinks"]
const productTypes = ["Veg", "Non Veg"]

// Default empty product data
const defaultProductData = {
  id: "",
  title: "",
  price: "",
  discount: "",
  type: "",
  category: "",
  featured: false,
  description: "",
  image: "",
  nutritionalInfo: {
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
  }
}

export function ProductModal({ open, onClose, onSave, editProduct = null }) {
  const { toast } = useToast()
  const [ingredients, setIngredients] = useState([""])
  const [productData, setProductData] = useState(defaultProductData)
  const isEditMode = !!editProduct

  // Initialize form when modal opens or editProduct changes
  useEffect(() => {
    if (open) {
      if (isEditMode) {
        // Format data for editing
        setProductData({
          ...editProduct,
          price: editProduct.price.toString(),
          discount: editProduct.discount ? editProduct.discount.toString() : "",
          nutritionalInfo: {
            calories: editProduct.nutritionalInfo?.calories?.toString() || "",
            protein: editProduct.nutritionalInfo?.protein?.toString() || "",
            carbs: editProduct.nutritionalInfo?.carbs?.toString() || "",
            fat: editProduct.nutritionalInfo?.fat?.toString() || "",
          }
        })
        // Set ingredients
        if (editProduct.ingredients && editProduct.ingredients.length > 0) {
          setIngredients(editProduct.ingredients)
        } else {
          setIngredients([""])
        }
      } else {
        // Reset for new product
        setProductData(defaultProductData)
        setIngredients([""])
      }
    }
  }, [open, editProduct, isEditMode])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    
    if (name.includes(".")) {
      const [parent, child] = name.split(".")
      setProductData({
        ...productData,
        [parent]: {
          ...productData[parent],
          [child]: value
        }
      })
    } else {
      setProductData({
        ...productData,
        [name]: value
      })
    }
  }

  const handleSelectChange = (name, value) => {
    setProductData({
      ...productData,
      [name]: value
    })
  }

  const handleFeaturedChange = (checked) => {
    setProductData({
      ...productData,
      featured: checked
    })
  }

  const handleIngredientChange = (index, value) => {
    const updatedIngredients = [...ingredients]
    updatedIngredients[index] = value
    setIngredients(updatedIngredients)
  }

  const addIngredient = () => {
    setIngredients([...ingredients, ""])
  }

  const removeIngredient = (index) => {
    const updatedIngredients = ingredients.filter((_, i) => i !== index)
    setIngredients(updatedIngredients)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validate required fields
    if (!productData.title || !productData.price || !productData.type || !productData.category) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields.",
        variant: "destructive"
      })
      return
    }

    // Create final product object with parsed values
    const finalProduct = {
      ...productData,
      id: productData.id || `prod-${Date.now()}`,
      price: parseFloat(productData.price),
      discount: productData.discount ? parseInt(productData.discount) : undefined,
      ingredients: ingredients.filter(ing => ing.trim() !== ""),
      nutritionalInfo: {
        calories: parseInt(productData.nutritionalInfo.calories) || 0,
        protein: parseInt(productData.nutritionalInfo.protein) || 0,
        carbs: parseInt(productData.nutritionalInfo.carbs) || 0,
        fat: parseInt(productData.nutritionalInfo.fat) || 0,
      }
    }

    // Call the parent function to save the product
    onSave(finalProduct)
    
    // Show success toast
    toast({
      title: isEditMode ? "Product updated" : "Product added",
      description: isEditMode 
        ? "The product has been successfully updated."
        : "The product has been successfully added to the menu.",
    })
    
    // Reset form and close modal
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-satisfy text-brand-primary">
            {isEditMode ? "Edit Product" : "Add New Product"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode 
              ? "Update the product details below."
              : "Fill in the details below to add a new product to your menu."}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-sm font-medium">
                  Product Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={productData.title}
                  onChange={handleInputChange}
                  placeholder="Fresh Vegetable Salad with Avocado"
                  className="mt-1"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price" className="text-sm font-medium">
                    Price ($) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    value={productData.price}
                    onChange={handleInputChange}
                    placeholder="19.99"
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="discount" className="text-sm font-medium">
                    Discount (%)
                  </Label>
                  <Input
                    id="discount"
                    name="discount"
                    type="number"
                    value={productData.discount}
                    onChange={handleInputChange}
                    placeholder="10"
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type" className="text-sm font-medium">
                    Type <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={productData.type}
                    onValueChange={(value) => handleSelectChange("type", value)}
                    required
                  >
                    <SelectTrigger id="type" className="mt-1">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {productTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="category" className="text-sm font-medium">
                    Category <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={productData.category}
                    onValueChange={(value) => handleSelectChange("category", value)}
                    required
                  >
                    <SelectTrigger id="category" className="mt-1">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {productCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="image" className="text-sm font-medium">
                  Image URL
                </Label>
                <Input
                  id="image"
                  name="image"
                  value={productData.image}
                  onChange={handleInputChange}
                  placeholder="https://images.unsplash.com/photo-example"
                  className="mt-1"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={productData.featured}
                  onCheckedChange={handleFeaturedChange}
                />
                <Label htmlFor="featured" className="text-sm font-medium cursor-pointer">
                  Featured Product
                </Label>
              </div>
            </div>
            
            {/* Description and Nutritional Info */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="description" className="text-sm font-medium">
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={productData.description}
                  onChange={handleInputChange}
                  placeholder="A fresh and healthy vegetable salad made with organic ingredients..."
                  className="mt-1 h-24"
                />
              </div>
              
              <div>
                <Label className="text-sm font-medium">Nutritional Information</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <Label htmlFor="calories" className="text-xs text-gray-500">
                      Calories
                    </Label>
                    <Input
                      id="calories"
                      name="nutritionalInfo.calories"
                      type="number"
                      value={productData.nutritionalInfo.calories}
                      onChange={handleInputChange}
                      placeholder="120"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="protein" className="text-xs text-gray-500">
                      Protein (g)
                    </Label>
                    <Input
                      id="protein"
                      name="nutritionalInfo.protein"
                      type="number"
                      value={productData.nutritionalInfo.protein}
                      onChange={handleInputChange}
                      placeholder="3"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="carbs" className="text-xs text-gray-500">
                      Carbs (g)
                    </Label>
                    <Input
                      id="carbs"
                      name="nutritionalInfo.carbs"
                      type="number"
                      value={productData.nutritionalInfo.carbs}
                      onChange={handleInputChange}
                      placeholder="15"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="fat" className="text-xs text-gray-500">
                      Fat (g)
                    </Label>
                    <Input
                      id="fat"
                      name="nutritionalInfo.fat"
                      type="number"
                      value={productData.nutritionalInfo.fat}
                      onChange={handleInputChange}
                      placeholder="7"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ingredients Section */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <Label className="text-sm font-medium">Ingredients</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addIngredient}
                className="h-8 text-brand-primary"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
            
            <div className="space-y-2 max-h-40 overflow-y-auto p-1">
              {ingredients.map((ingredient, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={ingredient}
                    onChange={(e) => handleIngredientChange(index, e.target.value)}
                    placeholder={`Ingredient ${index + 1}`}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeIngredient(index)}
                    className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                    disabled={ingredients.length === 1 && index === 0}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-brand-primary hover:bg-brand-primary/90">
              {isEditMode ? "Update Product" : "Add Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}