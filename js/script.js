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

// Получение данных из публичного API: id, img и тд
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

  const prizeCell = document.createElement("td");
  prizeCell.setAttribute("data-label", "Приз");

  const prizeImage = document.createElement("img");
  prizeImage.setAttribute("src", img);
  prizeImage.setAttribute("alt", "Ваш приз");
  prizeImage.style.height = "100px";
  prizeImage.style.width = "auto";
  prizeCell.appendChild(prizeImage);

  const prizeText = document.createElement("span");
  prizeText.textContent = prize;
  prizeCell.appendChild(prizeText);

  row.appendChild(prizeCell);

  return row;
}

// функция, скрывающая ссылку "Показать еще"
function hideShowMoreLink() {
  const showMoreLink = document.querySelector("a#show-more-link");
  if (showMoreLink) {
    showMoreLink.style.display = "none";
  }
}

// функция, возвращающая ссылку "Показать еще"
function displayShowMoreLink() {
  const showMoreLink = document.querySelector("a#show-more-link");
  if (showMoreLink) {
    showMoreLink.style.display = "";
  }
}

// Функция для заполнения таблицы данными
function fillTableWithData(data) {
  const tableBody = document.querySelector("#table-winners tbody");

  hideShowMoreLink();

  tableBody.innerHTML = ""; // Очистка содержимого таблицы

  data.forEach((item) => {
    const { id, name, email, body } = item;
    // засекречивание половины email'а полльзователя
    const atIndex = email.indexOf("@");

    if (atIndex !== -1) {
      const username = email.substring(0, atIndex);
      const halfLength = Math.trunc(username.length / 2);
      const hiddenPart =
        username.substring(0, halfLength) +
        "*".repeat(username.length - halfLength);
      const hiddenEmail = hiddenPart + email.substring(atIndex);

      getPrizeImg(id)
        .then((imgData) => {
          const row = createTableRow(
            name,
            hiddenEmail,
            imgData.thumbnailUrl,
            body.slice(Math.trunc(body.length / 2))
          );
          tableBody.appendChild(row); // добавление заполненной строки в таблицу
          displayShowMoreLink();
        })
        .catch((error) => console.log(error));
    }
  });

  tableBody.classList.add("slide-in-from-right"); // активируем анимацию по клику на табы

  // Удаление класса анимации через небольшой интервал времени (чтобы анимация сработала повторно при следующем клике)
  setTimeout(() => {
    tableBody.classList.remove("slide-in-from-right");
  }, 600);
}

// вывод данных в таблицу (пагинация)
function showWinners(week) {
  getData(week)
    .then(fillTableWithData)
    .catch((error) => console.log(error));
}

// установка таба по умолчанию (сразу открывается список из 1-x 10ти победителей - page 1)
var activeButton = document.getElementById("week1");
activeButton.classList.add("active");
showWinners(1);

// обработчик событий нажатия на таб
function handleWeekButtonClick(week) {
  if (activeButton) {
    activeButton.classList.remove("active");
  }

  var selectedButton = document.getElementById("week" + week);
  selectedButton.classList.add("active");

  activeButton = selectedButton;

  showWinners(week);
}
