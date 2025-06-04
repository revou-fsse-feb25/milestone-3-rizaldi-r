import React, { useState, useEffect, ReactNode } from "react";
import ButtonRegular from "../_commons/ButtonRegular";

export default function ProductForm({ productProp, onSubmit, onCancel }: any) {
    // const [isLoading, setIsLoading] = useState<boolean>(true);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState<Partial<any>>({
        title: "",
        price: 0,
        description: "",
        categoryId: 0,
        images: ["https://placehold.co/600x400?text=Placeholder", "https://placehold.co/600x400?text=Placeholder"],
    });

    useEffect(() => {
        if (productProp) {
            setFormData(productProp);
        }
    }, [productProp]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.title?.trim()) {
            newErrors.title = "Title is required";
        }

        if (formData.price === undefined || formData.price < 0) {
            newErrors.price = "Price must be a positive number";
        }

        if (!formData.description?.trim()) {
            newErrors.description = "Description is required";
        }

        if (formData.images.length < 1) {
            newErrors.images = "image url is required";
        }

        if (!formData.categoryId === undefined || formData.categoryId < 0) {
            newErrors.categoryName = "Category name is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        // Clear error when field is edited
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: "",
            });
        }

        if (name === "price") {
            setFormData({
                ...formData,
                [name]: parseFloat(value) || 0,
            });
        } else if (name === "categoryId") {
            setFormData({
                ...formData,
                categoryId: value || 5,
            });
        } else if (name === "imageUrl") {
            setFormData({
                ...formData,
                // edit the first element
                images: [value, ...formData.images?.slice(1)],
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        console.log(" formData", formData);
        if (!validateForm()) {
            console.log(" errors", errors);
            console.log(" validateForm", validateForm());
            return;
        }

        setIsSubmitting(true);

        try {
            onSubmit(formData);
        } catch (error) {
            console.error("Error submitting form:", error);
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* Title Input */}
            <div>
                <label htmlFor="title">Title</label>
                <input
                    type="text"
                    name="title"
                    id="title"
                    value={formData.title || ""}
                    onChange={handleChange}
                    placeholder="Product title"
                />
                {errors.title && <p className="text-red-500">{errors.title}</p>}
            </div>

            {/* Price Input */}
            <div>
                <label htmlFor="price">Price</label>
                <div>
                    <div>
                        <span>$</span>
                    </div>
                    <input
                        type="number"
                        name="price"
                        id="price"
                        value={formData.price || 0}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        // placeholder="0.00"
                    />
                </div>
                {errors.price && <p className="text-red-500">{errors.price}</p>}
            </div>

            {/* Description Input */}
            <div>
                <label htmlFor="description">Description</label>
                <textarea
                    name="description"
                    id="description"
                    value={formData.description || ""}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Product description"
                />
                {errors.description && <p className="text-red-500">{errors.description}</p>}
            </div>

            {/* Image URL Input and Preview */}
            <div>
                <label htmlFor="imageUrl">Image URL</label>
                <div>
                    <input
                        type="text"
                        name="imageUrl"
                        id="imageUrl"
                        value={formData.images?.[0] || ""}
                        onChange={handleChange}
                        placeholder="https://example.com/image.jpg"
                    />
                </div>
                {errors.images && <p className="text-red-500">{errors.images}</p>}
            </div>

            {/* Category Name Input */}
            <div>
                <label htmlFor="categoryId">Category Id</label>
                <input
                    type="text"
                    name="categoryId"
                    id="categoryId"
                    value={formData.categoryId || 0}
                    onChange={handleChange}
                    placeholder="Category id"
                />
            </div>

            {/* Action Buttons */}
            <div>
                <ButtonRegular onClickProp={onCancel}>Cancel</ButtonRegular>
                <ButtonRegular type="submit">{productProp ? "Update" : "Create"}</ButtonRegular>
            </div>
        </form>
    );
}
