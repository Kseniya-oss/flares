// класс для работы с данными и сервером
class MockBackend {
    constructor() { // специальный метод класса, который автоматически вызывается при создании экземпляра класса
        this.videos = new Map(); // создает словарь где будет хранить все загруженные видео
        this.CurrentVideoId = null; // переменная для текущего видео
    }
    // функция, которая возвращает промис с айди видюхи и добавляет в словарь всю нужную инфу о видео
    async uploadVideoFile(file) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const videoId = 'video_' + Date.now();
            const videoData = {
                id: videoId,
                file: file,
                name: file.name,
                size: file.size,
                type: file.type,
                url: URL.createObjectURL(file)
            };
            this.videos.set(videoId, videoData);
            this.CurrentVideoId = videoId;
            resolve(videoData);
        }, 1000);
    });
}
    // функция, которая возвращает последнее добавленное видео
    getCurrentVideo() {
        return this.videos.get(this.CurrentVideoId)
    }
}
