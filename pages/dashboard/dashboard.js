const checkLoginUser = () => {
  const getLoginUser = JSON.parse(localStorage.getItem("LoginUser"));
  if (!getLoginUser) {
    console.log("please login karen");
    window.location.href = "../login.html";
  }
  document.getElementById("loginUserName").innerHTML = getLoginUser.name;
  document.getElementById("logo").innerHTML = getLoginUser.name.charAt(0);
  document.getElementById("post-logo").innerHTML = getLoginUser.name.charAt(0);
};
checkLoginUser();

const signOut = () => {
  localStorage.removeItem("LoginUser");
  window.location.href = "../login.html";
};

function createPost() {
  const postText = document.getElementById("post-input").value.trim();
  const postImageFile = document.getElementById("post-url").files[0];
  const currentUser = JSON.parse(localStorage.getItem("LoginUser"));

  if (!postText && !postImageFile) {
    alert("Cannot create empty post!");
    return;
  }

  const newPost = {
    id: Date.now(),
    ownerName: currentUser.name,
    content: postText,
    postUrl: null,
    likes: 0,
    likedByCurrentUser: false,
    time: new Date().toLocaleString(),
  };

  const savePost = () => {
    let allPosts = JSON.parse(localStorage.getItem("posts")) || [];
    allPosts.unshift(newPost);
    localStorage.setItem("posts", JSON.stringify(allPosts));

    document.getElementById("post-input").value = "";
    document.getElementById("post-url").value = "";

    alert("Post saved successfully!");
  };

  if (postImageFile) {
    const reader = new FileReader();
    reader.onload = function (e) {
      newPost.postUrl = e.target.result;
      savePost();
      renderPosts();
    };
    reader.readAsDataURL(postImageFile);
  } else {
    savePost();
    renderPosts();
  }
}

function deletePost(index) {
  let allPosts = JSON.parse(localStorage.getItem("posts")) || [];
  if (!allPosts[index]) return;

  allPosts.splice(index, 1);

  localStorage.setItem("posts", JSON.stringify(allPosts));

  renderPosts();
}

function toggleLike(index) {
  let allPosts = JSON.parse(localStorage.getItem("posts")) || [];

  if (!allPosts[index]) return;

  let post = allPosts[index];

  if (post.likedByCurrentUser) {
    post.likes--;
    post.likedByCurrentUser = false;
  } else {
    post.likes++;
    post.likedByCurrentUser = true;
  }

  localStorage.setItem("posts", JSON.stringify(allPosts));

  renderPosts();
}

function renderPosts() {
  const feedContainer = document.getElementById("posts-feed-container");
  feedContainer.innerHTML = "";

  const allPosts = JSON.parse(localStorage.getItem("posts")) || [];

  if (allPosts.length === 0) {
    feedContainer.innerHTML = `
      <p class="text-gray-500 dark:text-gray-400 text-center transition-colors duration-300">
        No posts yet!
      </p>`;
    return;
  }
  const currentUser = JSON.parse(localStorage.getItem("LoginUser"));

  allPosts.forEach((post, index) => {
    feedContainer.innerHTML += `
  <div class="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg dark:shadow-2xl mb-6 border border-gray-200 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-600/50 transition-all duration-300">
    <div class="flex items-center mb-4">
      <div class="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
        ${post.ownerName.charAt(0)}
      </div>
      <div class="ml-3">
        <p class="font-semibold text-gray-800 dark:text-gray-100 transition-colors duration-300">${
          post.ownerName
        }</p>
        <p class="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">${
          post.time
        }</p>
      </div>
    </div>
    <p class="text-gray-700 dark:text-gray-300 mb-4 transition-colors duration-300">${
      post.content || ""
    }</p>
    ${
      post.postUrl
        ? `<img class="w-full h-auto max-h-80 object-cover rounded-lg mb-4 border border-gray-300 dark:border-gray-700 transition-colors duration-300" src="${post.postUrl}" alt="Post image" />`
        : ""
    }
    <div class="flex justify-around">
      <button onclick="toggleLike(${index})" class="flex items-center text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-all duration-300 transform hover:-translate-y-0.5">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
        </svg>
        <span class="ml-1">${post.likes}</span>
      </button>

      ${
        post.ownerName === currentUser.name
          ? `
        <button onclick="openEditModal(${index})" class="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-300 transform hover:-translate-y-0.5">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
          </svg>
          <span class="ml-1">Edit</span>
        </button>
        <button onclick="deletePost(${index})" class="flex items-center text-red-600 dark:text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-all duration-300 transform hover:-translate-y-0.5">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
          </svg>
          <span class="ml-1">Delete</span>
        </button>
      `
          : ""
      }
    </div>
  </div>
`;
  });
}
renderPosts();
let editingIndex = null;

function openEditModal(index) {
  const allPosts = JSON.parse(localStorage.getItem("posts")) || [];
  const post = allPosts[index];
  if (!post) return;

  editingIndex = index;

  document.getElementById("editContent").value = post.content;

  const img = document.getElementById("editPreview");
  if (post.postUrl) {
    img.src = post.postUrl;
    img.classList.remove("hidden");
  } else {
    img.classList.add("hidden");
  }

  document.getElementById("editImage").value = "";

  document.getElementById("editModal").classList.remove("hidden");
}

