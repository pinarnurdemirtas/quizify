import React, { useState, useEffect } from 'react';
import { fetchCategories } from '../services/api.jsx';
import './Categorylist.css';

function Categories({ onLeafCategorySelect }) {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedCategories, setExpandedCategories] = useState({});

    useEffect(() => {
        const getCategories = async () => {
            try {
                const data = await fetchCategories();
                setCategories(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };
        getCategories();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    const parentCategories = categories.filter(category => category.parentId === null);

    const getSubcategories = (parentId) => {
        return categories.filter(category => category.parentId === parentId);
    };

    const handleCategoryClick = (categoryId, isLeafCategory, isParentCategory) => {
        if (isLeafCategory) {
            onLeafCategorySelect(categoryId);
        } else {
            setExpandedCategories(prev => {
                const updated = isParentCategory
                    ? Object.keys(prev).reduce((acc, key) => {
                        if (categories.find(cat => cat.id === parseInt(key)).parentId !== null) {
                            acc[key] = prev[key];
                        }
                        return acc;
                    }, {})
                    : { ...prev };
                return {
                    ...updated,
                    [categoryId]: !prev[categoryId],
                };
            });
        }
    };

    const renderCategory = (category) => {
        const subcategories = getSubcategories(category.id);
        const isExpanded = expandedCategories[category.id];
        const isLeafCategory = subcategories.length === 0;
        const isParentCategory = category.parentId === null;

        return (
            <div key={category.id} className={`category-container ${isLeafCategory ? 'leaf-category' : ''}`}>
                <button
                    className={`category-button ${isLeafCategory ? 'leaf-button' : ''}`}
                    onClick={() => handleCategoryClick(category.id, isLeafCategory, isParentCategory)}
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
        <div className="element">
            <div className="categories-container">
                <div className="parent-categories">
                    {parentCategories.map(category => renderCategory(category))}
                </div>
            </div>
        </div>
    );
}

export default Categories;
