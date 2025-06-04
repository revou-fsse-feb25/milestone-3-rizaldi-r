import React, { useState, useEffect, ReactNode } from "react";
import ButtonRegular from "../_commons/ButtonRegular";

export default function ProductForm({ productProp, onSubmit, onCancel }: any) {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [fetchingError, setfetchingError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState<Partial<any>>({
        title: "",
        price: 0,
        description: "",
        categoryId: 0,
        images: ["https://via.placeholder.com/150"],
    });

    useEffect(() => {
        if (productProp) {
            setFormData(productProp);
        }
    }, [productProp]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

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
                images: [value, ...(formData.images?.slice(1) || [])],
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
                    required
                />
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
                        required
                    />
                </div>
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
                    required
                />
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
                        required
                    />
                </div>
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
                    required
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
