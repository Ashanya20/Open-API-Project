fetch("https://api.artic.edu/api/v1/artworks?page=1&limit=100")
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

            if (repo.image_id) {
                const img = document.createElement("img");
                img.src = `${iiif_url}/${repo.image_id}/full/843,/0/default.jpg`;
                img.alt = repo.title || "Untitled";
                art.appendChild(img);
            }
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
                        closeBtn.addEventListener("click", () => {
                            detailsSection.style.display = "none";
                            document.body.classList.remove("show-details");
                        });
                        detailsSection.appendChild(closeBtn);

                        // Display bigger img
                        const bigImg = document.createElement("img");
                        bigImg.src = `${iiif_url}/${artwork.image_id}/full/843,/0/default.jpg`;
                        bigImg.alt = artwork.title || "Untitled";

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