const icons = document.querySelectorAll(".icon.icon-open");

// добавление класса "rotate" к кнопке icon-open
icons.forEach((icon) => {
  let isRotated = false;
  icon.addEventListener("click", () => {
    if (isRotated) {
      icon.classList.remove("rotate");
    } else {
      icon.classList.add("rotate");
    }
    isRotated = !isRotated;
  });
});

// Получение данных из публичного API: name, email, text и тд
function getData(page) {
  const url = `https://jsonplaceholder.typicode.com/comments?_limit=10&_page=${page}`;
  return fetch(url).then((response) => response.json());
}

// Получение данных из публичного API: name, email, text и тд
function getPrizeImg(id) {
  const url = `https://jsonplaceholder.typicode.com/photos/${id}`;
  return fetch(url).then((response) => response.json());
}

// Функция для создания строки таблицы с данными
function createTableRow(name, email, img, prize) {
  const row = document.createElement("tr");

  const nameCell = document.createElement("td");
  nameCell.setAttribute("data-label", "Имя");
  nameCell.textContent = name;
  row.appendChild(nameCell);

  const emailCell = document.createElement("td");
  emailCell.setAttribute("data-label", "email");
  emailCell.textContent = email;
  row.appendChild(emailCell);

  const prizeImage = document.createElement("img");
  prizeImage.setAttribute("alt", "Ваш приз");
  prizeImage.setAttribute("src", img); // Устанавливаем URL изображения
  prizeImage.style.height = "100px";
  prizeImage.style.width = "auto"; // Устанавливаем ширину изображения
  row.appendChild(prizeImage);

  const prizeCell = document.createElement("td");
  prizeCell.setAttribute("data-label", "Приз");
  prizeCell.textContent = prize;
  row.appendChild(prizeCell);

  return row;
}

function hideShowMoreLink() {
  const showMoreLink = document.querySelector("a#show-more-link");
  if (showMoreLink) {
    showMoreLink.classList.add("hidden");
  }
}

function unhideShowMoreLink() {
  const showMoreLink = document.querySelector("a#show-more-link");
  if (showMoreLink) {
    showMoreLink.classList.remove("hidden");
  }
}

// Функция для заполнения таблицы данными
function fillTableWithData(data) {
  const tableBody = document.querySelector("#table-winners tbody");

  hideShowMoreLink();

  tableBody.innerHTML = ""; // Очистка содержимого таблицы

  data.forEach((item) => {
    const { id, name, email, body } = item; // Заменяем userId на postId, чтобы получить уникальное значение для изображения

    const atIndex = email.indexOf("@");

    if (atIndex !== -1) {
      const username = email.substring(0, atIndex);
      const halfLength = Math.trunc(username.length / 2);
      const hiddenPart = username.substring(0, halfLength) + "*".repeat(username.length - halfLength);
      const hiddenEmail = hiddenPart + email.substring(atIndex);

      getPrizeImg(id) // Заменяем userId на postId
        .then((imgData) => {
          const row = createTableRow(name, hiddenEmail, imgData.thumbnailUrl, body.slice(Math.trunc(body.length / 2)));
          tableBody.appendChild(row);
          unhideShowMoreLink();
        })
        .catch((error) => console.log(error));
    }
  });

  tableBody.classList.add("slide-in-from-right");
  
  // Удаление класса анимации через небольшой интервал времени (чтобы анимация сработала повторно при следующем клике)
  setTimeout(() => {
    tableBody.classList.remove("slide-in-from-right");
  }, 600);
}


function showWinners(week) {
  getData(week)
    .then(fillTableWithData)
    .catch((error) => console.log(error));
}

var activeButton = document.getElementById("week1");
activeButton.classList.add("active");
showWinners(1);

function handleWeekButtonClick(week) {
  if (activeButton) {
    activeButton.classList.remove("active");
  }

  var selectedButton = document.getElementById("week" + week);
  selectedButton.classList.add("active");

  activeButton = selectedButton;

  showWinners(week);
}
