// работа с интерфейсом
class UIManager {
    constructor() {
        this.videoPlayer = document.getElementById('videoPlayer'); // получает айди документа; запонинаем где видео-плеер
        this.uploadArea = document.getElementById('uploadArea'); // запоминаем куда бросать файлы
        this.fileInput = document.getElementById('fileInput'); // запоминаем кнопку выбора файла
        this.videoInfo = document.getElementById('videoInfo'); // запоминаем где будем показывать инфу о видео
        this.progressBar = document.getElementById('progressBar'); // запоминаем полосу прогресса
        };

    initUploadHandlers(onFileSelect) { // метод для настройки обработчиков загрузки
        this.fileInput.addEventListener('change', (event) => { // когда пользователь выберет следующее, то делай это...event; change - значение изменилось
            onFileSelect(event.target.files[0]); // когда событие происходит, то передаем функции первый файл
        });
        this.uploadArea.addEventListener('click', () => {
            this.fileInput.click()
        });
        this.uploadArea.addEventListener('dragover', (e) => { // dragover - когда что то перетаскивают над элементом, для файлов
            e.preventDefault(); // отменяем стандартное поведение браузера, НЕ откроет файл
            this.uploadArea.classList.add('dragover'); // добавляем класс к элементу с классом uploadArea
        });
        this.uploadArea.addEventListener('dragleave', (e) => { // dragleave - когда перетаскиваемый объект вышел из элемента
            e.preventDefault();
            this.uploadArea.classList.remove('dragover'); // 1 случай
        });
        this.uploadArea.addEventListener('drop', (e) => { // drop - когда пользователь бросил файл в зону загрузки
            e.preventDefault();
            this.uploadArea.classList.remove('dragover'); // тож отменяем, просто 2 случай
            if (e.dataTransfer.files.length > 0) { // dataTransfer - объект, который хранит данные о пететаскивании, проверяем что файл ряльно есть
                onFileSelect(e.dataTransfer.files[0]);
            }
        });
    }

    displayVideo(videoUrl) { // метод, который вставляет видео в плеер
        this.videoPlayer.src = videoUrl; // заполняем сслыку на видео
        this.videoPlayer.load(); // теперь мы можем его загрузить
    }

    showProgress() { // метод показа прогресс-бара
        this.progressBar.style.display = 'block'; // делаем её видимой

    }

    hideProgress() { // метод скрытия прогресс-бара
        this.progressBar.style.display = 'none';
    }

    updateProgress(percent) { // метод обновления прогресса
        const progressElement = this.progressBar.querySelector('.progress'); // находим класс progress внутри progressBar
        if (progressElement) {
            progressElement.style.width = percent + '%';
        }
    }

    showMessage(message, type = 'info') { // метод, показываюший всплывающие сообщения
        alert(message) // стандартное браузерное окно
    }
    getVideoElement() { // метод для полного контроля над видео
        return this.videoPlayer; // просто возвращает видео-плеер
    }
}
