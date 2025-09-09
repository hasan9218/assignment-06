
const loadCategory = () => {
    fetch("https://openapi.programming-hero.com/api/categories")
        .then((res) => res.json())
        .then((json) => displayCategory(json.categories));
};

const displayCategory = (categories) => {
    const categoryContainer = document.getElementById("category-container");
    categoryContainer.innerHTML = "";

    const allBtn = document.createElement("button");
    allBtn.id = "category-btn-all";
    allBtn.textContent = "All Trees";
    allBtn.className =
        "category-btn text-xl block w-full text-left px-3 py-2 my-2 hover:bg-[#15803d] hover:text-white hover:rounded-md transition-all duration-100 cursor-pointer";
    allBtn.addEventListener("click", () => {
        activeBtn("all");
        loadPlantsByCategory("all");
    });
    categoryContainer.append(allBtn);

    for (let category of categories) {
        const cateBtn = document.createElement("button");
        cateBtn.id = `category-btn-${category.category_name}`;
        cateBtn.textContent = category.category_name;
        cateBtn.className =
            "category-btn text-xl block w-full text-left px-3 py-2 my-2 hover:bg-[#15803d] hover:text-white hover:rounded-md transition-all duration-100 cursor-pointer";
        cateBtn.addEventListener("click", () => {
            activeBtn(category.category_name);
            loadPlantsByCategory(category.category_name);
        });
        categoryContainer.append(cateBtn);
    }

    activeBtn("all");
    loadPlantsByCategory("all");
};
function activeBtn(categoryName) {
    const buttons = document.querySelectorAll(".category-btn");
    buttons.forEach((btn) => btn.classList.remove("active"));

    const activeBtn =
        categoryName === "all"
            ? document.getElementById("category-btn-all")
            : document.getElementById(`category-btn-${categoryName}`);

    if (activeBtn) activeBtn.classList.add("active");
}

function loadPlantsByCategory(category) {
    fetch("https://openapi.programming-hero.com/api/plants")
        .then((res) => res.json())
        .then((json) => {
            const plantsContainer = document.getElementById("all-plants-container");
            plantsContainer.innerHTML = "";

            const plants = category === "all"
                ? json.plants
                : json.plants.filter((p) => p.category === category);

            for (let plant of plants) {
                const plantsDiv = document.createElement("div");
                plantsDiv.innerHTML = `
          <div class="bg-white p-5 rounded-xl">
            <img src="${plant.image}" alt="" class="w-full h-[200px] object-cover rounded-md mb-3">
            <div class="plants-content">
              <h3 onclick="loadPlantDetail(${plant.id})" class="font-semibold text-lg text-[#18181b] mb-3 cursor-pointer">${plant.name}</h3>
              <p class="text-base text-[#425158] mb-3 h-[120px]">${plant.description}</p>
              <div class="flex justify-between mb-3">
                <span class="bg-[#dcfce7] text-[#15803d] py-2 px-3 rounded-full text-base font-medium">${plant.category}</span>
                <div><p class="text-[#18181b] text-xl font-extrabold inline-block">৳</p><span class="text-[#18181b] text-xl font-semibold">${plant.price}</span></div>
              </div>
            </div>
            <button class="cart-btn text-base text-white md:text-lg bg-[#15803D] py-2 px-5 rounded-full border-0 shadow-none cursor-pointer w-full">Add to Cart</button>
          </div>
        `;
                plantsContainer.append(plantsDiv);
            }
        });
}

loadCategory();

// plant details
const loadPlantDetail = async (id) => {
    const url = `https://openapi.programming-hero.com/api/plant/${id}`;
    const res = await fetch(url);
    const details = await res.json();
    displayPlantDetail(details.plants);
};
const displayPlantDetail = (plants) => {
    const detailsBox = document.getElementById("details-container");
    detailsBox.innerHTML = `
<div><h3 class="font-semibold text-lg text-[#18181b] mb-3 cursor-pointer">${plants.name}</h3>
                <img src="${plants.image}" class= "w-full h-[300px] object-cover rounded-md mb-3" alt="">
                <p class="text-base text-[#18181b] font-medium mb-3">Category: <span class="text-base text-[#425158] mb-3">${plants.category}</span></p>
                <p class="text-base text-[#18181b] font-medium mb-3">Price: <span class="text-base text-[#425158] mb-3 font-extrabold">৳${plants.price}</span></p>
                <p class="text-base text-[#18181b] mb-3">Description: <span class="text-base text-[#425158] mb-3">${plants.description}</span></p></div>
`;
    document.getElementById("my_modal_5").showModal();
};



function updateTotal() {
    const cartContainer = document.getElementById("cart-container");
    const totalPriceSpan = document.getElementById("total-price");

    let total = 0;

    const items = cartContainer.querySelectorAll(".cart-content");
    items.forEach(item => {
        const priceText = item.querySelector(".item p").textContent; // যেমন: "৳500 x 2"
        const [priceStr, qtyStr] = priceText.split("x").map(s => s.trim());
        const price = parseInt(priceStr.replace("৳", ""));
        const qty = parseInt(qtyStr);

        total += price * qty;
    });

    totalPriceSpan.textContent = `৳${total}`;
}

// cart add
function addToCart(productName, price) {
    const cartContainer = document.getElementById("cart-container");

    let existingItem = Array.from(cartContainer.getElementsByClassName("cart-content"))
        .find(item => item.querySelector("h4").textContent === productName);

    if (existingItem) {
        let priceText = existingItem.querySelector("p").textContent;
        let currentQty = parseInt(priceText.split("x")[1].trim());
        currentQty++;
        existingItem.querySelector("p").textContent = `৳${price} x ${currentQty}`;
    } else {
        const newCart = document.createElement("div");
        newCart.className = "cart-content bg-[#f0fdf4] p-3 flex justify-between items-center mb-2 rounded-md";
        newCart.innerHTML = `
      <div class="item">
        <h4 class="text-lg font-medium">${productName}</h4>
        <p class="text-lg text-[#8c8c8c]">৳${price} x 1</p>
      </div>
      <button class="remove-btn text-3xl text-[#8c8c8c] cursor-pointer">&times;</button>
    `;
        cartContainer.append(newCart);

        // remove button
        const removeBtn = newCart.querySelector(".remove-btn");
        removeBtn.addEventListener("click", () => {
            newCart.remove();
            updateTotal(); 
        });
    }

    updateTotal();
}

// cart container
document.getElementById("all-plants-container").addEventListener("click", (e) => {
    if (e.target.classList.contains("cart-btn")) {
        const productDiv = e.target.closest(".bg-white");
        const productName = productDiv.querySelector("h3").textContent;
        const priceText = productDiv.querySelector(".flex span:last-child").textContent;
        const price = parseInt(priceText.replace("৳", ""));
        addToCart(productName, price);
         alert(`${productName} has been added to the cart.`);
    }
});

// loading Spinner

function setLoading(isLoading) {
  const spinner = document.getElementById("load-spinner");
  if (isLoading) {
    spinner.classList.remove("hidden");
  } else {
    spinner.classList.add("hidden");
  }
}

function loadAllPlants() {
  setLoading(true);

  fetch("https://openapi.programming-hero.com/api/plants")
    .then(res => res.json())
    .then(json => {
      displayPlants(json.plants);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false); 
    });
}

loadAllPlants();

