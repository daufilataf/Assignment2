document.addEventListener('DOMContentLoaded', function () {
    let products = document.querySelector('.products');

    async function fetchProducts(url) {
        try {
            let data = await fetch(url);
            if (!data.ok) {
                throw new Error(`Error ${data.status}: ${data.statusText}`);
            }

            let response = await data.json();
            let productsArray = response.products;

            // Iterate through each product and create HTML elements
            productsArray.forEach(product => {
                products.innerHTML += `
                    <div class="product">
                        <img src="${product.thumbnail}" alt="${product.title}" class="product-img">
                        <h2 class="product-title">${product.title}</h2>
                        <h4 class="product-category">${product.category}</h4>
                        <p class="product-description">${product.description}</p>
                        <div class="product-price-container">
                            <h3 class="product-price">${product.price}</h3>
                            <a href="#" data-productId="${product.id}" class="more-detailed">More Details</a>
                        </div>
                    </div>
                `;
            });
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }

    fetchProducts('https://dummyjson.com/products');
});
