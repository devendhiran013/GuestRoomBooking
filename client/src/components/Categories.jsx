import React from 'react';
import { categories } from '../data';
import { Link } from 'react-router-dom';
import "../styles/Categories.scss";

const Categories = () => {
    return (
        <div className='categories'>
            {/* Header for the Categories section */}
            <h1>Explore Top Categories</h1>
            {/* Description paragraph */}
            <p>
                Discover your perfect getaway with our diverse selection of vacation rentals.
                Whether you're seeking a cozy retreat or a luxurious escape, we have options
                to suit every traveler's needs. Experience the charm of your destination, relax
                in style, and make lasting memories with loved ones in a home away from home.
            </p>
            {/* Container for the list of categories */}
            <div className="categories_list">
                {/* Map through the categories array and display each category */}
                {categories?.slice(1, 7).map((category, index) => (
                    <Link to={`/properties/category/${category.label}`} key={index}>
                        <div className="category">
                            {/* Category image */}
                            <img src={category.img} alt={category.label} />
                            {/* Overlay for styling */}
                            <div className="overlay"></div>
                            {/* Text overlay with icon and label */}
                            <div className="category_text">
                                <div className="category_text_icon">{category.icon}</div>
                                <p>{category.label}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default Categories;
