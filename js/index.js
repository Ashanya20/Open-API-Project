// Copyright logo
const footerElement = document.createElement("footer");
footerElement.className = "footer";
document.body.append(footerElement);

const today = new Date();
const thisYear = today.getFullYear();

const footer = document.querySelector(".footer");
const copyright = document.createElement("p");
copyright.innerHTML = `© Anya Maker ${thisYear}`;
footer.appendChild(copyright);

// API fetch, insert Artworks
fetch("https://api.artic.edu/api/v1/artworks?page=1&limit=20")
    .then(response => {
        if (!response.ok) {
            throw new Error(`Request failed: ${response.status}`);
        }
        return response.json();
    })
    .then(repositories => {
        console.log("Successfully loaded repositories: ", repositories.data);
        const iiif_url = repositories.config.iiif_url;
        const artSection = document.getElementById("Art");
        const artList = artSection.querySelector("ul");

        // Filter only art with image
        const artworksWithImages = repositories.data.filter(
            repo => repo.image_id && repo.image_id.trim() !== ""
        );

        artworksWithImages.forEach(repo => {
            const art = document.createElement("li");
            const title = document.createElement("span");
            title.textContent = repo.title || "Untitled";
            art.appendChild(title);

            const img = document.createElement("img");
            img.src = `${iiif_url}/${repo.image_id}/full/400,/0/default.jpg`;
            img.alt = repo.title || "Untitled";
            art.appendChild(img);

            // Click event to show more details about Art item
            art.addEventListener("click", () => {
                fetch(`https://api.artic.edu/api/v1/artworks/${repo.id}`)
                    .then(response => response.json())
                    .then(detailData => {
                        const artwork = detailData.data;
                        const detailsSection = document.getElementById("artDetails");
                        detailsSection.innerHTML = ""; // clear old content

                        // Create close button
                        const closeBtn = document.createElement("button");
                        closeBtn.textContent = "×";
                        closeBtn.classList.add("close-btn");
                        closeBtn.setAttribute("aria-label", "Close details"); // accessibility
                        closeBtn.addEventListener("click", () => {
                            detailsSection.style.display = "none";
                            document.body.classList.remove("show-details");
                        });
                        detailsSection.appendChild(closeBtn);

                        // Display bigger img
                        const bigImg = document.createElement("img");
                        bigImg.src = `${iiif_url}/${artwork.image_id}/full/400,/0/default.jpg`;
                        bigImg.alt = artwork.title || "Untitled";

                        // Click to open the image in a new tab
                        bigImg.addEventListener("click", () => {
                            const fullImgUrl = `${iiif_url}/${artwork.image_id}/full/400,/0/default.jpg`;
                            window.open(fullImgUrl, "_blank");
                        });

                        // Atr info
                        const info = document.createElement("p");
                        info.innerHTML = `<strong>${artwork.title}</strong><br>${artwork.artist_title}<br>${artwork.date_display}<br>(${artwork.medium_display})`;
                        detailsSection.appendChild(bigImg);
                        detailsSection.appendChild(info);
                        detailsSection.scrollIntoView({ behavior: "smooth" });

                        detailsSection.style.display = "block";
                        document.body.classList.add("show-details");
                    })
                    .catch(err => console.error("Detail fetch failed:", err));
            });
            artList.appendChild(art);
        });
    })
    .catch(error => {
        console.error('Failed to load repositories:', error);
    });

// Fetch and display Products
fetch("https://api.artic.edu/api/v1/products?page=1&limit=20")
    .then(response => {
        if (!response.ok) {
            throw new Error(`Products request failed: ${response.status}`);
        }
        return response.json();
    })
    .then(productsData => {
        console.log("Products data:", productsData);
        const productsSection = document.getElementById("Products");
        const productsList = productsSection.querySelector("ul");

        // Filter only items that have image_url
        const productsWithImages = productsData.data.filter(
            product => product.image_url && product.image_url.trim() !== ""
        );

        if (productsWithImages.length === 0) {
            const msg = document.createElement("p");
            msg.textContent = "No product images found. Try again later.";
            msg.style.textAlign = "center";
            productsList.appendChild(msg);
            return;
        }

        productsWithImages.forEach(product => {
            const item = document.createElement("li");
            const title = document.createElement("span");
            title.textContent = product.title || "Untitled Product";
            item.appendChild(title);

            const img = document.createElement("img");
            img.src = product.image_url;
            img.alt = product.title || "Untitled Product";
            item.appendChild(img);

            // Click event to open image in a new tab
            item.addEventListener("click", () => {
                window.open(product.image_url, "_blank");
            });

            productsList.appendChild(item);
        });
    })
    .catch(error => {
        console.error("Failed to load products:", error);
    });

// Navigation toggler
document.getElementById("showArtworks").addEventListener("click", () => {
    document.getElementById("Art").style.display = "block";
    document.getElementById("Products").style.display = "none";
});

document.getElementById("showProducts").addEventListener("click", () => {
    document.getElementById("Art").style.display = "none";
    document.getElementById("Products").style.display = "block";
});

const artSection = document.getElementById("Art");
const productsSection = document.getElementById("Products");
const showArtworksBtn = document.getElementById("showArtworks");
const showProductsBtn = document.getElementById("showProducts");

// Initial state
productsSection.style.display = "none";
showArtworksBtn.classList.add("active");

showArtworksBtn.addEventListener("click", () => {
    artSection.style.display = "block";
    productsSection.style.display = "none";
    showArtworksBtn.classList.add("active");
    showProductsBtn.classList.remove("active");
});

showProductsBtn.addEventListener("click", () => {
    artSection.style.display = "none";
    productsSection.style.display = "block";
    showProductsBtn.classList.add("active");
    showArtworksBtn.classList.remove("active");
});