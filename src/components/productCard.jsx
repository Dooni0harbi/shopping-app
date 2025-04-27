import React from 'react';
import styles from './ProductCard.module.css';

const ProductCard = ({ product, isSelected, toggleSelect, addToCart }) => {
  const stars = '⭐'.repeat(Math.round(product.rating));



  return (
    <div
      className={`${styles.card} ${isSelected ? styles.selected : ''}`}
      onClick={() => toggleSelect(product.id)}
    >
      <img src={product.thumbnail} alt={product.title} className={styles.image} />

      <h3 className={styles.titleAnimated}>{product.title}</h3>


      <p>
        ${product.price}
        {product.discountPercentage > 0 && (
          <span className={styles.discount}> (-{product.discountPercentage}%)</span>
        )}
      </p>
      <p className={styles.productPrice}>${product.price.toFixed(2)}</p>
      <br />

      {/* rating stars and Button Container */}
      <div className={styles.actions}>
        <div className={styles.stars}>
          <p>{stars}</p>
        </div>
        <br />

        <button
          onClick={(e) => {
            e.stopPropagation();
            addToCart(product);  // Pass the product here 
          }}
          className={styles.cartButton}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
