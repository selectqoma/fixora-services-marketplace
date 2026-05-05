const professionals = [
  {
    name: "Brussels Heat & Boiler",
    category: "Heating",
    city: "Brussels",
    rating: 4.9,
    reviews: 238,
    rate: 78,
    replyMinutes: 18,
    coords: [50.8467, 4.3525],
    availability: ["today", "emergency"],
    tags: ["insured", "licensed", "warranty"],
    services: ["Boiler repair", "Heating maintenance", "Radiator balancing"],
    image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=520&q=80",
    description: "Certified heating technicians for gas boilers, urgent breakdowns, annual maintenance, and landlord compliance reports."
  },
  {
    name: "AirFlow Pro Antwerp",
    category: "HVAC",
    city: "Antwerp",
    rating: 4.7,
    reviews: 161,
    rate: 84,
    replyMinutes: 27,
    coords: [51.2194, 4.4025],
    availability: ["week"],
    tags: ["insured", "licensed", "warranty"],
    services: ["Heat pumps", "AC installation", "Ventilation cleaning"],
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=520&q=80",
    description: "HVAC team focused on apartments, offices, heat pump installs, air conditioning maintenance, and ventilation diagnostics."
  },
  {
    name: "Ghent Fix Collective",
    category: "Handyman",
    city: "Ghent",
    rating: 4.6,
    reviews: 412,
    rate: 52,
    replyMinutes: 42,
    coords: [51.0543, 3.7174],
    availability: ["today", "week"],
    tags: ["insured", "warranty"],
    services: ["Small repairs", "Furniture assembly", "Wall mounting"],
    image: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=520&q=80",
    description: "Multi-trade handyman crew for rental turnovers, punch lists, fixtures, shelves, doors, and urgent tenant repairs."
  },
  {
    name: "Leuven Leak & Pipe",
    category: "Plumbing",
    city: "Leuven",
    rating: 4.8,
    reviews: 195,
    rate: 69,
    replyMinutes: 21,
    coords: [50.8798, 4.7005],
    availability: ["today", "emergency"],
    tags: ["insured", "licensed"],
    services: ["Leak repair", "Drain clearing", "Bathroom fixtures"],
    image: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=520&q=80",
    description: "Responsive plumbing service for leaks, blocked drains, taps, toilets, under-sink repairs, and insurance documentation."
  },
  {
    name: "VoltSecure Repairs",
    category: "Electrical",
    city: "Brussels",
    rating: 4.5,
    reviews: 124,
    rate: 72,
    replyMinutes: 33,
    coords: [50.8336, 4.3677],
    availability: ["week"],
    tags: ["insured", "licensed"],
    services: ["Fault finding", "Sockets", "Lighting"],
    image: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=520&q=80",
    description: "Licensed electricians for lighting, socket upgrades, panel checks, short circuits, and renovation-ready compliance work."
  },
  {
    name: "Rapid Home Repairs",
    category: "Repairs",
    city: "Mechelen",
    rating: 4.3,
    reviews: 89,
    rate: 58,
    replyMinutes: 55,
    coords: [51.0259, 4.4776],
    availability: ["week"],
    tags: ["insured"],
    services: ["Insulation prep", "Ventilation fixes", "EPC repair list"],
    image: "https://images.unsplash.com/photo-1505798577917-a65157d3320a?auto=format&fit=crop&w=520&q=80",
    description: "Practical energy-renovation repair team for EPC punch lists, ventilation fixes, insulation prep, damaged doors, silicone renewal, and small tiling."
  }
];

const state = {
  category: "all",
  location: "",
  timing: "any",
  minRating: 4,
  tags: new Set(),
  availability: "any",
  budget: "any",
  sort: "match",
  view: "list",
  saved: new Set()
};

const listingsEl = document.querySelector("#listings");
const resultCountEl = document.querySelector("#resultCount");
const serviceInput = document.querySelector("#serviceInput");
const locationInput = document.querySelector("#locationInput");
const timingInput = document.querySelector("#timingInput");
const ratingRange = document.querySelector("#ratingRange");
const ratingValue = document.querySelector("#ratingValue");
const sortInput = document.querySelector("#sortInput");
const mapPanel = document.querySelector("#mapPanel");
const companyDialog = document.querySelector("#companyDialog");
const jobRequestForm = document.querySelector("#jobRequestForm");
const jobFormNote = document.querySelector("#jobFormNote");
let serviceMap;
let mapMarkers = [];

