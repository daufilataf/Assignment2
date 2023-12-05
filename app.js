document.addEventListener('DOMContentLoaded', function () {
    const productsContainer = document.querySelector('.products');
    const searchInput = document.getElementById('search');
    const categorySelect = document.getElementById('category');
    const listPage = document.querySelector('.listPage');
    let productsData = []; // To store the fetched products data
    let currentPage = 1;
    const limitPerPage = 10;

    async function fetchProducts(url) {
        try {
            const response = await fetch(url);
            const data = await response.json();
            productsData = data.products;
            displayProducts(productsData); // Display all products initially
            populateCategoriesDropdown(productsData); // Populate categories in the dropdown
            showPage(productsData, currentPage);
            setupPagination(productsData);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }

    function displayProducts(products) {
        productsContainer.innerHTML = ''; // Clear previous product display
        products.forEach(product => {
            let final_value = (product.price - (product.price * product.discountPercentage / 100)).toFixed(2);
            let stk = product.stock;
            // Create HTML for each product
            productsContainer.innerHTML += `
                <div class="product">
                    <img src="${product.thumbnail}" alt="" class="product-img">
                    <div class="product-content">
                    <h2 class="product-title">${product.title}</h2>
                    <h2 class="product-brand">${product.brand}</h2>
                    <h4 class="product-category">${product.category}</h4>
                    <p class="product-description">${product.description}</p>
                    <div class="product-price-container">
                        <h3 class="product-price">$${product.price}</h3>
                        <h3 class="product-discount-price">${product.discountPercentage}%</h3>
                        <h3 class="product-final-price">$${final_value}</h3>
                        <h3 class="product-rating">${product.rating} (out of 5)</h3>
                        <h3 class="product-stock" style="color: ${stk < 50 ? 'red' : 'inherit'};">Stock: ${stk}</h3>
                        <a href="productDetails.html?id=${product.id}" data-productId="" class="more-detail">More detail</a>
                        <hr>
                    </div
                    </div>
                </div>`;
        });
    }

    function populateCategoriesDropdown(products) {
        // Get unique categories from products
        const categories = [...new Set(products.map(product => product.category))];
        // Populate select box with categories
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });
    }

    function showPage(products, page) {
        const startIndex = (page - 1) * limitPerPage;
        const endIndex = startIndex + limitPerPage;
        const paginatedProducts = products.slice(startIndex, endIndex);
        displayProducts(paginatedProducts);
    }
    function setupPagination(products) {
        listPage.innerHTML = '';
        const pageCount = Math.ceil(products.length / limitPerPage);
        for (let i = 1; i <= pageCount; i++) {
            const li = document.createElement('li');
            li.textContent = i;
            li.addEventListener('click', function (event) {
                event.preventDefault();
                currentPage = i;
                showPage(products, currentPage);
                updatePagination();
                window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to the top of the page
            });
            listPage.appendChild(li);
        }
        updatePagination();
    }
    
    function updatePagination() {
        const pages = document.querySelectorAll('.listPage li');
        pages.forEach((page, index) => {
            if (index + 1 === currentPage) {
                page.classList.add('active');
            } else {
                page.classList.remove('active');
            }
        });
    }



    fetchProducts('https://dummyjson.com/products?limit=100');
    function filterProducts(keyword, selectedCategory) {
        const filteredProducts = productsData.filter(product => {
            const matchesKeyword = (
                product.title.toLowerCase().includes(keyword.toLowerCase()) ||
                product.description.toLowerCase().includes(keyword.toLowerCase())
            );

            const matchesCategory = (selectedCategory === 'all' || product.category === selectedCategory);

            return matchesKeyword && matchesCategory;
        });
        return filteredProducts;
    }

    // Search input event listener
 searchInput.addEventListener('input', function (event) {
        const keyword = event.target.value.trim();
        const selectedCategory = categorySelect.value;
        const filteredProducts = filterProducts(keyword, selectedCategory);
        currentPage = 1;
        showPage(filteredProducts, currentPage);
        setupPagination(filteredProducts);
    });

    categorySelect.addEventListener('change', function (event) {
        const selectedCategory = event.target.value;
        const keyword = searchInput.value.trim();
        const filteredProducts = filterProducts(keyword, selectedCategory);
        currentPage = 1;
        showPage(filteredProducts, currentPage);
        setupPagination(filteredProducts);
    });
});


