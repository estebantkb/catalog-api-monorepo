const API_URL = "http://localhost:8080/api/products";

const productGrid = $("#product-grid");
const message = $("#catalog-message");
let products = [];

const productCard = ({ id, name, brand, category, description = "", imageUrl, price, stock }) => `
    <article class="group flex cursor-pointer flex-col overflow-hidden rounded-xl bg-white shadow transition hover:-translate-y-1 hover:shadow-lg sm:flex-row"
             data-product-id="${id}" tabindex="0" role="button" aria-label="View details for ${name}">
        <img class="h-48 w-full object-cover sm:h-auto sm:w-36 lg:w-40"
             src="${imageUrl || "https://placehold.co/640x480?text=Product"}" alt="${name}">
        <div class="flex flex-1 flex-col justify-between p-5">
            <div>
                <p class="text-sm font-semibold uppercase text-blue-600">${category}</p>
                <h2 class="mt-2 text-xl font-bold">${name}</h2>
                <p class="mt-1 font-medium text-slate-600">${brand}</p>
                <p class="mt-3 text-slate-600">${description}</p>
            </div>
            <div class="mt-5 flex flex-wrap items-center justify-between gap-3">
                <span class="font-semibold">$${Number(price).toFixed(2)} · ${stock} in stock</span>
            </div>
        </div>
    </article>
`;

const renderProducts = (items) => {
    productGrid.html(items.map(productCard).join(""));
    const totalStock = items.reduce((total, { stock }) => total + Number(stock), 0);
    message.text(`${items.length} product(s) found. Total stock: ${totalStock}.`);
};

const filterProducts = (value) => {
    const search = value.toLowerCase().trim();
    const filteredProducts = products.filter(({ name, brand, category, description = "" }) =>
        [name, brand, category, description].some((field) =>
            field.toLowerCase().includes(search)
        )
    );

    renderProducts(filteredProducts);
};

const loadProducts = async () => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error("Could not load products.");
        }

        products = await response.json();
        renderProducts(products);
    } catch (error) {
        message.text(error.message);
    }
};

$("#product-search").on("input", (event) => filterProducts(event.target.value));
const showProductDetails = (productId) => {
    const product = products.find(({ id }) => id === productId);
    if (!product) {
        return;
    }

    $("#product-modal-content").html(`
        <div class="flex items-start justify-between gap-4">
            <h2 class="text-2xl font-bold">${product.name}</h2>
            <button class="text-2xl text-slate-500" data-close-product-modal aria-label="Close">&times;</button>
        </div>
        <img class="mt-4 h-64 w-full rounded-lg object-cover"
             src="${product.imageUrl || "https://placehold.co/640x480?text=Product"}" alt="${product.name}">
        <p class="mt-4 text-slate-600">${product.description || "No description available."}</p>
        <p class="mt-3 font-semibold">$${Number(product.price).toFixed(2)} · ${product.stock} in stock</p>
    `);
    $("#product-modal")[0].showModal();
};

productGrid.on("click", "[data-product-id]", (event) =>
    showProductDetails(Number($(event.currentTarget).data("product-id"))));

productGrid.on("keydown", "[data-product-id]", (event) => {
    if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        showProductDetails(Number($(event.currentTarget).data("product-id")));
    }
});

$("#product-modal").on("click", "[data-close-product-modal]", () => $("#product-modal")[0].close());
loadProducts();
