import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from './components/productCard';
import styles from './App.module.css';

const App = () => {
  const [products, setProducts] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showCart, setShowCart] = useState(false);

  const productsPerPage = 10;

  // 1️Fetch products only once 
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://dummyjson.com/products');
        setProducts(response.data.products);
      } catch (err) {
        setError('Failed to fetch products. Try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  //  Reset page to 1 whenever I change the sort by category
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, minPrice, maxPrice, selectedCategory]);




  const toggleSelect = (id) => {
    setSelectedIds((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((pid) => pid !== id)
        : [...prevSelected, id]
    );
  };

  const addToCart = (product) => {
    if (!cart.find((item) => item.id === product.id)) {
      setCart([...cart, product]);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesCategory = true;
    if (selectedCategory === 'Beauty') {
      matchesCategory = ['beauty'].includes(product.category.toLowerCase());
    } else if (selectedCategory !== 'All') {
      matchesCategory = product.category.toLowerCase() === selectedCategory.toLowerCase();
    }

    let matchesPrice = true;
    if (minPrice !== '' && product.price < parseFloat(minPrice)) {
      matchesPrice = false;
    }
    if (maxPrice !== '' && product.price > parseFloat(maxPrice)) {
      matchesPrice = false;
    }

    return matchesSearch && matchesCategory && matchesPrice;
  });

  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const totalCartPrice = cart.reduce((acc, item) => acc + item.price, 0);

  if (loading) return <div className={styles.center}>Loading...</div>;
  if (error) return <div className={styles.center}>{error}</div>;

  return (
    <div>
      <header className={styles.header}>
        <h1> Clarusway Shopping</h1>

        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Minimum Price Input */}
          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => {
              const newMin = Math.max(0, Number(e.target.value)); // No negative numbers
              setMinPrice(newMin);
              if (maxPrice <= newMin) {
                setMaxPrice(newMin + 10); // Always push maxPrice above minPrice
              }
            }}
            step="10"
            style={{ marginRight: '10px', padding: '5px', borderRadius: '8px', border: '1px solid gray' }}
          />

          {/* Maximum Price Input , it is never equal or less than the min*/}
          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => {
              const newMax = Math.max(0, Number(e.target.value)); // I have deleted  negative numbers
              if (newMax > minPrice) {
                setMaxPrice(newMax);
              }
            }}
            step="10"
            style={{ padding: '5px', borderRadius: '8px', border: '1px solid gray' }}
          />


          {/* Cart icon */}
          <div className={styles.cartWrapper}>
            <button
              className={styles.cartIcon}
              onClick={() => setShowCart((prev) => !prev)}
            >
              🛒
              <span className={styles.cartCount}>{cart.length}</span>
            </button>

            {showCart && (
              <div className={styles.cartDropdown}>
                <p>🛍️ Items: {cart.length}</p>
                <p>💰 Total: ${totalCartPrice.toFixed(2)}</p>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Sorting buttons */}
      <div className={styles.sortingButtons}>
        {['All', 'Beauty', 'fragrances', 'furniture', 'groceries'].map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              setCurrentPage(1); // Reset page to 1 when category changes
            }}

            className={selectedCategory === cat ? styles.activeButton : ''}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Products container */}
      <div className={styles.container}>
        {currentProducts.length > 0 ? (
          currentProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isSelected={selectedIds.includes(product.id)}
              toggleSelect={toggleSelect}
              addToCart={addToCart}
            />
          ))
        ) : (
          <div className={styles.center}>No products found.</div>
        )}
      </div>

      {/* Pagination */}
      <div className={styles.pagination}>
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          style={{ opacity: currentPage === 1 ? 0.5 : 1 }}
        >
          ⬅️ Previous
        </button>

        <span>Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          style={{ opacity: currentPage === totalPages ? 0.5 : 1 }}
        >
          Next ➡️
        </button>

      </div>
    </div>
  );
};

export default App;
