/* ============================================
   Quest Maker - App Logic
   ============================================ */

(function () {
  "use strict";

  // --- State ---
  let allQuests = [];
  let activeCategory = "すべて";
  let completedIds = loadCompleted();
  let currentQuest = null;

  // --- DOM ---
  const $categoryFilters = document.getElementById("categoryFilters");
  const $questCard = document.getElementById("questCard");
  const $drawButton = document.getElementById("drawButton");
  const $completedList = document.getElementById("completedList");
  const $completedCount = document.getElementById("completedCount");

  // --- Init ---
  async function init() {
    allQuests = await fetchQuests();
    renderCategoryFilters();
    renderCompletedList();
    $drawButton.addEventListener("click", drawQuest);
  }

  // --- Data ---
  async function fetchQuests() {
    const res = await fetch("data/quests.json");
    const data = await res.json();
    return data.quests;
  }

  // --- Categories ---
  function getCategories() {
    const cats = [...new Set(allQuests.map((q) => q.category))];
    return ["すべて", ...cats.sort()];
  }

  function renderCategoryFilters() {
    const categories = getCategories();
    $categoryFilters.innerHTML = categories
      .map((cat) => {
        const active = cat === activeCategory ? " filter-btn--active" : "";
        return `<button class="filter-btn${active}" data-category="${cat}">${cat}</button>`;
      })
      .join("");

    $categoryFilters.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeCategory = btn.dataset.category;
        renderCategoryFilters();
      });
    });
  }

  // --- Draw Quest ---
  function getFilteredQuests() {
    let quests = allQuests;
    if (activeCategory !== "すべて") {
      quests = quests.filter((q) => q.category === activeCategory);
    }
    return quests;
  }

  function drawQuest() {
    const quests = getFilteredQuests();
    if (quests.length === 0) return;

    // Pick random quest (avoid showing the same one twice in a row)
    let quest;
    do {
      quest = quests[Math.floor(Math.random() * quests.length)];
    } while (quests.length > 1 && currentQuest && quest.id === currentQuest.id);

    currentQuest = quest;

    // Spin animation
    $questCard.classList.add("quest-card--spinning");
    $questCard.addEventListener(
      "animationend",
      () => {
        $questCard.classList.remove("quest-card--spinning");
      },
      { once: true }
    );

    renderQuestCard(quest);
  }

  function renderQuestCard(quest) {
    const stars = "★".repeat(quest.difficulty) + "☆".repeat(3 - quest.difficulty);
    const isCompleted = completedIds.includes(quest.id);

    $questCard.classList.add("quest-card--active");
    $questCard.innerHTML = `
      <div class="quest-card__content">
        <div class="quest-card__icon">${quest.icon}</div>
        <h2 class="quest-card__title">${quest.title}</h2>
        <p class="quest-card__description">${quest.description}</p>
        <div class="quest-card__meta">
          <span class="quest-card__tag">${quest.category}</span>
          <span class="quest-card__tag quest-card__difficulty">${stars}</span>
          <span class="quest-card__tag">${quest.duration}</span>
        </div>
        <div class="quest-card__actions">
          ${
            isCompleted
              ? '<span style="color: var(--color-success);">達成済み!</span>'
              : `<button class="btn-complete" id="completeBtn">クエスト達成！</button>`
          }
        </div>
      </div>
    `;

    if (!isCompleted) {
      document.getElementById("completeBtn").addEventListener("click", () => {
        completeQuest(quest);
      });
    }
  }

  // --- Complete Quest ---
  function completeQuest(quest) {
    if (completedIds.includes(quest.id)) return;

    completedIds.push(quest.id);
    saveCompleted();
    renderQuestCard(quest);
    renderCompletedList();
  }

  function removeCompleted(questId) {
    completedIds = completedIds.filter((id) => id !== questId);
    saveCompleted();
    renderCompletedList();

    // Update card if currently shown quest was un-completed
    if (currentQuest && currentQuest.id === questId) {
      renderQuestCard(currentQuest);
    }
  }

  // --- Completed List ---
  function renderCompletedList() {
    $completedCount.textContent = completedIds.length;

    if (completedIds.length === 0) {
      $completedList.innerHTML =
        '<p class="completed-list__empty">まだクエストを達成していません</p>';
      return;
    }

    const items = completedIds
      .map((id) => {
        const quest = allQuests.find((q) => q.id === id);
        if (!quest) return "";
        return `
        <div class="completed-item">
          <span class="completed-item__icon">${quest.icon}</span>
          <div class="completed-item__info">
            <div class="completed-item__title">${quest.title}</div>
          </div>
          <button class="completed-item__remove" data-id="${quest.id}" title="取り消す">✕</button>
        </div>
      `;
      })
      .join("");

    $completedList.innerHTML = items;

    $completedList.querySelectorAll(".completed-item__remove").forEach((btn) => {
      btn.addEventListener("click", () => {
        removeCompleted(Number(btn.dataset.id));
      });
    });
  }

  // --- LocalStorage ---
  function loadCompleted() {
    try {
      return JSON.parse(localStorage.getItem("quest_completed")) || [];
    } catch {
      return [];
    }
  }

  function saveCompleted() {
    localStorage.setItem("quest_completed", JSON.stringify(completedIds));
  }

  // --- Start ---
  document.addEventListener("DOMContentLoaded", init);
})();