const categoryIcons = {
  Heating: "flame",
  HVAC: "wind",
  Repairs: "wrench",
  Handyman: "hammer",
  Plumbing: "droplets",
  Electrical: "zap"
};

function hasRequiredTags(pro) {
  return [...state.tags].every((tag) => pro.tags.includes(tag));
}

function matchesAvailability(pro) {
  if (state.availability === "any") return true;
  return pro.availability.includes(state.availability);
}

function matchesTiming(pro) {
  if (state.timing === "any") return true;
  if (state.timing === "emergency") return pro.availability.includes("emergency");
  return pro.availability.includes(state.timing);
}

function matchesBudget(pro) {
  if (state.budget === "any") return true;
  return pro.rate <= Number(state.budget);
}

function getFilteredPros() {
  const location = state.location.trim().toLowerCase();
  let results = professionals.filter((pro) => {
    const categoryMatch = state.category === "all" || pro.category === state.category;
    const locationMatch = !location || pro.city.toLowerCase().includes(location);
    return (
      categoryMatch &&
      locationMatch &&
      matchesTiming(pro) &&
      hasRequiredTags(pro) &&
      matchesAvailability(pro) &&
      matchesBudget(pro) &&
      pro.rating >= state.minRating
    );
  });

  results = [...results].sort((a, b) => {
    if (state.sort === "rating") return b.rating - a.rating;
    if (state.sort === "price") return a.rate - b.rate;
    if (state.sort === "speed") return a.replyMinutes - b.replyMinutes;
    return b.rating * 10 - b.replyMinutes / 10 - (a.rating * 10 - a.replyMinutes / 10);
  });

  return results;
}

function renderBadges(pro) {
  const verification = pro.tags.map((tag) => {
    const label = {
      insured: "Insured",
      licensed: "License checked",
      warranty: "Warranty"
    }[tag];
    return `<span class="badge">${label}</span>`;
  });

  const services = pro.services.map((service) => `<span class="badge">${service}</span>`);
  return [...verification, ...services].join("");
}

function renderCard(pro) {
  const saved = state.saved.has(pro.name);
  const icon = categoryIcons[pro.category] || "wrench";
  return `
    <article class="pro-card">
      <div class="service-token" aria-hidden="true">
        <i data-lucide="${icon}"></i>
        <span>${pro.category}</span>
      </div>
      <div>
        <div class="card-top">
          <div>
            <h3>${pro.name}</h3>
            <div class="rating-row">
              <span class="stars">★★★★★</span>
              <strong>${pro.rating.toFixed(1)}</strong>
              <span>${pro.reviews} reviews</span>
            </div>
          </div>
          <button class="save-button ${saved ? "saved" : ""}" type="button" data-save="${pro.name}" aria-label="Save ${pro.name}" title="Save professional">
            <i data-lucide="heart"></i>
          </button>
        </div>
        <div class="meta-row">
          <span><i data-lucide="map-pin"></i>${pro.city}</span>
          <span><i data-lucide="briefcase-business"></i>${pro.category}</span>
          <span><i data-lucide="clock-3"></i>${pro.replyMinutes} min reply</span>
          <span><i data-lucide="calendar-check"></i>${pro.availability.includes("emergency") ? "24/7 emergency" : "This week"}</span>
        </div>
        <p class="description">${pro.description}</p>
        <div class="badge-row">${renderBadges(pro)}</div>
        <div class="card-actions">
          <span class="price">EUR ${pro.rate}<small>/hr estimate</small></span>
          <button class="quote-button" type="button">Request quote</button>
        </div>
      </div>
    </article>
  `;
}

function initMap() {
  if (!window.L || serviceMap) return;

  serviceMap = L.map("serviceMap", {
    scrollWheelZoom: false,
    zoomControl: true
  }).setView([50.94, 4.35], 8);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(serviceMap);
}

