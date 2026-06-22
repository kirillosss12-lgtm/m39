// Константы конфигурации API
const API_URL = 'https://api.thecatapi.com/v1/images/search?limit=10';

// Поиск DOM-элементов
const loadButton = document.getElementById('load-btn');
const galleryContainer = document.getElementById('image-gallery');
const loaderElement = document.getElementById('page-loader');
const errorBoxElement = document.getElementById('error-box');

/**
 * Очищает прошлые ошибки экрана
 */
const resetStatusMessages = () => {
  errorBoxElement.textContent = '';
  errorBoxElement.classList.add('error-message_hidden');
};

/**
 * Переключает видимость лоадера и состояние кнопки
 * @param {boolean} isLoading
 */
const toggleLoadingState = (isLoading) => {
  if (isLoading) {
    loaderElement.classList.remove('loader_hidden');
    loadButton.disabled = true;
  } else {
    loaderElement.classList.add('loader_hidden');
    loadButton.disabled = false;
  }
};

/**
 * Отрисовывает полученный массив картинок в галерею
 * @param {Array} imagesList
 */
const renderGallery = (imagesList) => {
  // Очищаем галерею перед новой загрузкой
  galleryContainer.innerHTML = '';

  imagesList.forEach((imageData) => {
    const imgElement = document.createElement('img');
    imgElement.src = imageData.url;
    imgElement.alt = 'Случайное фото котика';
    imgElement.classList.add('gallery__item');
    galleryContainer.appendChild(imgElement);
  });
};

/**
 * Основная функция асинхронного запроса к серверу
 */
const fetchImagesData = async () => {
  resetStatusMessages();
  toggleLoadingState(true);

  try {
    const response = await fetch(API_URL);

    // Проверяем успешность HTTP-статуса (200-299)
    if (!response.ok) {
      throw new Error(`Ошибка сервера: ${response.status}`);
    }

    const data = await response.json();
    renderGallery(data);

  } catch (error) {
    // Выводим понятную ошибку пользователю в интерфейс
    errorBoxElement.textContent = `Не удалось загрузить изображения. Причина: ${error.message}`;
    errorBoxElement.classList.remove('error-message_hidden');
    console.error('Детали ошибки:', error);
  } finally {
    // Лоадер отключается всегда (и при успехе, и при ошибке)
    toggleLoadingState(false);
  }
};

// Навешивание обработчика событий
loadButton.addEventListener('click', (event) => {
  event.preventDefault();
  fetchImagesData();
});