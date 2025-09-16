document.addEventListener("DOMContentLoaded", () => {
  const toyCollection = document.getElementById("toy-collection");
  const addToyForm = document.querySelector(".add-toy-form");

  const toysUrl = "http://localhost:3000/toys";

  // --------------------------
  // Fetch & Render Toys (GET)
  // --------------------------
  fetch(toysUrl)
    .then((resp) => resp.json())
    .then((toys) => {
      toys.forEach((toy) => renderToy(toy));
    });

  // Helper to render a single toy card
  function renderToy(toy) {
    const card = document.createElement("div");
    card.className = "card";

    const h2 = document.createElement("h2");
    h2.textContent = toy.name;

    const img = document.createElement("img");
    img.src = toy.image;
    img.className = "toy-avatar";

    const p = document.createElement("p");
    p.textContent = `${toy.likes} Likes`;

    const button = document.createElement("button");
    button.className = "like-btn";
    button.id = toy.id;
    button.textContent = "Like ❤️";

    // --------------------------
    // Like Button (PATCH)
    // --------------------------
    button.addEventListener("click", () => {
      const newLikes = toy.likes + 1;

      fetch(`${toysUrl}/${toy.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ likes: newLikes }),
      })
        .then((resp) => resp.json())
        .then((updatedToy) => {
          toy.likes = updatedToy.likes; // update local toy object
          p.textContent = `${updatedToy.likes} Likes`;
        });
    });

    card.append(h2, img, p, button);
    toyCollection.appendChild(card);
  }

  // --------------------------
  // Add New Toy (POST)
  // --------------------------
  addToyForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = e.target.name.value;
    const image = e.target.image.value;

    fetch(toysUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name: name,
        image: image,
        likes: 0,
      }),
    })
      .then((resp) => resp.json())
      .then((newToy) => {
        renderToy(newToy);
        addToyForm.reset(); // clear form
      });
  });
});
