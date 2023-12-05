document.addEventListener('DOMContentLoaded', async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    try {
        const productDetails = await fetch(`https://dummyjson.com/product/${productId}`);
        const product = await productDetails.json();

        const productDetailsContainer = document.querySelector('.product-details-container');

        const finalValue = (product.price - (product.price * product.discountPercentage / 100)).toFixed(2);
        const stock = product.stock;

        productDetailsContainer.innerHTML = `
        <div class="product-details">
            <h1>Product Details</h1>
            <div class="product-details-container">
                ${product.images.map(image => `<img src="${image}" alt="${product.title}" class="product-img">`).join('')}
                <h2 class="product-title">${product.title}</h2>
                <h3 class="product-price">$${product.price}</h3>
                <h3 class="product-final-price">$${finalValue}</h3>
                <p class="product-description">${product.description}</p>
                <!-- Include other product details you want to display -->
                <h3 class="product-stock" style="color: ${stock < 50 ? 'red' : 'inherit'};">Stock: ${stock}</h3>
            </div>
        </div>`;
        document.title = product.title;

        const currentProductCategory = product.category; // Replace this with the actual property name

        // Fetch products with the same category
        const similarProductsResponse = await fetch(`https://dummyjson.com/products/category/${encodeURIComponent(currentProductCategory)}`);
        const similarProductsData = await similarProductsResponse.json();
        const similarProductsArray = similarProductsData.products;

        const similarProductsContainer = document.querySelector('.similar-products-container');
        let count = 0;

        // Display similar products in the HTML
        similarProductsArray.forEach(similarProduct => {
            if (similarProduct.id !== product.id) {
                // Create HTML elements for each similar product with a link to its details page
                const similarProductHTML = `
                    <div class="similar-product">
                        <a href="productDetails.html?id=${similarProduct.id}">
                            <img src="${similarProduct.thumbnail}" alt="${similarProduct.title}" class="similar-product-img">
                            <h2 class="product-title">${similarProduct.title}</h2>
                            <h3 class="product-price">$${similarProduct.price}</h3>
                            <h3 class="product-final-price">$${finalValue}</h3>
                            <p class="product-description">${similarProduct.description}</p>
                            <!-- Include other product details you want to display -->
                            <h3 class="product-stock" style="color: ${similarProduct.stock < 50 ? 'red' : 'inherit'};">Stock: ${similarProduct.stock}</h3>
                            <hr>
                        </a>
                    </div>
                `;

                similarProductsContainer.innerHTML += similarProductHTML;
                count++;
            }
        });

        if (count === 0) {
            const similarProductHTML = `
                <div class="similar-product">
                    <h1>There are not any similar objects</h1>
                </div>
            `;
            similarProductsContainer.innerHTML += similarProductHTML;
        }

        
    } catch (error) {
        console.error('Error fetching product details:', error);
    }
});
