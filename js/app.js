// === 頁面元素取得 ===
const homeView = document.getElementById("home-view");
const searchView = document.getElementById("search-view");
const courseView = document.getElementById("course-view");
const checkoutView = document.getElementById("checkout-view");
const couponView = document.getElementById("coupon-view");
const mainTabBar = document.getElementById("main-tab-bar");

const openSearchBtn = document.getElementById("open-search-btn");
const cancelBtn = document.getElementById("cancel-btn");
const searchInput = document.getElementById("search-input");
const clearBtn = document.getElementById("clear-btn");
const emptyState = document.getElementById("empty-state");
const fakeKeyboard = document.getElementById("fake-keyboard");
const resultState = document.getElementById("result-state");
const resultList = document.getElementById("result-list");
const fakeEnterBtn = document.getElementById("fake-enter-btn");

const courseScrollArea = document.getElementById("course-scroll-area");
const stickyTabs = document.getElementById("sticky-tabs");
const navTitleText = document.getElementById("nav-title-text");
const giftAlert = document.getElementById("gift-alert");

// 假搜尋結果
const searchResults = [
  {
    img: "https://picsum.photos/200/300?random=11",
    title: "謝謝你因為我很幸福",
    author: "春花媽",
    episodes: "50集",
    price: 580,
    oldPrice: 680,
  },
  {
    img: "https://picsum.photos/200/300?random=12",
    title: "第一本認識恐懼的神經科學讓焦慮不見了",
    author: "凱瑟琳．皮特曼、伊莉莎白．卡爾",
    episodes: "15集",
    price: 399,
    oldPrice: null,
  },
];

// === 首頁搜尋 ===
openSearchBtn.addEventListener("click", () => {
  homeView.style.display = "none";
  searchView.style.display = "flex";
  mainTabBar.style.display = "none";
  searchInput.value = "";
  clearBtn.style.display = "none";
  emptyState.style.display = "flex";
  fakeKeyboard.style.display = "flex";
  resultState.style.display = "none";
});

cancelBtn.addEventListener("click", () => {
  searchView.style.display = "none";
  homeView.style.display = "block";
  mainTabBar.style.display = "flex";
});

// 搜尋互動
clearBtn.addEventListener("click", () => {
  searchInput.value = "";
  clearBtn.style.display = "none";
  emptyState.style.display = "flex";
  fakeKeyboard.style.display = "flex";
  resultState.style.display = "none";
  searchInput.focus();
});
fakeKeyboard.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("key") &&
    !e.target.classList.contains("wide") &&
    !e.target.classList.contains("space") &&
    !e.target.classList.contains("enter")
  ) {
    searchInput.value += e.target.innerText;
    clearBtn.style.display = "block";
  }
});

function performSearch() {
  if (searchInput.value.trim() === "") return;
  emptyState.style.display = "none";
  fakeKeyboard.style.display = "none";
  resultState.style.display = "block";
  let html = "";
  searchResults.forEach((item) => {
    const oldPriceHTML = item.oldPrice
      ? `<span class="price-old">${item.oldPrice}點</span>`
      : "";
    html += `
      <div class="result-card" onclick="openCourse()">
        <img src="${item.img}" class="result-img">
        <div class="result-info">
          <span class="result-tag">語音</span>
          <div class="result-title">${item.title}</div>
          <div class="result-author">${item.author}</div>
          <div class="result-episodes">${item.episodes}</div>
          <div class="result-footer">
            <div class="result-price-box">
              <span class="price-current" style="font-size: 17px;">${item.price}點</span>
              ${oldPriceHTML}
            </div>
            <div class="result-actions">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
              <svg class="play-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8" fill="currentColor"></polygon></svg>
            </div>
          </div>
        </div>
      </div>
    `;
  });
  resultList.innerHTML = html;
}

fakeEnterBtn.addEventListener("click", () => {
  searchInput.value = "快樂";
  performSearch();
});
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") performSearch();
});

// === 頁面切換 ===
function openCourse() {
  homeView.style.display = "none";
  searchView.style.display = "none";
  courseView.style.display = "block";
  mainTabBar.style.display = "none";
  courseScrollArea.scrollTop = 0;
  switchTab("intro", document.getElementById("tab-btn-intro"));
  stickyTabs.classList.remove("is-sticky");
  navTitleText.style.display = "none";
}

function closeCourse() {
  courseView.style.display = "none";
  homeView.style.display = "block";
  mainTabBar.style.display = "flex";
}

function openCheckout() {
  courseView.style.display = "none";
  checkoutView.style.display = "flex";
}

function closeCheckout() {
  checkoutView.style.display = "none";
  courseView.style.display = "block";
}

function openCoupon() {
  checkoutView.style.display = "none";
  couponView.style.display = "flex";
}

function closeCoupon() {
  couponView.style.display = "none";
  checkoutView.style.display = "flex";
}

// === 課程頁 Tab 切換 ===
function switchTab(tabName, element) {
  document
    .querySelectorAll(".course-tab")
    .forEach((t) => t.classList.remove("active"));
  if (element) element.classList.add("active");

  if (tabName === "intro") {
    document.getElementById("tab-intro").style.display = "block";
    document.getElementById("tab-catalog").style.display = "none";
  } else {
    document.getElementById("tab-intro").style.display = "none";
    document.getElementById("tab-catalog").style.display = "block";
  }
}

// 展開收合
function toggleExpand(contentId, btnElement) {
  const content = document.getElementById(contentId);
  if (content.classList.contains("collapsed")) {
    content.classList.remove("collapsed");
    btnElement.innerHTML =
      '收合 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="18 15 12 9 6 15"></polyline></svg>';
    btnElement.classList.add("active");
  } else {
    content.classList.add("collapsed");
    btnElement.innerHTML =
      '展開全部 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="6 9 12 15 18 9"></polyline></svg>';
    btnElement.classList.remove("active");
  }
}

// 滾動事件
courseScrollArea.addEventListener("scroll", () => {
  const tabsRect = stickyTabs.getBoundingClientRect();
  if (tabsRect.top <= 61) {
    stickyTabs.classList.add("is-sticky");
    navTitleText.style.display = "block";
  } else {
    stickyTabs.classList.remove("is-sticky");
    navTitleText.style.display = "none";
  }
});

// === 彈窗與紅包 ===
function openGiftAlert() {
  giftAlert.classList.add("show");
}
function closeGiftAlert() {
  giftAlert.classList.remove("show");
}

function applyCoupon() {
  document.getElementById("discount-checkbox").classList.add("selected");
  document.getElementById("discount-text").innerHTML =
    '折抵 50 點 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>';
  document.getElementById("discount-detail-row").style.display = "flex";
  document.getElementById("total-amount").innerText = "600";
  closeCoupon();
}