function updateMap(results) {
  if (!window.L) return;
  initMap();
  if (!serviceMap) return;

  mapMarkers.forEach((marker) => marker.remove());
  mapMarkers = results.map((pro) => {
    const marker = L.marker(pro.coords).addTo(serviceMap);
    marker.bindPopup(`
      <strong>${pro.name}</strong><br />
      ${pro.category} in ${pro.city}<br />
      ${pro.rating.toFixed(1)} stars · EUR ${pro.rate}/hr
    `);
    return marker;
  });

  if (mapMarkers.length) {
    const group = L.featureGroup(mapMarkers);
    serviceMap.fitBounds(group.getBounds().pad(0.28), { maxZoom: 11 });
  } else {
    serviceMap.setView([50.94, 4.35], 8);
  }

  setTimeout(() => serviceMap.invalidateSize(), 0);
}

function render() {
  const results = getFilteredPros();
  resultCountEl.textContent = `${results.length} professional${results.length === 1 ? "" : "s"}`;
  listingsEl.innerHTML = results.length
    ? results.map(renderCard).join("")
    : `<div class="empty-state"><h3>No matches yet</h3><p>Try lowering the rating, widening the budget, or searching another nearby city.</p></div>`;

  document.querySelectorAll("[data-save]").forEach((button) => {
    button.addEventListener("click", () => {
      const name = button.dataset.save;
      if (state.saved.has(name)) state.saved.delete(name);
      else state.saved.add(name);
      render();
    });
  });

  updateMap(results);
  if (window.lucide) window.lucide.createIcons();
}

document.querySelector("#searchForm").addEventListener("submit", (event) => {
  event.preventDefault();
  state.category = serviceInput.value;
  state.location = locationInput.value;
  state.timing = timingInput.value;
  document.querySelectorAll(".category").forEach((button) => {
    button.classList.toggle("active", button.dataset.category === state.category);
  });
  render();
});

document.querySelectorAll(".category").forEach((button) => {
  button.addEventListener("click", () => {
    state.category = button.dataset.category;
    serviceInput.value = state.category;
    document.querySelectorAll(".category").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    render();
  });
});

document.querySelectorAll(".filter").forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    if (checkbox.checked) state.tags.add(checkbox.value);
    else state.tags.delete(checkbox.value);
    render();
  });
});

document.querySelectorAll(".availability").forEach((radio) => {
  radio.addEventListener("change", () => {
    state.availability = radio.value;
    render();
  });
});

document.querySelectorAll(".budget").forEach((radio) => {
  radio.addEventListener("change", () => {
    state.budget = radio.value;
    render();
  });
});

ratingRange.addEventListener("input", () => {
  state.minRating = Number(ratingRange.value);
  ratingValue.textContent = `${state.minRating.toFixed(1)}+`;
  render();
});

sortInput.addEventListener("change", () => {
  state.sort = sortInput.value;
  render();
});

document.querySelectorAll(".toggle").forEach((button) => {
  button.addEventListener("click", () => {
    state.view = button.dataset.view;
    document.querySelectorAll(".toggle").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    if (serviceMap) setTimeout(() => serviceMap.invalidateSize(), 200);
    mapPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
});

document.querySelectorAll("[data-open-login]").forEach((button) => {
  button.addEventListener("click", () => {
    if (companyDialog.showModal) companyDialog.showModal();
  });
});

document.querySelectorAll("[data-scroll-pricing]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector("#pricing").scrollIntoView({ behavior: "smooth" });
  });
});

jobRequestForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const service = document.querySelector("#jobService").value;
  const location = document.querySelector("#jobLocation").value.trim() || "your area";
  jobFormNote.textContent = `Prototype request ready: ${service} in ${location}. In the live product this would create a request and notify matched verified companies.`;
  jobFormNote.classList.add("success");
});

document.querySelector("#resetFilters").addEventListener("click", () => {
  state.category = "all";
  state.location = "";
  state.timing = "any";
  state.minRating = 4;
  state.tags.clear();
  state.availability = "any";
  state.budget = "any";
  serviceInput.value = "all";
  locationInput.value = "";
  timingInput.value = "any";
  ratingRange.value = "4";
  ratingValue.textContent = "4.0+";
  document.querySelectorAll(".filter").forEach((input) => (input.checked = false));
  document.querySelector('.availability[value="any"]').checked = true;
  document.querySelector('.budget[value="any"]').checked = true;
  document.querySelectorAll(".category").forEach((button) => {
    button.classList.toggle("active", button.dataset.category === "all");
  });
  render();
});

window.addEventListener("DOMContentLoaded", () => {
  render();
});

window.addEventListener("load", () => {
  updateMap(getFilteredPros());
});