function closeEditModal() {
  document.getElementById("editModal").classList.add("hidden");
}

function saveEditedPost() {
  const allPosts = JSON.parse(localStorage.getItem("posts")) || [];
  if (!allPosts[editingIndex]) return;

  const content = document.getElementById("editContent").value;
  const newImage = document.getElementById("editImage").files[0];

  allPosts[editingIndex].content = content;

  const saveAndClose = () => {
    localStorage.setItem("posts", JSON.stringify(allPosts));
    closeEditModal();
    renderPosts();
  };

  if (newImage) {
    const reader = new FileReader();
    reader.onload = function () {
      allPosts[editingIndex].postUrl = reader.result;
      saveAndClose();
    };
    reader.readAsDataURL(newImage);
  } else {
    saveAndClose();
  }
}

function filterPosts(query) {
  const user = JSON.parse(localStorage.getItem("LoginUser"));
  const feedContainer = document.getElementById("posts-feed-container");
  feedContainer.innerHTML = "";

  if (!user.myPosts) return;

  user.myPosts.forEach((post, index) => {
    if (post.content.toLowerCase().includes(query.toLowerCase())) {
      feedContainer.innerHTML += `
        <div class="bg-gray-800 p-4 sm:p-6 rounded-xl shadow-2xl mb-6 border border-gray-700 hover:border-emerald-600/50">
          <div class="flex items-center mb-4">
            <img class="w-10 h-10 rounded-full object-cover bg-emerald-100"
                 src="https://placehold.co/100x100/059669/ffffff?text=${post.owner.name.charAt(
                   0
                 )}" 
                 alt="${post.owner.name}" />
            <div class="ml-3">
              <p class="font-semibold text-gray-100">${post.owner.name}</p>
              <p class="text-xs text-gray-400">${post.time}</p>
            </div>
          </div>
          <p class="text-gray-300 mb-4">${post.content}</p>
          ${
            post.postUrl
              ? `<img class="w-full h-auto max-h-80 object-cover rounded-lg mb-4 border border-gray-700" src="${post.postUrl}" alt="Post image" />`
              : ""
          }
          <div class="flex justify-around">
            <button onclick="toggleLike(${index})" class="flex items-center text-emerald-400 hover:text-emerald-300 transition-all transform hover:-translate-y-0.5">❤️ ${
        post.likes
      }</button>
            <button onclick="editPost(${index})" class="flex items-center text-blue-400 hover:text-blue-300 transition-all transform hover:-translate-y-0.5">✏ Edit</button>
            <button onclick="deletePost(${index})" class="flex items-center text-red-500 hover:text-red-400 transition-all transform hover:-translate-y-0.5">🗑 Delete</button>
          </div>
        </div>
      `;
    }
  });
}

const searchInput = document.getElementById("search-posts");
searchInput.addEventListener("input", (e) => {
  filterPosts(e.target.value);
});

const themeToggle = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");
const sunIcon = document.getElementById("sun-icon");
const moonIcon = document.getElementById("moon-icon");

const mobileSearchToggle = document.getElementById("mobile-search-toggle");
const mobileSearchExpanded = document.getElementById("mobile-search-expanded");

if (
  localStorage.getItem("theme") === "dark" ||
  (!localStorage.getItem("theme") &&
    window.matchMedia("(prefers-color-scheme: dark)").matches)
) {
  document.documentElement.classList.add("dark");
  sunIcon.classList.add("hidden");
  moonIcon.classList.remove("hidden");
} else {
  document.documentElement.classList.remove("dark");
  sunIcon.classList.remove("hidden");
  moonIcon.classList.add("hidden");
}

themeToggle.addEventListener("click", () => {
  if (document.documentElement.classList.contains("dark")) {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
    sunIcon.classList.remove("hidden");
    moonIcon.classList.add("hidden");
  } else {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
    sunIcon.classList.add("hidden");
    moonIcon.classList.remove("hidden");
  }
});

mobileSearchToggle.addEventListener("click", () => {
  mobileSearchExpanded.classList.toggle("hidden");
});

const sidebarToggle = document.getElementById("sidebar-toggle");
const mobileSidebar = document.getElementById("mobile-sidebar");
const sidebarOverlay = document.getElementById("sidebar-overlay");

sidebarToggle.addEventListener("change", function () {
  if (this.checked) {
    mobileSidebar.classList.remove("-translate-x-full");
    sidebarOverlay.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  } else {
    mobileSidebar.classList.add("-translate-x-full");
    sidebarOverlay.classList.add("hidden");
    document.body.style.overflow = "auto";
  }
});

sidebarOverlay.addEventListener("click", function () {
  sidebarToggle.checked = false;
  mobileSidebar.classList.add("-translate-x-full");
  sidebarOverlay.classList.add("hidden");
  document.body.style.overflow = "auto";
});

document.addEventListener("click", (e) => {
  if (
    !mobileSearchToggle.contains(e.target) &&
    !mobileSearchExpanded.contains(e.target)
  ) {
    mobileSearchExpanded.classList.add("hidden");
  }
});
