import React, { useState, useEffect } from 'react';
import './categorylist.css';

function Categories({ onLeafCategorySelect }) {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedCategories, setExpandedCategories] = useState({});

    useEffect(() => {
        fetch('http://localhost:5000/api/Categories')
            .then((response) => response.json())
            .then((data) => {
                setCategories(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    const parentCategories = categories.filter(category => category.parentId === null);

    const getSubcategories = (parentId) => {
        return categories.filter(category => category.parentId === parentId);
    };

    const handleCategoryClick = (categoryId, isLeafCategory) => {
        if (isLeafCategory) {
            onLeafCategorySelect(categoryId); // Seçilen kategori ID'sini üst bileşene gönder
        } else {
            setExpandedCategories(prev => ({
                ...prev,
                [categoryId]: !prev[categoryId],
            }));
        }
    };

    const renderCategory = (category) => {
        const subcategories = getSubcategories(category.id);
        const isExpanded = expandedCategories[category.id];
        const isLeafCategory = subcategories.length === 0;

        return (
            <div key={category.id} className={`category-container ${isLeafCategory ? 'leaf-category' : ''}`}>
                <button
                    className={`category-button ${isLeafCategory ? 'leaf-button' : ''}`}
                    onClick={() => handleCategoryClick(category.id, isLeafCategory)}
                >
                    {category.name}
                </button>
                {isExpanded && subcategories.length > 0 && (
                    <div className="subcategories-container">
                        {subcategories.map(subcategory => renderCategory(subcategory))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="categories-container">
            <div className="parent-categories">
                {parentCategories.map(category => renderCategory(category))}
            </div>
        </div>
    );
}

export default Categories;
