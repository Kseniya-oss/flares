// мозг всей штуки
class VideoApp {
    constructor() {
        this.backend = new MockBackend(); // создаём экземпляр класса, там тусит массив всех видео
        this.uiManager = new UIManager(); // тож экземпляр, работа управления интерфейсом
        this.init(); // инициализается, прописывется далее
    }

    init() {
        this.uiManager.initUploadHandlers((file) => { // вызываем метод класса
            this.handleVideoUpload(file); // передаём туда стрклочную функцию, котора реагирует на выбор файла
        })
        this.setupVideoPlayer(); // метод для доп. настроек функций видеоплеера
    }

    async handleVideoUpload(file) { // метод, координирующий всю загрузку видео
        if (!file || !file.type.startsWith('video/')) { // если нет файла или не видео, то ошибка
            this.uiManager.showMessage('Пожалуйста, выберите видео файл!', 'error');
            return // выход из функции если файл не подходит
        }
        try { // если все ок, то выполняем этот код, но если будет ошибка перехватим
            this.uiManager.showProgress(); // показываем полосу загрузки
            this.simulateUploadProgress(); // тут анимация прогресса
            const videoData = await this.backend.uploadVideoFile(file); // отдаём файл в метод, ждём пока метод вернёт всю инфу о видео

            this.uiManager.displayVideo(videoData.url);
            this.uiManager.hideProgress();

            this.uiManager.showMessage('Видео успешно загружено!', 'success');
    } catch (error) {
        this.uiManager.hideProgress();
        this.uiManager.showMessage('Ошибка при загрузке видео: ' + error.message, 'error')
        }
    }

    simulateUploadProgress() { // метод имитации прогресса загрузки
        let progress = 0; // переменная прогресса
        const interval = setInterval(() => { // setInterval - функия, изменяющая что то интревально
            progress += 8;
            this.uiManager.updateProgress(progress); // ну передаем эту штуку в метод, который визуально меняет
            if (progress >= 100) {
                clearInterval(interval); // отсанавливаем интервал
            }
        }, 60);
    }

    setupVideoPlayer() { // метод доп. настроек видео-плеера
        const videoElement = this.uiManager.getVideoElement(); // передаём доступ к видео-плееру
        videoElement.addEventListener('loadeddata', () => { // loadeddata - видео загрузило достатчно данных, чтобы показать первый кадр и начать восп.
            console.log('Видео готово к воспроизведению');
        });
        videoElement.addEventListener('error', () => {
            this.uiManager.showMessage('Ошибка воспроизведения видео', 'error');
        });
    }

    getCurrentVideo() { // метод получения текущего видео
        return this.backend.getCurrentVideo();
    }

    cleanup() { // метод освобождает пямать когда прила закрывается
        this.backend.videos.forEach((videoData, videoId) => { // forEach - сделай для каждого эелемента массива с таким значением-ключём
            if (videoData && videoData.url) { // && - И
                URL.revokeObjectURL(videoData.url); // revokeObjectURL - удадить всеее
            }
        });
        this.backend.videos.clear(); // ощищаем массив
        this.backend.CurrentVideoId = null;
    }
}
let videoApp;
document.addEventListener('DOMContentLoaded', () => { // когда страница HTML полностью загрузиться...
    videoApp = new VideoApp(); // то создаем экземпляр
});
